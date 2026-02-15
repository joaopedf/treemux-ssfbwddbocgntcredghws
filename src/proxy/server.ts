import { serve } from "bun"

interface RequestData {
  id: string
  method: string
  path: string
  headers: Record<string, string>
  status?: number
  duration?: number
  completed: boolean
  timestamp: number
}

const clients = new Set<any>()
const requests = new Map<string, RequestData>()

// WebSocket server for real-time updates
const wsServer = serve({
  port: 3001,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return
    }
    return new Response("WebSocket server", { status: 200 })
  },
  websocket: {
    open(ws) {
      clients.add(ws)
      console.log('Client connected. Total clients:', clients.size)
    },
    message(ws, message) {
      console.log('Received message:', message)
    },
    close(ws) {
      clients.delete(ws)
      console.log('Client disconnected. Total clients:', clients.size)
    },
  },
})

function broadcast(data: any) {
  const message = JSON.stringify(data)
  clients.forEach(client => {
    try {
      client.send(message)
    } catch (err) {
      console.error('Failed to send to client:', err)
    }
  })
}

// HTTP Proxy server
const proxyServer = serve({
  port: 8080,
  async fetch(req) {
    const url = new URL(req.url)

    // Handle CONNECT method for HTTPS tunneling
    if (req.method === 'CONNECT') {
      return new Response('CONNECT not supported in this proxy', { status: 501 })
    }

    // Generate request ID
    const requestId = Math.random().toString(36).substring(7)
    const startTime = Date.now()

    // Determine target URL
    let targetUrl = url.searchParams.get('url') || url.pathname.substring(1)

    // If the path doesn't look like a URL, try to construct one
    if (!targetUrl.startsWith('http')) {
      const host = req.headers.get('host')
      if (host && host !== 'localhost:8080') {
        targetUrl = `http://${host}${url.pathname}${url.search}`
      } else {
        return new Response('Invalid proxy request. Use: http://localhost:8080/?url=TARGET_URL or set proper headers', {
          status: 400
        })
      }
    }

    // Create request data
    const requestData: RequestData = {
      id: requestId,
      method: req.method,
      path: targetUrl,
      headers: Object.fromEntries(req.headers.entries()),
      completed: false,
      timestamp: Date.now(),
    }

    requests.set(requestId, requestData)
    broadcast({ type: 'request', payload: requestData })

    try {
      // Forward the request
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: req.headers,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.blob() : undefined,
      })

      const duration = Date.now() - startTime

      // Update request data
      requestData.status = response.status
      requestData.duration = duration
      requestData.completed = true
      requests.set(requestId, requestData)

      broadcast({ type: 'request', payload: requestData })

      console.log(`${req.method} ${targetUrl} - ${response.status} (${duration}ms)`)

      // Clone response to return to client
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    } catch (error) {
      const duration = Date.now() - startTime

      requestData.status = 500
      requestData.duration = duration
      requestData.completed = true
      requests.set(requestId, requestData)

      broadcast({ type: 'request', payload: requestData })

      console.error(`${req.method} ${targetUrl} - ERROR (${duration}ms):`, error)

      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },
})

console.log('🚀 API Flow Visualizer Proxy Server')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`📡 WebSocket Server: ws://localhost:${wsServer.port}/ws`)
console.log(`🔀 HTTP Proxy Server: http://localhost:${proxyServer.port}`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('\n💡 Usage:')
console.log('   curl -x http://localhost:8080 https://api.github.com/users/github')
console.log('   export HTTP_PROXY=http://localhost:8080')
console.log('\n🌐 Dashboard: http://localhost:3000')
console.log('\n✨ Ready to capture API requests!\n')
