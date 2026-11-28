import assert from 'node:assert/strict';import {chromium} from 'playwright';
const origin=process.argv[2]??'http://127.0.0.1:5190',browser=await chromium.launch({args:process.platform==='darwin'?['--use-angle=metal']:[]});
try{for(const [race,season,state,ready] of [['bahrain',2027,'modelReady','true'],['las-vegas',2026,'cameraState','ready']]){
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>localStorage.setItem('usage-consent-v1','deny'));await page.goto(`${origin}/?season=${season}&race=${race}&screen=${race==='las-vegas'?'seats&view=circuit':'circuit&camera=circuit'}`);
 const canvas=page.locator('canvas').first();await page.waitForFunction(({state,ready})=>document.querySelector('canvas')?.dataset[state]===ready,{state,ready},{timeout:90000});
 const box=await canvas.boundingBox();await page.mouse.dblclick(box.x+box.width*.5,box.y+box.height*.65,{delay:90});
 await page.waitForFunction(()=>Number(document.querySelector('canvas')?.dataset.focusCount)>0,{},{timeout:5000});
 // Both renderers use the same seconds-based helper; this must finish in under two seconds.
 await page.waitForFunction(({state,ready})=>document.querySelector('canvas')?.dataset[state]===ready,{state,ready},{timeout:1800});assert.deepEqual(errors,[]);console.log(`${race}: animated double-tap focused existing geometry and completed within 1.8 seconds`);await page.close();
}}finally{await browser.close();}
