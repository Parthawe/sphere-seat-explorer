"""Prepare a north-up area drawing from the retained ODbL GP adaptation, offline."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'src/austria-geometry.json').read_text())
p=data['points'];xs=[q[0] for q in p];zs=[q[1] for q in p]
cx=(min(xs)+max(xs))/2;cz=(min(zs)+max(zs))/2;scale=min(430/(max(xs)-min(xs)),360/(max(zs)-min(zs)))
map_data={**data,'points':[[round(310+(x-cx)*scale,3),round(285+(z-cz)*scale,3)] for x,z in p],'map_transform':{'local_center':[cx,cz],'scale':scale,'drawing_center':[310,285],'canvas':[620,570]},'vertical_evidence':'Plan-view only. Uphill/downhill GP, terrain, road and tier elevations are unmeasured; no flat 3D seat view is supplied.'}
for directory in ['src','public/data']:(ROOT/directory/'austria-track.json').write_text(json.dumps(map_data)+'\n')
