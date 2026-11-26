// Private evidence belongs in the owner's records, never in this public bundle.
// References below identify reviews; they do not remotely validate an agreement.
export type CommercialLaunch = {
  rights: { status: 'not-supplied' | 'owner-confirmed' | 'document-reviewed'; evidenceReference: string; coversDomainAndBrand: boolean };
  operator: { name: string; publicEmail: string; country: string } | null;
  policies: { privacyUrl: string; termsUrl: string; reviewedAt: string } | null;
  pilot: { race: string; season: number; mappingReviewReference: string; measurementPlanReference: string; owner: string; stopSale: boolean };
};
export const commercialLaunch: CommercialLaunch = {
  rights: { status:'owner-confirmed', evidenceReference:'', coversDomainAndBrand:false },
  operator:null,
  policies:null,
  pilot:{race:'qatar',season:2026,mappingReviewReference:'docs/qatar-commercial-pilot.md',measurementPlanReference:'',owner:'',stopSale:false},
};
export function safeCommercialUrl(value: string) {
  try {const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port?u:null;}catch{return null;}
}
export function commercialLaunchIssues(config: CommercialLaunch): string[] {
  const issues:string[]=[];
  if(config.rights.status!=='document-reviewed'||!config.rights.evidenceReference.trim()||!config.rights.coversDomainAndBrand)issues.push('Brand/domain permission: owner confirmation recorded; scope/document review still required');
  if(!config.operator?.name.trim()||!config.operator.country.trim()||!/^\S+@\S+\.\S+$/.test(config.operator.publicEmail))issues.push('Legal operator, public email and country missing');
  if(!config.policies||!safeCommercialUrl(config.policies.privacyUrl)||!safeCommercialUrl(config.policies.termsUrl)||!Number.isFinite(Date.parse(config.policies.reviewedAt)))issues.push('Reviewed public privacy and terms pages missing');
  if(!config.pilot.owner.trim())issues.push('Pilot maintenance owner missing');
  if(!config.pilot.mappingReviewReference.trim())issues.push('Grandstand/category mapping review missing');
  if(!config.pilot.measurementPlanReference.trim())issues.push('Measurement, disclosure and privacy plan not approved');
  if(config.pilot.stopSale)issues.push('Pilot is stopped');
  return issues;
}
