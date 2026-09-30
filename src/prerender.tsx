import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import BusinessSite from './BusinessSite'

// Only the existing public business pages are rendered into static HTML.
export function renderPage(path: '/' | '/offers') {
  return renderToString(
    <StrictMode>
      <BusinessSite page={path === '/offers' ? 'offers' : 'home'} />
    </StrictMode>,
  )
}
