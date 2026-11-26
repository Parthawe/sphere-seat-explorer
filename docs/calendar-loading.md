# Calendar loading and source boundaries

The calendar imports `calendarIndex.json`, a derived projection of the retained race, circuit-guide, venue and model sources. It contains exact-season coverage metadata, search text and the existing thumbnail paths. It contains no chair positions or ticket inventory.

`calendarIndexSource.ts` is build-time code. `scripts/build-calendar-index.ts` runs automatically before the production build. After changing the source calendars, guide identities, venue registry or detailed models, regenerate with `npm run prebuild` and run `src/calendarIndex.test.ts`. Do not edit the generated JSON by hand. The tests compare all race editions with their original models, source years, map coverage and accent-insensitive search behavior.

Race guides, stand catalogues, price notes and full model lookups load after selecting a destination. `CircuitStudyRoute` resolves the original detailed model only after entering its seat study. The lightweight lookup does not replace the full model or allow a different edition's model as fallback. Pure anchor helpers live in `venueLinks.ts`; the funding disclosure reads the existing commercial configuration without importing venue geometry. Partner validation still uses the full source records when invoked.

A calendar hash link starts with the existing poster and an explicit Load 3D action. The normal landing page retains automatic hero loading, while reduced motion and data saver retain their existing opt-in behavior. Same-page guide shortcuts preserve the current query, wait for their lazy targets and move keyboard focus to the requested section. Failed destination downloads retain a recovery link to the selected season's calendar.

## 26 November 2026 audit evidence

The v94 entry was 892,549 bytes of minified JavaScript. The revised entry is 311,288 bytes, a 65.1% reduction. The entry has no static JavaScript imports; full geometry and guide chunks are not downloaded by the calendar path. These are artifact/resource observations, not real-user speed or Core Web Vitals claims. Optional 3D still has its own loading cost.

An initial same-machine synthetic phone-profile comparison used fresh browser contexts, disabled caches, 100 ms network latency, 200,000 bytes/second download throughput, 4× CPU slowdown and reduced motion. Search became available after 2,377 ms for v94 and 1,129 ms for the first refactor build; filtering took 171 and 55 ms. This single diagnostic sample preceded minor navigation/recovery copy refinements and is not a statistically reliable timing guarantee. Subsequent final-artifact checks confirmed the intended calendar dependency boundary and explicit 3D loading.

The source gates remain unchanged: no paid referrals, ads or live ticket inventory are activated. Public organizer links are handoffs for the chosen event year; they do not establish live stock or a verified seat match.
