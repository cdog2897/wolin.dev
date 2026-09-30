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
  const { renderPage } = await import(pathToFileURL(resolve(serverBuild, 'prerender.js')).href)

  for (const path of ['/', '/offers']) {
    let html = template
    if (path === '/offers') {
      const title = 'Offers — Wolin'
      const description = 'Explore Wolin’s 90-day social media program, monthly social media plans, custom websites, and services by custom quote for local businesses.'
      html = html
        .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
        .replace(/(<meta\s+name="description"\s+content=")[^"]*("\s*\/>)/, `$1${description}$2`)
        .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
        .replace(/(<meta\s+property="og:description"\s+content=")[^"]*/, `$1${description}`)
        .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${title}`)
        .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*/, `$1${description}`)
        .replace(/(<meta property="og:url" content=")[^"]*/, `$1${origin}${path}`)
    }
    html = html
      .replace('</head>', `  <link rel="canonical" href="${origin}${path}" />\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root" data-prerendered="${path}">${renderPage(path)}</div>`)
    const output = path === '/' ? resolve(dist, 'index.html') : resolve(dist, 'offers/index.html')
    await mkdir(resolve(output, '..'), { recursive: true })
    await writeFile(output, html)
  }
} finally {
  await rm(serverBuild, { recursive: true, force: true })
}
