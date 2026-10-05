# Undercover Bed & Spas design demo

The frontend demo is scoped to `/sample/UndercoverBedandSpas` and its child views. The public Wolin page map and sitemap remain unchanged. It has no backend, booking, payment, or form submission integration. Favorites live only in React state for the current page session. Form previews explicitly say that nothing was sent.

## Source and scope

The official domain is <https://undercoverbedandspas.com/>. Research reviewed its home, catalog, collection pages, services, about, contact, brochure, warranty, and blog navigation. Product discovery covers Hot Spring Highlife, Limelight, Hot Spot, Vigor cold plunge, refurbished inquiries and spa essentials; Tylo and Leisurecraft saunas; Tempur-Pedic, Stearns & Foster and Sealy; bases and pillows. No prices, inventory, product specifications, testimonials, or medical promises were invented.

Contact information follows the current official home and contact pages: 400 South 2nd Street, Laramie, Wyoming 82070; (307) 745-5289; undercoverspa@gmail.com. Hours are Monday–Friday 10 am–6 pm, Saturday 10 am–4 pm, Sunday closed. Other source pages have inconsistent hours. The delivery promotion is omitted rather than extending its terms.

Official references:

- [Spas](https://undercoverbedandspas.com/spas/) and [spa essentials](https://undercoverbedandspas.com/spa-necessaries/)
- [Saunas](https://undercoverbedandspas.com/saunas/), [Tylo](https://undercoverbedandspas.com/tylo-saunas/) and [Leisurecraft](https://undercoverbedandspas.com/leisurecraft-saunas/)
- [Mattresses](https://undercoverbedandspas.com/mattresses/)
- [Services and repairs](https://undercoverbedandspas.com/services-and-repairs/)
- [About](https://undercoverbedandspas.com/about-us/), [contact](https://undercoverbedandspas.com/contact/), [brochures](https://undercoverbedandspas.com/request-brochure/), [blog](https://undercoverbedandspas.com/blog-and-guides/)
- [Instagram](https://www.instagram.com/undercoverbedandspas/) and [Facebook](https://www.facebook.com/UndercoverBedAndSpas)

Photography URLs and their source provenance are in `src/undercover/data.ts`. These assets are publicly hosted on the official business website and include manufacturer imagery. No new asset ownership or license is asserted. Lifestyle photography is labeled as inspiration rather than an image of an individual model. Team photographs represent the actual source team.

## Indexing and lifetime

Every sample view is prerendered with an initial `noindex, nofollow` robots meta tag. Existing sample `X-Robots-Tag` headers cover the whole subtree, including unknown routes. Search crawlers can fetch this path to read the directive. GPTBot’s existing training exclusion remains unchanged. This is a publicly reachable demonstration; noindex is neither access control nor a guarantee of removal or secrecy.

There is no automatic expiration or deletion. The suggested 24–48 hour duration did not specify an exact takedown time.

## Validation

Run `npm run build`, `npm run lint`, `npm test`, `node scripts/check-seo.mjs`, and `node scripts/check-undercover.mjs`. Browser checks cover desktop/mobile layout, internal routes, reload/back behavior, shortlist, form validation and honest preview feedback. Preserve admin-host routing and existing public routes when changing deployment configuration.
