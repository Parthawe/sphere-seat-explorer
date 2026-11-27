import assert from 'node:assert/strict';
import {chromium} from 'playwright';

// Run against a local preview: node scripts/audit-seat-controls.mjs http://localhost:5188
const origin=process.argv[2]??'http://localhost:5188';
const browser=await chromium.launch({args:process.platform==='darwin'?['--use-angle=metal']:[]});
const errors=[];
try {
 for(const width of [1440,390,320]) {
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  page.on('pageerror',error=>errors.push(String(error)));
  await page.goto(`${origin}/?season=2026&race=qatar&screen=circuit&camera=seat`);
  await page.locator('.circuit-model-stage canvas[data-geometry-ready=true]').waitFor({timeout:60000});
  await page.getByRole('button',{name:'Choose model position',exact:true}).click();
  const dialog=page.locator('.circuit-grid-dialog');
  await page.getByRole('combobox',{name:'Grid model section',exact:true}).selectOption('2');
  assert.equal(new URL(page.url()).searchParams.get('section'),'2');
  const row=page.getByRole('spinbutton',{name:'Grid model row',exact:true});
  const position=page.getByRole('spinbutton',{name:'Grid position',exact:true});
  await row.fill('');assert.equal(await row.inputValue(),'');
  await row.fill('12');await position.fill('30');await position.press('Enter');
  assert.equal(new URL(page.url()).searchParams.get('position'),'30');
  await position.fill('9999');await position.press('Tab');
  assert.equal(await position.inputValue(),await position.getAttribute('max'));
  await position.fill('30');await position.press('Tab');
  await page.getByRole('button',{name:'View this position in 3D',exact:true}).click();
  assert.equal(await dialog.isVisible(),false);
  const mainRow=page.getByRole('spinbutton',{name:'Model row',exact:true});
  assert.ok(await mainRow.evaluate(el=>Boolean(el.compareDocumentPosition(document.getElementById('selected-model-media'))&Node.DOCUMENT_POSITION_FOLLOWING)));
  await mainRow.fill('');await mainRow.press('Tab');assert.equal(await mainRow.inputValue(),'12');
  await mainRow.fill('5');await page.getByRole('button',{name:'View position',exact:true}).click();
  assert.equal(new URL(page.url()).searchParams.get('modelRow'),'5');
  assert.equal(new URL(page.url()).searchParams.get('camera'),'seat');
  await page.waitForFunction(()=>document.activeElement.className==='circuit-model-canvas');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.getByRole('button',{name:'Choose model position',exact:true}).click();
  await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);
  console.log(`Seat selection, incomplete edits, bounds, view handoff and layout passed at ${width}px`);
  await page.close();
 }
 assert.deepEqual(errors,[]);
} finally {await browser.close();}
