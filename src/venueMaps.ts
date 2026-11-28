import {raceLocation} from './globeGeography';
import type {Race} from './races';
export function venueMapLinks(race:Pick<Race,'season'|'slug'>){
 const location=raceLocation(race);if(!location)return null;
 const center=`${location.latitude},${location.longitude}`;
 return {location,center,satellite:'https://www.google.com/maps/@?'+new URLSearchParams({api:'1',map_action:'map',center,zoom:'15',basemap:'satellite'}),street:'https://www.google.com/maps/@?'+new URLSearchParams({api:'1',map_action:'pano',viewpoint:center})};
}
/** Official keyed Embed API, loaded only following an explicit visitor action. */
export function satelliteEmbedUrl(race:Pick<Race,'season'|'slug'>,key:string|undefined){
 const maps=venueMapLinks(race);if(!maps||!key||!/^AIza[\w-]{20,100}$/.test(key))return null;
 return 'https://www.google.com/maps/embed/v1/view?'+new URLSearchParams({key,center:maps.center,zoom:'15',maptype:'satellite'});
}
