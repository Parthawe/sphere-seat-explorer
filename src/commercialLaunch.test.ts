import {test} from 'node:test';import assert from 'node:assert/strict';
import {commercialLaunch,commercialLaunchIssues} from './commercialLaunch';
import {revenueScenario,observedContribution} from './revenueModel';
test('owner confirmation does not fabricate document scope or public operator policies',()=>{
 const issues=commercialLaunchIssues(commercialLaunch);assert(issues.some(x=>x.includes('Brand/domain')));assert(issues.some(x=>x.includes('operator')));assert(issues.some(x=>x.includes('privacy')));assert(issues.some(x=>x.includes('Measurement')));
 assert(commercialLaunchIssues({...commercialLaunch,pilot:{...commercialLaunch.pilot,stopSale:true}}).includes('Pilot is stopped'));
});
test('scenario separates attribution, reversals and costs from gross commission',()=>{
 const result=revenueScenario({visitors:1000,sellerClickRate:.1,purchaseRate:.05,eligibleBookingValue:1000,commissionRate:.025,attributionRetention:.8,approvalRetention:.5,operatingCosts:60});
 assert.equal(result.grossCommission,125);assert.equal(result.estimatedApprovedCommission,50);assert.equal(result.netAfterCosts,-10);assert.match(result.kind,/not measured/);
 assert.equal(observedContribution(null,60),null);assert.equal(observedContribution(50,60),-10);assert.equal(observedContribution(-10,60),-70);
 assert.throws(()=>revenueScenario({visitors:1,sellerClickRate:2,purchaseRate:0,eligibleBookingValue:0,commissionRate:0,attributionRetention:1,approvalRetention:1,operatingCosts:0}));
});
