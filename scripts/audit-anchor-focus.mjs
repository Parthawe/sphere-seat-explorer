import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const origin=process.argv[2]??'http://localhost:5173';
const browser=await chromium.launch({headless:true});
const results=[];
try {
 for(const width of [1440,390]) {
  for(const interaction of ['none','pointer','keyboard','wheel']) {
   const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
   const fonts=[];
   await page.route('**/*.woff2',request=>fonts.push(request));
   await page.goto(`${origin}/?season=2027&race=belgium#circuit-guide`,{waitUntil:'domcontentloaded'});
   const choice=page.locator('.viewing-shortlist .viewing-choice-list button').first();
   await choice.waitFor();
   if(interaction==='pointer')await choice.click();
   if(interaction==='keyboard'){await choice.focus();await page.keyboard.press('Space');}
   if(interaction==='wheel'){await choice.focus();await page.mouse.wheel(0,120);}
   assert.ok(fonts.length,'The regression scenario must hold real pending fonts');
   for(const request of fonts)await request.continue();
   await page.unroute('**/*.woff2');
   await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   if(interaction==='none'){await page.waitForFunction(()=>document.activeElement?.id==='circuit-guide',{},{timeout:5000});assert.equal(await page.evaluate(()=>document.activeElement?.id),'circuit-guide');}
   else assert.ok(await choice.evaluate(element=>document.activeElement===element),`${interaction}: delayed anchor stole focus`);
   results.push({width,interaction,focusPreserved:true});
   await page.close();
  }
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  await page.addInitScript(()=>{
   Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__auditBrief=text;}}});
  });
  await page.goto(`${origin}/?season=2027&race=belgium#circuit-guide`);
  const root=page.locator('.viewing-shortlist');
  const choice=root.locator('.viewing-choice-list button').first();
  await choice.click();
  await root.locator('input[type=checkbox]').first().check();
  await root.getByRole('button',{name:'Copy shortlist',exact:true}).click();
  await page.waitForFunction(()=>typeof window.__auditBrief==='string');
  const brief=await page.evaluate(()=>window.__auditBrief);
  assert.ok(brief.includes('Belgium 2027'));
  assert.ok(brief.includes('not independently verified'));
  const downloaded=page.waitForEvent('download');
  await root.getByRole('button',{name:'Download shortlist',exact:true}).click();
  const download=await downloaded;
  assert.equal(await readFile(await download.path(),'utf8'),brief);
  assert.equal(download.suggestedFilename(),'belgium-2027-shortlist.txt');
  await root.getByRole('button',{name:'Clear',exact:true}).click();
  assert.ok(await choice.evaluate(element=>document.activeElement===element));
  assert.equal(await root.locator('input[type=checkbox]').count(),0);
  assert.equal(await page.locator('.circuit-ticket-source').getAttribute('href'),'https://ticketing.formula1.com/belgium/');
  results.push({width,shortlistExport:true,clearFocus:true,eventYearSource:true});
  await page.close();
 }
 console.log(JSON.stringify(results));
} finally {await browser.close();}
