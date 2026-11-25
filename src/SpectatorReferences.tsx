import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  referencesFor,
  type ReferenceKind,
  type ReferenceVenue,
  type SpectatorReference,
} from "./photoReferences";
function OriginalVideo({ videoId, title }: { videoId: string; title:string }) {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="spectator-original">
      {enabled ? (
        <>
          <iframe
            className="spectator-video"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
            title={title}
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <p>
            If the video cannot play here, open the original report or{" "}
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noreferrer"
            >
              watch the clip on YouTube
            </a>
            .
          </p>
          <button
            className="spectator-unload"
            onClick={() => setEnabled(false)}
          >
            Unload video
          </button>
        </>
      ) : (
        <>
          <button onClick={() => setEnabled(true)}>
            Load source video
          </button>
          <p>
            The photos stay on the author’s site. This optional clip connects to
            YouTube;{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
            >
              Google’s privacy policy
            </a>{" "}
            applies.
          </p>
        </>
      )}
    </div>
  );
}
function OriginalPost({ reference }: { reference: SpectatorReference }) {
  const host = useRef<HTMLDivElement>(null),
    [enabled, setEnabled] = useState(false),
    [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
      "loading",
    );
  useEffect(() => {
    if (
      !enabled ||
      !reference.embed ||
      reference.embed.type !== "reddit" ||
      !host.current
    )
      return;
    const root = host.current;
    setStatus("loading");
    const block = document.createElement("blockquote");
    block.className = "reddit-embed-bq";
    block.style.height = "500px";
    const link = document.createElement("a");
    link.href = reference.url;
    link.textContent = reference.embed.title;
    block.append(link, document.createElement("br"), "by ");
    const author = document.createElement("a");
    author.href = `https://www.reddit.com/user/${reference.embed.author}/`;
    author.textContent = `u/${reference.embed.author}`;
    block.append(author, " in ");
    const community = document.createElement("a");
    community.href = `https://www.reddit.com/r/${reference.embed.community}/`;
    community.textContent = reference.embed.community;
    block.append(community);
    root.append(block);
    // Official oEmbed blockquote and script, constructed from curated metadata. No arbitrary HTML is executed.
    const script = document.createElement("script");
    script.src = "https://embed.reddit.com/widgets.js";
    script.async = true;
    script.charset = "UTF-8";
    script.onerror = () => setStatus("unavailable");
    const observer = new MutationObserver(() => {
      const iframe = root.querySelector("iframe");
      if (iframe) {
        iframe.title = `Original photo post by ${reference.author}`;
        iframe.addEventListener("load", () => setStatus("ready"), {
          once: true,
        });
      }
    });
    observer.observe(root, { childList: true, subtree: true });
    root.append(script);
    const timeout = window.setTimeout(
      () => setStatus((s) => (s === "ready" ? s : "unavailable")),
      10000,
    );
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
      root.replaceChildren();
    };
  }, [enabled, reference]);
  if (!reference.embed) return null;
  if (reference.embed.type === "youtube")
    return <OriginalVideo videoId={reference.embed.videoId} title={`${reference.title} · ${reference.author}`} />;
  return (
    <div className="spectator-original">
      {!enabled ? (
        <>
          <button onClick={() => setEnabled(true)}>
            Load original photo post
          </button>
          <p>
            The preview connects to Reddit and uses its embed.{" "}
            <a
              href="https://www.reddit.com/policies/privacy-policy"
              target="_blank"
              rel="noreferrer"
            >
              Reddit privacy policy
            </a>
          </p>
        </>
      ) : (
        <>
          {status === "loading" && (
            <p role="status">Loading the original post…</p>
          )}
          {status === "unavailable" && (
            <p role="status">
              The preview may be blocked or unavailable. Use “Open original
              source” below.
            </p>
          )}
          <p>
            Reddit may block embedded previews.{" "}
            <a href={reference.url} target="_blank" rel="noreferrer">
              Open the original photo post
            </a>{" "}
            if this frame is unavailable.
          </p>
          <div ref={host} className="spectator-embed-host" />
          <button
            className="spectator-unload"
            onClick={() => setEnabled(false)}
          >
            Unload preview
          </button>
        </>
      )}
    </div>
  );
}
export default function SpectatorReferences({
  open,
  onClose,
  venue,
  area,
  areaName,
  season,
  officialView,
}: {
  open: boolean;
  onClose: () => void;
  venue: ReferenceVenue;
  area: string;
  areaName: string;
  season: number;
  officialView?:{url:string;name:string};
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    [scope, setScope] = useState<"area" | "venue">("area"),
    [kind, setKind] = useState<"all" | ReferenceKind>("all"),
    [year, setYear] = useState("all");
  useLayoutEffect(() => {
    if (open) {
      setScope("area");
      setKind("all");
      setYear("all");
      dialog.current?.showModal();
    } else dialog.current?.close();
  }, [open, venue, area]);
  const refs = referencesFor(venue, area, scope, kind, year),
    nearbyCount = referencesFor(venue, area, "area").length,
    venueCount = referencesFor(venue, area, "venue").length;
  return (
    <dialog
      ref={dialog}
      className="spectator-dialog"
      onCancel={onClose}
      onClose={onClose}
    >
      <header>
        <div>
          <span className="eyebrow">PHOTO REFERENCES / FAN REPORTS</span>
          <h2>From the grandstands.</h2>
          <p>
            {areaName} ·{" "}
            {venue === "las-vegas"
              ? "Las Vegas"
              : venue === "qatar"
                ? "Lusail"
                : venue === "united-arab-emirates" ? "Yas Marina" : venue === "belgium" ? "Spa-Francorchamps" : venue === "great-britain" ? "Silverstone" : venue === "australia" ? "Albert Park" : "Sakhir"}{" "}
            · planning {season}
          </p>
        </div>
        <button aria-label="Close photo references" onClick={onClose}>
          ×
        </button>
      </header>
      <div className="spectator-boundary">
        <strong>Real sources. Location reported by the author.</strong>
        <p>
          These references are separate from the 3D reconstruction. No source
          has been matched to your exact model row or position. Photos can be
          zoomed, cropped or from another section; reviews describe individual
          experiences.
        </p>
      </div>
      {officialView&&<section className="spectator-official-view" aria-label="Organizer virtual view"><h3>Organizer’s virtual view</h3><p>On the {officialView.name} page, choose “Open the virtual grandstand”. The organizer controls this preview. Capture date and correspondence to your modeled row are unverified.</p><a className="spectator-source-link" href={officialView.url} target="_blank" rel="noreferrer">Open {officialView.name} virtual-view page</a></section>}
      <div className="spectator-filters">
        <label>
          Location
          <select
            aria-label="Reference location scope"
            value={scope}
            onChange={(e) => setScope(e.target.value as "area" | "venue")}
          >
            <option value="area">Selected viewing area ({nearbyCount})</option>
            <option value="venue">All references at this venue</option>
          </select>
        </label>
        <label>
          Reference year
          <select
            aria-label="Reference year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="all">All checked years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024 · older reference</option>
          </select>
        </label>
        <label>
          Show
          <select
            aria-label="Reference type"
            value={kind}
            onChange={(e) => setKind(e.target.value as "all" | ReferenceKind)}
          >
            <option value="all">Photos & reviews</option>
            <option value="photos">Photo sources</option>
            <option value="review">Fan reports</option>
          </select>
        </label>
      </div>
      {year === "2026" && venue === "qatar" && (
        <p className="spectator-year-note">
          Qatar’s 2026 race weekend is 27–29 November and has not happened as of
          this source check on 23 November. No 2025 photo is relabeled as a 2026
          view.
        </p>
      )}
      {year === "2026" && venue === "bahrain" && (
        <p className="spectator-year-note">
          This model is Sakhir 2027. The checked 2026 Bahrain-labelled race was
          at a different physical venue, so those images are not used as Sakhir
          seat references.
        </p>
      )}
      <div className="spectator-results" aria-live="polite">
        <p className="spectator-result-count">
          {refs.length} checked {refs.length === 1 ? "reference" : "references"}{" "}
          · no live review feed or aggregated rating
        </p>
        {open && refs.length
          ? refs.map((r) => (
              <article className="spectator-reference" key={r.id}>
                <div className="spectator-ref-meta">
                  <span>
                    {r.year}
                    {r.year === 2024 ? " · OLDER REFERENCE" : ""}
                  </span>
                  <span>
                    {r.kind === "photos" ? "PHOTO SOURCE" : "FAN REPORT"}
                  </span>
                  <span>
                    {r.match === "section-reported"
                      ? "Author names a section"
                      : r.match === "venue-only"
                        ? "Venue context only"
                        : "Viewing area reported"}
                  </span>
                </div>
                <h3>{r.title}</h3>
                <p className="spectator-byline">
                  {r.author} · {r.publisher}
                </p>
                <div className="spectator-ref-location">
                  <strong>Reported location</strong>
                  <p>{r.location}</p>
                  {scope === "venue" && !r.areas.includes(area) && (
                    <span>
                      Different grandstand or venue-wide context, not the
                      selected bank.
                    </span>
                  )}
                </div>
                <p>{r.summary}</p>
                <div className="spectator-expectation">
                  <strong>What to take from this</strong>
                  <p>{r.expectation}</p>
                </div>
                <details className="spectator-provenance">
                  <summary>Year & source evidence</summary>
                  <p>{r.yearEvidence}</p>
                  <p>
                    Published: {r.published}. Checked: {r.checked}. Attendance,
                    capture position and current relevance have not been
                    independently certified.
                  </p>
                </details>
                <OriginalPost reference={r} />
                <a
                  className="spectator-source-link"
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {r.kind === "photos" && !r.embed
                    ? "View photographs on the author’s site"
                    : "Open original source"}
                </a>
              </article>
            ))
          : open && (
              <div className="spectator-empty">
                <h3>No checked reference for these filters.</h3>
                <p>
                  We have not found a reliable{" "}
                  {kind === "photos" ? "photo source" : "reference"} for this
                  grandstand and year. An empty result is not evidence that the
                  view is poor.
                </p>
                {venueCount > 0 ? <button
                  onClick={() => {
                    setScope("venue");
                    setYear("all");
                    setKind("all");
                  }}
                >
                  Show checked venue references
                </button> : <p>No checked photos or reports for this venue yet.</p>}
              </div>
            )}
      </div>
      <footer>
        <p>
          Photo rights stay with the authors. Supported embeds preserve source
          attribution; other photographs open on the original site. No
          screenshots or images are scraped into our asset library.
        </p>
        <button onClick={onClose}>Back to the model</button>
      </footer>
    </dialog>
  );
}
