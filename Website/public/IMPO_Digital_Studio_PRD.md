# Product Requirements Document
## IMPO Digital Studio — Premium Photography & Cinematography Website

**Document Owner:** Product Management
**Client:** IMPO Digital Studio, HD Kote, Mysore District, Karnataka, India
**Document Type:** Enterprise Product Requirements Document (PRD)
**Version:** 1.0
**Status:** Ready for Design & Development Handoff

---

## 1. Executive Summary

IMPO Digital Studio is a photography and cinematography business operating out of HD Kote, Mysore District, Karnataka, serving wedding couples, families, event organizers, corporate clients, and small businesses across the region. The studio currently lacks a digital presence that reflects the quality of its creative output. Prospective clients evaluating photography studios today judge credibility primarily through a studio's website and portfolio presentation before ever picking up the phone or opening WhatsApp — and in a market where most local competitors run brochure-style, template-driven sites, a well-executed premium website is a direct differentiator rather than a "nice to have."

This PRD defines the complete product requirements for a five-page, portfolio-first website built on Next.js, styled with Tailwind CSS, and animated with Framer Motion, deployed on Vercel. The product is deliberately not a brochure site. It is a cinematic digital brand experience designed to communicate the same values a client would associate with Apple or Leica: restraint, craftsmanship, and confidence in the work itself. The homepage functions as a curated cinematic reel, the portfolio functions as an immersive, filterable gallery, and every page funnels toward two low-friction conversion actions — WhatsApp message and phone call — with Google Maps providing a physical trust anchor.

The document below specifies business goals, target personas, journey maps, functional and non-functional requirements, full information architecture, page-level specifications, design system (typography, color, motion), technical architecture, SEO and local SEO strategy, QA and testing strategy, deployment checklist, and future roadmap. It is written to be handed directly to a UI/UX designer, a Next.js developer, a QA engineer, and an SEO specialist without requiring further clarification on scope, intent, or acceptance criteria.

The website excludes a pricing page, a booking/scheduling system, and an FAQ page by explicit client decision — inquiries are intentionally routed through direct human conversation (WhatsApp/phone) rather than self-service forms, which is consistent with how premium creative studios protect the perceived value of custom, quoted work.

### Scope at a Glance

| Dimension | Decision |
|---|---|
| Pages | 5 (Home, Portfolio, Services, About, Contact) |
| Portfolio structure | Single unified gallery, 5 filterable categories |
| Conversion channels | WhatsApp, phone, Google Maps — no contact form |
| Content management | Static at launch; CMS migration planned as Phase 2 |
| Stack | Next.js, Tailwind CSS, Framer Motion, Vercel, Next.js Image, Lucide |
| Explicitly excluded | Pricing page, booking system, FAQ page |

This table is intended as a quick-reference anchor for any stakeholder joining the project after this document's initial review, and should not be treated as a substitute for the detailed requirements in the sections that follow.

---

## 2. Product Vision

The vision for the IMPO Digital Studio website is to become the studio's single most persuasive sales asset — a digital space that does in ninety seconds of scrolling what a physical studio tour would do in twenty minutes: prove, through pacing, imagery, and restraint, that this studio produces work worth paying a premium for.

Where most local photography websites default to grid-of-thumbnails brochure layouts, this product treats the browsing experience itself as part of the brand's creative output. Scroll-triggered reveals, full-bleed cinematic imagery, and deliberate typographic hierarchy are not decoration — they are proof of craft, functioning the same way a well-shot showreel functions for a cinematographer. The long-term vision is for the website to be referenced by the studio in client pitches, submitted to design showcases (Awwwards-style galleries), and used as a template for how IMPO Digital Studio's brand should look across future sub-brands or service expansions.

---

## 3. Business Goals

1. **Establish premium market positioning.** Visually and experientially separate IMPO Digital Studio from template-based competitor websites in HD Kote and the wider Mysore district.
2. **Increase qualified inbound inquiries.** Grow WhatsApp and phone inquiry volume from prospective clients who have already self-qualified by viewing relevant portfolio work.
3. **Build durable trust signals.** Give first-time visitors — particularly wedding couples making a high-stakes, high-emotion purchase decision — enough evidence of craft and professionalism to feel comfortable initiating contact.
4. **Strengthen discoverability.** Improve organic visibility for local search terms tied to wedding photography, cinematography, and event photography in and around HD Kote and Mysore district.
5. **Create a reusable premium brand asset.** Produce a site whose visual language (typography, color, motion) can extend to future marketing collateral — Instagram content, printed portfolios, proposals — without redesign.

These goals are not equally weighted. Increasing qualified inquiries is the primary commercial goal; the remaining four goals are the mechanisms by which that primary goal is achieved.

---

## 4. Success Metrics

| Metric | Definition | Target (First 90 Days Post-Launch) |
|---|---|---|
| WhatsApp inquiry clicks | Clicks on any WhatsApp CTA (floating button, contact page, footer) | Baseline + 40% vs. pre-launch inquiry volume |
| Phone tap-to-call clicks | Clicks on tel: links across the site | Tracked as secondary conversion channel |
| Average session duration | Time spent per session (GA4) | 2 minutes 30 seconds or higher |
| Portfolio engagement rate | % of sessions that interact with category filters or open 3+ portfolio items | 55% or higher |
| Bounce rate | Sessions with no further interaction after landing | Below 40% |
| Core Web Vitals pass rate | % of page loads meeting "Good" thresholds for LCP, INP, CLS | 90% or higher (mobile) |
| Organic local search impressions | Google Search Console impressions for local/service queries | Month-over-month growth |
| Google Maps profile clicks | Clicks on embedded map / "Get Directions" | Tracked from launch, no fixed target in first 90 days |

Success is not defined by vanity traffic metrics. A smaller number of highly engaged, portfolio-browsing sessions that convert into WhatsApp inquiries is a better outcome than high traffic with low engagement.

These metrics should be reviewed together rather than in isolation. For example, a rise in WhatsApp inquiry clicks accompanied by a falling average session duration would suggest visitors are converting impulsively without engaging deeply with the portfolio — potentially indicating strong existing brand trust (e.g., from a referral) rather than trust built by the website itself, which is a useful distinction for the studio to understand when evaluating which marketing channels are actually being reinforced by the new site. Conversely, high portfolio engagement with low conversion would suggest the evidence is compelling but the conversion path itself has friction worth investigating — a signal to revisit CTA placement and copy (Sections 19 and 23) before assuming the product's core premise needs to change.

---

## 5. Problem Statement

Prospective clients — especially wedding couples, who represent the highest-value service line — currently have no way to evaluate IMPO Digital Studio's work quality, style consistency, or professionalism before making contact. Word-of-mouth and Instagram are the only existing discovery channels, both of which lack structured portfolio browsing, service clarity, or a credible "About" narrative that builds trust in the humans behind the camera. Local competitors, even where they have websites, tend to rely on generic templates that fail to differentiate one studio from another, meaning studios compete primarily on price rather than perceived craft — a dynamic that suppresses the premium positioning IMPO Digital Studio wants to occupy.

Without a dedicated, well-structured digital presence, the studio loses inquiries to competitors who simply show up first or look more "professional" at a surface level, regardless of actual work quality.

---

## 6. Solution Overview

A five-page Next.js website — Home, Portfolio, Services, About, Contact — engineered around three pillars:

1. **Cinematic storytelling as navigation.** The homepage is structured as a guided narrative (hero → featured work → services teaser → philosophy → call to action) rather than a flat list of links, using scroll-based motion to control pacing the way a film editor controls a cut.
2. **Portfolio as the product core.** A single unified portfolio page with category filtering (Wedding, Corporate, Products, Family, Events) replaces the more common pattern of siloed sub-pages, allowing visitors to browse fluidly across categories without repeated page loads.
3. **Frictionless, human-first conversion.** No forms, no pricing calculators, no booking widgets. Every conversion path terminates in a direct WhatsApp message or phone call, preserving the studio's ability to have a real, personalized sales conversation rather than losing control of the negotiation to a static price list.

This structure directly answers the problem statement: it gives visitors the evidence they need (portfolio, philosophy, credibility) while directing all resulting intent into a channel the studio already uses and controls.

---

## 7. Stakeholders

| Stakeholder | Role | Primary Interest |
|---|---|---|
| IMPO Digital Studio (Owner/Founder) | Client / Business Owner | Brand perception, inquiry volume, final visual approval |
| Studio Photographers/Cinematographers | Content Contributors | Accurate representation of their work, correct crediting where applicable |
| Product Manager | This document's author | Scope clarity, requirement traceability, stakeholder alignment |
| UI/UX Designer | Design execution | Visual system, layout fidelity to brand personality |
| Frontend Developer(s) | Build execution | Next.js/Tailwind/Framer Motion implementation, performance |
| QA Engineer | Quality assurance | Cross-device, cross-browser correctness; acceptance criteria sign-off |
| SEO Specialist | Discoverability | On-page SEO, local SEO, technical SEO health |
| End Users (Site Visitors) | Consumers of the product | Fast, beautiful, trustworthy browsing experience leading to easy contact |

---

## 8. User Personas

### Persona 1 — "The Planning Bride" (Primary Persona)
Age 24–32, planning her wedding 6–12 months in advance, browsing photography studios on mobile late at night after work. She is emotionally invested in every visual decision of her wedding and treats the photographer's portfolio as a proxy for how her own wedding photos will look. She compares 4–6 studios before shortlisting 2. She values cinematic pre-wedding shoots and looks specifically for how couples are directed and lit, not just raw photo quality. She will message on WhatsApp rather than call, and expects a fast, warm reply.

### Persona 2 — "The Corporate Coordinator"
Age 28–45, working for a mid-size local business or corporate office, tasked with finding a photographer for a product launch, corporate event, or internal function. She has limited time, evaluates studios quickly based on the professionalism of prior corporate work shown, and prefers a phone call to finalize logistics once she's shortlisted a studio from the website alone.

### Persona 3 — "The New Parent"
Age 26–38, seeking maternity or baby photography. Highly emotionally sensitive category; she looks for warmth, patience, and gentleness signaled through the studio's imagery and About page tone, not just technical skill. Browses primarily on mobile, often shares the site with a partner or family member before contacting the studio.

### Persona 4 — "The Local Small Business Owner"
Age 30–50, needs product photography for a shop, restaurant, or small brand, usually price-conscious but still wants results that look "professional" for Instagram and Google Business listings. Least likely to browse the full portfolio in depth; scans Services and Portfolio quickly, then calls directly.

### Persona Summary Table

| Persona | Primary Goal | Primary Frustration Today | Preferred Contact Channel | Key Portfolio Category Viewed |
|---|---|---|---|---|
| The Planning Bride | Confirm the studio's style matches her wedding vision before contacting | Cannot judge quality/consistency from Instagram alone | WhatsApp | Wedding |
| The Corporate Coordinator | Confirm professionalism quickly for a time-sensitive booking | Generic competitor sites don't demonstrate corporate-specific experience | Phone | Corporate |
| The New Parent | Feel emotionally reassured about the studio's warmth and gentleness | Anxiety about an unfamiliar photographer around a newborn or during pregnancy | WhatsApp | Family |
| The Local Small Business Owner | Get professional product images quickly and affordably | Uncertainty about cost without a visible price list | Phone | Products |

This table exists to give the design and development teams a single reference point when making judgment calls not explicitly covered elsewhere in this document — for example, when deciding which featured-work images to prioritize on the Homepage, the Planning Bride and New Parent personas (both WhatsApp-first, both emotionally driven) should weigh more heavily than the Local Small Business Owner persona, since they represent the higher-value, higher-volume service lines (wedding-adjacent services).

---

## 9. User Journey Maps

### Journey: The Planning Bride
1. **Discovery** — Finds IMPO Digital Studio via Instagram, Google search, or referral.
2. **Landing** — Arrives on Homepage; cinematic hero sets immediate tone expectation.
3. **Exploration** — Scrolls through featured work teaser, clicks through to full Portfolio.
4. **Filtering** — Filters portfolio to "Wedding," browses multiple projects, pays close attention to pre-wedding and couple direction shots.
5. **Validation** — Visits About page to understand who is behind the camera; reads philosophy/brand story for reassurance.
6. **Services Check** — Confirms Wedding Photography, Cinematography, and Pre-Wedding Shoots are explicitly offered.
7. **Conversion** — Taps floating WhatsApp button from Contact page or persistent header/footer CTA; sends an inquiry message.

### Journey: The Corporate Coordinator
1. **Discovery** — Referred by a colleague or found via local search "corporate event photographer HD Kote."
2. **Landing** — Lands directly on Services or Portfolio via search intent.
3. **Quick Scan** — Filters Portfolio to "Corporate," reviews 2–3 projects for professionalism and consistency.
4. **Conversion** — Calls directly via tap-to-call from Contact page, bypassing WhatsApp due to urgency.

### Journey: The New Parent
1. **Discovery** — Instagram referral or Google Maps listing.
2. **Landing** — Lands on Homepage, immediately drawn to warm, soft imagery in featured work.
3. **Emotional Validation** — Reads About page carefully; looks for tone of warmth and care.
4. **Portfolio Deep Dive** — Filters to Family, views maternity/baby-adjacent work under Family or Events category.
5. **Conversion** — Sends WhatsApp message, often after sharing the site link with a partner first.

### Journey: The Local Small Business Owner
1. **Discovery** — Encounters the studio through a referral from another local business owner, or via a Google search for "product photography near me."
2. **Landing** — Lands on the Homepage or directly on Services depending on entry point; scans quickly rather than lingering on cinematic pacing.
3. **Quick Evaluation** — Jumps to the Portfolio, filters directly to "Products," reviews image quality and lighting consistency in under a minute.
4. **Price Sensitivity Check** — Notices the absence of a pricing page; this persona is the most likely to feel friction here, which the Contact page's "response expectation copy" (Section 23) is specifically designed to offset by making the next step feel low-effort rather than like the start of a negotiation.
5. **Conversion** — Calls directly, often outside business hours via the tap-to-call link, expecting a callback rather than an instant reply.

Each journey above shares a common structural insight: every persona ends at the same two conversion mechanisms (WhatsApp or phone), but arrives via a different entry point and evaluates different portfolio evidence before converting. This is the core reason the product avoids persona-specific landing pages or a segmented navigation structure — the destination is universal even when the path is not, and a single well-organized Portfolio page serves every persona's evaluation needs without fragmenting the experience.

---

## 10. Customer Pain Points

- Uncertainty about actual photography/cinematography quality before committing to a consultation.
- Difficulty distinguishing this studio from visually generic competitor websites.
- Anxiety (particularly for wedding and maternity clients) about whether the studio's working style matches their emotional expectations.
- Friction in traditional booking flows (forms, calculators) that feel transactional for an inherently personal, premium purchase.
- Slow-loading, image-heavy competitor sites that frustrate mobile users, who represent the majority of this audience.
- Lack of clarity on what services are actually offered versus assumed from a generic "wedding photographer" label.
- Difficulty comparing multiple studios side by side when each studio's only presence is a scattered Instagram grid with no categorization, forcing the visitor to do the organizational work the studio itself should be providing.
- Reluctance to initiate contact without first feeling confident the studio is worth the time investment of a conversation, particularly for time-poor personas like the Corporate Coordinator and Local Small Business Owner.
- For wedding-adjacent personas specifically, a lack of visible evidence of directorial skill — how the studio guides real couples who are not professional models — which is often the actual differentiator between an amateur and a premium wedding photographer.

---

## 11. Value Proposition

IMPO Digital Studio's website proves, through direct visual evidence rather than marketing copy, that the studio operates at a premium tier of craft — cinematic, considered, and consistent — while making it effortless to start a real conversation with the studio through the channel the visitor already prefers (WhatsApp or phone). Where competitors ask visitors to trust a claim, this product lets visitors experience the brand's aesthetic standard directly through pacing, imagery, and typography before a single word of sales copy is read.

---

## 12. Competitive Positioning

Local competitors in the HD Kote and greater Mysore district photography market largely fall into two categories: (1) no meaningful web presence beyond an Instagram page, or (2) generic template-based websites (often WordPress or Wix defaults) with stock-style layouts, inconsistent image sizing, and no motion design. Neither category invests in the browsing experience itself as a signal of craft.

IMPO Digital Studio's website is positioned to compete not against other photography studio websites, but against the visual standard set by premium creative agency and luxury brand websites — the same standard a bride or corporate client subconsciously references when scrolling an Apple product page or a Leica campaign site. This is a deliberate category jump: the product does not attempt to out-feature competitors' websites; it attempts to make competitors' websites look categorically less premium by comparison.

This positioning has direct implications for scope decisions made elsewhere in this document. The exclusion of a pricing page (Section 16) is itself a competitive positioning choice — competitors who publish flat-rate price lists implicitly position themselves as a commodity service being compared on cost, whereas withholding pricing in favor of a direct conversation preserves the studio's ability to be evaluated on craft first. Similarly, the deliberate absence of a booking calendar (a feature some competitors may add to appear "modern" or "efficient") is a positioning decision: efficiency is not the value being sold here — trust and craft are, and a booking calendar would send the wrong signal about what kind of purchase this is for the visitor.

Competitive differentiation is therefore achieved through three levers working together: (1) the browsing experience itself (motion, pacing, typography) as evidence of craft, (2) portfolio depth and organization that makes evaluation effortless rather than requiring the visitor to scroll an unstructured Instagram grid, and (3) a conversion path that mirrors how a premium service is actually sold — through conversation, not self-service.

---

## 13. Functional Requirements

- FR-1: The site shall present five distinct pages — Home, Portfolio, Services, About, Contact — accessible via a persistent global navigation.
- FR-2: The Portfolio page shall display all portfolio work in a single unified gallery with client-side category filtering across Wedding, Corporate, Products, Family, and Events.
- FR-3: Portfolio filtering shall update the visible gallery without a full page reload, using animated transitions between filtered states.
- FR-4: Each portfolio item shall be viewable in an expanded/lightbox view showing additional images from that specific shoot or project.
- FR-5: The site shall expose WhatsApp as a functional click-to-chat link (using the `wa.me` protocol) pre-filled with a default inquiry message, available from the header, footer, floating action button, and Contact page.
- FR-6: The site shall expose a functional tap-to-call link (`tel:`) on the Contact page and footer.
- FR-7: The site shall embed a functional Google Maps view on the Contact page showing the studio's HD Kote location, linking out to Google Maps for directions.
- FR-8: The Homepage shall feature a curated subset of portfolio work (a "featured work" section) with a clear path to the full Portfolio page.
- FR-9: The Services page shall list all nine defined services with descriptive copy and supporting imagery for each.
- FR-10: The About page shall present the studio's philosophy/brand story and relevant credibility content (experience, approach, or team framing) without requiring a dedicated team directory unless supplied by the client.
- FR-11: All interactive elements (buttons, filters, links, lightbox controls) shall be fully operable via touch, mouse, and keyboard.
- FR-12: The site shall not include a pricing page, booking/scheduling system, or FAQ page, per explicit scope exclusion.
- FR-13: All pages shall be fully responsive across mobile, tablet, and desktop breakpoints.
- FR-14: The site shall implement structured navigation (header + footer) present on all five pages with consistent behavior.
- FR-15: Images across the site shall load using Next.js Image optimization with responsive `srcset` behavior and lazy loading below the fold.
- FR-16: The Portfolio filter state shall be reflected in the URL (e.g., `?category=wedding`) so that a specific filtered view can be shared directly via link (for example, in an Instagram bio or a WhatsApp message) and land the visitor on the correctly filtered gallery on arrival.
- FR-17: The floating WhatsApp button shall remain visible and functional across scroll position changes on every page, and shall not overlap or obscure other interactive elements (e.g., the mobile navigation trigger) at any breakpoint.
- FR-18: The site shall support a pre-filled WhatsApp message that is contextually adjusted where feasible — for example, a default message referencing "wedding photography" if the visitor is on the Wedding-filtered Portfolio view versus a general inquiry message from the global floating button.
- FR-19: The Services page shall visually group services into life-event and commercial categories (per Section 21) rather than presenting all nine services in an undifferentiated flat list.
- FR-20: The lightbox component shall display a counter or position indicator (e.g., "3 of 12") when browsing multiple images within a single portfolio project, so visitors always understand how much content remains in that project.
- FR-21: All CTAs (WhatsApp, phone) shall be present and functional even if JavaScript-driven animations fail to load, since these are server-rendered anchor elements rather than purely client-side interactive components.
- FR-22: The site shall support a minimum of 300 individual portfolio images distributed across five categories without requiring pagination on first load; if performance testing indicates pagination or "load more" behavior is needed at that volume, this shall be implemented as infinite scroll rather than numbered pagination, to preserve the immersive browsing experience.

---

## 14. Non-Functional Requirements

- NFR-1 (Performance): Largest Contentful Paint (LCP) under 2.5 seconds on 4G mobile connections for all primary pages.
- NFR-2 (Performance): Cumulative Layout Shift (CLS) under 0.1 across all pages, including image-heavy Portfolio and Homepage.
- NFR-3 (Scalability): Portfolio content structure shall support at least 300 individual images across categories without requiring architectural changes.
- NFR-4 (Accessibility): The site shall meet WCAG 2.1 AA compliance for color contrast, focus states, and keyboard navigability, adapted sensibly for a dark, image-forward aesthetic.
- NFR-5 (Maintainability): Content (portfolio images, service descriptions, About copy) shall be structured so that the client or a non-developer can eventually update it via a lightweight content layer (e.g., structured JSON/Markdown or a headless CMS in a future phase).
- NFR-6 (SEO): All pages shall achieve a Google PageSpeed Insights mobile performance score of 85 or above at launch.
- NFR-7 (Security): The site shall enforce HTTPS across all routes and avoid exposing any client-identifiable data in source or network requests beyond what is necessary for Maps/WhatsApp integration.
- NFR-8 (Browser Compatibility): The site shall render correctly on the latest two major versions of Chrome, Safari, Firefox, and Edge, and on iOS Safari and Android Chrome for mobile.
- NFR-9 (Reliability): The production deployment on Vercel shall maintain 99.9% uptime, inherited from Vercel's platform SLA.

---

## 15. Product Scope

In scope for this release:
- Five fully designed and developed pages (Home, Portfolio, Services, About, Contact).
- Unified, filterable portfolio system across five categories.
- WhatsApp, phone, and Google Maps contact integrations.
- Full responsive design across mobile, tablet, desktop.
- Motion design system (scroll reveals, hover states, page transitions, portfolio filter transitions).
- On-page SEO implementation and local SEO foundation (schema markup, Google Business Profile alignment, meta structure).
- Deployment to Vercel with a custom domain.
- Analytics implementation (GA4 at minimum) with event tracking for WhatsApp/phone/map interactions.

---

## 16. Out of Scope

- Pricing page or any visible pricing information.
- Booking, scheduling, or calendar-based appointment system.
- FAQ page or accordion-based Q&A content.
- Client galleries, private client login areas, or delivery portals.
- E-commerce or print-sales functionality.
- Blog or long-form content publishing system (may be considered in a future roadmap phase).
- Multi-language support (English-only at launch unless specified otherwise).
- Native mobile application.
- CMS integration in the initial release (structured static content only, with CMS readiness noted as a non-functional requirement for future extensibility).

---

## 16b. Information Architecture

The information architecture is intentionally flat and linear, reflecting a five-page structure with no nested sub-navigation:

```
Home
├── Hero (Cinematic intro)
├── Featured Work (curated portfolio teaser)
├── Services Teaser
├── Studio Philosophy / Brand Statement
└── Call to Action (Contact)

Portfolio
├── Category Filter Bar (All, Wedding, Corporate, Products, Family, Events)
└── Unified Gallery Grid (filterable, lightbox-enabled)

Services
├── Wedding Photography
├── Wedding Cinematography
├── Pre-Wedding Shoots
├── Engagement Photography
├── Maternity Photography
├── Baby Photography
├── Birthday Photography
├── Corporate Event Photography
└── Product Photography

About
├── Studio Story / Philosophy
├── Approach / Process
└── Credibility Signals (experience, style statement)

Contact
├── WhatsApp CTA
├── Phone CTA
├── Google Maps Embed
└── Studio Address / Location Details
```

This flat structure minimizes cognitive load, which is important given that the primary audience (brides, parents) is emotionally engaged rather than analytically evaluating a feature matrix.

---

## 17. Complete Sitemap

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Primary landing page for all traffic sources |
| `/portfolio` | Portfolio | Unified gallery with query-param-based filtering, e.g. `/portfolio?category=wedding` |
| `/services` | Services | Static service listing page |
| `/about` | About | Studio story and philosophy |
| `/contact` | Contact | WhatsApp, phone, map |
| `/portfolio/[category]` (optional enhancement) | Category-specific deep link | Supports direct sharing of a specific category, e.g. for Instagram bio links |

The optional `/portfolio/[category]` dynamic route is recommended for SEO and shareability (e.g., a direct link to "Wedding" work for Instagram bio use) but can be implemented via query parameters in the initial release if timeline requires a leaner build.

---

## 18. Navigation Structure

**Header (persistent, all pages):**
- Logo (left-aligned, links to Home)
- Primary nav links: Home, Portfolio, Services, About, Contact (right-aligned or centered depending on final design direction)
- WhatsApp icon/button (persistent, visually distinct from nav links)
- Header transitions from transparent (over hero) to solid background on scroll, using a smooth opacity/background-color transition rather than an abrupt snap.

**Footer (persistent, all pages):**
- Studio name and short tagline
- Quick links (mirroring header nav)
- Contact block: WhatsApp link, phone number, address
- Social links (Instagram at minimum)
- Copyright line

**Mobile Navigation:**
- Hamburger menu triggering a full-screen overlay menu with large, staggered-animated nav links (consistent with the cinematic brand personality — this is a moment for motion design, not a plain slide-out drawer).
- Floating WhatsApp button persists across all pages, positioned bottom-right, remaining accessible even when the mobile menu is closed.

---

## 19. Homepage Requirements

The homepage is the single most important page in the product and must be treated as a guided sequence rather than a stack of independent sections.

**Section 1 — Hero:**
Full-viewport-height cinematic hero using either a high-impact still image or a short looping video/cinemagraph of studio work. Bold, large-scale typography overlays the hero with the studio name and a short brand statement (not a generic tagline like "Capturing Moments" — copy should reflect the premium, cinematic personality, e.g., framing the studio as a storyteller rather than a service provider). A subtle scroll indicator invites the user downward. Entrance animation on load: staggered fade/slide-up of headline text, followed by a slower reveal of the hero image/video, avoiding simultaneous "everything pops in at once" motion.

**Section 2 — Featured Work:**
A curated selection of 6–9 standout portfolio images/projects spanning multiple categories, displayed in an asymmetric, editorial-style grid (not a uniform square grid) to reinforce a designed, non-templated feel. Each item reveals on scroll using a fade-and-rise animation triggered at roughly 20% viewport visibility. A clear "View Full Portfolio" CTA follows this section.

**Section 3 — Services Teaser:**
A condensed, visually-led overview of service categories (not full descriptions — that is the Services page's job), styled as a horizontal or interactive list that reinforces breadth of offering without overwhelming the homepage.

**Section 4 — Studio Philosophy / Brand Statement:**
A short, confident paragraph (60–120 words) articulating the studio's creative philosophy, paired with a supporting image of the studio at work (candid, not posed). This section exists purely to build emotional trust before the conversion ask.

**Section 5 — Call to Action:**
A dedicated, full-width closing section with a strong final headline (e.g., inviting the visitor to start their story) and prominent WhatsApp and phone CTAs, mirroring the Contact page's conversion actions without requiring navigation away from intent.

---

## 20. Portfolio Requirements

The Portfolio page is the functional core of the product and must support fluid, low-friction browsing.

- **Layout:** Masonry or editorial grid layout accommodating mixed image aspect ratios (portrait wedding shots, landscape corporate/event shots, square product shots) without forcing uniform cropping that would compromise image integrity.
- **Filter Bar:** Sticky filter bar (All, Wedding, Corporate, Products, Family, Events) positioned below the header, remaining accessible while scrolling through the gallery. Active filter state is visually distinct (underline, weight change, or color shift — not a jarring background box that breaks the minimal aesthetic).
- **Filtering Behavior:** Filtering shall animate out non-matching items and animate in matching items using a coordinated exit/enter transition (e.g., via Framer Motion's `AnimatePresence` and layout animations) rather than an abrupt re-render.
- **Lightbox/Expanded View:** Clicking any portfolio item opens an expanded view showing that project's full image set with next/previous navigation, a close control, and (where relevant) a short caption identifying the type of shoot.
- **Loading Strategy:** Initial viewport loads immediately; subsequent rows load via intersection-observer-triggered lazy loading to avoid unnecessary bandwidth use, particularly important given the mobile-heavy audience.
- **Empty/Edge States:** If a category temporarily has fewer than 3 items, the layout must still look intentional (not sparse or broken) — achieved through the grid system gracefully reflowing rather than leaving obvious empty gaps.

---

## 21. Services Page Requirements

Each of the nine services (Wedding Photography, Wedding Cinematography, Pre-Wedding Shoots, Engagement Photography, Maternity Photography, Baby Photography, Birthday Photography, Corporate Event Photography, Product Photography) shall be presented with:
- A representative supporting image or short looping clip.
- A concise descriptive paragraph (40–80 words) explaining what the service includes and the creative approach the studio takes to it — written distinctly per service, not templated boilerplate with the service name swapped in.
- A subtle visual link back to relevant Portfolio category filter (e.g., clicking "Wedding Photography" scrolls to or links to the Wedding-filtered Portfolio view), reinforcing the connection between claim (Services) and evidence (Portfolio).

Services shall be grouped logically rather than listed in arbitrary order — for example, life-event services (Wedding, Pre-Wedding, Engagement, Maternity, Baby, Birthday) grouped together, followed by commercial services (Corporate Event, Product Photography), reflecting the natural mental model of the target personas.

---

## 22. About Page Requirements

- **Studio Story:** A narrative section (150–300 words) covering the studio's origin, creative philosophy, and what differentiates its approach — written in first-person or studio-voice, not third-person corporate copy.
- **Approach/Process:** A short explanation of how the studio works with clients (e.g., consultation style, shoot-day approach, delivery philosophy) framed to reduce anxiety for emotionally invested personas like the Planning Bride and New Parent.
- **Supporting Imagery:** Behind-the-scenes or candid studio/team imagery (not stock photography) to humanize the brand.
- **Credibility Signals:** Years of experience, number of projects/couples served, or similarly authentic proof points, provided by the client and never fabricated or estimated by the design/development team.

---

## 23. Contact Page Requirements

- **Primary CTAs:** WhatsApp (styled as the primary, most visually prominent action) and phone (secondary but equally functional), both above the fold.
- **Google Maps Embed:** Interactive embedded map centered on the HD Kote studio location, with a "Get Directions" link opening Google Maps natively.
- **Address Block:** Full studio address displayed as text (not only inside the map embed) for accessibility and copy-paste convenience.
- **Response Expectation Copy:** A short line setting expectations (e.g., typical response time) to reduce anxiety for first-time inquirers without overpromising a specific SLA.
- **No Contact Form:** Per explicit scope exclusion, no form-based contact method is included; WhatsApp and phone are the only channels.

---

## 24. Global Components

- Header (transparent-to-solid scroll behavior, persistent nav, WhatsApp icon)
- Footer (link list, contact block, social links, copyright)
- Floating WhatsApp Action Button (persistent across all pages, mobile and desktop)
- Page Transition Wrapper (consistent enter/exit animation between route changes)
- Cursor Interaction Layer (optional custom cursor for desktop, reinforcing the premium/creative-agency feel — must degrade gracefully to default cursor on touch devices)
- Scroll Progress Indicator (subtle, optional — reinforces the "guided narrative" feel on longer pages like Home and Portfolio)

---

## 25. UI Components

- Primary Button (WhatsApp CTA style — solid fill, high contrast)
- Secondary Button (phone/outline style)
- Filter Pill/Tab (Portfolio category filters)
- Portfolio Card (image + hover reveal of category label)
- Lightbox Modal (image viewer with next/prev/close controls)
- Section Divider (used to visually separate homepage narrative sections without hard borders — implemented via spacing and background tone shifts)
- Navigation Overlay (mobile full-screen menu)
- Image Caption/Label (used sparingly in Portfolio lightbox and Services page)

---

## 26. Motion Design Specifications

Motion is a core brand differentiator for this product and must be implemented with precision, not decoration for its own sake.

- **Scroll Reveals:** Elements enter using an 8–8% opacity fade combined with a 24–40px upward translate, triggered when 20–30% of the element is in viewport. Duration: 0.6–0.8s, easing: custom cubic-bezier approximating `ease-out` with slight overshoot avoided (no bounce — bounce reads as playful, not premium).
- **Hover States:** Portfolio cards scale subtly (1.02–1.04x) with a slight image zoom (1.05–1.08x) on hover, paired with a category label fade-in. Desktop only; no equivalent forced interaction on touch devices.
- **Page Transitions:** Route changes use a coordinated fade/slide combination (~0.4–0.5s) rather than an instant swap, maintaining narrative continuity between pages.
- **Filter Transitions:** Portfolio filtering uses Framer Motion's shared layout animation so remaining items smoothly reflow into new grid positions rather than jumping.
- **Header Scroll Behavior:** Background opacity and blur transition smoothly (0.3s) as the user scrolls past the hero threshold.
- **Loading Motion:** Initial page load may include a brief (under 1 second) branded loading transition, but must never block perceived performance — this is a nicety, not a gate.

All motion must respect the `prefers-reduced-motion` media query, falling back to instant or minimal-motion states for users who have this accessibility setting enabled.

---

## 27. Interaction Design

- All interactive elements have a minimum touch target of 44x44px on mobile.
- Focus states are visually distinct (outline or glow, not the default browser blue rectangle, but never removed entirely) to preserve keyboard accessibility.
- The floating WhatsApp button includes a subtle idle animation (gentle pulse, not distracting looped bounce) to draw attention without feeling like a pop-up ad.
- Lightbox navigation supports swipe gestures on mobile and arrow-key navigation on desktop.
- Category filters are single-select (selecting a new category deselects the previous one); "All" is the default active state on page load.

---

## 28. Responsive Behaviour

- **Mobile (< 640px):** Single-column layouts throughout; hero typography scales down but remains bold; Portfolio grid becomes single or two-column masonry; full-screen nav overlay; floating WhatsApp button remains fixed bottom-right with safe-area padding for notch/gesture-bar devices.
- **Tablet (640–1024px):** Two-to-three column grids for Portfolio and Featured Work; header nav may condense but should avoid hamburger unless space genuinely requires it.
- **Desktop (1024px+):** Full multi-column editorial layouts; custom cursor interactions enabled; hover states active; maximum content width constrained (e.g., 1440–1600px) with generous margins to preserve the premium, uncluttered feel rather than stretching content edge-to-edge on ultra-wide monitors.
- All breakpoints must be tested with real device emulation, not browser resizing alone, particularly for touch target sizing and safe-area behavior on iOS.

---

## 29. Accessibility Requirements

- Minimum color contrast ratio of 4.5:1 for body text and 3:1 for large text, tested specifically against the dark-luxury background palette, which is more prone to contrast failures than light backgrounds.
- All images include descriptive `alt` text; portfolio images include contextually meaningful alt text (e.g., "Bride and groom during golden-hour pre-wedding shoot, HD Kote") rather than generic filenames.
- All interactive elements are reachable and operable via keyboard (`Tab`, `Enter`, `Escape` for closing lightbox/menu).
- Motion-heavy sections respect `prefers-reduced-motion`.
- Semantic HTML structure (proper heading hierarchy, `nav`, `main`, `footer` landmarks) to support screen readers.
- Video/cinemagraph hero content includes a static image fallback and does not autoplay audio.

---

## 30. Performance Requirements

- All images served via Next.js Image component with responsive sizing, modern formats (WebP/AVIF with fallback), and lazy loading below the fold.
- Hero media (image or video) is optimized and preloaded to avoid a flash-of-unstyled-content or slow first paint.
- JavaScript bundle size for the initial route is kept lean by code-splitting Framer Motion animations and lightbox logic so they load only when needed.
- Fonts are self-hosted or loaded via `next/font` to eliminate render-blocking external font requests and layout shift from font swapping.
- Target Lighthouse mobile performance score: 85+; desktop: 95+.

---

## 31. SEO Strategy

- Unique, keyword-considered `<title>` and meta description per page (Home, Portfolio, Services, About, Contact), written for humans first, search engines second.
- Semantic heading hierarchy: one `<h1>` per page reflecting the page's core topic (e.g., Homepage H1 reflecting "Wedding & Cinematic Photography Studio" framing rather than only the brand name).
- Descriptive, keyword-relevant image alt text across the Portfolio, doubling as an SEO asset given the image-heavy nature of the site.
- Structured data (JSON-LD) implementing `LocalBusiness` and, where applicable, `ImageGallery`/`CreativeWork` schema to strengthen rich result eligibility.
- Open Graph and Twitter Card metadata for clean link previews when the site is shared on Instagram bio links, WhatsApp, or social platforms.
- Clean, human-readable URL structure (e.g., `/portfolio`, `/services`, no unnecessary query-string clutter for primary routes).
- XML sitemap and `robots.txt` generated and submitted to Google Search Console at launch.
- Canonical tags set on every page to avoid duplicate-content issues arising from the optional query-parameter-based Portfolio filtering (e.g., `/portfolio?category=wedding` should canonicalize back to `/portfolio` unless the dynamic route variant described in Section 17 is implemented, in which case each category route is treated as its own canonical, indexable page).
- Internal linking strategy connecting Services descriptions to their corresponding Portfolio category (as specified functionally in Section 21), which both aids user navigation and distributes topical relevance signals between related pages.
- Core Web Vitals treated as an SEO requirement, not only a UX requirement, given Google's continued use of page experience signals in ranking — directly tying Section 30's performance requirements to this section's SEO goals.
- Image file naming and compression handled prior to upload (per Section 43) so that SEO value from descriptive filenames and fast load times is captured from day one rather than retrofitted later.

---

## 32. Local SEO Strategy

- `LocalBusiness` structured data populated with the studio's HD Kote address, service area (Mysore district and surrounding region), phone number, and business category (Photography Studio).
- Google Business Profile alignment: NAP (Name, Address, Phone) consistency between the website footer/Contact page and the Google Business Profile listing.
- Location-aware copy on the Contact and About pages naturally referencing HD Kote, Mysore district, and Karnataka without keyword-stuffing.
- Embedded Google Map on the Contact page contributing to local relevance signals.
- Encourage backlinks/citations from local wedding vendor directories and event organizer networks as a post-launch off-page SEO activity (noted here for SEO specialist follow-through, not part of initial development scope).
- Service-area language on the About and Contact pages should reference both the specific town (HD Kote) and the broader district (Mysore district, Karnataka) to capture search intent at both granularities, since couples and event organizers frequently search using the nearest large city rather than the smaller town where a vendor is actually based.
- Where the studio has documented past work in nearby towns or cities within the district, the Portfolio captions (Section 20) may naturally reference those locations, reinforcing geographic relevance across a wider service radius without requiring dedicated location-specific landing pages, which would be disproportionate to the site's five-page scope.
- Local SEO performance should be monitored via Google Search Console's "Performance" report filtered to queries containing location terms, reviewed monthly against the impression-growth target defined in Section 4.

---

## 33. Content Strategy

Content across the site follows three principles: (1) show, don't tell — imagery carries the majority of persuasive weight, with copy providing only necessary context and emotional framing; (2) confident brevity — no paragraph should restate what the imagery already communicates; (3) consistent voice — whether on the homepage hero or a service description, copy should read as though written by the same studio voice, avoiding the generic, interchangeable tone common to template-driven competitor sites.

All final copy (hero statement, philosophy paragraph, service descriptions, About narrative) should be drafted by the design/content team in collaboration with the studio owner to ensure authenticity, then reviewed against the brand personality traits (Premium, Cinematic, Modern, Bold, Minimal, Creative, Professional) before final sign-off.

**Content Governance:** Every piece of copy on the site should be traceable to a specific page/section owner (in this case, the studio owner as the sole content authority) to avoid the common failure mode of marketing copy being progressively diluted through multiple rounds of "make it sound more professional" edits that strip out authentic voice in favor of generic corporate phrasing. The content review process should explicitly check each draft against a simple test: could this sentence appear verbatim on a competitor's website without anyone noticing it was copied? If yes, the sentence should be rewritten until it reflects something specific and true about this studio rather than photography studios in general.

**Tone Calibration by Page:** While voice consistency (Section 33, principle 3) is required across the site, tone may calibrate slightly by page context — the Homepage hero statement should be the most confident and declarative; the About page narrative may be warmer and more personal; Service descriptions should be the most concrete and informative, since visitors reading them are typically further along in their evaluation and want clarity over atmosphere.

---

## 34. Photography Guidelines

- All homepage and hero imagery must be the studio's own work — no stock photography under any circumstance, as this would directly undermine the credibility goal defined in Section 3.
- Preference for a mix of aspect ratios in the Portfolio to preserve each image's original composition rather than force-cropping into a uniform grid.
- Color grading consistency across featured/hero selections should reflect a cohesive visual identity (the design team should work with the studio to select a consistent subset of images for hero/featured placement, even if the studio's full body of work spans varied styles).
- Video content (if used in the hero) should be short (6–15 second loop), silent, and cinemagraph-style rather than a traditional highlight reel with cuts and music, to preserve the calm, premium pacing of the homepage.

---

## 35. Typography Guidelines

- **Primary Display Typeface:** A bold, high-contrast serif or modern grotesque sans-serif suited to large-scale cinematic headlines (final selection to be made by the UI/UX designer during the design phase, with strong candidates including typefaces in the style of Canela, Söhne, or GT Sectra for a premium editorial feel).
- **Body Typeface:** A clean, highly legible sans-serif (e.g., in the style of Inter, General Sans, or Neue Montreal) for body copy, service descriptions, and UI labels.
- **Scale:** A deliberate, restrained type scale (e.g., 6–7 defined sizes) rather than ad-hoc sizing, ensuring visual consistency across all five pages.
- **Hero Headlines:** Extremely large scale (clamp-based fluid typography, e.g., `clamp(2.5rem, 8vw, 7rem)`) to establish the cinematic, bold personality trait immediately on load.
- **Letter-Spacing:** Slight negative tracking on large display type for a tightened, premium editorial feel; slightly increased tracking on all-caps UI labels (e.g., filter pills, nav items) for clarity and elegance.

---

## 36. Color System

- **Primary Palette:** Dark, luxury-leaning base (deep charcoal/black, e.g., `#0A0A0A`–`#141414`) to let imagery dominate visually and reinforce the cinematic, premium personality — consistent with the studio's existing dark-luxury brand direction.
- **Accent Color:** A single restrained accent (warm gold, muted bronze, or off-white) used sparingly for CTAs, active filter states, and key highlights — never applied broadly enough to compete with the photography itself.
- **Text Colors:** Off-white/cream (not pure white, which can feel harsh against a dark background) for primary text; a muted gray for secondary/supporting copy.
- **Functional Colors:** WhatsApp CTA may use a close variant of WhatsApp's brand green only if it does not clash with the established palette; otherwise, the studio's accent color is used consistently and WhatsApp's iconography alone signals the channel.
- **Contrast Discipline:** All color pairings validated against WCAG AA contrast minimums before final design sign-off, given the inherent contrast risk of a dark-background design system.

---

## 37. Design Principles

1. **Imagery leads, UI follows.** Every interface decision should recede in service of the photography — no competing visual noise.
2. **Restraint signals premium.** Fewer, more deliberate design elements outperform a feature-dense layout; white space (or in this case, "dark space") is a design tool, not empty space to be filled.
3. **Motion earns its place.** Every animation must serve pacing or feedback — never motion for the sake of demonstrating technical capability.
4. **Consistency across pages.** A visitor should never feel like they've left the same "world" moving between Home, Portfolio, Services, About, and Contact.
5. **Human warmth beneath premium polish.** Especially given emotionally invested personas (brides, new parents), the design must avoid feeling cold or corporate despite its high production value.

---

## 38. Technical Architecture

The application is built as a Next.js application using the App Router, deployed to Vercel, with a clear separation between static content (service descriptions, About copy) and portfolio media assets. Given the absence of a CMS in this release, content is managed through structured local data files (JSON or TypeScript modules) that map cleanly onto React components, ensuring an easy migration path to a headless CMS (e.g., Sanity or Contentful) in a future phase without requiring a component-level rewrite.

Image assets are stored either in the Next.js `public` directory (for a leaner initial build) or in a dedicated asset CDN if the total portfolio image volume grows large enough to warrant it (recommended threshold: beyond ~150–200 high-resolution images). Framer Motion handles all client-side animation, scoped to client components only, while the majority of the page structure remains server-rendered for performance and SEO benefit.

**Rendering Strategy:** All five pages are statically generated at build time (Next.js Static Site Generation) rather than server-rendered per request, since content changes infrequently and does not depend on per-visitor personalization. This maximizes the performance benefit on Vercel's edge network and keeps Time to First Byte minimal regardless of visitor location, which matters given that a meaningful share of traffic (referrals shared via WhatsApp, Instagram bio links) may arrive on inconsistent mobile network conditions. Any future CMS integration (Phase 2, Section 53) would shift the rendering model toward Incremental Static Regeneration so that new portfolio content can go live without a full redeploy, without sacrificing the performance benefits of static generation for the common case.

**Deployment Model:** The Vercel deployment is connected directly to the project's Git repository, with production deployments triggered from the main branch and preview deployments automatically generated for feature branches or pull requests — allowing the client to review visual changes (e.g., new portfolio content, copy updates) on a live preview URL before they are merged into production.

---

## 39. Frontend Architecture

- **Framework:** Next.js (App Router), leveraging server components by default and client components only where interactivity (Framer Motion, lightbox state, filter state) requires it.
- **Styling:** Tailwind CSS with a centralized design token configuration (`tailwind.config`) reflecting the color system, typography scale, and spacing system defined in Sections 35–37, ensuring no ad-hoc, one-off style values scattered across components.
- **Animation:** Framer Motion for all scroll reveals, hover states, page transitions, and filter transitions, using shared `variants` objects for consistency rather than inline, duplicated animation configs.
- **Icons:** Lucide, used consistently for all UI iconography (menu, close, arrows, WhatsApp/phone glyphs where not using brand-specific icons).
- **Image Handling:** Next.js `Image` component universally, with defined `sizes` attributes per breakpoint to ensure correctly sized image delivery rather than relying on default behavior.

---

## 40. Folder Structure Recommendation

```
/app
  /page.tsx                 → Home
  /portfolio/page.tsx        → Portfolio
  /services/page.tsx         → Services
  /about/page.tsx             → About
  /contact/page.tsx           → Contact
  /layout.tsx                 → Root layout (Header, Footer, global providers)
/components
  /global (Header, Footer, FloatingWhatsApp, PageTransition)
  /ui (Button, FilterPill, Card, Modal)
  /sections (Hero, FeaturedWork, ServicesTeaser, PhilosophySection, CTASection)
  /portfolio (PortfolioGrid, PortfolioFilterBar, Lightbox)
/data
  /portfolio.ts (structured portfolio item data: id, category, images, captions)
  /services.ts (structured service data: title, description, image)
/lib
  /animations.ts (shared Framer Motion variants)
  /constants.ts (WhatsApp number, phone number, address, social links)
/public
  /images (organized by page/category subfolders)
```

This structure keeps content data (`/data`) decoupled from presentation (`/components`), which directly supports NFR-5 (future CMS migration readiness) without requiring the development team to over-engineer a CMS integration prematurely.

---

## 41. Component Architecture

Components follow a three-tier hierarchy: **Global** (Header, Footer, FloatingWhatsApp — present on every page), **Section** (Hero, FeaturedWork, PhilosophySection — homepage-specific, composed page-level blocks), and **UI Primitives** (Button, FilterPill, Modal — reusable, unopinionated building blocks used across sections). Section-level components consume data from the `/data` layer as props rather than importing data directly, keeping them portable and testable in isolation. Animation variants are defined once in `/lib/animations.ts` and imported wherever needed, preventing inconsistent easing/duration values from creeping into different parts of the site over time.

---

### 41a. Portfolio Data Schema (Reference Implementation)

To keep the Portfolio system maintainable and CMS-migration-ready, each portfolio entry should follow a consistent shape, whether stored in a static TypeScript/JSON file at launch or later migrated into a headless CMS. A representative schema:

```ts
type PortfolioCategory = "wedding" | "corporate" | "products" | "family" | "events";

interface PortfolioImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  coverImage: PortfolioImage;
  gallery: PortfolioImage[];
  caption?: string;
  featured: boolean;
}
```

The `featured` flag allows the Homepage's Featured Work section (Section 19, Section 2) to pull directly from the same underlying data source used by the full Portfolio page, avoiding duplicated content maintenance between the two. The `category` field drives filter-bar logic on the Portfolio page (Section 20) and the optional category-specific route described in Section 17. Enforcing `alt` text as a required field at the schema level (rather than an optional afterthought) is a deliberate technical decision that supports the accessibility requirements defined in Section 29 by making it structurally difficult for a future content contributor to add an image without descriptive alt text.

---

## 42. State Management Strategy

Given the site's scope (five static pages plus a filterable Portfolio), no global state management library (Redux, Zustand, etc.) is required. State is scoped locally:
- **Portfolio filter state:** Managed via local component state (`useState`) at the Portfolio page level, reflected optionally in the URL query string (`?category=wedding`) for shareability and back-button support.
- **Lightbox open/active-item state:** Managed via local state within the Portfolio component tree.
- **Mobile navigation open/closed state:** Managed via local state in the Header component.
- **Scroll-triggered animation state:** Managed via Framer Motion's built-in `useInView`/`whileInView` hooks rather than manual scroll-position tracking.

This deliberately lightweight approach avoids over-engineering state management for a product with genuinely simple state needs.

---

## 43. Asset Management Strategy

- Portfolio images are pre-processed (compressed, correctly sized, correctly oriented) before being added to the codebase — this is a content-team responsibility, not something Next.js Image optimization alone should be relied upon to fully compensate for.
- A naming convention is enforced for portfolio assets (e.g., `wedding-couplename-01.jpg`) to keep the `/data/portfolio.ts` mapping maintainable as the portfolio grows.
- Video assets (if used in the hero) are compressed and served in modern formats (WebM/MP4 H.264 fallback) at a resolution appropriate to the largest display size actually needed (no unnecessarily oversized 4K hero loops).
- A documented process for adding new portfolio work post-launch (image prep → naming → adding an entry to `/data/portfolio.ts` → redeploy) should be handed to the client or their developer to support ongoing content freshness without requiring a full development engagement for every new shoot added.

---

## 44. Analytics Requirements

- Google Analytics 4 (GA4) implemented site-wide via Next.js's recommended integration pattern.
- Custom events tracked for: WhatsApp CTA clicks (header, footer, floating button, Contact page, Homepage CTA section — each with a distinct event label to identify which CTA converts best), phone tap-to-call clicks, Google Maps "Get Directions" clicks, and Portfolio category filter interactions.
- Standard GA4 engagement metrics (session duration, bounce rate, pages per session) monitored against the targets defined in Section 4.
- No third-party tracking beyond GA4 is required at launch; additional tools (e.g., heatmapping software) may be considered in a future roadmap phase if inquiry volume data alone proves insufficient for optimization decisions.

---

## 45. Security Requirements

- HTTPS enforced across all routes via Vercel's default SSL provisioning.
- No user-submitted data collection at launch (no contact form), which significantly reduces the site's data-security surface area.
- Dependency versions (Next.js, Framer Motion, Tailwind) kept current with security patches; no use of unmaintained or deprecated npm packages.
- Environment variables (if any, e.g., for analytics IDs) stored securely via Vercel's environment variable system, never hard-coded into client-exposed source.
- Standard security headers (Content-Security-Policy, X-Frame-Options, Referrer-Policy) configured at the Next.js/Vercel level to reduce clickjacking and injection risk, even for a low-attack-surface marketing site.

---

## 46. Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome (Desktop & Android) | Latest 2 major versions |
| Safari (macOS & iOS) | Latest 2 major versions |
| Firefox | Latest 2 major versions |
| Edge (Chromium) | Latest 2 major versions |
| Samsung Internet | Latest major version |

No support is guaranteed for Internet Explorer or legacy browsers, which is standard and appropriate for a modern Next.js/Tailwind/Framer Motion stack.

---

## 47. Error Handling

- **404 Page:** A custom, on-brand 404 page maintaining the cinematic visual language (not a default framework error screen), with a clear path back to the Homepage or Portfolio.
- **Image Load Failures:** Graceful fallback (e.g., a subtle placeholder background matching the site's dark palette) if an individual portfolio image fails to load, rather than a broken-image icon breaking the visual experience.
- **Map Embed Failure:** If the Google Maps embed fails to load (e.g., due to network restrictions), the Contact page still displays the full text address and directions link as a fallback.
- **WhatsApp Link Failure (Desktop without WhatsApp Web session):** Clicking the WhatsApp CTA on desktop opens `web.whatsapp.com` via the standard `wa.me` redirect behavior, which is expected and requires no additional custom handling.
- **JavaScript Failure/Disabled:** Core content (text, images, navigation links) remains accessible via server-rendered HTML even if client-side JavaScript fails to load, since Next.js's server component model ensures the base content is not solely dependent on client-side rendering.

---

## 48. Acceptance Criteria

- All five pages are implemented, responsive, and match approved design files within reasonable fidelity (spacing, type scale, color, motion timing).
- Portfolio filtering functions correctly across all five categories with no console errors and no layout breakage during filter transitions.
- WhatsApp, phone, and Google Maps integrations are functional and tested on real mobile devices (not simulators alone).
- Lighthouse performance score of 85+ (mobile) and 95+ (desktop) achieved on the Home and Portfolio pages at minimum.
- No Cumulative Layout Shift issues observed during standard browsing (image loading, filter transitions, font loading).
- Site passes WCAG 2.1 AA automated audit (e.g., via Axe or Lighthouse Accessibility) with no critical issues outstanding.
- All copy has been reviewed and approved by the client (studio owner) prior to launch, with no placeholder ("Lorem ipsum" or bracketed TODO) text remaining anywhere in the production build.
- Site is fully deployed on Vercel under the client's intended production domain with SSL active.

---

## 49. QA Checklist

- [ ] All navigation links (header, footer, mobile menu) route correctly with no dead links.
- [ ] Portfolio filters correctly show/hide items per category, including the "All" default state.
- [ ] Lightbox opens, navigates (next/prev), and closes correctly via mouse, touch, and keyboard.
- [ ] WhatsApp CTA opens `wa.me` link with correct pre-filled message text on both mobile and desktop.
- [ ] Phone CTA correctly triggers native dialer on mobile devices.
- [ ] Google Maps embed loads correctly and "Get Directions" opens native Maps app on mobile.
- [ ] All images display correct alt text (spot-checked, not assumed).
- [ ] Site tested on real iOS Safari and Android Chrome devices, not only desktop browser emulation.
- [ ] Reduced-motion setting correctly suppresses non-essential animation.
- [ ] Forms/booking/FAQ/pricing content confirmed absent, per scope exclusion.
- [ ] All five pages tested at minimum three breakpoints (mobile, tablet, desktop).
- [ ] 404 page displays correctly for invalid routes.
- [ ] No console errors or warnings present in production build across all pages.
- [ ] Portfolio filter state correctly reflected in and restored from the URL (Section 20, FR-16), including correct behavior when a filtered link is shared and opened fresh.
- [ ] Custom cursor (if implemented) degrades gracefully and does not appear or interfere on touch devices.
- [ ] Header transparent-to-solid scroll transition behaves correctly at all breakpoints, with no flash or flicker at the transition threshold.
- [ ] Hero video/cinemagraph (if used) autoplays silently, loops seamlessly, and includes a static-image fallback for slow connections or autoplay-restricted browsers.
- [ ] All meta titles, descriptions, and Open Graph tags are correctly populated per page (no default/placeholder Next.js metadata remaining).
- [ ] Structured data (JSON-LD) validated using Google's Rich Results Test with no errors.
- [ ] Cross-checked NAP (name, address, phone) consistency between the website and the studio's Google Business Profile listing.
- [ ] Font loading tested for flash-of-unstyled-text or layout shift on slow connections.

---

## 50. Testing Strategy

Testing follows a three-layer approach appropriate to a marketing/portfolio site's risk profile:

1. **Manual Cross-Device QA (Primary):** Given the visual and motion-driven nature of this product, automated unit testing provides limited value relative to manual review across real devices and browsers. QA should prioritize actual iOS/Android devices over emulators for touch interaction, safe-area, and performance validation.
2. **Automated Accessibility & Performance Auditing:** Lighthouse and Axe audits run against each page pre-launch and as part of any future content update process, catching regressions in performance or accessibility introduced by new portfolio content additions.
3. **Link & Integration Testing:** Explicit verification of every external integration point (WhatsApp deep link, tel: link, Google Maps embed) on real devices, since these are the site's actual conversion mechanisms and any failure here directly costs the business inquiries.

Given the absence of user-submitted forms or complex application logic, full end-to-end automated test suites (e.g., Playwright/Cypress) are optional rather than mandatory for this release, but may be introduced in a future phase if the site's scope expands (e.g., a future CMS-driven content workflow).

---

## 51. Testing Strategy — Regression Considerations

Any future addition of new portfolio content (new shoots, new categories) should trigger a lightweight regression pass covering: Portfolio filter behavior with the new content included, image loading/performance on the updated Portfolio page, and confirmation that the new content does not break the existing masonry/grid layout at any breakpoint. This is intentionally separated from Section 50 to flag it as an ongoing, post-launch QA responsibility rather than a one-time pre-launch task.

---

## 52. Deployment Checklist

- [ ] Custom domain connected and SSL certificate active on Vercel.
- [ ] Environment variables (analytics IDs, any API keys) correctly configured in Vercel's production environment.
- [ ] `robots.txt` and `sitemap.xml` correctly generated and accessible.
- [ ] Google Search Console property verified and sitemap submitted.
- [ ] Google Analytics 4 property connected and event tracking verified live (not just in a staging environment).
- [ ] Google Business Profile NAP details cross-checked against website footer/Contact page for consistency.
- [ ] Final client sign-off obtained on all copy and imagery prior to going live.
- [ ] Post-launch smoke test performed on production URL (not just staging/preview deployment) across mobile and desktop.
- [ ] Backup of all source portfolio images retained outside the Vercel deployment (e.g., client's own storage) in case of future redesign or migration needs.

---

## 53. Future Roadmap

- **Phase 2 — CMS Integration:** Migrate portfolio and service content from static data files to a headless CMS (e.g., Sanity), enabling the studio to add new work without developer involvement.
- **Phase 2 — Instagram Feed Integration:** Optional live Instagram feed embed on the Homepage or Contact page to reinforce social proof and content freshness.
- **Phase 3 — Client Delivery Portal:** A private gallery/download area for delivering final client photos, should the studio wish to formalize delivery beyond current methods (e.g., Google Drive links).
- **Phase 3 — Blog/Journal Section:** Long-form content (real wedding features, behind-the-scenes stories) to support SEO growth beyond core service pages.
- **Phase 4 — Multi-location Expansion:** If the studio expands beyond HD Kote, the site's architecture (particularly the Contact/local SEO structure) would need to support multiple location entries.

None of these phases are required for the initial launch and are documented here purely to inform architectural decisions (e.g., the CMS-readiness requirement in Section 39) that make future expansion smoother.

---

## 54. Risks & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Client cannot supply enough high-quality portfolio imagery across all five categories at launch | Portfolio feels sparse in weaker categories | Prioritize categories with strongest existing work for launch; backfill others post-launch as new shoots are completed |
| Heavy imagery and motion design harm mobile performance | Slow load times, poor Core Web Vitals, lost inquiries | Strict adherence to Next.js Image optimization, lazy loading, and performance budgets defined in Section 30 |
| Over-animation makes the site feel gimmicky rather than premium | Undermines the intended "restraint signals premium" design principle | Design review checkpoint specifically evaluating motion against Section 26 specifications before development sign-off |
| Dark color palette creates accessibility/contrast issues | WCAG failures, poor readability for some users | Contrast validation built into the design phase, not left to a post-launch audit |
| No CMS means every content update requires developer involvement | Slower content freshness post-launch, particularly for a fast-moving Instagram-native business | Documented asset-addition process (Section 43) as a stopgap; CMS migration flagged as Phase 2 roadmap priority |
| Absence of a pricing page or FAQ increases perceived friction for price-sensitive personas (e.g., the Local Small Business Owner) | Some visitors abandon before contacting rather than asking directly | Response-expectation copy on the Contact page (Section 23) and clear service descriptions (Section 21) reduce ambiguity enough to offset the missing self-service information |
| Large volume of high-resolution portfolio imagery (300+ images) risks slow load times if not rigorously optimized | Failing Core Web Vitals targets, harming both UX and SEO | Strict enforcement of the asset management strategy (Section 43), lazy loading (FR-15), and performance budgets (Section 30) as non-negotiable technical constraints, not post-launch optimizations |

---

## 55. Assumptions

- The client will supply final, edited, high-resolution photography and (if used) video assets for hero/featured content prior to development handoff.
- The studio's WhatsApp Business number and phone number are finalized and will not change during development.
- The HD Kote studio address is confirmed accurate and matches (or will be updated to match) the studio's Google Business Profile listing.
- The client will provide timely copy review and approval to avoid delaying launch with placeholder content.
- No legal/rights complications exist around using client photography (e.g., wedding couples featured) on the public website; standard photography-service consent covers portfolio display use.
- The studio's brand name, logo (if one already exists), and any existing brand color preferences will be supplied to the design team prior to the design phase beginning, rather than being created from scratch as part of this engagement.
- Adequate network connectivity exists at the studio's HD Kote location for any content updates or asset uploads to be performed without significant delay, relevant primarily to the post-launch asset-addition workflow described in Section 43.
- The studio understands and accepts that no pricing or booking functionality will be visible to visitors, and that all commercial terms will continue to be negotiated directly through WhatsApp or phone conversation, consistent with the explicit scope exclusions in Section 16.

---

## 56. Constraints

- No pricing, booking, or FAQ functionality may be introduced, per explicit client direction — any future request to add these should be treated as a scope change requiring a new requirements discussion, not an assumed extension of this PRD.
- The technology stack is fixed to Next.js, Tailwind CSS, Framer Motion, Vercel, Next.js Image, and Lucide icons as specified by the client; alternative frameworks or libraries are out of scope for this engagement.
- Initial content management is static (no CMS), constraining how frequently non-technical staff can update content without developer involvement until a future CMS migration phase.
- Budget and timeline for this engagement are governed separately from this PRD (see the project's commercial proposal/contract) and are not defined within this document.

---

## 57. Glossary

- **CLS (Cumulative Layout Shift):** A Core Web Vital measuring unexpected layout movement during page load.
- **LCP (Largest Contentful Paint):** A Core Web Vital measuring how quickly the largest visible content element loads.
- **INP (Interaction to Next Paint):** A Core Web Vital measuring responsiveness to user interaction.
- **Lightbox:** An overlay UI pattern for viewing an enlarged image without leaving the current page.
- **NAP:** Name, Address, Phone — a standard local SEO consistency term.
- **Headless CMS:** A content management system that provides content via API without dictating the frontend presentation layer.
- **App Router:** Next.js's routing system based on the `/app` directory, supporting server and client components.
- **Structured Data (JSON-LD):** Machine-readable metadata embedded in a page to help search engines understand its content (e.g., business type, location).
- **Cinemagraph:** A short, looping visual in which most of the frame remains still while a small, specific element (e.g., a flowing veil, falling confetti) subtly moves, used here as an alternative to a full autoplay video hero.
- **Masonry Grid:** A grid layout that accommodates images of varying aspect ratios by allowing items to sit at different heights within columns, rather than forcing uniform cropping.
- **Shared Layout Animation:** A Framer Motion technique in which an element smoothly animates between two different layout states (e.g., a Portfolio filter transition) rather than abruptly repositioning.
- **Core Web Vitals:** A set of Google-defined metrics (LCP, CLS, INP) used to evaluate real-world page experience quality, factored into search ranking.
- **Server Component / Client Component:** Next.js's architectural distinction between components rendered on the server (default, faster, better for SEO) and components requiring client-side interactivity (used sparingly for animation and interactive state in this product).
- **Canonical Tag:** An HTML element indicating the preferred, authoritative URL for a page when multiple URL variants (e.g., filtered Portfolio views) could otherwise be seen as duplicate content by search engines.

---

## 58. Appendix

**A. Reference Brand Benchmarks:** Apple.com (restraint, typographic confidence), Leica Camera's brand site (premium minimalism, photography-led storytelling), and Awwwards-featured creative agency portfolios (motion design pacing, editorial grid layouts) — referenced throughout this document as the visual and experiential standard this product should be measured against, not as literal design templates to copy.

**B. Contact Integration Reference:** WhatsApp click-to-chat links follow the format `https://wa.me/<countrycode><number>?text=<url-encoded-default-message>`; phone links follow the standard `tel:<number>` format; Google Maps embeds use the standard iframe embed URL generated from the studio's verified Google Business Profile listing.

**C. Document Change Log:** Version 1.0 — Initial complete PRD covering all 58 required sections, prepared for direct handoff to design, development, QA, and SEO teams.

---

*End of Document.*
