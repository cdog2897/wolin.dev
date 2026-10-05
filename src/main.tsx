import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BusinessSite from './BusinessSite.tsx'
import { isPublicPath, publicPages } from './public-pages'
import SampleAudit from './SampleAudit.tsx'
import AdminPortal from './admin/AdminPortal.tsx'
import SigningPage from './admin/SigningPage.tsx'

const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
const adminHost = window.location.hostname === 'admin.wolin.dev'
const adminPreviewPath = currentPath === '/admin' || currentPath === '/admin-preview'
const signingMatch = currentPath.match(/^\/sign\/([^/]+)$/)
const legacyAdminSigningLink = adminHost && signingMatch
const portfolioPath = currentPath === '/calebwolin'
const sampleAuditPath = currentPath === '/sample'
const undercoverDemoPath = currentPath === '/sample/UndercoverBedandSpas' || currentPath.startsWith('/sample/UndercoverBedandSpas/')
const retiredOfferPath = currentPath === '/90-day-hands-free-local-sensation'
const publicPage = isPublicPath(currentPath) ? publicPages[currentPath] : undefined

if (legacyAdminSigningLink) {
  window.location.replace(`https://wolin.dev${window.location.pathname}${window.location.search}${window.location.hash}`)
}

if (retiredOfferPath && !adminHost) {
  window.location.replace(`/offers${window.location.search}`)
}

if (signingMatch) {
  document.title = 'Review & Sign — Wolin'
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    'Securely review and electronically sign your Wolin service agreement.',
  )
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff')
} else if (adminHost || adminPreviewPath) {
  document.title = 'Wolin Admin'
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    'Private Wolin workspace for client agreements and electronic signatures.',
  )
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#eef1ed')
} else if (portfolioPath) {
  document.title = 'Caleb Wolin — Product Engineer'
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    'Selected apps, web platforms, and creative tools designed and built by Caleb Wolin.',
  )
} else if (undercoverDemoPath) {
  document.title = 'Undercover Bed & Spas — Design Demo'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#1c3932')
} else if (sampleAuditPath) {
  document.title = 'Sample Visibility Audit — Wolin'
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    'See how Wolin evaluates Google Business Profile, website, local search, conversion, and AI visibility for a small business.',
  )
} else if (publicPage) {
  document.title = publicPage.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', publicPage.description)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', publicPage.title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', publicPage.description)
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://wolin.dev${currentPath}`)
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', publicPage.title)
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', publicPage.description)
}

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    {legacyAdminSigningLink || (retiredOfferPath && !adminHost) ? null : signingMatch ? (
      <SigningPage token={decodeURIComponent(signingMatch[1])} />
    ) : adminHost || adminPreviewPath ? (
      <AdminPortal />
    ) : portfolioPath ? (
      <App />
    ) : sampleAuditPath ? (
      <SampleAudit />
    ) : (
      <BusinessSite page={publicPage?.page ?? 'home'} />
    )}
  </StrictMode>
)

if (!adminHost && !adminPreviewPath && undercoverDemoPath) {
  // Prerendered demo content remains visible until its separate code is ready.
  void import('./undercover/UndercoverDemo.tsx').then(({ default: UndercoverDemo }) => {
    createRoot(root).render(<StrictMode><UndercoverDemo initialPath={currentPath} /></StrictMode>)
  })
} else if (!adminHost && root.dataset.prerendered === currentPath) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
