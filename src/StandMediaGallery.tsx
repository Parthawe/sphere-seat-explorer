import {useState} from 'react';
import type {Race} from './races';
import {standMediaFor,type StandMedia} from './standMediaData';
import {OriginalVideo} from './SpectatorReferences';
import {venueStandCatalogue} from './standCatalogueData';
import {raceGuideUrl,standAnchor} from './venueReferenceData';
import UiIcon from './UiIcon';

function StandMediaDetail({media,race}:{media:StandMedia;race:Race}){
 const [videoIndex,setVideoIndex]=useState(0),video=media.videos[videoIndex];
 return <><div className="stand-media-location"><UiIcon name="map"/><div><strong>{media.name}</strong><p>{media.location}</p></div>{media.areaUrl&&<a href={media.areaUrl}>Locate area<UiIcon name="arrow"/></a>}</div>
  <div className="stand-media-content"><div>
   {video?<><label className="stand-media-select">Source camera<select aria-label="Source camera" value={videoIndex} onChange={e=>setVideoIndex(Number(e.target.value))}>{media.videos.map((v,i)=><option key={v.id} value={i}>View {String(v.sourceIndex).padStart(2,'0')} · {v.label}</option>)}</select></label><div className="stand-media-player"><OriginalVideo key={video.id} videoId={video.id} title={`${media.name} · ${video.label}`}/></div><p>{media.credit}</p><p>{media.capture}</p><a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">Open this video on YouTube<UiIcon name="arrow"/></a></>:<div className="stand-media-empty"><UiIcon name="camera"/><h4>No matched video yet.</h4><p>{media.photos.length?'The organizer provides still images for this area. Open the original photos alongside its map.':'Use the original catalogue and venue gallery. Other stands’ videos are not substituted here.'}</p></div>}
  </div><div className="stand-media-stills"><h4>Photos & location</h4><a href={media.source} target="_blank" rel="noreferrer">{race.slug==='japan'?'Original stand page':'Original ticket catalogue'}<UiIcon name="arrow"/></a>
   {media.photos.length>0&&<details><summary>{media.photos.length} original photo links</summary><ol>{media.photos.map((p,i)=><li key={p.url}><a href={p.url} target="_blank" rel="noreferrer">Photo {String(i+1).padStart(2,'0')}<UiIcon name="camera"/></a><p lang="ja">{p.sourceLabel}</p></li>)}</ol></details>}
   {media.panoramas>0&&<p>{media.panoramas} organizer 360° camera references on the original stand page.</p>}
   <p>{race.slug==='japan'?'Photo captions retain the organizer’s Japanese location labels. Images and panoramas open at their source.':'No licensed stand-specific still photo has been added here.'}</p>
   <a href={raceGuideUrl(race,standAnchor(media.id))}>View catalogue option<UiIcon name="seat"/></a>
   {race.slug==='saudi-arabia'&&<a href="https://www.jeddahcircuit.com/en/explore-the-circuit" target="_blank" rel="noreferrer">Official map & venue gallery<UiIcon name="map"/></a>}
  </div></div><p className="stand-media-limits">Source labels are not our model coordinates. Lens, capture date, obstructions and current seat correspondence are unverified.</p></>;
}
export default function StandMediaGallery({race,optionId}:{race:Race;optionId?:string}){
 const params=new URLSearchParams(location.search),stands=standMediaFor(race),requested=params.get('media')??optionId??params.get('area')??stands.find(s=>s.videos.length)?.id??stands[0]?.id;
 const [standId,setStandId]=useState(requested),media=stands.find(s=>s.id===standId),unknownName=venueStandCatalogue(race).entries.find(e=>e.id===standId)?.name;
 function chooseStand(id:string){setStandId(id);const url=new URL(location.href);url.searchParams.set('media',id);history.replaceState(history.state,'',url);}
 if(!stands.length)return null;
 return <section className="stand-media-gallery" aria-labelledby="stand-media-title"><div className="stand-media-heading"><div><p>{race.slug==='japan'?'Suzuka Circuit':'Jeddah Corniche Circuit'} / {race.season}</p><h3 id="stand-media-title">Through the lens.</h3><p>Stand videos, original photos and their source locations.</p></div><label className="stand-media-select">Viewing area<select aria-label="Media viewing area" value={standId} onChange={e=>chooseStand(e.target.value)}>{!media&&<option value={standId}>{unknownName??'Selected option'} · no matched media</option>}{stands.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label></div>
  {media?<StandMediaDetail key={media.id} media={media} race={race}/>:<p>No organizer media is matched to this option. Choose another viewing area to browse its separate references.</p>}
 </section>;
}
