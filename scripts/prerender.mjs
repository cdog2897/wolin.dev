import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'

const origin = 'https://wolin.dev'
const dist = resolve('dist')
const serverBuild = resolve('node_modules/.tmp/prerender')
const template = await readFile(resolve(dist, 'index.html'), 'utf8')

// Keep a separate client-only shell for admin, signing, sample, and portfolio.
await writeFile(resolve(dist, 'app-shell.html'), template)
await writeFile(
  resolve(dist, 'private-shell.html'),
  template.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n  </head>'),
)

try {
  await build({
    publicDir: false,
    build: { ssr: 'src/prerender.tsx', outDir: serverBuild, emptyOutDir: true },
  })
  const { renderPage, publicPages, structuredData } = await import(pathToFileURL(resolve(serverBuild, 'prerender.js')).href)

  const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  for (const [path, metadata] of Object.entries(publicPages)) {
    const title = escapeHtml(metadata.title)
    const description = escapeHtml(metadata.description)
    let html = template
      .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*/, `$1${description}`)
      .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*/, `$1${description}`)
      .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${title}`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*/, `$1${description}`)
      .replace(/(<meta property="og:url" content=")[^"]*/, `$1${origin}${path}`)
      .replace('</head>', `  <script type="application/ld+json">${JSON.stringify(structuredData(path)).replaceAll('<', '\\u003c')}</script>\n  </head>`)
    html = html
      .replace('</head>', `  <link rel="canonical" href="${origin}${path}" />\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root" data-prerendered="${path}">${renderPage(path)}</div>`)
    const output = path === '/' ? resolve(dist, 'index.html') : resolve(dist, `${path.slice(1)}/index.html`)
    await mkdir(resolve(output, '..'), { recursive: true })
    await writeFile(output, html)
  }
} finally {
  await rm(serverBuild, { recursive: true, force: true })
}
