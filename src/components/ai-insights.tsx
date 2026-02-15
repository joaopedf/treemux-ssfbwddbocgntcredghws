"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw } from "lucide-react"
import { useState } from "react"

interface AIInsightsProps {
  requests: any[]
}

export default function AIInsights({ requests }: AIInsightsProps) {
  const [insights, setInsights] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const analyzeRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests }),
      })
      const data = await response.json()
      setInsights(data.insights)
    } catch (error) {
      setInsights('Failed to analyze requests. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>
              Get intelligent analysis and optimization recommendations
            </CardDescription>
          </div>
          <Button
            onClick={analyzeRequests}
            disabled={loading || requests.length === 0}
            size="sm"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {insights ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{insights}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-3 text-purple-300" />
            <p className="text-sm">
              {requests.length === 0
                ? 'Capture some API requests first, then click Analyze'
                : 'Click "Analyze" to get AI-powered insights on your API performance'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
