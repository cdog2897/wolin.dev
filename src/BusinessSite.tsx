import './BusinessSite.css'

const packages = [
  {
    number: '01',
    name: 'Starter',
    price: '$279',
    cadence: 'monthly',
    description: 'The essentials for a healthier Google presence and stronger local ranking signals.',
    items: [
      'Complete Google Business Profile audit',
      'Categories, services, description, and attributes optimized',
      'Hours, service areas, and contact details checked',
      'Two Google profile posts each month',
      'Review response guidance and templates',
      'Monthly local ranking snapshot',
    ],
  },
  {
    number: '02',
    name: 'Growth',
    price: '$679',
    cadence: 'monthly',
    description: 'Advanced profile management paired with practical website improvements.',
    items: [
      'Everything in Starter',
      'Weekly Google profile posts and updates',
      'Review monitoring and response support',
      'Citation and business-listing cleanup',
      'Website content and on-page SEO improvements',
      'Conversion and mobile experience improvements',
      'Google Search Console monitoring',
      'Monthly report with completed work and next steps',
    ],
    featured: true,
  },
  {
    number: '03',
    name: 'Authority',
    price: '$1,279',
    cadence: 'monthly',
    description: 'A complete local, website, and AI-search visibility program.',
    items: [
      'Everything in Growth',
      'Technical SEO and site-structure improvements',
      'One new service, location, or authority page each month',
      'Internal linking, structured data, and conversion testing',
      'Competitor and keyword opportunity tracking',
      'AI visibility and brand-entity audit',
      'Content structured for Google and AI answer engines',
      'AI mention monitoring and quarterly strategy review',
    ],
  },
]

const addOns = [
  ['Custom website', 'From $2,500'],
  ['Additional business location', '$199 / month'],
  ['Additional service or location page', '$225'],
  ['Citation cleanup project', '$249'],
  ['Review request system setup', '$149'],
  ['Extra search-focused article', '$250'],
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function BusinessSite() {
  return (
    <div className="business-site">
      <a className="business-skip" href="#packages">Skip to packages</a>

      <header className="business-header">
        <a className="business-wordmark" href="#top" aria-label="Wolin, home">wolin.dev</a>
        <a className="business-header-link" href="mailto:caleb.wolin@gmail.com?subject=Local%20business%20project">
          Start a project
        </a>
      </header>

      <main id="top">
        <section className="business-hero" aria-labelledby="business-title">
          <div className="business-kicker">Local growth for small businesses</div>

          <div className="business-mark" aria-label="Google profile, website, and local search">
            <span className="business-mark-one">Google</span>
            <span className="business-mark-two">Website</span>
            <span className="business-mark-three">Search</span>
          </div>

          <h1 id="business-title">Your business deserves to be <em>found.</em></h1>
          <p>Stronger Google profiles, better websites, and more local visibility.</p>
          <a className="business-round-link" href="#packages" aria-label="Explore packages">
            <span>Explore</span>
            <span aria-hidden="true">↓</span>
          </a>
        </section>

        <section className="business-packages" id="packages" aria-labelledby="packages-title">
          <div className="business-section-label"><span>01</span><span>Packages</span></div>
          <h2 id="packages-title">Start simple.<br /><em>Grow steadily.</em></h2>

          <div className="business-package-grid">
            {packages.map((item) => (
              <article className={item.featured ? 'is-featured' : ''} key={item.name}>
                <span className="business-package-number">{item.number}</span>
                <h3>{item.name}</h3>
                <div className="business-price">
                  <strong>{item.price}</strong>
                  <span>per month</span>
                </div>
                <p className="business-package-description">{item.description}</p>
                <ul>
                  {item.items.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}
                </ul>
                <a href={`mailto:caleb.wolin@gmail.com?subject=${encodeURIComponent(`${item.name} package`)}`}>
                  Choose {item.name} <Arrow />
                </a>
              </article>
            ))}
          </div>

          <div className="business-addons">
            <div className="business-section-label"><span>02</span><span>Add-ons</span></div>
            <h3>Add only what<br /><em>you need.</em></h3>
            <dl>
              {addOns.map(([name, price]) => (
                <div key={name}><dt>{name}</dt><dd>{price}</dd></div>
              ))}
            </dl>
          </div>

          <ul className="business-terms" aria-label="Package terms">
            <li><strong>Month-to-month</strong><span>No long-term contract</span></li>
            <li><strong>One location included</strong><span>Add more as needed</span></li>
            <li><strong>You own everything</strong><span>Accounts, content, and data</span></li>
            <li><strong>No ranking guarantees</strong><span>Clear work and honest reporting</span></li>
          </ul>
        </section>

        <section className="business-process" aria-labelledby="process-title">
          <div className="business-section-label"><span>03</span><span>Process</span></div>
          <h2 id="process-title">Clear work.<br /><em>Direct communication.</em></h2>
          <ol>
            <li><span>01</span><strong>Review what you have</strong></li>
            <li><span>02</span><strong>Fix what matters</strong></li>
            <li><span>03</span><strong>Build consistent growth</strong></li>
          </ol>
        </section>
      </main>

      <footer className="business-footer" id="contact">
        <span className="business-availability"><i /> Taking on new clients</span>
        <h2>Let’s grow<br /><em>local.</em></h2>
        <a className="business-footer-cta" href="mailto:caleb.wolin@gmail.com?subject=Local%20business%20project">
          Start a project <Arrow />
        </a>
        <div className="business-footer-contact">
          <a href="mailto:caleb.wolin@gmail.com">caleb.wolin@gmail.com</a>
          <a href="tel:+12088108089">+1 (208) 810-8089</a>
        </div>
        <div className="business-footer-bottom">
          <span>Wolin © 2026</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </div>
  )
}

export default BusinessSite
