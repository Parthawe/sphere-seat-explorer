"""Adapt bounded OSM street/coastline data for an illustrative Monaco area map.
Current relation membership contains a pit-exit branch and split-way stubs.
Explicit endpoint trims below use retained licensed source nodes, never invented joins.
No race survey, elevation or venue imagery is reconstructed. ODbL-1.0.
"""
import argparse,datetime,json,math,xml.etree.ElementTree as E
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--input',type=Path,required=True);a=p.parse_args()
r=E.parse(a.input).getroot();ways={w.get('id'):w for w in r.findall('way')};nodes={n.get('id'):[float(n.get('lon')),float(n.get('lat'))] for n in r.findall('node')}
tags=lambda w:{t.get('k'):t.get('v') for t in w.findall('tag')}
refs=lambda id:[n.get('ref') for n in ways[id].findall('nd')]
rel=r.find("relation[@id='148194']");ids=[m.get('ref') for m in rel.findall('member') if m.get('type')=='way' and not m.get('role') and m.get('ref')!='1388331347']
parts={id:refs(id) for id in ids};parts['1551240829']=parts['1551240829'][parts['1551240829'].index('14109303023'):]
alice=refs('35092475');i,j=alice.index('918118157'),alice.index('12571844664');parts['35092475']=alice[min(i,j):max(i,j)+1]
ordered=['39839529'];path=parts[ordered[0]][:];remaining=set(parts)-set(ordered)
while remaining:
 cs=[id for id in remaining if path[-1] in [parts[id][0],parts[id][-1]]]
 if len(cs)!=1:raise ValueError('Route branch/disconnection '+str(cs))
 id=cs[0];part=parts[id];part=part if part[0]==path[-1] else list(reversed(part));path+=part[1:];ordered.append(id);remaining.remove(id)
if path[0]!=path[-1]:raise ValueError('Open route')
origin=[7.423,43.737]
def world(id):
 lon,lat=nodes[id];return [(lon-origin[0])*111320*math.cos(math.radians(origin[1])),-(lat-origin[1])*111320]
track=[world(n) for n in path];length=sum(math.dist(a,b) for a,b in zip(track,track[1:]))
if not 3250<length<3400:raise ValueError('Unexpected Monaco route length')
x0,x1=min(p[0] for p in track),max(p[0] for p in track);z0,z1=min(p[1] for p in track),max(p[1] for p in track);scale=min(440/(x1-x0),370/(z1-z0))
def project(p):return [round(310+(p[0]-(x0+x1)/2)*scale,2),round(270+(p[1]-(z0+z1)/2)*scale,2)]
coast={id:refs(id) for id,w in ways.items() if tags(w).get('natural')=='coastline' and refs(id)[0]!=refs(id)[-1]};chains=[]
while coast:
 id,chain=coast.popitem();used=[id];changed=True
 while changed:
  changed=False
  for id,part in list(coast.items()):
   if chain[-1]==part[0]:chain+=part[1:]
   elif chain[-1]==part[-1]:chain+=list(reversed(part))[1:]
   elif chain[0]==part[-1]:chain=part[:-1]+chain
   elif chain[0]==part[0]:chain=list(reversed(part))[:-1]+chain
   else:continue
   used.append(id);del coast[id];changed=True;break
 chains.append((chain,used))
chain,coastids=max(chains,key=lambda x:len(x[0]));shore=[project(world(n)) for n in chain]
# Orient SW -> NE and close outside the canvas on its seaward side.
if shore[0][0]>shore[-1][0]:shore.reverse()
water=shore+[[2000,shore[-1][1]],[2000,2000],[-2000,2000],shore[0]]
segments=[{'id':id,'name':tags(ways[id]).get('name','Street route'),'mapCenter':project([sum(world(n)[i] for n in parts[id])/len(parts[id]) for i in [0,1]]),'tunnel':tags(ways[id]).get('tunnel')=='yes'} for id in ordered]
d={'source':'https://www.openstreetmap.org/relation/148194','licence':'ODbL-1.0','queried':str(datetime.datetime.now(datetime.timezone.utc).date()),'ways':ordered,'excluded_ways':['850261588','1388331347'],'length_m':round(length),'projection':{'origin':origin,'units':'2D map pixels','meters_per_pixel':1/scale,'x':'east','y':'south'},'points':[project(p) for p in track],'world_points':[[round(v,2) for v in p] for p in track],'segments':segments,'water':water,'water_sources':coastids,'water_evidence':'Connected licensed coastline with authored seaward closure outside the SVG canvas; not a harbour/event survey','route_adaptations':[{'way':'35092475','from_node':'918118157','to_node':'12571844664','reason':'Bounded source Avenue Princesse Alice segment closes a current relation split-way gap'},{'way':'1551240829','from_node':'14109303023','reason':'Trim current split-way junction stub; remaining part follows Avenue de Monte-Carlo'}],'evidence':'Source street-centerline interpretation; excludes pit lane and pit-exit branch. Current relation also carries urban split-way stubs; explicit licensed-node trims recorded. No surveyed 2027 racing line, terrain or tunnel profile.'}
root=Path(__file__).resolve().parents[1]
for f in [root/'src/monaco-track.json',root/'public/data/monaco-track.json']:f.write_text(json.dumps(d)+'\n')
print(json.dumps({'ways':len(ordered),'vertices':len(track),'length_m':round(length),'coastline_ways':len(coastids),'segments':segments},ensure_ascii=False))
