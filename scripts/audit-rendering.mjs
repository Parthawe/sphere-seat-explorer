import {chromium} from 'playwright';import assert from 'node:assert/strict';
const origin=process.argv[2]??'http://localhost:5188',label=process.env.F1_RENDER_LABEL??'after',browser=await chromium.launch({args:process.platform==='darwin'?['--use-angle=metal']:[]});
try{for(const [race,season,stage] of [['qatar',2026,'.circuit-model-stage'],['bahrain',2027,'.circuit-model-stage'],['australia',2027,'.circuit-model-stage'],['las-vegas',2026,'.scene-area']])for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:1000},hasTouch:width===390,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/shader|WebGLProgram|GL_INVALID|THREE\./i.test(m.text()))errors.push(m.text());});await page.addInitScript(()=>localStorage.setItem('usage-consent-v1','deny'));
 await page.goto(`${origin}/?season=${season}&race=${race}&screen=${race==='las-vegas'?'seats&view=seat':'circuit&camera=seat'}&immersive=1`);
 const scene=page.locator(stage);await scene.locator('canvas').waitFor({timeout:90000});await page.waitForFunction(()=>{const c=document.querySelector('canvas');return c?.dataset.environmentReflections==='ready'&&(c.dataset.modelReady==='true'||c.dataset.cameraState==='ready');},{timeout:90000});await scene.locator('.scene-loading,.circuit-model-loading').waitFor({state:'hidden',timeout:90000});
 if(label!=='before')await page.waitForFunction(()=>document.querySelector('canvas')?.dataset.environmentSource==='outdoor-hdr',{timeout:90000});
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await scene.screenshot({path:`/tmp/f1-render-${label}-${race}-${width}.png`});assert.deepEqual(errors,[]);console.log(`${label} ${race} ${width}: rendered with no shader/runtime errors`);await page.close();
}}finally{await browser.close();}
