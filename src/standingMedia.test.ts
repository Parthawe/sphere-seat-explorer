import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {standingPortrait,standingTeams,identityInitials} from './standingMedia';
test('standing portraits resolve full identities and explicit variants without guessing from a surname',()=>{
 assert.equal(standingPortrait('Carlos Sainz Jr.',2026)?.src,'/driver-portraits/carlos-sainz.jpg');
 assert.equal(standingPortrait('Nico Hülkenberg',2026)?.src,'/driver-portraits/nico-hulkenberg.jpg');
 assert.equal(standingPortrait('Sergio Pérez',2026)?.src,'/driver-portraits/sergio-perez.jpg');
 assert.equal(standingPortrait('Rafael Câmara',2026)?.src,'/driver-portraits/rafael-camara.jpg');
 assert.equal(standingPortrait('Russell',2026),null);assert.equal(standingPortrait('Yuki Tsunoda',2026),null);
 assert.equal(standingPortrait('George Russell',2027),null);
});
test('multi-constructor labels stay separate and unavailable marks never borrow another team identity',()=>{
 const marks=standingTeams('Red Bull / Racing Bulls');assert.equal(marks.length,2);assert.equal(marks[0].src,'/team-marks/redbull.svg');assert.equal(marks[1].src,null);
 assert.equal(standingTeams('Red Bull Racing')[0].src,marks[0].src);
 assert.equal(standingTeams('Unknown Team')[0].src,null);assert.equal(identityInitials('Unknown Team'),'UT');
});
test('bundled marks have sources, CC0 credit and local non-script SVG assets',()=>{
 const sources=JSON.parse(readFileSync(new URL('../public/team-marks/sources.json',import.meta.url),'utf8'));assert.equal(sources.length,7);
 for(const mark of sources){assert.equal(mark.license,'CC0 1.0');assert.match(mark.source,/^https:\/\/raw.githubusercontent.com\/simple-icons\/simple-icons\//);const asset=new URL('../public'+mark.src,import.meta.url);assert(existsSync(asset));const svg=readFileSync(asset,'utf8');assert.match(svg,/<svg/);assert(!/<script|javascript:|<foreignObject/i.test(svg));}
});
