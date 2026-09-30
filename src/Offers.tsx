import { useState } from 'react'
import './Offers.css'
import { monthlySocialPlans, socialLaunchPrice } from './offer-options'
import { customerBillingUrl } from '../shared/customer-billing'

type OffersProps = { onChoose: (offer: string) => void }
type CardProps = OffersProps & {
  id: string
  title: React.ReactNode
  subtitle?: string
  price: string
  originalPrice?: string
  period?: string
  description: string
  features: Array<string | { text: string; content: React.ReactNode }>
  note?: string
  className?: string
  action?: string
  children?: React.ReactNode
}

const socialFeatures = [
  'Content strategy tailored to your business and local audience',
  'One professional photo/video shoot',
  'All content scripted, planned, edited, and posted',
  'Captions, hashtags, and scheduling—all handled for you',
  'Monthly analytics report',
]

const socialBonuses = [
  { id: 'growth-guide', name: 'Internet Growth Guide', description: 'A practical guide to improving your online presence, attracting local customers, and keeping your business visible after the program.' },
  { id: 'bio-optimization', name: 'IG, FB, TT Bio Optimization', description: 'We refresh your Instagram, Facebook, and TikTok bios with clear business descriptions and calls to action so visitors know what you offer and how to reach you.' },
  { id: 'template-pack', name: 'Branded Template Pack', description: 'Reusable social media designs styled with your business’s colors and branding for promotions, announcements, and customer testimonials.' },
]

function BonusInfo({ bonus }: { bonus: typeof socialBonuses[number] }) {
  const [open, setOpen] = useState(false)
  const tooltipId = `bonus-${bonus.id}-tooltip`
  return <span className="offers-bonus-info"
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setOpen(false) }}
    onFocus={() => setOpen(true)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}
    onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); event.stopPropagation() } }}>
    <button type="button" className="offers-bonus-help" aria-label={`About ${bonus.name}`} aria-describedby={tooltipId} aria-expanded={open} onClick={() => setOpen(true)}>?</button>
    <span className="offers-bonus-tooltip" id={tooltipId} role="tooltip" hidden={!open}>{bonus.description}</span>
  </span>
}

function OfferCard({ id, title, subtitle, price, originalPrice, period, description, features, note, className = '', action = 'Let’s get started', onChoose, children }: CardProps) {
  return <article className={`offers-card ${className}`} id={id} aria-labelledby={`${id}-title`}>
    <div className="offers-card-heading"><h2 id={`${id}-title`}>{title}</h2>{subtitle && <p className="offers-subtitle">{subtitle}</p>}<p>{description}</p></div>
    <div className="offers-price">{originalPrice && <span className="offers-original-price"><span className="offers-sr-only">Regular price: </span><del>{originalPrice}</del></span>}<strong>{originalPrice && <span className="offers-sr-only">Sale price: </span>}{price}</strong>{period && <span>{period}</span>}</div>
    <ul className="offers-features">{features.map(feature => typeof feature === 'string' ? <li key={feature}>{feature}</li> : <li key={feature.text}>{feature.content}</li>)}</ul>
    {children}
    {note && <p className="offers-note">{note}</p>}
    <a className="offers-action" href="#contact" onClick={() => onChoose(id)}>{action}<span aria-hidden="true">↗</span></a>
  </article>
}

export default function Offers({ onChoose }: OffersProps) {
  return <div className="offers-page">
    <section className="offers-intro" aria-labelledby="offers-title">
      <div><h1 id="offers-title">Our <em>offers</em></h1><p>Social media handled for you, a custom website, and services tailored to your business. Find the right fit for your business.</p></div>
    </section>

    <section className="offers-group offers-social" aria-label="Social media offers">
      <OfferCard id="social-90" title={<>90-Day <em>Hands-Free</em> Local Virality</>} price={socialLaunchPrice} originalPrice="$7,000" period="one time" description="We plan it, shoot it, create it, and post it. Your social media, completely handled." onChoose={onChoose} className="offers-social-launch" features={[
        { text: '60 posts per month across platforms', content: <><strong>60 posts per month</strong> across platforms</> },
        '20 Instagram · 20 Facebook · 20 TikTok',
        ...socialFeatures,
      ]}>
        <div className="offers-social-extras">
          <div className="offers-bonuses"><h3>Plus, included FREE;</h3><ul>{socialBonuses.map(bonus => <li key={bonus.id}><span className="offers-free-badge">FREE</span><strong>{bonus.name}</strong><BonusInfo bonus={bonus} /></li>)}</ul></div>
        </div>
        <div className="offers-social-highlight">
          <div className="offers-view-guarantee">
            <div className="offers-guarantee-badge"><span className="offers-guarantee-check" aria-hidden="true">✓</span><div><strong>10,000+ views</strong><span>Guaranteed in 90 days</span></div></div>
            <p>Across Instagram, Facebook, and TikTok. If you haven’t reached 10,000 combined views in 90 days, we’ll keep managing your social media at no extra charge until you do.</p>
          </div>
        </div>
      </OfferCard>
      <div className="offers-grid offers-grid-three">
        {monthlySocialPlans.map(plan => <OfferCard key={plan.id} id={plan.id} title={plan.title} subtitle={`${plan.postsPerPlatform * 3} posts every month · ${plan.postsPerPlatform} per platform`} price={plan.price} period="per month" description="The same complete service. Choose your posting pace." features={[`${plan.postsPerPlatform * 3} posts per month across platforms`, `${plan.postsPerPlatform} Instagram · ${plan.postsPerPlatform} Facebook · ${plan.postsPerPlatform} TikTok`, ...socialFeatures]} onChoose={onChoose} note="Month to month. Onboarding included. Change your tier for the next billing period; cancel before your next billing date." />)}
      </div>

    </section>

    <section className="offers-group offers-web" aria-label="Website offers">
      <OfferCard id="website" title="Custom Website + Care." price="$299" period="upfront" description="A professional home for your business. Designed for your customers, with the upkeep handled." onChoose={onChoose} className="offers-website" features={[
        'Custom, mobile-friendly website · one page',
        'Contact form + clear calls to action',
        'Services, business details + existing booking links',
        'Basic search titles + descriptions',
        'Light polishing of your supplied copy + photos',
        'Two consolidated design feedback rounds',
        'Hosting, availability checks + routine maintenance',
        'Domain registration, renewal + operating tools included',
        'Unlimited minor edits while care is active',
        'Minor edits completed within 48 hours of a complete request',
      ]} note="$99/month after 30 free days, starting at checkout even if launch is later. First draft targeted within 10 business days after complete materials. New pages, redesigns, features, ecommerce, and original photography are quoted separately.">
        <div className="offers-website-preview" aria-hidden="true"><div><i /><i /><i /><span>yourbusiness.com</span></div><p>A place to<br /><em>call yours.</em></p><span>Make a great first impression. ↗</span></div>
      </OfferCard>
    </section>

    <section className="offers-other" aria-labelledby="other-services-title">
      <div><h2 id="other-services-title">Something else in mind?</h2><p>Other services, tailored to your business. Tell us what you need and we’ll put together a custom quote.</p></div>
      <p className="offers-other-list">Videography · Video editing · Photography · DMs + community management · Google Business Profile optimization + management · Apple Maps · Listing cleanup · Review strategy + responses · Online presence audits · SEO plans + website SEO · Technical SEO · Ongoing local SEO · Service + location content · Conversion improvements · AI visibility + monitoring · Analytics + lead tracking · Social lead pipelines · Monthly visibility reporting</p>
      <a href="#contact" className="offers-custom-link" onClick={() => onChoose('custom')}>Request a custom quote <span aria-hidden="true">↗</span></a>
    </section>
    <p className="offers-tax-note">All prices are in USD. Applicable tax is additional. Scope and production schedules are confirmed before work begins.</p>
    <p className="offers-tax-note">Already a customer? <a href={customerBillingUrl}>Manage billing, invoices, and cancellations</a>.</p>
  </div>
}
