/** Offline research helpers. Coarse SPW samples are not seat calibration. */
export function validateTerrainResearch(data) {
 if(data.status!=='research_not_connected_to_scene')throw new Error('Incomplete research cannot be used as a height field');
 const {terrain:t,track}=data;
 if(t.licence!=='CC-BY-4.0'||track.licence!=='ODbL-1.0')throw new Error('Missing independent source licences');
 if(t.request_crs!=='EPSG:4326'||t.vertical_reference!=='EPSG:5710')throw new Error('Unexpected coordinate/height reference');
 if(t.columns<2||t.rows<2||t.grid_heights_m.length!==t.rows*t.columns||t.grid_lonlat.length!==t.grid_heights_m.length)throw new Error('Incomplete terrain grid');
 if(track.points.length!==track.heights_m.length||track.node_ids.length!==track.points.length||track.lonlat.length!==track.points.length)throw new Error('Incomplete road elevation');
 if(track.node_ids[0]!==track.node_ids.at(-1)||track.heights_m[0]!==track.heights_m.at(-1))throw new Error('Road seam is not closed');
 if(t.grid_heights_m.some(h=>!Number.isFinite(h)||h<200||h>800)||track.heights_m.some(h=>!Number.isFinite(h)||h<200||h>800))throw new Error('Invalid or nodata height');
 const [west,south,east,north]=t.bbox;
 for(let row=0;row<t.rows;row++)for(let column=0;column<t.columns;column++){
  const i=row*t.columns+column,p=t.grid_lonlat[i],x=west+(east-west)*column/(t.columns-1),y=north-(north-south)*row/(t.rows-1);
  if(Math.abs(p[0]-x)>1e-7||Math.abs(p[1]-y)>1e-7)throw new Error('Grid coordinate/order mismatch');
 }
 const heights=track.heights_m;return {road_points:heights.length,grid_points:t.grid_heights_m.length,road_min_m:Math.min(...heights),road_max_m:Math.max(...heights),road_relief_m:Math.max(...heights)-Math.min(...heights)};
}

/** Outside the sampled domain is unknown; never silently extrapolate terrain. */
export function sampleResearchGrid(terrain,lon,lat){
 if(!Number.isFinite(lon)||!Number.isFinite(lat))return undefined;
 const [west,south,east,north]=terrain.bbox;if(lon<west||lon>east||lat<south||lat>north)return undefined;
 const x=(lon-west)/(east-west)*(terrain.columns-1),z=(north-lat)/(north-south)*(terrain.rows-1),column=Math.min(Math.floor(x),terrain.columns-2),row=Math.min(Math.floor(z),terrain.rows-2),u=x-column,v=z-row;
 const values=[terrain.grid_heights_m[row*terrain.columns+column],terrain.grid_heights_m[row*terrain.columns+column+1],terrain.grid_heights_m[(row+1)*terrain.columns+column],terrain.grid_heights_m[(row+1)*terrain.columns+column+1]];
 if(values.some(h=>!Number.isFinite(h)))return undefined;
 return values[0]*(1-u)*(1-v)+values[1]*u*(1-v)+values[2]*(1-u)*v+values[3]*u*v;
}
