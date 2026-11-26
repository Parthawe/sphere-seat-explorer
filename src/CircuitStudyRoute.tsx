import CircuitSeatingExplorer from './CircuitSeatingExplorer';
import {findCircuitModel} from './circuitSeating';

export default function CircuitStudyRoute({season,race,onBack}:{season:number;race:string;onBack:(bank?:string)=>void}){
  const model=findCircuitModel(season,race);
  if(!model)return <section className="app-recovery"><h1>This seat study is unavailable.</h1><button onClick={()=>onBack('')}>Back to race guide</button></section>;
  return <CircuitSeatingExplorer key={model.id} model={model} onBack={onBack}/>;
}
