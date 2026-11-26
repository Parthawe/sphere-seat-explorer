import {readFileSync} from 'node:fs';
import {revenueScenario,observedContribution,type RevenueScenario} from '../src/revenueModel';
const path=process.argv[2];
const input=JSON.parse(readFileSync(path??new URL('../commercial/revenue-inputs.json',import.meta.url),'utf8'));
if(!input.currency||!input.scenario)console.log('No scenario supplied. No earnings estimate has been generated.');
else console.log(JSON.stringify({currency:input.currency,...revenueScenario(input.scenario as RevenueScenario)},null,2));
const observed=input.observed;
if(!observed?.reportReference||!input.currency||observed.approvedCommission==null||observed.operatingCosts==null)console.log('Approved revenue and contribution: not measured. Clicks and pending orders are not approved payouts.');
else console.log(JSON.stringify({kind:'owner-entered report totals, not independently verified',currency:input.currency,reportReference:observed.reportReference,contribution:observedContribution(observed.approvedCommission,observed.operatingCosts)},null,2));
