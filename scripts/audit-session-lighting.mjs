import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const origin=process.argv[2]??'http://127.0.0.1:5190';
const browser=await chromium.launch({args:process.platform==='darwin'?['--use-angle=metal']:[]});
try{
 for(const [width,height] of [[320,740],[390,844],[844,390],[1440,900]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<1000,reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/shader|WebGLProgram|THREE\./i.test(m.text()))errors.push(m.text());});
  await page.addInitScript(()=>localStorage.setItem('usage-consent-v1','deny'));
  await page.goto(`${origin}/?season=2026&race=united-arab-emirates&screen=circuit&camera=seat&session=p1&modelRow=7&position=9`);
  await page.locator('canvas[data-model-ready=true][data-race-light=day]').waitFor({timeout:90000});
  const canvas=await page.locator('canvas').elementHandle(),initial=new URL(page.url());
  for(const [session,light,time] of [['q','night','18:00'],['r','dusk','17:00'],['p1','day','13:30'],['q','night','18:00'],['p1','day','13:30']]){
   const select=page.getByLabel('Session lighting');
   assert(await select.evaluate(e=>{const r=e.getBoundingClientRect();return r.height>=44&&r.left>=0&&r.right<=innerWidth&&e===document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);}), 'Session selector is a visible 44px hit target');
   await select.selectOption(session);await page.locator(`canvas[data-race-light=${light}]`).waitFor();
   await page.waitForFunction(expected=>new URL(location.href).searchParams.get('session')===expected,session==='r'?null:session);
   assert(await canvas.evaluate(el=>el===document.querySelector('canvas')), 'Session change retains the renderer');
   for(const key of ['bank','section','modelRow','position','camera'])assert.equal(new URL(page.url()).searchParams.get(key),initial.searchParams.get(key));
   assert.match(await page.locator('.circuit-model-heading .race-light-notice').innerText(),new RegExp(time));
   assert.equal(await page.locator('.circuit-model-fallback').count(),0);
  }
  await page.reload();await page.locator('canvas[data-model-ready=true][data-race-light=day]').waitFor({timeout:90000});assert.equal(await page.getByLabel('Session lighting').inputValue(),'p1');
  await page.screenshot({path:`/tmp/f1-session-lighting-${width}.png`});assert.deepEqual(errors,[]);console.log(`${width}×${height}: repeated day/night/dusk, retained renderer/seat, URL reload, hit target and shader health passed`);await page.close();
 }
 const page=await browser.newPage({reducedMotion:'reduce'});await page.goto(`${origin}/?season=2027&race=bahrain&screen=circuit&session=p1`);await page.locator('canvas[data-model-ready=true]').waitFor({timeout:90000});assert.equal(await page.getByLabel('Session lighting').count(),0);assert.match(await page.locator('.circuit-model-heading .race-light-notice').innerText(),/Time TBC/);assert.equal(new URL(page.url()).searchParams.has('session'),false);console.log('Untimed 2027 event retains a study label and removes unsupported session');await page.close();
}finally{await browser.close();}
