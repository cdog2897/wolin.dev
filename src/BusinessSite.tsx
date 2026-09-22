import { useEffect, useRef, useState, type FormEvent } from 'react'
import './BusinessSite.css'

const packages = [
  {
    number: '01',
    name: 'Starter',
    price: '$279',
    cadence: 'monthly',
    scope: 'Google Business Profile',
    description: 'Hands-on care for the profile customers see in Google Search and Maps.',
    items: [
      'Complete Google Business Profile audit with prioritized findings',
      'Fixes to categories, services, description, attributes, and links',
      'Hours, service areas, address, phone, and contact details checked',
      'Logo, cover image, and existing photo placement reviewed',
      'One Google Business Profile post per month',
      'Duplicate, suspended, or inaccurate listing issues flagged',
      'Monthly report covering Google Business Profile status, ranking, and updates',
    ],
  },
  {
    number: '02',
    name: 'Growth',
    price: '$679',
    cadence: 'monthly',
    scope: 'Google profile + website essentials',
    description: 'Profile management plus practical fixes that make your website easier to find and use.',
    items: [
      'Everything in Starter',
      'Two Google Business Profile posts per month',
      'Website health review for the pages that matter most',
      'Broken links, missing metadata, and heading issues fixed',
      'Basic on-page SEO for core service and location pages',
      'Page titles, descriptions, and local keyword copy improved',
      'Mobile layout, navigation, tap targets, and forms improved',
      'Image sizing, loading, and other practical speed fixes',
      'Calls to action, click-to-call links, and contact paths improved',
      'Local business schema and NAP consistency checked',
      'Google Search Console setup and issue monitoring',
    ],
  },
  {
    number: '03',
    name: 'Authority',
    price: '$1,279',
    cadence: 'monthly',
    scope: 'Full search + website + AI visibility',
    description: 'The complete program for becoming the clearest, strongest local answer everywhere customers search.',
    items: [
      'Everything in Growth',
      'Full website and technical SEO audit with a prioritized roadmap',
      'Crawl, indexing, sitemap, robots, canonical, and redirect issues fixed',
      'Site structure, internal linking, and structured data improved',
      'Core Web Vitals and high-impact speed issues addressed',
      'Keyword, competitor, service, and location opportunity research',
      'Service, location, FAQ, and authority content written or improved',
      'Conversion tracking, calls to action, and lead paths reviewed',
      'AI visibility audit across ChatGPT, Claude, and Google AI',
      'Real customer prompts tested for mentions, accuracy, and citations',
      'Ongoing search and AI visibility monitoring with roadmap updates',
    ],
  },
]

const socialPackages = [
  {
    number: '01',
    name: 'Social Presence',
    price: '$479',
    scope: 'Stay active and credible',
    description: 'A polished, consistent presence for businesses that need social media handled every month.',
    items: [
      'Two connected social platforms',
      'Eight original content pieces per month',
      'Custom captions and branded graphics',
      'Photo, static, and carousel content',
      'Monthly content calendar and scheduling',
      'Profile information and links checked',
      'One consolidated revision round',
      'Monthly performance summary',
    ],
  },
  {
    number: '02',
    name: 'Social Momentum',
    price: '$879',
    scope: 'Build reach and engagement',
    description: 'More content, short-form video, and thoughtful audience engagement tied to real business goals.',
    featured: true,
    items: [
      'Everything in Social Presence',
      'Twelve original content pieces per month',
      'Up to two short-form videos from supplied footage',
      'Eight additional story frames',
      'One monthly campaign or promotional theme',
      'Comment and inbox monitoring three weekdays per week',
      'Up to 40 routine responses per month',
      'Monthly strategy call and lead tracking',
    ],
  },
  {
    number: '03',
    name: 'Social Partner',
    price: '$1,479',
    scope: 'Your outsourced social lead',
    description: 'Hands-on content, community management, and strategy for businesses ready to make social a priority.',
    items: [
      'Up to three social platforms',
      'Sixteen original content pieces per month',
      'Up to four short-form videos',
      'Twelve additional story frames',
      'One local 60-minute content session per month',
      'Weekday comment and inbox monitoring',
      'Up to 100 routine responses per month',
      'Monthly campaign planning and strategy meeting',
      'Quarterly competitor and content review',
    ],
  },
]

type SocialPreview = {
  image: string
  label: string
  title: string
  reel?: boolean
  wide?: boolean
}

const socialPreviewRows: SocialPreview[][] = [
  [
    {
      image: '/projects/sparkz-hero.jpeg',
      label: 'Short-form video',
      title: 'Show the story, not just the service.',
      reel: true,
      wide: true,
    },
    {
      image: '/projects/shalom-01.webp',
      label: 'Product spotlight',
      title: 'Built for the moment.',
    },
    {
      image: '/projects/bible-stories-01.webp',
      label: 'Campaign launch',
      title: 'A clear reason to tap.',
      wide: true,
    },
    {
      image: '/portraits/caleb-salt-flats-car.jpg',
      label: 'Behind the scenes',
      title: 'Real people. Real work.',
      reel: true,
    },
    {
      image: '/projects/sparkz-01.webp',
      label: 'Customer education',
      title: 'Make the next step obvious.',
    },
    {
      image: '/portraits/caleb-desert-truck.jpg',
      label: 'Local story',
      title: 'Made here. Known here.',
      wide: true,
    },
  ],
  [
    {
      image: '/portraits/caleb-tropics.jpg',
      label: 'Brand story',
      title: 'Give the business a face.',
      reel: true,
    },
    {
      image: '/projects/shalom-02.webp',
      label: 'Service explainer',
      title: 'Turn questions into confidence.',
      wide: true,
    },
    {
      image: '/projects/sparkz-03.webp',
      label: 'Reel series',
      title: 'Small moments. Strong recall.',
      reel: true,
    },
    {
      image: '/projects/bible-stories-02.webp',
      label: 'Community post',
      title: 'Stay useful between visits.',
    },
    {
      image: '/portraits/caleb-salt-flats.jpg',
      label: 'Founder story',
      title: 'Trust starts with the people.',
      wide: true,
    },
    {
      image: '/projects/sparkz-02.webp',
      label: 'Offer campaign',
      title: 'One message. One next step.',
    },
  ],
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function SocialShowcase() {
  return (
    <div className="business-social-showcase" aria-hidden="true">
      {socialPreviewRows.map((row, rowIndex) => (
        <div className={`business-social-row is-row-${rowIndex + 1}`} key={`social-row-${rowIndex + 1}`}>
          <div className="business-social-track">
            {[0, 1].map((copyIndex) => (
              <div className="business-social-preview-group" key={`social-row-${rowIndex + 1}-${copyIndex}`}>
                {row.map((item) => (
                  <div
                    className={`business-social-preview${item.wide ? ' is-wide' : ''}`}
                    key={`${copyIndex}-${item.label}`}
                  >
                    <img src={item.image} alt="" draggable={false} />
                    {item.reel && <span className="business-social-reel">▶ Reel</span>}
                    <div className="business-social-preview-copy">
                      <small>{item.label}</small>
                      <strong>{item.title}</strong>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
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
                <p className="business-package-scope">{item.scope}</p>
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

          <section className="business-social" id="social-media" aria-labelledby="social-media-title">
            <span className="business-social-eyebrow">Social media management</span>
            <h3 id="social-media-title">Stay visible.<br /><em>Stay connected.</em></h3>
            <p className="business-social-intro">
              Strategy, content, publishing, and community support for busy small businesses.
            </p>

            <SocialShowcase />

            <div className="business-social-grid">
              {socialPackages.map((item) => (
                <article className={item.featured ? 'is-featured' : undefined} key={item.name}>
                  <div className="business-social-card-top">
                    <span className="business-package-number">{item.number}</span>
                    {item.featured && <span className="business-social-popular">Most popular</span>}
                  </div>
                  <h4>{item.name}</h4>
                  <div className="business-price">
                    <strong>{item.price}</strong>
                    <span>per month</span>
                  </div>
                  <p className="business-package-scope">{item.scope}</p>
                  <p className="business-social-description">{item.description}</p>
                  <ul>
                    {item.items.map((feature) => (
                      <li key={feature}>
                        <span>✓</span>
                        {feature.startsWith('Everything in') ? <strong>{feature}</strong> : feature}
                      </li>
                    ))}
                  </ul>
                  <a href="#report">
                    Start with a conversation <Arrow />
                  </a>
                </article>
              ))}
            </div>

            <p className="business-social-note">
              Plans begin with a three-month engagement. Advertising spend is separate, and every account remains yours.
            </p>
          </section>

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
