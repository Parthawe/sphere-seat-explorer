import {build} from 'esbuild';import {mkdir,writeFile,copyFile} from 'node:fs/promises';
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
await build({entryPoints:['worker/index.mjs'],bundle:true,format:'esm',target:'es2022',outfile:'dist/server/index.js',platform:'browser'});
await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
await writeFile('dist/server/wrangler.json',JSON.stringify({name:'f1tickets-online',main:'index.js',compatibility_date:'2026-11-27',compatibility_flags:['nodejs_compat'],assets:{directory:'../client',binding:'ASSETS',run_worker_first:['/api/*','/insights'],not_found_handling:'single-page-application'},d1_databases:[{binding:'DB',database_name:'f1tickets-data',database_id:'00000000-0000-4000-8000-000000000000'}]},null,2));
