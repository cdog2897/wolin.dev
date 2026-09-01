import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import './App.css'

const appStoreUrl =
  'https://apps.apple.com/us/app/sparkz-couple-bucket-list/id6749107753'
const shalomUrl =
  'https://apps.apple.com/us/app/shalom-bible-reading-plan/id6661018829'
const bibleStoriesUrl =
  'https://apps.apple.com/us/app/christian-bible-stories/id6748326460'

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>
}

function ClientSightPreview() {
  const residents = [
    { initials: 'AD', location: 'Kern House', updated: 'just now', tone: 'blue' },
    { initials: 'KM', location: 'School', updated: '8m ago', tone: 'green' },
    { initials: 'JR', location: 'Appointment', updated: '22m ago', tone: 'orange' },
  ]

  return (
    <div className="client-app" role="img" aria-label="ClientSight interface preview with sample data">
      <aside className="client-sidebar">
        <div className="client-brand">
          <span className="client-brand-mark">C</span>
          <strong>ClientSight</strong>
        </div>
        <div className="client-nav">
          <span className="active">Overview</span>
          <span>Residents</span>
          <span>Activity</span>
          <span>Team</span>
        </div>
        <div className="client-org">
          <img src="/projects/kern-bridges-logo.png" alt="" />
          <span>Kern Bridges</span>
        </div>
      </aside>
      <div className="client-main">
        <div className="client-topbar">
          <span>Monday, August 31</span>
          <div className="client-user">CW</div>
        </div>
        <div className="client-content">
          <div className="client-title-row">
            <div>
              <span className="eyebrow">Live overview</span>
              <h4>Resident status</h4>
            </div>
            <span className="live-chip"><i /> All systems live</span>
          </div>
          <div className="metric-row">
            <div><strong>12</strong><span>Active residents</span></div>
            <div><strong>9</strong><span>Updated today</span></div>
            <div><strong>4</strong><span>Team members</span></div>
          </div>
          <div className="resident-list">
            <div className="resident-list-head">
              <span>Resident</span><span>Current location</span><span>Last update</span>
            </div>
            {residents.map((resident) => (
              <div className="resident-row" key={resident.initials}>
                <span className={`resident-avatar ${resident.tone}`}>{resident.initials}</span>
                <strong>{resident.initials}</strong>
                <span className="location-pill">{resident.location} <i>⌄</i></span>
                <span className="update-time"><i /> {resident.updated}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CreatorPreview() {
  return (
    <div className="creator-window" role="img" aria-label="Sparkz Creator editing interface preview">
      <div className="window-bar">
        <div><i /><i /><i /></div>
        <span>New vertical video</span>
        <span className="export-chip">Export</span>
      </div>
      <div className="creator-workspace">
        <aside className="creator-controls">
          <div className="control-title"><span>01</span> Footage</div>
          <div className="clip-choice active"><i />Mountain weekend</div>
          <div className="clip-choice"><i />Summer archive</div>
          <div className="control-title"><span>02</span> Format</div>
          <div className="format-grid"><b>9:16</b><b>1:1</b><b>16:9</b></div>
          <div className="control-title"><span>03</span> Overlay</div>
          <div className="fake-input">Make it count.</div>
        </aside>
        <div className="creator-canvas">
          <div className="video-frame">
            <img src="/projects/sparkz-hero.jpeg" alt="Couple shown in a video preview" />
            <strong>MAKE IT<br />COUNT.</strong>
            <span>00:07 / 00:12</span>
          </div>
        </div>
        <div className="creator-timeline">
          <div className="timeline-label"><span>Timeline</span><span>00:12.0</span></div>
          <div className="timeline-track">
            <i className="playhead" />
            <span /><span /><span /><span />
          </div>
          <div className="audio-track"><i>♪</i><span /></div>
        </div>
      </div>
    </div>
  )
}

function WorkCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'previous'>('next')
  const touchStartX = useRef<number | null>(null)

  const slides = [
    {
      id: 'sparkz',
      label: 'Sparkz',
      content: (
        <article className="project-slide project-slide-sparkz">
          <div className="project-copy">
            <div className="project-title-row">
              <img className="app-icon" src="/projects/sparkz-icon.jpg" alt="Sparkz app icon" />
              <div>
                <span className="project-index">01 / 05 · iOS app</span>
                <h3>Sparkz</h3>
              </div>
            </div>
            <p className="project-lede">
              A shared bucket list for couples who want to turn “someday” into real memories.
            </p>
            <dl className="project-facts">
              <div><dt>Rating</dt><dd>4.9 ★</dd></div>
              <div><dt>Platform</dt><dd>iPhone</dd></div>
              <div><dt>Downloads</dt><dd>7500+</dd></div>
            </dl>
            <a className="text-link" href={appStoreUrl} target="_blank" rel="noreferrer">
              View on the App Store <ArrowIcon />
            </a>
          </div>
          <div className="project-visual sparkz-project-visual" aria-label="Sparkz App Store screenshots">
            <div className="sparkz-gallery">
              <figure className="shot shot-main">
                <img src="/projects/sparkz-01.webp" alt="Sparkz App Store artwork featuring the bucket list map" />
              </figure>
              <figure className="shot shot-secondary">
                <img src="/projects/sparkz-02.webp" alt="Sparkz App Store artwork featuring an outdoor adventure" />
              </figure>
              <figure className="shot shot-tertiary">
                <img src="/projects/sparkz-03.webp" alt="Sparkz App Store artwork featuring couple planning tools" />
              </figure>
            </div>
          </div>
        </article>
      ),
    },
    {
      id: 'clientsight',
      label: 'ClientSight',
      content: (
        <article className="project-slide project-slide-clientsight">
          <div className="project-copy">
            <span className="project-index">02 / 05 · Web platform</span>
            <h3>ClientSight</h3>
            <p className="project-lede">
              A resident management software used by teams of people in foster homes.
            </p>
            <dl className="project-facts">
              <div><dt>Built for</dt><dd>Kern Bridges Youth Homes</dd></div>
              <div><dt>Access</dt><dd>Role-based</dd></div>
              <div><dt>Data</dt><dd>Realtime</dd></div>
            </dl>
            <div className="project-links">
              <a className="text-link" href="https://kernbridges.com/" target="_blank" rel="noreferrer">
                Kern Bridges <ArrowIcon />
              </a>
            </div>
          </div>
          <div className="project-visual clientsight-project-visual">
            <ClientSightPreview />
          </div>
        </article>
      ),
    },
    {
      id: 'shalom',
      label: 'Shalom',
      content: (
        <article className="project-slide project-slide-shalom">
          <div className="project-copy">
            <div className="project-title-row">
              <img className="app-icon" src="/projects/shalom-icon.jpg" alt="Shalom app icon" />
              <div>
                <span className="project-index">03 / 05 · iOS app</span>
                <h3>Shalom</h3>
              </div>
            </div>
            <p className="project-lede">
              A peaceful Bible reading companion for building custom plans,
              staying consistent, and seeing progress without pressure.
            </p>
            <div className="project-tags" aria-label="Shalom features">
              <span>Reading plans</span><span>Widgets</span><span>Focus timer</span>
            </div>
            <a className="text-link" href={shalomUrl} target="_blank" rel="noreferrer">
              View on the App Store <ArrowIcon />
            </a>
          </div>
          <div className="project-visual faith-project-visual shalom-project-visual">
            <figure><img src="/projects/shalom-01.webp" alt="Shalom App Store artwork featuring Bible reading plans" /></figure>
            <figure><img src="/projects/shalom-02.webp" alt="Shalom App Store artwork featuring its Bible plan creator" /></figure>
          </div>
        </article>
      ),
    },
    {
      id: 'creator',
      label: 'Sparkz Creator',
      content: (
        <article className="project-slide project-slide-creator">
          <div className="project-copy">
            <div className="project-title-row">
              <img className="creator-project-icon" src="/projects/sparkz-creator-icon.png" alt="Sparkz Creator icon" />
              <div>
                <span className="project-index">04 / 05 · Creative tool</span>
                <h3>Sparkz Creator</h3>
              </div>
            </div>
            <p className="project-lede">
              A short-form video production tool that turns organized footage,
              music, and text into polished social content.
            </p>
            <div className="project-tags" aria-label="Sparkz Creator technologies">
              <span>FastAPI</span><span>React</span><span>FFmpeg</span><span>macOS</span>
            </div>
          </div>
          <div className="project-visual creator-project-visual">
            <CreatorPreview />
          </div>
        </article>
      ),
    },
    {
      id: 'stories',
      label: 'Christian Bible Stories',
      content: (
        <article className="project-slide project-slide-stories">
          <div className="project-copy">
            <div className="project-title-row">
              <img className="app-icon" src="/projects/bible-stories-icon.jpg" alt="Christian Bible Stories app icon" />
              <div>
                <span className="project-index">05 / 05 · iOS app</span>
                <h3>Christian<br />Bible Stories</h3>
              </div>
            </div>
            <p className="project-lede">
              An audio-first library that brings Scripture and beloved Bible
              stories into commutes, bedtime routines, and family listening.
            </p>
            <div className="project-tags" aria-label="Christian Bible Stories features">
              <span>Audio stories</span><span>All ages</span><span>Scripture</span>
            </div>
            <a className="text-link" href={bibleStoriesUrl} target="_blank" rel="noreferrer">
              View on the App Store <ArrowIcon />
            </a>
          </div>
          <div className="project-visual faith-project-visual stories-project-visual">
            <figure><img src="/projects/bible-stories-01.webp" alt="Christian Bible Stories App Store artwork featuring its listening library" /></figure>
            <figure><img src="/projects/bible-stories-02.webp" alt="Christian Bible Stories App Store artwork featuring its listener rating" /></figure>
          </div>
        </article>
      ),
    },
  ]

  const move = (step: number) => {
    setDirection(step > 0 ? 'next' : 'previous')
    setActiveIndex((current) => (current + step + slides.length) % slides.length)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      move(1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      move(-1)
    }
  }

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return
    const distance = touchStartX.current - (event.changedTouches[0]?.clientX ?? touchStartX.current)
    touchStartX.current = null
    if (Math.abs(distance) > 48) move(distance > 0 ? 1 : -1)
  }

  const selectSlide = (index: number) => {
    setDirection(index > activeIndex ? 'next' : 'previous')
    setActiveIndex(index)
  }

  return (
    <section
      className="work-carousel"
      id="work"
      aria-labelledby="work-title"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="carousel-header">
        <div>
          <div className="section-label">
            <span>01</span>
            <span>Selected work</span>
          </div>
          <h2 id="work-title">My projects are in production with <em>real users.</em></h2>
        </div>
      </div>

      <div className="carousel-viewport">
        <div className={`carousel-slide carousel-slide-${direction}`} key={slides[activeIndex].id}>
          {slides[activeIndex].content}
        </div>
      </div>

      <div className="carousel-controls">
        <div className="carousel-pagination" aria-label="Choose a project">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              onClick={() => selectSlide(index)}
              className={index === activeIndex ? 'active' : ''}
              aria-label={`Show project ${index + 1}: ${slide.label}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <i />
            </button>
          ))}
        </div>
        <div className="carousel-buttons">
          <button type="button" onClick={() => move(-1)} aria-label="Show previous project">
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Show next project">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}

const amexRoles = [
  {
    id: 'internship',
    index: '01',
    label: 'Internship',
    period: '2023',
    summary:
      'Worked on an internal audit tool that helped streamline review and compliance workflows.',
    skills: [
      { name: 'React', logo: '/brands/tech/react.svg' },
      { name: 'TypeScript', logo: '/brands/tech/typescript.svg' },
      { name: 'APIs', logo: null },
      { name: 'Node.js', logo: '/brands/tech/nodejs.svg' },
    ],
  },
  {
    id: 'full-time',
    index: '02',
    label: 'Full-time',
    period: '2024-2026',
    summary:
      'Built scalable, resilient backend services and enterprise APIs for a security-first financial environment.',
    skills: [
      { name: 'Java', logo: '/brands/tech/java.svg' },
      { name: 'Vert.x', logo: '/brands/tech/vertx.svg' },
      { name: 'REST APIs', logo: null },
      { name: 'Python', logo: '/brands/tech/python.svg' },
      { name: 'Docker', logo: '/brands/tech/docker.svg' },
      { name: 'Google Cloud', logo: '/brands/tech/google-cloud.svg' },
    ],
  },
]

function AmexExperience() {
  const [activeRole, setActiveRole] = useState(1)
  const role = amexRoles[activeRole]

  return (
    <section id="experience" className="amex-experience" aria-labelledby="experience-title">
      <div className="amex-inner">
        <div className="section-label amex-section-label">
          <span>02</span>
          <span>Work experience</span>
        </div>

        <div className="amex-intro">
          <h2 id="experience-title">Experience at <em>real-world scale</em></h2>
          <p>
            At American Express, I grew from intern to software engineer while
            building backend systems for a security- and reliability-first
            enterprise environment.
          </p>
          <img
            className="amex-logo"
            src="/brands/american-express.png"
            alt="American Express"
          />
        </div>

        <div className="amex-timeline">
          <div className="amex-timeline-nav" role="tablist" aria-label="American Express career timeline">
            <span
              className={`amex-timeline-progress ${activeRole === 1 ? 'is-complete' : ''}`}
              aria-hidden="true"
            />
            {amexRoles.map((item, index) => (
              <button
                type="button"
                role="tab"
                id={`amex-tab-${item.id}`}
                aria-controls={`amex-panel-${item.id}`}
                aria-selected={activeRole === index}
                className={`amex-timeline-point ${activeRole === index ? 'active' : ''}`}
                key={item.id}
                onClick={() => setActiveRole(index)}
              >
                <span className="amex-point-marker">{item.index}</span>
                <strong>{item.label}</strong>
                <span>{item.period}</span>
              </button>
            ))}
          </div>

          <div
            className="amex-role-detail"
            role="tabpanel"
            id={`amex-panel-${role.id}`}
            aria-labelledby={`amex-tab-${role.id}`}
            key={role.id}
          >
            <p className="amex-role-description">{role.summary}</p>
            <ul className="amex-skills" aria-label={`${role.label} technologies`}>
              {role.skills.map((skill) => (
                <li className="amex-skill" key={skill.name}>
                  <span className={`amex-skill-mark ${skill.logo ? '' : 'is-generic'}`} aria-hidden="true">
                    {skill.logo ? <img src={skill.logo} alt="" /> : <span>{'{ }'}</span>}
                  </span>
                  <span className="amex-skill-name">{skill.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#work">
        Skip to selected work
      </a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Caleb Wolin, home">
          wolin.dev
        </a>
        <a className="header-name" href="#contact" aria-label="Contact Caleb Wolin">
          Caleb Wolin
        </a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-kicker">
            <span>2026 portfolio</span>
          </div>
          <div className="hero-main">
            <div className="portrait-cluster" aria-label="Portraits of Caleb Wolin">
              <figure className="portrait portrait-one" tabIndex={0}>
                <span className="portrait-frame">
                  <img src="/portraits/caleb-headshot.jpg" alt="Caleb Wolin smiling outdoors" />
                </span>
              </figure>
              <figure className="portrait portrait-two" tabIndex={0}>
                <span className="portrait-frame">
                  <img src="/portraits/caleb-desert-truck.jpg" alt="Caleb relaxing beside a truck in the desert" />
                </span>
              </figure>
              <figure className="portrait portrait-three" tabIndex={0}>
                <span className="portrait-frame">
                  <img src="/portraits/caleb-salt-flats-car.jpg" alt="Caleb sitting on a car at the salt flats" />
                </span>
              </figure>
              <figure className="portrait portrait-four" tabIndex={0}>
                <span className="portrait-frame">
                  <img src="/portraits/caleb-mountain-couple.jpg" alt="Caleb and his partner in the mountains" />
                </span>
              </figure>
              <figure className="portrait portrait-five" tabIndex={0}>
                <span className="portrait-frame">
                  <img src="/portraits/caleb-sedona-couple.jpg" alt="Caleb and his partner hiking in Sedona" />
                </span>
              </figure>
            </div>

            <h1 id="hero-title">
              I'm Caleb Wolin, a software engineer and <em>designer.</em>
            </h1>
          </div>
          <div className="hero-foot">
            <p>
              I design and ship native apps, web platforms, and creative tools—from
              the first sketch to the final build.
            </p>
            <a className="round-link" href="#work" aria-label="Explore selected work">
              <span>Explore</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <WorkCarousel />

        <AmexExperience />

        <section id="ai" className="ai-section" aria-labelledby="ai-title">
          <div className="section-label">
            <span>03</span>
            <span>AI proficiency</span>
          </div>

          <div className="ai-intro">
            <div className="ai-logo-cluster" role="img" aria-label="ChatGPT, Claude, and Cursor">
              <span className="ai-cluster-logo ai-cluster-chatgpt">
                <img src="/brands/chatgpt.svg" alt="" />
              </span>
              <span className="ai-cluster-logo ai-cluster-claude">
                <img src="/brands/claude.svg" alt="" />
              </span>
              <span className="ai-cluster-logo ai-cluster-cursor">
                <img src="/brands/cursor.svg" alt="" />
              </span>
            </div>
            <h2 id="ai-title">On the cutting edge of <em>AI</em></h2>
            <p>
              I use AI as a practical collaborator across product thinking,
              design, development, and delivery—moving faster while keeping the
              judgment, taste, and final decisions human.
            </p>
          </div>
        </section>

      </main>

      <footer id="contact" className="site-footer">
        <div className="footer-top">
          <span className="availability-badge">
            <span aria-hidden="true" />
            Looking for part-time work
          </span>
          <h2>Let’s <em>connect.</em></h2>
          <div className="footer-contact" aria-label="Contact Caleb Wolin">
            <a href="mailto:caleb.wolin@gmail.com">caleb.wolin@gmail.com</a>
            <a href="tel:+12088108089">+1 (208) 810-8089</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Caleb Wolin © 2026</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </div>
  )
}

export default App
