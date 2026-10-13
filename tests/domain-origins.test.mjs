import test from 'node:test'
import assert from 'node:assert/strict'
import contact from '../node_modules/.tmp/api-tests/api/visibility-report.js'
import { isSameOrigin } from '../node_modules/.tmp/api-tests/api/_lib/http.js'

for (const host of ['wolin.dev', 'wolin.studio', 'admin.wolin.dev']) {
  test(`${host}: same-origin API requests remain valid`, () => {
    assert.equal(isSameOrigin({ headers: { origin: `https://${host}`, host } }), true)
    assert.equal(isSameOrigin({ headers: { origin: 'https://unrelated.example', host } }), false)
  })
}

for (const host of ['wolin.dev', 'wolin.studio']) {
  test(`${host}: contact origin validation works without sending email`, async () => {
    for (const [origin, expected] of [[`https://${host}`, 200], ['https://unrelated.example', 403]]) {
      const response = { code: 0, setHeader() {}, status(code) { this.code = code; return this }, json() {} }
      // The honeypot exits before transport; this checks origin handling only.
      await contact({ method: 'POST', headers: { origin, host }, body: { company: 'bot' } }, response)
      assert.equal(response.code, expected)
    }
  })
}

test('admin migration verifies on the new host before setting its host-only cookie', async () => {
  process.env.SESSION_SECRET = 'domain-test-secret-at-least-thirty-two-characters'
  process.env.ADMIN_EMAIL = 'caleb.wolin@gmail.com'
  delete process.env.ADMIN_BASE_URL
  const { default: admin } = await import('../node_modules/.tmp/api-tests/api/admin.js')
  const { createSignedToken } = await import('../node_modules/.tmp/api-tests/api/_lib/auth.js')
  const token = createSignedToken('caleb.wolin@gmail.com', 300)
  const call = async host => {
    const response = { headers: {}, statusCode: 0, setHeader(key, value) { this.headers[key] = value }, end() {}, status(code) { this.statusCode = code; return this }, json() {} }
    await admin({ method: 'GET', headers: { host }, query: { action: 'verify', token } }, response)
    return response
  }
  for (const host of ['admin.wolin.dev', 'wolin.dev', 'wolin.studio']) {
    const old = await call(host)
    assert.equal(old.statusCode, 307)
    assert.equal(old.headers.Location, `https://admin.wolin.studio/api/admin?action=verify&token=${encodeURIComponent(token)}`)
    assert.equal(old.headers['Set-Cookie'], undefined)
    assert.equal(old.headers['Referrer-Policy'], 'no-referrer')
    assert.equal(old.headers['Cache-Control'], 'no-store, max-age=0')
  }
  const current = await call('admin.wolin.studio')
  assert.equal(current.statusCode, 302)
  assert.equal(current.headers.Location, 'https://admin.wolin.studio/')
  assert.ok(current.headers['Set-Cookie'].includes('HttpOnly; Secure; SameSite=Lax'))
  assert.ok(!current.headers['Set-Cookie'].includes('Domain='))
  assert.equal(current.headers['Referrer-Policy'], 'no-referrer')
  const post = { headers: {}, statusCode: 0, setHeader(key, value) { this.headers[key] = value }, status(code) { this.statusCode = code; return this }, json() {}, end() {} }
  await admin({ method: 'POST', headers: { host: 'admin.wolin.dev' }, query: { action: 'verify', token }, body: { redirect: 'https://unrelated.example' } }, post)
  assert.equal(post.statusCode, 405)
  assert.equal(post.headers.Location, undefined)
  assert.equal(post.headers['Set-Cookie'], undefined)
})
