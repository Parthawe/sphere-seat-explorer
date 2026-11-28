import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {TessellateModifier} from 'three/examples/jsm/modifiers/TessellateModifier.js';
import {ExtrudeGeometry,Path,Shape,BoxGeometry} from 'three';
import type {ModelPosition} from './circuitSeating';

/** Authored molded-plastic shell, normalized to the existing instance envelope. */
export function stadiumSeatPanel(grip=false){
 const shape=new Shape(),r=.14;
 shape.moveTo(-.5+r,-.5);shape.lineTo(.5-r,-.5);
 shape.quadraticCurveTo(.5,-.5,.5,-.5+r);shape.lineTo(.5,.5-r);
 shape.quadraticCurveTo(.5,.5,.5-r,.5);shape.lineTo(-.5+r,.5);
 shape.quadraticCurveTo(-.5,.5,-.5,.5-r);shape.lineTo(-.5,-.5+r);
 shape.quadraticCurveTo(-.5,-.5,-.5+r,-.5);
 if(grip){const hole=new Path();hole.absellipse(0,.26,.16,.055,0,Math.PI*2,true,0);shape.holes.push(hole);}
 let geometry:import('three').BufferGeometry=new ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:2,steps:1,curveSegments:4});
 // Shape lies in XY; the pan must be rounded in XZ rather than extruded front-to-back.
 if(!grip)geometry.rotateX(-Math.PI/2);
 geometry.computeBoundingBox();let box=geometry.boundingBox!;
 geometry.translate(-(box.min.x+box.max.x)/2,-(box.min.y+box.max.y)/2,-(box.min.z+box.max.z)/2);
 geometry.scale(1/(box.max.x-box.min.x),1/(box.max.y-box.min.y),1/(box.max.z-box.min.z));
 geometry.scale(1,grip?1:.01,grip?.03:1);
 const refined=new TessellateModifier(.24,5).modify(geometry);geometry.dispose();geometry=refined;
 const position=geometry.getAttribute('position'),normal=geometry.getAttribute('normal');
 for(let i=0;i<position.count;i++){
  const x=position.getX(i),y=position.getY(i),z=position.getZ(i),nx=normal.getX(i),ny=normal.getY(i),nz=normal.getZ(i);
  if(grip){position.setZ(i,z+.7*x*x+.12*y*y);normal.setXYZ(i,nx-1.4*x*nz,ny-.24*y*nz,nz);}
  else{position.setY(i,y+.2*x*x+.1*z*z);normal.setXYZ(i,nx-.4*x*ny,ny,nz-.2*z*ny);}
 }
 normal.needsUpdate=true;geometry.normalizeNormals();position.needsUpdate=true;
 geometry.computeBoundingBox();box=geometry.boundingBox!;
 const width=box.max.x-box.min.x,height=box.max.y-box.min.y,depth=box.max.z-box.min.z;
 geometry.translate(-(box.min.x+box.max.x)/2,-(box.min.y+box.max.y)/2,-(box.min.z+box.max.z)/2);
 geometry.scale(1/width,1/height,1/depth);geometry.computeBoundingBox();
 return geometry;
}
/** Colors identify model positions only, never ticket availability. */
export function modelSeatAccent(position:ModelPosition,selection:ModelPosition,base:string){
 if(position.bank!==selection.bank||position.section!==selection.section||position.row!==selection.row)return base;
 return position.seat===selection.seat?'#e8453d':'#b8c7d4';
}

/** Individual silhouettes for distant model positions, using only 72 vertices. */
export function distantStadiumSeat(){
 const pan=new BoxGeometry(.48,.055,.48);pan.translate(0,.28,0);
 const back=new BoxGeometry(.48,.52,.055);back.rotateX(-.12);back.translate(0,.55,-.24);
 const parts=[pan.toNonIndexed(),back.toNonIndexed()],geometry=mergeGeometries(parts);parts.forEach(part=>part.dispose());pan.dispose();back.dispose();geometry.computeBoundingBox();return geometry;
}
