import {circuitLayoutId} from "./circuitLayouts";
import {calendarEntryFor} from './calendarIndex';

export type RaceCoverage = {
  kind: 'model' | 'reference3d' | 'layout3d' | 'area' | 'guide';
  has3d: boolean;
  label: string;
  detail: string;
  sourceSeason?: number;
};

/** Public coverage labels describe our sources, not an exact-seat inventory. */
export function raceCoverage(season: number, race: string): RaceCoverage {
  const entry=calendarEntryFor(season,race),model=entry?.model;
  if (model) return { kind: 'model', has3d: true, sourceSeason: model.season, label: '3D seating study', detail: `Illustrative 3D · ${model.banks} modeled banks` };
  if (race === 'las-vegas') return { kind: 'reference3d', has3d: true, sourceSeason: 2026, label: '3D · 2026 reference', detail: 'Illustrative 3D · 2026 reference' };
  const venue=entry?.areaMap;
  if(circuitLayoutId(season,race))return {kind:"layout3d",has3d:true,label:"Circuit outline",detail:venue?"Circuit outline & area map · no seat preview":"Circuit outline · no seat preview"};
  if (venue) return { kind: 'area', has3d: false, sourceSeason: season, label: 'Ticket desk & area map', detail: 'Approximate area map available' };
  return { kind: 'guide', has3d: false, label: 'Race & ticket guide', detail: 'Circuit guide · no 3D model' };
}
