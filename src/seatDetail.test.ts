import test from 'node:test';
import assert from 'node:assert/strict';
import {circuitModels,localModelPosition} from './circuitSeating';
import {detailedSeatPositions,distantSeatBands} from './seatDetail';

test('every assigned bank keeps the selected position in a bounded preview neighborhood, including edges',()=>{
 for(const model of Object.values(circuitModels))for(const bank of model.banks){
  if(bank.kind==='lawn')continue;
  for(const [section,row,seat] of [[1,1,1],[bank.sections,bank.rows,bank.seats],[Math.ceil(bank.sections/2),Math.ceil(bank.rows/2),bank.seats]]){
   const selected={bank:bank.id,section,row,seat},positions=detailedSeatPositions(bank,selected,true);
   assert(positions.length<=341,model.id+' '+bank.id);
   assert(positions.some(p=>p.section===section&&p.row===row&&p.seat===seat));
   assert.equal(new Set(positions.map(p=>`${p.section}/${p.row}/${p.seat}`)).size,positions.length);
   for(const p of positions){assert(p.row>=1&&p.row<=bank.rows);assert(p.section>=1&&p.section<=bank.sections);assert(p.seat>=1&&p.seat<=bank.seats);assert(Math.abs(p.row-row)<=5);}
   for(const band of distantSeatBands(bank,positions)){
    assert(band.s[0]>0);assert(band.p.every(Number.isFinite));
    for(const p of positions){const xyz=localModelPosition(bank,p);if(Math.abs(xyz[2]-band.p[2])<.01)assert(xyz[0]<band.p[0]-band.s[0]/2||xyz[0]>band.p[0]+band.s[0]/2,'A coarse band must not intersect a close chair');}
   }
  }
 }
});
test('preview crosses section boundaries by physical distance, while explorer retains every model position',()=>{
 const bank={id:'test',product:'',name:'',center:[0,0] as [number,number],width:40,sections:3,rows:12,seats:20,roof:true,kind:'assigned' as const,confidence:'illustrative',source:''};
 const selected={bank:'test',section:2,row:6,seat:1},preview=detailedSeatPositions(bank,selected,true),full=detailedSeatPositions(bank,selected,false);
 assert(preview.some(p=>p.section===1));assert.equal(full.length,bank.sections*bank.rows*bank.seats);
 assert.equal(detailedSeatPositions({...bank,kind:'lawn'},selected,true).length,0);
 assert.equal(detailedSeatPositions(bank,{...selected,bank:'other'},true).length,0);
});
