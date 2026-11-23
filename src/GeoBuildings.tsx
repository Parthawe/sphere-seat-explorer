import { buildingHeight } from "./rendering";
import { useEffect, useMemo } from "react";
import * as T from "three";
import data from "./buildings.json";
export default function GeoBuildings({
  track,
}: {
  track: { x: number; z: number }[];
}) {
  const geometry = useMemo(
    () =>
      data.buildings.flatMap((b) => {
        const cx = b.outline.reduce((n, p) => n + p[0], 0) / b.outline.length,
          cz = b.outline.reduce((n, p) => n + p[1], 0) / b.outline.length;
        // The race geometry is schematic. Omit footprint conflicts rather than overlaying a building onto its road.
        if (
          Math.hypot(cx, cz) < 145 ||
          track.some((p) => (p.x - cx) ** 2 + (p.z - cz) ** 2 < 38 ** 2)
        )
          return [];
        const height = buildingHeight(b.height, b.levels, b.name);
        const shape = new T.Shape(
          b.outline.map((p) => new T.Vector2(p[0], p[1])),
        );
        const g = new T.ExtrudeGeometry(shape, {
          depth: Math.min(210, Math.max(6, height)),
          bevelEnabled: false,
        });
        g.rotateX(Math.PI / 2);
        g.translate(0, height, 0);
        return [{ id: b.id, g }];
      }),
    [track],
  );
  useEffect(() => () => geometry.forEach((b) => b.g.dispose()), [geometry]);
  return (
    <group>
      {geometry.map((b) => (
        <mesh key={b.id} geometry={b.g} castShadow receiveShadow>
          <meshStandardMaterial
            color="#353b48"
            roughness={0.62}
            metalness={0.25}
            onBeforeCompile={(s) => {
              s.vertexShader =
                "varying vec3 cityWorld; varying vec3 cityNormal;\n" +
                s.vertexShader;
              s.vertexShader = s.vertexShader.replace(
                "#include <begin_vertex>",
                "#include <begin_vertex>\ncityWorld=(modelMatrix*vec4(position,1.)).xyz;cityNormal=normalize(mat3(modelMatrix)*normal);",
              );
              s.fragmentShader =
                "varying vec3 cityWorld; varying vec3 cityNormal;\n" +
                s.fragmentShader;
              s.fragmentShader = s.fragmentShader.replace(
                "#include <emissivemap_fragment>",
                `#include <emissivemap_fragment>
    float axis=abs(cityNormal.x)>.5?cityWorld.z:cityWorld.x;
    vec2 cell=vec2(axis*.30,cityWorld.y*.30);vec2 f=fract(cell);
    float lit=step(.72,fract(sin(dot(floor(cell),vec2(12.9898,78.233)))*43758.5453));
    float window=step(.16,f.x)*step(f.x,.72)*step(.23,f.y)*step(f.y,.69)*(1.-step(.3,abs(cityNormal.y)));
    totalEmissiveRadiance+=vec3(.72,.60,.40)*lit*window*.85;
  `,
              );
            }}
          />
        </mesh>
      ))}
    </group>
  );
}
