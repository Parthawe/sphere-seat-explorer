export type BankMarkerPoint={index:number;x:number;y:number};
export type BankMarkerCluster={members:number[];x:number;y:number};

/** Screen-space groups only: never changes a bank's geographic coordinates. */
export function clusterBankMarkers(points:BankMarkerPoint[],distance=52):BankMarkerCluster[]{
 const seen=new Set<number>(),groups:BankMarkerCluster[]=[];
 for(const point of points){
  if(!Number.isInteger(point.index)||point.index<0||!Number.isFinite(point.x)||!Number.isFinite(point.y)||seen.has(point.index))continue;
  seen.add(point.index);groups.push({members:[point.index],x:point.x,y:point.y});
 }
 let merged=true;
 while(merged){
  merged=false;
  outer:for(let i=0;i<groups.length;i++)for(let j=i+1;j<groups.length;j++){
   const a=groups[i],b=groups[j];
   if(Math.hypot(a.x-b.x,a.y-b.y)>=distance)continue;
   const count=a.members.length+b.members.length;
   groups[i]={members:[...a.members,...b.members].sort((x,y)=>x-y),x:(a.x*a.members.length+b.x*b.members.length)/count,y:(a.y*a.members.length+b.y*b.members.length)/count};
   groups.splice(j,1);merged=true;break outer;
  }
 }
 return groups;
}
