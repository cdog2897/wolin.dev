import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import BusinessSite from './BusinessSite'
import UndercoverDemo from './undercover/UndercoverDemo'

import { publicPages, type PublicPath } from './public-pages'
export { publicPages, structuredData } from './public-pages'
export { basePath, samplePaths, sampleTitle } from './undercover/data'

export function renderSample(path: string) {
  return renderToString(<UndercoverDemo initialPath={path} />)
}

// Only the public business pages are rendered into static HTML.
export function renderPage(path: PublicPath) {
  return renderToString(
    <StrictMode>
      <BusinessSite page={publicPages[path].page} />
    </StrictMode>,
  )
}
