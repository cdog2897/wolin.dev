import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { adminApi, demoMode } from './api'
import type { AuditEvent, Envelope, EnvelopeStatus, Stats, Template } from './types'
import './admin.css'

type View = 'overview' | 'documents' | 'templates' | 'settings'

const icons: Record<string, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  document: <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/></>,
  template: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H9.6v-.09A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V9.6h.09A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.14.38.35.72.6 1 .3.3.7.4 1.1.4h.09v4h-.09a1.7 1.7 0 0 0-1.7.6Z"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  arrow: <path d="m9 18 6-6-6-6"/>,
  send: <><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 20h14"/></>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h6v18h-6"/></>,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.8 3.2 8 7.5 9.5 4.3-1.5 7.5-4.7 7.5-9.5V6z"/><path d="m9 12 2 2 4-5"/></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
}

function Icon({ name, size = 18 }: { name: keyof typeof icons; size?: number }) {
  return <svg className="wa-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>
}

const statusLabel: Record<EnvelopeStatus, string> = {
  draft: 'Draft', sent: 'Awaiting', viewed: 'Viewed', signed: 'Signed', voided: 'Voided', expired: 'Expired',
}

function StatusPill({ status }: { status: EnvelopeStatus }) {
  return <span className={`wa-status wa-status-${status}`}><i />{statusLabel[status]}</span>
}

function formatDate(value: string | null | undefined, includeTime = false) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-US', includeTime ? { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' } : { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function DocumentPreview({ body }: { body: string }) {
  return <div className="wa-document-paper">
    {body.split(/\n\s*\n/).map((block, index) => {
      const heading = /^\d+\.\s+[A-Z]/.test(block.trim())
      return heading ? <h4 key={index}>{block}</h4> : <p key={index}>{block}</p>
    })}
  </div>
}

function LoginScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [email, setEmail] = useState('caleb.wolin@gmail.com')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await adminApi.requestLogin(email)
      if (demoMode) onAuthenticated()
      else setSent(true)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to send the sign-in link.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="wa-login">
    <section className="wa-login-card">
      <a className="wa-login-brand" href="https://wolin.dev"><span>W</span><strong>wolin</strong><em>admin</em></a>
      {sent ? <div className="wa-login-sent">
        <span className="wa-success-mark"><Icon name="check" size={24} /></span>
        <h1>Check your inbox</h1>
        <p>A private sign-in link was sent to <strong>{email}</strong>. It expires in 15 minutes.</p>
        <button className="wa-text-button" onClick={() => setSent(false)}>Use a different email</button>
      </div> : <>
        <div className="wa-login-heading"><span>Private workspace</span><h1>Welcome back.</h1><p>Sign in to manage clients, agreements, and signatures.</p></div>
        <form onSubmit={submit}>
          <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
          {error && <p className="wa-form-error">{error}</p>}
          <button className="wa-primary wa-full" disabled={loading}>{loading ? 'Sending…' : 'Email me a sign-in link'}<Icon name="arrow" /></button>
        </form>
        <p className="wa-login-note"><Icon name="shield" size={16} /> Access is limited to the Wolin owner account.</p>
      </>}
    </section>
    <aside className="wa-login-art" aria-hidden="true"><span className="wa-art-number">01</span><div className="wa-art-sheet"><i /><i /><i /><b>Signed</b></div><p>Simple agreements.<br />Clear next steps.</p></aside>
  </main>
}

type SendForm = { templateId: string; recipientName: string; recipientEmail: string; businessName: string; message: string; expiresDays: number }

function SendModal({ templates, onClose, onSent }: { templates: Template[]; onClose: () => void; onSent: () => void }) {
  const [form, setForm] = useState<SendForm>({ templateId: templates[0]?.id ?? '', recipientName: '', recipientEmail: '', businessName: '', message: '', expiresDays: 14 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const selected = templates.find((template) => template.id === form.templateId)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await adminApi.send(form)
      onSent()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to send the document.')
    } finally {
      setLoading(false)
    }
  }

  return <div className="wa-modal-layer" role="dialog" aria-modal="true" aria-label="Send a document">
    <button className="wa-modal-backdrop" onClick={onClose} aria-label="Close" />
    <section className="wa-modal wa-send-modal">
      <header><div><span className="wa-kicker">New agreement</span><h2>Send for signature</h2></div><button className="wa-icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button></header>
      <form onSubmit={submit}>
        <div className="wa-form-section"><span className="wa-form-step">01</span><div className="wa-form-fields"><h3>Choose a template</h3><label>Agreement<select value={form.templateId} onChange={(event) => setForm({ ...form, templateId: event.target.value })}>{templates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}</select></label>{selected && <div className="wa-template-chip"><span>{selected.package_name.slice(0, 1)}</span><div><strong>{selected.package_name}</strong><small>{selected.price} / month</small></div><Icon name="check" /></div>}</div></div>
        <div className="wa-form-section"><span className="wa-form-step">02</span><div className="wa-form-fields"><h3>Recipient details</h3><div className="wa-field-row"><label>Full name<input required value={form.recipientName} onChange={(event) => setForm({ ...form, recipientName: event.target.value })} placeholder="Maya Chen" /></label><label>Email address<input required type="email" value={form.recipientEmail} onChange={(event) => setForm({ ...form, recipientEmail: event.target.value })} placeholder="maya@company.com" /></label></div><label>Business name<input required value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} placeholder="Juniper Coffee Company" /></label></div></div>
        <div className="wa-form-section"><span className="wa-form-step">03</span><div className="wa-form-fields"><h3>Email note</h3><label>Personal message <span>Optional</span><textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Hi Maya, here’s the agreement we discussed. Let me know if you have any questions." rows={3} /></label><label>Link expires<select value={form.expiresDays} onChange={(event) => setForm({ ...form, expiresDays: Number(event.target.value) })}><option value={7}>In 7 days</option><option value={14}>In 14 days</option><option value={30}>In 30 days</option><option value={60}>In 60 days</option></select></label></div></div>
        {error && <p className="wa-form-error wa-modal-error">{error}</p>}
        <footer><button type="button" className="wa-secondary" onClick={onClose}>Cancel</button><button className="wa-primary" disabled={loading || !form.templateId}>{loading ? 'Sending…' : 'Send agreement'}<Icon name="send" /></button></footer>
      </form>
    </section>
  </div>
}

function TemplateModal({ template, onClose, onSaved }: { template?: Template; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ id: template?.id, name: template?.name ?? '', packageName: template?.package_name ?? '', price: template?.price ?? '', subject: template?.subject ?? '', body: template?.body ?? '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try { await adminApi.saveTemplate(form); onSaved() } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to save this template.') } finally { setLoading(false) }
  }
  return <div className="wa-modal-layer" role="dialog" aria-modal="true" aria-label="Edit template"><button className="wa-modal-backdrop" onClick={onClose} aria-label="Close" /><section className="wa-modal wa-template-modal"><header><div><span className="wa-kicker">Document template</span><h2>{template ? 'Edit template' : 'Create template'}</h2></div><button className="wa-icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button></header><form onSubmit={submit}><div className="wa-template-form-grid"><div className="wa-template-meta"><label>Template name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><div className="wa-field-row"><label>Package<input required value={form.packageName} onChange={(event) => setForm({ ...form, packageName: event.target.value })} /></label><label>Monthly price<input required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="$679" /></label></div><label>Email subject<input required value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} /></label><div className="wa-variable-note"><strong>Available variables</strong><span>{'{{client_name}} · {{client_email}} · {{business_name}} · {{package_name}} · {{price}} · {{date}}'}</span></div></div><label className="wa-template-body">Agreement body<textarea required value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} /></label></div>{error && <p className="wa-form-error wa-modal-error">{error}</p>}<footer><button type="button" className="wa-secondary" onClick={onClose}>Cancel</button><button className="wa-primary" disabled={loading}>{loading ? 'Saving…' : 'Save template'}<Icon name="check" /></button></footer></form></section></div>
}

function DetailPanel({ id, onClose, onChanged, notify }: { id: string; onClose: () => void; onChanged: () => void; notify: (message: string) => void }) {
  const [envelope, setEnvelope] = useState<Envelope | null>(null)
  const [audit, setAudit] = useState<AuditEvent[]>([])
  const [loadingAction, setLoadingAction] = useState('')
  useEffect(() => { adminApi.envelope(id).then((data) => { setEnvelope(data.envelope); setAudit(data.audit) }).catch(() => onClose()) }, [id, onClose])
  async function action(kind: 'resend' | 'void') {
    setLoadingAction(kind)
    try { await adminApi[kind](id); notify(kind === 'resend' ? 'Agreement email sent again.' : 'Agreement voided.'); onChanged(); onClose() } finally { setLoadingAction('') }
  }
  return <div className="wa-drawer-layer"><button className="wa-modal-backdrop" onClick={onClose} aria-label="Close" /><aside className="wa-drawer">{!envelope ? <div className="wa-panel-loading"><span /><span /><span /></div> : <><header><div><StatusPill status={envelope.status} /><h2>{envelope.business_name}</h2><p>{envelope.document_title}</p></div><button className="wa-icon-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button></header><div className="wa-drawer-actions">{envelope.status === 'signed' && <a className="wa-primary" href={`/api/admin?action=pdf&id=${encodeURIComponent(id)}`}><Icon name="download" />Download PDF</a>}{['sent', 'viewed', 'draft', 'expired'].includes(envelope.status) && <button className="wa-secondary" onClick={() => action('resend')} disabled={Boolean(loadingAction)}><Icon name="send" />{loadingAction === 'resend' ? 'Sending…' : 'Resend'}</button>}{!['signed', 'voided'].includes(envelope.status) && <button className="wa-quiet-danger" onClick={() => action('void')} disabled={Boolean(loadingAction)}>Void</button>}</div><div className="wa-drawer-body"><section className="wa-recipient-card"><span className="wa-avatar">{initials(envelope.recipient_name)}</span><div><strong>{envelope.recipient_name}</strong><a href={`mailto:${envelope.recipient_email}`}>{envelope.recipient_email}</a></div><dl><div><dt>Created</dt><dd>{formatDate(envelope.created_at)}</dd></div><div><dt>Expires</dt><dd>{formatDate(envelope.expires_at)}</dd></div></dl></section>{envelope.status === 'signed' && <section className="wa-signature-card"><span className="wa-success-mark"><Icon name="check" /></span><div><small>Signed by</small><strong className={envelope.signature_type === 'typed' ? 'wa-script' : ''}>{envelope.signature_name}</strong><span>{formatDate(envelope.signed_at, true)}</span></div></section>}<section><div className="wa-section-title"><h3>Audit trail</h3><span>{audit.length} events</span></div><div className="wa-timeline">{audit.map((event, index) => <div key={`${event.event_hash}-${index}`}><span className={`wa-event-icon ${event.event_type.includes('signed') ? 'complete' : ''}`}><Icon name={event.event_type.includes('viewed') ? 'eye' : event.event_type.includes('signed') ? 'check' : event.event_type.includes('email') ? 'send' : 'document'} size={15} /></span><div><strong>{event.event_type.replaceAll('_', ' ')}</strong><time>{formatDate(event.created_at, true)}</time><small>{event.ip && event.ip !== 'unknown' ? `IP ${event.ip} · ` : ''}{event.event_hash.slice(0, 16)}…</small></div></div>)}</div></section><section><div className="wa-section-title"><h3>Document snapshot</h3><span>SHA-256 secured</span></div><DocumentPreview body={envelope.document_body ?? ''} /></section></div></>}</aside></div>
}

function DocumentsTable({ envelopes, onOpen, compact = false }: { envelopes: Envelope[]; onOpen: (id: string) => void; compact?: boolean }) {
  return <div className="wa-table-wrap"><table className="wa-table"><thead><tr><th>Recipient</th><th>Agreement</th><th>Status</th><th>{compact ? 'Updated' : 'Sent'}</th><th aria-label="Actions" /></tr></thead><tbody>{envelopes.map((envelope) => <tr key={envelope.id} onClick={() => onOpen(envelope.id)}><td><div className="wa-person"><span className="wa-avatar">{initials(envelope.recipient_name)}</span><div><strong>{envelope.business_name}</strong><small>{envelope.recipient_name} · {envelope.recipient_email}</small></div></div></td><td><strong>{envelope.document_title.replace(' Monthly Services Agreement', '')}</strong><small>{envelope.document_title}</small></td><td><StatusPill status={envelope.status} /></td><td><span className="wa-date">{formatDate(envelope.signed_at || envelope.viewed_at || envelope.sent_at || envelope.created_at)}</span></td><td><button className="wa-icon-button" onClick={(event) => { event.stopPropagation(); onOpen(envelope.id) }} aria-label={`Open ${envelope.business_name}`}><Icon name="arrow" /></button></td></tr>)}</tbody></table>{!envelopes.length && <div className="wa-empty"><span><Icon name="document" size={26} /></span><h3>No documents here</h3><p>Send an agreement or adjust the current filter.</p></div>}</div>
}

export default function AdminPortal() {
  const [auth, setAuth] = useState<'loading' | 'in' | 'out'>('loading')
  const [email, setEmail] = useState('')
  const [view, setView] = useState<View>('overview')
  const [templates, setTemplates] = useState<Template[]>([])
  const [envelopes, setEnvelopes] = useState<Envelope[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, sent: 0, viewed: 0, signed: 0, draft: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | EnvelopeStatus>('all')
  const [sendOpen, setSendOpen] = useState(false)
  const [templateEditing, setTemplateEditing] = useState<Template | 'new' | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [mobileNav, setMobileNav] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const [templateData, envelopeData] = await Promise.all([adminApi.templates(), adminApi.envelopes()])
      setTemplates(templateData.templates)
      setEnvelopes(envelopeData.envelopes)
      setStats(envelopeData.stats)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    adminApi.session().then(async (session) => {
      setEmail(session.email ?? '')
      if (session.authenticated) {
        await load()
        setAuth('in')
      } else {
        setAuth('out')
      }
    }).catch(() => setAuth('out'))
  }, [])
  useEffect(() => { if (!toast) return; const timeout = window.setTimeout(() => setToast(''), 3600); return () => window.clearTimeout(timeout) }, [toast])

  const filtered = useMemo(() => envelopes.filter((envelope) => {
    const matchesStatus = statusFilter === 'all' || envelope.status === statusFilter
    const haystack = `${envelope.recipient_name} ${envelope.recipient_email} ${envelope.business_name} ${envelope.document_title}`.toLowerCase()
    return matchesStatus && haystack.includes(search.toLowerCase())
  }), [envelopes, search, statusFilter])

  if (auth === 'loading') return <div className="wa-app-loader"><span className="wa-brand-mark">W</span><i /></div>
  if (auth === 'out') return <LoginScreen onAuthenticated={() => setAuth('in')} />

  const title: Record<View, string> = { overview: 'Good morning, Caleb.', documents: 'Documents', templates: 'Templates', settings: 'Settings' }
  const subtitle: Record<View, string> = { overview: 'Here’s what’s happening with your agreements.', documents: 'Track every agreement from draft to signature.', templates: 'Reusable agreements for every Wolin package.', settings: 'Security and workspace preferences.' }

  function notify(message: string) { setToast(message) }
  function sent() { setSendOpen(false); notify('Agreement sent for signature.'); void load() }
  function saved() { setTemplateEditing(null); notify('Template saved.'); void load() }
  async function logout() { await adminApi.logout(); setAuth('out') }

  return <div className="wa-shell">
    <aside className={`wa-sidebar ${mobileNav ? 'open' : ''}`}>
      <div className="wa-brand"><span className="wa-brand-mark">W</span><div><strong>wolin</strong><small>admin</small></div></div>
      <nav>{([
        ['overview', 'grid', 'Overview'], ['documents', 'document', 'Documents'], ['templates', 'template', 'Templates'], ['settings', 'settings', 'Settings'],
      ] as [View, keyof typeof icons, string][]).map(([id, icon, label]) => <button key={id} className={view === id ? 'active' : ''} onClick={() => { setView(id); setMobileNav(false) }}><Icon name={icon} />{label}{id === 'documents' && stats.sent + stats.viewed > 0 && <em>{stats.sent + stats.viewed}</em>}</button>)}</nav>
      <div className="wa-sidebar-foot"><div className="wa-owner"><span className="wa-avatar">CW</span><div><strong>Caleb Wolin</strong><small>{email}</small></div></div><button className="wa-icon-button" onClick={logout} aria-label="Sign out"><Icon name="logout" /></button></div>
    </aside>
    <main className="wa-main">
      <header className="wa-topbar"><button className="wa-mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Open navigation"><Icon name="menu" /></button><div><span className="wa-kicker">Wolin workspace</span><h1>{title[view]}</h1><p>{subtitle[view]}</p></div><button className="wa-primary" onClick={() => setSendOpen(true)}><Icon name="plus" />Send agreement</button></header>
      {demoMode && <div className="wa-demo-banner"><span>Preview mode</span> Changes are temporary and no emails are sent.</div>}
      {loading ? <div className="wa-page-loading"><span /><span /><span /></div> : <>
        {view === 'overview' && <div className="wa-page wa-overview">
          <section className="wa-stat-grid"><article><span className="wa-stat-icon olive"><Icon name="document" /></span><div><small>Total documents</small><strong>{stats.total}</strong><em>All time</em></div></article><article><span className="wa-stat-icon gold"><Icon name="clock" /></span><div><small>Awaiting signature</small><strong>{stats.sent + stats.viewed}</strong><em>{stats.viewed} viewed</em></div></article><article><span className="wa-stat-icon green"><Icon name="check" /></span><div><small>Completed</small><strong>{stats.signed}</strong><em>{stats.total ? Math.round((stats.signed / stats.total) * 100) : 0}% completion</em></div></article></section>
          <section className="wa-content-card wa-recent"><header><div><h2>Recent documents</h2><p>Your latest client agreements</p></div><button className="wa-text-button" onClick={() => setView('documents')}>View all <Icon name="arrow" /></button></header><DocumentsTable envelopes={envelopes.slice(0, 5)} onOpen={setDetailId} compact /></section>
          <div className="wa-overview-bottom"><section className="wa-content-card wa-quick"><header><div><h2>Quick send</h2><p>Start from a package template</p></div></header><div>{templates.slice(0, 3).map((template, index) => <button key={template.id} onClick={() => setSendOpen(true)}><span className={`wa-package-icon tone-${index}`}>{template.package_name.slice(0, 1)}</span><div><strong>{template.package_name}</strong><small>{template.price} / month</small></div><Icon name="arrow" /></button>)}</div></section><section className="wa-content-card wa-security"><span className="wa-stat-icon green"><Icon name="shield" /></span><h2>Every action, accounted for.</h2><p>Document snapshots, electronic consent, timestamps, IP metadata, and SHA-256 audit hashes are recorded with each signature.</p><div><span><Icon name="check" size={14} />Tamper-evident</span><span><Icon name="check" size={14} />PDF certificate</span></div></section></div>
        </div>}
        {view === 'documents' && <div className="wa-page"><section className="wa-content-card wa-documents-card"><div className="wa-toolbar"><div className="wa-search"><Icon name="search" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search clients or documents" /></div><div className="wa-filters">{(['all', 'sent', 'viewed', 'signed', 'draft'] as const).map((status) => <button key={status} className={statusFilter === status ? 'active' : ''} onClick={() => setStatusFilter(status)}>{status === 'all' ? 'All' : statusLabel[status]}</button>)}</div></div><DocumentsTable envelopes={filtered} onOpen={setDetailId} /></section></div>}
        {view === 'templates' && <div className="wa-page"><div className="wa-template-page-head"><div><h2>Package agreements</h2><p>Edit the contract language once, then reuse it for every client.</p></div><button className="wa-secondary" onClick={() => setTemplateEditing('new')}><Icon name="plus" />New template</button></div><div className="wa-template-grid">{templates.map((template, index) => <article key={template.id}><div className="wa-template-cover"><span className={`wa-package-icon tone-${index % 3}`}>{template.package_name.slice(0, 1)}</span><small>WOLIN · SERVICE AGREEMENT</small><b>{template.package_name}</b><em>{template.price}<span> / month</span></em><i>Electronic signature ready</i></div><div className="wa-template-info"><div><h3>{template.name}</h3><p>Updated {formatDate(template.updated_at || template.created_at || new Date().toISOString())}</p></div><button className="wa-icon-button" onClick={() => setTemplateEditing(template)} aria-label={`Edit ${template.name}`}><Icon name="more" /></button></div><button className="wa-secondary wa-full" onClick={() => setTemplateEditing(template)}>Edit template</button></article>)}</div></div>}
        {view === 'settings' && <div className="wa-page wa-settings-page"><section className="wa-content-card"><header><div><h2>Workspace owner</h2><p>The only account authorized to open this portal.</p></div><span className="wa-verified"><Icon name="shield" size={15} />Verified</span></header><div className="wa-settings-row"><span className="wa-avatar large">CW</span><div><strong>Caleb Wolin</strong><small>{email}</small></div></div></section><section className="wa-content-card"><header><div><h2>Security</h2><p>Passwordless access and document safeguards.</p></div></header><div className="wa-settings-list"><div><span className="wa-stat-icon olive"><Icon name="send" /></span><div><strong>Email sign-in links</strong><small>Links expire after 15 minutes; sessions expire after 7 days.</small></div><em>On</em></div><div><span className="wa-stat-icon green"><Icon name="shield" /></span><div><strong>Secure sessions</strong><small>HTTP-only, secure, same-site cookies protect admin access.</small></div><em>On</em></div><div><span className="wa-stat-icon gold"><Icon name="document" /></span><div><strong>Immutable snapshots</strong><small>Sent agreement text is never changed when a template is edited.</small></div><em>On</em></div></div></section><section className="wa-content-card wa-env-note"><h2>Sending identity</h2><p>Agreement emails are delivered through Resend using the verified <strong>wolin.dev</strong> domain. Replies go directly to your regular inbox.</p></section></div>}
      </>}
    </main>
    {sendOpen && <SendModal templates={templates} onClose={() => setSendOpen(false)} onSent={sent} />}
    {templateEditing && <TemplateModal template={templateEditing === 'new' ? undefined : templateEditing} onClose={() => setTemplateEditing(null)} onSaved={saved} />}
    {detailId && <DetailPanel id={detailId} onClose={() => setDetailId(null)} onChanged={load} notify={notify} />}
    {toast && <div className="wa-toast"><span><Icon name="check" /></span>{toast}</div>}
  </div>
}
