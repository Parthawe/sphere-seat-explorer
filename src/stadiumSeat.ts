import {ExtrudeGeometry,Path,Shape} from 'three';
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
 const geometry=new ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:2,steps:1,curveSegments:4});
 geometry.computeBoundingBox();const box=geometry.boundingBox!;
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
