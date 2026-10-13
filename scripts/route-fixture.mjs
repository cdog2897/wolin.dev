// Local declaration evaluator. Query appending and browser fragment inheritance
// model intended platform behavior; verify both on the live Vercel deployment.
export function resolveRoute(routes, input, method = 'GET') {
  const url = new URL(input)
  const headers = {}
  for (const entry of routes) {
    if (!entry.src || (entry.methods && !entry.methods.includes(method))) continue
    if (entry.has && !entry.has.every(rule => rule.type === 'host' && rule.value === url.hostname)) continue
    const match = url.pathname.match(new RegExp(entry.src))
    if (!match) continue
    const substitute = value => value.replace(/\$(\d+)/g, (_, index) => match[Number(index)] || '')
    for (const [key, value] of Object.entries(entry.headers || {})) headers[key] = substitute(value)
    if (entry.status || entry.dest) {
      const location = headers.Location && new URL(headers.Location, url)
      if (location && !location.search) location.search = url.search
      if (location && !location.hash) location.hash = url.hash
      return { status: entry.status || 200, dest: entry.dest && substitute(entry.dest), headers, followedUrl: location?.href }
    }
  }
  return { headers }
}
