import './SampleAudit.css'

type Status = 'Pass' | 'Monitor' | 'Needs work' | 'Not verified'

type AuditRow = {
  check: string
  status: Status
  evidence: string
  recommendation: string
}

const report = {
  business: {
    name: 'Willow & Pine Coffee',
    category: 'Independent coffee shop',
    location: 'Boise, Idaho',
    website: 'willowandpine.example',
  },
  meta: {
    prepared: 'September 18, 2026',
    reportId: 'WOL-260918-014',
    scope: 'Public visibility audit',
  },
  overall: {
    score: 68,
    label: 'Good foundation',
    summary: 'Willow & Pine has a strong local reputation and a credible brand. The largest growth opportunities are service-page coverage, mobile conversion paths, profile completeness, and clearer third-party signals for AI discovery.',
  },
  overviewMetrics: [
    { value: '4.9', label: 'Google rating', detail: '184 reviews' },
    { value: '#7', label: 'Average map position', detail: '12 tracked local queries' },
    { value: '63', label: 'Website score', detail: 'Out of 100' },
    { value: '42%', label: 'AI mention rate', detail: '5 of 12 test prompts' },
  ],
  scoreSummary: [
    { area: 'Google Business Profile', score: 78, status: 'Healthy', keyFinding: 'Strong reviews; service coverage and tracking need work.' },
    { area: 'Website', score: 63, status: 'Needs attention', keyFinding: 'Good brand experience; weak service-page coverage and mobile actions.' },
    { area: 'AI visibility', score: 44, status: 'Early opportunity', keyFinding: 'Recognized by name but rarely recommended for specific needs.' },
  ],
  strengths: [
    '4.9-star Google rating with detailed, recent customer feedback',
    'Consistent business name, location, phone, and visual identity',
    'Fast, secure website with a strong branded mobile presentation',
    'Clear local connection and original business photography',
  ],
  risks: [
    'Four priority services are missing from the Google profile',
    'No dedicated page targets catering or office coffee demand',
    'Primary mobile actions appear below the first screen',
    'Profile and campaign links do not use consistent attribution',
  ],
  gbp: {
    score: 78,
    summary: 'The profile is accurate and trusted, but incomplete service data and inconsistent activity limit discovery beyond branded searches.',
    metrics: [
      { value: '4.9', label: 'Average rating', detail: 'Strong vs. local competitors' },
      { value: '184', label: 'Total reviews', detail: '+21 in the last 90 days' },
      { value: '61%', label: 'Owner response rate', detail: 'Target: 90%+' },
      { value: '42', label: 'Owner photos', detail: '4 added in the last 90 days' },
    ],
    reviewDistribution: [
      { stars: '5 star', count: 166, percent: 90 },
      { stars: '4 star', count: 10, percent: 5 },
      { stars: '3 star', count: 3, percent: 2 },
      { stars: '2 star', count: 2, percent: 1 },
      { stars: '1 star', count: 3, percent: 2 },
    ],
    checks: [
      { check: 'Ownership and verification', status: 'Pass', evidence: 'Profile is claimed, verified, and actively managed.', recommendation: 'Keep the primary owner on a business-controlled account.' },
      { check: 'Business name and category', status: 'Pass', evidence: 'Name matches the website; Coffee shop is an accurate primary category.', recommendation: 'Review secondary categories quarterly.' },
      { check: 'Services', status: 'Needs work', evidence: '6 services listed. Catering, private events, pour-over service, and wholesale beans are absent.', recommendation: 'Add the four missing services with concise descriptions.' },
      { check: 'Hours and contact details', status: 'Pass', evidence: 'Hours, phone, address, and map pin match the website.', recommendation: 'Schedule holiday hours at least two weeks ahead.' },
      { check: 'Website and action links', status: 'Monitor', evidence: 'Links work but do not use a consistent UTM convention.', recommendation: 'Add source, medium, and campaign parameters to every profile action.' },
      { check: 'Photos and video', status: 'Monitor', evidence: 'Strong library, but only 4 owner photos were added in the last 90 days.', recommendation: 'Add two current owner photos each month across services, team, and products.' },
      { check: 'Review responses', status: 'Needs work', evidence: '61% response rate; median observed response time is 12 days.', recommendation: 'Reply weekly and prioritize recent critical or specific feedback.' },
      { check: 'Posts and updates', status: 'Monitor', evidence: 'Most recent post is 47 days old.', recommendation: 'Publish useful service, product, or event updates twice monthly.' },
    ] as AuditRow[],
    rankings: [
      { query: 'coffee shop boise', mapPosition: '7.1', organicPosition: '11', trend: 'Stable' },
      { query: 'coffee near downtown boise', mapPosition: '4.3', organicPosition: '8', trend: 'Up 2' },
      { query: 'local coffee roaster boise', mapPosition: '9.4', organicPosition: '18', trend: 'Down 1' },
      { query: 'coffee catering boise', mapPosition: '—', organicPosition: 'Not in top 20', trend: 'Opportunity' },
    ],
    actions: [
      { priority: '1', action: 'Complete the GBP services catalog', impact: 'High', effort: 'Quick win' },
      { priority: '2', action: 'Add tracked URLs to every profile action', impact: 'Medium', effort: 'Quick win' },
      { priority: '3', action: 'Establish weekly review-response ownership', impact: 'Medium', effort: 'Ongoing' },
      { priority: '4', action: 'Add two current owner photos per month', impact: 'Medium', effort: 'Ongoing' },
    ],
  },
  website: {
    score: 63,
    summary: 'The website is technically stable and visually credible. Search coverage and the path from interest to action are the principal constraints.',
    metrics: [
      { value: '8', label: 'Indexable pages', detail: 'Only 3 target commercial intent' },
      { value: '2.4s', label: 'Mobile LCP', detail: 'Within good threshold' },
      { value: '1.4', label: 'Screens to primary CTA', detail: 'Measured at 390px wide' },
      { value: '0', label: 'Dedicated service pages', detail: 'For catering and wholesale' },
    ],
    checks: [
      { check: 'HTTPS and indexability', status: 'Pass', evidence: 'Preferred HTTPS host resolves; core pages are indexable.', recommendation: 'Continue monitoring Search Console coverage.' },
      { check: 'Titles and descriptions', status: 'Monitor', evidence: 'Homepage is clear; three secondary pages use generic titles.', recommendation: 'Write unique titles and descriptions around each page’s purpose.' },
      { check: 'Service-page coverage', status: 'Needs work', evidence: 'Catering and wholesale are mentioned only on the homepage.', recommendation: 'Create useful dedicated pages beginning with catering.' },
      { check: 'Local business schema', status: 'Monitor', evidence: 'Basic LocalBusiness markup is present; service and sameAs detail is incomplete.', recommendation: 'Align schema with visible business and service facts.' },
      { check: 'Internal linking', status: 'Needs work', evidence: 'Menu, story, and visit pages do not link contextually to commercial offers.', recommendation: 'Add descriptive links between services, proof, and contact paths.' },
      { check: 'Mobile call to action', status: 'Needs work', evidence: 'Order and directions actions appear after 1.4 viewports.', recommendation: 'Place Order, Directions, and Catering actions below the opening copy.' },
      { check: 'Forms and booking', status: 'Monitor', evidence: 'General contact works; no dedicated catering qualification flow exists.', recommendation: 'Add a short catering form with date, guest count, location, and response expectation.' },
      { check: 'Measurement', status: 'Not verified', evidence: 'Analytics and Search Console require owner access.', recommendation: 'Verify conversions, channel attribution, and search performance with account access.' },
    ] as AuditRow[],
    pageCoverage: [
      { intent: 'Brand / visit', currentPage: 'Homepage', quality: 'Strong', opportunity: 'Maintain' },
      { intent: 'Menu', currentPage: 'Menu page', quality: 'Good', opportunity: 'Add text and dietary details' },
      { intent: 'Coffee catering', currentPage: 'No dedicated page', quality: 'Missing', opportunity: 'High priority' },
      { intent: 'Wholesale beans', currentPage: 'No dedicated page', quality: 'Missing', opportunity: 'Medium priority' },
      { intent: 'Local coffee roaster', currentPage: 'Story page', quality: 'Partial', opportunity: 'Expand proof and process' },
    ],
    actions: [
      { priority: '1', action: 'Create a catering service page and focused quote form', impact: 'High', effort: 'Small project' },
      { priority: '2', action: 'Move key mobile actions into the first screen', impact: 'High', effort: 'Quick win' },
      { priority: '3', action: 'Improve secondary-page titles and internal links', impact: 'Medium', effort: 'Quick win' },
      { priority: '4', action: 'Verify conversion and search measurement', impact: 'High', effort: 'Small project' },
    ],
  },
  ai: {
    score: 44,
    summary: 'AI systems usually understand the business when asked by name, but they do not consistently recommend it for high-value local needs.',
    metrics: [
      { value: '42%', label: 'Mention rate', detail: '5 of 12 prompts' },
      { value: '17%', label: 'Owned-site citation rate', detail: '2 of 12 prompts' },
      { value: '60%', label: 'Fact accuracy', detail: 'When the business is mentioned' },
      { value: '2 / 4', label: 'Platforms with mentions', detail: 'Across the fixed test set' },
    ],
    tests: [
      { prompt: 'Best independent coffee shop in Boise', platform: 'ChatGPT', mentioned: 'No', source: 'Competitor sites', accuracy: '—' },
      { prompt: 'Coffee catering for a Boise office', platform: 'ChatGPT', mentioned: 'No', source: 'Directories', accuracy: '—' },
      { prompt: 'Where can I buy locally roasted beans?', platform: 'Gemini', mentioned: 'Yes', source: 'Directory', accuracy: 'Partial' },
      { prompt: 'What is Willow & Pine Coffee known for?', platform: 'Copilot', mentioned: 'Yes', source: 'Business website', accuracy: 'Accurate' },
      { prompt: 'Quiet coffee shops for a meeting in Boise', platform: 'Perplexity', mentioned: 'Yes', source: 'Customer reviews', accuracy: 'Accurate' },
      { prompt: 'Independent coffee roasters near Boise', platform: 'ChatGPT', mentioned: 'Yes', source: 'Business website', accuracy: 'Partial' },
    ],
    checks: [
      { check: 'Business entity clarity', status: 'Pass', evidence: 'Name, category, location, phone, and website are consistent on primary sources.', recommendation: 'Preserve one source of truth for every business fact.' },
      { check: 'Crawler access', status: 'Pass', evidence: 'Public priority pages are accessible to major search crawlers in the public test.', recommendation: 'Recheck after hosting, CDN, or security changes.' },
      { check: 'Service clarity', status: 'Needs work', evidence: 'Catering and wholesale facts are scattered and lack dedicated URLs.', recommendation: 'Publish explicit, answerable service information on dedicated pages.' },
      { check: 'Third-party corroboration', status: 'Needs work', evidence: 'Directories confirm the core business but rarely mention specialties.', recommendation: 'Update trusted listings and earn relevant local mentions.' },
      { check: 'Structured entity data', status: 'Monitor', evidence: 'LocalBusiness markup exists but does not fully connect services and profiles.', recommendation: 'Expand only with accurate facts visible on the page.' },
      { check: 'Factual accuracy in answers', status: 'Needs work', evidence: 'Two observed answers omitted catering; one misstated weekend closing time.', recommendation: 'Correct source facts first, then repeat the fixed prompt set quarterly.' },
    ] as AuditRow[],
    actions: [
      { priority: '1', action: 'Publish explicit catering and roasting information', impact: 'High', effort: 'Small project' },
      { priority: '2', action: 'Align entity facts across trusted third-party sources', impact: 'High', effort: 'Small project' },
      { priority: '3', action: 'Complete LocalBusiness and profile connections', impact: 'Medium', effort: 'Quick win' },
      { priority: '4', action: 'Repeat the same prompt benchmark quarterly', impact: 'Medium', effort: 'Ongoing' },
    ],
  },
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="report-score-ring" style={{ '--score': score } as React.CSSProperties} aria-label={`${score} out of 100`}>
      <div><strong>{score}</strong><span>/100</span></div>
    </div>
  )
}

function StatusPill({ status }: { status: Status }) {
  return <span className={`report-status is-${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>
}

function MetricGrid({ metrics }: { metrics: { value: string; label: string; detail: string }[] }) {
  return (
    <div className="report-metric-grid">
      {metrics.map((metric) => (
        <article key={metric.label}>
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
          <p>{metric.detail}</p>
        </article>
      ))}
    </div>
  )
}

function AuditTable({ rows }: { rows: AuditRow[] }) {
  return (
    <div className="report-table-wrap">
      <table className="report-table report-audit-table">
        <thead><tr><th>Audit check</th><th>Status</th><th>Evidence</th><th>Recommended action</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.check}>
              <td><strong>{row.check}</strong></td>
              <td><StatusPill status={row.status} /></td>
              <td>{row.evidence}</td>
              <td>{row.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ActionTable({ rows }: { rows: { priority: string; action: string; impact: string; effort: string }[] }) {
  return (
    <div className="report-table-wrap">
      <table className="report-table report-action-table">
        <thead><tr><th>Priority</th><th>Recommended action</th><th>Impact</th><th>Effort</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.priority}>
              <td><span className="report-priority-number">{row.priority}</span></td>
              <td><strong>{row.action}</strong></td>
              <td>{row.impact}</td>
              <td>{row.effort}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SectionHeader({ id, number, title, score, summary }: { id: string; number: string; title: string; score: number; summary: string }) {
  return (
    <header className="report-section-header" id={id}>
      <div>
        <span>{number}</span>
        <div><p>Audit section</p><h2>{title}</h2></div>
      </div>
      <div className="report-section-score"><strong>{score}</strong><span>/100</span></div>
      <p>{summary}</p>
    </header>
  )
}

function SampleAudit() {
  return (
    <div className="report-page" id="top">
      <a className="report-skip" href="#overview">Skip to report</a>

      <div className="report-sample-note">
        <strong>Sample audit</strong>
        <span>Fictional business and illustrative data</span>
      </div>

      <header className="report-topbar">
        <a className="report-wordmark" href="/" aria-label="Wolin home">wolin.dev</a>
        <div><span>{report.meta.scope}</span><span>{report.meta.reportId}</span></div>
        <button type="button" onClick={() => window.print()}>Print / save PDF <span aria-hidden="true">↗</span></button>
      </header>

      <main>
        <section className="report-hero">
          <div className="report-business">
            <span>Visibility audit · {report.meta.prepared}</span>
            <h1>{report.business.name}</h1>
            <p>{report.business.category} · {report.business.location}</p>
            <dl>
              <div><dt>Website</dt><dd>{report.business.website}</dd></div>
              <div><dt>Report ID</dt><dd>{report.meta.reportId}</dd></div>
            </dl>
          </div>
          <div className="report-overall-score">
            <ScoreRing score={report.overall.score} />
            <div><span>Overall visibility score</span><strong>{report.overall.label}</strong><p>{report.overall.summary}</p></div>
          </div>
        </section>

        <nav className="report-nav" aria-label="Report sections">
          <a href="#overview">Overview</a>
          <a href="#gbp">GBP</a>
          <a href="#website">Website</a>
          <a href="#ai-visibility">AI visibility</a>
        </nav>

        <section className="report-section report-overview" id="overview">
          <div className="report-simple-heading"><span>Overview</span><h2>Current visibility at a glance</h2></div>
          <MetricGrid metrics={report.overviewMetrics} />

          <div className="report-overview-grid">
            <article>
              <h3>What is working</h3>
              <ul>{report.strengths.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul>
            </article>
            <article>
              <h3>What needs attention</h3>
              <ul>{report.risks.map((item) => <li key={item}><span>!</span>{item}</li>)}</ul>
            </article>
          </div>

          <div className="report-subsection">
            <div className="report-subsection-title"><h3>Section scores</h3><p>Scores use public evidence available on the audit date. Owner-only checks are excluded until access is provided.</p></div>
            <div className="report-table-wrap">
              <table className="report-table report-score-table">
                <thead><tr><th>Area</th><th>Score</th><th>Status</th><th>Key finding</th></tr></thead>
                <tbody>
                  {report.scoreSummary.map((row) => (
                    <tr key={row.area}>
                      <td><strong>{row.area}</strong></td>
                      <td><span className="report-inline-score">{row.score}</span></td>
                      <td>{row.status}</td>
                      <td>{row.keyFinding}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="report-section">
          <SectionHeader id="gbp" number="01" title="Google Business Profile" score={report.gbp.score} summary={report.gbp.summary} />
          <MetricGrid metrics={report.gbp.metrics} />

          <div className="report-data-split">
            <div className="report-review-chart">
              <div className="report-subsection-title"><h3>Review distribution</h3><p>184 total Google reviews</p></div>
              {report.gbp.reviewDistribution.map((row) => (
                <div className="report-bar-row" key={row.stars}>
                  <span>{row.stars}</span>
                  <div><i style={{ width: `${row.percent}%` }} /></div>
                  <strong>{row.count}</strong>
                </div>
              ))}
            </div>
            <div className="report-data-note">
              <span>Review finding</span>
              <strong>Rating is excellent. Response coverage is the gap.</strong>
              <p>Only 61% of recent reviews have an owner response. A consistent weekly response process would strengthen customer trust and surface recurring service feedback.</p>
            </div>
          </div>

          <div className="report-subsection">
            <div className="report-subsection-title"><h3>Profile audit results</h3><p>Observed profile data, supporting evidence, and recommended corrections.</p></div>
            <AuditTable rows={report.gbp.checks} />
          </div>

          <div className="report-subsection">
            <div className="report-subsection-title"><h3>Local search sample</h3><p>Representative non-branded queries measured across the Boise target area.</p></div>
            <div className="report-table-wrap">
              <table className="report-table">
                <thead><tr><th>Search query</th><th>Average map position</th><th>Organic position</th><th>Trend</th></tr></thead>
                <tbody>{report.gbp.rankings.map((row) => <tr key={row.query}><td><strong>{row.query}</strong></td><td>{row.mapPosition}</td><td>{row.organicPosition}</td><td>{row.trend}</td></tr>)}</tbody>
              </table>
            </div>
          </div>

          <div className="report-subsection">
            <div className="report-subsection-title"><h3>GBP priorities</h3><p>Recommended order of work for the next 30 days.</p></div>
            <ActionTable rows={report.gbp.actions} />
          </div>
        </section>

        <section className="report-section">
          <SectionHeader id="website" number="02" title="Website" score={report.website.score} summary={report.website.summary} />
          <MetricGrid metrics={report.website.metrics} />

          <div className="report-subsection">
            <div className="report-subsection-title"><h3>Website audit results</h3><p>Technical foundation, local relevance, content coverage, conversion, and measurement.</p></div>
            <AuditTable rows={report.website.checks} />
          </div>

          <div className="report-subsection">
            <div className="report-subsection-title"><h3>Search-intent coverage</h3><p>Whether the site has a useful page for each important customer need.</p></div>
            <div className="report-table-wrap">
              <table className="report-table">
                <thead><tr><th>Customer intent</th><th>Current page</th><th>Coverage</th><th>Opportunity</th></tr></thead>
                <tbody>{report.website.pageCoverage.map((row) => <tr key={row.intent}><td><strong>{row.intent}</strong></td><td>{row.currentPage}</td><td>{row.quality}</td><td>{row.opportunity}</td></tr>)}</tbody>
              </table>
            </div>
          </div>

          <div className="report-data-note is-wide">
            <span>Primary website finding</span>
            <strong>Catering demand has no dedicated destination.</strong>
            <p>A focused catering page could support organic search, GBP services, AI answers, paid campaigns, internal links, and a clearer inquiry flow. It is the highest-leverage content recommendation in this audit.</p>
          </div>

          <div className="report-subsection">
            <div className="report-subsection-title"><h3>Website priorities</h3><p>Recommended order of work for the next 30–60 days.</p></div>
            <ActionTable rows={report.website.actions} />
          </div>
        </section>

        <section className="report-section report-ai-section">
          <SectionHeader id="ai-visibility" number="03" title="AI visibility" score={report.ai.score} summary={report.ai.summary} />
          <MetricGrid metrics={report.ai.metrics} />

          <div className="report-subsection">
            <div className="report-subsection-title"><h3>Prompt test results</h3><p>Fixed prompts tested in fresh, search-enabled sessions. Results are dated samples, not fixed rankings.</p></div>
            <div className="report-table-wrap">
              <table className="report-table">
                <thead><tr><th>Representative prompt</th><th>Platform</th><th>Mentioned</th><th>Top source</th><th>Accuracy</th></tr></thead>
                <tbody>{report.ai.tests.map((row) => <tr key={`${row.platform}-${row.prompt}`}><td><strong>{row.prompt}</strong></td><td>{row.platform}</td><td>{row.mentioned}</td><td>{row.source}</td><td>{row.accuracy}</td></tr>)}</tbody>
              </table>
            </div>
          </div>

          <div className="report-subsection">
            <div className="report-subsection-title"><h3>AI readiness checks</h3><p>Crawler access, entity consistency, source corroboration, and factual clarity.</p></div>
            <AuditTable rows={report.ai.checks} />
          </div>

          <div className="report-subsection">
            <div className="report-subsection-title"><h3>AI visibility priorities</h3><p>Work on source quality and entity clarity before increasing content volume.</p></div>
            <ActionTable rows={report.ai.actions} />
          </div>

          <div className="report-method">
            <strong>Methodology note</strong>
            <p>Twelve prompts were checked across ChatGPT, Gemini, Microsoft Copilot, and Perplexity. We recorded whether the business was mentioned, the cited source, factual accuracy, and competing businesses. Results can change by platform, model, location, and date.</p>
          </div>
        </section>
      </main>

      <footer className="report-footer">
        <div><a className="report-wordmark" href="/">wolin.dev</a><p>Google profile, website, local search, and AI visibility audits for small businesses.</p></div>
        <div><span>Prepared by Wolin</span><a href="mailto:caleb.wolin@gmail.com">caleb.wolin@gmail.com</a><a href="tel:+12088108089">+1 (208) 810-8089</a></div>
        <div><span>{report.meta.reportId}</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </div>
  )
}

export default SampleAudit
