import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const origin=process.argv[2]??'http://localhost:5190';
const browser=await chromium.launch({args:process.platform==='darwin'?['--use-angle=metal']:[]});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>localStorage.setItem('usage-consent-v1','deny'));
 await page.goto(origin+'/?season=2027');
 for(const [race,season] of [['qatar',2026],['bahrain',2027],['united-arab-emirates',2026],['australia',2027],['china',2026],['miami',2027],['canada',2027],['great-britain',2027],['belgium',2027],['italy',2027]]){
  await page.goto(origin+'/?season='+season);
  await page.locator('#hero-race-choice').selectOption(race);
  const preview=page.locator('.race-3d-preview');await preview.locator('canvas[data-model-ready=true]').waitFor({timeout:90000});await page.waitForFunction(()=>document.querySelector('.race-3d-preview')?.getAttribute('data-preview-ready')==='true');
  assert.equal(await preview.locator('canvas').getAttribute('data-car-count'),'16');assert.equal(await preview.locator('canvas').getAttribute('data-cars-playing'),'false');
  assert.equal(await preview.locator('canvas').getAttribute('data-surface-shaders'),'ready');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));console.log(race+': preview ready, shaders active, reduced motion honored, no horizontal overflow');
 }
 await page.locator('#hero-race-choice').selectOption('bahrain');await page.waitForFunction(()=>document.querySelector('.race-3d-preview')?.getAttribute('data-preview-ready')==='true');
 await page.getByRole('group',{name:'3D preview camera'}).getByRole('button',{name:'Seat',exact:true}).click();
 await page.emulateMedia({reducedMotion:'no-preference'});
 const play=page.getByRole('button',{name:'Play preview cars',exact:true});await play.click();
 await page.waitForFunction(()=>document.querySelector('.race-3d-preview canvas')?.getAttribute('data-cars-playing')==='true');
 await page.getByRole('button',{name:'Pause preview cars',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.race-3d-preview canvas')?.getAttribute('data-cars-playing')==='false');
 for(const width of [320,768,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Explore 3D',exact:true}).click();await page.locator('.circuit-model-stage[data-immersive=true] canvas[data-model-ready=true]').waitFor({timeout:90000});
 await page.getByRole('button',{name:'Seated view',exact:true}).click();await page.locator('canvas[data-model-ready=true]').waitFor({timeout:90000});
 await page.getByRole('button',{name:'Exit expanded 3D',exact:true}).click();assert.equal(await page.evaluate(()=>document.body.style.position),'');
 const download=await page.request.get(origin+'/data/venue-context.json');assert.equal(download.status(),200);assert.equal(Object.keys((await download.json()).venues).length,3);
 assert.deepEqual(errors,[]);console.log('Play/pause, 320/768/1440 fit, expanded explorer entry, seat camera, exit and public provenance download passed');
}finally{await browser.close();}
