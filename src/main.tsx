import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BusinessSite from './BusinessSite.tsx'

const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
const portfolioPath = currentPath === '/calebwolin'

if (portfolioPath) {
  document.title = 'Caleb Wolin — Product Engineer'
  document.querySelector('meta[name="description"]')?.setAttribute(
    'content',
    'Selected apps, web platforms, and creative tools designed and built by Caleb Wolin.',
  )
} else {
  document.title = 'Wolin — Local Growth for Small Businesses'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {portfolioPath ? <App /> : <BusinessSite />}
  </StrictMode>,
)
