// Illustrative traffic only. Positions and pace are not race telemetry.
export const fieldColors=['#eb3433','#24b9ad','#fc9d34','#668cd9','#f1f3f8','#d94c85','#b3c658','#8162ba','#eb3433','#24b9ad','#fc9d34','#668cd9','#f1f3f8','#d94c85','#b3c658','#8162ba'];
export type TrafficField={positions:number[];elapsed:number;travel:number[]};
const wrap=(u:number)=>(u%1+1)%1;
export function createTrafficField(start=0,count=16):TrafficField {
 const gaps=[.009,.016,.012,.034,.011,.018,.046,.013,.023,.055,.01,.021,.039,.014,.027];
 let offset=0;
 return {positions:Array.from({length:count},(_,i)=>{if(i)offset+=gaps[(i-1)%gaps.length];return wrap(start-offset);}),elapsed:0,travel:Array(count).fill(0)};
}
export function advanceTraffic(field:TrafficField,delta:number,lapSeconds:number,minGap:number,cornerPace:(u:number)=>number=()=>1) {
 const dt=Math.min(Math.max(delta,0),.05);
 if(!dt){field.travel.fill(0);return;}
 field.elapsed+=dt;
 const old=field.positions;
 const travel=old.map((u,i)=>{
  const preference=.94+(i%5)*.027+Math.sin(field.elapsed*.31+i*1.7)*.055;
  const wanted=dt/Math.max(1,lapSeconds)*preference*Math.max(.35,Math.min(1,cornerPace(u)));
  const ahead=old[(i+old.length-1)%old.length],gap=wrap(ahead-u);
  return Math.min(wanted,Math.max(0,gap-minGap));
 });
 field.positions=old.map((u,i)=>wrap(u+travel[i]));field.travel=travel;
}
