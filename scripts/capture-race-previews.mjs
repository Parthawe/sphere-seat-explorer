import {chromium} from 'playwright';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {calendars} from '../src/races.ts';
import {racePreview} from '../src/racePreview.ts';

// node --import tsx scripts/capture-race-previews.mjs http://localhost:5188 /tmp/race-previews
const [origin,output]=process.argv.slice(2);
if(!origin||!output)throw Error('Provide the preview origin and a separate output directory.');
mkdirSync(output,{recursive:true});
const seen=new Set(),specs=Object.values(calendars).flat().map(race=>({race,...racePreview(race)})).filter(spec=>!seen.has(spec.key)&&seen.add(spec.key));
const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
let index=0;
async function worker(){
 while(index<specs.length){
  const spec=specs[index++],page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:'reduce'});
  try{
   await page.goto(new URL(`?season=${spec.race.season}&race=${spec.race.slug}`,origin).href);
   await page.locator('.race-3d-preview[data-preview-ready="true"]').waitFor({timeout:60000});
   if(spec.kind==='model')await page.locator('canvas[data-model-ready="true"]').waitFor();
   if(spec.kind==='vegas')await page.locator('canvas[data-hero-camera-state="ready"]').waitFor();
   await page.locator('.race-3d-preview canvas').screenshot({path:path.join(output,spec.key+'.png'),style:'.race-3d-preview-credit,.race-3d-preview-tools,.race-3d-preview-status {visibility:hidden!important}'});
   process.stdout.write(spec.key+'\n');
  }finally{await page.close();}
 }
}
try{await Promise.all([worker(),worker()]);}finally{await browser.close();}
