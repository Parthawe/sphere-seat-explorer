import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const origin=process.argv[2]??'http://localhost:5190',browser=await chromium.launch({args:process.platform==='darwin'?['--use-angle=metal']:[]});
try{
 for(const [width,theme] of [[320,'light'],[390,'dark'],[768,'light'],[1440,'dark']]){
  const page=await browser.newPage({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>localStorage.setItem('usage-consent-v1','deny'));
  await page.goto(origin+'/?season=2027');await page.locator('#hero-race-choice').selectOption('bahrain');
  const preview=page.locator('.race-3d-preview'),camera=page.getByRole('group',{name:'3D preview camera'});
  await preview.locator('canvas[data-model-ready=true]').waitFor({timeout:90000});await preview.evaluate(el=>el.querySelector('canvas').dataset.retainedCanvas='yes');
  for(const mode of ['Seat','Overview']){
   const button=camera.getByRole('button',{name:mode,exact:true});await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true');
   await preview.locator('canvas[data-model-ready=true]').waitFor();assert.equal(await preview.locator('canvas').getAttribute('data-retained-canvas'),'yes');
   const href=await preview.locator('.race-3d-preview-link').getAttribute('href');assert.equal(new URL(href,origin).searchParams.get('camera'),mode==='Seat'?'seat':'circuit');
   await page.keyboard.press('Tab');await button.focus();assert.notEqual(await button.evaluate(el=>getComputedStyle(el).outlineStyle),'none');
   for(const control of await camera.getByRole('button').all())assert(await control.evaluate(el=>{const r=el.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth;}));
  }
  await camera.getByRole('button',{name:'Seat',exact:true}).click();await page.getByRole('button',{name:'Explore 3D',exact:true}).click();
  await page.locator('.circuit-model-stage[data-immersive=true] canvas[data-model-ready=true]').waitFor({timeout:90000});assert.equal(new URL(page.url()).searchParams.get('camera'),'seat');
  await page.goBack();await preview.waitFor();await page.locator('#hero-race-choice').selectOption('bahrain');await preview.locator('canvas[data-model-ready=true]').waitFor({timeout:90000});await camera.getByRole('button',{name:'Seat',exact:true}).click();
  await preview.locator('.race-3d-preview-link').click();await page.locator('.circuit-model-stage[data-immersive=true] canvas[data-model-ready=true]').waitFor({timeout:90000});assert.equal(new URL(page.url()).searchParams.get('camera'),'seat');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);console.log(`${width}px ${theme}: camera selection, retained canvas, focus, hit targets and matching primary/preview entry passed`);await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'no-preference'});await page.goto(origin+'/?season=2027');await page.locator('#hero-race-choice').selectOption('bahrain');const preview=page.locator('.race-3d-preview');await preview.locator('canvas[data-model-ready=true]').waitFor({timeout:90000});
 await page.getByRole('group',{name:'3D preview camera'}).getByRole('button',{name:'Seat',exact:true}).click();await preview.locator('canvas[data-model-ready=moving]').waitFor();await preview.locator('canvas[data-model-ready=true]').waitFor({timeout:5000});
 await page.locator('#hero-race-choice').selectOption('japan');await page.locator('.race-3d-preview[data-preview-ready=true]').waitFor({timeout:90000});assert.equal(await page.getByRole('group',{name:'3D preview camera'}).count(),0);assert(!new URL(await page.locator('.race-3d-preview-link').getAttribute('href'),origin).searchParams.has('camera'));
 await page.locator('#hero-race-choice').selectOption('las-vegas');await page.locator('.race-3d-preview[data-preview-ready=true]').waitFor({timeout:90000});await page.getByRole('group',{name:'3D preview camera'}).getByRole('button',{name:'Seat',exact:true}).click();const vegas=new URL(await page.locator('.race-3d-preview-link').getAttribute('href'),origin);assert.equal(vegas.searchParams.get('view'),'seat');assert.equal(vegas.searchParams.get('screen'),'seats');
 console.log('Animated camera arrival, outline-only limits and Vegas view link passed');await page.close();
}finally{await browser.close();}
