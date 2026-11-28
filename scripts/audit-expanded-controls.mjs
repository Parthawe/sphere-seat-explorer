import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const origin=process.argv[2]??'http://localhost:5190',browser=await chromium.launch({args:process.platform==='darwin'?['--use-angle=metal']:[]});
async function usable(dialog){
 await dialog.waitFor();assert.equal(await dialog.evaluate(el=>el.inert),false,'A modal must not be explicitly inert');
 assert.ok(await dialog.evaluate(el=>el.contains(document.activeElement)),'Modal receives keyboard focus');
 for(let i=0;i<4;i++){await dialog.page().keyboard.press('Tab');assert.ok(await dialog.evaluate(el=>el.contains(document.activeElement)),'Tab remains in modal');}
}
async function pinch(page,start,end){
 const cdp=await page.context().newCDPSession(page),y=400;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start[0],y,id:1},{x:start[1],y,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:end[0],y,id:1},{x:end[1],y,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
}
try{
 for(const [width,height,race,season] of [[390,844,'bahrain',2027],[1440,1000,'bahrain',2027],[844,390,'bahrain',2027],[320,844,'qatar',2026]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:true,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>localStorage.setItem('usage-consent-v1','deny'));
  await page.goto(origin+`/?season=${season}&race=${race}&screen=circuit&camera=seat&immersive=1`);
  await page.locator('.circuit-model-loading').waitFor({state:'hidden',timeout:90000});
  const stage=page.locator('.circuit-model-stage'),canvas=stage.locator('canvas');await canvas.evaluate(el=>el.dataset.retainedCanvas='yes');
  await stage.getByRole('button',{name:'Choose model position',exact:true}).click();const grid=page.locator('.circuit-grid-dialog');await usable(grid);
  const bank=grid.getByRole('combobox',{name:'Grid viewing bank'}),options=await bank.locator('option').evaluateAll(els=>els.map(el=>el.value));await bank.selectOption(options[1]);
  await grid.getByRole('spinbutton',{name:'Grid model row',exact:true}).fill('3');await grid.getByRole('spinbutton',{name:'Grid position',exact:true}).fill('5');await grid.getByRole('button',{name:'View this position in 3D',exact:true}).click();
  assert.equal(new URL(page.url()).searchParams.get('modelRow'),'3');assert.equal(new URL(page.url()).searchParams.get('position'),'5');assert.equal(new URL(page.url()).searchParams.get('camera'),'seat');assert.equal(new URL(page.url()).searchParams.get('immersive'),'1');
  await stage.getByRole('button',{name:'Open circuit map',exact:true}).click();const map=page.locator('.circuit-overview-dialog');await usable(map);await map.locator('.circuit-overview-banks button').last().click();assert.equal(await map.locator('button[aria-pressed=true]').count(),1);await map.getByRole('button',{name:'Return to selected view',exact:true}).click();
  await stage.getByRole('button',{name:'Photos & fan reports',exact:true}).click();const refs=page.locator('.spectator-dialog');await usable(refs);await refs.getByRole('combobox',{name:'Reference year',exact:true}).selectOption('2025');assert.equal(await refs.getByRole('combobox',{name:'Reference year',exact:true}).inputValue(),'2025');await page.keyboard.press('Escape');
  assert.equal(await stage.getAttribute('data-immersive'),'true','Escape closes the child modal first');
  await stage.getByRole('button',{name:'Choose model position',exact:true}).click();await page.keyboard.press('Escape');assert.equal(await grid.isVisible(),false);assert.equal(await stage.getAttribute('data-immersive'),'true');
  await stage.getByRole('button',{name:/^(Seated|Standing) view$/}).click();
  if(width===390){await pinch(page,[120,270],[75,315]);const closer=Number(await canvas.getAttribute('data-seat-fov'));assert(closer<90&&closer>=35);await pinch(page,[75,315],[120,270]);assert(Number(await canvas.getAttribute('data-seat-fov'))>closer);await page.screenshot({path:'/tmp/f1-fixed-expanded-seat-phone.png'});}
  assert.equal(await canvas.getAttribute('data-retained-canvas'),'yes');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.keyboard.press('Escape');assert.equal(await stage.getAttribute('data-immersive'),null);assert.equal(await page.evaluate(()=>document.body.style.position),'');assert.equal(await page.locator('[inert]').count(),0);assert.deepEqual(errors,[]);
  console.log(`${race} ${width}×${height}: grid selection, map, reference filters, nested Escape, retained canvas and cleanup passed`);await page.close();
 }
 const vegas=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'}),errors=[];vegas.on('pageerror',e=>errors.push(e.message));await vegas.addInitScript(()=>localStorage.setItem('usage-consent-v1','deny'));await vegas.goto(origin+'/?season=2026&race=las-vegas&screen=seats&view=seat&immersive=1');
 await vegas.locator('.scene-loading').waitFor({state:'hidden',timeout:90000});await vegas.locator('.scene-area canvas').waitFor({timeout:90000});
 await vegas.getByRole('button',{name:'Photos & fan reports',exact:true}).click();await usable(vegas.locator('.spectator-dialog'));await vegas.getByRole('combobox',{name:'Reference location scope'}).selectOption('venue');await vegas.keyboard.press('Escape');
 assert.equal(await vegas.locator('.scene-area').getAttribute('data-immersive'),'true');await pinch(vegas,[120,270],[75,315]);const closer=Number(await vegas.locator('.scene-area canvas').getAttribute('data-seat-fov'));assert(closer>=35&&closer<100);await pinch(vegas,[75,315],[120,270]);assert(Number(await vegas.locator('.scene-area canvas').getAttribute('data-seat-fov'))>closer);
 await vegas.getByRole('button',{name:'Exit expanded 3D',exact:true}).click();assert.equal(await vegas.locator('[inert]').count(),0);assert.deepEqual(errors,[]);console.log('Vegas: reference dialog, pinch in/out, expanded-state retention and cleanup passed');await vegas.close();
 for(const [name,url,selector,ready,seatButton] of [
  ['Bahrain','/?season=2027&race=bahrain&screen=circuit&immersive=1','.circuit-model-stage','canvas[data-model-ready=true]','Seated view'],
  ['Vegas','/?season=2026&race=las-vegas&screen=seats&view=circuit&immersive=1','.scene-area','canvas[data-camera-state=ready]','Seat view'],
 ]){
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});await page.addInitScript(()=>localStorage.setItem('usage-consent-v1','deny'));await page.goto(origin+url);await page.locator(selector+' '+ready).waitFor({timeout:90000});
  const cdp=await page.context().newCDPSession(page);await page.locator(selector).getByRole('button',{name:seatButton,exact:true}).click();
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:410,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:181,y:410,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const fov=Number(await page.locator(selector+' canvas').getAttribute('data-seat-fov'));assert(fov>=70,`${name}: interrupting arrival must finish the seated lens, not strand the camera in overview`);
  await page.locator(selector).getByRole('button',{name:'Reset camera',exact:true}).click();await page.locator(selector+' '+ready).waitFor({timeout:90000});
  console.log(name+': touch during arrival settles the seated camera and reset remains usable');await page.close();
 }
}finally{await browser.close();}
