"""Collect nearby OSM building footprints; elevations remain illustrative.
Use --snapshot-dir to reproduce a reviewed download without another API request.
"""
import argparse,datetime,json,math,urllib.request,xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
VENUES={'qatar':([51.452,25.49],'51.44,25.48,51.47,25.51'),'bahrain':([50.514,26.033],'50.50,26.02,50.53,26.05'),'yas':([54.605,24.471],'54.598,24.462,54.612,24.480')}
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--snapshot-dir',type=Path);args=p.parse_args();venues={}
for venue,(origin,bbox) in VENUES.items():
 url='https://api.openstreetmap.org/api/0.6/map?bbox='+bbox
 if args.snapshot_dir:root=ET.parse(args.snapshot_dir/('f1-'+venue+'-context.osm')).getroot()
 else:
  with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'F1TicketsOnline geographic research'}),timeout=30) as response:root=ET.fromstring(response.read())
 nodes={n.attrib['id']:[float(n.attrib['lon']),float(n.attrib['lat'])] for n in root.findall('node')}
 geometry=json.loads((ROOT/'src'/f'{venue}-geometry.json').read_text());track=geometry['points'];exclude={str(f['id']) for f in geometry['features']};buildings=[]
 for w in root.findall('way'):
  tags={t.attrib['k']:t.attrib['v'] for t in w.findall('tag')};refs=[n.attrib['ref'] for n in w.findall('nd')]
  if tags.get('building') not in ['yes','commercial','office','hotel','sports_centre'] or w.attrib['id'] in exclude or len(refs)<4 or refs[0]!=refs[-1]:continue
  points=[[round((nodes[n][0]-origin[0])*111320*math.cos(math.radians(origin[1])),2),round(-(nodes[n][1]-origin[1])*111320,2)] for n in refs]
  cx=sum(a[0] for a in points)/len(points);cz=sum(a[1] for a in points)/len(points)
  distance=min(math.hypot(a[0]-cx,a[1]-cz) for a in track);area=abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(points,points[1:])))/2
  if distance>220 or area<250:continue
  buildings.append({'id':w.attrib['id'],'name':tags.get('name:en',tags.get('name','')),'points':points,'height':12 if area>5000 else 6,'heightEvidence':'illustrative massing; source supplies horizontal footprint only'})
 venues['united-arab-emirates' if venue=='yas' else venue]={'source':url,'queried':datetime.date.today().isoformat(),'origin':origin,'buildings':buildings}
 print(venue,len(buildings),'reviewed footprint candidates')
(ROOT/'src'/'venue-context.json').write_text(json.dumps({'licence':'ODbL-1.0; © OpenStreetMap contributors','scope':'Buildings with closed footprints, area ≥250 m², centroid within 220 m of a sampled circuit point. Existing modeled feature IDs excluded. Horizontal footprint only; no surveyed elevations, facade or seat sightline guarantee.','venues':venues},separators=(',',':'))+'\n')
