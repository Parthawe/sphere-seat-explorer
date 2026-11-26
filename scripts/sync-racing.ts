import {readFile,writeFile,rename} from 'node:fs/promises';
import {fetchJolpica} from './racing-provider';
const season=Number(process.argv[2]);
try{
 if(season!==2026&&season!==2027)throw Error('Usage: npm run sync:racing -- 2026|2027');
 const config=JSON.parse(await readFile(new URL('../commercial/racing-feed.json',import.meta.url),'utf8'));
 const feed=await fetchJolpica(season,config);
 const target=new URL(`../public/data/racing/${season}.json`,import.meta.url),temp=new URL(`../public/data/racing/${season}.json.tmp`,import.meta.url);
 await writeFile(temp,JSON.stringify(feed,null,2)+'\n');await rename(temp,target);
 console.log(`Prepared ${season} published-results snapshot. Publish it through the normal Site workflow. No live timing is supplied.`);
}catch(error){console.error(error instanceof Error?error.message:'Racing update failed.');process.exitCode=1;}
