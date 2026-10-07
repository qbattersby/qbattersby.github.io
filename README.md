# Quinn Battersby — qbattersby.com

A static marketing and portfolio website built with Foundation, SCSS and vanilla JavaScript. Production is hosted on GitHub Pages at [qbattersby.com](https://qbattersby.com/); the Racklight preview is [qbattersby.test](https://qbattersby.test/).

Local development, publication and Google measurement are separate stages. A GitHub push does not configure Analytics events or request Google reindexing.

## Content and routes

Six canonical pages serve distinct purposes:

| Route | Purpose |
| --- | --- |
| `/` | Quinn, the business/agency offer, selected work, process and enquiries |
| `/kitchener-waterloo-website-design/` | Waterloo Region services and relevant projects |
| `/norfolk-county-website-design/` | Delhi-based services across Norfolk County and nearby Tillsonburg |
| `/custom-wordpress-development/` | Complete websites, development scope, editing and handoff |
| `/figma-to-wordpress/` | Development for agencies, designers and internal teams |
| `/wordpress-maintenance-support/` | Scoped fixes, maintenance and improvements to existing sites |

The copy is first person, separates design-and-development work from development-only credit, and explains scope before price commitments. New websites start at $2,000 + HST; agency work and existing-site improvements are quoted separately. Regional pages consolidate the earlier town pages instead of repeating city-name variations. Tillsonburg is in Oxford County, near Norfolk County.

Seven old routes remain as static redirect documents:

| Old route | Destination |
| --- | --- |
| `/kitchener-web-developer/` | `/kitchener-waterloo-website-design/` |
| `/waterloo-web-developer/` | `/kitchener-waterloo-website-design/` |
| `/cambridge-web-developer/` | `/kitchener-waterloo-website-design/` |
| `/norfolk-county-web-developer/` | `/norfolk-county-website-design/` |
| `/simcoe-web-developer/` | `/norfolk-county-website-design/` |
| `/delhi-web-developer/` | `/norfolk-county-website-design/` |
| `/tillsonburg-web-developer/` | `/norfolk-county-website-design/#nearby-communities` |

These use **zero-delay HTML meta refresh**, destination canonicals and visible fallback links because this is GitHub Pages hosting. They are **not HTTP 301 responses**. The sitemap lists only the six canonical pages. Keep old routes available when publishing; if hosting later supports server redirects, replace the documents with real permanent redirects. `thank-you.html` and `404.html` are excluded from indexing.

## Portfolio and presentation

The established design is the baseline: the large opening introduction and floating
megaphone, blue-and-white palette, original typography, animated screen below the
intro, lightning, button treatments and blue testimonial. Copy and usability
improvements should build on that theme. Use plain, professional labels such as Services, Service areas and About me.
Keep first-person copy factual; avoid slogans and repeated assurances about working
directly with Quinn. The About section should reflect the original biography.
Substantial visual redesigns or changes
to the main layout need explicit direction. Do not add decorative diagonal arrows.
The October 6 restoration retains the new copy, SEO consolidation, portfolio work
and enquiry safeguards within that original visual structure.

The homepage has 42 projects. Amplify Care and Digital Ed were already present; ten projects were added. New Nithview, Heritage Hatchery, Sunshine Montessori School and Wildfire Cuisine carry design and development credit. Other projects retain their stated roles.

- Screenshots fill a consistent 16:9 card, with details on hover, keyboard focus or touch. There is no browser-window frame or added letterboxing.
- RWDI, Siegel+Gale and Waterloo Public Library have replacement captures. Euna, Axonify and OXIO preserve earlier builds.
- OPRG and JerPro were unavailable during the audit. Daggerwing, Do Change Right and Bonfire led to replacement/merger sites. These and the three archived builds above retain images without visit buttons.
- DESCH uses the Pantheon launch-preview capture and links to `https://deschnorthamerica.com/`.
- The main gallery shuffles once per load and reveals six projects at a time. Homepage highlights independently choose one design-and-development project and two development projects from nine curated examples. The selection stays fixed while reading. All nine examples remain in the source and visible without JavaScript. The custom WordPress service page features Waterloo Public Library, DESCH North America and RWDI.
- The workspace illustration animates code, the design preview and review. The lightning treatment animates subtly. Reduced motion presents a finished still view; workspace animation pauses outside the viewport or when the document is hidden.
- Shared responsive headings, navigation, native FAQ disclosures and footer spacing live in the current SCSS. Each main footer has a contact button that opens the existing labelled dialog.
- Homepage testimonials include Sourov De, Kaleigh Bulford, Noah Jensen and Anne Marie Heinrichs. Kaleigh and Noah use excerpts. At Quinn’s request, Kaleigh’s duration advances from six years in 2024 using the existing experience counter with a 2018 start year; the remaining wording preserves her quote, without omission markers. Kaleigh’s attribution includes her role and links to Stryve Marketing without an excerpt/date note. The starting quote varies, with Previous/Next controls and no autoplay. All quotes remain available without JavaScript. Preserve the supplied attribution when editing.
- Experience is calculated as the current calendar year minus 2008 by `js/experience.js`. Visible counters use `data-experience-start` and `data-experience-template`; their source text and metadata use timeless “since 2008” wording. No start-day anniversary is assumed.
- The homepage leads with website design and development, with the custom WordPress specialty in supporting copy, metadata and service content. Ongoing support is optional and arranged separately. Portfolio items without a working destination omit the visit button and archive label.

## Local development and checks

Use Node.js 18 or later. Install the locked dependencies with `npm ci` when needed. Edit HTML and the SCSS sources, then build the generated CSS:

```sh
npm run build
node --test tests/*.test.cjs
node --check js/enquiry.js
node --check js/site.js
node --check js/analytics.js
node --check js/homepage-studio.js
node --check js/portfolio-load-more.js
node --check js/project-highlights.js
node --check js/testimonials.js
node --check js/experience.js
```

`scss/app.scss` imports `_custom.scss`, `_homepage-studio.scss`, `_site-content.scss` and `_testimonials.scss`. Do not hand-edit `css/app.css` or its source map. After a build or JavaScript edit, update affected HTML asset `?v=` values to the first ten characters of the file's SHA-256 digest. Shared contact controls, footer and form markup is repeated in the six static HTML files; update all instances together.

Racklight serves the local site independently of the build. `npm start` also invokes the legacy TinyPNG image task before starting BrowserSync; use `npm run build` for normal style work. Existing Foundation/Sass deprecation warnings are separate from build failures.

Review desktop, laptop and narrow mobile layouts in a real browser. Check the contact dialog, keyboard navigation, FAQ disclosures, portfolio shuffle/load-more/overlays, reduced motion and old-route destinations. Do not send a real enquiry as a routine visual test.

Verified locally on October 6: the build, 32 automated enquiry/measurement, experience and rotation tests,
JavaScript syntax and Git whitespace checks passed. The six canonical pages passed
metadata, JSON-LD, ID, internal-link/fragment and asset checks. Chrome review covered
the six pages on laptop and mobile layouts, additional homepage widths from 320px
to 2560px, native FAQ keyboard operation, the contact dialog and local submission
guard, portfolio loading/touch overlays, utility pages and all seven redirects.
The homepage remains visible with JavaScript disabled and presents a finished
workspace with reduced motion. The final homepage load had no failed asset requests
or console errors and loaded no production trackers. No live enquiry was sent;
production delivery and Analytics collection remain launch checks.

## Enquiries and measurement

`js/enquiry.js` submits the existing form to Web3Forms. It validates input, prevents duplicate pending submissions, bounds the request to 15 seconds and retains entered text if success cannot be confirmed. A `generate_lead` data-layer event is emitted **only after an HTTP-success response with `success: true`**, before navigating to the thank-you page. Visiting or refreshing that page does not create another lead.

`js/site.js` records `contact_intent` separately for opening the form or clicking email/phone links. Neither event sends names, email addresses, message text or other form fields to analytics. Enquiry contexts come from a fixed allowlist.

The normal HTML POST remains as a fallback when JavaScript is unavailable; it does **not** provide the measured JavaScript confirmation event. With JavaScript active, non-production hosts block submission and display a local-preview notice. Keep JavaScript enabled when testing that guard.

`js/analytics.js` loads the existing GTM container (`GTM-T897BK`) and existing homepage Mixpanel setup only on `qbattersby.com` and `www.qbattersby.com`. Local review does not load those trackers. **No new GA4 tag has been added.** The source emits events, but a GA4 event binding and key-event configuration must still be verified/configured in the existing account at an approved launch. Inspect the existing connected Google tag first to avoid duplicate measurement. Zero currently recorded key events is not evidence of zero enquiries.

Two native GA dashboards already exist under **Reports → Custom dashboards**:

- [Quinn | Business overview](https://analytics.google.com/analytics/web/#/a12843625p399039551/reports/builder/16054933199)
- [Quinn | Local & AI discovery](https://analytics.google.com/analytics/web/#/a12843625p399039551/reports/builder/16054975630)

## Search and AI discovery

Useful page content, project roles and contact links are present in the initial HTML. Canonicals, metadata and the linked Person/business/website/page/service schema describe the visible content. `robots.txt` allows crawling and points to the sitemap. Do not invent reviews, outcomes, offices or location-specific projects.

No `llms.txt`, special AI schema or crawler-specific copy has been added. Google's [AI guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says `llms.txt` does not affect Google visibility or ranking. Search access and model-training permissions are separate decisions; crawler permissions have not been changed. Helpful, accurate content and crawlability remain the priorities, without ranking promises.

## Publication and Google follow-up

1. Review the final local pages, route consolidation and Git diff; build and run the checks above.
2. Publish the approved files, including redirect documents and sitemap. Confirm live URLs, assets, canonicals and redirect destinations.
3. Verify the existing GA4/connected-tag arrangement. Bind the two data-layer events through the approved GTM setup, mark only confirmed `generate_lead` as a key event, and verify a deliberately authorized test enquiry end to end.
4. Check the Search Console property, submit the updated sitemap and inspect the six canonical URLs. Monitor consolidation/indexing rather than assuming immediate ranking changes.
5. Use the dashboards and Canadian Search Console data to assess qualified traffic and confirmed enquiries. Compare trends only after measurement is working; record the launch and tracking-change dates.

Google tracking configuration, test enquiries and Search Console submissions are not performed automatically by a GitHub Pages deployment.
