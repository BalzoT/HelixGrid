import http from 'node:http'
import url from 'node:url'

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || '', true)
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'GET' && parsed.pathname === '/v1/health') {
    res.statusCode = 200
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }

  if (req.method === 'GET' && parsed.pathname === '/v1/sim/pv') {
    const { lat, lon, kw = '1' } = parsed.query
    const capacityKw = Number(kw) || 1
    // Placeholder: simple sinusoidal daily production curve (kWh per hour)
    const hourly = Array.from({ length: 24 }, (_, h) => {
      const factor = Math.max(0, Math.sin(((h - 6) / 12) * Math.PI))
      return Number((capacityKw * factor).toFixed(3))
    })
    res.statusCode = 200
    res.end(
      JSON.stringify({
        site: { lat: Number(lat), lon: Number(lon), capacityKw },
        hourlyKwh: hourly,
        dailyKwh: Number(hourly.reduce((a, b) => a + b, 0).toFixed(3)),
      }),
    )
    return
  }

  res.statusCode = 404
  res.end(JSON.stringify({ error: 'Not Found' }))
})

const port = process.env.PORT ? Number(process.env.PORT) : 3002
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`sim listening on http://localhost:${port}`)
})

