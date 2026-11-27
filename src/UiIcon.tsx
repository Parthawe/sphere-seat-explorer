import type {ReactNode} from 'react';
const shapes = {
 list:<><path d="M8 5h13M8 12h13M8 19h13"/><path d="M3 5h.01M3 12h.01M3 19h.01"/></>,
 heightLow:<><path d="M2 20h6v-5h6v-5h7"/><circle cx="5" cy="15" r="2" fill="currentColor"/></>,
 heightMid:<><path d="M2 20h6v-5h6v-5h7"/><circle cx="11" cy="10" r="2" fill="currentColor"/></>,
 heightHigh:<><path d="M2 20h6v-5h6v-5h7"/><circle cx="18" cy="5" r="2" fill="currentColor"/></>,
 expand:<><path d="M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6"/></>,
 circuit:<path d="M7 4 3 9l3 4-1 5 6 2 4-5 5-2 1-6-6-3-3 4-5-4Z"/>,
 seat:<><path d="M6 3h10v10H6zM5 13h14v5H5zM7 18v3m10-3v3M3 10v7m18-7v7"/></>,
 cube:<><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z M3 7l9 5 9-5M12 12v10"/></>,
 calendar:<><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M7 2v6m10-6v6M3 11h18m-13 4h3m3 0h3m-9 3h3"/></>,
 camera:<><path d="M3 7h4l2-3h6l2 3h4v14H3Z"/><circle cx="12" cy="13" r="4"/></>,
 play:<path d="m8 4 12 8-12 8Z"/>,pause:<path d="M8 4v16m8-16v16"/>,
 reset:<><path d="M4 9a8 8 0 1 1 0 6M4 3v6h6"/></>,
 layers:<><path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5"/></>,
 grid:<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
 ticket:<><path d="M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5Z"/><path d="M15 5v3m0 2v4m0 2v3"/></>,
 map:<><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16"/></>,
 info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/></>,
 check:<path d="m5 12 4 4L19 6"/>,plus:<path d="M12 4v16M4 12h16"/>,
 arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,
 download:<><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,
 copy:<><path d="M8 8h13v13H8zM16 8V3H3v13h5"/></>,
 close:<path d="m5 5 14 14M5 19 19 5"/>,
 compare:<><path d="M4 5h6v14H4zM14 5h6v14h-6z"/></>,
 motion:<><path d="M3 8c3-7 6 7 9 0s6 7 9 0M3 16c3-7 6 7 9 0s6 7 9 0"/></>,
 search:<><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
} satisfies Record<string,ReactNode>;
export type UiIconName=keyof typeof shapes;
export default function UiIcon({name,className=''}:{name:UiIconName;className?:string}) {
 return <svg className={`ui-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}
