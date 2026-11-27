import * as T from 'three';
export function circuitRibbon(points:T.Vector3[],width:number){
 const positions:number[]=[],indices:number[]=[],uv:number[]=[],distances=[0];
 for(let i=1;i<points.length;i++)distances.push(distances[i-1]+points[i].distanceTo(points[i-1]));
 const total=distances.at(-1)||1;
 points.forEach((p,i)=>{const prev=points[i===0?points.length-2:i-1],next=points[i===points.length-1?1:i+1],dx=next.x-prev.x,dz=next.z-prev.z,l=Math.hypot(dx,dz)||1;positions.push(p.x-dz/l*width,p.y,p.z+dx/l*width,p.x+dz/l*width,p.y,p.z-dx/l*width);uv.push(distances[i]/total,-1,distances[i]/total,1);if(i<points.length-1){const n=i*2;indices.push(n,n+2,n+1,n+1,n+2,n+3);}});
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
