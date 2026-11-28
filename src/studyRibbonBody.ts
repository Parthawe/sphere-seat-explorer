import {BufferGeometry,Float32BufferAttribute} from 'three';
/** Presentation thickness for the source ribbon, never terrain or a venue footprint. */
export function studyRibbonBody(ribbon:BufferGeometry,depth:number){
 const top=ribbon.getAttribute('position'),vertices:number[]=[],indices:number[]=[];
 for(let i=0;i<top.count-2;i+=2)for(const side of [0,1]){
  const a=i+side,b=i+2+side,n=vertices.length/3;
  vertices.push(top.getX(a),top.getY(a),top.getZ(a),top.getX(b),top.getY(b),top.getZ(b),top.getX(a),top.getY(a)-depth,top.getZ(a),top.getX(b),top.getY(b)-depth,top.getZ(b));
  indices.push(...(side===0?[n,n+2,n+1,n+1,n+2,n+3]:[n,n+1,n+2,n+1,n+3,n+2]));
 }
 const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
