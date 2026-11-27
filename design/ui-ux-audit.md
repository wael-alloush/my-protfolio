# UI/UX Design Audit — waelaloush.com (2026-11-28)

**Modality:** Source-code structural inspection of the Next.js app (tokens, sections, components). Not a pixel-by-pixel screenshot lab. Skills applied: `ui-visual-balance`, `frontend-design`.

**Constraints honored in the plan:** keep brand hexes, content, project names, URLs, SEO, app logic; no full rebuild; no section deletion.

---

## 1. Brand palette (as shipped)

| Token | Hex / formula | Role today |
|---|---|---|
| `--brand-primary` | `#0d3b34` | Brand green (identity) |
| `--brand-secondary` | `#2f6b5c` | Mid green (borders, glow, mesh) |
| `--brand-accent` | `#e3b341` | Gold focal |
| `--brand-cream` | `#f7f6f2` | Primary text / light |
| `--brand-sand` | `#ede6d6` | Project thumb backgrounds |
| `--brand-dark` | `#1a1d1f` | Text on gold buttons |
| Derived | `--brand-bg`, `--brand-surface`, `--brand-card`, `--brand-muted`, `--brand-border`, accent light/deep | Canvas / panels / chrome |

**Font:** Tajawal (Arabic + Latin) via `next/font`. Distinctive for KSA market — keep; do not swap to Inter/system.

**Direction already present:** dark “studio” editorial, gold scarce actions, green depth — refine, do not reinvent.

---

## 2. 60 / 30 / 10 assessment

| Role | Target | Current feel | Verdict |
|---|---|---|---|
| **60% Dominant** | `--brand-bg` canvas | Strong dark green-ink base | Pass (keep as canvas) |
| **30% Secondary** | surface / card / header / footer | Cards + `surface-border` + footer surface | Mostly pass; cards sometimes over-compete with canvas |
| **10% Accent** | gold CTAs only | Accent on: primary buttons, nav active, hero word, feature icons, process badge, portfolio badge, process numbers gradient, FinalCta asterisk, blog pills, category labels, many hovers | **Fail — accent overuse** |

Accent scarcity is the #1 visual-balance issue: gold stops being a focal signal when icons, badges, headings fragments, and links all shout gold.

---

## 3. WCAG AA (approximate computed pairs)

Against derived `--brand-bg` ≈ `#0d1314`:

| Pair | Contrast | Body AA (4.5:1) |
|---|---|---|
| cream / bg | ~17.3 | Pass |
| muted / bg | ~8.3 | Pass |
| accent / bg | ~9.6 | Pass (large/UI OK; avoid long body in gold) |
| dark / accent (button text) | ~8.7 | Pass |
| cream / card | ~14.9 | Pass |
| secondary / bg | ~3.0 | **Fail as body text** (OK as decorative border/glow only) |

**Watch:** `text-brand-cream/70`–`/78` on long blog body is still likely AA on this bg, but stacking opacity + muted + gold links increases fatigue. Prefer a single body token (e.g. cream ~82–88% or a dedicated `--text-body`) instead of many ad-hoc opacities.

**Header CTA:** `h-8` / `text-xs` on small phones — height under 44px touch guideline (visual + UX).

---

## 4. Findings by area (priority)

### P0 — Hierarchy & accent discipline

1. **Accent inflation** across Hero accent word, SVG icons (`fill-brand-accent`), Process title pill, Portfolio badge, FinalCta asterisk, blog category chips, nav active, link hovers.  
   → Reserve gold for: primary CTA, one active nav state, at most one badge per viewport.

2. **Hero focal point split:** two stacked H1 lines + dual CTAs of similar visual weight (primary gold + secondary bordered). Primary action for revenue is WhatsApp (in header), while hero primary goes to portfolio — OK content-wise, but both hero buttons feel equal.  
   → Keep destinations; demote secondary (ghost/outline lighter) so portfolio or services is clearly secondary.

3. **Repeated `glow-orb` / mesh** on Hero, Features, PageHero, blog, FinalCta — atmospheric but stacking orbs reduces calm and burns “studio” into noise.  
   → One atmospheric treatment per major band; quieter elsewhere.

### P1 — Spacing, density, tokens

4. **Spacing scale is fragmented:** many one-off values (`h-21.75`, `pt-25.25`, `lg:pe-15`, `min-h-117`, `px-4.25`, `h-7.75`). Tokens exist for radius/shadow/section but not a clear 4/8px space ladder or type steps beyond display/title/body.

5. **Feature cards:** large min-heights + heavy padding + three equal gold icons → three competing centers. Featured column taller on desktop is good; still too much chrome. Soften icons to secondary/cream; reduce vertical padding; unify card radius with token only.

6. **Process numbers:** huge gradient digits + gold section chip — visually loud next to body. Soften chip to surface+border; keep number as muted brand-primary wash (already gradient) without extra gold pill competition.

7. **Portfolio showcase:** strong section (good proof). Badge in solid gold is fine as the *one* accent in that block if icons elsewhere are demoted. Thumb gaps `me-1.25` feel tight vs generous section padding — slight rhythm mismatch.

### P1 — Components consistency

8. **Buttons:** solid system (`primary|secondary|ghost|outline`) — good. Header overrides with `h-8! px-2.5! text-xs!` break the size scale and touch target.  
   → Add `size="xs"` tokenized or keep `sm` with min 40–44px height.

9. **Cards:** `Card` = `surface-border` + shadow; Features use `surface-border` without shared `Card`; services detail uses `Card`. Blog featured uses `surface-border`. Unify interactive vs static variants (border/shadow/hover once).

10. **Radius soup:** `rounded-[7px]` badges vs `rounded-pill` vs `rounded-brand-*`. Map badges to `radius-brand-sm` or pill only.

### P2 — Typography

11. Type sizes are many ad-hoc rem values instead of a documented scale (`text-display`, `text-title`, plus dozens of one-offs).  
    → Extend tokens: `--text-h2`, `--text-h3`, `--text-lead`, `--text-meta` and map sections.

12. **Weights:** extralight (200) + extrabold (800) contrast is distinctive (keep for brand), but body sometimes `font-light` at 0.9375rem — slightly thin on dark. Prefer 400 for long body, 300 for short leads.

13. Blog reading column (~42rem) is good measure; keep. Listing featured block is professional — leave structure; only tune accent/spacing in audit pass.

### P2 — Motion / interaction

14. Hover: lift on cards (`-translate-y-1`), gap expand on links, brightness on primary — good, slightly uneven. Standardize: primary = brightness/translate; secondary = border+text; cards = optional 1px lift OR border brighten, not both heavy.

15. Focus: global `:focus-visible` accent outline — good. Ensure hamburger and icon-only controls keep visible focus (they inherit — verify mobile drawer).

16. Marquee + Framer reveals: keep; respect `prefers-reduced-motion` (already partially handled).

### P2 — Mobile / tablet

17. Header pill crowded: logo + tiny CTA + menu. CTA under 44px. Logo truncate OK.  
18. Feature grid stacks fine; Process 2-col from `30rem` — numbers may still dominate.  
19. Portfolio thumbs small on mobile (`h-30 w-40`) — readable enough; optional slight increase later.

### P3 — Polish (after P0–P1)

20. Footer social circles OK; ensure accent only on hover.  
21. Admin UI out of scope for public brand polish unless requested.  
22. Sand thumbs vs dark UI: intentional product contrast — keep.

---

## 5. Improvement plan (phased — no content/SEO/URL changes)

### Phase 1 — Tokens & accent law (foundation)

**Files:** `app/globals.css` (+ light usage updates)

- Document semantic roles in comments: canvas / surface / accent / text / text-muted.
- Add spacing tokens: `--space-1`…`--space-8` (4px base) and `--space-section` already exists.
- Add type step tokens: h2, h3, lead, meta.
- Optionally `--text-body-soft` for long reading (single opacity, not scattered `/70`).
- **Do not change** the six brand hexes.
- Soften derived `--brand-muted` only if needed for consistency (keep AA).

### Phase 2 — Accent scarcity & CTAs

**Files:** `Button.tsx`, `Header.tsx`, `Hero.tsx`, `Features.tsx`, `Process.tsx`, `PortfolioShowcase.tsx`, `FinalCta.tsx`, blog chips if needed

- Icons → `fill-brand-secondary` or cream/secondary, not accent.
- Process / portfolio badges: one gold max per section; prefer surface+border+cream text for secondary labels.
- Hero secondary button → `ghost` or quieter `outline`.
- Header CTA: min height ≥40px (prefer 44); remove arbitrary `!` overrides where possible.
- FinalCta asterisk: keep as single ornamental accent OR demote to secondary — pick one ornament language sitewide.

### Phase 3 — Section rhythm & cards

**Files:** Features, Process, PortfolioShowcase, Card, services list cards, blog list chrome only

- Normalize vertical section padding to `section-space` / half-steps.
- Reduce feature card min-heights and asymmetric padding extremes.
- Unify card hover to one pattern via `Card` or shared class.
- Replace `rounded-[7px]` with token radii.
- Tone down duplicate glow-orbs (Features / overlapping PageHero).

### Phase 4 — Type mapping (no copy edits)

**Files:** section headings only (class swaps)

- Map H1/H2/H3/body/meta to new tokens without changing strings.
- Blog article styles: keep recent readability; align H2 border treatment with site tokens.

### Phase 5 — Verify

- Spot-check `/`, `/services`, `/portfolio`, `/blog`, one post at 390 / 768 / 1280.
- Contrast re-check muted/body.
- No slug/meta/content regressions; `npm run build`.

---

## 6. Explicit non-goals

- New brand colors or new font family  
- Rewriting Arabic copy or project names  
- Removing Marquee / Process / Portfolio / Blog sections  
- Admin redesign  
- Inventing light mode  

---

## 7. Implementation status (2026-11-28)

Shipped Phases **1–3** (+ light type token usage):

- Tokens: space ladder, h2/h3/lead/meta, `--brand-text-soft`, `badge-accent` / `badge-quiet`
- Accent scarcity: icons → secondary; process badge quiet; stats cream; softer hovers; header CTA ≥44px
- Rhythm: Features/Process/FinalCta/PageHero/About/blog chrome tightened; Card hover unified

Deferred: full type remap of every section, OG image, admin UI.
