# Wolin Small-Business Online Presence Audit

Version: September 18, 2026

This is the master workflow and criteria library for Wolin visibility audits. It reflects the offer on wolin.dev: Google Business Profile optimization, website and on-page SEO improvements, conversion and mobile improvements, citation cleanup, technical SEO, service/location/authority content, structured data, competitor tracking, AI visibility, social presence, and business photo/video.

The audit is designed to answer four questions:

1. Can nearby customers find the business?
2. Do Google, maps, search engines, and AI systems understand and trust it?
3. Does the website persuade visitors and turn them into leads or customers?
4. Can the business measure results and maintain its presence?

## 1. Audit operating model

### Audit modes

**Public visibility scan** — Uses public information only. Suitable for the free visibility report. Mark owner-only checks as `No access`, never guess, and do not penalize the score for inaccessible items.

**Full audit** — Adds owner access to Google Business Profile, Google Search Console, GA4, Bing Webmaster Tools, website/CMS, call tracking, booking/ecommerce, and relevant directory accounts.

**Recurring review** — Rechecks changed items, rankings, reviews, citations, conversions, and AI answers monthly; repeats the full benchmark quarterly.

### Required inputs

- Legal and customer-facing business name
- Primary address or confirmation that the business is service-area only
- Main phone, email, domain, hours, and appointment/ordering URLs
- Primary services/products and most profitable services
- Areas served and locations staffed
- Ideal customers and highest-value actions
- Known competitors, seasonality, regulated-industry constraints, and languages served
- Access status for GBP, GSC, GA4, Bing Webmaster Tools, CMS, booking/ecommerce, and social profiles
- Previous domains, business names, addresses, phone numbers, or ownership changes

### Evidence standard

Every finding must include:

- Criterion ID
- Status: `Pass`, `Partial`, `Fail`, `Not applicable`, or `No access`
- URL, screenshot, export, test result, or exact observation
- Why it matters in plain language
- Recommended action
- Impact: `Critical`, `High`, `Medium`, or `Low`
- Effort: `Quick win`, `Small`, `Medium`, or `Large`
- Owner: Wolin, client, developer, photographer, or third party
- Suggested due date

Do not present assumptions as findings. Do not promise rankings, Map Pack placement, review volume, traffic, or AI citations.

### Scoring

Score each applicable criterion:

- `2` = passes
- `1` = partially passes
- `0` = fails
- `N/A` and `No access` = excluded from the denominator

Calculate each section as `points earned / possible points × section weight`.

| Section | Weight |
| --- | ---: |
| Google Business Profile | 20 |
| Website search foundation and local relevance | 25 |
| Website experience and conversion | 15 |
| Reputation, citations, and local authority | 15 |
| AI visibility and entity clarity | 15 |
| Measurement and operating process | 10 |
| **Total** | **100** |

Use these criterion groups for the weighted sections:

| Weighted section | Criterion groups |
| --- | --- |
| Google Business Profile | `ID`, `GBP` |
| Website search foundation and local relevance | `TECH`, `ARCH`, `ONP`, `SCH` |
| Website experience and conversion | `UX`, `PERF`, `BRAND` |
| Reputation, citations, and local authority | `REP`, `CIT`, `LOC`, `SOC`, `AUTH` |
| AI visibility and entity clarity | `AI` |
| Measurement and operating process | `MEAS`, `OPS` |

Critical failures are shown separately and cannot be hidden by a high aggregate score. Examples include a suspended or ineligible GBP, a site-wide `noindex`, malware, a broken lead form, an expired certificate, a wrong phone number, or a materially false business fact.

## 2. End-to-end workflow

### Stage 1 — Intake and scope

1. Confirm business model: storefront, service-area, hybrid, online-only, practitioner, department, or multi-location.
2. Confirm the real-world business identity and which locations are eligible for separate profiles.
3. Identify the primary market, services, conversion actions, and competitors.
4. Record access received and checks that must remain `No access`.
5. Capture the audit date, device/location used, and a baseline of all visible facts.

### Stage 2 — Baseline discovery

1. Search the exact business name, name plus city, phone number, address, and domain.
2. Record the branded search result, knowledge panel, map result, directory profiles, social profiles, review sites, and conflicting facts.
3. Crawl the website and inventory indexable URLs, titles, canonicals, status codes, internal links, schema, images, and forms.
4. Export GSC, GA4, GBP Performance, and Bing data when access is available.
5. Capture current local rankings and AI-answer benchmarks before making changes.

### Stage 3 — Manual evaluation

Review every applicable criterion below. Test as a new customer on mobile first, then desktop. Complete at least one call, form, booking, quote, order, directions, and email path that the business expects customers to use.

### Stage 4 — Local and competitor benchmark

1. Select 3–5 true local competitors that appear for the target queries; do not rely only on names supplied by the client.
2. Compare categories, reviews, photos, services, citations, pages, content depth, backlinks/local mentions, calls to action, and structured data.
3. Run a geo-grid or representative searches from multiple points in the actual service area.
4. Separate branded, non-branded, service, location, and problem-based queries.

### Stage 5 — AI visibility benchmark

1. Use fresh chats with browsing/search enabled where available.
2. Run the same prompt set on ChatGPT, Google AI experiences/Gemini, Microsoft Copilot, and Perplexity when relevant to the audience.
3. Record whether the business is mentioned, recommended, accurately described, and cited.
4. Save the exact prompt, date, model/product, location context, answer, sources, competitors mentioned, and factual errors.
5. Treat results as volatile samples, not deterministic rankings.

### Stage 6 — Prioritization

Sort findings in this order:

1. Eligibility, policy, security, false-information, and broken-conversion risks
2. Crawl/indexing and wrong business data
3. High-intent GBP, service page, location page, review, and conversion gaps
4. Measurement gaps that prevent proving results
5. Authority, content, media, AI visibility, and experimentation

Within each group, favor high-impact quick wins. Consolidate related findings into projects instead of giving the client a wall of disconnected tasks.

### Stage 7 — Client deliverable

The final report should contain:

- One-page executive summary
- Overall score and six section scores
- Critical issues requiring immediate attention
- Top 5 quick wins
- 30-day action plan
- 60–90-day growth plan
- Evidence-backed findings by criterion ID
- GBP, website, local ranking, competitor, and AI baseline snapshots
- Access limitations and items not tested
- Recommended Wolin service tier and clearly optional add-ons

### Stage 8 — Verification and monitoring

1. Retest every completed fix and attach new evidence.
2. Annotate release dates in reporting.
3. Monitor leads, local visibility, organic clicks, GBP actions, review health, and AI mention/citation samples.
4. Review work monthly and repeat the complete competitive and AI benchmark quarterly.

## 3. Master audit criteria

### A. Business identity and eligibility

- [ ] **ID-01** Customer-facing business name matches real-world signage, branding, website, and official materials.
- [ ] **ID-02** Legal name, DBA, and customer-facing name are documented without conflating them.
- [ ] **ID-03** Business model is correctly classified as storefront, service-area, hybrid, online-only, practitioner, department, or multi-location.
- [ ] **ID-04** The business is eligible for a Google Business Profile; an online-only business is not incorrectly represented as a local storefront.
- [ ] **ID-05** Each listed location is real, staffed as required, and customer-facing when its address is displayed.
- [ ] **ID-06** A service-area business hides a residential/non-customer-facing address.
- [ ] **ID-07** Virtual offices, mailboxes, coworking spaces, and lead-generation locations are not improperly used.
- [ ] **ID-08** Practitioner and department profiles follow the correct distinct-name, category, phone, and customer-access rules.
- [ ] **ID-09** Multi-location names and primary categories are consistently governed.
- [ ] **ID-10** Business name, address, phone, domain, hours, and primary category have a documented source of truth.
- [ ] **ID-11** Past names, addresses, phone numbers, and domains are inventoried for cleanup.
- [ ] **ID-12** Regulated-industry claims, licenses, disclaimers, and advertising restrictions are identified.

### B. Google Business Profile ownership, policy, and integrity

- [ ] **GBP-01** Correct profile is claimed and verified.
- [ ] **GBP-02** Primary owner is a durable business-controlled Google account, not a former employee or agency.
- [ ] **GBP-03** Each user has individual access at the minimum necessary role; passwords are not shared.
- [ ] **GBP-04** Former employees, vendors, and unknown managers are removed.
- [ ] **GBP-05** Recovery email, phone, two-factor authentication, and ownership continuity are documented.
- [ ] **GBP-06** No duplicate, unverified, moved, permanently closed, or practitioner profile is splitting signals.
- [ ] **GBP-07** The profile has no suspension, verification, rejected-edit, disabled-feature, or policy warning.
- [ ] **GBP-08** Business name contains no added city, service, keyword, or marketing text unless part of the real-world name.
- [ ] **GBP-09** Address/service-area setup follows current Google policy.
- [ ] **GBP-10** Map pin is at the correct entrance or service location.
- [ ] **GBP-11** The public profile contains no materially misleading claims, URLs in prohibited fields, or restricted content.
- [ ] **GBP-12** Client authorization and third-party management responsibilities are documented.

### C. Google Business Profile completeness and relevance

- [ ] **GBP-13** Primary category is the most specific accurate category for the core business.
- [ ] **GBP-14** Secondary categories cover real business lines without being used as a keyword list.
- [ ] **GBP-15** Category choices are benchmarked against relevant local leaders and reviewed for seasonal changes.
- [ ] **GBP-16** Displayed business address exactly matches the real location and source-of-truth format.
- [ ] **GBP-17** Service areas are accurate, reasonable, and expressed using supported places rather than stuffed into copy.
- [ ] **GBP-18** Main phone reaches the correct location/business and is answered as expected.
- [ ] **GBP-19** Any secondary phone is valid and intentional.
- [ ] **GBP-20** Website link resolves to the best matching canonical landing page, not a generic or broken page.
- [ ] **GBP-21** Website, appointment, menu, order, reservation, and other action links are correct and use intentional UTM tracking.
- [ ] **GBP-22** Regular hours match the website, storefront, phone system, and actual staffed availability.
- [ ] **GBP-23** Holiday/special hours and temporary or seasonal closures are maintained before they affect customers.
- [ ] **GBP-24** More-hours fields are used accurately where the category supports them.
- [ ] **GBP-25** Business description accurately explains what, who, where, differentiators, and history within policy and character limits.
- [ ] **GBP-26** Description avoids links, promotions, unsupported superlatives, keyword stuffing, and stale facts.
- [ ] **GBP-27** All relevant category-dependent attributes are complete and accurate.
- [ ] **GBP-28** Accessibility, identity, amenities, payment, service-option, and planning attributes are truthful.
- [ ] **GBP-29** Services are complete, correctly grouped, clearly named, accurately described, and priced when useful.
- [ ] **GBP-30** Products are complete, current, visually strong, and compliant when the feature is relevant.
- [ ] **GBP-31** Menu URL and menu content are complete, first-party, current, and policy-compliant when relevant.
- [ ] **GBP-32** Booking, ordering, reservation, and quote providers are approved and lead to functioning flows.
- [ ] **GBP-33** Social profile links are correct, active, and consistent.
- [ ] **GBP-34** Opening date, business history, and other available facts are correct.
- [ ] **GBP-35** Profile information matches the facts stated on the linked landing page.

### D. Google Business Profile media, posts, Q&A, and engagement

- [ ] **GBP-36** Logo is current, recognizable, properly cropped, and readable at thumbnail size.
- [ ] **GBP-37** Cover image is current, high quality, representative, and properly cropped across devices.
- [ ] **GBP-38** Exterior photos make the location recognizable from the street or approach.
- [ ] **GBP-39** Interior photos set accurate expectations.
- [ ] **GBP-40** Team-at-work photos demonstrate real people and service delivery.
- [ ] **GBP-41** Product/service/result photos cover the business's priority offerings.
- [ ] **GBP-42** Photos are original, sharp, well lit, on-brand, and free of misleading edits or excessive text.
- [ ] **GBP-43** Recent owner photos have been added; the visible gallery is not dominated by stale or low-quality customer media.
- [ ] **GBP-44** Videos are current, concise, useful, and compliant where the format adds value.
- [ ] **GBP-45** Inappropriate or irrelevant user photos are documented and reported through the proper process.
- [ ] **GBP-46** A sustainable photo/video capture plan exists by subject, owner, cadence, and consent requirement.
- [ ] **GBP-47** Posts are recent and useful rather than published only for frequency.
- [ ] **GBP-48** Post topics cover services, proof, education, updates, events, and offers as appropriate.
- [ ] **GBP-49** Post copy, imagery, dates, offer terms, and calls to action are accurate and compliant.
- [ ] **GBP-50** Post links work and use consistent UTM campaign naming.
- [ ] **GBP-51** Public Q&A contains no unanswered high-value question or damaging misinformation.
- [ ] **GBP-52** Answers are accurate, helpful, concise, policy-compliant, and consistent with the website.
- [ ] **GBP-53** Messaging or other available contact features are enabled only if the business can meet response expectations.

### E. Reviews and reputation

- [ ] **REP-01** Overall Google rating and total review count are recorded.
- [ ] **REP-02** Review count, rating, recency, and velocity are compared with 3–5 actual local competitors.
- [ ] **REP-03** Rating distribution is reviewed; recurring one-, two-, and three-star themes are categorized.
- [ ] **REP-04** Reviews naturally mention priority services, outcomes, staff, neighborhoods, and differentiators.
- [ ] **REP-05** Recent-review cadence is steady enough to represent the current business.
- [ ] **REP-06** Owner response rate and median response time are measured.
- [ ] **REP-07** Positive replies are specific, human, concise, and varied rather than copied templates.
- [ ] **REP-08** Negative replies are calm, privacy-safe, non-defensive, and move resolution to an appropriate channel.
- [ ] **REP-09** Responses do not reveal protected customer, patient, financial, or case information.
- [ ] **REP-10** A documented review-request trigger exists after genuine customer experiences.
- [ ] **REP-11** Staff have a short, usable email/SMS/QR review-request process.
- [ ] **REP-12** Review requests do not offer incentives, filter customers, require a positive review, or engage in review gating.
- [ ] **REP-13** Staff and vendor reviews are handled in line with platform policies and disclosure rules.
- [ ] **REP-14** Suspected fake reviews are documented and escalated through official channels; threats or public arguments are avoided.
- [ ] **REP-15** Important non-Google review platforms for the industry are claimed and monitored.
- [ ] **REP-16** Ratings and business facts are reasonably consistent across major review platforms.
- [ ] **REP-17** On-site testimonials are genuine, attributable with permission, specific, and linked/cited where appropriate.
- [ ] **REP-18** Testimonials and review markup do not misrepresent third-party reviews or violate structured-data policies.
- [ ] **REP-19** Reputation insights are routed back into operational fixes, FAQs, service content, and staff coaching.
- [ ] **REP-20** A review-response owner, escalation path, and response-time target are assigned.

### F. Citations, listings, and local ecosystem

- [ ] **CIT-01** Business name, address, phone, domain, and hours are accurate on Apple Business Connect/Maps.
- [ ] **CIT-02** The same core facts are accurate on Bing Places and other major map/navigation ecosystems.
- [ ] **CIT-03** Core data is accurate on major general directories relevant to the country.
- [ ] **CIT-04** High-value industry directories are claimed, complete, and accurate.
- [ ] **CIT-05** Local chamber, tourism, downtown association, municipality, neighborhood, and trade-body listings are evaluated.
- [ ] **CIT-06** Data aggregators relevant to the market contain the correct source-of-truth data.
- [ ] **CIT-07** Duplicate, closed, and old-location listings are identified.
- [ ] **CIT-08** Old phone numbers, domains, names, and addresses are corrected or merged where possible.
- [ ] **CIT-09** Each location has its own correct landing page and listing data.
- [ ] **CIT-10** Categories and descriptions are accurate on the platforms that materially affect discovery.
- [ ] **CIT-11** Directory links resolve, use HTTPS, and do not point through broken or unnecessary redirects.
- [ ] **CIT-12** A citation-change log records submission date, login/owner, status, and confirmation.
- [ ] **CIT-13** Listing-management vendors do not hold the business's data or access hostage.
- [ ] **CIT-14** Spammy, irrelevant, or paid directory schemes are excluded from recommendations.

### G. Local search visibility and competitive position

- [ ] **LOC-01** Priority query set includes branded, category, service, product, problem, “near me,” city, and neighborhood intent.
- [ ] **LOC-02** Queries are mapped to business value, intent, location, and the correct landing page.
- [ ] **LOC-03** Current organic and Map Pack positions are captured from representative locations.
- [ ] **LOC-04** A geo-grid covers the real market rather than only the business address.
- [ ] **LOC-05** Mobile and desktop results are checked where behavior differs.
- [ ] **LOC-06** Branded SERP is accurate and controlled: website, GBP, social profiles, reviews, images, and sitelinks.
- [ ] **LOC-07** Non-branded visibility is measured separately from branded demand.
- [ ] **LOC-08** Local share of voice is calculated for priority terms when tooling permits.
- [ ] **LOC-09** Search features are recorded: Map Pack, local finder, organic results, images, video, forums, ads, and AI answers.
- [ ] **LOC-10** True search competitors are identified per query and location.
- [ ] **LOC-11** Competitor category, review, media, service, page, schema, citation, backlink, and conversion advantages are documented.
- [ ] **LOC-12** Proximity limitations are distinguished from fixable relevance and prominence gaps.
- [ ] **LOC-13** Spam competitors and policy violations are documented factually; reporting is recommended only when evidence is strong.
- [ ] **LOC-14** Baseline date, coordinates/location, personalization state, and tool/method are stored for repeatability.
- [ ] **LOC-15** Rankings are interpreted alongside impressions, actions, leads, and revenue rather than as the sole outcome.

### H. Website crawlability, indexation, and technical health

- [ ] **TECH-01** Preferred HTTPS host resolves and loads successfully.
- [ ] **TECH-02** HTTP, `www`, non-`www`, trailing-slash, and case variants consolidate in a deliberate redirect pattern.
- [ ] **TECH-03** TLS certificate is valid; there is no mixed content or browser security warning.
- [ ] **TECH-04** Important pages return the intended 200 status; redirects, 404s, soft 404s, and 5xx errors are documented.
- [ ] **TECH-05** Redirect chains and loops do not impede users or crawlers.
- [ ] **TECH-06** `robots.txt` exists, is valid, references the sitemap where useful, and does not block important pages/resources.
- [ ] **TECH-07** Important pages are not accidentally `noindex`, `nofollow`, login-gated, or blocked by a CDN/WAF.
- [ ] **TECH-08** XML sitemap exists, loads, and contains only canonical, indexable, current URLs.
- [ ] **TECH-09** Sitemap is submitted and processed in Google Search Console and Bing Webmaster Tools.
- [ ] **TECH-10** Canonical tags are present where needed and point to the correct indexable URLs.
- [ ] **TECH-11** Canonicals, redirects, internal links, sitemap URLs, and preferred protocol/host agree.
- [ ] **TECH-12** Google and Bing index checks show the intended important pages and no obvious index bloat.
- [ ] **TECH-13** Google URL Inspection confirms that priority pages are crawlable, rendered, and indexed or eligible.
- [ ] **TECH-14** Bing URL Inspection/Site Explorer confirms crawl and index status for priority pages.
- [ ] **TECH-15** JavaScript-rendered content and links are visible to crawlers and available in the DOM.
- [ ] **TECH-16** Important pages use crawlable HTML links rather than only scripted controls.
- [ ] **TECH-17** No important page is orphaned or buried unnecessarily deep.
- [ ] **TECH-18** Broken internal and outbound links are fixed.
- [ ] **TECH-19** Duplicate, parameter, filter, print, staging, and test URLs are controlled.
- [ ] **TECH-20** Staging, development, preview, and admin areas are not indexed.
- [ ] **TECH-21** Domain migrations and changed URLs have page-to-page redirects and no major signal loss.
- [ ] **TECH-22** Mobile and desktop serve equivalent primary content, metadata, schema, and directives.
- [ ] **TECH-23** International/language versions use correct, reciprocal `hreflang` only when applicable.
- [ ] **TECH-24** Server uptime, DNS, CDN, and hosting reliability are adequate for customers and crawlers.
- [ ] **TECH-25** Search Console manual actions, security issues, and indexing anomalies are checked.
- [ ] **TECH-26** Bing Site Scan or an equivalent crawl has no unresolved critical indexability error.

### I. Site architecture and local landing pages

- [ ] **ARCH-01** Navigation makes the main services, locations, proof, about, and contact paths obvious.
- [ ] **ARCH-02** Information architecture reflects how customers search and decide, not internal jargon.
- [ ] **ARCH-03** Each strategically important service has a useful dedicated page when warranted.
- [ ] **ARCH-04** Each legitimate staffed location has a unique, useful landing page.
- [ ] **ARCH-05** Location pages include unique local facts, staff, service details, proof, directions, hours, contact details, and FAQs where relevant.
- [ ] **ARCH-06** Service-area pages provide genuine local value and are not thin city-name swaps or doorway pages.
- [ ] **ARCH-07** Pages for combinations of service and location exist only when there is distinct value and demand.
- [ ] **ARCH-08** The homepage clearly routes visitors to priority services and areas.
- [ ] **ARCH-09** Related services, locations, case studies, FAQs, and articles use contextual internal links.
- [ ] **ARCH-10** Anchor text is descriptive and natural.
- [ ] **ARCH-11** Breadcrumbs clarify hierarchy on deeper sites and are consistent with canonical structure.
- [ ] **ARCH-12** Header and footer links are useful without becoming a keyword-stuffed sitewide list.
- [ ] **ARCH-13** URL slugs are stable, concise, readable, and descriptive.
- [ ] **ARCH-14** Thin, overlapping, cannibalizing, or obsolete pages are consolidated or improved.
- [ ] **ARCH-15** High-value pages are reachable within a sensible number of clicks.

### J. On-page search relevance and content quality

- [ ] **ONP-01** Every indexable page has a unique, concise, descriptive title.
- [ ] **ONP-02** Priority titles accurately combine topic, local relevance where useful, and brand without stuffing.
- [ ] **ONP-03** Each important page has a unique, useful meta description aligned to intent and action.
- [ ] **ONP-04** Each page has one clear primary heading that matches its subject.
- [ ] **ONP-05** Heading hierarchy is logical and not used merely for visual styling.
- [ ] **ONP-06** Opening copy quickly states the service/product, customer, area, and benefit.
- [ ] **ONP-07** Content fully answers the searcher's practical questions before unnecessary company background.
- [ ] **ONP-08** Copy is original, specific, readable, and demonstrates first-hand business knowledge.
- [ ] **ONP-09** Priority services explain scope, process, deliverables, timeframes, service area, and next step.
- [ ] **ONP-10** Pricing, minimums, estimates, financing, or a clear explanation of price variables is provided where commercially appropriate.
- [ ] **ONP-11** Important customer objections and eligibility constraints are addressed.
- [ ] **ONP-12** FAQs are based on real customer questions, visible on the page, and not filler written only for search engines.
- [ ] **ONP-13** Local references are factual and useful rather than repetitive city-name insertion.
- [ ] **ONP-14** Business name, address/service-area statement, phone, hours, and contact options are easy to find and consistent.
- [ ] **ONP-15** About content identifies real owners/team, experience, story, values, and local connection.
- [ ] **ONP-16** Licenses, certifications, memberships, awards, warranties, insurance, and guarantees are current and verifiable.
- [ ] **ONP-17** Authors and reviewers are identified on advice-heavy or trust-sensitive content where appropriate.
- [ ] **ONP-18** Case studies show a real problem, work performed, result, location/context, visuals, and permission.
- [ ] **ONP-19** Claims are supported by evidence; unverifiable “best,” “#1,” or guaranteed-outcome language is removed.
- [ ] **ONP-20** Dates are displayed only when meaningful and are updated when the underlying content is reviewed.
- [ ] **ONP-21** Stale promotions, staff, inventory, services, locations, hours, and policies are corrected.
- [ ] **ONP-22** Grammar, spelling, tone, formatting, and brand terminology are consistent.
- [ ] **ONP-23** Images are relevant and placed near the copy they support.
- [ ] **ONP-24** Image filenames and alternative text are descriptive where appropriate and never stuffed.
- [ ] **ONP-25** Duplicate manufacturer, franchise, vendor, or AI-generated boilerplate is rewritten with useful first-party detail.
- [ ] **ONP-26** Content gaps are prioritized using customer questions, query data, sales calls, reviews, and competitor gaps.
- [ ] **ONP-27** A realistic editorial owner, update cadence, and quality-review process exist.

### K. Structured data and machine-readable identity

- [ ] **SCH-01** JSON-LD is valid, parsable, and consistent with visible page content.
- [ ] **SCH-02** The most specific appropriate `LocalBusiness` subtype is used on the relevant location/business page.
- [ ] **SCH-03** Each real location is represented as its own entity where applicable.
- [ ] **SCH-04** Business `name`, `url`, `telephone`, `image/logo`, `address`, and `priceRange` are accurate when used.
- [ ] **SCH-05** `openingHoursSpecification`, special hours handling, `geo`, and `areaServed` are accurate when used.
- [ ] **SCH-06** `sameAs` links point to authoritative profiles for the same entity, not every directory listing.
- [ ] **SCH-07** Organization/local-business identifiers are consistent across pages and connected with stable `@id` values where useful.
- [ ] **SCH-08** `Service`, `Product`, `Offer`, menu, or booking markup is used only when accurate and supported by page content.
- [ ] **SCH-09** Breadcrumb markup matches visible navigation and page hierarchy.
- [ ] **SCH-10** Article, profile/person, video, event, job, or other page-specific markup is used only on eligible content.
- [ ] **SCH-11** FAQ markup, if present, reflects visible content and current search-engine eligibility rules; it is not treated as a ranking guarantee.
- [ ] **SCH-12** Third-party reviews are not falsely marked up as first-party aggregate ratings.
- [ ] **SCH-13** Required/recommended fields and errors are checked with Google Rich Results Test and Schema Markup Validator.
- [ ] **SCH-14** Structured data contains no hidden, misleading, stale, contradictory, or fabricated fact.
- [ ] **SCH-15** Schema is revalidated after template, CMS, plugin, or business-data changes.

### L. Mobile experience, accessibility, and conversion

- [ ] **UX-01** Site is usable at common mobile widths without horizontal scrolling, overlap, clipping, or unreadable text.
- [ ] **UX-02** The first mobile screen states what the business does, where it serves, why it is credible, and what to do next.
- [ ] **UX-03** Primary call to action matches the customer's intent: call, quote, book, order, reserve, visit, or buy.
- [ ] **UX-04** Phone numbers are tap-to-call and use the correct number.
- [ ] **UX-05** Address/directions links open the correct map location.
- [ ] **UX-06** Hours and current open/closed expectations are easy to find.
- [ ] **UX-07** Forms request only necessary information and work on mobile.
- [ ] **UX-08** Form labels, required states, validation, error recovery, spam protection, and success confirmation work.
- [ ] **UX-09** Form submissions reach the correct recipient/CRM and trigger the expected follow-up.
- [ ] **UX-10** Booking, ordering, checkout, estimate, upload, and payment flows are completed end to end.
- [ ] **UX-11** Calls to action remain visible and clear without creating an intrusive experience.
- [ ] **UX-12** Each landing page offers a logical next step and avoids competing primary actions.
- [ ] **UX-13** Trust evidence appears near decision points: reviews, credentials, guarantees, real photos, policies, or case results.
- [ ] **UX-14** Navigation, back behavior, search, and menus work with touch and keyboard.
- [ ] **UX-15** Focus indicators are visible and focus order is logical.
- [ ] **UX-16** Text and interactive-control contrast are readable.
- [ ] **UX-17** Images conveying information have useful alt text; decorative images are ignored appropriately.
- [ ] **UX-18** Form controls, buttons, menus, and icons have accessible names and states.
- [ ] **UX-19** Headings, landmarks, lists, tables, and links use semantic HTML.
- [ ] **UX-20** Videos have captions/transcripts where needed and do not autoplay disruptively.
- [ ] **UX-21** Tap targets, spacing, zoom, orientation, and reduced-motion behavior support real users.
- [ ] **UX-22** Popups, cookie prompts, and chat widgets do not block primary content or actions.
- [ ] **UX-23** Confirmation pages explain what happens next and set a response-time expectation.
- [ ] **UX-24** Contact email, phone, chat, and SMS options are monitored during the hours claimed.
- [ ] **UX-25** Lead-response time and missed-call handling are tested or documented.
- [ ] **UX-26** A/B or conversion tests have a hypothesis, primary metric, sufficient duration, and no harmful flicker or tracking gap.

### M. Performance, resilience, privacy, and security

- [ ] **PERF-01** Field Core Web Vitals are reviewed by page type when sufficient CrUX/Search Console data exists.
- [ ] **PERF-02** Lab tests are run on representative mobile and desktop pages with results kept separate from field data.
- [ ] **PERF-03** Largest Contentful Paint is within the current “good” threshold or has a documented remediation plan.
- [ ] **PERF-04** Interaction to Next Paint is within the current “good” threshold or has a documented remediation plan.
- [ ] **PERF-05** Cumulative Layout Shift is within the current “good” threshold or has a documented remediation plan.
- [ ] **PERF-06** Server response, caching, compression, CDN use, and connection overhead are appropriate.
- [ ] **PERF-07** Hero and content images are correctly sized, compressed, responsive, and served in appropriate formats.
- [ ] **PERF-08** Below-the-fold media is lazy-loaded without delaying primary content.
- [ ] **PERF-09** Fonts are limited, optimized, preloaded only when justified, and do not create excessive layout shift.
- [ ] **PERF-10** Render-blocking CSS, unused code, large JavaScript, and third-party scripts are controlled.
- [ ] **PERF-11** Maps, chat, analytics, video, booking, and review widgets do not overwhelm performance or accessibility.
- [ ] **PERF-12** Broken assets, console errors, and failed network requests do not affect key flows.
- [ ] **PERF-13** HTTPS is enforced and forms do not transmit sensitive information insecurely.
- [ ] **PERF-14** CMS, plugins, themes, dependencies, and server runtime are supported and patched.
- [ ] **PERF-15** Admin access uses least privilege and multi-factor authentication where supported.
- [ ] **PERF-16** Backups and restore procedures exist and have an accountable owner.
- [ ] **PERF-17** Malware, injected spam, unwanted redirects, and hacked-page indexation are checked.
- [ ] **PERF-18** Security headers and content restrictions are reviewed in proportion to the site's risk.
- [ ] **PERF-19** Privacy policy accurately describes collected data, vendors, cookies, retention, and contact options.
- [ ] **PERF-20** Consent behavior meets applicable law and does not falsely imply that essential and advertising cookies are the same.
- [ ] **PERF-21** Terms, refund/cancellation, shipping, accessibility, medical/legal/financial, and other required policies are present when applicable.
- [ ] **PERF-22** Sensitive form data is minimized and routed only to approved systems.

### N. Conversion messaging, brand, and media

- [ ] **BRAND-01** Value proposition is specific to the customer, problem, outcome, and market.
- [ ] **BRAND-02** Differentiators are concrete and provable rather than generic claims such as quality and service.
- [ ] **BRAND-03** Brand name, logo, colors, typography, tone, and imagery are recognizable across website, GBP, directories, and social channels.
- [ ] **BRAND-04** Core offer and terminology are consistent across all major touchpoints.
- [ ] **BRAND-05** Real business, team, location, process, products, and results are visually represented.
- [ ] **BRAND-06** Stock and AI-generated media do not create a misleading picture of the real business.
- [ ] **BRAND-07** Photo set covers exterior, interior, people, process, products/services, outcomes, and community context as relevant.
- [ ] **BRAND-08** Customer/media releases and minors/privacy considerations are handled.
- [ ] **BRAND-09** Videos answer high-intent questions or demonstrate the experience, not merely add decoration.
- [ ] **BRAND-10** Social proof is current, relevant to the page, and placed near the claim it supports.
- [ ] **BRAND-11** Guarantees, discounts, urgency, scarcity, and comparative claims are accurate and include necessary terms.
- [ ] **BRAND-12** Contact and follow-up expectations match actual operational capacity.

### O. Social presence and community signals

- [ ] **SOC-01** The business uses only channels that its audience and team can support.
- [ ] **SOC-02** Profiles are claimed, branded, complete, and linked to the correct canonical website.
- [ ] **SOC-03** Name, location, phone, hours, service description, and profile links are accurate.
- [ ] **SOC-04** GBP social links connect to the intended official profiles.
- [ ] **SOC-05** Recent content demonstrates an active, real business.
- [ ] **SOC-06** Content mix includes useful education, people/process, proof, offers/events, and community participation.
- [ ] **SOC-07** Comments, messages, tags, and customer service issues have an owner and response target.
- [ ] **SOC-08** Link tracking distinguishes channels and campaigns.
- [ ] **SOC-09** Social accounts do not contain abandoned duplicates, compromised access, or former staff as sole owners.
- [ ] **SOC-10** Local partnerships, sponsorships, events, associations, and community activity create genuine mentions and relationships.
- [ ] **SOC-11** Unlinked brand mentions and inaccurate public facts are monitored.
- [ ] **SOC-12** Social metrics are tied to leads, bookings, visits, and assisted conversions rather than follower count alone.

### P. Authority, links, and third-party corroboration

- [ ] **AUTH-01** Referring domains and important backlinks are reviewed for relevance, quality, locality, and destination.
- [ ] **AUTH-02** Links to broken, redirected, or obsolete pages are reclaimed where worthwhile.
- [ ] **AUTH-03** Spammy or manipulative link-building is not part of the plan.
- [ ] **AUTH-04** Supplier, partner, association, alumni, chamber, event, sponsorship, and local-media opportunities are documented.
- [ ] **AUTH-05** The business has third-party mentions that corroborate its name, location, services, people, and expertise.
- [ ] **AUTH-06** Press claims, awards, memberships, and certifications link to or can be verified from authoritative sources.
- [ ] **AUTH-07** Important team members have accurate professional biographies on relevant trusted platforms.
- [ ] **AUTH-08** High-value competitors' strongest legitimate local links and mentions are compared.
- [ ] **AUTH-09** Link growth is evaluated by quality and relevance, not raw volume.
- [ ] **AUTH-10** Partnerships and community work are recommended for real business value first, with visibility as a secondary benefit.

### Q. AI visibility, answer-engine access, and entity clarity

- [ ] **AI-01** OAI-SearchBot is not unintentionally blocked from public pages intended for ChatGPT search discovery.
- [ ] **AI-02** Bingbot can crawl public priority pages intended for Bing/Copilot visibility.
- [ ] **AI-03** Googlebot can crawl and index priority pages that may support Google search and AI experiences.
- [ ] **AI-04** Other relevant AI/search crawlers are intentionally allowed or blocked according to the owner's documented policy.
- [ ] **AI-05** Crawler access is tested beyond `robots.txt`; CDN, WAF, bot protection, CAPTCHAs, JavaScript challenges, login, and geo rules do not unintentionally block intended access.
- [ ] **AI-06** Search/index status in Google and Bing is healthy because AI visibility depends heavily on ordinary discovery and indexing.
- [ ] **AI-07** XML sitemap contains canonical priority URLs and accurate freshness signals.
- [ ] **AI-08** IndexNow is considered for sites whose important URLs change frequently; submissions reflect real additions, updates, and deletions.
- [ ] **AI-09** The site uses crawlable internal links and descriptive anchor text.
- [ ] **AI-10** Duplicate URLs and contradictory versions of facts are consolidated.
- [ ] **AI-11** Each page is understandable in semantic HTML without depending on a screenshot, canvas, decorative CSS, or inaccessible interaction.
- [ ] **AI-12** Buttons, menus, forms, booking flows, and other controls have descriptive accessible names, roles, and states.
- [ ] **AI-13** The business is unambiguously identified by name, business type, location/service area, contact details, and canonical URL.
- [ ] **AI-14** Organization and LocalBusiness schema reinforce the same visible facts and stable entity identity.
- [ ] **AI-15** `sameAs` connections point to authoritative profiles that clearly represent the same business.
- [ ] **AI-16** First-party facts are corroborated by GBP, maps, directories, associations, media, review platforms, and other credible independent sources.
- [ ] **AI-17** Old or contradictory entity facts are found through exact-name, address, phone, domain, and former-name searches.
- [ ] **AI-18** Priority service pages clearly state who the service is for, what is included, where it is available, how it works, and how to act.
- [ ] **AI-19** Important facts appear in plain text near clear headings rather than only in images, PDFs, video, or widgets.
- [ ] **AI-20** Pages use concise answer-first passages, lists, tables, definitions, comparisons, and steps where those formats genuinely help users.
- [ ] **AI-21** Customer questions are answered explicitly and factually, including limitations and exceptions.
- [ ] **AI-22** Prices, ranges, minimums, hours, availability, coverage, policies, credentials, and dates are explicit when the business can publish them.
- [ ] **AI-23** Claims include primary evidence, methodology, examples, sources, or verifiable credentials when appropriate.
- [ ] **AI-24** Authors, reviewers, business owners, and experts are clearly identified where their expertise matters.
- [ ] **AI-25** Content demonstrates first-hand experience through original examples, photos, case studies, data, and customer outcomes.
- [ ] **AI-26** Updates correct the visible copy, schema, feeds, directory listings, and sitemaps together.
- [ ] **AI-27** Important content has a meaningful published/updated date when freshness affects the answer.
- [ ] **AI-28** Content is written for customers, not mass-produced as thin pages intended only to trigger AI citations.
- [ ] **AI-29** FAQ, comparison, and alternatives content is fair, useful, specific, and avoids fabricated competitor claims.
- [ ] **AI-30** PDFs, menus, catalogs, and price sheets have equivalent accessible web content when the information is important for discovery.
- [ ] **AI-31** Optional `llms.txt` use, if any, is documented as experimental and is not treated as a substitute for crawlability, indexing, content, or authority.
- [ ] **AI-32** Branded factual prompts test whether systems know the correct name, address/service area, phone, hours, services, owner, and differentiators.
- [ ] **AI-33** Category/recommendation prompts test whether the business appears for high-value local use cases.
- [ ] **AI-34** Problem/solution prompts test visibility before the user knows which service or provider they need.
- [ ] **AI-35** Comparison prompts test which competitors are mentioned and the sources used.
- [ ] **AI-36** Citation/source prompts record whether the website or a correct third-party profile is cited.
- [ ] **AI-37** Answers are checked for hallucinated services, locations, prices, hours, credentials, policies, and sentiment.
- [ ] **AI-38** Prompt tests use consistent wording, date, platform/model, location context, and fresh-session conditions.
- [ ] **AI-39** AI mention rate, recommendation rate, factual-accuracy rate, citation rate, owned-site citation rate, and competitor share of voice are tracked as directional samples.
- [ ] **AI-40** ChatGPT referral traffic is tracked in analytics, including `utm_source=chatgpt.com` where present.
- [ ] **AI-41** Referrals from Bing/Copilot, Perplexity, Gemini/Google, and other relevant assistants are monitored with channel definitions that can be updated.
- [ ] **AI-42** AI traffic is evaluated by engagement and conversions, not visits alone.
- [ ] **AI-43** No one promises inclusion, citation, recommendation, or a fixed “AI ranking.”
- [ ] **AI-44** Quarterly AI benchmark changes are connected to specific content, entity, citation, and authority work without claiming unsupported causation.

### R. Analytics, attribution, and reporting

- [ ] **MEAS-01** Google Search Console is verified for the correct canonical property and all necessary owners are current.
- [ ] **MEAS-02** Bing Webmaster Tools is verified and configured.
- [ ] **MEAS-03** GA4 property, web stream, timezone, currency, internal traffic, referrals, and data retention are correct.
- [ ] **MEAS-04** Tag manager and analytics code fire once and do not create duplicate page views or events.
- [ ] **MEAS-05** Consent behavior and analytics collection match the documented privacy approach.
- [ ] **MEAS-06** Primary conversions are defined: qualified call, form, booking, order, direction request, message, or other real business outcome.
- [ ] **MEAS-07** Form success is measured on confirmed submission rather than button click alone.
- [ ] **MEAS-08** Tap-to-call and phone-link clicks are tracked; call quality is measured when call tracking is available and lawful.
- [ ] **MEAS-09** Booking, ecommerce, quote, and third-party checkout flows preserve attribution where technically possible.
- [ ] **MEAS-10** GBP website, appointment, menu, post, product, and campaign links use a consistent UTM convention.
- [ ] **MEAS-11** Call-tracking numbers are implemented without corrupting the canonical business phone across citations.
- [ ] **MEAS-12** Thank-you pages are not indexable when they expose lead/customer details or inflate conversions.
- [ ] **MEAS-13** Spam, test leads, employee activity, and bot traffic are identified and handled appropriately.
- [ ] **MEAS-14** Search Console queries/pages are segmented by brand, service, location, and intent.
- [ ] **MEAS-15** GBP Performance metrics and available calls, messages, bookings, directions, and website actions are baselined.
- [ ] **MEAS-16** Leads are connected to source, service, location, quality, outcome, and revenue when the business can support it.
- [ ] **MEAS-17** CRM status definitions and offline conversion feedback are consistent.
- [ ] **MEAS-18** Reporting distinguishes leading indicators from business outcomes.
- [ ] **MEAS-19** Reports compare like periods and annotate seasonality, outages, campaigns, site changes, and profile changes.
- [ ] **MEAS-20** The dashboard contains an owner, review cadence, data caveats, and next actions—not just charts.

### S. Maintenance and governance

- [ ] **OPS-01** One accountable owner is assigned for website facts, GBP, reviews, directories, social profiles, and analytics.
- [ ] **OPS-02** Credentials are stored securely; agency and vendor access is revocable.
- [ ] **OPS-03** Name, address, phone, hours, services, staff, and policy changes follow a cross-channel update checklist.
- [ ] **OPS-04** Holiday hours are scheduled ahead of time across GBP, website, booking, phone, and relevant directories.
- [ ] **OPS-05** Review, Q&A, message, lead, and social response service levels are documented.
- [ ] **OPS-06** Monthly checks cover GBP edits, reviews, photos, posts, rankings, citations, forms, tracking, and search-console alerts.
- [ ] **OPS-07** Quarterly checks cover competitors, service/location content, schema, technical crawl, backlinks/mentions, and AI benchmark prompts.
- [ ] **OPS-08** Annual checks cover strategy, audience, profitability, brand, media library, accessibility, privacy, and vendor access.
- [ ] **OPS-09** Material edits, approvals, release dates, and verification evidence are logged.
- [ ] **OPS-10** The business can retain its profiles, content, analytics history, and access if it changes vendors.

## 4. Standard AI prompt set

Customize the bracketed fields, preserve the final wording for recurring comparisons, and never instruct the system to mention the business.

### Branded factual prompts

1. “What does [Business Name] in [City] do?”
2. “Where is [Business Name], when is it open, and how can I contact it?”
3. “What services does [Business Name] offer in [Service Area]?”
4. “Is [Business Name] a good fit for [specific customer need]?”

### Discovery and recommendation prompts

5. “Who are reputable [category] businesses serving [City/Neighborhood]?”
6. “What are the best options for [specific service] near [place]?”
7. “I need [problem/outcome] in [location]. What kind of provider should I hire, and which local businesses should I consider?”
8. “Which [category] in [location] offers [important differentiator]?”

### Comparison and trust prompts

9. “Compare local options for [service] in [location]. What evidence should I use to choose?”
10. “What is known about the reputation, experience, and specialties of [Business Name]?”
11. “How does [Business Name] compare with [actual competitor] for [specific need]?”
12. “What sources support the information about [Business Name]?”

### Accuracy checklist for each answer

- Business mentioned: yes/no
- Recommended: yes/no/neutral
- Correct business identity: yes/no
- Correct category and services: yes/no
- Correct location/service area: yes/no
- Correct hours/contact details: yes/no
- Unsupported or false claim: yes/no, with exact text
- Owned website cited: yes/no
- Correct third-party source cited: yes/no
- Competitors mentioned: list
- Overall sentiment: positive/neutral/negative
- Action required: list

## 5. Recurring audit cadence

### Monthly

- GBP unauthorized edits, completeness, photos, posts, Q&A, products/services, links, and actions
- Review volume, recency, themes, response rate, and response time
- Priority local rankings and Map Pack geo-grid
- GSC clicks, impressions, queries, pages, coverage/security alerts
- Leads and conversion-path health
- Broken forms, booking, calls, and key links
- Citation issues found through monitoring
- AI referrals and a small fixed prompt sample

### Quarterly

- Full competitor benchmark
- Technical crawl and structured-data validation
- Service, location, case-study, and FAQ gaps
- Core Web Vitals and top landing-page conversion review
- Link, mention, directory, and community opportunities
- Full AI prompt set across selected platforms
- Accuracy/corroboration check across website, GBP, directories, and AI answers
- Strategy review with completed work, results, limitations, and next priorities

### Annually or after a material business change

- Eligibility and location/profile architecture
- Brand, offer, audience, and conversion strategy
- Full accessibility, privacy, security, and vendor-access review
- New photography/video plan
- Data-source-of-truth review
- Rebaseline scores and retire criteria that are no longer relevant

## 6. Wolin service mapping

| Wolin offer | Audit areas that naturally feed it |
| --- | --- |
| Starter | Identity/eligibility, GBP ownership and completeness, media/posts, review process, basic local ranking baseline |
| Growth | Everything in Starter plus citations, on-page SEO, mobile/conversion, GSC/GA4, content improvements, monthly reporting |
| Authority | Everything in Growth plus technical SEO, architecture, service/location/authority pages, internal linking, schema, competitor tracking, AI visibility, and quarterly strategy |
| Custom website | Architecture, on-page content, UX/conversion, accessibility, performance, security, measurement |
| SEO optimization | Technical SEO, local pages, on-page relevance, structured data, internal linking, authority, measurement |
| AI visibility improvement | Crawler access, entity clarity, content extractability, corroboration, prompt testing, referrals, monitoring |
| Social media presence | Profile accuracy, content operations, community signals, response process, attribution |
| Business photos/video | GBP media coverage, site proof, social assets, consent, accessibility, performance |

## 7. Source and policy references

Recheck these before changing audit rules because platform features and policies change.

- Google Business Profile representation guidelines: https://support.google.com/business/answer/3038177
- Google Business Profile editing and field guidance: https://support.google.com/business/answer/3039617
- Google review guidance and incentive prohibition: https://support.google.com/business/answer/3474122
- Google Business Profile third-party policies: https://support.google.com/business/answer/7353941
- Google Search developer guide: https://developers.google.com/search/docs/fundamentals/get-started-developers
- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google LocalBusiness structured data: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google Search Console and Analytics guidance: https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console
- OpenAI publisher and crawler guidance: https://help.openai.com/en/articles/12627856
- Bing Webmaster Guidelines for search and AI experiences: https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a
- Bing Site Scan: https://www.bing.com/webmasters/help/site-scan-623520c9
- Bing IndexNow: https://www.bing.com/webmasters/help/indexnow-0z209wby
