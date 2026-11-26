import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calendars} from './races';
import {circuitLayoutId,validateCircuitLayout} from './circuitLayouts';
import {raceCoverage} from './raceCoverage';
import {findCircuitModel} from './circuitSeating';
import {readRoute} from './routing';
const data=JSON.parse(readFileSync(new URL('../public/data/circuit-layouts.json',import.meta.url),'utf8'));
test('all 47 listed race editions have independent valid source circuit diagrams',()=>{
 let count=0;for(const races of Object.values(calendars))for(const race of races){const id=circuitLayoutId(race.season,race.slug);assert(id);const layout=validateCircuitLayout(data[id],race);assert(layout);assert.deepEqual(layout.points[0],layout.points.at(-1));assert.match(layout.note,/layout year unverified/i);assert.match(layout.note,/Flat diagram only/);assert(raceCoverage(race.season,race.slug).has3d);count++;}assert.equal(count,47);
});
test('2026 Malaysia event and 2027 Sakhir event cannot inherit each other’s physical outline',()=>{
 assert.equal(circuitLayoutId(2026,'bahrain'),'my-1999');assert.equal(circuitLayoutId(2027,'bahrain'),'bh-2002');assert.equal(validateCircuitLayout(data['bh-2002'],{season:2026,slug:'bahrain'}),null);
});
test('unknown events, invalid geometry and cross-venue data fail closed',()=>{
 assert.equal(circuitLayoutId(2026,'portugal'),undefined);assert.equal(circuitLayoutId(2028,'qatar'),undefined);assert.equal(circuitLayoutId(2027,'not-a-race'),undefined);const race={season:2027 as const,slug:'japan'};assert.equal(validateCircuitLayout({...data['jp-1962'],points:[[0,0],[1,1]]},race),null);assert.equal(validateCircuitLayout({...data['jp-1962'],points:Array(30).fill([NaN,0])},race),null);assert.equal(validateCircuitLayout(data['sg-2008'],race),null);
});
test('diagram coverage never creates seating models for unsupported editions',()=>{
 for(const [season,race] of [[2027,'japan'],[2027,'austria'],[2027,'singapore'],[2027,'china'],[2027,'qatar']] as const){assert.equal(findCircuitModel(season,race),undefined);assert.equal(raceCoverage(season,race).kind,'layout3d');assert.match(raceCoverage(season,race).detail,/no seat preview/);}
});
test('diagram routes retain event identity and do not enter seat or Vegas modes',()=>{
 const r=readRoute('?season=2027&race=japan&screen=layout');assert.equal(r.layout,true);assert.equal(r.race,'japan');assert.equal(r.seats,false);assert.equal(r.circuit,false);assert.equal(r.atlas,false);assert.equal(readRoute('?season=2028&race=japan&screen=layout').layout,false);
});
