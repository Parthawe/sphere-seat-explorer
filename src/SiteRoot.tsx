import {lazy,Suspense,useEffect} from 'react';
import App from './RaceHub';
import PrivacyControls from './PrivacyControls';
import {installUsageAnalytics} from './usageAnalytics';
const PrivacyPage=lazy(()=>import('./PrivacyPage')),InsightsPage=lazy(()=>import('./InsightsPage'));
export default function SiteRoot(){useEffect(()=>{installUsageAnalytics();},[]);const path=location.pathname;return <>{path==='/privacy'?<Suspense fallback={<p role="status">Loading privacy information…</p>}><PrivacyPage/></Suspense>:path==='/insights'?<Suspense fallback={<p role="status">Loading insights…</p>}><InsightsPage/></Suspense>:<App/>}<PrivacyControls/></>;}
