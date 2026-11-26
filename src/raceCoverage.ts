import { findCircuitModel } from './circuitSeating';
import { findVenue } from './venueRegistry';

export type RaceCoverage = {
  kind: 'model' | 'reference3d' | 'area' | 'guide';
  has3d: boolean;
  label: string;
  detail: string;
  sourceSeason?: number;
};

/** Public coverage labels describe our sources, not an exact-seat inventory. */
export function raceCoverage(season: number, race: string): RaceCoverage {
  const model = findCircuitModel(season, race);
  if (model) return { kind: 'model', has3d: true, sourceSeason: model.season, label: 'Illustrative 3D study', detail: `Illustrative 3D · ${model.banks.length} modeled banks` };
  if (race === 'las-vegas') return { kind: 'reference3d', has3d: true, sourceSeason: 2026, label: '3D · 2026 reference', detail: 'Illustrative 3D · 2026 reference' };
  const venue = findVenue(season, race);
  if (venue) return { kind: 'area', has3d: false, sourceSeason: venue.season, label: 'Ticket desk & area map', detail: 'Approximate area map available' };
  return { kind: 'guide', has3d: false, label: 'Race & ticket guide', detail: 'Circuit guide · no 3D model' };
}
