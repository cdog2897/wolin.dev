import { ArrowIcon } from './DecorativeIcon'
import ServiceAreaMap from './ServiceAreaMap'
import './ServiceAreas.css'

const services = [
  {
    name: 'Social media management',
    description: 'Content strategy, photo and video production, editing, captions, scheduling, and publishing for Instagram, Facebook, and TikTok.',
    path: '/social-media-management',
    link: 'Explore social media',
  },
  {
    name: 'Web design',
    description: 'Custom, mobile-friendly websites that make your services clear and help customers take the next step, with ongoing website care available.',
    path: '/web-design',
    link: 'Explore web design',
  },
]

export default function ServiceAreas() {
  return <article className="service-page service-areas-page">
    <header className="service-areas-intro">
      <div className="service-areas-copy">
        <span className="business-eyebrow"><i />Our service areas</span>
        <h1>Laramie,<br />Cheyenne &amp;<br />Fort Collins.</h1>
        <p>Wolin Studio helps businesses in Laramie, Cheyenne, and Fort Collins show up online with social media management and custom web design.</p>
        <a className="business-pill-button" href="#contact">Let’s talk about your business <ArrowIcon /></a>
      </div>
      <ServiceAreaMap />
    </header>

    <section className="service-areas-services" aria-labelledby="service-areas-services-title">
      <div className="service-areas-services-heading">
        <span className="business-eyebrow">Made for your business</span>
        <h2 id="service-areas-services-title">Your city. <em>Our creative energy.</em></h2>
        <p>The same services are available across all three cities. Start with what your business needs.</p>
      </div>
      <div className="service-areas-services-grid">{services.map(service => <section className="service-areas-service" key={service.path} aria-labelledby={`area-${service.path.slice(1)}`}>
        <h3 id={`area-${service.path.slice(1)}`}>{service.name}</h3>
        <p>{service.description}</p>
        <a className="business-text-link" href={service.path}>{service.link} <ArrowIcon /></a>
      </section>)}</div>
    </section>

    <section className="service-areas-next" aria-labelledby="service-areas-next-title">
      <div><h2 id="service-areas-next-title">Let’s make something <em>good.</em></h2><p>Tell us about your business and what you have in mind. We’ll help you find a starting point.</p></div>
      <a className="business-text-link" href="/offers">Explore packages and custom work <ArrowIcon /></a>
    </section>
  </article>
}
