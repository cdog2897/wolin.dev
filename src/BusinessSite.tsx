import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import './BusinessSite.css'

type Page = 'home' | 'offer'
type Service = { id: 'social' | 'websites' | 'google' | 'ai'; number: string; label: string; title: string; description: string }
const offerPath = '/90-day-hands-free-local-sensation'

const services: Service[] = [
  { id: 'social', number: '01', label: 'Show up in their feed', title: 'Social media', description: 'Content, publishing, and community support that make your business familiar before someone needs you.' },
  { id: 'websites', number: '02', label: 'Turn visits into customers', title: 'Websites + SEO', description: 'A sharp website and ongoing search work that help the right people find you and take the next step.' },
  { id: 'google', number: '03', label: 'Own the local moment', title: 'Google Business Profile', description: 'A complete, polished profile that helps nearby customers understand your business at a glance.' },
  { id: 'ai', number: '04', label: 'Be ready for what is next', title: 'AI visibility', description: 'Keep your business information clear, current, and easy for AI search tools to discover and cite.' },
]

const deliverables = [
  { title: 'A complete internet profile', description: 'We complete and connect your presence across Instagram, Facebook, Google Business Profile, your website, and AI search.' },
  { title: '10,000+ views and impressions', description: 'Your business content reaches at least 10,000 combined platform-reported views and impressions in the first 90 days, backed by our guarantee.' },
  { title: 'An SEO improvement plan', description: 'A concrete search improvement plan for your website and local presence, with priorities you can actually use.' },
  { title: 'AI search optimization', description: 'We improve the business information and online signals that help AI search tools understand what you do.' },
  { title: 'Professional video production', description: 'We script, film, and edit professional video content for your business.' },
  { title: 'Content handled for you', description: 'We schedule content across your platforms so your presence stays active without another task on your list.' },
  { title: 'Conversations managed', description: 'We manage DMs, routine customer questions, and incoming leads across the connected social platforms.' },
  { title: 'Leads tracked', description: 'We track leads from social platforms so you can see which conversations turn into opportunities.' },
  { title: 'A complete monthly report', description: 'You get a report of metrics and progress across all platforms each month.' },
]
const bonuses = ['Custom website', 'Google Business Profile optimization', 'Apple Maps optimization', 'Google review strategic adviser report']

function Arrow() { return <span aria-hidden="true">↗</span> }

function ViralWord() {
  const particles = useRef<HTMLSpanElement>(null)
  const emissionTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const animations = useRef(new Set<Animation>())

  const emitHeart = useCallback(() => {
    if (!particles.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    heart.setAttribute('viewBox', '0 0 24 24')
    heart.classList.add('viral-heart')
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', 'M12 21s-9-5.4-9-12A5 5 0 0 1 12 6a5 5 0 0 1 9 3c0 6.6-9 12-9 12Z')
    heart.append(path)
    const size = 12 + Math.random() * 14
    heart.style.width = `${size}px`
    heart.style.left = `${15 + Math.random() * 70}%`
    heart.style.color = ['#ff5a1f', '#f5768e', '#fba17f', '#df4967'][Math.floor(Math.random() * 4)]
    particles.current.append(heart)

    const duration = 1700 + Math.random() * 700
    const drift = (Math.random() - .5) * 260
    const lift = 100 + Math.random() * 100
    const spin = (Math.random() - .5) * 120
    const frames = Array.from({ length: 25 }, (_, index) => {
      const progress = index / 24
      const time = progress * duration / 1000
      return {
        offset: progress,
        transform: `translate(-50%, -50%) translate(${drift * progress}px, ${-lift * time + 125 * time * time}px) rotate(${spin * progress}deg) scale(${.35 + .65 * Math.min(1, progress * 8)})`,
        opacity: Math.min(1, progress * 10) * Math.min(1, (1 - progress) * 4),
      }
    })
    const animation = heart.animate(frames, { duration, easing: 'linear' })
    animations.current.add(animation)
    const remove = () => { animations.current.delete(animation); heart.remove() }
    animation.onfinish = remove
    animation.oncancel = remove
  }, [])

  useEffect(() => {
    const introTimers = Array.from({ length: 8 }, (_, index) => setTimeout(emitHeart, 550 + index * 90))
    const activeAnimations = animations.current
    return () => {
      introTimers.forEach(clearTimeout)
      if (emissionTimer.current !== null) clearInterval(emissionTimer.current)
      for (const animation of activeAnimations) animation.cancel()
    }
  }, [emitHeart])

  const startHearts = () => {
    if (emissionTimer.current !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    for (let index = 0; index < 5; index++) emitHeart()
    emissionTimer.current = setInterval(emitHeart, 110)
  }
  const stopHearts = () => {
    if (emissionTimer.current !== null) clearInterval(emissionTimer.current)
    emissionTimer.current = null
  }

  return <button
    type="button"
    className="viral-word"
    onPointerEnter={event => { if (event.pointerType !== 'touch') startHearts() }}
    onPointerLeave={event => { if (!event.currentTarget.matches(':focus-visible')) stopHearts() }}
    onFocus={event => { if (event.currentTarget.matches(':focus-visible')) startHearts() }}
    onBlur={stopHearts}
    onClick={() => { for (let index = 0; index < 8; index++) emitHeart() }}
  ><em>viral.</em><span className="viral-particles" aria-hidden="true" ref={particles} /></button>
}

function Visual({ kind }: { kind: Service['id'] }) {
  if (kind === 'social') return <div className="business-visual visual-social" aria-label="Examples of social media content"><figure><img src="/social/feed.svg" alt="Local business social post with likes and comments" /><figcaption>Make them stop scrolling.</figcaption></figure><figure><img src="/social/community.svg" alt="Social campaign with hearts and customer comments" /><figcaption>Give them a reason to care.</figcaption></figure><figure><img src="/social/insights.svg" alt="Social media audience growth and engagement" /><figcaption>Stay on their mind.</figcaption></figure></div>
  if (kind === 'websites') return <div className="business-visual visual-web" role="img" aria-label="Example of a responsive website and search result"><div className="visual-browser"><div className="visual-browser-top"><i /><i /><i /><span>yourbusiness.com</span></div><div className="visual-browser-body"><small>THE GOOD STUFF, CLOSE TO HOME</small><strong>Make a great<br />first impression.</strong><span>See what we do ↗</span></div></div><div className="visual-search-card"><span>SEARCH VISIBILITY</span><strong>Found when it matters.</strong><div><i /><i /><i /></div></div></div>
  if (kind === 'google') return <div className="business-visual visual-google" role="img" aria-label="Example of a Google Business Profile search result"><div className="visual-google-search"><b>G</b><span>coffee near me</span><i>⌕</i></div><div className="visual-google-card"><div className="visual-google-photo" /><div className="visual-google-copy"><small>BUSINESS PROFILE</small><strong>Willow &amp; Pine Coffee</strong><span>4.9 <b>★★★★★</b> · Coffee shop</span><p>Open now · Closes 6 PM</p><div><span>↗ Website</span><span>⌁ Directions</span><span>☎ Call</span></div></div></div></div>
  return <div className="business-visual visual-ai" role="img" aria-label="Illustration of a business being cited in AI search"><div className="visual-ai-prompt">✳ &nbsp; Where should I go for a local coffee shop?</div><div className="visual-ai-answer"><span>✦ AI SEARCH</span><p>Willow &amp; Pine Coffee is a neighborhood favorite, known for its welcoming atmosphere and fresh coffee.</p><div><i /> willowandpine.com <Arrow /></div></div><div className="visual-ai-star">✳</div></div>
}

function Header({ page }: { page: Page }) {
  return <header className="business-header"><a className="business-wordmark" href="/" aria-label="Wolin home">wolin<span>.</span>dev</a><nav className="business-nav" aria-label="Main navigation"><a href={offerPath} aria-current={page === 'offer' ? 'page' : undefined}>90-day Hands-Free Local Sensation</a></nav><a className="business-header-link" href={page === 'offer' ? '#qualify' : `${offerPath}#qualify`}>See if your business qualifies <Arrow /></a></header>
}

function Tags() { return <div className="business-tags" aria-label="What we do"><div>{['Social media', 'Google ranking', 'SEO', 'AI', 'Websites'].flatMap((tag, index) => [index > 0 && <div className="business-tag-separator" key={`${tag}-separator`} aria-hidden="true"><i /></div>, <span key={tag}>{tag}</span>])}</div></div> }

function Home() {
  return <>
    <section className="business-home-hero" aria-labelledby="business-title"><div className="business-home-hero-inner"><h1 id="business-title">We will make your<br />business go <ViralWord /></h1><div className="business-home-hero-foot"><p>Transforming local businesses in Laramie, Cheyenne, and Fort Collins.</p><a className="business-pill-button" href={offerPath}>Explore the 90-day offer <Arrow /></a></div></div><div className="business-hero-decoration" aria-hidden="true">✳</div></section>
    <Tags />
    <div className="business-home-intro" id="services"><h2>What we <em>offer.</em></h2><p>Social media, websites, local search, and AI visibility to help your business get seen and chosen.</p></div>
    {services.map(service => <section className={`business-service-section service-${service.id}`} key={service.id} aria-labelledby={`service-${service.id}-title`}><div className="business-service-inner"><div className="business-service-copy"><span className="business-service-index">{service.number} / 04 <i /> {service.label}</span><h2 id={`service-${service.id}-title`}>{service.title}</h2><p>{service.description}</p><a className="business-text-link" href={offerPath}>See the complete offer <Arrow /></a></div><Visual kind={service.id} /></div></section>)}
  </>
}

function Offer() {
  return <>
    <section className="business-offer-hero" aria-labelledby="business-title"><div className="business-offer-hero-inner"><div><span className="business-eyebrow"><i /> For local businesses ready to be seen</span><h1 id="business-title">90-day <em>Hands-Free</em><br />Local Sensation.</h1><p>One focused 90-day program to build your online presence, create the content, manage the conversations, and show you the results. We handle the work so you can run your business.</p><a className="business-pill-button" href="#qualify">See if your business qualifies <Arrow /></a></div><aside className="business-offer-hero-card"><span>THE 90-DAY PROMISE</span><strong>10,000<span>+</span></strong><p>combined views and impressions across your platforms, or we keep managing your marketing at no charge until you reach it.</p><a href="#guarantee">Read the guarantee <Arrow /></a></aside></div></section>
    <section className="business-offer-lead" aria-label="Free website"><div><span>YOUR STARTING POINT</span><h2>A custom website.<br /><em>On us.</em></h2></div><p>Your free custom website is part of the offer, giving every campaign a place to send people and every customer a clear next step.</p></section>
    <section className="business-offer-included" aria-labelledby="included-title"><div className="business-offer-section-heading"><span className="business-eyebrow">What we handle</span><h2 id="included-title">A complete presence.<br /><em>Built and managed.</em></h2><p>One offer covers the work across your online channels.</p></div><div className="business-offer-grid">{deliverables.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, '0')} / INCLUDED</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>
    <section className="business-offer-bonuses" aria-labelledby="bonuses-title"><div><span className="business-eyebrow">Included at no additional charge</span><h2 id="bonuses-title">Four extras.<br /><em>All yours.</em></h2><p>We build the foundation while your 90-day program gets moving.</p></div><ul>{bonuses.map((bonus, index) => <li key={bonus}><span>0{index + 1}</span><strong>{bonus}</strong><em>FREE</em></li>)}</ul></section>
    <section className="business-offer-guarantee" id="guarantee" aria-labelledby="guarantee-title"><span className="business-eyebrow">Our promise to you</span><h2 id="guarantee-title">10,000 Local Views<br /><em>Guarantee.</em></h2><p>If your content doesn't generate at least 10,000 combined views and impressions during your first 90 days, we'll continue managing your marketing at no charge until it does.</p><small>Measured using the combined views and impressions reported by the platforms used in your program.</small></section>
    <section className="business-offer-payment" aria-labelledby="payment-title"><div className="business-offer-section-heading"><span className="business-eyebrow">The 90-day program</span><h2 id="payment-title">One focused offer.<br /><em>Everything handled.</em></h2><p>The complete program, deliverables, and guarantee for one fee.</p></div><div className="business-offer-payment-card"><span>PROGRAM INVESTMENT</span><h3>$4,500</h3><p>One payment before the program begins. Applicable tax is added where required.</p><p className="business-offer-domain-terms">After the program, optional website hosting and maintenance is $99/month plus applicable tax, including domain registration, renewal, and operating tools. Wolin owns any domain it registers. If you cancel that monthly service, you can transfer the domain into your name for $99, subject to registrar requirements.</p></div><a className="business-pill-button" href="#qualify">See if your business qualifies <Arrow /></a></section>
    <section className="business-offer-capacity"><div><span className="business-eyebrow">Limited capacity</span><h2>Just five businesses<br /><em>at a time.</em></h2></div><div><p>We only retain five clients at a time so each business gets hands-on attention from planning through reporting.</p><a className="business-pill-button" href="#qualify">See if your business qualifies <Arrow /></a></div></section>
  </>
}

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('submitting')
    try {
      const response = await fetch('/api/visibility-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) })
      if (!response.ok) throw new Error('Contact failed')
      form.reset()
      setStatus('success')
    } catch { setStatus('error') }
  }
  return <form className="business-contact-form" onSubmit={submit}><label className="business-honeypot" aria-hidden="true">Company<input name="company" type="text" tabIndex={-1} autoComplete="off" /></label><input type="hidden" name="service" value="90-day Hands-Free Local Sensation qualification" /><label>Name<input name="name" type="text" autoComplete="name" placeholder="Your name" required /></label><label>Email<input name="email" type="email" autoComplete="email" placeholder="you@business.com" required /></label><label>Business name<input name="business_name" type="text" autoComplete="organization" placeholder="Your business" required /></label><label>Phone<input name="phone" type="tel" autoComplete="tel" placeholder="(555) 555-5555" /></label><label className="is-wide">Business website (if you have one)<input name="website" type="url" autoComplete="url" placeholder="https://yourbusiness.com" /></label><label className="is-wide">Tell us about your business<textarea name="message" rows={3} placeholder="What do you do, and where do you serve customers?" /></label><button type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending…' : 'See if your business qualifies'} <Arrow /></button><p className={`business-form-status is-${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live="polite">{status === 'success' ? 'Thanks! Your request was sent. I’ll be in touch soon.' : status === 'error' ? 'That did not go through. Please email me directly at caleb.wolin@gmail.com.' : ''}</p></form>
}

function BusinessSite({ page = 'home' }: { page?: Page }) {
  return <div className={`business-site business-site-${page}`}><a className="business-skip" href="#main">Skip to content</a><Header page={page} /><main id="main">{page === 'home' ? <Home /> : <Offer />}</main><footer className="business-footer" id="qualify"><div className="business-footer-inner"><div className="business-footer-copy"><span className="business-eyebrow"><i /> Ready when you are</span><h2>Let’s make your<br />business <em>impossible<br />to miss.</em></h2><p>Tell me about your business. I’ll review where you are now and get in touch about whether the 90-day offer is a fit.</p><div className="business-footer-direct"><span>Prefer to reach out directly?</span><a href="mailto:caleb.wolin@gmail.com">caleb.wolin@gmail.com <Arrow /></a><a href="tel:+12088108089">+1 (208) 810-8089 <Arrow /></a></div></div><div className="business-footer-form"><div className="business-footer-form-heading"><span>90-DAY HANDS-FREE LOCAL SENSATION</span><h3>See if you qualify.</h3></div><ContactForm /></div></div><div className="business-footer-bottom"><span>Wolin © 2026</span><a href="#main">Back to top ↑</a></div></footer></div>
}
export default BusinessSite
