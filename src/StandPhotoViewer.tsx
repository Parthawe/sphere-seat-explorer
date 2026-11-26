import {useEffect,useLayoutEffect,useRef,useState,useSyncExternalStore} from 'react';
import type {StandMedia} from './standMediaData';
import UiIcon from './UiIcon';
import {allowPhotoConnection,photoConnectionAllowed,subscribePhotoConnection} from './sourcePhotoConnection';

export default function StandPhotoViewer({media}:{media:StandMedia}){
 const enabled=useSyncExternalStore(subscribePhotoConnection,photoConnectionAllowed),[index,setIndex]=useState(0),[status,setStatus]=useState<'loading'|'ready'|'error'>('loading'),[retry,setRetry]=useState(0),[expanded,setExpanded]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),load=useRef<HTMLButtonElement>(null),restoreLoad=useRef(false),enlarge=useRef<HTMLButtonElement>(null),photo=media.photos[index];
 useEffect(()=>{if(!enabled||status!=='loading')return;const timer=setTimeout(()=>setStatus('error'),15000);return()=>clearTimeout(timer);},[enabled,index,retry,status]);
 useEffect(()=>{if(expanded)dialog.current?.showModal();else dialog.current?.close();},[expanded]);
 function choose(next:number){setIndex((next+media.photos.length)%media.photos.length);setStatus('loading');setExpanded(false);}
 useLayoutEffect(()=>{if(!enabled&&restoreLoad.current){restoreLoad.current=false;load.current?.focus();}},[enabled]);
 function unload(){restoreLoad.current=true;allowPhotoConnection(false);setExpanded(false);setStatus('loading');}
 if(!photo)return <div className="stand-photo-empty"><UiIcon name="camera"/><p>No matched still photo for this stand.</p></div>;
 const restricted=photo.sourceLabel.includes('アウトレット'),block=photo.sourceLabel.match(/([A-Z](?:[～〜][A-Z])?)ブロック/)?.[1]?.replace(/[～〜]/g,'–'),row=photo.sourceLabel.includes('最前列')?'front row':photo.sourceLabel.match(/(\d+)列/)?.[1];
 return <div className="stand-photo-viewer">
  {enabled?<><figure className="stand-photo-figure" aria-busy={status==='loading'}>
   {status!=='error'&&<img key={`${photo.url}-${retry}`} src={photo.url} alt={`${media.name}: ${photo.sourceLabel}`} referrerPolicy="no-referrer" decoding="async" onLoad={()=>setStatus('ready')} onError={()=>setStatus('error')}/>}
   {status==='loading'&&<div className="stand-photo-status" role="status">Loading original photo…</div>}
   {status==='error'&&<div className="stand-photo-status" role="alert"><p>Source photo unavailable.</p><button onClick={()=>{setStatus('loading');setRetry(n=>n+1);}}>Retry photo</button><a href={photo.url} target="_blank" rel="noreferrer">Open original image</a></div>}
   {status==='ready'&&<button ref={enlarge} className="stand-photo-expand" aria-label="Enlarge stand photo" onClick={()=>setExpanded(true)}><UiIcon name="expand"/></button>}
  </figure><div className="stand-photo-controls"><button aria-label="Previous stand photo" disabled={media.photos.length<2} onClick={()=>choose(index-1)}><UiIcon name="arrow" className="photo-nav-previous"/></button><span role="status">{index+1} / {media.photos.length}</span><button aria-label="Next stand photo" disabled={media.photos.length<2} onClick={()=>choose(index+1)}><UiIcon name="arrow"/></button><button onClick={unload}>Unload photos</button></div>
  <p className="stand-photo-kind">{restricted?'Restricted-view example':'Organizer reference'}{block?` · block ${block}`:''}{row?` · ${row==='front row'?row:'row '+row}`:''}</p><p className="stand-photo-caption" lang="ja">{photo.sourceLabel}</p><a className="stand-photo-credit" href={media.source} target="_blank" rel="noreferrer">Photo source: Suzuka Circuit<UiIcon name="arrow"/></a><p>Capture year unverified. This photo is not matched to a generated model seat.</p>
  </>:<div className="stand-photo-optin"><UiIcon name="camera"/><strong>{media.photos.length} original stand photos</strong><button ref={load} onClick={()=>{allowPhotoConnection(true);setStatus('loading');}}>Load stand photos</button><p>Loads original images from Suzuka Circuit while this page is open.</p></div>}
  <dialog ref={dialog} className="stand-photo-dialog" aria-label={`${media.name} original photo`} onCancel={()=>setExpanded(false)} onClose={()=>{setExpanded(false);enlarge.current?.focus();}}>
   {expanded&&<><div className="stand-photo-dialog-bar"><strong>{media.name} · {index+1} / {media.photos.length}</strong><button autoFocus onClick={()=>setExpanded(false)} aria-label="Close enlarged photo"><UiIcon name="close"/></button></div><img src={photo.url} alt={`${media.name}: ${photo.sourceLabel}`} referrerPolicy="no-referrer"/><p lang="ja">{photo.sourceLabel}</p><a href={media.source} target="_blank" rel="noreferrer">Suzuka Circuit · original source</a></>}
  </dialog>
 </div>;
}
