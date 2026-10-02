// Run after npm run build. These checks never contact a live API.
import assert from 'node:assert/strict'
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
const descriptions = new Set()
for (const [index, path] of paths.entries()) {
  const html = await readFile(`dist${path === '/' ? '' : path}/index.html`, 'utf8')
  assert.ok(html.includes(`<title>${titles[index]}</title>`), `${path}: title`)
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1)
  assert.ok(html.includes(`rel="canonical" href="https://wolin.dev${path}"`))
  assert.ok(html.includes(`data-prerendered="${path}"`))
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1)
  assert.ok(!html.includes('noindex'))
  assert.ok(sitemap.includes(`<loc>https://wolin.dev${path}</loc>`))
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)[1]
  assert.ok(!descriptions.has(description))
  descriptions.add(description)
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])
  assert.equal(schema['@context'], 'https://schema.org')
  assert.equal(schema['@graph'][0]['@type'], 'Organization')
  assert.ok(schema['@graph'].some(entity => entity['@type'] === 'Service'))
  assert.ok(!JSON.stringify(schema).match(/address|rating|review|price|guarantee/i))
  for (const entity of schema['@graph']) assert.equal(entity.areaServed.length, 3)
  for (const target of paths.slice(2)) assert.ok(html.includes(`href="${target}"`), `${path}: internal link ${target}`)
}
assert.equal((sitemap.match(/<loc>/g) || []).length, paths.length)
const privateShell = await readFile('dist/private-shell.html', 'utf8')
assert.ok(privateShell.includes('name="robots" content="noindex, nofollow"'))
assert.ok(privateShell.includes('<div id="root"></div>'))
assert.ok(!privateShell.includes('application/ld+json'))
assert.ok(!privateShell.includes('rel="canonical"'))
const portfolioShell = await readFile('dist/app-shell.html', 'utf8')
assert.ok(!portfolioShell.includes('noindex'))
assert.ok(portfolioShell.includes('<div id="root"></div>'))

// Evaluate the ordered route declarations, including host conditions and redirects.
function route(path, host = 'wolin.dev') {
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
    assert.equal(route(variant, 'admin.wolin.dev').dest, '/private-shell.html')
    assert.equal(route(variant, 'admin.wolin.dev').headers['X-Robots-Tag'], 'noindex, nofollow')
  }
  assert.equal(route(`${path}/index.html`).status, 308)
  assert.equal(route(`${path}/index.html`).headers.Location, path)
}
for (const path of ['/admin', '/admin/', '/sample', '/sign/example-token', '/sign/nested/token']) {
  assert.equal(route(path).dest, '/private-shell.html')
  assert.equal(route(path).headers['X-Robots-Tag'], 'noindex, nofollow')
}
assert.equal(route('/', 'admin.wolin.dev').dest, '/private-shell.html')
assert.equal(route('/robots.txt', 'admin.wolin.dev').dest, '/admin-robots.txt')
assert.equal(route('/calebwolin').dest, '/app-shell.html')
assert.equal(route('/90-day-hands-free-local-sensation').headers.Location, '/offers')
assert.equal(route('/not-a-real-route').dest, undefined)
assert.equal(routes.at(-1).handle, 'filesystem')
console.log('SEO checks passed: 6 prerendered pages, unique metadata, schemas, sitemap, internal links, private shells, ordered routes, redirects, and no wildcard fallback.')
