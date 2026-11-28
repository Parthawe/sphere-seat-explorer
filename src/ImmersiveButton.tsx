import UiIcon from './UiIcon';
export default function ImmersiveButton({active,onToggle,inline=false}:{active:boolean;onToggle:()=>void;inline?:boolean}){
 return <button type="button" className={'scene-expand'+(inline?' scene-expand-inline':'')} aria-label={active?'Exit expanded 3D':'Expand 3D'} aria-pressed={active} title={active?'Return to page (Esc)':'Expand 3D'} data-exit-immersive={active?'true':undefined} onClick={onToggle}><UiIcon name={active?'close':'expand'}/><span>{active?'Close':'Expand 3D'}</span></button>;
}
