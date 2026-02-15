"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Network, Zap, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import FlowVisualization from "@/components/flow-visualization"
import ProxySettings from "@/components/proxy-settings"
import RequestsList from "@/components/requests-list"
import AIInsights from "@/components/ai-insights"

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    // Connect to WebSocket for real-time updates
    const ws = new WebSocket('ws://localhost:3001/ws')

    ws.onopen = () => {
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'request') {
        setRequests(prev => [data.payload, ...prev].slice(0, 50))
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
    }

    return () => ws.close()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
              <Activity className="h-10 w-10 text-blue-600" />
              API Flow Visualizer
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time API request flow visualization and debugging
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              isConnected
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-sm font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
              <p className="text-xs text-muted-foreground">In current session</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.length > 0
                  ? Math.round(requests.reduce((acc, r) => acc + (r.duration || 0), 0) / requests.length)
                  : 0}ms
              </div>
              <p className="text-xs text-muted-foreground">Across all endpoints</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.length > 0
                  ? Math.round((requests.filter(r => r.status < 400).length / requests.length) * 100)
                  : 100}%
              </div>
              <p className="text-xs text-muted-foreground">2xx/3xx responses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Flows</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter(r => !r.completed).length}
              </div>
              <p className="text-xs text-muted-foreground">Requests in progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Flow Visualization */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Request Flow Diagram</CardTitle>
              <CardDescription>
                Visual representation of API call chains and dependencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FlowVisualization requests={requests} />
            </CardContent>
          </Card>

          {/* AI Insights */}
          <div className="md:col-span-2">
            <AIInsights requests={requests} />
          </div>

          {/* Proxy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Proxy Configuration</CardTitle>
              <CardDescription>
                Configure the proxy server to intercept requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProxySettings />
            </CardContent>
          </Card>

          {/* Recent Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>
                Latest API requests captured by the proxy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequestsList requests={requests.slice(0, 10)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
