"use client"

import { useEffect, useRef } from "react"

interface FlowVisualizationProps {
  requests: any[]
}

export default function FlowVisualization({ requests }: FlowVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background grid
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Group requests by similar endpoints
    const grouped = new Map<string, any[]>()
    requests.slice(0, 20).forEach(req => {
      const key = req.path?.split('?')[0] || 'unknown'
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key)!.push(req)
    })

    // Draw nodes for each endpoint group
    const nodes: { x: number; y: number; label: string; count: number; color: string }[] = []
    let x = 100
    let y = 100

    grouped.forEach((reqs, path) => {
      const avgDuration = reqs.reduce((acc, r) => acc + (r.duration || 0), 0) / reqs.length
      const hasErrors = reqs.some(r => r.status >= 400)

      const color = hasErrors ? '#ef4444' : avgDuration > 1000 ? '#f59e0b' : '#10b981'

      nodes.push({ x, y, label: path, count: reqs.length, color })

      // Draw node
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 30, 0, Math.PI * 2)
      ctx.fill()

      // Draw label
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(reqs.length.toString(), x, y)

      // Draw path label
      ctx.fillStyle = '#333'
      ctx.font = '12px sans-serif'
      ctx.fillText(path.substring(0, 20), x, y + 50)

      x += 200
      if (x > canvas.width - 100) {
        x = 100
        y += 150
      }
    })

    // Draw connections between nodes (simplified)
    if (nodes.length > 1) {
      ctx.strokeStyle = 'rgba(100, 100, 255, 0.3)'
      ctx.lineWidth = 2
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y)
        ctx.stroke()
      }
    }

  }, [requests])

  return (
    <div className="relative w-full h-[400px] bg-slate-50 dark:bg-slate-900 rounded-lg border">
      <canvas ref={canvasRef} className="w-full h-full" />
      {requests.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">No requests captured yet</p>
            <p className="text-sm">Configure your app to use the proxy on port 8080</p>
          </div>
        </div>
      )}
    </div>
  )
}
