"""Adapt a bounded public OSM XML snapshot into a 2D Suzuka area map.
No imagery, seats or elevation are reconstructed. Output is ODbL-1.0.
"""
import argparse,datetime,json,math,xml.etree.ElementTree as E
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--input',type=Path,required=True);a=p.parse_args()
r=E.parse(a.input).getroot();ways={w.get('id'):w for w in r.findall('way')};nodes={n.get('id'):[float(n.get('lon')),float(n.get('lat'))] for n in r.findall('node')}
tags=lambda w:{t.get('k'):t.get('v') for t in w.findall('tag')}
relation=r.find("relation[@id='284570']");ids=[m.get('ref') for m in relation.findall('member') if m.get('type')=='way' and not m.get('role')]
refs=lambda id:[n.get('ref') for n in ways[id].findall('nd')]
ordered=['183391665'];path=refs(ordered[0]);remaining=set(ids)-set(ordered)
while remaining:
 candidates=[id for id in remaining if refs(id)[0]==path[-1]]
 if len(candidates)!=1:raise ValueError('Review route branch: '+str(candidates))
 id=candidates[0];path+=refs(id)[1:];ordered.append(id);remaining.remove(id)
if path[0]!=path[-1]:raise ValueError('Open GP loop')
origin=[136.537,34.845]
def meters(n):
 lon,lat=nodes[n];return [(lon-origin[0])*111320*math.cos(math.radians(origin[1])),-(lat-origin[1])*111320]
world=[meters(n) for n in path];length=sum(math.dist(a,b) for a,b in zip(world,world[1:]))
if not 5750<length<5900:raise ValueError('Unexpected GP length')
minx,maxx=min(p[0] for p in world),max(p[0] for p in world);minz,maxz=min(p[1] for p in world),max(p[1] for p in world);scale=min(510/(maxx-minx),380/(maxz-minz))
def project(p):return [round(310+(p[0]-(minx+maxx)/2)*scale,2),round(280+(p[1]-(minz+maxz)/2)*scale,2)]
features=[]
for id,w in ways.items():
 t=tags(w)
 if t.get('grandstand')=='yes':
  ring=[meters(n) for n in refs(id)];features.append({'id':id,'name':t.get('name','Unnamed grandstand'),'points':[[round(v,2) for v in p] for p in ring],'mapCenter':project([sum(p[i] for p in ring[:-1])/len(ring[:-1]) for i in [0,1]])})
data={'source':'https://www.openstreetmap.org/relation/284570','licence':'ODbL-1.0','queried':str(datetime.datetime.now(datetime.timezone.utc).date()),'ways':ordered,'excluded_ways':['120917578'],'length_m':round(length),'projection':{'origin':origin,'units':'2D map pixels','meters_per_pixel':1/scale,'x':'east','y':'south'},'points':[project(p) for p in world],'world_points':[[round(v,2) for v in p] for p in world],'features':features,'grade_separation':{'upper_way':'175231434','lower_way':'183391655','evidence':'OSM bridge=yes/layer=1 above covered=yes GP segment; no measured clearance or terrain supplied','upper_map_points':[project(meters(n)) for n in refs('175231434')]}}
root=Path(__file__).resolve().parents[1]
for d in ['src','public/data']:(root/d/'suzuka-track.json').write_text(json.dumps(data)+'\n')
print(json.dumps({'ways':len(ordered),'vertices':len(path),'length_m':round(length),'features':[(f['name'],f['mapCenter']) for f in features]},indent=2))
