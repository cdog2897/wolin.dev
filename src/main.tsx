import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BusinessSite from './BusinessSite.tsx'
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
const socialMediaPath = currentPath === '/social-media'
const websitesPath = currentPath === '/websites-seo' || currentPath === '/seo-websites'
const googlePath = currentPath === '/google-business-profile'
const aiPath = currentPath === '/ai-search'

if (legacyAdminSigningLink) {
  window.location.replace(`https://wolin.dev${window.location.pathname}${window.location.search}${window.location.hash}`)
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
} else if (sampleAuditPath) {
  document.title = 'Sample Visibility Audit — Wolin'
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    'See how Wolin evaluates Google Business Profile, website, local search, conversion, and AI visibility for a small business.',
  )
} else if (websitesPath) {
  document.title = 'Websites + SEO — Wolin'
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    'Custom websites, ongoing maintenance, and practical SEO for growing local businesses.',
  )
} else if (socialMediaPath) {
  document.title = 'Social Media Management — Wolin'
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    'Social media strategy, content, publishing, and community support for busy small businesses.',
  )
} else if (googlePath) {
  document.title = 'Google Business Profile — Wolin'
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    'One-time Google Business Profile optimization for local businesses.',
  )
} else if (aiPath) {
  document.title = 'AI Visibility — Wolin'
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    'Monthly AI search visibility reviews and improvements for your business.',
  )
} else {
  document.title = 'Wolin — Local Growth for Small Businesses'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {legacyAdminSigningLink ? null : signingMatch ? (
      <SigningPage token={decodeURIComponent(signingMatch[1])} />
    ) : adminHost || adminPreviewPath ? (
      <AdminPortal />
    ) : portfolioPath ? (
      <App />
    ) : sampleAuditPath ? (
      <SampleAudit />
    ) : (
      <BusinessSite page={socialMediaPath ? 'social' : websitesPath ? 'websites' : googlePath ? 'google' : aiPath ? 'ai' : 'home'} />
    )}
  </StrictMode>,
)
