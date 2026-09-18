import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BusinessSite from './BusinessSite.tsx'
import SampleAudit from './SampleAudit.tsx'

const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
const portfolioPath = currentPath === '/calebwolin'
const sampleAuditPath = currentPath === '/sample'

if (portfolioPath) {
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
} else {
  document.title = 'Wolin — Local Growth for Small Businesses'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {portfolioPath ? <App /> : sampleAuditPath ? <SampleAudit /> : <BusinessSite />}
  </StrictMode>,
)
