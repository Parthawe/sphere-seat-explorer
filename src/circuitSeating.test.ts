import monza from './monza-geometry.json';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {circuitModels,findCircuitModel,normalizeModelPosition,modelPosition,localModelPosition,modelCount,modelPositionUrl,positionKey} from './circuitSeating';
test('physical circuit and season cannot silently cross Qatar/Bahrain references',()=>{
 assert.equal(findCircuitModel(2026,'qatar')?.id,'qatar');assert.equal(findCircuitModel(2027,'bahrain')?.id,'bahrain');
 assert.equal(findCircuitModel(2026,'bahrain'),undefined);assert.equal(findCircuitModel(2027,'qatar'),undefined);
 assert.notDeepEqual(circuitModels.qatar.track,circuitModels.bahrain.track);
 for(const m of Object.values(circuitModels)){assert.deepEqual(m.track[0],m.track.at(-1));assert.ok(m.length>(m.id==='canada'?4300:5000)&&m.length<(m.id==='belgium'?7100:m.id==='great-britain'||m.id==='italy'?6000:5600));assert.ok(m.track.flat().every(Number.isFinite));}
});
test('all model positions are finite, unique and reachable without claiming ticket IDs',()=>{
 for(const m of Object.values(circuitModels))for(const b of m.banks){const keys=new Set<string>(),coordinates=new Set<string>();
  for(let section=1;section<=b.sections;section++)for(let row=1;row<=b.rows;row++)for(let seat=1;seat<=b.seats;seat++){
   const p={bank:b.id,section,row,seat};assert.deepEqual(normalizeModelPosition(m,p),p);const xyz=modelPosition(m,p);assert.ok(xyz.every(Number.isFinite));keys.add(positionKey(p));coordinates.add(xyz.map(n=>n.toFixed(4)).join(':'));
  }
  assert.equal(keys.size,modelCount(b));assert.equal(coordinates.size,modelCount(b));
  const first=localModelPosition(b,{bank:b.id,section:1,row:1,seat:1}),last=localModelPosition(b,{bank:b.id,section:b.sections,row:b.rows,seat:b.seats});assert.ok(last[0]>first[0]);assert.ok(last[1]>first[1]);assert.ok(last[2]<first[2]);
 }
});
test('malformed model positions clamp to their bank and share only public model fields',()=>{
 const m=circuitModels.bahrain,p=normalizeModelPosition(m,{bank:'missing',row:NaN,seat:Infinity,section:-400});assert.equal(p.bank,'main');assert.equal(p.section,1);assert.ok(Number.isFinite(p.row));
 const u=new URL(modelPositionUrl('https://example.com/?ticket=private&seat=99#booking',m,p));assert.equal(u.hash,'');assert.equal(u.searchParams.get('ticket'),null);assert.equal(u.searchParams.get('seat'),null);assert.equal(u.searchParams.get('season'),'2027');assert.equal(u.searchParams.get('race'),'bahrain');assert.equal(u.searchParams.get('screen'),'circuit');
});
test('Qatar admission rules and all sourced Bahrain banks remain separate',()=>{
 const q=circuitModels.qatar;assert.equal(q.banks.find(b=>b.id==='main')?.kind,'assigned');for(const id of ['north','t2','t16'])assert.equal(q.banks.find(b=>b.id===id)?.kind,'free');assert.equal(q.banks.find(b=>b.id==='hill')?.kind,'lawn');
 const b=circuitModels.bahrain;assert.equal(new Set(b.banks.map(b=>b.product)).size,5);assert.equal(b.banks.filter(b=>b.product==='university').length,3);assert.equal(b.banks.filter(b=>b.product==='victory').length,2);assert.ok(b.banks.every(b=>b.confidence.startsWith('OSM footprint')));
});

test('source rectangles retain their real horizontal axis instead of a diagonal width',async()=>{
 const {footprintPlacement}=await import('./circuitSeating');
 const angle=.73,c=Math.cos(angle),s=Math.sin(angle),rotate=([x,z]:number[])=>[120+x*c-z*s,-80+x*s+z*c];
 const polygon=[[-100,-12],[100,-12],[100,12],[-100,12],[-100,-12]].map(rotate);
 const fit=footprintPlacement(polygon),reversed=footprintPlacement([...polygon].reverse());
 assert.ok(Math.abs(fit.width-200)<1e-8);assert.ok(Math.hypot(fit.center[0]-120,fit.center[1]+80)<1e-8);
 assert.ok(Math.abs(Math.abs(fit.axis[0]*c+fit.axis[1]*s)-1)<1e-8);
 assert.ok(Math.abs(fit.width-reversed.width)<1e-8);assert.ok(Math.hypot(fit.center[0]-reversed.center[0],fit.center[1]-reversed.center[1])<1e-8);
 assert.throws(()=>footprintPlacement([[0,0],[1,1],[2,2]]));assert.throws(()=>footprintPlacement([[0,0],[Infinity,1],[2,2]]));
});
test('footprint-based banks stay aligned with their source envelope and face toward the circuit',async()=>{
 const {bankFrame}=await import('./circuitSeating');
 for(const model of Object.values(circuitModels))for(const bank of model.banks){
  const frame=bankFrame(model,bank);assert.ok(Math.abs(Math.hypot(...frame.forward)-1)<1e-8);
  const toward=[frame.target[0]-bank.center[0],frame.target[1]-bank.center[1]];
  assert.ok(frame.forward[0]*toward[0]+frame.forward[1]*toward[1]>=-1e-8);
  if(!bank.axis)continue;
  assert.ok(Math.abs(bank.axis[0]*frame.forward[0]+bank.axis[1]*frame.forward[1])<1e-8);
  if(!bank.footprint)continue;
  const source=model.features.find(f=>f.id===bank.footprint);assert.ok(source);
  const projected=source.points.map(p=>(p[0]-bank.center[0])*bank.axis![0]+(p[1]-bank.center[1])*bank.axis![1]);
  assert.ok(Math.abs(Math.max(...projected)-Math.min(...projected)-bank.width)<1e-6);
  assert.ok(projected.every(v=>Math.abs(v)<=bank.width/2+1e-6));
 }
 assert.equal(circuitModels.qatar.banks.filter(b=>b.axis).length,1);
 assert.equal(circuitModels.bahrain.banks.filter(b=>b.axis).length,8);
});


test('Yas 2026 has its own meter-space geometry and seven separate products',async()=>{
 const {default:yas}=await import('./yas-geometry.json');
 const {abuAreas}=await import('./abuDhabi');
 const m=findCircuitModel(2026,'united-arab-emirates')!;
 assert.equal(m.name,'Yas Marina Circuit');assert.equal(findCircuitModel(2027,'united-arab-emirates'),undefined);
 assert.equal(findCircuitModel(2026,'abu-dhabi'),undefined);
 assert.deepEqual(m.banks.map(b=>b.product).sort(),abuAreas.map(a=>a.id).sort());
 assert.equal(yas.projection.units,'meters');assert.equal(yas.licence,'ODbL-1.0');assert.equal(yas.features.length,5);
 assert.ok(Math.min(...m.track.map(p=>p[1]))< -800);assert.ok(Math.max(...m.track.map(p=>p[1]))>800);
 assert.equal(m.banks.filter(b=>b.footprint).length,3);
 for(const bank of m.banks){assert.equal(bank.source,abuAreas.find(a=>a.id===bank.product)!.source);assert.match(bank.confidence,/modeled|representative/);}
 const u=new URL(modelPositionUrl('https://example.com/?booking=secret#private',m,normalizeModelPosition(m,{})));
 assert.equal(u.searchParams.get('race'),'united-arab-emirates');assert.equal(u.searchParams.get('booking'),null);
});
test('representative Yas banks never place a model chair on the modeled road',async()=>{
 const {closestTrack}=await import('./circuitSeating');const m=circuitModels['united-arab-emirates'];
 // Full curved building envelopes can contain the road. Keep modeled banks outside it.
 for(const b of m.banks)for(let section=1;section<=b.sections;section++)for(let row=1;row<=b.rows;row++)for(let seat=1;seat<=b.seats;seat++){
  const p=modelPosition(m,{bank:b.id,section,row,seat}),t=closestTrack(m,[p[0],p[2]]);
  assert.ok(Math.hypot(p[0]-t[0],p[2]-t[1])>15,`${b.id} ${section}/${row}/${seat} overlaps modeled road`);
 }
});


test('full-circuit framing keeps every track vertex inside the viewport across venues and aspects',async()=>{
 const {circuitOverviewCamera}=await import('./circuitSeating');
 for(const model of Object.values(circuitModels))for(const aspect of [.5,1,2.5]){
  const {eye,target}=circuitOverviewCamera(model,aspect),distance=Math.hypot(...eye.map((n,i)=>n-target[i]));
  const n=eye.map((v,i)=>(v-target[i])/distance),rLength=Math.hypot(n[0],n[2]),right=[n[2]/rLength,0,-n[0]/rLength],up=[-n[1]*n[0]/rLength,rLength,-n[1]*n[2]/rLength],tan=Math.tan(Math.PI/8);
  for(const point of model.track){const v=[point[0]-target[0],-target[1],point[1]-target[2]],depth=distance-v.reduce((s,a,i)=>s+a*n[i],0);assert.ok(depth>0);const x=v.reduce((s,a,i)=>s+a*right[i],0)/(depth*tan*aspect),y=v.reduce((s,a,i)=>s+a*up[i],0)/(depth*tan);assert.ok(Math.abs(x)<.83&&Math.abs(y)<.71,model.id+' clips overview');}
 }
});

test('overview projection leaves track geometry clear of top and bottom controls',async()=>{
 const {circuitOverviewCamera}=await import('./circuitSeating');const T=await import('three');
 for(const model of Object.values(circuitModels))for(const [width,height] of [[390,742],[1075,917]]){
  const top=Math.min(height*.35,width<760?250:220),bottom=110,fraction=Math.max(.2,1-(top+bottom)/height)*.95;
  const view=circuitOverviewCamera(model,width/height,fraction),camera=new T.PerspectiveCamera(45,width/height,.15,12000);
  camera.position.set(...view.eye);camera.lookAt(...view.target);camera.setViewOffset(width,height,0,(bottom-top)/2,width,height);camera.updateMatrixWorld();
  for(const p of model.track){const projected=new T.Vector3(p[0],0,p[1]).project(camera),x=(projected.x+1)*width/2,y=(1-projected.y)*height/2;assert.ok(x>0&&x<width&&y>top&&y<height-bottom,model.id+' overlaps overview controls');}
 }
});

test('Albert Park 2027 preserves current map coverage and licensed lake context',()=>{
 const m=circuitModels.australia;
 assert.equal(findCircuitModel(2026,'australia'),undefined);assert.equal(findCircuitModel(2027,'australia'),m);
 assert.equal(m.appearance,'day');assert.equal(normalizeModelPosition(m,{}).bank,'fangio');
 assert.equal(m.banks.length,16);assert.equal(new Set(m.banks.map(b=>b.id)).size,16);
 assert.equal(m.banks.reduce((n,b)=>n+modelCount(b),0),30464);assert.ok(m.banks.every(b=>!b.roof&&/estimated/i.test(b.confidence)));
 const lake=m.features.find(f=>f.kind==='water')!;assert.ok(lake);assert.deepEqual(lake.points[0],lake.points.at(-1));assert.ok(lake.holes!.length>0);
 for(const hole of lake.holes!)assert.deepEqual(hole[0],hole.at(-1));assert.ok(m.vegetation!.length>2000);
});
test('every Melbourne modeled chair clears the road and lake',async()=>{
 const {closestTrack}=await import('./circuitSeating');const m=circuitModels.australia;
 const inside=(p:number[],ring:number[][])=>{let hit=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;};
 const lakes=m.features.filter(f=>f.kind==='water');
 for(const b of m.banks)for(let section=1;section<=b.sections;section++)for(let row=1;row<=b.rows;row++)for(let seat=1;seat<=b.seats;seat++){
  const p=modelPosition(m,{bank:b.id,section,row,seat}),xy=[p[0],p[2]],t=closestTrack(m,xy);
  assert.ok(Math.hypot(p[0]-t[0],p[2]-t[1])>15,b.id+' overlaps modeled road');
  assert.ok(!lakes.some(l=>inside(xy,l.points)&&!(l.holes??[]).some(h=>inside(xy,h))),b.id+' overlaps lake');
 }
});


test('Silverstone 2027 keeps current banks, representative anchors and season boundaries',()=>{
 const m=circuitModels['great-britain'];assert.equal(findCircuitModel(2026,'great-britain'),undefined);assert.equal(m.banks.length,26);assert.equal(normalizeModelPosition(m,{}).bank,'hamilton-a');
 assert.equal(new Set(m.banks.map(b=>b.id)).size,26);assert.equal(m.banks.reduce((n,b)=>n+modelCount(b),0),48960);
 assert.ok(m.length>5800&&m.length<6000);assert.ok(m.features.some(f=>f.name==='Silverstone Wing'));
 assert.ok(m.banks.some(b=>b.id==='george-russell'));assert.ok(m.banks.some(b=>b.id==='landostand'));assert.ok(m.banks.every(b=>!b.footprint&&!b.roof&&/estimated/.test(b.confidence)));
 const u=new URL(modelPositionUrl('https://example.com/?ticket=secret#booking',m,normalizeModelPosition(m,{})));assert.equal(u.searchParams.get('race'),'great-britain');assert.equal(u.searchParams.get('ticket'),null);assert.equal(u.hash,'');
});
test('every Silverstone model position stays outside its modeled racing surface',async()=>{
 const {closestTrack}=await import('./circuitSeating');const m=circuitModels['great-britain'];
 for(const b of m.banks)for(let section=1;section<=b.sections;section++)for(let row=1;row<=b.rows;row++)for(let seat=1;seat<=b.seats;seat++){
  const p=modelPosition(m,{bank:b.id,section,row,seat}),t=closestTrack(m,[p[0],p[2]]);assert.ok(Math.hypot(p[0]-t[0],p[2]-t[1])>15,b.id+' intersects modeled road');
 }
});


test('Monza 2027 keeps its GP loop and five source envelopes as estimated coverage expands',()=>{
 const m=circuitModels.italy;assert.equal(findCircuitModel(2027,'italy'),m);assert.equal(findCircuitModel(2026,'italy'),undefined);assert.equal(m.banks.length,30);assert.equal(m.banks.reduce((n,b)=>n+modelCount(b),0),30232);
 assert.equal(monza.licence,'ODbL-1.0');assert.equal(monza.source,'https://www.openstreetmap.org/relation/284565');assert.ok(monza.length_m>5750&&monza.length_m<5850);assert.equal(monza.points.length,294);assert.equal(new Set(monza.ways).size,20);for(const excluded of ['38168747','38168756','34404709','19982933','19983025'])assert.ok(!monza.ways.includes(excluded));
 assert.deepEqual(m.banks.slice(0,5).map(b=>b.footprint),['193647796','193647795','231257063','179794158','231026020']);assert.ok(m.banks.every(b=>b.source.endsWith('GP_F1_2027_LISTINO_PREZZI-1.pdf')&&!b.roof));
 assert.equal(m.terrain,undefined);assert.match(m.evidence,/flyover bridges/);const gf=m.banks.find(b=>b.id==='gf')!;assert.equal(gf.source,m.banks[0].source);assert.equal(gf.kind,'free');assert.match(gf.admissionNote!,/not numbered/);assert.equal(m.unmappedProducts!.some(p=>p.id==='gf'),false);assert.ok(monza.vegetation.length>1000);assert.equal(monza.forest_sources.length,41);
});

test('every Monza modeled position stays clear of its GP racing surface',async()=>{
 const {closestTrack}=await import('./circuitSeating'),m=circuitModels.italy;
 for(const b of m.banks)for(let section=1;section<=b.sections;section++)for(let row=1;row<=b.rows;row++)for(let seat=1;seat<=b.seats;seat++){const p=modelPosition(m,{bank:b.id,section,row,seat}),t=closestTrack(m,[p[0],p[2]]);assert.ok(Math.hypot(p[0]-t[0],p[2]-t[1])>15,b.id+' intersects road');}
});


test('stand cameras keep complete bank envelopes clear of controls on phones and desktop',async()=>{
 const T=await import('three'),{bankOverviewCamera,bankFrame,bankGroundHeight}=await import('./circuitSeating');
 for(const m of Object.values(circuitModels))for(const b of m.banks)for(const [width,height] of [[320,488],[1075,917]]){
  const top=Math.min(height*.5,width<760?250:220),fraction=Math.max(.2,1-(top+110)/height)*.95,view=bankOverviewCamera(m,b,width/height,fraction),camera=new T.PerspectiveCamera(45,width/height,.5,6500);camera.position.set(...view.eye);camera.lookAt(...view.target);camera.setViewOffset(width,height,0,(110-top)/2,width,height);camera.updateMatrixWorld();const {yaw}=bankFrame(m,b),c=Math.cos(yaw),s=Math.sin(yaw),ground=bankGroundHeight(m,b);
  for(const x of [-b.width/2,b.width/2])for(const z of [-b.rows*.44,b.rows*.44])for(const y of [0,b.rows*.43+5]){const p=new T.Vector3(b.center[0]+x*c+z*s,ground+y,b.center[1]-x*s+z*c).project(camera),px=(p.x+1)*width/2,py=(1-p.y)*height/2;assert.ok(px>0&&px<width&&py>top&&py<height-110,m.id+'/'+b.id+' clips stand');}
 }
});


test('Monza current diagram audit retains every named public product once across models and source-only entries',()=>{
 const m=circuitModels.italy,expected=['1','2','3','4','5','6b','6c','7','8a','8b','9','10','10-bis','11','12','13','14','16','18','21a','21b','21c','21d','21e','22','24','25','26a','26b','26c','27','28','29','30','32','33a','33b','34','35a','35b','35c','gf','prato'];
 const actual=[...m.banks.map(b=>b.id),...m.unmappedProducts!.filter(p=>p.id!=='other-monza-products').map(p=>p.id)];assert.equal(actual.length,43);assert.deepEqual(actual.sort(),expected.sort());assert.equal(new Set(actual).size,actual.length);
});
