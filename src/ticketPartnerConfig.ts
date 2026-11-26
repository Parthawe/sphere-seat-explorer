import {commercialLaunch,commercialLaunchIssues} from './commercialLaunch';
import type {TicketPartner} from './ticketPartners';
// Release requirements, not evidence of rights or account approval.
export const monetizationReadiness=commercialLaunchIssues(commercialLaunch);
export const ticketPartnersEnabled=monetizationReadiness.length===0;
// Only exact partner-issued event links under an approved agreement belong here.
export const ticketPartners:TicketPartner[]=[];
