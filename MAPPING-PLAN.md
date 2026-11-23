## Current priority: a useful ticket product for the remaining 2026 races

The user’s latest brief takes priority over the original Singapore-first order. Qatar (27–29 November) is the first working ticket-product pilot; Abu Dhabi (4–6 December) is next. Preserve both seasons and Las Vegas 3D.

Each venue should connect verified event/year provider links, publicly readable product metadata, a local ticket-area resolver, sourced geography, explicit location confidence and a dated update path. Approximate areas are useful without fabricated exact seats. Only graduate to row/chair mapping when supported by venue assets. Respect organizer resale policies and robots/access restrictions. Never scrape private tickets, bypass blocks, or label reference prices as live inventory.

The Qatar pilot implements five area callouts, numbered-vs-free-seating rules, three-area comparison, public-only sharing, a private local text parser and an allowlisted metadata collector. Refresh with `npm run collect:tickets`; inspect differences before publishing. The collector fails closed on unreadable robots rules, makes no authenticated requests and does not infer availability. Runtime public snapshots require a validated Site deployment; this is not an autonomous hosted live feed.

Next: verify Abu Dhabi area definitions and develop its locator, extract a shared venue schema from the two pilots, then resume Singapore and the remaining verified venues below. Revalidate dates and “next race” priority when time advances. Existing two-hour development automation covers this work; do not create a second schedule.

# Apex Atlas mapping programme

Requested 23 November 2026. Work is scheduled every two hours in this conversation. The working interpretation of “all the Vegas” is all F1 venues across the 2026 and 2027 calendars, following the earlier all-races brief. If the user clarifies that they mean Las Vegas venues instead, revise this scope before the next implementation chunk.

## Outcome

For every physical circuit on the confirmed calendars, provide a sourced circuit map, a viewing-area directory, selection into the supported seating/3D experience, and clear evidence for what is official, estimated or unavailable. Preserve the working Las Vegas outdoor and Sphere indoor experiences and the approved Apex Atlas identity.

Calendar guides already exist. They are not finished circuit or seat maps. Las Vegas is an existing reconstruction, not a verified digital twin. The provisional queue in MAPPING-PROGRESS.json must be checked against current official calendars and event pages before its venue identities or counts are treated as confirmed. A race slug can refer to a relocated event; do not identify physical circuits by slug alone.

## Sequence

1. **Foundation.** Revalidate the venue inventory. Introduce a per-venue registry for circuit geometry, stands, camera bounds, source/licence records and confidence. Remove assumptions that every scene is the Sphere/Las Vegas model. Keep legacy seat links working. Add status/coverage to race guides so a guide is never mistaken for a completed seat model.
2. **Singapore pilot.** Build the first non-Vegas end-to-end map using the original video as an interaction reference. Use current organizer material and licensed geographic context. Implement circuit/area exploration, representative modeled seat selection, comparison, sharing and responsive controls. Validate the reusable approach before scaling it.
3. **Night-race group.** Qatar, Abu Dhabi, Sakhir and Jeddah. Reuse rendering capabilities while sourcing each circuit independently. Do not reuse Las Vegas geography or stand layouts.
4. **Established circuits.** Silverstone, Spa, Monza, Suzuka and Monaco. Adapt views to their actual circuit and viewing-area structure.
5. **Remaining venues.** Work through the rest of the verified queue. Keep year-specific differences explicit, including new, rotating or relocated events. Record unsupported configurations instead of inventing data.
6. **Coverage audit.** Reconcile the finished registry against both calendars. Check all links, venue routing, source dates, camera bounds, empty/error states and mobile performance. Pause the recurring work only after the completion criteria are met, or if the user changes/stops the schedule.

## Each recurring run

- Read this file, MAPPING-PROGRESS.json, PRODUCT.md, DESIGN.md, VALIDATION.md and repository status. Read relevant global skills/instructions. Refresh current official sources when the task depends on them.
- Work on the first unfinished, unblocked dependency. Complete a concrete chunk; one run need not finish an entire circuit. Aim to checkpoint within 60 minutes. Do not overlap another active mapping run or overwrite unrelated work.
- Source from organizers, Formula 1/FIA, venue owners and openly licensed geographic/asset providers. Preserve citations, retrieval dates, licences and geographic anchors. Do not rehost Google Maps/Street View imagery or unlicensed ticket photos. Google Maps links can provide real-location context.
- Separate surveyed/source geometry, inferred geometry and illustrative seats. No invented official seat IDs, prices, availability, verified photos, testimonials or endorsements. Track alignment and camera calibration need evidence beyond a building's coordinates.
- Implement, run checks appropriate to the change, and inspect the affected desktop/mobile journey. Keep reduced motion, pause controls, 2D/error fallbacks and readable source/accuracy labels. Avoid unrelated redesign or endless polishing.
- Update the tracker with work completed, sources, evidence, tests, blockers and one exact next action. Record useful partial work if a source or integration blocks completion.
- Publish validated app changes to the existing public Site through its supported workflow, preserving project ID appgprj_6b03a10b6c388191a92912a1c2dfe070 and its audience. Push the matching source to https://github.com/Parthawe/sphere-seat-explorer. Obtain fresh short-lived credentials at run time; never save tokens. Documentation-only runs need no app deployment.
- Give a short progress update in this conversation naming what changed, what was verified, remaining gaps and the next chunk. Do not send mail or other external messages.

## Per-venue completion criteria

| Area | Required evidence |
| --- | --- |
| Identity | Correct physical circuit and season associations, checked against official event sources. |
| Map | Source-linked circuit layout and major viewing areas. Clearly identified schematic/estimated placement. |
| Selection | Clickable viewing areas with appropriate seat-model entry, or an explicit unavailable-data state. No fictional ticket inventory. |
| 3D | Circuit-specific geometry and meaningful representative modeled views where source material supports them; camera bounds, materials and lighting reviewed. If essential assets are missing, mark needs_assets rather than verified/complete. |
| Product flow | Map to area to supported view, comparison/share where available, and working official information links. |
| Quality | Appropriate build/tests and desktop/mobile checks; reduced motion, loading and recovery states retained. |
| Provenance | Source dates, licences, uncertainties and unresolved model gaps recorded. |

The programme is complete when every verified target venue meets these criteria and the final coverage audit passes. It does not promise every purchasable seat has a measured, photographic or certified preview. If essential evidence is unavailable, retain the gap and report it; do not manufacture completion.

## Progress and scheduling

MAPPING-PROGRESS.json is the persistent work queue and run log. MAPPING-AUTOMATION.json stores the scheduler's returned identity and cadence without credentials. A scheduler run should skip active overlapping work, preserve unrelated changes, and avoid repeating a known failed operation without new evidence. If all remaining items are externally blocked, report the concrete missing inputs and leave the work accurately marked as blocked.
