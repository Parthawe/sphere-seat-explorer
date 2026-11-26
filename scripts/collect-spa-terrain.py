"""Collect a bounded, cached SPW terrain research sample. No live runtime feed.
CC BY 4.0 SPW heights and ODbL OSM line remain separately attributed.
Uses one request at a time, pauses between calls and stops on access/errors.
"""
import argparse,datetime,json,math,time,urllib.parse,urllib.request,urllib.robotparser,xml.etree.ElementTree as ET
from pathlib import Path
SERVICE='https://geoservices.wallonie.be/arcgis/rest/services/RELIEF/WALLONIE_MNT_2021_2022/MapServer'
CATALOGUE='https://geoportail.wallonie.be/catalogue/a004e570-99d6-4fe5-b83d-49b774409278.html'
USER_AGENT='F1TicketsOnline geographic research'
ROOT=Path(__file__).resolve().parents[1]

def gp_trace(path):
 root=ET.parse(path).getroot();nodes={n.attrib['id']:[float(n.attrib['lon']),float(n.attrib['lat'])] for n in root.findall('node')};ways={w.attrib['id']:w for w in root.findall('way')}
 relation=next(r for r in root.findall('relation') if r.attrib['id']=='284560')
 ids=list(dict.fromkeys(m.attrib['ref'] for m in relation.findall('member') if m.attrib['type']=='way' and m.attrib.get('role')!='pit_lane'))
 parts={i:[n.attrib['ref'] for n in ways[i].findall('nd')] for i in ids};ordered=[ids[0]];refs=parts.pop(ids[0])
 while parts:
  for i,part in list(parts.items()):
   if part[0]==refs[-1]:refs+=part[1:]
   elif part[-1]==refs[-1]:refs+=list(reversed(part))[1:]
   else:continue
   ordered.append(i);del parts[i];break
  else:raise ValueError('Disconnected source ways')
 if refs[0]!=refs[-1]:raise ValueError('Open GP trace')
 index=refs[:-1].index('258602622');refs=refs[index:-1]+refs[:index]+[refs[index]]
 origin=[5.971,50.438]
 def project(p):return [round((p[0]-origin[0])*111320*math.cos(math.radians(origin[1])),3),round(-(p[1]-origin[1])*111320,3)]
 points=[project(nodes[n]) for n in refs];length=sum(math.dist(a,b) for a,b in zip(points,points[1:]))
 if not 6900<length<7100:raise ValueError('Unexpected GP trace length')
 return {'licence':'ODbL-1.0','source':'https://www.openstreetmap.org/relation/284560','ways':ordered,'origin':origin,'length_m':round(length),'node_ids':refs,'lonlat':[nodes[n] for n in refs],'points':points}

def fetch(url):
 request=urllib.request.Request(url,headers={'User-Agent':USER_AGENT})
 with urllib.request.urlopen(request,timeout=25) as response:return response.read()

def checkpoint_partial(path,trace,cache,reason):
 heights=[cache.get(','.join(f'{n:.8f}' for n in p)) for p in trace['lonlat']]
 data={'status':'partial_research_not_connected_to_scene','queried':datetime.datetime.now(datetime.timezone.utc).isoformat(),'stop_reason':str(reason),'terrain':{'licence':'CC-BY-4.0','source':CATALOGUE,'service':SERVICE,'service_layer':'Relief Wallonie - MNT 2021-2022 - 50cm','request_crs':'EPSG:4326','vertical_reference':'EPSG:5710','source_acquisition':'2021-2022','source_updated':'2024-01-23','credit':'Service public de Wallonie (SPW) - Relief de la Wallonie - Modèle Numérique de Terrain (MNT) 2021-2022 (2024-01-23)','modifications':'Sparse identify point sampling with eight-decimal request coordinates; raw returned values retained in meters. Partial road samples only, no full terrain crop or interpolated height field.'},'track':{**trace,'heights_m':heights},'sample_cache':cache}
 path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(data,ensure_ascii=False)+'\n')

def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--input',type=Path,required=True);parser.add_argument('--output',type=Path,default=ROOT/'research/spa/terrain-samples.json');parser.add_argument('--limit',type=int,default=800,help='Maximum new numeric queries; cache makes resumes cheap');parser.add_argument('--delay',type=float,default=.7,help='Seconds to pause after each sequential request');args=parser.parse_args()
 if not .5<=args.delay<=10:parser.error('--delay must be between .5 and 10 seconds')
 trace=gp_trace(args.input);cache_path=args.output.with_suffix('.cache.json');partial_path=args.output.with_name('terrain-partial.json');cache=json.loads(cache_path.read_text()) if cache_path.exists() else (json.loads(partial_path.read_text()).get('sample_cache',{}) if partial_path.exists() else {})
 robots=urllib.robotparser.RobotFileParser();robots.set_url('https://geoservices.wallonie.be/robots.txt')
 try:robots.parse(fetch(robots.url).decode().splitlines())
 except urllib.error.HTTPError as error:
  if error.code!=404:raise
  robots.parse([])
 if not robots.can_fetch(USER_AGENT,SERVICE+'/identify'):raise RuntimeError('Robots restriction: stopped')
 metadata=json.loads(fetch(SERVICE+'?f=json'));layer=json.loads(fetch(SERVICE+'/0?f=json'))
 if layer.get('type')!='Raster Layer' or 'MNT' not in layer.get('name',''):raise RuntimeError('Source layer changed')
 bbox=[5.959,50.422,5.985,50.451];cols,rows=17,25;grid=[[round(bbox[0]+x*(bbox[2]-bbox[0])/(cols-1),8),round(bbox[3]-z*(bbox[3]-bbox[1])/(rows-1),8)] for z in range(rows) for x in range(cols)]
 calls=0
 def height(p):
  nonlocal calls
  key=','.join(f'{n:.8f}' for n in p)
  if key in cache:return cache[key]
  if calls>=args.limit:raise RuntimeError('Bounded query limit reached; resume from cache')
  params={'f':'json','geometry':key,'geometryType':'esriGeometryPoint','sr':'4326','mapExtent':','.join(map(str,bbox)),'imageDisplay':'4096,4096,96','tolerance':'0','layers':'all:0','returnGeometry':'false'}
  data=json.loads(fetch(SERVICE+'/identify?'+urllib.parse.urlencode(params)))
  if data.get('error'):raise RuntimeError(data['error'])
  results=data.get('results',[])
  if len(results)!=1 or results[0].get('layerId')!=0:raise ValueError('Missing/ambiguous raster result')
  value=results[0].get('attributes',{}).get('Stretch.Pixel Value');h=float(value)
  if not math.isfinite(h) or not 200<h<800:raise ValueError('Invalid/nodata Spa elevation')
  cache[key]=h;calls+=1;cache_path.parent.mkdir(parents=True,exist_ok=True);cache_path.write_text(json.dumps(cache,sort_keys=True)+'\n');time.sleep(args.delay)
  if calls%50==0:print('cached',len(cache),flush=True)
  return h
 try:
  track_heights=[height(p) for p in trace['lonlat']];grid_heights=[height(p) for p in grid]
 except Exception as error:
  checkpoint_partial(partial_path,trace,cache,error);raise
 data={'status':'research_not_connected_to_scene','queried':datetime.datetime.now(datetime.timezone.utc).isoformat(),'terrain':{'licence':'CC-BY-4.0','source':CATALOGUE,'service':SERVICE,'service_layer':layer['name'],'service_spatial_reference':metadata['spatialReference'],'request_crs':'EPSG:4326','vertical_reference':'EPSG:5710','source_acquisition':'2021-2022','source_updated':'2024-01-23','credit':'Service public de Wallonie (SPW) - Relief de la Wallonie - Modèle Numérique de Terrain (MNT) 2021-2022 (2024-01-23)','modifications':'Sparse identify point sampling, rounded query coordinates and uniform coarse-grid arrangement; not a 0.5m-resolution crop. Raw returned elevation values retained in meters.','bbox':bbox,'columns':cols,'rows':rows,'order':'north to south rows, west to east columns','grid_lonlat':grid,'grid_heights_m':grid_heights},'track':{**trace,'heights_m':track_heights}}
 args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(data,ensure_ascii=False)+'\n');print('complete',len(track_heights),'track points',len(grid_heights),'grid points','new calls',calls,flush=True)
if __name__=='__main__':main()
