import assert from 'node:assert/strict';
import {chromium} from 'playwright';

// Run against a local preview: node scripts/audit-control-contrast.mjs http://localhost:5188
const origin=process.argv[2]??'http://localhost:5188';
function contrast(element){
 const rgba=value=>{const c=value.match(/[\d.]+/g)?.map(Number);return c?[c[0],c[1],c[2],c[3]??1]:[0,0,0,0];};
 const over=(a,b)=>[...a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])),1];
 const ancestors=[];for(let node=element;node;node=node.parentElement)ancestors.unshift(node);
 let background=[255,255,255,1];for(const node of ancestors)background=over(rgba(getComputedStyle(node).backgroundColor),background);
 const foreground=over(rgba(getComputedStyle(element).color),background);
 const luminance=c=>c.slice(0,3).reduce((total,v,i)=>{v/=255;return total+(v<=.04045?v/12.92:((v+.055)/1.055)**2.4)*[.2126,.7152,.0722][i];},0);
 const a=luminance(foreground),b=luminance(background);
 return {ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),foreground,background};
}
const browser=await chromium.launch({headless:true});
let checked=0,minimum=Infinity;
try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  async function check(button,state){
   const label=(await button.getAttribute('aria-label'))??(await button.innerText()).trim();
   for(const node of [button,...await button.locator('span,svg').all()]){
    if(!await node.isVisible())continue;
    const result=await node.evaluate(contrast);
    assert(result.ratio>=4.5,`${width}px ${state}: ${label} contrast ${result.ratio.toFixed(2)}:1`);
    minimum=Math.min(minimum,result.ratio);checked++;
   }
  }
  const routes=[
   ['?season=2026#race-calendar','#race-calendar','.calendar-filters button,.calendar-view-switch button,.calendar-download'],
   ['?season=2026&race=qatar','#venue-stands-title','.event-time-switch button,.event-calendar-save,.venue-stand-tools button,.stand-media-tabs button'],
   ['?season=2026&race=las-vegas&screen=vegas','.atlas-filters','.atlas-filters button,.atlas-compare-button'],
  ];
  for(const [route,ready,selector] of routes){
   await page.goto(new URL(route,origin).href);await page.locator(ready).waitFor();
   const buttons=page.locator(selector);
   for(let i=0;i<await buttons.count();i++){
    const button=buttons.nth(i);if(!await button.isVisible()||await button.isDisabled())continue;
    await page.mouse.move(0,0);await check(button,'default');
    await button.hover();await check(button,'hover');
    await button.press('Tab');await button.focus();await check(button,'keyboard focus');
    const outline=await button.evaluate(e=>getComputedStyle(e).outlineStyle);
    assert.notEqual(outline,'none','Keyboard focus must remain visible');
    await button.hover();await page.mouse.down();await check(button,'active');
    await page.mouse.move(0,0);await page.mouse.up();
    if(await button.getAttribute('aria-pressed')!==null){
     await button.click();await check(button,'selected + hover');
     assert.equal(await button.getAttribute('aria-pressed'),'true');
     await page.mouse.move(0,0);await check(button,'selected');
    }
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Horizontal overflow');
   if(route.includes('#race-calendar')){
    for(const node of await page.locator('.hub-header .brand-name,.calendar-primary-nav a,.race-list-head,.race-list :is(.race-status,.race-round,.race-circuit-name,.coverage-3d,.coverage-guide,.circuit-thumbnail)').all()){
     if(!await node.isVisible())continue;
     const result=await node.evaluate(contrast);assert(result.ratio>=4.5,'Calendar navigation and list metadata contrast');minimum=Math.min(minimum,result.ratio);checked++;
    }
   }
   if(route.includes('#race-calendar'))await page.screenshot({path:`/tmp/f1-contrast-${width}.png`});
  }
  await page.goto(new URL('?season=2027&race=japan',origin).href);
  const disabled=page.getByRole('button',{name:'My time',exact:true});await disabled.waitFor();
  assert(await disabled.isDisabled(),'Unconfirmed future times remain disabled');
  assert.equal(await page.locator('.event-schedule').evaluate(e=>getComputedStyle(e).colorScheme),'light');
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log(JSON.stringify({checks:checked,minimumContrast:minimum.toFixed(2)+':1',widths:[390,1440],states:['default','hover','keyboard focus','active','selected + hover','selected'],futureTimeGate:'preserved'}));
}finally{await browser.close();}
