import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import BusinessSite from './BusinessSite'

import { publicPages, type PublicPath } from './public-pages'
export { publicPages, structuredData } from './public-pages'

// Only the public business pages are rendered into static HTML.
export function renderPage(path: PublicPath) {
  return renderToString(
    <StrictMode>
      <BusinessSite page={publicPages[path].page} />
    </StrictMode>,
  )
}
