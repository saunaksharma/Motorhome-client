@AGENTS.md

# Motorhome Adventures — Project Guide (living doc)

> **Keep this file current every session.** When something ships, move it from
> "Next up" to the "Progress log". When a phase completes, update its status. Never
> let this drift from reality — it is the shared source of truth.

---

## 0. North star (why this project exists)

The client must be able to **edit everything themselves — with no dependency on a
developer**. The old backend "worked", but every change needed the original dev, and that
failed. So: **when in doubt, make it CMS-editable** (hero slides, features, reviews, footer
links, sort/featured/active, unlimited child pages). Design page-53 spells this out.

---

## 1. Stack & structure

- **Next.js 16 + Payload 3.90.1** (Payload embedded in the Next app) · **Neon Postgres** · TypeScript.
- **Frontend styling: Tailwind v4 + shadcn/ui** (brand theme in `(frontend)/globals.css`;
  `cn()` in `src/lib/utils.ts`; shadcn config in `components.json`; components land in
  `src/components/ui/`). We pull components from **21st.dev** (React + Tailwind + shadcn) and
  adapt them to the brand tokens. **Tailwind loads only on the public site** — the Payload
  admin keeps its own styling (verified). Icons: `lucide-react`.
- Everything lives in **`motorhome-adventures/`**. `.env` is gitignored and holds
  `DATABASE_URI` (Neon **direct** connection — Payload needs prepared statements) and `PAYLOAD_SECRET`.
- Key paths:
  - `src/payload.config.ts` — registers all collections/globals.
  - `src/collections/*` — one file per collection.
  - `src/fields/*` — shared field helpers (`listingMeta`, `slugField`).
  - `src/app/(payload)/*` — Payload admin (auto-generated; do **not** hand-edit).
  - `src/app/(frontend)/*` — the public website (Next).
- Commands (run from `motorhome-adventures/`):
  - `npm run dev` — start the app (http://localhost:3000, admin at `/admin`).
  - `npm run generate:types` — regenerate `payload-types.ts` after any schema change.
  - `npm run generate:importmap` — after adding custom admin components.
- **Design source of truth:** `../SPEC.md` (pages + CMS-editable flags) and `../SCHEMA.md`
  (data model). Design images are in the project root. "page-N" = the Canva page number.
- **Pixel reference — the finished OLD site:** `https://deepskyblue-wildcat-500319.hostingersite.com`
  (index.html + `/cravans_explore.html?type=caravan&id=...`). Build the NEW Canva design, but
  match this site's polish. Note: Innovations is a real homepage section there (caravan-style
  cards with a category badge) — so it is NOT deferred; model it like Caravans.

---

## 2. Coding standards (Karpathy — see `andrej-karpathy-skills/`)

1. **Think before coding** — state assumptions, present options, ask when unclear. Don't guess.
2. **Simplicity first** — minimum code; no speculative abstractions, config, or fields.
3. **Surgical changes** — touch only what's needed; match existing style; don't refactor unrelated code.
4. **Goal-driven** — define a verifiable check per step and verify before moving on.
5. **Clean & easy to understand** — small files, clear names, comments that state intent, no cleverness.
6. **Verify** DB/schema work via the **app REST API** (`/api/<slug>` returns 200 + JSON),
   not throwaway direct DB connections (Neon autosuspends and refuses them).
7. One collection/piece at a time → verify → **commit** as its own clean diff → repeat.

---

## 3. Phases & the discipline rule

**RULE: one phase at a time. Do NOT start the next phase's work until the current phase is
complete and verified.** Within a phase, build one piece, verify, commit, then the next.

| Phase | Scope | Status |
|---|---|---|
| 0 · Setup | Scaffold, Neon, admin user, git | ✅ done |
| 1 · Data model | All Payload collections + globals (incl. Innovations) | ✅ done |
| 2 · Design system + shell | tokens, fonts, header, footer, newsletter, CTA | ✅ done |
| 2.5 · Tailwind + shadcn | migrate shell to Tailwind v4 + shadcn; wire brand theme | ✅ done |
| 3 · Homepage | hero, reviews, featured strips, About, tips, tiers, footprint, CTA | ✅ done (tier block deferred → Q2) |
| 4 · Caravans front-end | listing + filters + detail + feature tick-list | ✅ done |
| 5 · Tours front-end | listing + filters + detail + itinerary | ✅ done |
| 6 · Blog + Gallery | blog listing + article + gallery + lightbox; Tales/Snaps linked | ✅ done |
| 7 · Forms | booking form → Enquiries (newsletter already wired) | ✅ done |
| 8 · Polish | innovations + real photos + hero + caravan detail (FAQ/videos/articles) + reviews-under-hero + real About page + Pages collection (legal/programme) | ✅ done |
| 9 · Launch-prep | favicon ✅, prod build green ✅, responsive ✅; deploy + cloud media remain | 🔨 in progress |

---

## 4. Progress log (done & verified)

- ✅ **Phase 0** — Payload + Next + Neon scaffold; admin user (`saunaksharma@gmail.com`); git baseline.
- ✅ Shared helpers — `listingMeta` (sortOrder/featured/active), `slugField` (auto-slug).
- ✅ **Features** — name, icon (→media), category (spec/inclusion/exclusion/unique-feature/add-on).
- ✅ **CaravanFilterOptions** — group: base-location / drive-type / berth-range / class.
- ✅ **TourFilterOptions** — group: duration-band / location / preference.
- ✅ **Caravans** — filters + feature tick-lists (+ per-section "additional") + gallery + highlights + CTA + slug + listingMeta. (Tales/Snaps intentionally deferred.)
- ✅ **Tours** — filters + Route Map itinerary + highlights + CTA + slug + listingMeta + **Tales/Snaps** relationships.
- ✅ **Galleries** ("Snaps"), **BlogCategories** ("Featuring"), **BlogArticles** ("Tales").
- ✅ **Reviews** (testimonials), **HeroSlides** (carousel), **Tips** (accordion).
- ✅ **Enquiries** (booking "Customer Data", public-create / admin-read) + **Subscribers** (newsletter). Public create verified; reads 403.
- ✅ **Globals**: Header (nav data), Footer (columns/socials/newsletter), Homepage (reviewsIntro, About sections, Footprint, Dream-Big CTA). All 200.

**➡️ Phase 1 data model is COMPLETE** (incl. the **Innovations** collection, added day 2).
The client can now enter real content in the admin. Access control is MVP-correct: content =
public read / admin write; submissions = public create / admin read.

**➡️ Phase 3 homepage is COMPLETE** (day 2) — Hero, Featured Caravans/Tours, Innovations,
Reviews, About, Tips, Footprint, Dream Big. Tier block deferred (Q2). Content is seeded sample
data (idempotent `runSeed`); client swaps in real content + images later.

### Phase 2 (design system + shell) — in progress
- ✅ Design tokens in `src/app/(frontend)/styles.css`; 3 Google fonts via `next/font`.
- ✅ Layout shell fetches Header/Footer globals; renders `SiteHeader` + `SiteFooter`.
- ✅ **SiteHeader** — responsive (desktop text nav / mobile hamburger). Header decision = "both" (industry standard). Falls back to default nav until the client fills the Header global.
- ✅ **SiteFooter** — link columns + socials + newsletter block.
- ✅ **NewsletterForm** (client) → POST `/api/subscribers`; **CtaButton** (fills green on hover).
- Verified in browser: green/cream/gold + fonts render; both nav states work.

Commits: `scaffold → Features → filters → Caravans → Tours → galleries+blog → reviews+hero+tips → enquiries+subscribers → globals → phase2-shell`. (10 commits.)

---

## 4a. Session log

### 2026-09-22 (day 3, cont.) — real tour content + hero polish
- **Hero redesigned to match the reference/Canva exactly:** removed dots + prev/next arrows,
  autoplay-only crossfade (1s ease), gradient scrim; "HOME AWAY HOME" is now **gold text in a
  gold-bordered green pill**, CTA is a **gold-outline** pill (added a `gold` variant to
  `CtaButton`). Client's real hero photos render.
- **Imported the client's 24 real tour itineraries** (from `../itenaries/*.docx`). Built a
  defensive docx parser (`scratchpad/parse_itineraries.py`): joins the doc, splits on `Day N`
  markers globally, preserves "→" routes, folds drive/overnight meta into each day. 23/24 parsed
  with exact day counts (Jibhi's source doc is missing its Day 1 heading — client adds it). Then
  a temp `/import-tours` route upserted them via the local API: name, durationLabel + band, route,
  season, one-liner→shortDescription, full Route-Map itinerary (Lexical), location mapped by
  keyword. Added **8 new Location options** (Nepal, Bhutan, Meghalaya, Goa, Kerala, Nilgiris,
  Madhya Pradesh, Bihar) → 12 total. Featured: Ladakh, Spiti, Mukteshwar. Verified `/tours` (24
  cards) + `/tours/the-spiti-sojourn` (16-day Route Map renders). Temp route + `tmp-tours.json`
  deleted. **Real content is now live** — the CMS's whole purpose, demonstrated.
- **Tour category badges + polished card copy:** added a `category` select to Tours
  (Adventure/Wildlife/Nature/Cultural/Spiritual/Beach), shown as a gold badge on `TourCard`,
  and set each tour's `shortDescription` to the client's own marketing copy from their live
  reference site. `/tours` now matches the reference cards (minus photos). tsc clean; pushed.
- **Audited the reference site** (`deepskyblue-wildcat-500319.hostingersite.com/index.html`).
  Homepage order there: Hero → **HONEST REVIEWS** (testimonials + "Share Your Experience") →
  OUR TOURS → OUR CARAVANS → OUR INNOVATION → **HOW IT ALL BEGAN** (origin story) → footer. We
  have all these sections; reviews sit right under the hero there (ours has featured strips
  first — possible reorder). Remaining gaps tracked in §9.

### 2026-09-24 (day 5, cont.) — Rivian-style zoom-out collage on caravan pages
- User loved rivian.com/r1t's scroll moment (inspected live): a full-screen photo is pinned, zooms
  OUT into the centre tile of a photo grid, which darkens while a headline + button rise in.
- **`ZoomCollage`** (caravan page, between description and the Overview tabs, full-bleed): cover
  photo = centre tile, 8 surrounding tiles from the caravan's gallery (repeat if fewer; hidden if
  < 4 photos). Title = caravan name, text = its short description (admin-editable, no invented
  copy), button "See all photos" → `#photos` (Photo Gallery wrapper, `scroll-mt-28`).
- Pure CSS scroll-driven animation (`.collage*` in globals.css): section is a named view timeline
  (`view-timeline-name: --collage`, 260vh tall), sticky 100svh stage; grid `scale(3.5)→1` over
  `contain 0–60%`, shade `45–75%`, text `55–85%`. No support / reduced motion → one-screen static
  finished collage. Verified by wheel-scrolling on desktop 1280 and phone 375.
- Review gotcha: with the browser pane hidden, JS layout reads are 0 — test scroll effects with
  real wheel scrolls + screenshots (those force a render).

### 2026-09-24 (day 5, cont.) — Adria feel: row headers, split caravan cards, phone hero; Footprint
- Studied adria-mobil.com live (desktop + 375px): product rows = title left + "all products"
  link right, split cards (photo left / text right, 2 per view, next peeks), ‹ › under the row;
  phone hero ≈ ¾ screen (620/812px, next section peeks), edge-to-edge, title bottom-left in two
  bold lines, small outline button. No box behind hero text.
- **`RowHeading`** (new): Adria row header for homepage Tours / Caravans / Innovations; the gold
  "View All" pill under each row (`ViewAllLink`) is deleted.
- **`SwipeRow wide`** → 2 per view on desktop; **`CaravanCard split`** → photo 42% left / text right
  from sm up (homepage caravans row only; /caravans listing unchanged).
- **Homepage hero on phones** = Adria: `h-[78svh]`, text bottom-left, gold line WITHOUT the box,
  small outline CTA. Desktop still the client's Canva (full screen, centred, gold badge).
- **Hero CTA:** Magic UI Shimmer button removed (user: "gold shadow line") → plain gold-outline
  `CtaButton gold`. `ui/shimmer-link.tsx` + shimmer/spin keyframes deleted. Header "Book Now" hover
  glow removed.
- **Footprint:** client didn't like the phone panel → three arches in ONE row at every size (smaller
  on phones), values split on "•" one per line (INDIA / NEPAL / …) like the old site, thin ring
  around each arch (old site's double-arch frame).

### 2026-09-24 (day 5, cont.) — fonts like the old site, capitals (Adria feel), one-row sections
- **Fonts = the client's previous site exactly:** Racing Sans One for every heading/title, Lato for
  everything else (old site: `h1–h6 { Racing Sans One }`, body Lato 300/400/700/900; checked its CSS).
  **Oswald removed** (public site). **No italic anywhere** — we had `italic` on top of Racing Sans One
  (already a sporty face) → double slant; user asked "why is it slanted". Removed from 17 files.
  Tokens: `--font-display` = Racing (headings/titles), `--font-heading` = Lato (nav, buttons, small
  uppercase labels), `--font-body` = Lato. Card titles / day titles / FAQ / footer headings moved from
  Oswald to `font-display` (no font-semibold — Racing has one weight). Admin panel still uses its own
  Oswald in `(payload)/custom.css` (separate, fine).
- **Capitals (user: "all text that isn't a paragraph", Adria's feel — NOT Adria's font Raleway):**
  `@layer base { h1–h6 { uppercase; letter-spacing .04em } summary { uppercase } }` (base layer so
  utilities still win) + quick-facts values, Footprint stats, header/footer brand. Buttons, nav, tabs,
  labels, reviewer names were already uppercase. Paragraphs stay normal case.
- **`SwipeRow` is now one sideways row at every size** (user: desktop sections in a single row like
  mobile): phones 82% cards + focus effect + counter; sm 2½ cards; lg 3 per view; ← → buttons beside
  the gold progress line from sm up (hidden when everything fits). `.swipe-track .reveal` disabled at
  ALL sizes now. Homepage rows fetch up to 12 featured items — client ticks "Featured" to grow a row.
- Header "Book Now" wrapped at 1280 once Lato (wider than Oswald) came in → `whitespace-nowrap`.
- Verified: build green; 17 pages × 4 widths no overflow/spill; desktop row arrows scroll one card.

### 2026-09-24 (day 5, cont.) — mobile audit: headers, hero, gallery, nav
- **Audit method:** production build on :3000, pages checked at 375 / 390 / 414 / 768 + 1024 desktop;
  scripted sweep (iframes per width) for page-level sideways scroll + text spilling out of its box
  → 0 issues on 17 pages × 4 widths. Crawl 59 pages / 0 broken links / 0 broken images.
- ⚠️ **Review gotcha:** the browser pane is often *hidden* → `document.hidden` → CSS animations stay
  paused at frame 0, so `.rise-in` titles/hero text look faded/invisible in screenshots. Not a bug.
  For review inject `*{animation:none!important;transition:none!important}`. Lazy images also don't load there.
- **`DetailHero` (caravan/tour/innovation) on phones:** no floating white box any more — name sits low
  on a deeper fade (`text-[2.6rem]`, text-balance), facts follow as a 2-col list with hairlines, long
  values (tour route, >22 chars) take a full row, full-width CTA. From `sm` up unchanged (white bar
  overlapping the photo).
- **Focal points:** new `focalPosition(media)` in `lib/utils` → `object-position` from the Media focal
  point the client can click in the admin. Used by the homepage hero, DetailHero and album covers —
  tall phone crops keep the subject in frame.
- **Homepage hero on phones:** text in the lower third (`justify-end pb-[16svh]`), "HOME AWAY HOME"
  badge is a slim single line (`clamp(1.5rem,8vw,1.9rem)`, 1.5px border) instead of a 2-line box;
  desktop still the Canva (centred). Hero photos are 4000px but heavily compressed (525 KB) → look
  soft on tall phone crops; client should upload sharper originals / set focal points.
- **`PageBanner`** (About + CMS pages): inset + rounded like the photo headers, compact on phones.
- **`GalleryGrid`** (album pages, caravan/innovation Photo Gallery, Tales & Snaps): mosaic — phones
  wide/square/square rhythm (lone last photo goes wide), sm+ first photo a 2×2 feature, columns adapt
  to count (3 photos → 3 cols, fills exactly). Lightbox: counter, ✕, prev/next (sm+), swipe, ←/→/Esc,
  caption or "Swipe for more", body scroll locked, taps on the photo don't close it. Verified in browser.
- **/gallery** album cards → tour-card style (photo, title + "N photos" on a fade).
- **Nav:** items wrapped to 2 lines at 1024–1090px → `whitespace-nowrap` + tighter spacing below xl.

### 2026-09-24 (day 5) — LIVE on Vercel + phone swipe rows + Footprint
- **Hosted on Vercel** (project `motorhome-client`, team `saunak`, Hobby plan, connected to the GitHub
  repo → every push to main auto-deploys). Site https://motorhome-client.vercel.app, admin `/admin`.
  Functions in **sin1** (`vercel.json`) next to Neon. Env vars on Vercel: DATABASE_URI, PAYLOAD_SECRET,
  BLOB_READ_WRITE_TOKEN (+ placeholder SERVER_URL / SMTP_* / EXTRA_ORIGINS the user copied from
  .env.example — harmless, tidy before launch). Cloudflare tunnel + its URL are retired.
- **Media → Vercel Blob** (`@payloadcms/storage-vercel-blob` 3.90.1, store `motorhome-media`, Public,
  sin1). Plugin is ON wherever `BLOB_READ_WRITE_TOKEN` is set — now also in local `.env`, so local and
  live share ONE database AND ONE storage. The 144 existing files were copied to the store root with
  `tmp-blob/upload-media.mjs` (gitignored; re-runnable). Vercel's new UI connects stores via OIDC and
  does NOT create the rw token automatically — the user had to add it by hand (plugin needs it).
- ⚠️ **Plugin quirk:** when enabled it drops the `prefix` column unless a prefix is set → dev asked
  "delete prefix column (144 items)? (y/N)". NEVER accept schema-push prompts; fixed with
  `collections: { media: { prefix: '' } }`.
- Vercel CLI is logged in on this PC and linked (`.vercel/`, `.env.local` with an OIDC token — both
  gitignored). `npx vercel redeploy https://motorhome-client.vercel.app --target production` works.
- **`SwipeRow`** (homepage Tours / Caravans / Innovations): on phones a full-bleed snap carousel —
  82%-wide cards (next one peeks), centred card in focus / sides scale .9 + fade via CSS
  `animation-timeline: view(inline)` (`.swipe-slide`), gold progress line + "02 / 06" counter.
  `.reveal` is disabled inside the row (its block-axis timeline would bind to the sideways row).
  From `sm` up it's the same grid as before. Phone homepage 14,815px → 10,245px tall.
- **Footprint** on phones: one compact green panel with gold dividers instead of 3 stacked domes
  (840 → ~390px); arches unchanged from `sm` up.
- Gotcha (again): the dev server's Tailwind sometimes doesn't generate new classes. Verify with
  `npm run build` + grep `.next/static/chunks/*.css` (use `grep -F`) before assuming a code bug.

### 2026-09-23 (day 4, cont.) — design upgrades: detail headers, Route Map, filters
- **`DetailHero`** on caravan / tour / innovation pages (Adria-style): big rounded photo with the
  name over it + a white quick-facts bar overlapping its foot (caravan: Sleeps / Drive / Based in /
  Base vehicle; tour: Duration / Best season / Style / Route; innovation: Seats / Sleeps / Based in)
  with the main CTA. Empty facts skipped. Body below = description only (photo not repeated).
  `PageBanner` is still used by /about and CMS pages.
- **Route Map** = dot-and-line timeline: gold dot per day on one thin line, day title exactly as
  typed. **User said: no numbering** (tried numbered circles, removed).
- **FilterBar** = one white pill panel of labelled native selects, active one tinted, "Clear".
  **Bug fixed:** /blog filters server-side but FilterBar only rewrote the URL in the browser →
  picking a category did nothing. `serverFiltered` prop → router.replace (blog only).
  SearchBox restyled to match. Blog cards without a cover show the gold emblem (was a book icon;
  plain `<img>` since `/brand/` isn't in next/image `localPatterns`).
- Buttons left as-is on purpose: one system already (outline pill that fills green on hover =
  the client's design note).
- Gotcha: brand-new Tailwind classes can be missing from the dev CSS until a reload — check
  computed styles before assuming a code bug.
- Verified: tsc, build, 8 key pages' JS/CSS + tunnel, crawl 59 pages / 0 broken links / 0 broken images.

### 2026-09-23 (day 4, cont.) — feature lists redesign + Tales & Snaps
- **Feature lists** (`IconFeatureList` + `featureIcon.ts`), after Airbnb amenities / Adria highlights:
  each feature gets a meaningful Lucide icon picked from its name (keyword → icon map, e.g. bath →
  Bath, AC → AirVent); a real uploaded icon still wins over the shared placeholder. Specs / unique
  features / add-ons = icon **tiles**; included / not included = two-column **list**, exclusions
  muted + struck through.
- **Tales & Snaps** (`components/TalesAndSnaps.tsx`, the 2022 brief's naming): one shared section on
  tour AND caravan pages — tabs "Tales (n)" = article cards, "Snaps (n)" = each album's photos
  (lightbox) + "View album". Empty tab hidden; whole section hidden when both empty.
  Caravans got a new `snaps` field (→ galleries, many); `relatedArticles` relabelled "Tales".
  `RelatedContent` now only does FAQs + videos. Sample Ladakh album's placeholder SVGs swapped
  for the client's 3 real Ladakh photos. Verified on `/tours/the-adventures-of-ladakh` + Willow.
- Gotcha: `curl` treats `[ ]` in URLs as globs — use `curl -g` for `?where[slug][equals]=…`.

### 2026-09-23 (day 4, cont.) — polish round 2: cards, feature icons, reviews (ref: adria-mobil.com)
- User flagged the cards as "rectangle / cheap". Reference: **Adria Mobil** (big calm tinted product
  cards, 2-up, left-aligned, 2 pill actions, no icon clutter).
- **CaravanCard** rebuilt Adria-style: tinted rounded panel, 16:10 photo, glass "<Class> class" tag,
  upright Oswald name, 2-line description, one compact spec line (Sleeps · Drive · Base, gold dots),
  **Explore** (solid) + **Enquire** (→ /contact?destination=Name). /caravans is now 2 per row
  (`FilteredGrid` got a `gridClassName` prop); homepage featured stays 3-up.
- **TourCard** rebuilt as a travel-magazine photo card: 4:5 photo, category + duration tags, name /
  route / season on a dark fade, description + "Explore →" slide up on hover (always shown on mobile);
  whole card is one link.
- **InnovationCard** matches the caravan card style.
- Cleared the 6 caravan card lines I generated at import ("Sleeps N · …") — they duplicated the spec line.
- **IconFeatureList:** the seed's shared 2×2 placeholder (`feature-icon.svg`) now shows a clean gold
  tick; real uploaded icons still win. **Exclusions** now show a muted ✕ (a tick implied "included").
- **Reviews:** all 7 photos WERE imported, but quote reviews showed them as 40px avatars. Now one
  uniform 440px photo card per review (stars / quote / name on a dark fade) — row always even.
  The Reviews `style` field is no longer used by the front end.

### 2026-09-23 (day 4, cont.) — visual polish, round 1 (header, headings, hero, story photos)
- **Header** (`SiteHeader`): floating glass bar after 21st.dev's "resizable navbar" pattern — see-through
  over the homepage hero, solid green once scrolled / on other pages (spacer div pushes content below
  it). Bigger logo lockup (emblem + "MOTORHOME" gold italic / "ADVENTURES" spaced caps), gold
  hover-underline + active-page state, gold "Book Now" pill (xl+), animated mobile panel.
- **SectionHeading**: gold line–diamond–line ornament that draws in on scroll + spaced-caps subtitle.
- **Hero**: full-screen (100svh) under the floating header; headline rises in per slide;
  CTA is Magic UI's **Shimmer Button** as a link (`components/ui/shimmer-link.tsx`).
  Cropped a baked-in Canva footer strip off `hero-home-away-home` (now `-v2.jpg`, new filename = no stale cache).
- **Cards** (tour/caravan/innovation/blog): scroll reveal, hover lift, slow photo zoom, spotlight glow classes.
- **Effects CSS** (`globals.css`): Magic UI shimmer keyframes; Blur-Fade-style `.reveal` using native
  scroll-driven animation (zero JS); `.spotlight`, `.border-beam`, `.rise-in`; all off under reduced motion.
  Decided against `motion` dependency (~35 KB) — effects rebuilt in CSS for speed.
- **Rejected by user, removed:** destinations marquee strip + hero scroll-cue arrow ("looks cheap").
- **Homepage story** (Homepage global `aboutSections`): now 4 blocks with the client's real photos + full
  copy from the old site — How It All Began (their first motorhome in Ladakh), The People Behind the
  Wheel (2004 group photo), NEW From Backseat Guides to Frontseat Creators (Saini family), Why Travel
  With Us (Harper night photo). About page got the Ladakh photo + real Instagram/YouTube links.
- **Rich text fix:** paragraphs from the editor ran together (renderer wraps them, parent space-y can't
  reach) → `.rich-text` class spaces paragraphs and restores list bullets; applied to all 9 renderers.
- **`(frontend)/loading.tsx`:** instant loading indicator on navigation. Root cause of "links not
  clicking": dev server compiles each page on first visit (seconds, no feedback) + my browser automation
  holding the pane. Verified real clicks navigate. Production (pre-built) is instant.
- Dev on **port 3001** (`next dev --port 3001`, outputs to `.next/dev`) runs alongside the prod server on
  3000 that the tunnel serves — so work never disturbs the preview link.

### 2026-09-23 (day 4, cont.) — speed, preview tunnel, SSL warning
- **SSL warning fixed:** `DATABASE_URI` now uses `sslmode=verify-full` (was `require`, which pg
  warns will weaken in v9). Same in `.env.example`. DB verified working.
- **Preview for others (Option 1 — Cloudflare quick tunnel):** `D:\Motor Home Client\tools\cloudflared.exe`
  (official, v2026.9.1, outside the repo). Run the prod server (`npm run build && npm start`), then
  `cloudflared tunnel --url http://localhost:3000` → prints a random `https://*.trycloudflare.com` URL
  (changes every restart; PC must stay on). Admin logins from that URL need it in `.env`
  `EXTRA_ORIGINS=` (new, comma-separated; appended to CORS/CSRF in payload.config). Verified: login
  via tunnel returns 401 on bad password (not a 403 CSRF block). Remove EXTRA_ORIGINS after testing.
- **Speed — every public page is now pre-built (static/SSG), was server-rendered per visit.**
  Measured first-byte: /tours 3.2s → 0.009s, /caravans 2.3s → 0.008s, detail pages ~1–2s → ~0.008s.
  Cause was per-visit DB round-trips to Neon in **Singapore** (ap-southeast-1).
  - Listings (/tours, /caravans) render ALL cards; `FilteredGrid` (client) filters in the browser from
    URL params; `FilterBar` updates the URL with `history.replaceState` (no server hit, still shareable).
    Cards are tagged via `relIds()` (lib/utils). Separate Suspense boundaries avoid layout jump.
  - Detail pages: `generateStaticParams = slugParams('<collection>')` (lib/staticParams) + `revalidate = 60`.
  - /contact is static; `BookingForm` pre-fills Destination from `?destination=` in the browser.
  - Freshness unchanged: saving in the admin still revalidates the whole site instantly.
  - Only /blog (search) remains dynamic. Build shows 66 pre-built pages.
  - Verified in browser: filters, combined filters, reset, shared filtered links, destination pre-fill.

### 2026-09-23 (day 4, cont.) — imported the previous site's backend
- **Source:** old admin `deepskyblue-wildcat-500319.hostingersite.com/admin/` (client logged in; we
  read only). Its data comes from **public, unauthenticated** JSON endpoints — no login needed:
  `/api/listings.php?section=caravans|innovation`, `/api/tours.php`, `/api/blog.php`,
  `/api/hero-slides.php`, `/api/reviews.php`, `/api/content.php` (all `?page=1&limit=200`).
  Photos live at `/images/<file>`. Messages/appointments (customer PII) were NOT touched.
- **Imported (real data):** caravans 3 → **8** (Willow, Harper, Kástro, Aurum, Rambler, Shiloh,
  Reisender Rogue, Aégis) with class/berths/base/drive type, cover + full galleries (92 photos),
  Willow & Harper descriptions + real spec/unique/inclusion/exclusion ticks + **real YouTube
  walk-throughs** (replaced my placeholder demo videos). Innovations 3 → **6** (+Club on Wheels,
  Food Fusion Express, Election Express) with galleries. Reviews 4 → **7** (+Akon, Varun Sood,
  Mandira Bedi) in the old display order. Tour **#25** Sun, Sand & Sea: Bangalore to Goa (7 days).
  18 new Features created (reused matches, e.g. "Permits & Permission" ≈ existing), new filter
  options Himachal/Bangalore/"Self & Chauffeur Driven". Featured caravans: Willow/Harper/Kástro.
- **Skipped as the previous dev's filler:** fake contact block ("123 Adventure Street", "+91 98765
  43210"), 6 two-line placeholder blog posts, template About/FAQ/Safety copy.
- Mapping script: `scratchpad/oldsite/prepare_import.py` → `import.json` (inspected before import);
  temp `/import-oldsite` route (idempotent upserts, Media reused by filename), deleted after.
- **Front-end fixes found while importing:** (1) the admin's "Additional …" free-text boxes were never
  rendered — `IconFeatureList` now takes `extra`; (2) new `PhotoGallery` (reuses `GalleryGrid`
  lightbox) on caravan + innovation pages; (3) Add Ons tab hidden when a caravan has none;
  (4) reviews with style "featured" now show the guest's photo full-card (Akon/Mandira had no text);
  (5) `slugField` strips accents ("Kástro" → `kastro`, was `k-stro`); (6) cleared invented
  innovation "sleeps" values from my day-2 seed.
- Gotcha: my download list's last line had no trailing newline → `while read` silently skipped it
  (Lounger photo). Always verify against the import file, not the downloader's count.
- Verified: 8/6/7/25 records, 0 duplicates, 0 broken images on home/listings, lightbox works,
  `npm run build` exit 0.

### 2026-09-23 (day 4) — branded admin + backend completion
- **Admin branding:** gold emblem logo (login + sidebar, static `public/brand/emblem.png`),
  tab title "· Motorhome Adventures", light theme, green sidebar/buttons (`(payload)/custom.css`),
  **Welcome dashboard** (`components/admin/Welcome.tsx`: "Welcome back, Admin", new-enquiry
  count, 3×2 quick-action shortcuts). Sidebar regrouped: Website Content / Homepage / Inbox /
  Lists & Settings / Media & Accounts / Site Settings; plain-English descriptions per section.
- **Data fixes:** all 24 tour routes rewritten as short accurate lines (parser had left garbage
  like "Rivers – The"); The Great Wild West → Rajasthan (keyword "wild" had matched Uttarakhand).
- **Enquiry lead tracking:** `status` (New/Contacted/Quote sent/Booked/Closed) + private `notes`,
  both field-access-locked so the public form can't set them (verified: forced "booked" → saved "new").
- **Preview button** on tours/caravans/innovations/blog/galleries/pages + Homepage/About globals.
- **Instant updates:** `hooks/revalidateSite.ts` — any content save runs `revalidatePath('/', 'layout')`.
- **Business Details global** (`business`): phone/WhatsApp/email/address/map/hours/enquiry-alert email.
  Feeds footer "Reach Us" column + floating **WhatsApp button** (pre-filled 919871063984 from old site).
  Footer socials pre-filled (IG/YT/FB, real URLs) and shown as icons (`SocialIcon`). Menu saved to
  Header global incl. **Tours** (was missing from the fallback nav).
- **Email:** `@payloadcms/email-nodemailer` switches on only when `SMTP_*` env vars exist (see
  `.env.example`); `notifyNewEnquiry` hook emails each new enquiry (verified via console log).
- **SEO:** `@payloadcms/plugin-seo` (tabbed Content/SEO, auto-generate title/description/image,
  Google preview) on all page types; `lib/seo.ts` `pageMetadata()` used by every detail page.
- **Spam:** honeypot field `website` on both forms + `rejectBots` beforeOperation hook (verified 400).
- Removed all QA/test records (inbox = 0). `npm run build` exit 0. npm audit: 5 moderate, all
  pre-existing dev-only (esbuild via drizzle-kit), none from new packages.
- Admin password was reset via Payload `forgotPassword` (local temp route, deleted) — no email adapter yet.

### 2026-09-22 (day 3, cont.) — Phases 8a–9 (grind through remaining backlog)
- **8a Caravan detail parity:** added `faqs`, `relatedVideos` (≤3), `relatedArticles` to Caravans
  + reusable `RelatedContent` (native <details> FAQ accordion, video link cards, BlogCard grid).
- **8b Homepage → reference order:** Hero → Reviews → Tours → Caravans → Innovations → About.
  Reviewer avatars in testimonial cards + "Share Your Experience" CTA.
- **8c Real About page:** new `about` global (intro/team/hiring/socials); /about renders it
  (was a redirect). Seeded the client's origin story.
- **8d Pages collection:** generic `pages` (title/slug/body/active) at `/<slug>` via catch-all;
  seeded Terms, Privacy, FAQ, Returning-Customer, Influencer, Partner, B2B (programme pages carry
  the 2022 brief's real copy) + a "Useful Pages" footer column.
- **9 Launch-prep:** SVG favicon; **`npm run build` passes clean**; mobile responsive spot-check
  good. All committed + pushed to main.
- **Still needed for launch (client):** see §7/§9 — real logo, remaining photos, domain/hosting,
  cloud media (S3/R2), form spam protection. Deferred features (need client answers): newsletter
  segmentation, tour questionnaire popup, booking itinerary-builder, tier block (Q2).

### 2026-09-22 (day 3, cont.) — real photos across the site
- **Pulled the client's real photos** from their live reference site (`/images/*`) and assigned
  them via a temp `/import-media` route (idempotent — reuses Media by filename): **24 tour hero
  images** (mapped by keyword), **3 caravans** (Willow → real Willow slider; Kástro/Aurum → real
  exteriors), **3 innovations** (Lounger/Arcade/Vanity-Van), **4 review avatars** (by
  reviewerName). 42 Media docs total, no dupes, 0 broken on screen. Verified `/tours` + homepage
  (caravans/tours/innovations) all show real photos. Temp route + `tmp-refimg/` deleted.
  ⚠️ Media files live on the local filesystem — production still needs S3/R2 (see §5a).

### 2026-09-22 (day 3, cont.) — client photos + the original 2022 brief
- **Fixed hero images not rendering.** Root cause: setting Payload's `serverURL` made media
  URLs **absolute** (`http://localhost:3000/...`), which next/image rejected (400) even with
  `remotePatterns`; the relative path optimized fine (200). Fix = **do not set `serverURL`** in
  buildConfig (kept `cors`/`csrf` as explicit arrays), so media URLs are relative again →
  next/image works via `localPatterns`. Reverted the now-unneeded `remotePatterns`. Verified:
  all 7 hero slides render the client's real photos on screen.
- **Read the client's original 2022 brief** (`WEB WORK 2022  MA.pdf`, 14 pages). Our
  architecture matches it well and is more self-editable. It **resolves open questions** and
  surfaces real gaps — see §7 (updated) and §9 (new gap list).
- **Security pass:** git audit → **no secrets ever committed** (.env untracked; no Neon
  password/connection string in git). Removed dead `test.env`. **CORS/CSRF locked to
  `SERVER_URL`** (env-driven). **Admin login lockout** (5 attempts → 10-min lock).
  ⚠️ Still to add before launch: form spam protection (captcha/honeypot) — Payload 3 has no
  built-in `rateLimit` config, so do it at the edge or with a captcha.
- **Production build (`npm run build`) now passes clean (exit 0).** It caught **6 real type
  errors** dev mode hid (blog/gallery relationship narrowing, seed `FeatureCategory` + gallery
  slug) — all fixed. Run `npm run build` before every deploy.
- **ISR:** added `revalidate = 60` to the static CMS pages (home/gallery/innovations) so client
  edits appear in production within a minute. (Enhancement later: on-demand revalidation via
  Payload `afterChange` hooks → `revalidatePath` for instant updates.)

### 2026-09-21 (day 2)
- Added **Tailwind v4 + shadcn/ui** (Phase 2.5); migrated the shell; brand theme in globals.css.
- Pulled in the **21st.dev** component approach + the **ui-ux-pro-max** skill (cloned at repo root).
- **Seeded** the filter taxonomy + sample caravans/tours/innovations/reviews/tips/hero/About
  (idempotent `runSeed`; run via a temp `/seed` route since `payload run` is flaky here).
- Built the **whole homepage** (Phase 3): Hero carousel, Featured Caravans/Tours, Innovations,
  Reviews carousel, About, Tips accordion, Footprint, Dream Big CTA. Verified on screen; fast (~0.4s).
- Added the **Innovations** collection. Only the tier block is deferred (Q2).
- Client answers expected by evening — see §7.
- **Phase 4 (Caravans FE)** ✅: listing `/caravans` with URL-driven filters (Base Location /
  Drive / Berth / Class), detail `/caravans/[slug]` with class header, image, rich-text
  description, and the **Overview tabs** (Specs / Unique / Inclusions / Exclusions + Add-Ons
  via `IconFeatureList`). Seeded 26 features (placeholder icon) linked to Willow.
- **Feature checkbox tick-list** (custom admin component `FeatureTickList`): each caravan
  feature field shows every category option as a **checkbox with its icon**; tick → shows on
  front-end, untick → hidden. The client's core ask, done. Registered via importMap.
- **Connected GitHub** `github.com/saunaksharma/Motorhome-client` (main). Pushing after each commit.
- **Phase 5 (Tours FE)** ✅: shared `TourCard`, listing `/tours` with Duration/Location/
  Preference filters, detail `/tours/[slug]` with description + **Route Map** itinerary +
  Tales/Snaps tabs. Seeded a 3-day Route Map on the Ladakh tour.
- **Phase 6 (Blog + Gallery)** ✅: blog listing `/blog` (search + Featuring category + Published
  Since sort), article `/blog/[slug]`, gallery `/gallery` + `/gallery/[slug]` with lightbox.
  Seeded 8 categories + 3 articles + 1 gallery; linked Tales/Snaps onto the Ladakh tour (tabs live).
- **Phase 7 (Booking)** ✅: `BookingForm` → public `enquiries`; `/contact` page; caravan/tour
  detail CTAs pass `?destination`. Verified a submission creates an enquiry.
- **Phase 8 (polish, in progress):** built `/innovations` (+ `[slug]`), `/about` (redirects to
  home), `/build` (placeholder — external URL pending); shared `InnovationCard`; added
  `.gitattributes` (CRLF warnings gone). Investigated the `reading 'id'` TypeError — it was a
  **transient hot-reload artifact** (does not recur on fresh loads); pages return 200.
- **Polish done:** camping line-art pattern on all green banners + `PageBanner` (fixes the
  "flat rectangle" look), branded 404, hero Ken-Burns zoom (reduced-motion aware), and a
  mobile responsive spot-check (header→hamburger, filters stack, cards single-column — good).
- **Remaining:** SEO/OG metadata (optional), real content + logo from client, deploy to domain.
  Site is functionally complete; all 13 routes 200.

### 2026-09-20 (day 1)
- Read all 59 design images + the finished OLD live site; wrote `../SPEC.md` + `../SCHEMA.md`.
- Cloned Karpathy skills; set coding standard. Set 2-week deadline as a hard constraint.
- **Phase 0**: scaffolded Payload 3.90.1 + Next 16 on Neon Postgres; admin user created; git init.
- **Phase 1**: built ALL collections + globals (see Progress log). Data model complete & verified.
- **Phase 2**: design tokens + 3 fonts + responsive header + footer + newsletter + CTA. Verified on screen.
- Decisions: header = responsive both; Innovations = real section (un-deferred).
- **Next session starts at Phase 3 (homepage).** See below.

---

## 5. WHERE WE ARE — read this first (updated 2026-09-23, end of day 4)

**Status:** site + admin are feature-complete and all planned design work is done (Tales & Snaps,
feature lists, photo detail headers, Route Map timeline, filter panel). Real content is in, fast,
fully checked. Remaining = the client's content/answers + launch (hosting/domain/storage/email).

**LIVE:** https://motorhome-client.vercel.app (admin `/admin`) — auto-deploys on every push to
main (Vercel, sin1). Photos live in Vercel Blob. See the 2026-09-24 session log.

**Running it locally:**
- **Working copy (dev, port 3001):** `npx next dev --port 3001` (writes to `.next/dev`).
- **Local production check (port 3000):** stop it, `npm run build`, `npm start`.
- Local and live share the same database and photo storage — local edits are real edits.
- (The Cloudflare tunnel preview is retired; `tools/cloudflared.exe` is still there if ever needed.)
- Admin login: `saunaksharma@gmail.com` (the owner's password; sessions expire after 2 hours).

**⚠️ Hard-won rules:**
- **Stop the port-3000 server BEFORE `npm run build`.** Building while it runs lets the old server
  regenerate pages (ISR) with old file names into the new build → a page with missing CSS/JS
  (happened to the homepage on 2026-09-23; fixed by a clean stop → build → start).
- **Never write file content through a shell command** (backticks inside a bash string get
  EXECUTED). Use the Edit/Write tools.
- In Git Bash, arguments starting with `/` get rewritten to Windows paths — use `MSYS_NO_PATHCONV=1`.

**Last full check-up (2026-09-23):** crawl of 59 pages / 100 internal links / 138 images → 0 broken
images, 1 bad link (fixed). Real-interaction tests passed: nav, mobile menu (now with backdrop),
filters + shared filter links, caravan tabs / FAQ / lightbox / video link, reviews arrows + Read more,
booking form (destination pre-fill) + newsletter (test rows deleted). Backend: create/read/update/
delete on all 15 collections + all 5 globals + accent-safe auto-slug → **0 failures**. Build green,
66 pre-built pages, every public page ~0.01s first byte, every page's JS/CSS files verified.
Check-up scripts: `scratchpad/crawl.py` (pages/links/images) and `scratchpad/chunks.py` (JS/CSS).

**Next up (in order):**
1. ~~Tales & Snaps~~ ✅ · ~~Feature lists~~ ✅ · ~~Detail headers~~ ✅ · ~~Route Map timeline~~ ✅ ·
   ~~Filter pills~~ ✅ (see session log). **All planned build/design work is done.**
2. Launch (needs the client): their domain → Vercel; move the project + Blob store to the
   client's own Vercel account (Hobby is non-commercial → Pro); Neon **pooled** connection string;
   real SMTP env vars; delete the placeholder SERVER_URL/SMTP_*/EXTRA_ORIGINS on Vercel.
3. Client content/answers (§7). Anything new = only on user request, one change at a time.
- Content note: the 3 sample blog posts (Tales) have no cover photos and are seed filler — client
  should write real ones (or delete them) before launch.

**Waiting on the client:** see §7 (contact details, feature lists for 6 caravans, 2 data conflicts,
Terms/Privacy text, Instagram export, LinkedIn URL, decisions). Launch checklist artifact:
https://claude.ai/artifact/5VHND4Z3eCP4zSNnK8vRoj

**How data fixes/imports are done (temp-route pattern):** write `src/app/(frontend)/tmp-*/route.ts`
using the local API, curl it on port 3001 (retry once — the first hit compiles), then DELETE the
route. Staging folders are `/tmp-*/` (gitignored). Never leave temp routes in the tree.

---

## 5a. Playbooks — client answers, client content, deploy

(Running/restarting the servers: see §5.)

**When the client's ANSWERS arrive (see §7), do:**
- **Q2 tier copy** → build the homepage "Which Caravan Tier" block (page 30/31 wording); the
  class descriptions can live on `caravan-filter-options` (class) — add a `description` field there.
- ~~Tales/Snaps on caravans~~ ✅ done (Caravans `relatedArticles` + `snaps`, shared `TalesAndSnaps`).
- **Q5 add-on sub-groups** → add a `group` (sports/lifestyle) select to `features` if confirmed.
- Small confirms (parent-page count, base-vehicle fields, "additional" field) → low-risk tweaks.

**When the client's CONTENT arrives:**
- Preferred path = client enters it themselves in the admin (that's the whole point). Guide them.
- Or migrate from the old site (`deepskyblue-wildcat-500319.hostingersite.com`). The seed's sample
  rows can be deleted once real content is in.
- Real **logo** → set it on the Header + Footer globals. Real **images** → uploads replace the
  gradient/pattern fallbacks everywhere automatically.

**Deploy prep (when ready — needs the client's domain/hosting):**
- Target: **Vercel** (Next + Payload deploy as one app). Env vars: `DATABASE_URI`, `PAYLOAD_SECRET`.
- ⚠️ **Production DB connection:** serverless needs the Neon **pooled** connection string (not the
  direct one we use in dev) — configure the postgres adapter for pooling/`pgbouncer` so prepared
  statements don't break. Test the admin + a form submit on a preview deploy first.
- Set `NEXT_PUBLIC_SERVER_URL` / CORS if needed; run a production build locally (`npm run build`)
  to catch type errors before deploying.

**Optional polish left:** per-page SEO/OG metadata; more animation only where it earns it.

---

## 6. Data model (target — full detail in `../SCHEMA.md`)

**Shared:** `features`, `caravan-filter-options`, `tour-filter-options`.
**Content:** `caravans`, `tours`, `galleries`, `blog-articles`, `blog-categories`,
`reviews`, `hero-slides`, `tips`, `innovations`.
**System:** `users`, `media`, `enquiries`, `subscribers`.
**Globals:** `header`, `footer`, `homepage`.
Every content collection carries `listingMeta` (sortOrder, featured, active).

---

## 7. Unanswered client questions (do NOT guess — get answers)

1. ~~**Header:** page 18 vs 20~~ → **RESOLVED: responsive both** (desktop text nav, mobile hamburger).
2. **Tier copy:** page 30 vs page 31 wording?
3. **Parent-page count:** 5/6/7? Confirm About→Home redirect and Build/Buy→external.
4. ~~**Tales/Snaps on caravans**~~ → **RESOLVED by 2022 brief (p.3): YES** — caravans have
   "Videos Related" (≤3) + "Articles Related" (≤4). Mirror how Tours does it.
5. **Add-on sub-groups** (Sports/Lifestyle): real field or cosmetic?
6. **Missing designs:** Our Innovations, Gallery/Snaps, Blog article page, footer legal pages.
7. **Caravan base-vehicle / sleeps / base-location:** dedicated fields vs spec features?
   (Currently added as dedicated text fields — revisit.)
8. **"additional" free-text:** per-category (current) or one overall?
9. **Typography mapping** across Racing Sans One / Oswald / Lato / Canva Sans / Rustic Printed.
10. **Booking flow:** modal fields (name/email/phone/company/destination/dates/group/budget/notes)
    → stored as Enquiries "Customer Data"?
11. **Old-data conflicts (followed the public card; confirm):** Aégis card says "Self Driven" but its
    drive-type field says "Chauffeur Driven". Shiloh is based in Delhi but "Charges Start From Kota".
12. **6 caravans have no spec/inclusion lists** in the old backend (only Willow & Harper do) — client
    to tick their features in the admin. All features share one placeholder icon — client to upload icons.
13. **Old customer messages (13) + appointments (11)** in the previous backend were not migrated
    (personal data). Does the client want them copied into Enquiries?
14. **Contact details:** only WhatsApp is real so far; phone/email/address still needed (the old
    backend's contact block was fake filler).

---

## 8. Design tokens (sampled from the design pixels)

- `--green: #0D473F` (one green only; darker = opacity over it) · `--gold: #C9A23E`
  (logo ≈ `#C9A03B`, swoosh ≈ `#D0AC3F`) · `--cream: #FDFBF9` · `--card: #FFFFFF` ·
  text `#0D473F` on cream / `#FFFFFF` on green · hero pill = green @ ~0.85 opacity.
- Fonts (Google, via `next/font`): **display** Racing Sans One (italic) · **heading** Oswald
  · **body** Lato. Fallback: sans-serif.

---

## 9. Gap analysis vs the client's original 2022 brief (`WEB WORK 2022  MA.pdf`)

The brief is the client's full wishlist (14 pages). Our architecture matches it and is more
self-editable. Tracked so we don't lose the client's intent. **Not all of this ships for launch**
— the brief itself ends with "what can/can't be done" questions, so it's aspirational.

**✅ Matches or better:** hero slider, featured "NEW" strip, Innovations ("This just in"),
reviews/testimonials, tips ("How-to's"), caravans listing + filters, caravan detail w/ tabs +
feature tick-list, tours listing + filters (**exact** taxonomy match), tour detail + day-by-day
itinerary, blog, gallery, booking→enquiries, newsletter. All CMS-editable (their #1 need).

**🟡 Partial (have the bones, brief wants more):**
- Caravan detail: brief wants **Related Videos (≤3) + Related Articles (≤4)** [= Tales/Snaps, Q4
  now YES], **FAQ per caravan**, **video walk-through**, **floor-plan link**, WhatsApp-catalog
  gallery w/ captions, dedicated base-vehicle / caravan-type / chargeable-from / capacity fields.
- Booking form: brief wants itinerary builder (Location 1/2/3 + add-more), "no fixed date yet",
  month/days-of-travel, returning-customer & influencer paths. Ours is a single simpler form.
- Filter **values**: confirm our seed matches brief exactly — Caravan RENTAL TYPE (Self Driven /
  Chauffeur), CAPACITY (2-4/4-6/6-8/8-12/12+), LOCATION (Delhi/Bangalore/MP/Rajasthan); Tour
  DURATION (2-4/4-7/7-15/15-30/30+), LOCATION (Himachal/Uttarakhand/Rajasthan/Ladakh),
  PREFERENCE (Riverside/Waterfall/Beachside/Jungle quest/Mountain view/City View).
- Gallery: brief wants **year + trip name** on folder cards + video-of-trip + caravan/tour
  cross-link. Confirm our galleries carry these fields.

**❌ Missing (new scope to decide on):**
- **Newsletter segmentation** — 2 parent options → sub-options → tagged email lists (brief p.10).
- **Programme / legal pages** — Returning Customer benefits, Influencer/Collaborator, Partner,
  B2B, Terms, Privacy, FAQ (footer "USEFUL PAGES"). Content pages — could be blog/dedicated.
- **Rich About page** — team photo w/ "who is who", video, hiring (LinkedIn), IG grid, YT preview.
  (Currently About→Home redirect; was deferred pending design.)
- **"What to check first?" guided homepage intro** (arrows → Caravans/Trips/Gallery).
- **Tour questionnaire popup** (Days/Kind/Places → Tours pre-filtered) + caravan→tour carry-over.

**Recommendation:** ship the current build; add the 🟡 caravan detail fields (Related Videos/
Articles, FAQ) since Q4 is now resolved and they're cheap; defer ❌ items to post-launch phases
or confirm with the client. Do them one-at-a-time per the discipline rule.
