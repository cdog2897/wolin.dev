import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { demoMode, signingApi } from './api'
import type { SigningDocument } from './types'
import './admin.css'

function CheckIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>
}

function DocumentBody({ body }: { body: string }) {
  return <div className="ws-contract-body">{body.split(/\n\s*\n/).map((block, index) => {
    const clean = block.trim()
    return /^\d+\.\s+[A-Z]/.test(clean) ? <h2 key={index}>{clean}</h2> : <p key={index}>{clean}</p>
  })}</div>
}

function SignatureCanvas({ onChange }: { onChange: (data: string, hasInk: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)

  function point(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return { x: (event.clientX - rect.left) * (canvas.width / rect.width), y: (event.clientY - rect.top) * (canvas.height / rect.height) }
  }
  function start(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!
    const context = canvas.getContext('2d')!
    const current = point(event)
    drawing.current = true
    canvas.setPointerCapture(event.pointerId)
    context.beginPath()
    context.moveTo(current.x, current.y)
  }
  function move(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const canvas = canvasRef.current!
    const context = canvas.getContext('2d')!
    const current = point(event)
    context.lineWidth = 3.2
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = '#17211f'
    context.lineTo(current.x, current.y)
    context.stroke()
  }
  function end() {
    if (!drawing.current) return
    drawing.current = false
    const canvas = canvasRef.current!
    onChange(canvas.toDataURL('image/png'), true)
  }
  function clear() {
    const canvas = canvasRef.current!
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
    onChange('', false)
  }

  return <div className="ws-canvas-wrap"><canvas ref={canvasRef} width={900} height={240} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} /><span>Sign here</span><button type="button" onClick={clear}>Clear</button></div>
}

export default function SigningPage({ token }: { token: string }) {
  const [document, setDocument] = useState<SigningDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [signerName, setSignerName] = useState('')
  const [signatureType, setSignatureType] = useState<'typed' | 'drawn'>('typed')
  const [signatureData, setSignatureData] = useState('')
  const [hasInk, setHasInk] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    signingApi.document(token).then((result) => {
      setDocument(result.document)
      setSignerName(result.document.signatureName || result.document.recipientName)
    }).catch((error: unknown) => setLoadError(error instanceof Error ? error.message : 'Unable to load this document.')).finally(() => setLoading(false))
  }, [token])

  async function sign() {
    if (!document) return
    setSubmitError('')
    if (!signerName.trim() || !agreed || (signatureType === 'drawn' && !hasInk)) {
      setSubmitError('Add your signature and accept the electronic-signature consent.')
      return
    }
    setSubmitting(true)
    try {
      const result = await signingApi.sign(token, { signerName, signatureType, signatureData: signatureType === 'typed' ? signerName : signatureData, agreed })
      setDocument({ ...document, status: 'signed', signedAt: result.signedAt, signatureName: signerName, signatureType, signatureData: signatureType === 'typed' ? signerName : signatureData })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save your signature.')
    } finally { setSubmitting(false) }
  }

  if (loading) return <div className="ws-loader"><span>W</span><i /></div>
  if (loadError || !document) return <main className="ws-state-page"><div className="ws-brand"><span>W</span><strong>wolin</strong></div><section><span className="ws-state-icon">!</span><h1>We can’t open this agreement.</h1><p>{loadError || 'The link may be invalid.'}</p><a href="mailto:caleb.wolin@gmail.com">Contact Caleb</a></section></main>

  const unavailable = ['voided', 'expired'].includes(document.status)
  const completed = document.status === 'signed'
  const pdfUrl = demoMode ? '#' : `/api/sign?token=${encodeURIComponent(token)}&format=pdf`

  return <div className="ws-shell">
    <header className="ws-header"><div className="ws-brand"><span>W</span><strong>wolin</strong><em>sign</em></div><div className="ws-secure"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>Secure document</div></header>
    {completed && <div className="ws-complete-banner"><span><CheckIcon size={21} /></span><div><strong>All done — your signature is complete.</strong><p>A confirmation has been emailed to {document.recipientEmail}.</p></div><a href={pdfUrl} onClick={(event) => { if (demoMode) event.preventDefault() }}>Download signed PDF</a></div>}
    {unavailable && <div className="ws-unavailable"><strong>This document is {document.status}.</strong><span>It can no longer be signed. Contact the sender if you need a new link.</span></div>}
    <main className="ws-main">
      <article className="ws-document">
        <div className="ws-document-head"><span>WOLIN · SERVICE AGREEMENT</span><h1>{document.title}</h1><div><p>Prepared for</p><strong>{document.businessName}</strong><small>{document.recipientName} · {document.recipientEmail}</small></div></div>
        <DocumentBody body={document.body} />
        <footer><span>Document ID</span><code>{document.documentHash}</code></footer>
      </article>
      <aside className="ws-sign-panel">
        <div className="ws-sign-sticky">
          <span className="ws-step">{completed ? 'Completed document' : 'Your signature'}</span>
          {completed ? <div className="ws-signed-summary"><span className="ws-big-check"><CheckIcon size={28} /></span><h2>Signed by {document.signatureName}</h2><p>{document.signedAt ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(document.signedAt)) : ''}</p><div className={document.signatureType === 'typed' ? 'ws-typed-signature' : 'ws-drawn-saved'}>{document.signatureType === 'drawn' && document.signatureData ? <img src={document.signatureData} alt={`Signature of ${document.signatureName}`} /> : document.signatureName}</div><a className="ws-download" href={pdfUrl} onClick={(event) => { if (demoMode) event.preventDefault() }}>Download signed PDF <span>↓</span></a></div> : unavailable ? <div className="ws-closed-summary"><h2>Signature unavailable</h2><p>This link is no longer active.</p></div> : <>
            <h2>Review and sign</h2><p className="ws-sign-intro">Please confirm your identity and apply your electronic signature.</p>
            <label className="ws-label">Full legal name<input value={signerName} onChange={(event) => setSignerName(event.target.value)} autoComplete="name" /></label>
            <div className="ws-signature-tabs"><button className={signatureType === 'typed' ? 'active' : ''} onClick={() => setSignatureType('typed')}>Type</button><button className={signatureType === 'drawn' ? 'active' : ''} onClick={() => setSignatureType('drawn')}>Draw</button></div>
            {signatureType === 'typed' ? <div className={`ws-typed-signature ${signerName ? '' : 'empty'}`}>{signerName || 'Your signature'}</div> : <SignatureCanvas onChange={(data, ink) => { setSignatureData(data); setHasInk(ink) }} />}
            <label className="ws-consent"><input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} /><span><i><CheckIcon size={13} /></i>{document.consentText}</span></label>
            {submitError && <p className="ws-error">{submitError}</p>}
            <button className="ws-sign-button" onClick={sign} disabled={submitting}>{submitting ? 'Applying signature…' : 'Agree & sign'}<CheckIcon /></button>
            <p className="ws-fine-print">By signing, you confirm you are authorized to enter this agreement for {document.businessName}. Your time, IP address, device information, and document hash will be recorded in the audit trail.</p>
          </>}
        </div>
      </aside>
    </main>
    <footer className="ws-site-footer"><span>Wolin Sign</span><p>Electronic signature service for Wolin client agreements.</p><a href="mailto:caleb.wolin@gmail.com">Need help?</a></footer>
  </div>
}
