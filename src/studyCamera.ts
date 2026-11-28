import {Vector3} from 'three';

/** Framing changes the camera only; every study retains its original source path. */
export function fitStudyCamera(points:readonly Vector3[],aspect:number,mode:'perspective'|'top',height:number,immersive=false,orbit=false){
 const top=immersive?70:0,bottom=immersive?(height<500?94:116):0;
 const fraction=Math.max(.25,(height-top-bottom)/height),tanY=Math.tan(44*Math.PI/360),tanX=tanY*Math.max(.1,aspect);
 const target=new Vector3((Math.min(...points.map(p=>p.x))+Math.max(...points.map(p=>p.x)))/2,0,(Math.min(...points.map(p=>p.z))+Math.max(...points.map(p=>p.z)))/2);
 const directions=mode==='top'?[new Vector3(0,1,.005)]:Array.from({length:16},(_,i)=>new Vector3(Math.sin(i*Math.PI/8),1.1,Math.cos(i*Math.PI/8)));
 const fits=directions.map(direction=>{
  direction.normalize();let distance=2;
  for(const turn of orbit?[-.12,0,.12]:[0]){const normal=direction.clone().applyAxisAngle(new Vector3(0,1,0),turn),right=new Vector3().crossVectors(new Vector3(0,1,0),normal).normalize(),up=new Vector3().crossVectors(normal,right).normalize();
   for(const p of points){const v=p.clone().sub(target),depth=v.dot(normal);distance=Math.max(distance,depth+(Math.abs(v.dot(right))+.18)/(tanX*.9),depth+(Math.abs(v.dot(up))+.18)/(tanY*fraction*.9));}
  }
  return {eye:direction.multiplyScalar(distance).add(target),target,distance};
 });
 const best=fits.reduce((a,b)=>a.distance<=b.distance?a:b);
 return {...best,offsetY:(bottom-top)/2};
}
