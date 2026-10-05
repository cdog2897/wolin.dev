// Build output and ordered Vercel routes, without contacting a real backend.
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

const base = '/sample/UndercoverBedandSpas'
const config = JSON.parse(await readFile('vercel.json', 'utf8'))
function route(path, host = 'wolin.dev') {
  const headers = {}
  for (const entry of config.routes) {
    if (!entry.src || (entry.has && !entry.has.every(rule => rule.type === 'host' && rule.value === host))) continue
    const match = path.match(new RegExp(entry.src))
    if (!match) continue
    const substitute = value => value.replace(/\$(\d+)/g, (_, index) => match[Number(index)] || '')
    Object.assign(headers, entry.headers)
    if (entry.status || entry.dest) return { dest: entry.dest && substitute(entry.dest), status: entry.status || 200, headers: Object.fromEntries(Object.entries(headers).map(([key, value]) => [key, substitute(value)])) }
  }
  return { headers }
}
const pages = []
async function findPages(directory, path = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) await findPages(`${directory}/${entry.name}`, `${path}/${entry.name}`)
    else if (entry.name === 'index.html') pages.push(`${base}${path}`)
  }
}
await findPages(`dist${base}`)
assert.equal(pages.length, 24)
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
assert.ok(!sitemap.includes(base))
for (const path of pages) {
  const html = await readFile(`dist${path}/index.html`, 'utf8')
  assert.ok(html.includes('name="robots" content="noindex, nofollow"'), `${path}: initial noindex`)
  assert.ok(html.includes('Design Demo</title>'), `${path}: honest title`)
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${path}: one heading`)
  assert.ok(html.includes('DESIGN PREVIEW BY WOLIN'), `${path}: disclosure`)
  assert.ok(html.includes('No orders, bookings, payments, or messages are processed.'), `${path}: disclosure`)
  assert.ok(html.includes('/assets/UndercoverDemo-'), `${path}: initial style`)
  assert.ok(!html.includes('rel="canonical"'))
  assert.ok(!html.includes('application/ld+json'))
  assert.ok(!html.includes('<form action='))
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (href.startsWith(base)) assert.ok(pages.includes(href), `${path}: valid internal destination ${href}`)
  }
  for (const variant of [path, `${path}/`]) {
    const resolved = route(variant)
    assert.equal(resolved.dest, `${path}/index.html`, `${variant}: direct reload`)
    assert.equal(resolved.headers['X-Robots-Tag'], 'noindex, nofollow')
    assert.equal(route(variant, 'admin.wolin.dev').dest, '/private-shell.html', `${variant}: admin protection`)
  }
  assert.equal(route(`${path}/index.html`).headers.Location, path, `${path}: index alias`)
}
for (const path of [`${base}/unknown`, `${base}/collections/missing`]) {
  assert.equal(route(path).status, 404)
  assert.equal(route(path).headers['X-Robots-Tag'], 'noindex, nofollow')
}
assert.equal(route(`${base}Other`).dest, undefined)
const robots = await readFile('dist/robots.txt', 'utf8')
assert.ok(robots.includes(`Allow: ${base}`))
const source = await readFile('src/undercover/UndercoverDemo.tsx', 'utf8')
assert.ok(!/fetch\(|localStorage|sessionStorage|sendBeacon|XMLHttpRequest/.test(source))
console.log(`Undercover checks passed: ${pages.length} prerendered demo pages, scoped routes, initial noindex and headers, index redirects, sitemap exclusion, admin protection, valid internal links, and no form/backend transport.`)
