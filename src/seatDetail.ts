import {localModelPosition,type ModelBank,type ModelPosition} from './circuitSeating';

/** The preview retains a small physical neighborhood, including adjacent sections.
 * These are model positions, never a claim about ticket seat numbering. */
export function detailedSeatPositions(bank:ModelBank,selection:ModelPosition,preview:boolean,portable=false):ModelPosition[]{
 if(bank.id!==selection.bank||bank.kind==='lawn')return [];
 const columns=Array.from({length:bank.sections*bank.seats},(_,i)=>({bank:bank.id,section:Math.floor(i/bank.seats)+1,row:selection.row,seat:i%bank.seats+1}));
 const x=localModelPosition(bank,selection)[0];
 const windowed=preview||portable,limit=preview?31:61,radius=preview?5:10;
 const visible=windowed?columns.sort((a,b)=>Math.abs(localModelPosition(bank,a)[0]-x)-Math.abs(localModelPosition(bank,b)[0]-x)).slice(0,limit):columns;
 const first=windowed?Math.max(1,selection.row-radius):1,last=windowed?Math.min(bank.rows,selection.row+radius):bank.rows;
 return visible.flatMap(p=>Array.from({length:last-first+1},(_,i)=>({...p,row:first+i})));
}

/** Keep distant seats visible without drawing a continuous band through close chairs. */
export function distantSeatBands(bank:ModelBank,positions:ModelPosition[]){
 const pitch=bank.width/(bank.sections*bank.seats+(bank.sections-1)*3);
 return Array.from({length:bank.rows},(_,i)=>{
  const row=i+1,close=positions.filter(p=>p.row===row),z=(bank.rows/2-row)*.88,y=.55+i*.43+.22;
  if(!close.length)return [{p:[0,y,z],s:[bank.width,.12,.42]}];
  const xs=close.map(p=>localModelPosition(bank,p)[0]);
  const left=Math.max(-bank.width/2,Math.min(...xs)-pitch/2),right=Math.min(bank.width/2,Math.max(...xs)+pitch/2);
  return [{a:-bank.width/2,b:left},{a:right,b:bank.width/2}].filter(v=>v.b-v.a>.01).map(v=>({p:[(v.a+v.b)/2,y,z],s:[v.b-v.a,.12,.42]}));
 }).flat();
}
