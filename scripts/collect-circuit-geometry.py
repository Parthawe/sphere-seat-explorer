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
SOURCES['silverstone']={'bbox': '-1.035,52.062,-1.005,52.086', 'origin': [-1.02, 52.074], 'ways': ['169800225', '169848882', '169800224', '169800222', '169618242', '169618240', '169618241', '169618245', '169609611', '169730588', '3571477', '169730585', '169730587', '169733768', '169730586', '430075118', '169733766', '169733769', '169733770', '169848880', '169848884', '169848881', '55224168', '55224167', '169854842', '169800226', '169800223'], 'features': ['227332429', '227342440', '227342441', '227342444', '227342445', '227342446', '227342447', '227342448', '227342449', '227342450', '227342451', '227342452', '227342453', '227342454', '227342456', '227342458', '227342459', '1387956625', '1430486596', '1560504709', '1560504711', '1560504712', '1560504713'], 'trees': True, 'start': '2364624111', 'length_range': [5800, 6000]}
SOURCES['monza']={'bbox': '9.265,45.600,9.299,45.640', 'origin': [9.281, 45.62], 'ways': ['179968257', '179968234', '19842206', '179968242', '179968264', '179968220', '179968262', '179968245', '179968263', '179968229', '179968251', '179968230', '179968252', '179968228', '1443867792', '1443867793', '179968254', '179968226', '179968249', '179968239'], 'features': ['34404645', '179794158', '193647795', '193647796', '194457664', '194457666', '194457667', '194457668', '194457670', '194457671', '194457672', '194457674', '194457675', '194457677', '194457679', '194457680', '194457681', '194457682', '194457684', '194457685', '194457686', '194457687', '194457688', '194457689', '194457690', '194457691', '194457692', '194457693', '194742580', '231026018', '231026019', '231026020', '231026024', '231026025', '231026027', '231257063', '231260684', '231265139', '231265140', '233132517', '338984705', '338984712', '561721691', '1529562455'], 'trees': True, 'start': '1828499259', 'length_range': [5750, 5850], 'forest_samples': True, 'relation': '284565'}
SOURCES['shanghai']={'bbox':'121.207,31.325,121.231,31.350','origin':[121.218,31.338],'ways':['156328670'],'features':['107371135','1372223261','1372223262','156341844','156341848','156341851'],'relation':'2094941','trees':True,'length_range':[5400,5500]}
SOURCES['miami']={'bbox':'-80.249,25.949,-80.226,25.967','origin':[-80.238,25.958],'ways':['1017340351','1485453204','1472684485','1485453202','1485453200','1472686141','1485453197'],'features':['171419981','171419978'],'trees':True,'length_range':[5350,5500]}
SOURCES['canada']={'bbox':'-73.54,45.49,-73.515,45.515','origin':[-73.527,45.503],'ways':['136717490'],'features':['129924946','1566564121','1243714696','1243714697','1243714698','1243714699','1381122382'],'water_relation':'2223658','water_name':'Lac des régates','trees':True,'length_range':[4300,4430],'relation':'284595'}
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
 if not cfg.get('length_range',[5000,5600])[0]<length<cfg.get('length_range',[5000,5600])[1]:raise ValueError('Unexpected circuit length: review required')
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
  features.append({'id':cfg['water_relation'],'name':cfg.get('water_name','Albert Park Lake'),'kind':'water','points':[project(nodes[n]) for n in ring],'holes':holes})
 vegetation=[]
 if cfg.get('trees') or cfg.get('forest_samples'):
  x0,x1=min(p[0] for p in track)-100,max(p[0] for p in track)+100;z0,z1=min(p[1] for p in track)-100,max(p[1] for p in track)+100
  for n in root.findall('node'):
   if any(t.attrib.get('k')=='natural' and t.attrib.get('v')=='tree' for t in n.findall('tag')):
    p=project(nodes[n.attrib['id']])
    if x0<p[0]<x1 and z0<p[1]<z1:vegetation.append({'id':n.attrib['id'],'point':p})
 forest_sources=[]
 if cfg.get('forest_samples'):
  def inside(point,ring):
   hit=False
   for i,a in enumerate(ring):
    b=ring[i-1]
    if (a[1]>point[1])!=(b[1]>point[1]) and point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0]:hit=not hit
   return hit
  seen=set()
  for way_id,w in ways.items():
   tags={t.attrib['k']:t.attrib['v'] for t in w.findall('tag')};part=[n.attrib['ref'] for n in w.findall('nd')]
   if not (tags.get('landuse')=='forest' or tags.get('natural')=='wood') or part[0]!=part[-1]:continue
   ring=[project(nodes[n]) for n in part];forest_sources.append(way_id)
   for x in range(int(max(x0,min(p[0] for p in ring)))+10,int(min(x1,max(p[0] for p in ring)))-10,22):
    for z in range(int(max(z0,min(p[1] for p in ring)))+10,int(min(z1,max(p[1] for p in ring)))-10,22):
     key=(x//22,z//22);seed=(x*73856093^z*19349663^int(way_id))&0xffffffff;point=[round(x+(seed%131)/10-6.5,2),round(z+((seed//131)%131)/10-6.5,2)]
     if key not in seen and inside(point,ring):
      seen.add(key);vegetation.append({'id':str(int(way_id)*10000+len(vegetation)),'point':point})
 data={'source':('https://www.openstreetmap.org/relation/'+cfg['relation']) if cfg.get('relation') else 'https://www.openstreetmap.org/way/'+cfg['ways'][0],'queried':str(datetime.datetime.now(datetime.timezone.utc).date()),'licence':'ODbL-1.0','ways':cfg['ways'],'length_m':round(length),'projection':{'origin':cfg['origin'],'units':'meters','z':'south'},'points':track,'features':features}
 if cfg.get('relation'):data['relation']=cfg['relation']
 if venue=='miami':data['excluded_ways']=['1017340352','1233165737','1485453201','1485454063'];data['route_evidence']='Explicit seven-way GP centerline interpretation, checked against the 19-turn GP layout and length. Venue relation 20204222 nests a shorter MIA configuration and is not used as the GP route. Pit lane and short connectors excluded.'
 if venue=='miami':
  for f in data['features']:
   f['kind']='stadium' if f['id']=='171419981' else 'pitch'
   if f['id']=='171419978':f['name']='Stadium field · source pitch outline'
 if venue=='canada':
  data['excluded_ways']=['413000959'];data['route_evidence']='Relation 284595 main_track member 136717490 is the closed GP circuit; pit_lane member 413000959 excluded. Source start vertex is not a calibrated timing line. Current physical geography is not a surveyed 2027 event layout.'
  for f in data['features']:
   if f['id'] in ['129924946','1566564121']:f['kind']='water'
   elif f['id']!='2223658':f['kind']='unassigned-bleachers';f['name']='Unassigned source bleacher envelope'
 if venue=='shanghai':data['source_context']={'main_grandstand_height_tag':{t.attrib['k']:t.attrib['v'] for t in ways['107371135'].findall('tag')}.get('height'),'height_evidence':'Raw OSM building-height tag, not a measured canopy profile or seat elevation'}
 if vegetation:data['vegetation']=vegetation
 if forest_sources:data['forest_sources']=forest_sources;data['vegetation_evidence']='Mapped individual tree points plus authored jittered samples inside closed OSM forest/wood ways; not a tree inventory or multipolygon-hole reconstruction. Crowns, heights and event clearing are authored.'
 for directory in ['src','public/data']:(ROOT/directory/(venue+'-geometry.json')).write_text(json.dumps(data)+'\n')
 print(venue,len(track),'track vertices;',len(features),'features')
