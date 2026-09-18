import { useEffect, useRef, useState, type FormEvent } from 'react'
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

type AddOnType = 'website' | 'seo' | 'ai' | 'social' | 'media'

const addOns: { name: string; icon: AddOnType }[] = [
  { name: 'Custom website', icon: 'website' },
  { name: 'SEO optimization', icon: 'seo' },
  { name: 'AI visibility improvement', icon: 'ai' },
  { name: 'Social media presence', icon: 'social' },
  { name: 'Business photos / videos', icon: 'media' },
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function AddOnIcon({ type }: { type: AddOnType }) {
  const commonProps = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  if (type === 'website') {
    return (
      <svg {...commonProps}>
        <rect x="5" y="8" width="38" height="32" rx="3" />
        <path d="M5 16h38M11 12h.01M16 12h.01M21 12h.01" />
        <path d="M13 23h13M13 28h22M13 33h17" />
      </svg>
    )
  }

  if (type === 'seo') {
    return (
      <svg {...commonProps}>
        <circle cx="20" cy="20" r="11" />
        <path d="m28 28 10 10M12 23l5-5 5 3 7-8" />
        <path d="M25 13h4v4" />
      </svg>
    )
  }

  if (type === 'ai') {
    return (
      <svg {...commonProps}>
        <path d="M24 5c1.8 9.2 5.8 13.2 15 15-9.2 1.8-13.2 5.8-15 15-1.8-9.2-5.8-13.2-15-15C18.2 18.2 22.2 14.2 24 5Z" />
        <path d="M38 31c.7 3.5 2.5 5.3 6 6-3.5.7-5.3 2.5-6 6-.7-3.5-2.5-5.3-6-6 3.5-.7 5.3-2.5 6-6Z" />
      </svg>
    )
  }

  if (type === 'social') {
    return (
      <svg {...commonProps}>
        <circle cx="14" cy="17" r="6" />
        <circle cx="34" cy="14" r="5" />
        <circle cx="31" cy="35" r="7" />
        <path d="m19.5 14.5 9.5-1M17.5 22l9 8.5M35 19l-2 9" />
      </svg>
    )
  }

  return (
    <svg {...commonProps}>
      <rect x="5" y="12" width="38" height="27" rx="4" />
      <path d="m14 12 3-5h14l3 5" />
      <circle cx="24" cy="25.5" r="7.5" />
      <path d="m22 22 6 3.5-6 3.5v-7Z" />
    </svg>
  )
}

function RollupStat({
  value,
  prefix = '',
  suffix = '',
  label,
}: {
  value: number
  prefix?: string
  suffix?: string
  label: string
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const statRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = statRef.current
    if (!element) return

    let animationFrame = 0
    const animate = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setDisplayValue(value)
        return
      }

      const startedAt = performance.now()
      const duration = 1100
      const update = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(Math.round(value * eased))
        if (progress < 1) animationFrame = requestAnimationFrame(update)
      }
      animationFrame = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        animate()
        observer.disconnect()
      }
    }, { threshold: 0.45 })

    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationFrame)
    }
  }, [value])

  return (
    <div className="business-rollup-stat" ref={statRef}>
      <strong>{prefix}{displayValue}{suffix}</strong>
      <span>{label}</span>
    </div>
  )
}

function LocalProfileGraphic() {
  return (
    <div className="business-profile-column">
      <div
        className="business-profile-visual"
        role="img"
        aria-label="Example of an optimized local business profile with strong reviews"
      >
        <div className="business-profile-browser">
          <div className="business-browser-bar" aria-hidden="true">
            <span className="business-browser-dots"><i /><i /><i /></span>
            <span className="business-address-field">google.com/search</span>
          </div>
          <div className="business-google-search" aria-hidden="true">
            <span className="business-google-g">G</span>
            <span className="business-search-field">
              <span>coffee near me</span>
              <i>×</i>
              <i>⌕</i>
            </span>
          </div>
          <div className="business-profile-card">
            <div className="business-profile-photo" aria-hidden="true">
              <span className="business-awning" />
              <span className="business-door" />
              <span className="business-window" />
            </div>
            <div className="business-profile-copy">
              <span className="business-profile-label">Business Profile</span>
              <div className="business-profile-title">
                <div>
                  <strong>Willow &amp; Pine Coffee</strong>
                  <span><b>4.9</b> <i>★★★★★</i> (184)</span>
                </div>
                <span className="business-verified">✓</span>
              </div>
              <p>Coffee shop · Open · Closes 6 PM</p>
              <div className="business-profile-actions" aria-hidden="true">
                <span><i>↗</i>Website</span>
                <span><i>⌁</i>Directions</span>
                <span><i>☎</i>Call</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="business-rollup-stats" aria-label="Local visibility goals">
        <RollupStat value={3} prefix="Top " label="Google Map Pack" />
        <RollupStat value={5} suffix="★" label="reputation goal" />
        <RollupStat value={1} prefix="#" label="local choice" />
      </div>
    </div>
  )
}

function PackageCardGraphic({ name }: { name: string }) {
  if (name === 'Starter') {
    return (
      <div className="business-package-graphic is-starter" aria-hidden="true">
        <div className="package-mini-search"><b>G</b><span>coffee near me</span></div>
        <div className="package-mini-profile">
          <strong>Willow &amp; Pine Coffee</strong>
          <span>4.9 ★★★★★</span>
          <i>Open now · Coffee shop</i>
        </div>
      </div>
    )
  }

  if (name === 'Growth') {
    return (
      <div className="business-package-graphic is-growth" aria-hidden="true">
        <div className="package-mini-browser">
          <span className="package-mini-bar"><i /><i /><i /></span>
          <div><strong>A website built<br />to convert.</strong><i>Visit today ↗</i></div>
        </div>
        <div className="package-mini-phone">
          <span />
          <i />
          <b>Fast on<br />every screen.</b>
        </div>
      </div>
    )
  }

  return (
    <div className="business-package-graphic is-authority" aria-hidden="true">
      <div className="package-mini-browser">
        <span className="package-mini-bar"><i /><i /><i /></span>
        <div><strong>Built to rank.</strong><i>Visit today ↗</i></div>
      </div>
      <div className="package-mini-ai">
        <span>✦</span>
        <strong>Recommended in AI search.</strong>
        <p>Willow &amp; Pine is a trusted local choice nearby.</p>
      </div>
    </div>
  )
}

function BusinessSite() {
  const [reportStatus, setReportStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const submitReportRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setReportStatus('submitting')

    try {
      const response = await fetch('/api/visibility-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      })

      if (!response.ok) throw new Error('Report request failed')

      form.reset()
      setReportStatus('success')
    } catch {
      setReportStatus('error')
    }
  }

  return (
    <div className="business-site">
      <a className="business-skip" href="#packages">Skip to packages</a>

      <header className="business-header">
        <a className="business-wordmark" href="#top" aria-label="Wolin, home">wolin.dev</a>
        <a className="business-header-link" href="#report">
          Free visibility report
        </a>
      </header>

      <main id="top">
        <section className="business-hero" aria-labelledby="business-title">
          <div className="business-hero-copy">
            <h1 id="business-title">Your business deserves to be <em>found.</em></h1>
            <p>Stronger Google profiles, better websites, and more local visibility.</p>
            <a className="business-hero-cta" href="#report">
              <span>Get a free visibility report</span>
              <Arrow />
            </a>
          </div>
          <LocalProfileGraphic />
        </section>

        <section className="business-packages" id="packages" aria-labelledby="packages-title">
          <h2 id="packages-title">Start simple.<br /><em>Grow steadily.</em></h2>

          <div className="business-package-grid">
            {packages.map((item) => (
              <article key={item.name}>
                <span className="business-package-number">{item.number}</span>
                <h3>{item.name}</h3>
                <div className="business-price">
                  <strong>{item.price}</strong>
                  <span>per month</span>
                </div>
                <p className="business-package-description">{item.description}</p>
                <PackageCardGraphic name={item.name} />
                <ul>
                  {item.items.map((feature) => (
                    <li key={feature}>
                      <span>✓</span>
                      {feature.startsWith('Everything in') ? <strong>{feature}</strong> : feature}
                    </li>
                  ))}
                </ul>
                <a href="#report">
                  Start with your free report <Arrow />
                </a>
              </article>
            ))}
          </div>

          <div className="business-addons" id="addons">
            <h3>Even more <em>visibility.</em></h3>
            <p>Generate even more leads with add-on services.</p>
            <div className="business-addon-grid">
              {addOns.map((item) => (
                <article key={item.name}>
                  <span className={`business-addon-icon is-${item.icon}`}><AddOnIcon type={item.icon} /></span>
                  <h4>{item.name}</h4>
                </article>
              ))}
            </div>
          </div>

        </section>

      </main>

      <footer className="business-footer" id="report">
        <span className="business-availability"><i /> Taking on new clients</span>
        <h2>Get your free<br /><em>visibility report.</em></h2>
        <form className="business-report-form" onSubmit={submitReportRequest}>
          <label className="business-report-honeypot" aria-hidden="true">
            <span>Company</span>
            <input name="company" type="text" autoComplete="off" tabIndex={-1} />
          </label>
          <label>
            <span>Name</span>
            <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" placeholder="you@business.com" required />
          </label>
          <label>
            <span>Business website</span>
            <input name="website" type="url" autoComplete="url" placeholder="https://yourbusiness.com" required />
          </label>
          <label>
            <span>Phone number</span>
            <input name="phone" type="tel" autoComplete="tel" placeholder="(555) 555-5555" required />
          </label>
          <button type="submit" disabled={reportStatus === 'submitting'}>
            {reportStatus === 'submitting' ? 'Sending…' : 'Get my free report'} <Arrow />
          </button>
          <p
            className={`business-report-status is-${reportStatus}`}
            role={reportStatus === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {reportStatus === 'success' && 'Thanks — your information was sent. I’ll be in touch soon.'}
            {reportStatus === 'error' && 'Something went wrong. Please try again or email me directly.'}
          </p>
        </form>
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
