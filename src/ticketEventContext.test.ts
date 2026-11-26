import {test} from 'node:test';
import assert from 'node:assert/strict';
import {locateTicket} from './ticketing';
import {locateAbuTicket} from './abuDhabi';
import {locateSingaporeTicket} from './singapore';
const locators = [
  {parse:locateTicket, own:'Lusail 2026 Main Grandstand', area:'Main Grandstand'},
  {parse:locateAbuTicket, own:'Yas Marina 2026 Main Grandstand', area:'Main Grandstand'},
  {parse:locateSingaporeTicket, own:'Marina Bay 2027 Pit Grandstand', area:'Pit Grandstand'},
];
test('known foreign venues cannot borrow similarly named local grandstands',()=>{
  for(const {parse,area} of locators)
    for(const venue of ['Melbourne','Albert Park','Shanghai','Suzuka','Miami','Montréal','Monaco','Spielberg','Hungaroring','Baku','Austin','Interlagos','Madrid','Jeddah','Sakhir'])
      assert.equal(parse(`${venue} ${area}`).status,'wrong-event',`${venue} ${area}`);
});
test('explicit unsupported years stay distinct from row and seat identifiers',()=>{
  for(const {parse,own,area} of locators){
    assert.equal(parse(own).status,'matched',own);
    for(const year of [1999,2019,2040,2099])assert.equal(parse(`${area} ${year}`).status,'wrong-event');
    assert.equal(parse(`${own} Row 2040 Seat 2027A`).status,'matched');
  }
});
