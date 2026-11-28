import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {Vector3,PerspectiveCamera} from 'three';
import {calendars} from './races';import {circuitLayoutId,validateCircuitLayout} from './circuitLayouts';import {buildStudyGeometry} from './circuitStudy';import {fitStudyCamera} from './studyCamera';
const layouts=JSON.parse(readFileSync('public/data/circuit-layouts.json','utf8'));
test('all source studies fit portrait, landscape and expanded controls without changing the circuit',()=>{
 for(const races of Object.values(calendars))for(const race of races){
  const layout=validateCircuitLayout(layouts[circuitLayoutId(race.season,race.slug)!],race)!;
  const points=buildStudyGeometry(layout).points.map(p=>new Vector3(p[0],.11,p[1])),before=points.map(p=>p.toArray());
  for(const [width,height,immersive] of [[320,400,false],[390,844,true],[844,390,true],[1440,800,false]] as const)for(const mode of ['perspective','top'] as const){
   const view=fitStudyCamera(points,width/height,mode,height,immersive),camera=new PerspectiveCamera(44,width/height,.015,120);camera.position.copy(view.eye);camera.lookAt(view.target);if(immersive)camera.setViewOffset(width,height,0,view.offsetY,width,height);camera.updateMatrixWorld();
   for(const point of points){const p=point.clone().project(camera),y=(1-p.y)/2*height;assert(Math.abs(p.x)<1,race.slug+' horizontal fit');assert(y>=(immersive?70:0)&&y<=height-(immersive?(height<500?94:116):0),race.slug+' clear controls');assert(p.z>-1&&p.z<1);}
  }
  assert.deepEqual(points.map(p=>p.toArray()),before);
 }
});

test('rotating previews retain the entire source outline at both ends of their camera motion',()=>{
 for(const races of Object.values(calendars))for(const race of races){
  const layout=validateCircuitLayout(layouts[circuitLayoutId(race.season,race.slug)!],race)!,points=buildStudyGeometry(layout).points.map(p=>new Vector3(p[0],.11,p[1]));
  for(const [width,height] of [[350,400],[1200,400]]){
   const view=fitStudyCamera(points,width/height,'perspective',height,false,true);
   for(const angle of [-.12,-.06,0,.06,.12]){const camera=new PerspectiveCamera(44,width/height,.015,120);camera.position.copy(view.eye).applyAxisAngle(new Vector3(0,1,0),angle);camera.lookAt(view.target);camera.updateMatrixWorld();for(const point of points){const p=point.clone().project(camera);assert(Math.abs(p.x)<1&&Math.abs(p.y)<1,race.slug+' rotating preview fit');}}
  }
 }
});
