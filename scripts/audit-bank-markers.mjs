import assert from 'node:assert/strict';
import {chromium} from 'playwright';
// Run against local Vite; the loading check holds its lazy scene module.
const origin=process.argv[2]??'http://localhost:5188';
const browser=await chromium.launch({args:process.platform==='darwin'?['--use-angle=metal']:[]});
const errors=[];
try {
 for(const [race,season,width] of [['qatar',2026,1440],['qatar',2026,820],['qatar',2026,390],['qatar',2026,320],['italy',2027,1440],['italy',2027,390],['australia',2027,390]]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  page.on('pageerror',error=>errors.push(String(error)));
  let release=()=>{};
  if(race==='qatar'&&width===1440){
   const gate=new Promise(resolve=>{release=resolve;});
   await page.route('**/src/CircuitSeatingScene.tsx*',async route=>{await gate;await route.continue();});
  }
  await page.goto(`${origin}/?season=${season}&race=${race}&screen=circuit`);
  if(race==='qatar'&&width===1440){
   await page.getByRole('status').filter({hasText:'Loading 3D view'}).waitFor();
   await page.waitForFunction(()=>document.querySelector('.circuit-loading-poster')?.naturalWidth>0);
   assert.ok((await page.locator('.circuit-loading-poster').getAttribute('src')).includes('model-2026-qatar'));
   if(process.env.F1_MARKER_SCREENSHOTS)await page.locator('.circuit-model-stage').screenshot({path:`${process.env.F1_MARKER_SCREENSHOTS}/bank-loading-poster.png`});
   release();
  }
  await page.locator('canvas[data-geometry-ready=true]').waitFor({timeout:60000});
  await page.waitForFunction(()=>Number(document.querySelector('.circuit-bank-markers')?.dataset.visibleMarkers)>0);
  const layer=page.locator('.circuit-bank-markers');
  if(process.env.F1_MARKER_SCREENSHOTS)await page.locator('.circuit-model-stage').screenshot({path:`${process.env.F1_MARKER_SCREENSHOTS}/bank-markers-${race}-${width}.png`});
  const markers=layer.locator('button:not([hidden])');
  const boxes=await markers.evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom};}));
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
   const a=boxes[i],b=boxes[j];assert.ok(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y);
  }
  if(race==='qatar'&&width===1440){
   await page.getByRole('button',{name:'Show passing cars',exact:true}).click();
   const focused=markers.first(),index=await focused.getAttribute('data-bank-marker');await focused.focus();
   await page.waitForTimeout(250);
   assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('data-bank-marker')),index);
   await page.getByRole('button',{name:'Pause cars',exact:true}).click();
  }
  const singles=layer.locator('button[data-cluster=false]:not([hidden])');
  if(await singles.count()){
   const marker=singles.first(),index=Number(await marker.getAttribute('data-members'));
   const bank=await page.locator('#model-bank option').nth(index).getAttribute('value');
   await marker.click();await page.waitForFunction(()=>new URL(location.href).searchParams.get('camera')==='stand');
   assert.equal(new URL(page.url()).searchParams.get('bank'),bank);
   await page.waitForFunction(()=>document.activeElement.className==='circuit-model-canvas');
   await page.getByRole('button',{name:'Full circuit',exact:true}).click();
   await page.waitForFunction(()=>Number(document.querySelector('.circuit-bank-markers')?.dataset.visibleMarkers)>0);
  }
  const clusters=layer.locator('button[data-cluster=true]:not([hidden])');
  if(await clusters.count()){
   const count=(await clusters.first().getAttribute('data-members')).split(',').length;
   await clusters.first().click();const dialog=page.locator('.circuit-overview-dialog');
   await dialog.waitFor({state:'visible'});
   assert.equal(await dialog.locator('.circuit-overview-banks button[aria-pressed]').count(),count);
   await dialog.getByRole('button',{name:/Show all \d+ banks/}).click();
   assert.equal(await dialog.locator('.circuit-overview-banks button[aria-pressed]').count(),await page.locator('#model-bank option').count());
   await page.waitForFunction(()=>Boolean(document.activeElement.closest('.circuit-overview-banks'))&&document.activeElement.getAttribute('aria-pressed')==='true');
   await dialog.locator('.circuit-overview-banks button[aria-pressed]').first().click();
   await dialog.getByRole('button',{name:'Return to selected view',exact:true}).click();
   await page.waitForFunction(()=>document.activeElement.className==='circuit-model-canvas');
   assert.equal(new URL(page.url()).searchParams.get('camera'),'stand');
  }else if(race==='italy')assert.fail('Dense Monza overview needs grouped markers');
  await page.getByRole('button',{name:'Open circuit map',exact:true}).click();
  const dialog=page.locator('.circuit-overview-dialog');await dialog.waitFor({state:'visible'});
  assert.equal(await dialog.locator('.circuit-overview-banks button[aria-pressed]').count(),await page.locator('#model-bank option').count());
  await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement.className==='circuit-model-canvas');
  if(race==='qatar'&&(width===1440||width===390)){
   const selected=new URL(page.url()).search;
   await page.locator('.circuit-model-stage canvas').evaluate(canvas=>canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
   await page.getByRole('heading',{name:'3D view unavailable',exact:true}).waitFor();
   await page.waitForFunction(()=>document.querySelector('.circuit-loading-poster')?.naturalWidth>0);
   if(process.env.F1_MARKER_SCREENSHOTS)await page.locator('.circuit-model-stage').screenshot({path:`${process.env.F1_MARKER_SCREENSHOTS}/bank-fallback-${width}.png`});
   await page.getByRole('button',{name:'Retry 3D',exact:true}).click();
   await page.locator('canvas[data-geometry-ready=true]').waitFor({timeout:60000});
   assert.equal(new URL(page.url()).search,selected);
  }
  const toolbar=await page.locator('.circuit-scene-actions button').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return{x:r.x,right:r.right,y:r.y,bottom:r.bottom};}));
  for(let i=0;i<toolbar.length;i++)for(let j=i+1;j<toolbar.length;j++){
   const a=toolbar[i],b=toolbar[j];assert.ok(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y);
  }
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  console.log(`Projected markers, grouping, stand handoff, full map, focus and toolbar passed: ${race} ${season} / ${width}px`);
  await page.close();
 }
 assert.deepEqual(errors,[]);
} finally {await browser.close();}
