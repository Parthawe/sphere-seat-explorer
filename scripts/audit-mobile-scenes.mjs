import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {chromium} from 'playwright';
const origin=process.argv[2]??'http://localhost:5188',index=JSON.parse(readFileSync('src/calendarIndex.json','utf8')),browser=await chromium.launch({args:process.platform==='darwin'?['--use-angle=metal']:[]});
try{
 for(const [edition,entry] of Object.entries(index).filter(([,entry])=>entry.model))for(const [width,height] of [[390,844],[844,390]]){
  const [season,race]=edition.split(':'),page=await browser.newPage({viewport:{width,height},hasTouch:true,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>localStorage.setItem('usage-consent-v1','deny'));
  await page.goto(`${origin}/?season=${season}&race=${race}&screen=circuit&camera=seat`);await page.locator('canvas[data-geometry-ready=true][data-model-ready=true]').waitFor({timeout:90000});
  const longest=await page.locator('#model-bank option').evaluateAll(els=>els.reduce((a,b)=>a.textContent.length>=b.textContent.length?a:b).value);await page.locator('#model-bank').selectOption(longest);await page.getByRole('button',{name:/^(Seated|Standing) view$/}).click();await page.locator('canvas[data-model-ready=true]').waitFor();
  for(const expanded of [false,true]){
   if(expanded)await page.getByRole('button',{name:'Expand 3D',exact:true}).click();
   if(height<500&&!expanded)assert.ok(await page.locator('.circuit-model-stage').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight+1),'Complete landscape scene stays in viewport');
   const issues=await page.locator('.circuit-model-stage').evaluate(stage=>[...stage.querySelectorAll('button')].filter(e=>!e.closest('[hidden]')&&e.getClientRects().length&&!e.disabled).flatMap(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return r.y<0||r.bottom>innerHeight+1||r.x<0||r.right>innerWidth+1||r.width<43||r.height<43||!e.contains(hit)?[{name:e.getAttribute('aria-label')||e.textContent.trim(),rect:r.toJSON(),hit:hit?.tagName}]:[];}));
   assert.deepEqual(issues,[],`${edition} ${width} expanded=${expanded}: all scene controls visible and clickable`);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   if(expanded)await page.getByRole('button',{name:'Exit expanded 3D',exact:true}).click();
  }
  await page.screenshot({path:`/tmp/f1-mobile-circuits/seat-${season}-${race}-${width}.png`});assert.deepEqual(errors,[]);console.log(`${edition} ${width}×${height}: longest bank, seat view, 44px controls, hit targets, expand/exit and fit passed`);await page.close();
 }
}finally{await browser.close();}
