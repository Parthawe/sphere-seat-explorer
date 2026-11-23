export type ReplaySample = [number, number, number, number, number | null];
export type ReplayDriver = {number:number;code:string;name:string;team:string;color:string;samples:ReplaySample[]};
export type HistoricalRace = {title:string;session:number;date:string;startUtc:string;duration:number;method:string;sources:string[];track:number[][];drivers:ReplayDriver[]};
export type ReplayFrame = {data:HistoricalRace;clock:{current:number};playing:boolean};
export function replaySample(driver:ReplayDriver,time:number):ReplaySample|null {
 const s=driver.samples;
 if(!s.length||time<s[0][0]||time>s[s.length-1][0])return null;
 let lo=0,hi=s.length-1;
 while(lo+1<hi){const m=(lo+hi)>>1;if(s[m][0]<=time)lo=m;else hi=m;}
 const a=s[lo],b=s[hi],gap=b[0]-a[0];
 if(gap>2)return null;
 const f=gap?Math.max(0,Math.min(1,(time-a[0])/gap)):0;
 let delta=b[1]-a[1];if(delta<-.5)delta+=1;if(delta>.5)delta-=1;
 return [time,(a[1]+delta*f+1)%1,a[2]+(b[2]-a[2])*f,a[3]+(b[3]-a[3])*f,f<.5?a[4]:b[4]];
}
export function sectionPasses(data:HistoricalRace,fraction:number){
 const passes:{driver:ReplayDriver;time:number;speed:number|null}[]=[];
 for(const driver of data.drivers){
  for(let i=1;i<driver.samples.length;i++){
   const a=driver.samples[i-1],b=driver.samples[i];
   const distance=(b[1]-a[1]+1)%1,target=(fraction-a[1]+1)%1;
   if(distance>0&&distance<.025&&target<=distance&&b[0]-a[0]<=2)
    passes.push({driver,time:a[0]+(b[0]-a[0])*target/distance,speed:b[4]});
  }
 }
 return passes.sort((a,b)=>a.time-b.time);
}
export function replayTime(time:number){return `${Math.floor(time/60)}:${(time%60).toFixed(1).padStart(4,'0')}`;}
