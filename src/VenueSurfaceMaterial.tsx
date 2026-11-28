import {useMemo} from 'react';import {useLoader,useThree} from '@react-three/fiber';import * as T from 'three';import {SurfaceMaterial} from './SceneMaterials';

type Props=Omit<React.ComponentProps<typeof SurfaceMaterial>,'surface'|'map'|'normalMap'|'roughnessMap'>&{surface:'grass'|'concrete'};
/** Scanned CC0 materials at an authored metre scale, never venue-photo evidence. */
export default function VenueSurfaceMaterial({surface,...props}:Props){
 const {gl}=useThree(),maps=useLoader(T.TextureLoader,[`/materials/${surface}-color.jpg`,`/materials/${surface}-normal.jpg`,`/materials/${surface}-roughness.jpg`]);
 useMemo(()=>maps.forEach((t,i)=>{const anisotropy=Math.min(4,gl.capabilities.getMaxAnisotropy());if(t.wrapS!==T.RepeatWrapping||t.anisotropy!==anisotropy){t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=anisotropy;if(!i)t.colorSpace=T.SRGBColorSpace;t.needsUpdate=true;}}),[maps,gl]);
 return <SurfaceMaterial {...props} surface={surface} map={maps[0]} normalMap={maps[1]} roughnessMap={maps[2]} normalScale={new T.Vector2(surface==='grass'?.65:.3,surface==='grass'?.65:.3)} worldMapScale={surface==='grass'?.4:.5}/>;
}
