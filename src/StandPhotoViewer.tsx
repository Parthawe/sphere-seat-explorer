import {useEffect,useLayoutEffect,useRef,useState,useSyncExternalStore,type KeyboardEvent} from 'react';
import type {StandMedia} from './standMediaData';
import UiIcon from './UiIcon';
import {allowPhotoConnection,photoConnectionAllowed,subscribePhotoConnection} from './sourcePhotoConnection';

type PhotoStatus='loading'|'ready'|'error';
export default function StandPhotoViewer({media}:{media:StandMedia}){
 const enabled=useSyncExternalStore(subscribePhotoConnection,photoConnectionAllowed),[index,setIndex]=useState(0),[status,setStatus]=useState<PhotoStatus>('loading'),[retry,setRetry]=useState(0),[expanded,setExpanded]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),load=useRef<HTMLButtonElement>(null),restoreLoad=useRef(false),enlarge=useRef<HTMLButtonElement>(null),reloadControl=useRef<HTMLButtonElement>(null),photo=media.photos[index];
 useEffect(()=>{if(!photo||!enabled||status!=='loading')return;const timer=setTimeout(()=>setStatus('error'),15000);return()=>clearTimeout(timer);},[enabled,index,retry,status]);
 useEffect(()=>{if(expanded)dialog.current?.showModal();else dialog.current?.close();},[expanded]);
 useLayoutEffect(()=>{if(!enabled&&restoreLoad.current){restoreLoad.current=false;load.current?.focus();}},[enabled]);
 function choose(next:number){const bounded=(next+media.photos.length)%media.photos.length;if(bounded===index)return;setIndex(bounded);setStatus('loading');}
 function reload(){if(status==='loading')return;setStatus('loading');setRetry(n=>n+1);}
 function unload(){restoreLoad.current=true;allowPhotoConnection(false);setExpanded(false);setStatus('loading');}
 function keys(event:KeyboardEvent<HTMLDialogElement>){if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;if(event.key==='ArrowRight'){event.preventDefault();choose(index+1);}if(event.key==='ArrowLeft'){event.preventDefault();choose(index-1);}if(event.key==='Home'){event.preventDefault();choose(0);}if(event.key==='End'){event.preventDefault();choose(media.photos.length-1);}}
 if(!photo)return <div className="stand-photo-empty"><UiIcon name="camera"/><p>No matched still photo for this stand.</p></div>;
 const restricted=photo.sourceLabel.includes('アウトレット'),block=photo.sourceLabel.match(/([A-Z](?:[～〜][A-Z])?)ブロック/)?.[1]?.replace(/[～〜]/g,'–'),row=photo.sourceLabel.includes('最前列')?'front row':photo.sourceLabel.match(/(\d+)列/)?.[1];
 const photoKind=`${restricted?'Restricted-view example':'Organizer reference'}${block?' · block '+block:''}${row?' · '+(row==='front row'?row:'row '+row):''}`;
 const start=Math.max(0,Math.min(index-2,media.photos.length-5)),thumbnails=media.photos.slice(start,start+5);
 function image(enlarged=false){return <figure className={'stand-photo-figure'+(enlarged?' stand-photo-dialog-figure':'')} aria-busy={status==='loading'}>
  {status!=='error'&&<img key={`${photo.url}-${retry}`} src={photo.url} alt={`${media.name}: ${photo.sourceLabel}`} referrerPolicy="no-referrer" decoding="async" onLoad={()=>setStatus('ready')} onError={()=>setStatus('error')}/>}
  {status==='loading'&&<div className="stand-photo-status" role="status">Loading original photo…</div>}
  {status==='error'&&<div className="stand-photo-status" role="alert"><p>Source photo unavailable.</p><p>Use Retry photo below, choose another image or open the original.</p><a href={photo.url} target="_blank" rel="noreferrer">Open original image</a></div>}
  {!enlarged&&status==='ready'&&<button ref={enlarge} className="stand-photo-expand" aria-label="Enlarge stand photo" onClick={()=>setExpanded(true)}><UiIcon name="expand"/></button>}
 </figure>;}
 function navigation(enlarged=false){return <div className="stand-photo-controls"><button aria-label={enlarged?'Previous enlarged photo':'Previous stand photo'} disabled={media.photos.length<2} onClick={()=>choose(index-1)}><UiIcon name="arrow" className="photo-nav-previous"/></button><span role="status">{index+1} / {media.photos.length}</span><button aria-label={enlarged?'Next enlarged photo':'Next stand photo'} disabled={media.photos.length<2} onClick={()=>choose(index+1)}><UiIcon name="arrow"/></button></div>;}
 return <div className="stand-photo-viewer">
  {enabled?<>{image()}{navigation()}
   <div className="stand-photo-thumbnails" role="group" aria-label="Choose a stand photo">{thumbnails.map((item,offset)=>{const number=start+offset;return <button key={item.url} aria-label={`Show stand photo ${number+1}`} aria-pressed={index===number} onClick={()=>choose(number)}><img key={`${item.url}-${retry}`} src={item.url} alt="" referrerPolicy="no-referrer" loading="lazy" onLoad={event=>{event.currentTarget.style.visibility='visible';}} onError={event=>{event.currentTarget.style.visibility='hidden';}}/><span>{number+1}</span></button>;})}</div>
   <div className="stand-photo-utilities"><button ref={reloadControl} aria-disabled={status==='loading'} onClick={reload}><UiIcon name="reset"/>{status==='error'?'Retry photo':status==='loading'?'Loading…':'Reload photo'}</button><button onClick={unload}>Unload photos</button></div>
   <p className="stand-photo-kind">{photoKind}</p><p className="stand-photo-caption" lang="ja">{photo.sourceLabel}</p><a className="stand-photo-credit" href={media.source} target="_blank" rel="noreferrer">Photo source: Suzuka Circuit<UiIcon name="arrow"/></a><a className="stand-photo-file" href={photo.url} target="_blank" rel="noreferrer">Open this original photo<UiIcon name="arrow"/></a><p>Capture year unverified. This photo is not matched to a generated model seat.</p>
  </>:<div className="stand-photo-optin"><UiIcon name="camera"/><strong>{media.photos.length} original stand photos</strong><button ref={load} onClick={()=>{allowPhotoConnection(true);setStatus('loading');}}>Load stand photos</button><p>Loads original images from Suzuka Circuit while this page is open.</p></div>}
  <dialog ref={dialog} className="stand-photo-dialog" aria-label={`${media.name} original photo`} onKeyDown={keys} onCancel={()=>setExpanded(false)} onClose={()=>{setExpanded(false);(enlarge.current??reloadControl.current??load.current)?.focus();}}>
   {expanded&&<><div className="stand-photo-dialog-bar"><strong>{media.name}</strong><button autoFocus onClick={()=>setExpanded(false)} aria-label="Close enlarged photo"><UiIcon name="close"/></button></div>{image(true)}{navigation(true)}<div className="stand-photo-utilities"><button aria-disabled={status==='loading'} onClick={reload}><UiIcon name="reset"/>{status==='error'?'Retry photo':status==='loading'?'Loading…':'Reload photo'}</button><span>← → Browse · Esc Close</span></div><p className="stand-photo-dialog-kind">{photoKind}</p><p lang="ja">{photo.sourceLabel}</p><p>Capture year unverified · no generated seat match.</p><a href={media.source} target="_blank" rel="noreferrer">Suzuka Circuit · original source</a><a href={photo.url} target="_blank" rel="noreferrer">Open this original photo<UiIcon name="arrow"/></a></>}
  </dialog>
 </div>;
}
