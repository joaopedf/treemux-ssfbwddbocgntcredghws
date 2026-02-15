import { anthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { requests } = await req.json()

    if (!requests || requests.length === 0) {
      return Response.json({
        insights: 'No requests to analyze yet. Start routing traffic through the proxy to see AI-powered insights.',
      })
    }

    // Analyze requests with AI
    const requestSummary = requests.map((r: any) => ({
      method: r.method,
      path: r.path,
      status: r.status,
      duration: r.duration,
    })).slice(0, 20) // Limit to recent requests

    const { text } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt: `You are an expert API performance analyst. Analyze these API requests and provide actionable insights:

${JSON.stringify(requestSummary, null, 2)}

Provide a concise analysis covering:
1. Performance bottlenecks (requests >1000ms)
2. Error patterns (4xx/5xx responses)
3. Potential optimizations (redundant calls, caching opportunities)
4. Best practices recommendations

Keep it brief (3-5 bullet points) and actionable.`,
    })

    return Response.json({ insights: text })
  } catch (error: any) {
    console.error('AI insights error:', error)
    return Response.json(
      {
        insights: `Analysis unavailable: ${error.message}. Make sure ANTHROPIC_API_KEY is set in your environment.`,
      },
      { status: 500 }
    )
  }
}
