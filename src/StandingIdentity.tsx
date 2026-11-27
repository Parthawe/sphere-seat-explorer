import {useState} from 'react';
import {identityInitials,standingPortrait,standingTeams} from './standingMedia';
export function StandingPortrait({name,season}:{name:string;season:number}){
 const photo=standingPortrait(name,season),[failed,setFailed]=useState(false);
 return <span className="standing-portrait" title={photo&&!failed?`${name} · source photo ${photo.year}`:`${name} · portrait unavailable`} aria-hidden="true"><span>{identityInitials(name)}</span>{photo&&!failed&&<img src={photo.src} width="44" height="44" loading="lazy" decoding="async" alt="" onError={()=>setFailed(true)}/>}</span>;
}
function TeamMark({name,src,initials}:{name:string;src:string|null;initials:string}){
 const [failed,setFailed]=useState(false);
 return <span className="standing-team-mark" title={src&&!failed?`${name} company mark`:`${name} · initials`} aria-hidden="true">{src&&!failed?<img src={src} width="26" height="22" loading="lazy" decoding="async" alt="" onError={()=>setFailed(true)}/>:<span>{initials}</span>}</span>;
}
export function StandingTeams({label,large=false}:{label:string;large?:boolean}){
 return <span className={large?'standing-team-emblem':'standing-team-marks'}>{standingTeams(label).map(team=><TeamMark key={team.name} {...team}/>)}</span>;
}
