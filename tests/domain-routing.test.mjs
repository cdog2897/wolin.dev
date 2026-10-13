import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolveRoute } from '../scripts/route-fixture.mjs'
const { routes } = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'))
const aliases = ['wolin.dev', 'www.wolin.dev', 'www.wolin.studio']
const publicPaths = ['/', '/offers', '/social-media-management', '/web-design', '/service-areas', '/marketing', '/calebwolin', '/sample', '/sample/UndercoverBedandSpas', '/sample/UndercoverBedandSpas/collections/highlife', '/robots.txt', '/sitemap.xml']
for (const host of aliases) {
  test(`${host}: public routes redirect to the same new-host path`, () => {
    for (const path of publicPaths) for (const method of ['GET', 'HEAD']) {
      const result = resolveRoute(routes, `https://${host}${path}?utm_source=hunter&x=a%2Fb#contact`, method)
      assert.equal(result.status, 308)
      assert.equal(result.headers.Location, `https://wolin.studio${path}`)
      assert.equal(result.followedUrl, `https://wolin.studio${path}?utm_source=hunter&x=a%2Fb#contact`)
      if (path.startsWith('/sample')) assert.equal(result.headers['X-Robots-Tag'], 'noindex, nofollow')
    }
  })
  test(`${host}: aliases normalize in one redirect`, () => {
    for (const [path, target] of [['/index.html','/'], ['/offers/index.html','/offers'], ['/web-design/index.html','/web-design'], ['/90-day-hands-free-local-sensation/','/offers'], ['/sample/UndercoverBedandSpas/index.html','/sample/UndercoverBedandSpas'], ['/sample/UndercoverBedandSpas/spas/index.html','/sample/UndercoverBedandSpas/spas']]) {
      const result = resolveRoute(routes, `https://${host}${path}`)
      assert.equal(result.headers.Location, `https://wolin.studio${target}`)
      assert.notEqual(resolveRoute(routes, result.headers.Location).status, 308)
    }
  })
  test(`${host}: private/API paths and static assets remain on their host`, () => {
    for (const path of ['/api','/api/visibility-report','/api/stripe-webhook','/api/admin','/api/sign','/private-shell.html','/app-shell.html','/assets/old-chunk.js','/favicon.svg','/undercover-demo/favicon.svg','/unknown','/sampleOther']) for (const method of ['GET','HEAD','POST','OPTIONS','PUT','DELETE']) {
      assert.equal(resolveRoute(routes, `https://${host}${path}`, method).headers.Location, undefined, `${method} ${path}`)
    }
    for (const path of [...publicPaths, '/offers/index.html', '/90-day-hands-free-local-sensation', '/sample/UndercoverBedandSpas/spas/index.html']) for (const method of ['POST','OPTIONS','PUT','DELETE']) assert.equal(resolveRoute(routes, `https://${host}${path}`, method).headers.Location, undefined)
  })
}
test('apex does not redirect to itself and admin host stays isolated', () => {
  for (const path of publicPaths) assert.equal(resolveRoute(routes, `https://wolin.studio${path}`).headers.Location, undefined)
  for (const path of ['/', '/offers', '/web-design', '/sample/UndercoverBedandSpas/spas']) {
    const result = resolveRoute(routes, `https://admin.wolin.studio${path}`)
    assert.equal(result.dest, '/private-shell.html')
    assert.equal(result.headers['X-Robots-Tag'], 'noindex, nofollow')
    assert.equal(result.headers.Location, undefined)
  }
  assert.equal(resolveRoute(routes, 'https://admin.wolin.studio/robots.txt').dest, '/admin-robots.txt')
  assert.equal(routes.at(-1).handle, 'filesystem')
})

test('private navigation moves, while old API POSTs remain local', () => {
  for (const host of [...aliases, 'wolin.studio']) for (const path of ['/admin','/admin/','/admin-preview']) {
    const result = resolveRoute(routes, `https://${host}${path}?source=old#view`)
    assert.equal(result.headers.Location, 'https://admin.wolin.studio/')
    assert.equal(result.headers['X-Robots-Tag'], 'noindex, nofollow')
    assert.equal(result.headers['Cache-Control'], 'no-store, max-age=0')
    assert.equal(result.headers['Referrer-Policy'], 'no-referrer')
  }
  for (const host of [...aliases, 'admin.wolin.dev', 'admin.wolin.studio']) {
    const signing = resolveRoute(routes, `https://${host}/sign/test-token`)
    assert.equal(signing.headers.Location, 'https://wolin.studio/sign/test-token')
    assert.equal(signing.headers['Cache-Control'], 'no-store, max-age=0')
    assert.equal(signing.headers['Referrer-Policy'], 'no-referrer')
    for (const path of ['/sign/test-token', '/api/sign', '/api/admin', '/api/stripe-webhook']) assert.equal(resolveRoute(routes, `https://${host}${path}`, 'POST').headers.Location, undefined)
  }
  for (const path of ['/', '/offers', '/robots.txt', '/unknown']) assert.equal(resolveRoute(routes, `https://admin.wolin.dev${path}`).headers.Location, `https://admin.wolin.studio${path}`)
  assert.equal(resolveRoute(routes, 'https://wolin.studio/sign/test-token').headers.Location, undefined)
})
