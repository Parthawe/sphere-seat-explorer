import {test} from 'node:test';
import assert from 'node:assert/strict';
import {clusterBankMarkers} from './bankMarkerClusters';

test('crowded bank markers group without moving or losing their source points',()=>{
 const points=[{index:0,x:10,y:20},{index:1,x:30,y:20},{index:2,x:200,y:100}],original=structuredClone(points);
 const groups=clusterBankMarkers(points);
 assert.deepEqual(points,original);assert.equal(groups.length,2);
 assert.deepEqual(groups[0],{members:[0,1],x:20,y:20});
 assert.deepEqual(groups.flatMap(g=>g.members).sort(),[0,1,2]);
});
test('bank groups retain finite, separated touch targets through dense and sparse layouts',()=>{
 for(const scale of [1,5,20,100]){
  const points=Array.from({length:30},(_,index)=>({index,x:Math.sin(index)*scale+200,y:Math.cos(index*.7)*scale+300}));
  const groups=clusterBankMarkers(points);
  assert.equal(groups.reduce((count,g)=>count+g.members.length,0),30);
  for(let i=0;i<groups.length;i++)for(let j=i+1;j<groups.length;j++)assert.ok(Math.hypot(groups[i].x-groups[j].x,groups[i].y-groups[j].y)>=52);
 }
});
test('invalid or duplicate projected observations cannot create extra banks',()=>{
 assert.deepEqual(clusterBankMarkers([{index:0,x:1,y:2},{index:0,x:9,y:9},{index:1,x:NaN,y:2},{index:-1,x:1,y:2}]),[{members:[0],x:1,y:2}]);
});
