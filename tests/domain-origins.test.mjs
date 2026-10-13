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
