"""Refresh bounded OSM geometry. Public API only; no imagery or ticket data.
All outputs are adaptations under ODbL-1.0. Review source changes before deployment.
"""
import argparse,datetime,json,math,urllib.request,xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCES={
 'qatar':{'bbox':'51.44,25.48,51.47,25.51','origin':[51.452,25.49],'ways':['152483595','1553605580'],'features':['152483596']},
 'bahrain':{'bbox':'50.50,26.02,50.53,26.05','origin':[50.514,26.033],'ways':['4818385','881756729','881756728'],'features':['187123414','187123419','187123438','271535959','271535961','271535964','271535967','271535981','271535984']},
 'yas':{'bbox':'54.598,24.462,54.612,24.480','origin':[54.605,24.471],'ways':['168477013','1469184731','1469184732','188337196','1255169703','1255169704'],'features':['188731381','168411369','133907352','133907079','133907081']}}
SOURCES['albert-park']={'bbox': '144.961,-37.857,144.984,-37.836', 'origin': [144.972, -37.847], 'ways': ['987030977', '784076843', '784076839', '987030969', '1070446542', '784087846', '987030978', '987030966', '784083210', '987030982', '1050371045', '1013633268', '1013633269', '1050342733', '1021617920', '1021617874', '15856988', '979723480', '987030968', '784071296', '979723479', '979723477', '1253159342', '979723478', '1126808201', '987030972', '987030985', '987030974', '987030973', '784076847'], 'features': [], 'water_relation': '346429', 'trees': True, 'start': '9123374386'}
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('venues',nargs='*')
parser.add_argument('--input',type=Path,help='Use an already retrieved public OSM XML snapshot for one selected venue')
args=parser.parse_args()
selected=args.venues or list(SOURCES)
if any(v not in SOURCES for v in selected):parser.error('Unknown venue')
if args.input and len(selected)!=1:parser.error('--input requires exactly one venue')
for venue in selected:
 cfg=SOURCES[venue]
 url='https://api.openstreetmap.org/api/0.6/map?bbox='+cfg['bbox']
 request=urllib.request.Request(url,headers={'User-Agent':'ApexAtlas geographic research'})
 if args.input:root=ET.parse(args.input).getroot()
 else:
  with urllib.request.urlopen(request,timeout=30) as response:root=ET.fromstring(response.read())
 nodes={n.attrib['id']:[float(n.attrib['lon']),float(n.attrib['lat'])] for n in root.findall('node')}
 ways={w.attrib['id']:w for w in root.findall('way')};refs=[]
 for way_id in cfg['ways']:
  part=[n.attrib['ref'] for n in ways[way_id].findall('nd')]
  if refs and refs[-1]==part[-1]:part.reverse()
  if refs and refs[-1]!=part[0]:raise ValueError('Disconnected source ways: review required')
  refs+=part if not refs else part[1:]
 if refs[0]!=refs[-1]:raise ValueError('Track is not closed')
 if cfg.get('start'):
  unique=refs[:-1];index=unique.index(cfg['start']);refs=unique[index:]+unique[:index]+[cfg['start']]
 lon,lat=cfg['origin']
 def project(p):return [round((p[0]-lon)*111320*math.cos(math.radians(lat)),2),round(-(p[1]-lat)*111320,2)]
 track=[project(nodes[k]) for k in refs];length=sum(math.dist(a,b) for a,b in zip(track,track[1:]));features=[]
 if not 5000<length<5600:raise ValueError('Unexpected circuit length: review required')
 for way_id in cfg['features']:
  w=ways[way_id];tags={t.attrib['k']:t.attrib['v'] for t in w.findall('tag')}
  features.append({'id':way_id,'name':tags.get('name','Permanent grandstand footprint (unnamed in OSM)'),'points':[project(nodes[n.attrib['ref']]) for n in w.findall('nd')]})
 if cfg.get('water_relation'):
  rel=next(r for r in root.findall('relation') if r.attrib['id']==cfg['water_relation'])
  outer=[[n.attrib['ref'] for n in ways[m.attrib['ref']].findall('nd')] for m in rel.findall('member') if m.attrib.get('role')=='outer']
  ring=outer.pop(0)
  while outer:
   for i,part in enumerate(outer):
    if part[0]==ring[-1]:ring+=part[1:];outer.pop(i);break
    if part[-1]==ring[-1]:ring+=list(reversed(part))[1:];outer.pop(i);break
   else:raise ValueError('Disconnected lake boundary')
  if ring[0]!=ring[-1]:raise ValueError('Open lake boundary')
  parts=[[n.attrib['ref'] for n in ways[m.attrib['ref']].findall('nd')] for m in rel.findall('member') if m.attrib.get('role')=='inner']
  holes=[]
  while parts:
   ring_inner=parts.pop(0)
   while ring_inner[0]!=ring_inner[-1]:
    for i,part in enumerate(parts):
     if part[0]==ring_inner[-1]:ring_inner+=part[1:];parts.pop(i);break
     if part[-1]==ring_inner[-1]:ring_inner+=list(reversed(part))[1:];parts.pop(i);break
    else:raise ValueError('Open lake island')
   holes.append([project(nodes[n]) for n in ring_inner])
  features.append({'id':cfg['water_relation'],'name':'Albert Park Lake','kind':'water','points':[project(nodes[n]) for n in ring],'holes':holes})
 vegetation=[]
 if cfg.get('trees'):
  x0,x1=min(p[0] for p in track)-100,max(p[0] for p in track)+100;z0,z1=min(p[1] for p in track)-100,max(p[1] for p in track)+100
  for n in root.findall('node'):
   if any(t.attrib.get('k')=='natural' and t.attrib.get('v')=='tree' for t in n.findall('tag')):
    p=project(nodes[n.attrib['id']])
    if x0<p[0]<x1 and z0<p[1]<z1:vegetation.append({'id':n.attrib['id'],'point':p})
 data={'source':'https://www.openstreetmap.org/way/'+cfg['ways'][0],'queried':str(datetime.datetime.now(datetime.timezone.utc).date()),'licence':'ODbL-1.0','ways':cfg['ways'],'length_m':round(length),'projection':{'origin':cfg['origin'],'units':'meters','z':'south'},'points':track,'features':features}
 if vegetation:data['vegetation']=vegetation
 for directory in ['src','public/data']:(ROOT/directory/(venue+'-geometry.json')).write_text(json.dumps(data)+'\n')
 print(venue,len(track),'track vertices;',len(features),'features')
