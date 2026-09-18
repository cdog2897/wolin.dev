import './SampleAudit.css'

type AuditStatus = 'Pass' | 'Improve' | 'Verify'

type Finding = {
  check: string
  data: string
  status: AuditStatus
}

type AuditArea = {
  key: string
  title: string
  score: number
  metrics: { value: string; label: string }[]
  findings: Finding[]
}

const report = {
  business: 'Willow & Pine Coffee',
  descriptor: 'Independent coffee shop · Boise, Idaho',
  website: 'willowandpine.example',
  date: 'September 18, 2026',
  id: 'WOL-260918-014',
  overallScore: 68,
  overview: 'Strong customer reputation and a healthy technical base. Growth is limited by incomplete GBP services, missing commercial pages, weak mobile actions, and inconsistent AI citations.',
  areas: [
    {
      key: 'gbp',
      title: 'Google Business Profile',
      score: 78,
      metrics: [
        { value: '4.9', label: 'Rating' },
        { value: '184', label: 'Reviews' },
        { value: '61%', label: 'Response rate' },
      ],
      findings: [
        { check: 'Service coverage', data: '6 listed; 4 priority services missing', status: 'Improve' },
        { check: 'Review response', data: '61%; median response time 12 days', status: 'Improve' },
        { check: 'Owner media', data: '4 photos added in the last 90 days', status: 'Improve' },
        { check: 'Profile actions', data: 'Links work; no consistent UTM tags', status: 'Improve' },
        { check: 'Core business data', data: 'Name, category, hours, phone and pin match', status: 'Pass' },
      ],
    },
    {
      key: 'website',
      title: 'Website',
      score: 63,
      metrics: [
        { value: '2.4s', label: 'Mobile LCP' },
        { value: '8', label: 'Indexable pages' },
        { value: '0', label: 'Service pages' },
      ],
      findings: [
        { check: 'Service intent', data: 'No dedicated catering or wholesale page', status: 'Improve' },
        { check: 'Mobile conversion', data: 'Primary action appears after 1.4 screens', status: 'Improve' },
        { check: 'On-page SEO', data: '3 secondary pages use generic titles', status: 'Improve' },
        { check: 'Structured data', data: 'LocalBusiness present; service links incomplete', status: 'Improve' },
        { check: 'Indexability', data: 'HTTPS, canonicals and core pages are healthy', status: 'Pass' },
      ],
    },
    {
      key: 'ai',
      title: 'AI visibility',
      score: 44,
      metrics: [
        { value: '42%', label: 'Mention rate' },
        { value: '17%', label: 'Owned citations' },
        { value: '60%', label: 'Fact accuracy' },
      ],
      findings: [
        { check: 'Recommendation tests', data: 'Mentioned in 5 of 12 fixed prompts', status: 'Improve' },
        { check: 'Owned citations', data: 'Business website cited in 2 of 12 prompts', status: 'Improve' },
        { check: 'Service understanding', data: 'Catering omitted in 2 branded answers', status: 'Improve' },
        { check: 'Fact accuracy', data: '1 answer used an incorrect weekend close', status: 'Improve' },
        { check: 'Crawler access', data: 'Priority public pages accessible in test', status: 'Pass' },
      ],
    },
  ] satisfies AuditArea[],
  priorities: [
    { rank: '01', action: 'Add four missing GBP services and tracked action URLs', area: 'GBP', impact: 'High' },
    { rank: '02', action: 'Create a catering page with a focused quote form', area: 'Website', impact: 'High' },
    { rank: '03', action: 'Move Order, Directions and Catering into the first mobile screen', area: 'Website', impact: 'High' },
    { rank: '04', action: 'Align service facts across schema and trusted listings', area: 'AI', impact: 'Medium' },
    { rank: '05', action: 'Verify call, form, order and GBP attribution in analytics', area: 'Measurement', impact: 'High' },
  ],
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="onepage-score-ring" style={{ '--score': score } as React.CSSProperties} aria-label={`${score} out of 100`}>
      <div><strong>{score}</strong><span>/100</span></div>
    </div>
  )
}

function Status({ value }: { value: AuditStatus }) {
  return <span className={`onepage-status is-${value.toLowerCase()}`}>{value}</span>
}

function AreaReport({ area }: { area: AuditArea }) {
  return (
    <section className="onepage-area" aria-labelledby={`${area.key}-title`}>
      <header>
        <div><span>Technical analysis</span><h2 id={`${area.key}-title`}>{area.title}</h2></div>
        <div className="onepage-area-score"><strong>{area.score}</strong><span>/100</span></div>
      </header>

      <div className="onepage-metrics">
        {area.metrics.map((metric) => (
          <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
        ))}
      </div>

      <div className="onepage-findings">
        <div className="onepage-findings-head"><span>Check</span><span>Observed data</span><span>Status</span></div>
        {area.findings.map((finding) => (
          <div className="onepage-finding" key={finding.check}>
            <strong>{finding.check}</strong>
            <p>{finding.data}</p>
            <Status value={finding.status} />
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
          <div className="onepage-report-meta"><span>{report.date}</span><span>{report.id}</span></div>
          <button type="button" onClick={() => window.print()}>Print / save PDF ↗</button>
        </header>

        <section className="onepage-overview" aria-labelledby="report-title">
          <div className="onepage-business">
            <span>Small-business visibility audit</span>
            <h1 id="report-title">{report.business}</h1>
            <p>{report.descriptor} · {report.website}</p>
          </div>
          <div className="onepage-score">
            <ScoreRing score={report.overallScore} />
            <div><span>Overall score</span><p>{report.overview}</p></div>
          </div>
        </section>

        <div className="onepage-areas">
          {report.areas.map((area) => <AreaReport area={area} key={area.key} />)}
        </div>

        <section className="onepage-priorities" aria-labelledby="priority-title">
          <header><span>Recommended work</span><h2 id="priority-title">Priority actions</h2></header>
          <div className="onepage-priority-list">
            {report.priorities.map((item) => (
              <div key={item.rank}>
                <span className="onepage-priority-rank">{item.rank}</span>
                <strong>{item.action}</strong>
                <span>{item.area}</span>
                <b>{item.impact}</b>
              </div>
            ))}
          </div>
        </section>

        <footer className="onepage-footer">
          <p><strong>Scope:</strong> Public-source snapshot. Owner-only analytics and profile controls are excluded until access is provided.</p>
          <div><span>Prepared by Wolin</span><a href="mailto:caleb.wolin@gmail.com">caleb.wolin@gmail.com</a><a href="tel:+12088108089">(208) 810-8089</a></div>
        </footer>
      </main>
    </div>
  )
}

export default SampleAudit
