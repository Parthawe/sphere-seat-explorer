export type HeightField={bounds:number[];columns:number;rows:number;heights:number[];baseline:number;source:string;licence:string};
type GroundModel={track:number[][];trackHeights?:number[];terrain?:HeightField};
/** Unknown terrain stays unknown. Local X is east; Z is south; Y is meters. */
export function sampleHeight(field:HeightField,x:number,z:number){
 const [west,north,east,south]=field.bounds;if(!Number.isFinite(x)||!Number.isFinite(z)||x<west-1e-7||x>east+1e-7||z<north-1e-7||z>south+1e-7)return undefined;
 const u=Math.max(0,Math.min(field.columns-1,(x-west)/(east-west)*(field.columns-1))),v=Math.max(0,Math.min(field.rows-1,(z-north)/(south-north)*(field.rows-1))),col=Math.min(Math.floor(u),field.columns-2),row=Math.min(Math.floor(v),field.rows-2),a=u-col,b=v-row,values=[field.heights[row*field.columns+col],field.heights[row*field.columns+col+1],field.heights[(row+1)*field.columns+col],field.heights[(row+1)*field.columns+col+1]];
 if(values.some(h=>!Number.isFinite(h)))return undefined;
 return values[0]*(1-a)*(1-b)+values[1]*a*(1-b)+values[2]*(1-a)*b+values[3]*a*b;
}
export function roadSample(model:GroundModel,x:number,z:number){
 let distance=Infinity,height=0;
 for(let i=1;i<model.track.length;i++){const a=model.track[i-1],b=model.track[i],dx=b[0]-a[0],dz=b[1]-a[1],f=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1))),px=x-a[0]-f*dx,pz=z-a[1]-f*dz,d=px*px+pz*pz;if(d<distance){distance=d;height=model.trackHeights?(model.trackHeights[i-1]*(1-f)+model.trackHeights[i]*f):0;}}
 return {height,distance:Math.sqrt(distance)};
}
/** Authored earthwork blend keeps the coarse context from swallowing the road. */
export function groundHeight(model:GroundModel,x:number,z:number){
 if(!model.terrain)return 0;
 const raw=sampleHeight(model.terrain,x,z);if(raw===undefined)throw new Error('Outside sampled terrain');
 const road=roadSample(model,x,z),f=Math.max(0,Math.min(1,(road.distance-18)/62)),blend=f*f*(3-2*f);
 return road.height*(1-blend)+raw*blend;
}
