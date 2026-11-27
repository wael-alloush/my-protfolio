# SEO Roast Roadmap: waelaloush.com (2026-11-28)

Verdict: Google can crawl you. Your money pages still do not own clear Saudi buying intents, and blog traffic has almost no path into WhatsApp.

Stack verified from repo: Next.js 16.4.6 App Router, React 19, Tailwind 4.3.5, MySQL CMS (`lib/content.ts`), Arabic RTL (`lang="ar"` `dir="rtl"`). Live checks against https://waelaloush.com on 2026-11-28.

No invented search volumes, rankings, or backlink counts. No Ahrefs/GSC export was available.

## What already passes

| Check | Result |
|---|---|
| robots.txt | Default-allow; blocks `/api/` and `/admin`; sitemap line present |
| Soft 404 | Unknown path returns HTTP 404 |
| Sitemap | Static hubs + services + published projects + posts |
| Admin | `robots: noindex` in admin layout |
| Canonicals on real pages | Present and self-referencing |
| Open Graph / Twitter | Present on sampled pages |
| Schema | Person + Organization/LocalBusiness + WebSite globally; Service / CreativeWork / BlogPosting + Breadcrumb on detail pages |
| Locale sprawl | Single Arabic site (no thin locale tree) |
| AI agent surfaces | `/llms.txt`, `/index.md`, MCP card aligned with live published projects |

## Money pages (conversion = WhatsApp / طلب تصميم)

1. `/` — brand + demand capture  
2. `/services/corporate-websites` — primary service (عيادات / شركات)  
3. `/services/landing-pages` — campaigns  
4. `/services/website-redesign` — retrofit  
5. `/portfolio` + project pages — proof  
6. `/contact` — explicit contact (nav CTA already goes straight to WhatsApp)

---

## Roadmap (revenue order)

| # | Tier | Issue | Revenue impact | Proposed fix | Files | Owner | Status |
|---|---|---|---|---|---|---|---|
| 1 | REVENUE | `/portfolio` has **no H1**; title is thin «أعمالي» | Proof page cannot own «أعمالي / نماذج مواقع» intents; Google sees filter UI + project H2s only | Add `PageHero` (or equivalent) with H1 from `portfolioPage.title` + subtitle; strengthen meta title toward «نماذج مواقع صمّمتها» without stuffing | `app/(site)/portfolio/page.tsx`, `content/ar.ts` | agent | shipped |
| 2 | REVENUE | Blog posts end with «العودة للمدونة» only — **no WhatsApp / service CTA** | Organic readers never hit the conversion path | Add a short end-of-article CTA block (WhatsApp + one relevant service link). Prefer one shared component used by `blog/[slug]` | `app/(site)/blog/[slug]/page.tsx`, `components/blog/PostCta.tsx` | agent | shipped |
| 3 | REVENUE | Homepage H1 is benefit-only («أصمّم مواقع تسهّل الحجز…») while title carries the buying keywords | Ranking and snippet alignment split between title and H1 | Keep brand voice; weave «تصميم مواقع» into H1 naturally | `content/ar.ts` | agent | shipped |
| 4 | REVENUE | Hub titles thin: «الخدمات», «المدونة», «تواصل» | Category hubs lose click-through and topical clarity vs competitors | Rewrite titles/descriptions to match H1 intent | `app/(site)/services/page.tsx`, `blog/page.tsx`, `contact/page.tsx` | agent | shipped |
| 5 | REVENUE | Homepage feature cards under-link the **corporate/clinic** money page | `/services/corporate-websites` lacks homepage contextual link | Add `href` + `linkLabel` on first feature card | `content/ar.ts` | agent | shipped |
| 6 | REVENUE | Meta description still promises «استشارة مجانية» while on-page pitch is WhatsApp + fair pricing | Trust mismatch in SERP snippet vs page | Align `siteDefaults.description` with real offer | `lib/site.ts` | agent | shipped |
| 7 | REVENUE | Keyword cannibalization clusters (see matrix below) | Multiple URLs compete for the same buying query | Internal links from blogs to winning service URLs; no slug changes | `content/blog/*.mdx` | agent | shipped |
| 8 | REVENUE | Dental post title stuffing | Looks spammy; hurts CTR and trust | Shorten title in production CMS admin | production `wa_posts` | founder | needs CMS edit on live |
| 9 | REVENUE | Portfolio subtitle still implies «مكتب محاماة» while live set is clinic / restaurant / Jewel | Copy promises missing proof | Update subtitle to match published projects | `content/ar.ts` | agent | shipped |
| 10 | COMPOUNDING | Blog → money links incomplete | Ranking posts do not reinforce service pages | Contextual links in MDX | `content/blog/*.mdx` | agent | shipped |
| 11 | COMPOUNDING | `articleJsonLd` publisher points at Person `#person` | Weaker article entity graph | Point publisher to `#business` | `lib/seo.ts` | agent | shipped |
| 12 | COMPOUNDING | OG image is square logo 1024×1024 | Weak social/AI preview for shares | Add 1200×630 brand/share image | `public/brand/…`, `lib/seo.ts` | agent | deferred |
| 13 | COMPOUNDING | No public price table (by design) | AI answers may prefer competitors who show ranges | Keep WhatsApp quoting | — | founder | next |
| 14 | COMPOUNDING | Backlink / DR gap unknown | Cannot tell if links are the bottleneck | Pull GSC + clean RD export later | — | founder | next |
| 15 | TECHNICAL | `not-found` inherits root `canonical: /` | Ugly metadata on 404 HTML | Remove root canonical default; unique 404 description | `app/layout.tsx`, `app/not-found.tsx` | agent | shipped |
| 16 | TECHNICAL | Logo oversized srcset; 7 Tajawal weights | Extra bytes before LCP | Tighter `sizes`; drop unused weight 900 | `components/ui/Logo.tsx`, `app/layout.tsx` | agent | shipped |

## Keyword intent matrix (cannibalization)

| Intent (Arabic) | Should win | Supporting only | Conflict today |
|---|---|---|---|
| مصمم مواقع / تصميم مواقع في السعودية | `/` | `/about`, blog «كيف تختار مصمم» | Home H1 weak vs title; about H1 «مهندس حاسب ومصمم مواقع» overlaps |
| تصميم مواقع للشركات | `/services/corporate-websites` | blog `company-website-design-saudi`, `essential-company-website-elements` | Blog titles compete head-on with service |
| تصميم صفحات هبوط | `/services/landing-pages` | blog `landing-page-for-ad-campaigns` | Titles overlap; OK if blog links hard to service (partially does) |
| إعادة تصميم موقع | `/services/website-redesign` | blog mentions | Mild |
| تكلفة تصميم موقع | blog `website-design-cost` | — | Clean ownership |
| تصميم موقع عيادة (رياض) | blog `dental-clinic-website-riyadh` **or** corporate service — pick one primary | other | Title stuffed; home also claims clinics |

Rule for fixes: service pages = transactional; blog = educational with outbound to the service + WhatsApp. Home = brand + clinic/KSA positioning + links into the three services.

## On-page snapshot (live)

| URL | Title quality | H1 | Notes |
|---|---|---|---|
| `/` | Strong commercial | Benefit-line, weak keyword | Description mentions free consult |
| `/services` | Thin «الخدمات» | Strong clinic H1 | Fix title to match H1 |
| `/services/corporate-websites` | Good | Good | Primary money URL |
| `/services/landing-pages` | Good | Good | |
| `/services/website-redesign` | OK | OK | |
| `/portfolio` | Thin «أعمالي» | **Missing** | Highest structural gap |
| `/portfolio/*` | Client names | Client names | Proof; OG uses project image (good) |
| `/blog` | Thin «المدونة» | Split visual H1 | |
| `/blog/dental-clinic-…` | Stuffed | Stuffed | Clean up |
| `/about` | OK | Role line | |
| `/contact` | Thin | Thin | WhatsApp primary elsewhere — OK |
| `/portfolio/majed-alsaqebi` | 404 / noindex | — | Not in live sitemap; still in local `content/projects.ts` fallback |

## Blog quality / Saudi fit

- Language and RTL: solid; local cities (رياض/جدة/دمام) appear on home and schema `areaServed`.
- Cost article correctly avoids fake price guarantees — keep that discipline.
- Company / landing / elements posts are useful; need clearer supporting role vs services.
- `choosing-professional-web-designer` never routes to your services or portfolio — highest missed conversion on content.
- Clinic focus matches your positioning; Kuwait clinic case is real proof — keep; do not pretend every case is Riyadh.

## Core Web Vitals (code perspective only — no field CrUX invented)

- Good: `display: "optional"` + `adjustFontFallback` reduces late font CLS; hero is text-first (no huge LCP image).
- Risk: many Tajawal weights; oversized logo srcset; Framer Motion on hero/reveal (main-thread, not crawl-blocking).
- Tracking: GTM present live — keep tags from blocking LCP (load afterInteractive as now).

## Fluff (ignore until rows 1–9 ship)

- Meta length fine-tuning character counts
- Logo `alt=""` (parent link has accessible name)
- `hreflang` ar-SA without `x-default` (single-locale site)
- `sameAs` includes `wa.me` (not a profile URL)
- Duplicate carousel images with empty alt on aria-hidden clones
- Keywords meta array in root layout (low value)

---

## Proposed implementation phases (after your approval)

### Phase A — structure & conversion (ship first)

1. Portfolio H1 + meta  
2. Blog article CTA → WhatsApp + service  
3. Homepage feature link to corporate service  
4. Align home meta description with real offer  
5. Fix 404 metadata  

Verify: `npm run build`; curl portfolio H1; curl a blog post for CTA; curl unknown path still 404.

### Phase B — intent ownership (no URL changes)

1. Strengthen home H1 carefully  
2. Hub title/description upgrades  
3. Dental title cleanup  
4. Portfolio subtitle vs live projects  
5. Cannibalization: adjust blog intros/CTAs to point at winning service URLs  

Verify: compare titles/H1s; sitemap unchanged; no slug edits.

### Phase C — compounding

1. Internal links in remaining MDX  
2. Schema publisher fix  
3. OG 1200×630 asset  
4. Logo/font weight trim  

Verify: build + sample OG tags + JSON-LD.

---

## Explicit non-actions (per your constraints)

- No page/post deletion  
- No slug/canonical changes without a proven dead URL needing 308  
- No keyword stuffing  
- No invented metrics  
- No design system rewrite  
- No fake pricing numbers  

**Waiting for your approval of Phase A (and optionally B/C) before editing code.**
