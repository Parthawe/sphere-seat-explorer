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
  if refs and refs[-1]!=part[0]:raise ValueError('Disconnected source ways: review required')
  refs+=part if not refs else part[1:]
 if refs[0]!=refs[-1]:raise ValueError('Track is not closed')
 lon,lat=cfg['origin']
 def project(p):return [round((p[0]-lon)*111320*math.cos(math.radians(lat)),2),round(-(p[1]-lat)*111320,2)]
 track=[project(nodes[k]) for k in refs];length=sum(math.dist(a,b) for a,b in zip(track,track[1:]));features=[]
 if not 5000<length<5600:raise ValueError('Unexpected circuit length: review required')
 for way_id in cfg['features']:
  w=ways[way_id];tags={t.attrib['k']:t.attrib['v'] for t in w.findall('tag')}
  features.append({'id':way_id,'name':tags.get('name','Permanent grandstand footprint (unnamed in OSM)'),'points':[project(nodes[n.attrib['ref']]) for n in w.findall('nd')]})
 data={'source':'https://www.openstreetmap.org/way/'+cfg['ways'][0],'queried':str(datetime.date.today()),'licence':'ODbL-1.0','ways':cfg['ways'],'length_m':round(length),'projection':{'origin':cfg['origin'],'units':'meters','z':'south'},'points':track,'features':features}
 for directory in ['src','public/data']:(ROOT/directory/(venue+'-geometry.json')).write_text(json.dumps(data)+'\n')
 print(venue,len(track),'track vertices;',len(features),'features')
