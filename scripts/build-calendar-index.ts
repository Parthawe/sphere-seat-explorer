import {writeFile} from 'node:fs/promises';
import {buildCalendarIndex} from '../src/calendarIndexSource';
await writeFile(new URL('../src/calendarIndex.json',import.meta.url),JSON.stringify(buildCalendarIndex())+'\n');
