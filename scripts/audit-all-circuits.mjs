import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright';
const origin=process.argv[2]??'http://localhost:5188';
const editions=Object.entries(JSON.parse(readFileSync(new URL('../src/calendarIndex.json',import.meta.url),'utf8')));
const browser=await chromium.launch({args:process.platform==='darwin'?['--use-angle=metal']:[]}),results=process.env.F1_AUDIT_RESUME?JSON.parse(readFileSync('/tmp/f1-all-circuits-audit.json','utf8')):[];
try{
 for(const [key,entry] of editions){
  if(results.some(r=>r.edition===key))continue;
  const [season,race]=key.split(':'),screen=entry.model?'circuit':race==='las-vegas'?'vegas':'track-study';
  const page=await browser.newPage({viewport:{width:390,height:850},reducedMotion:'reduce',isMobile:true,hasTouch:true}),errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  await page.goto(`${origin}/?season=${season}&race=${race}&screen=${screen}`);
  if(screen==='circuit'){
   await page.locator('canvas[data-geometry-ready=true][data-model-ready=true]').waitFor({timeout:60000});
   await page.getByRole('button',{name:'View position',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.modelReady==='true');
   await page.getByRole('button',{name:'Zoom in on seated view',exact:true}).click();
   const fov=await page.locator('canvas').getAttribute('data-seat-fov');assert.ok(Number(fov)<90,key+' seated zoom');
   await page.getByRole('button',{name:'Full circuit',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.modelReady==='true');
  }else if(screen==='track-study'){
   await page.locator('[data-study-ready=true]').waitFor({timeout:60000});
   await page.getByRole('button',{name:'Overhead circuit',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.studyCamera==='top');
   await page.getByRole('button',{name:'Orbit circuit',exact:true}).click();
   await page.getByRole('button',{name:'Zoom in study',exact:true}).click();
   await page.getByRole('button',{name:'Reset study camera',exact:true}).click();
   await page.getByRole('button',{name:'Show passing cars',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.carsPlaying==='true');
   await page.getByRole('button',{name:'Pause cars',exact:true}).click();
  }else{
   await page.getByRole('button',{name:'Open full circuit in 3D',exact:true}).click();
   await page.locator('canvas').first().waitFor({timeout:60000});
   await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.environmentReflections==='ready',{timeout:60000});
  }
  const dimensions=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(dimensions.scroll<=dimensions.width+1,key+' horizontal overflow');assert.deepEqual(errors,[],key+' runtime errors');
  if(process.env.F1_CIRCUIT_SCREENSHOTS&&(['bahrain','japan','belgium','united-arab-emirates','miami','australia','china','italy','great-britain','canada','qatar','las-vegas'].includes(race)))await page.screenshot({path:`${process.env.F1_CIRCUIT_SCREENSHOTS}/circuit-${season}-${race}-390.png`});
  results.push({edition:key,screen,status:'passed'});console.log(JSON.stringify(results.at(-1)));writeFileSync('/tmp/f1-all-circuits-audit.json',JSON.stringify(results,null,2));await page.close();
 }
 writeFileSync('/tmp/f1-all-circuits-audit.json',JSON.stringify(results,null,2));
 assert.equal(results.length,47);console.log('All 47 edition routes passed.');
}finally{await browser.close();}
