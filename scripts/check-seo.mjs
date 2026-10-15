// Run after npm run build. These checks never contact a live API.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

const routes = JSON.parse(await readFile('vercel.json', 'utf8')).routes
const paths = ['/', '/offers', '/social-media-management', '/web-design', '/service-areas', '/marketing']
const titles = [
  'Wolin Studio | Social Media &amp; Web Design in Laramie',
  'Social Media &amp; Website Packages | Wolin Studio',
  'Social Media Management in Laramie | Wolin Studio',
  'Web Design in Laramie | Wolin Studio',
  'Laramie, Cheyenne &amp; Fort Collins | Wolin Studio',
  'Small Business Marketing in Laramie | Wolin Studio',
]
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
assert.ok((await readFile('dist/robots.txt', 'utf8')).includes('Sitemap: https://wolin.studio/sitemap.xml'))
const descriptions = new Set()
for (const [index, path] of paths.entries()) {
  const html = await readFile(`dist${path === '/' ? '' : path}/index.html`, 'utf8')
  assert.ok(html.includes(`<title>${titles[index]}</title>`), `${path}: title`)
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1)
  assert.ok(html.includes(`rel="canonical" href="https://wolin.studio${path}"`))
  assert.ok(html.includes(`data-prerendered="${path}"`))
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1)
  assert.ok(!html.includes('noindex'))
  assert.ok(sitemap.includes(`<loc>https://wolin.studio${path}</loc>`))
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)[1]
  assert.ok(!descriptions.has(description))
  descriptions.add(description)
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])
  assert.equal(schema['@context'], 'https://schema.org')
  assert.equal(schema['@graph'][0]['@type'], 'Organization')
  assert.equal(schema['@graph'][0]['@id'], 'https://wolin.studio/#organization')
  for (const entity of schema['@graph']) assert.ok(entity.url.startsWith('https://wolin.studio/'))
  assert.ok(html.includes(`property="og:url" content="https://wolin.studio${path}"`))
  assert.equal((html.match(/property="og:image"/g) || []).length, 1, `${path}: one Open Graph image`)
  assert.equal((html.match(/name="twitter:image"/g) || []).length, 1, `${path}: one Twitter image`)
  assert.ok(html.includes('property="og:image" content="https://wolin.studio/og.png"'), `${path}: absolute Open Graph image`)
  assert.ok(html.includes('name="twitter:image" content="https://wolin.studio/og.png"'), `${path}: absolute Twitter image`)
  assert.ok(schema['@graph'].some(entity => entity['@type'] === 'Service'))
  assert.ok(!JSON.stringify(schema).match(/address|rating|review|price|guarantee/i))
  for (const entity of schema['@graph']) assert.equal(entity.areaServed.length, 3)
  for (const target of paths.slice(2)) assert.ok(html.includes(`href="${target}"`), `${path}: internal link ${target}`)
}
assert.equal((sitemap.match(/<loc>/g) || []).length, paths.length)
function pngInfo(path) {
  const png = readFileSync(path)
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], `${path}: PNG signature`)
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20), colorType: png[25] }
}
assert.deepEqual(pngInfo('dist/logo-full.png'), { width: 2600, height: 800, colorType: 6 }, 'current logo is high-resolution RGBA')
assert.deepEqual(pngInfo('dist/logo-full-v2.png'), { width: 2600, height: 800, colorType: 6 }, 'stable signature logo is high-resolution RGBA')
assert.deepEqual(pngInfo('dist/og.png'), { width: 1200, height: 630, colorType: 6 }, 'social preview has standard dimensions')
const privateShell = await readFile('dist/private-shell.html', 'utf8')
assert.ok(privateShell.includes('name="robots" content="noindex, nofollow"'))
assert.ok(privateShell.includes('<div id="root"></div>'))
assert.ok(!privateShell.includes('property="og:image"'))
assert.ok(!privateShell.includes('application/ld+json'))
assert.ok(!privateShell.includes('rel="canonical"'))
const portfolioShell = await readFile('dist/app-shell.html', 'utf8')
assert.ok(!portfolioShell.includes('noindex'))
assert.ok(portfolioShell.includes('<div id="root"></div>'))
assert.ok(!portfolioShell.includes('property="og:image"'))

// Evaluate the ordered route declarations, including host conditions and redirects.
function route(path, host = 'wolin.studio') {
  const headers = {}
  for (const entry of routes) {
    if (!entry.src || (entry.has && !entry.has.every(rule => rule.type === 'host' && rule.value === host))) continue
    const match = path.match(new RegExp(entry.src))
    if (!match) continue
    const substitute = text => text.replace(/\$(\d+)/g, (_, index) => match[Number(index)] || '')
    for (const [key, value] of Object.entries(entry.headers || {})) headers[key] = substitute(value)
    if (entry.status || entry.dest) return { status: entry.status || 200, dest: entry.dest && substitute(entry.dest), headers }
  }
  return { headers }
}
for (const path of paths.slice(1)) {
  for (const variant of [path, `${path}/`]) {
    assert.equal(route(variant).dest, `${path}/index.html`)
    assert.equal(route(variant, 'admin.wolin.studio').dest, '/private-shell.html')
    assert.equal(route(variant, 'admin.wolin.studio').headers['X-Robots-Tag'], 'noindex, nofollow')
  }
  assert.equal(route(`${path}/index.html`).status, 308)
  assert.equal(route(`${path}/index.html`).headers.Location, path)
}
for (const path of ['/sample', '/sign/example-token', '/sign/nested/token']) {
  assert.equal(route(path).dest, '/private-shell.html')
  assert.equal(route(path).headers['X-Robots-Tag'], 'noindex, nofollow')
}
assert.equal(route('/', 'admin.wolin.studio').dest, '/private-shell.html')
assert.equal(route('/robots.txt', 'admin.wolin.studio').dest, '/admin-robots.txt')
assert.equal(route('/admin').headers.Location, 'https://admin.wolin.studio/')
assert.equal(route('/admin/').headers.Location, 'https://admin.wolin.studio/')
assert.equal(route('/calebwolin').dest, '/app-shell.html')
assert.equal(route('/90-day-hands-free-local-sensation').headers.Location, '/offers')
assert.equal(route('/not-a-real-route').dest, undefined)
assert.equal(routes.at(-1).handle, 'filesystem')
console.log('SEO checks passed: 6 prerendered pages, unique metadata, schemas, sitemap, internal links, private shells, ordered routes, redirects, and no wildcard fallback.')
