import {readFile,writeFile,rename} from 'node:fs/promises';
import {fetchF1dbStandings} from '../src/f1dbStandings';
const year=Number(process.argv[2]);
try{
 if(year!==2026&&year!==2027)throw Error('Usage: npm run sync:f1db -- 2026|2027');
 const fetcher:typeof fetch=async(input,options)=>String(input)==='/data/racing/f1db-identities.json'?Response.json(JSON.parse(await readFile(new URL('../public/data/racing/f1db-identities.json',import.meta.url),'utf8'))):fetch(input,options);
 const feed=await fetchF1dbStandings(year,AbortSignal.timeout(20000),fetcher);
 const target=new URL(`../public/data/racing/${year}.json`,import.meta.url),temp=new URL(`../public/data/racing/${year}.json.tmp`,import.meta.url);
 await writeFile(temp,JSON.stringify(feed,null,2)+'\n');await rename(temp,target);
 console.log(JSON.stringify({season:feed.season,status:feed.status,drivers:feed.drivers.length,teams:feed.teams.length,source:feed.provider,fetchedAt:feed.fetchedAt}));
}catch(e){console.error(e instanceof Error?e.message:'F1DB sync failed; previous snapshot retained.');process.exitCode=1;}
