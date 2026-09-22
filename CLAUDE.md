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

## 5. Next up — Phase 7 (Booking / Forms)

1. **Booking modal / page** — the old "Reserve Your Adventure" form (First/Last name, Email,
   Phone, Company, Destination, Travel dates, Group size, Budget, Requirements) → POST to the
   public `enquiries` endpoint (mirror `NewsletterForm`). Pre-fill `destination` from the item.
2. **Wire the CTAs** — every BOOK NOW / RENT NOW / RESERVE YOUR RIDE / GO CARAVANNING opens the
   booking form (currently they point at `/contact`). Newsletter is already wired.
3. Then **Phase 8** (polish: `.gitattributes` CRLF fix, responsive/QA pass, real content + logo
   from client, animations where they earn it, deploy).
4. **Still deferred:** tier block (Q2), Tales/Snaps on caravans (Q4) — see §7.

**Reusable pieces already built:** `CaravanCard`, `TourCard`, `FilterBar`, `Tabs`,
`IconFeatureList`, `SectionHeading`, `ViewAllLink`, `CtaButton`, `FeatureTickList` (admin).

**Deferred / conditional (do NOT block):**
- [ ] **Tier explainer block** on the homepage — waits on Q2 (page 30 vs 31 copy).
- [ ] Wire **Tales/Snaps** onto **Caravans** — only if client confirms (open Q4).
- [ ] Admin polish (optional) — icons in relationship pickers; tabs on big Caravan/Tour forms.
- [ ] Client to provide real images/content + logo (see §7) — sections use gradient fallbacks until then.

**Goal: better than the old site** — faster (next/image + SSR), fully self-editable, mobile-first,
tasteful motion (CSS-first), a11y + SEO. Keep motion lean for the deadline.

---

## 5a. Resume playbook — what's coming (paused 2026-09-21)

**Status: build is functionally complete + polished; paused for client content/answers.**
All 13 routes 200. Git clean & pushed to `github.com/saunaksharma/Motorhome-client`.

**To restart the dev server:** `npm --prefix motorhome-adventures run dev` → http://localhost:3000
(admin `/admin`, login `saunaksharma@gmail.com`). Seed is idempotent — safe to re-run only via a
temporary `/seed` route (see git history); it never overwrites existing rows.

**When the client's ANSWERS arrive (see §7), do:**
- **Q2 tier copy** → build the homepage "Which Caravan Tier" block (page 30/31 wording); the
  class descriptions can live on `caravan-filter-options` (class) — add a `description` field there.
- **Q4 Tales/Snaps on caravans** → if yes, uncomment/add `tales`+`snaps` relationships on
  `Caravans` (mirror how `Tours` does it) + surface tabs on the caravan detail.
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
