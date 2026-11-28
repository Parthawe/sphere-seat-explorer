import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const origin=process.argv[2]??'http://localhost:5188';
const browser=await chromium.launch({args:process.platform==='darwin'?['--use-angle=metal']:[]});
try{
 for(const size of [{width:1440,height:1000},{width:390,height:844},{width:844,height:390}]){
  for(const [name,url,selector] of [
   ['Brazil','?season=2027&race=brazil&screen=track-study','.study-stage'],
   ['Diagram','?season=2027&race=brazil&screen=layout','.layout-stage'],
   ['Qatar','?season=2026&race=qatar&screen=circuit','.circuit-model-stage'],
   ['Vegas','?season=2026&race=las-vegas&screen=seats&view=circuit','.scene-area'],
   ['Earth','?season=2027','.earth-journey']
  ]){
   const page=await browser.newPage({viewport:size,reducedMotion:'reduce',hasTouch:size.width<1000});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>localStorage.setItem('usage-consent-v1','declined'));
   await page.goto(origin+'/'+url);const stage=page.locator(selector),canvas=stage.locator('canvas');await canvas.waitFor({timeout:60000});await page.waitForTimeout(800);await canvas.evaluate(el=>el.dataset.keepCanvas='same');
   const enter=stage.getByRole('button',{name:'Expand 3D',exact:true});await enter.click();await page.waitForTimeout(500);
   assert.equal(await stage.getAttribute('data-immersive'),'true');const bounds=await stage.boundingBox();assert.ok(bounds.x===0&&bounds.y===0&&Math.abs(bounds.width-size.width)<2&&Math.abs(bounds.height-size.height)<2,JSON.stringify({name,size,bounds}));
   assert.equal(await canvas.getAttribute('data-keep-canvas'),'same');assert.equal(await page.evaluate(()=>document.body.style.position),'fixed');
   const exit=stage.getByRole('button',{name:'Exit expanded 3D',exact:true});assert.ok(await exit.isVisible());assert.ok(await exit.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),'Exit is not covered by page chrome');const eb=await exit.boundingBox();assert.ok(eb.x>=0&&eb.y>=0&&eb.x+eb.width<=size.width+1&&eb.y+eb.height<=size.height+1,'Exit reachable '+name+JSON.stringify(eb));
   await page.keyboard.press('Tab');assert.ok(await stage.evaluate(el=>el.contains(document.activeElement)),'Focus stays in scene');
   if(size.width===390||size.width===1440)await page.screenshot({path:`/tmp/f1-world-${name}-${size.width}.png`});
   await page.keyboard.press('Escape');await page.waitForTimeout(100);assert.equal(await stage.getAttribute('data-immersive'),null);assert.equal(await page.evaluate(()=>document.body.style.position),'');assert.equal(await page.locator('[inert]').count(),0);assert.ok(await enter.evaluate(el=>el===document.activeElement),'Focus returns to Expand');assert.deepEqual(errors,[]);
   console.log(name+' '+size.width+'×'+size.height+': expand, retained canvas, viewport, exit, keyboard and cleanup passed');await page.close();
  }
 }
}finally{await browser.close();}
