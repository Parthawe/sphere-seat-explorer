export type ReferenceVenue = "qatar" | "bahrain" | "las-vegas" | "united-arab-emirates" | "australia" | "great-britain";
export type ReferenceKind = "photos" | "review";
export type SpectatorReference = {
  id: string;
  venue: ReferenceVenue;
  areas: string[];
  title: string;
  year: 2024 | 2025;
  published: string;
  yearEvidence: string;
  kind: ReferenceKind;
  author: string;
  publisher: string;
  url: string;
  location: string;
  match: "section-reported" | "grandstand-reported" | "venue-only";
  summary: string;
  expectation: string;
  checked: string;
  embed?:
    | {
        type: "reddit";
        community: string;
        postId: string;
        title: string;
        author: string;
      }
    | { type: "youtube"; videoId: string };
};
const checked = "2026-11-23";
const q2025 =
  "https://www.reddit.com/r/GrandPrixTravel/comments/1pas7t8/how_was_your_qatar_gp_2025_experience/";
const b2025 =
  "https://www.reddit.com/r/GrandPrixTravel/comments/1jydi1m/how_was_your_bahrain_gp_2025_experience/";
export const spectatorReferences: SpectatorReference[] = [
  {
    id:'silverstone-copse-c-2025-video',venue:'great-britain',areas:['copse-c'],title:'Copse C · published viewing video',year:2025,published:'2025 in the video title; exact publication date not established',yearEvidence:'Publisher titles the video View from Copse C at Silverstone Circuit (2025); capture year and location are publisher-reported.',kind:'photos',author:'Race Experience',publisher:'YouTube · Race Experience (travel publisher)',url:'https://youtu.be/WkElRBu1Wqg',location:'Copse C grandstand; row and chair not supplied',match:'grandstand-reported',summary:'A twenty-second video published as a view from Copse C. This is travel-publisher footage, not an independently verified attendee seat photograph.',expectation:'Useful for comparing the general view and camera framing. The capture position, lens and future event layout are unverified; no model row is matched.',checked:'2026-11-24',embed:{type:'youtube',videoId:'WkElRBu1Wqg'}
  },
  {
    id:'silverstone-becketts-2025-report',venue:'great-britain',areas:['becketts'],title:'Becketts · broad views, longer walk',year:2025,published:'July 2025 post-race thread',yearEvidence:'The British GP 2025 experience thread explicitly identifies that weekend; u/paolact reports watching the race from Becketts.',kind:'review',author:'u/paolact',publisher:'Reddit · r/GrandPrixTravel',url:'https://www.reddit.com/r/GrandPrixTravel/comments/1lt4z6r/how_was_your_british_gp_2025_experience/',location:'Becketts grandstand; row and chair not supplied',match:'grandstand-reported',summary:'The attendee describes views of the Esses and across to the Loop and Wellington Straight, alongside a long walk from their entrance and changing weather.',expectation:'A personal 2025 account. Walking time, mobility suitability, weather and ticket access can differ; this does not establish an accessible route or current roaming policy.',checked:'2026-11-24'
  },
  {
    id:'silverstone-vale-2025-report',venue:'great-britain',areas:['vale'],title:'Vale · corner views and screen limitations',year:2025,published:'July 2025 post-race thread',yearEvidence:'The British GP 2025 experience thread explicitly identifies that weekend; u/jelly10001 identifies their Sunday seat as Vale.',kind:'review',author:'u/jelly10001',publisher:'Reddit · r/GrandPrixTravel',url:'https://www.reddit.com/r/GrandPrixTravel/comments/1lt4z6r/how_was_your_british_gp_2025_experience/',location:'Vale grandstand; row and chair not supplied',match:'grandstand-reported',summary:'The attendee describes seeing Stowe and Club, rain exposure and difficulty reading a screen off to the side from their position.',expectation:'One reported position can differ from another in the same stand. Screens, cover and access are not verified for 2027.',checked:'2026-11-24'
  },

  {
    id: "qatar-north-2025-photos",
    venue: "qatar",
    areas: ["north"],
    title: "North Grandstand · sprint-qualifying photos",
    year: 2025,
    published: "2025-11-28",
    yearEvidence:
      "Post dated 28 Nov 2025; author identifies North Grandstand and sprint qualifying.",
    kind: "photos",
    author: "u/SilverFrameSoul",
    publisher: "Reddit · r/QatarCarEnthusiasts",
    url: "https://www.reddit.com/r/QatarCarEnthusiasts/comments/1p96giq/at_the_f1_gatar_gp/",
    location: "North Grandstand; row and seat not supplied",
    match: "grandstand-reported",
    summary:
      "The photographer identifies North Grandstand in the comments. This is an attendee-reported location, not a verified camera position.",
    expectation:
      "Useful for trackside atmosphere and car photography. Camera zoom and crop may differ from what you see with your eyes.",
    checked,
    embed: {
      type: "reddit",
      community: "QatarCarEnthusiasts",
      postId: "1p96giq",
      title: "At the f1 gatar gp",
      author: "SilverFrameSoul",
    },
  },
  {
    id: "qatar-t2-2024-photos",
    venue: "qatar",
    areas: ["t2"],
    title: "T2 · photographs from the Gate A end",
    year: 2024,
    published: "December 2024",
    yearEvidence:
      "December 2024 post following that Qatar weekend; capture year inferred from posting context.",
    kind: "photos",
    author: "u/RexManning1",
    publisher: "Reddit · r/GrandPrixTravel",
    url: "https://www.reddit.com/r/GrandPrixTravel/comments/1h5mhc3/qatar_t2_unobstructed_photography_views/",
    location: "T2, Gate A end of grandstand; row and seat not supplied",
    match: "grandstand-reported",
    summary:
      "The photographer reports taking these car photos near the Gate A end of T2 and discusses camera equipment in the replies.",
    expectation:
      "Older reference. These are zoomed photographs, not a measured wide-angle seat preview; do not infer current camera-entry rules from old comments.",
    checked,
    embed: {
      type: "reddit",
      community: "GrandPrixTravel",
      postId: "1h5mhc3",
      title: "Qatar T2 Unobstructed Photography Views",
      author: "RexManning1",
    },
  },
  {
    id: "qatar-t2-2025-review",
    venue: "qatar",
    areas: ["t2"],
    title: "T2 · close action, with arrival trade-offs",
    year: 2025,
    published: "2025-11-30",
    yearEvidence:
      "2025 post-race experience thread; selected comments identify T2 attendance.",
    kind: "review",
    author: "Multiple self-reported attendees",
    publisher: "Reddit · r/GrandPrixTravel",
    url: q2025,
    location: "T2 grandstand; no identified row or chair",
    match: "grandstand-reported",
    summary:
      "Attendees praise close views through the opening sequence. Some describe arriving early for preferred T1 sightlines, long walks and food queues; others report smoother logistics.",
    expectation:
      "Views and queue experiences differ by position and arrival time. These reports do not establish current seating or transport policy.",
    checked,
  },
  {
    id: "qatar-north-2025-review",
    venue: "qatar",
    areas: ["north"],
    title: "North · higher-row visibility report",
    year: 2025,
    published: "2025-11-30",
    yearEvidence:
      "2025 post-race thread; one attendee explicitly names North Grandstand.",
    kind: "review",
    author: "Self-reported North attendee",
    publisher: "Reddit · r/GrandPrixTravel",
    url: q2025,
    location: "North grandstand; reported higher position, exact row unknown",
    match: "grandstand-reported",
    summary:
      "One attendee reports good visibility from higher seats, alongside complaints about food, taxi and toilet queues. Other commenters describe different levels of congestion.",
    expectation:
      "Compare high and low modeled rows, but the post does not calibrate a real row to this reconstruction.",
    checked,
  },
  {
    id: "qatar-main-2025-review",
    venue: "qatar",
    areas: ["main"],
    title: "Main · spacious seating, mixed exit reports",
    year: 2025,
    published: "2025-12-07",
    yearEvidence:
      "Comment in the 2025 experience thread describing that weekend and Main Grandstand.",
    kind: "review",
    author: "Self-reported Main Grandstand attendee",
    publisher: "Reddit · r/GrandPrixTravel",
    url: q2025,
    location: "Main grandstand; section and row unknown",
    match: "grandstand-reported",
    summary:
      "An attendee describes spacious seating and an enjoyable main-stand experience, but difficulty finding transport after the event. Other attendees in the thread report easier exits.",
    expectation:
      "This is one person’s experience. Confirm current exit arrangements with the organizer rather than treating old logistics reports as policy.",
    checked,
  },
  {
    id: "qatar-hill-2025-review",
    venue: "qatar",
    areas: ["hill"],
    title: "Lusail Hill · height and sightline trade-offs",
    year: 2025,
    published: "2025-12-01",
    yearEvidence:
      "2025 post-race discussion identifies Lusail Hill and general-admission viewing.",
    kind: "review",
    author: "Multiple self-reported GA attendees",
    publisher: "Reddit · r/GrandPrixTravel",
    url: q2025,
    location: "Lusail Hill / Turn 1–2 GA; no surveyed standing point",
    match: "grandstand-reported",
    summary:
      "Reports praise the hill’s value and Turn 1 views, while one attendee describes a low position obstructed by railings and people. Early arrival and position on the slope feature repeatedly.",
    expectation:
      "Older reports of being asked to sit are not a current rule. Check the organizer; our lawn points are illustrative samples.",
    checked,
  },
  {
    id: "qatar-north-2024-photo-report",
    venue: "qatar",
    areas: ["north"],
    title: "North · reader trip report with supplied photographs",
    year: 2024,
    published: "2024-12-16",
    yearEvidence:
      "Article explicitly reports the 2024 Qatar Grand Prix, despite newer travel-guide navigation.",
    kind: "photos",
    author: "Rahul and other contributing readers",
    publisher: "GP Destinations",
    url: "https://gpdestinations.com/readers-experiences-at-lusail-2024-qatar-grand-prix/",
    location:
      "North Grandstand and wider venue; each photo’s camera position is not identified",
    match: "grandstand-reported",
    summary:
      "A North attendee describes the pit-exit view. The article includes reader-supplied photographs and wider trip accounts.",
    expectation:
      "Read each caption: not every photograph was taken from North. Images remain on the publisher’s site; no exact-seat match is claimed.",
    checked,
  },
  {
    id: "bahrain-main-2025-photos",
    venue: "bahrain",
    areas: ["main"],
    title: "Main · lower E1 and higher E5/E6 photo references",
    year: 2025,
    published: "2025-04-16",
    yearEvidence:
      "Author’s report explicitly describes the 2025 Bahrain GP and names the photographed sections.",
    kind: "photos",
    author: "Omkar",
    publisher: "Team-BHP · attendee travelogue",
    url: "https://www.team-bhp.com/forum/intl-motorsport/293358-my-experience-formula-1-bahrain-grand-prix-2025-desert-never-sleeps.html",
    location:
      "Main Grandstand: lower E1; additional photos labeled higher E5/E6",
    match: "section-reported",
    summary:
      "The author reports attending from lower E1, includes higher E5/E6 views and notes that higher seats reduce fence interference for photography.",
    expectation:
      "Find the second post and its section captions. These real section labels do not correspond to our numbered model sections. The linked practice-start clip is from the same report; its precise camera seat is not independently verified.",
    checked,
    embed: { type: "youtube", videoId: "SHWt_z22CSQ" },
  },
  {
    id: "bahrain-university-2025-review",
    venue: "bahrain",
    areas: ["university"],
    title: "University · corner views and screen readability",
    year: 2025,
    published: "April 2025",
    yearEvidence:
      "2025 post-race experience thread; several comments identify University attendance.",
    kind: "review",
    author: "Multiple self-reported University attendees",
    publisher: "Reddit · r/GrandPrixTravel",
    url: b2025,
    location: "University product; bank/row varies or is not supplied",
    match: "grandstand-reported",
    summary:
      "Attendees describe views of Turn 1 action and following battles. Some criticize small screens or audio and exit-bus organization; others report a positive overall experience.",
    expectation:
      "Product-level evidence applies to University generally. It does not establish which of the three modeled banks matches a commenter’s seat.",
    checked,
  },
  {
    id: "bahrain-turn1-2025-review",
    venue: "bahrain",
    areas: ["turn-1"],
    title: "Turn 1 · action-focused attendee report",
    year: 2025,
    published: "April 2025",
    yearEvidence:
      "2025 experience-thread comment explicitly names T1 Grandstand.",
    kind: "review",
    author: "u/patrycjuszstar and other attendees",
    publisher: "Reddit · r/GrandPrixTravel",
    url: b2025,
    location: "Turn 1 Grandstand; exact row unknown",
    match: "grandstand-reported",
    summary:
      "A Turn 1 attendee praises the action and view while wanting more nearby food choices. Transport accounts elsewhere in the thread vary.",
    expectation:
      "A favorable review is not a guarantee for every row, screen sightline or future event.",
    checked,
  },
  {
    id: "bahrain-victory-2025-review",
    venue: "bahrain",
    areas: ["victory"],
    title: "Victory · bank 2 attendee experience",
    year: 2025,
    published: "April 2025",
    yearEvidence: "2025 post-race thread; commenter names Victory tower 2.",
    kind: "review",
    author: "u/mrRSishere",
    publisher: "Reddit · r/GrandPrixTravel",
    url: b2025,
    location:
      "Author calls it Victory tower 2; model-bank correspondence unverified",
    match: "grandstand-reported",
    summary:
      "A commenter who reports sitting in Victory tower 2 describes an enjoyable overall weekend and fan-zone experience. They provide no row-specific sightline detail or photo.",
    expectation:
      "This is an experience report, not visual proof of the view from either modeled Victory bank.",
    checked,
  },
  {
    id: "bahrain-2025-venue-report",
    venue: "bahrain",
    areas: [],
    title: "Bahrain 2025 · broader spectator experiences",
    year: 2025,
    published: "April 2025",
    yearEvidence:
      "Thread explicitly requests feedback from the 2025 Bahrain weekend.",
    kind: "review",
    author: "Multiple self-reported attendees",
    publisher: "Reddit · r/GrandPrixTravel",
    url: b2025,
    location: "Venue-wide, across several grandstands",
    match: "venue-only",
    summary:
      "Reports disagree about queues and shuttle organization. They provide wider weekend context, not evidence of a Beyon/Batelco sightline.",
    expectation:
      "Use this for venue context only; it is deliberately excluded from selected-grandstand matches.",
    checked,
  },
  {
    id: "vegas-sphere-2025-review",
    venue: "las-vegas",
    areas: ["sphere"],
    title: "Sphere Zone · chicane and race-night report",
    year: 2025,
    published: "November 2025",
    yearEvidence:
      "Post-weekend 2025 discussion; commenter identifies their Friday and Saturday Sphere grandstands.",
    kind: "review",
    author: "u/uppr_dckr",
    publisher: "Reddit · r/GrandPrixTravel",
    url: "https://www.reddit.com/r/GrandPrixTravel/comments/1p4fm46/for_the_people_who_went_to_vegas/",
    location:
      "Author reports SG7102 for Friday and SG1112 for Saturday; model-bank correspondence unknown",
    match: "section-reported",
    summary:
      "The attendee describes a positive Sphere Zone atmosphere, entertainment and amenities, with manageable entry and exit during their visit.",
    expectation:
      "The attached hotel-room picture is not a grandstand photo. These real section codes are not mapped to our A–E model banks.",
    checked,
  },
];
export function referencesFor(
  venue: ReferenceVenue,
  area: string,
  scope: "area" | "venue",
  kind: "all" | ReferenceKind = "all",
  year = "all",
) {
  return spectatorReferences
    .filter(
      (r) =>
        r.venue === venue &&
        (scope === "venue" || r.areas.includes(area)) &&
        (kind === "all" || r.kind === kind) &&
        (year === "all" || String(r.year) === year),
    )
    .sort((a, b) => b.year - a.year || a.kind.localeCompare(b.kind));
}
