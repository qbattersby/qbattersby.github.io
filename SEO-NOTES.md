# SEO Notes — qbattersby.com

This file documents the SEO work completed in-repo and the manual, off-repo
steps that only you can do (DNS, Google Business Profile, Search Console).

Primary domain decision: **qbattersby.com** is the single canonical site.
`battersby.ca` should 301-redirect to it (see step 1).

---

## What changed in this repo (already done)

- **7 location pages** built as clean-URL folders, each with unique local
  content, WordPress-led H1, per-page schema (WebPage + BreadcrumbList +
  FAQPage referencing the shared LocalBusiness), localized contact form, and
  the shared footer:
  - `/kitchener-web-developer/`
  - `/waterloo-web-developer/`
  - `/cambridge-web-developer/`
  - `/norfolk-county-web-developer/` (hub for the south)
  - `/simcoe-web-developer/`
  - `/delhi-web-developer/`
  - `/tillsonburg-web-developer/`
- **Homepage**: added a Service Areas link block, a site-wide footer linking
  all 7 areas, added Tillsonburg to `areaServed` schema, wove in Tillsonburg +
  "web design" phrasing.
- **Site-wide footer** added to home, 404, thank-you, and all 7 pages
  (internal-linking backbone).
- **3 new projects** added to the work grid: Encircle, RWDI, Monarch Quantum
  (screenshots captured + processed to png/webp at 800x600, top-anchored).
- **Work thumbnail fix**: `object-position: top center` so site logos in the
  top-left of screenshots are no longer cropped off.
- **sitemap.xml**: now lists all 8 URLs (home + 7 pages).
- **Analytics cleanup**: removed dead Universal Analytics (`UA-12843625-1`,
  shut down by Google in 2023) from home, 404, thank-you. GTM (`GTM-T897BK`)
  and Mixpanel remain.
- **Bug fix**: removed premature/mislabeled `mixpanel.track("404 Page Hit")`
  that ran before Mixpanel loaded on thank-you.html (and the duplicate on
  404.html). Tracking now fires after init.

### Rebuilding CSS
The SCSS build needed the macOS x64 Sass binary in this environment:
```
npm install sass-embedded-darwin-x64 --no-save
npx gulp sass
```
(If you build on Apple Silicon natively, the bundled arm64 binary works and
this is unnecessary.)

---

## Manual step 1 — Redirect battersby.ca -> qbattersby.com (HIGH PRIORITY)

Right now battersby.ca serves the same content but its canonical points to
qbattersby.com. That split dilutes signals. Make battersby.ca a true 301.

At your domain registrar / DNS host for **battersby.ca**:
- Use a **301 (permanent) redirect / URL forwarding**, NOT masked/iframe
  forwarding. Masking is what currently makes battersby.ca/robots.txt return
  HTML instead of the real file.
- Forward `battersby.ca` and `www.battersby.ca` -> `https://qbattersby.com`
  with path preserved if the option exists.
- If your host only offers masked forwarding, instead point battersby.ca at
  the same GitHub Pages site and rely on the canonical tags (already correct),
  but a real 301 is strongly preferred.

Verify after propagation:
```
curl -sI https://battersby.ca/ | grep -i location
```
Should show `location: https://qbattersby.com/`.

---

## Manual step 2 — Google Business Profile (HIGH PRIORITY for local)

A verified Google Business Profile is the single biggest lever for "web
developer near me" type searches.

- Create/claim at https://business.google.com
- Business name: **Quinn Battersby Web Development**
- Category: primary **Website designer**; add **Web developer** as secondary.
- Service-area business (you work from Delhi, serve a region): hide the street
  address and set service areas to Kitchener, Waterloo, Cambridge, Simcoe,
  Delhi, Tillsonburg, Norfolk County.
- Phone: 226-338-1659. Website: https://qbattersby.com
- Keep NAP (name, address, phone) identical to the schema in the site so the
  signals reinforce each other.
- Add photos of work, request reviews from past clients (Stryve, etc.).

## Manual step 3 — Google Search Console

- Verify the **qbattersby.com** property (Domain property via DNS TXT is best;
  it covers http/https and www).
- Submit the sitemap: `https://qbattersby.com/sitemap.xml`
- Use **URL Inspection** -> Request Indexing for each of the 7 new pages so
  they get crawled sooner.
- If battersby.ca was ever verified separately, use the **Change of Address**
  tool there once the 301 is live to pass authority to qbattersby.com.
- Watch Coverage/Pages for any "Duplicate, Google chose different canonical"
  warnings (should resolve once the 301 is in place).

## Manual step 4 — Bing Webmaster Tools

- Add qbattersby.com at https://www.bing.com/webmasters
- Import from Google Search Console (fastest) or verify directly.
- Submit the same sitemap.

## Manual step 5 — Analytics follow-up (optional but recommended)

- Confirm GTM (`GTM-T897BK`) actually contains a **GA4** tag. Universal
  Analytics is dead, so if GA4 was never set up inside GTM you currently have
  no Google analytics data. Create a GA4 property and add the GA4 Config tag in
  GTM.
- The 7 new location pages intentionally load **GTM only** (no Mixpanel) to
  keep them lean. If you want Mixpanel page tracking on them too, add the same
  Mixpanel snippet used on the homepage. Recommend doing it via a GTM custom
  HTML tag instead of hardcoding, so it stays in one place.

---

## Suggested follow-ups (not done, your call)

- Add `<link rel="alternate">` / hreflang is not needed (single language).
- Consider a short, unique testimonial per location page over time (currently
  all reuse the Stryve quote — fine to launch, better to vary later).
- Add real local photos to location pages when available.
- After the 301 is live and pages are indexed, build a couple of local
  citations/backlinks (chamber of commerce, local directories) for the Norfolk
  County pages.
- The location pages reuse existing portfolio screenshots that best fit each
  area's industry mix; swap in more locally-relevant projects as you build them.
