import json,xml.etree.ElementTree as E,math,urllib.request
from pathlib import Path
repo=Path(__file__).resolve().parents[1];d=json.loads((repo/'research/spa/terrain-samples.json').read_text());p=Path('/tmp/apex-spa-osm.xml')
if not p.exists():p.write_bytes(urllib.request.urlopen(urllib.request.Request('https://api.openstreetmap.org/api/0.6/map?bbox=5.959,50.422,5.985,50.451',headers={'User-Agent':'ApexAtlas geographic research'}),timeout=30).read())
r=E.parse(p).getroot();ns={n.get('id'):[float(n.get('lon')),float(n.get('lat'))] for n in r.findall('node')};lon,lat=d['track']['origin']
def project(p):return [round((p[0]-lon)*111320*math.cos(math.radians(lat)),3),round(-(p[1]-lat)*111320,3)]
features=[]
for w in r.findall('way'):
 tags={t.get('k'):t.get('v') for t in w.findall('tag')}
 if tags.get('building')=='grandstand':features.append({'id':w.get('id'),'name':tags.get('name','Unnamed source footprint'),'points':[project(ns[n.get('ref')]) for n in w.findall('nd')]})
t=d['terrain'];west,south,east,north=t['bbox'];a=project([west,north]);b=project([east,south]);baseline=min(d['track']['heights_m'])
geo={'source':d['track']['source'],'licence':'ODbL-1.0','queried':d['queried'],'projection':{'origin':[lon,lat],'units':'meters','z':'south'},'points':d['track']['points'],'length_m':d['track']['length_m'],'features':features,'trackHeights':[h-baseline for h in d['track']['heights_m']],'terrain':{'bounds':a+b,'columns':t['columns'],'rows':t['rows'],'heights':[h-baseline for h in t['grid_heights_m']],'baseline':baseline,'source':t['source'],'licence':t['licence'],'credit':t['credit'],'vertical_reference':t['vertical_reference'],'modifications':'Sparse point sampling and coarse grid; heights offset by baseline. Renderer adds an authored 18–80m blend to the separately sampled road. No surveyed earthwork or chair geometry.'}}
# Authored tree samples inside licensed forest regions, not mapped tree inventory.
def inside(p,ring):
 hit=False
 for i,a in enumerate(ring):
  b=ring[i-1]
  if (a[1]>p[1])!=(b[1]>p[1]) and p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]:hit=not hit
 return hit
forests=[]
for w in r.findall('way'):
 tags={t.get('k'):t.get('v') for t in w.findall('tag')}
 if tags.get('landuse')=='forest' or tags.get('natural')=='wood':
  refs=[n.get('ref') for n in w.findall('nd')]
  if refs[0]==refs[-1]:forests.append((w.get('id'),[project(ns[n]) for n in refs]))
vegetation=[];seen=set()
west,north,east,south=geo['terrain']['bounds']
for source,ring in forests:
 for x in range(int(max(west,min(p[0] for p in ring)))+10,int(min(east,max(p[0] for p in ring)))-10,16):
  for z in range(int(max(north,min(p[1] for p in ring)))+10,int(min(south,max(p[1] for p in ring)))-10,16):
   key=(x//16,z//16)
   if key not in seen and inside([x,z],ring):
    seed=(x*73856093^z*19349663^int(source))&0xffffffff;point=[x+(seed%131)/10-6.5,z+((seed//131)%131)/10-6.5]
    if inside(point,ring):seen.add(key);vegetation.append({'id':str(int(source)*10000+len(vegetation)),'point':point})
geo['forest_samples']=[v['point'] for v in vegetation];geo['forest_sources']=[i for i,_ in forests];geo['vegetation_evidence']='Authored samples within OSM forest polygons, not mapped individual trees. Heights, crowns and event clearing are illustrative.'
for f in ['src/spa-geometry.json','public/data/spa-geometry.json']:(repo/f).write_text(json.dumps(geo,ensure_ascii=False)+'\n')
