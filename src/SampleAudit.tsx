import './SampleAudit.css'

type Finding = {
  check: string
  data: string
  score: number
  note: string
}

type AuditArea = {
  key: 'gbp' | 'website' | 'ai'
  title: string
  score: number
  metrics: { value: string; label: string }[]
  findings: Finding[]
}

const report = {
  business: 'Willow & Pine Coffee',
  website: 'willowandpine.example',
  websiteUrl: 'https://willowandpine.example',
  date: 'September 18, 2026',
  label: 'Business visibility audit',
  overallScore: 68,
  overview: 'Strong reputation and a healthy technical base. The largest gains are available from complete GBP services, dedicated commercial pages, stronger mobile actions, and more consistent facts across AI sources.',
  areas: [
    {
      key: 'gbp',
      title: 'Google Business Profile',
      score: 7.0,
      metrics: [
        { value: '4.9', label: 'Rating' },
        { value: '184', label: 'Reviews' },
        { value: '61%', label: 'Response rate' },
      ],
      findings: [
        { check: 'NAP + pin', data: '0 conflicts across 12 sources', score: 9, note: 'Recheck quarterly.' },
        { check: 'Categories', data: '1 primary; 1 secondary', score: 7, note: 'Test Cafe + Event venue.' },
        { check: 'Services', data: '6 listed; 4 priority services absent', score: 4, note: 'Add catering, wholesale, pickup and events.' },
        { check: 'Description', data: '486 / 750 characters used', score: 6, note: 'Add service and neighborhood terms.' },
        { check: 'Hours + attributes', data: 'Special hours set; 3 attributes blank', score: 8, note: 'Complete accessibility and service options.' },
        { check: 'Review velocity', data: '+22 reviews in 90 days; 4.9 average', score: 9, note: 'Maintain steady request cadence.' },
        { check: 'Owner response', data: '61% answered; 12-day median', score: 5, note: 'Target 90% within 72 hours.' },
        { check: 'Media + posts', data: '4 photos; 0 posts in 90 days', score: 4, note: 'Publish weekly proof and offers.' },
        { check: 'Action tracking', data: 'Website and menu links lack UTMs', score: 3, note: 'Tag every profile action URL.' },
      ],
    },
    {
      key: 'website',
      title: 'Website',
      score: 6.3,
      metrics: [
        { value: '2.4s', label: 'Mobile LCP' },
        { value: '8/8', label: 'Pages indexed' },
        { value: '0', label: 'Service pages' },
      ],
      findings: [
        { check: 'Index coverage', data: '8 of 8 core URLs indexed', score: 9, note: 'Add service URLs to sitemap.' },
        { check: 'Core Web Vitals', data: 'LCP 2.4s · INP 168ms · CLS .08', score: 8, note: 'Compress hero media to protect LCP.' },
        { check: 'Mobile conversion', data: 'Primary CTA begins 1.4 screens down', score: 5, note: 'Place order, call and directions above fold.' },
        { check: 'Service intent', data: 'No catering or wholesale landing pages', score: 2, note: 'Build one page per revenue service.' },
        { check: 'Titles + metadata', data: '3 generic titles; 2 duplicate descriptions', score: 6, note: 'Map each page to one local intent.' },
        { check: 'Structured data', data: 'LocalBusiness valid; Menu and FAQ absent', score: 6, note: 'Add linked service, menu and FAQ entities.' },
        { check: 'Accessibility', data: '2 contrast failures; 1 unlabeled field', score: 7, note: 'Repair form label and muted text contrast.' },
        { check: 'Local trust', data: 'Address absent from footer; map buried', score: 5, note: 'Repeat NAP and directions sitewide.' },
        { check: 'Conversion tracking', data: 'Form tracked; calls and orders untracked', score: 4, note: 'Create call, order and direction events.' },
      ],
    },
    {
      key: 'ai',
      title: 'AI visibility',
      score: 4.8,
      metrics: [
        { value: '5/12', label: 'Prompt mentions' },
        { value: '2/12', label: 'Owned citations' },
        { value: '9/15', label: 'Facts correct' },
      ],
      findings: [
        { check: 'Discovery coverage', data: 'Mentioned in 5 of 12 fixed prompts', score: 4, note: 'Build pages for missing local intents.' },
        { check: 'Owned citations', data: 'Website cited in 2 of 12 prompts', score: 2, note: 'Create quotable service and FAQ answers.' },
        { check: 'Fact accuracy', data: '9 of 15 tested facts returned correctly', score: 6, note: 'Align hours, services and price signals.' },
        { check: 'Service understanding', data: 'Catering omitted in 2 branded answers', score: 5, note: 'Reinforce catering across trusted sources.' },
        { check: 'Entity consistency', data: 'NAP matches site, GBP and schema', score: 9, note: 'Maintain one canonical fact set.' },
        { check: 'Machine-readable facts', data: '2 sameAs links; service graph incomplete', score: 5, note: 'Connect profiles, services and location.' },
        { check: 'Crawler access', data: '8 of 8 public pages accessible', score: 9, note: 'Monitor bot rules after releases.' },
        { check: 'Third-party authority', data: '3 directory citations; no local press', score: 4, note: 'Earn local coverage and niche citations.' },
        { check: 'Answer-ready content', data: '0 FAQs; key policies only in navigation', score: 3, note: 'Publish concise, sourced customer answers.' },
      ],
    },
  ] satisfies AuditArea[],
  roadmap: [
    { phase: '01', timing: 'Days 1–7', title: 'Fix the foundation', work: 'Complete GBP services and attributes, add UTMs, align facts, and establish call/order/direction events.' },
    { phase: '02', timing: 'Weeks 2–4', title: 'Build conversion paths', work: 'Launch catering and wholesale pages, move mobile actions above the fold, and repair titles, metadata and accessibility.' },
    { phase: '03', timing: 'Weeks 5–8', title: 'Strengthen authority', work: 'Adopt a 72-hour review SLA, publish weekly GBP media, add FAQ/menu schema, and earn local citations.' },
    { phase: '04', timing: 'Weeks 9–12', title: 'Measure and iterate', work: 'Compare leads by source, rerun the 12-prompt AI test, validate facts, and prioritize the next lowest scoring checks.' },
  ],
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="onepage-score-ring" style={{ '--score': score } as React.CSSProperties} aria-label={`${score} out of 100`}>
      <div><strong>{score}</strong><span>/100</span></div>
    </div>
  )
}

function CheckScore({ score }: { score: number }) {
  const tone = score >= 8 ? 'strong' : score >= 6 ? 'fair' : 'weak'
  return <span className={`onepage-check-score is-${tone}`} aria-label={`${score} out of 10`}>{score}<small>/10</small></span>
}

function GbpSnapshot() {
  return (
    <figure className="onepage-gbp-shot">
      <img src="/sample-gbp-snapshot.svg" alt="Illustrative Google Business Profile screenshot for Willow and Pine Coffee" />
      <figcaption><span>GBP capture</span><b>Public profile · desktop</b><em>Sample</em></figcaption>
    </figure>
  )
}

function AreaReport({ area }: { area: AuditArea }) {
  return (
    <section className={`onepage-area onepage-area-${area.key}`} aria-labelledby={`${area.key}-title`}>
      <header>
        <div><span>Technical analysis</span><h2 id={`${area.key}-title`}>{area.title}</h2></div>
        <div className="onepage-area-score"><strong>{area.score}</strong><span>/10</span></div>
      </header>

      {area.key === 'gbp' && <GbpSnapshot />}

      <div className="onepage-metrics">
        {area.metrics.map((metric) => (
          <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
        ))}
      </div>

      <div className="onepage-findings">
        <div className="onepage-findings-head"><span>Check</span><span>Observed data + improvement</span><span>Score</span></div>
        {area.findings.map((finding) => (
          <div className="onepage-finding" key={finding.check}>
            <strong>{finding.check}</strong>
            <p><span>{finding.data}</span><em>{finding.note}</em></p>
            <CheckScore score={finding.score} />
          </div>
        ))}
      </div>
    </section>
  )
}

function SampleAudit() {
  return (
    <div className="onepage-shell">
      <a className="onepage-skip" href="#analysis">Skip to analysis</a>

      <aside className="onepage-sample-note">
        <strong>Sample audit</strong>
        <span>Fictional business · Illustrative data</span>
      </aside>

      <main className="onepage-report" id="analysis">
        <header className="onepage-header">
          <a href="/" className="onepage-wordmark" aria-label="Wolin home">wolin.dev</a>
          <div className="onepage-report-meta"><span>{report.date}</span><strong>{report.label}</strong></div>
          <button type="button" onClick={() => window.print()}>Print / save PDF ↗</button>
        </header>

        <section className="onepage-overview" aria-labelledby="report-title">
          <div className="onepage-business">
            <h1 id="report-title">{report.business}</h1>
            <a href={report.websiteUrl} target="_blank" rel="noreferrer">{report.website} ↗</a>
          </div>
          <div className="onepage-score">
            <ScoreRing score={report.overallScore} />
            <div><span>Overall score</span><p>{report.overview}</p></div>
          </div>
        </section>

        <div className="onepage-areas">
          {report.areas.map((area) => <AreaReport area={area} key={area.key} />)}
        </div>

        <section className="onepage-roadmap" aria-labelledby="roadmap-title">
          <header><span>Recommended plan</span><h2 id="roadmap-title">90-day roadmap</h2></header>
          <div className="onepage-roadmap-list">
            {report.roadmap.map((item) => (
              <article key={item.phase}>
                <div><b>{item.phase}</b><span>{item.timing}</span></div>
                <strong>{item.title}</strong>
                <p>{item.work}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="onepage-footer">
          <p><strong>Scope:</strong> Public-source snapshot. Scores reflect observed evidence available on the audit date; owner-only analytics and profile controls require access.</p>
          <div><span>Prepared by Wolin</span><a href="mailto:caleb.wolin@gmail.com">caleb.wolin@gmail.com</a><a href="tel:+12088108089">(208) 810-8089</a></div>
        </footer>
      </main>
    </div>
  )
}

export default SampleAudit
