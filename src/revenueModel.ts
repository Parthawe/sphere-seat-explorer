export type RevenueScenario = {
  visitors:number; sellerClickRate:number; purchaseRate:number; eligibleBookingValue:number;
  commissionRate:number; attributionRetention:number; approvalRetention:number; operatingCosts:number;
};
/** Scenario arithmetic only. Inputs are supplied assumptions, never observed performance. */
export function revenueScenario(input:RevenueScenario) {
  const rates=['sellerClickRate','purchaseRate','commissionRate','attributionRetention','approvalRetention'] as const;
  for(const key of rates)if(!Number.isFinite(input[key])||input[key]<0||input[key]>1)throw new Error(`${key} must be a fraction from 0 to 1`);
  for(const key of ['visitors','eligibleBookingValue','operatingCosts'] as const)if(!Number.isFinite(input[key])||input[key]<0)throw new Error(`${key} must be a non-negative number`);
  const sellerClicks=input.visitors*input.sellerClickRate;
  const purchases=sellerClicks*input.purchaseRate;
  const grossCommission=purchases*input.eligibleBookingValue*input.commissionRate;
  const estimatedApprovedCommission=grossCommission*input.attributionRetention*input.approvalRetention;
  if(![sellerClicks,purchases,grossCommission,estimatedApprovedCommission].every(Number.isFinite))throw new Error('Scenario exceeds numeric range');
  return {kind:'scenario, not measured revenue',sellerClicks,purchases,grossCommission,estimatedApprovedCommission,netAfterCosts:estimatedApprovedCommission-input.operatingCosts};
}
export function observedContribution(approvedCommission:number|null,operatingCosts:number|null) {
  if(approvedCommission===null||operatingCosts===null)return null;
  if(!Number.isFinite(approvedCommission)||!Number.isFinite(operatingCosts)||operatingCosts<0)throw new Error('Use finite settled commission and non-negative cost totals in one currency');
  return approvedCommission-operatingCosts;
}
