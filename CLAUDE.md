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
| 1 · Data model | All Payload collections + globals | ✅ done (Innovations collection still to add — see Next up) |
| 2 · Design system + shell | tokens, fonts, header, footer, newsletter, CTA | ✅ done |
| 2.5 · Tailwind + shadcn | migrate shell to Tailwind v4 + shadcn; wire brand theme | ✅ done |
| 3 · Homepage | hero, reviews, featured strips, About, tips, tiers, footprint, CTA | ✅ done (tier block deferred → Q2) |
| 4 · Caravans front-end | listing + filters + detail | 👉 NEXT |
| 5 · Tours front-end | listing + filters + detail + itinerary | ⬜ not started |
| 6 · Blog + Gallery | listing + article + gallery | ⬜ blocked: missing designs |
| 7 · Forms | booking modal → Enquiries, newsletter → Subscribers | ⬜ not started |
| 8 · Polish | responsive, animation, QA, deploy | ⬜ not started |

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

### 2026-09-21 (day 2)
- Added **Tailwind v4 + shadcn/ui** (Phase 2.5); migrated the shell; brand theme in globals.css.
- Pulled in the **21st.dev** component approach + the **ui-ux-pro-max** skill (cloned at repo root).
- **Seeded** the filter taxonomy + sample caravans/tours/innovations/reviews/tips/hero/About
  (idempotent `runSeed`; run via a temp `/seed` route since `payload run` is flaky here).
- Built the **whole homepage** (Phase 3): Hero carousel, Featured Caravans/Tours, Innovations,
  Reviews carousel, About, Tips accordion, Footprint, Dream Big CTA. Verified on screen; fast (~0.4s).
- Added the **Innovations** collection. Only the tier block is deferred (Q2).
- Client answers expected by evening — see §7.
- **Next: Phase 4 (Caravans listing + filters + detail).**

### 2026-09-20 (day 1)
- Read all 59 design images + the finished OLD live site; wrote `../SPEC.md` + `../SCHEMA.md`.
- Cloned Karpathy skills; set coding standard. Set 2-week deadline as a hard constraint.
- **Phase 0**: scaffolded Payload 3.90.1 + Next 16 on Neon Postgres; admin user created; git init.
- **Phase 1**: built ALL collections + globals (see Progress log). Data model complete & verified.
- **Phase 2**: design tokens + 3 fonts + responsive header + footer + newsletter + CTA. Verified on screen.
- Decisions: header = responsive both; Innovations = real section (un-deferred).
- **Next session starts at Phase 3 (homepage).** See below.

---

## 5. Next up — Phase 4 (Caravans front-end)

1. **Caravans listing** `/caravans` — grid of `active` caravans + filter bar (Base Location,
   Drive Type, Berth, Class). Reuse the caravan card from `FeaturedCaravans` (extract a shared
   `CaravanCard` if it helps readability).
2. **Caravan detail** `/caravans/[slug]` — class + name header, image carousel, description,
   media highlights, Overview tabs (Specs / Unique Features / Inclusions / Exclusions via
   `IconFeatureList`), Add-Ons tab, Tales/Snaps tabs. Use shadcn `Tabs`.
3. Then **Phase 5** (Tours FE: listing + detail + Route Map), **6** (Blog/Gallery), **7** (Booking
   modal → Enquiries), **8** (polish/deploy).

**Deferred / conditional (do NOT block):**
- [ ] **Tier explainer block** on the homepage — waits on Q2 (page 30 vs 31 copy).
- [ ] Wire **Tales/Snaps** onto **Caravans** — only if client confirms (open Q4).
- [ ] Admin polish (optional) — icons in relationship pickers; tabs on big Caravan/Tour forms.
- [ ] Client to provide real images/content + logo (see §7) — sections use gradient fallbacks until then.

**Then:** Phase 4 (Caravans FE) → 5 (Tours FE) → 6 (Blog/Gallery, needs designs) → 7 (Booking modal) → 8 (polish/deploy).

**Goal: better than the old site** — faster (next/image + SSR), fully self-editable, mobile-first,
tasteful motion (CSS-first), a11y + SEO. Keep motion lean for the deadline.

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
4. **Tales/Snaps on caravans** too, or tours-only? (page 45 shows the tabs on a caravan.)
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
