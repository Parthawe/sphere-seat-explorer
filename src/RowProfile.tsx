export default function RowProfile({level}:{level:0|1|2}) {
 const segments=['M3 24h12','M15 16h12','M27 8h12'];
 return <svg className="row-profile" viewBox="0 0 42 29" aria-hidden="true"><path d="M3 24h12v-8h12V8h12" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d={segments[level]} fill="none" stroke="#d00903" strokeWidth="4"/><circle cx={9+level*12} cy={19-level*8} r="2" fill="#d00903"/></svg>;
}
