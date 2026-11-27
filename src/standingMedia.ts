import profiles from './driverProfiles.json';
const normalize=(value:string)=>value.normalize('NFKD').replace(/\p{Diacritic}/gu,'').replace(/[^a-z0-9]+/gi,' ').trim().toLowerCase();
const aliases:Record<string,string>={'carlos sainz jr':'carlos sainz','alex albon':'alexander albon','andrea kimi antonelli':'kimi antonelli'};
/** Full-name identity match only; an unknown driver never borrows a teammate's photo. */
export function standingPortrait(name:string,season:number){
 if(season!==profiles.season)return null;
 const key=normalize(name),match=aliases[key]??key;
 return profiles.drivers.find(driver=>normalize(driver.name)===match)?.portrait??null;
}
export function identityInitials(name:string){return name.trim().split(/\s+/).filter(Boolean).slice(0,2).map(word=>Array.from(word)[0]).join('').toUpperCase()||'?';}
const marks:Record<string,string>={'mercedes':'mercedes','ferrari':'ferrari','red bull':'redbull','red bull racing':'redbull','mclaren':'mclaren','audi':'audi','cadillac':'cadillac','aston martin':'astonmartin'};
/** Keep multi-constructor season entries separate, as supplied by the standings feed. */
export function standingTeams(label:string){return label.split(' / ').map(name=>name.trim()).filter(Boolean).map(name=>({name,src:marks[normalize(name)]?`/team-marks/${marks[normalize(name)]}.svg`:null,initials:identityInitials(name)}));}
