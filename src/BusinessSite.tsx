import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import './BusinessSite.css'
import Offers from './Offers'
import HeroArtwork from './HeroArtwork'
import { offerOptions } from './offer-options'

type Page = 'home' | 'offers'
type Service = { id: 'social' | 'websites' | 'google' | 'ai'; number: string; label: string; title: string; description: string }

const services: Service[] = [
  { id: 'social', number: '01', label: 'Show up in their feed', title: 'Social media', description: 'Content, publishing, and community support that make your business familiar before someone needs you.' },
  { id: 'websites', number: '02', label: 'Turn visits into customers', title: 'Websites + SEO', description: 'A sharp website and ongoing search work that help the right people find you and take the next step.' },
  { id: 'google', number: '03', label: 'Own the local moment', title: 'Google Business Profile', description: 'A complete, polished profile that helps nearby customers understand your business at a glance.' },
  { id: 'ai', number: '04', label: 'Be ready for what is next', title: 'AI visibility', description: 'Keep your business information clear, current, and easy for AI search tools to discover and cite.' },
]

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
  return <header className="business-header"><a className="business-wordmark" href="/" aria-label="Wolin home">wolin<span>.</span>dev</a><nav className="business-nav" aria-label="Main navigation"><a href="/offers" aria-current={page === 'offers' ? 'page' : undefined}>Offers</a></nav><a className="business-header-link" href="#contact">Contact Us <Arrow /></a></header>
}

function Tags() { return <div className="business-tags" aria-label="What we do"><div>{['Social media', 'Google ranking', 'SEO', 'AI', 'Websites'].flatMap((tag, index) => [index > 0 && <div className="business-tag-separator" key={`${tag}-separator`} aria-hidden="true"><i /></div>, <span key={tag}>{tag}</span>])}</div></div> }

function Home() {
  return <>
    <section className="business-home-hero" aria-labelledby="business-title"><div className="business-home-hero-inner"><h1 id="business-title">We will make your<br />business go <ViralWord /></h1><div className="business-home-hero-foot"><p>Transforming local businesses in Laramie, Cheyenne, and Fort Collins.</p><a className="business-pill-button" href="#contact">Contact Us <Arrow /></a></div><HeroArtwork /></div></section>
    <Tags />
    <div className="business-home-intro" id="services"><h2>What we <em>offer.</em></h2><p>Social media, websites, local search, and AI visibility to help your business get seen and chosen.</p></div>
    {services.map(service => <section className={`business-service-section service-${service.id}`} key={service.id} aria-labelledby={`service-${service.id}-title`}><div className="business-service-inner"><div className="business-service-copy"><span className="business-service-index">{service.number} / 04 <i /> {service.label}</span><h2 id={`service-${service.id}-title`}>{service.title}</h2><p>{service.description}</p><a className="business-text-link" href="/offers">Explore the offers <Arrow /></a></div><Visual kind={service.id} /></div></section>)}
  </>
}

function ContactForm({ selectedOffer }: { selectedOffer: string }) {
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
  return <form className="business-contact-form" onSubmit={submit}><label className="business-honeypot" aria-hidden="true">Company<input name="company" type="text" tabIndex={-1} autoComplete="off" /></label><input type="hidden" name="service" value={selectedOffer || 'General business inquiry'} /><label>Name<input name="name" type="text" autoComplete="name" placeholder="Your name" required /></label><label>Email<input name="email" type="email" autoComplete="email" placeholder="you@business.com" required /></label><label>Business name<input name="business_name" type="text" autoComplete="organization" placeholder="Your business" required /></label><label>Phone<input name="phone" type="tel" autoComplete="tel" placeholder="(555) 555-5555" /></label><label className="is-wide">Business website (if you have one)<input name="website" type="url" autoComplete="url" placeholder="https://yourbusiness.com" /></label><label className="is-wide">Tell us about your business<textarea name="message" rows={3} placeholder="What do you do, and where do you serve customers?" /></label><button type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending…' : 'Contact Us'} <Arrow /></button><p className={`business-form-status is-${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live="polite">{status === 'success' ? 'Thanks! Your request was sent. I’ll be in touch soon.' : status === 'error' ? 'That did not go through. Please email me directly at caleb.wolin@gmail.com.' : ''}</p></form>
}

function BusinessSite({ page = 'home' }: { page?: Page }) {
  const [selectedOffer, setSelectedOffer] = useState('')
  const chooseOffer = (id: string) => setSelectedOffer(offerOptions.find(offer => offer.id === id)?.label ?? '')
  return <div className={`business-site business-site-${page}`}><a className="business-skip" href="#main">Skip to content</a><Header page={page} /><main id="main">{page === 'home' ? <Home /> : <Offers onChoose={chooseOffer} />}</main><footer className="business-footer" id="qualify"><div className="business-footer-inner"><div className="business-footer-copy"><span className="business-eyebrow"><i /> Ready when you are</span><h2>Let’s make your<br />business <em>impossible<br />to miss.</em></h2><p>Tell us about your business and what you have in mind. We’ll get in touch to talk about your next move.</p><div className="business-footer-direct"><span>Prefer to reach out directly?</span><a href="mailto:caleb.wolin@gmail.com">caleb.wolin@gmail.com <Arrow /></a><a href="tel:+12088108089">+1 (208) 810-8089 <Arrow /></a></div></div><div className="business-footer-form" id="contact"><div className="business-footer-form-heading"><span>LET’S START A CONVERSATION</span><h3>Contact Us</h3></div><ContactForm selectedOffer={selectedOffer} /></div></div><div className="business-footer-bottom"><span>Wolin © 2026</span><a href="#main">Back to top ↑</a></div></footer></div>
}
export default BusinessSite
