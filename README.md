# API Flow Visualizer

Real-time API request flow visualization and debugging tool with AI-powered insights.

## Features

- 🔀 **HTTP Proxy Server**: Intercepts and logs API requests transparently
- 📊 **Real-time Dashboard**: Beautiful web UI with live request monitoring
- 📈 **Flow Visualization**: Visual DAG representation of API call chains
- ⚡ **Performance Metrics**: Response times, success rates, and bottleneck detection
- 🤖 **AI-Powered Insights**: Get intelligent optimization recommendations using Claude AI
- 🔴 **WebSocket Updates**: Live streaming of request data to the dashboard

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. Start the Servers

Terminal 1 - Start the proxy server:
```bash
bun run proxy
```

Terminal 2 - Start the Next.js dashboard:
```bash
bun dev
```

### 4. Configure Your Application

Route your API requests through the proxy:

**Option A: Environment Variables**
```bash
export HTTP_PROXY=http://localhost:8080
export HTTPS_PROXY=http://localhost:8080
```

**Option B: Command Line (curl)**
```bash
curl -x http://localhost:8080 https://api.github.com/users/github
```

**Option C: Node.js/Fetch**
```javascript
// Use the proxy URL directly
fetch('http://localhost:8080/?url=https://api.example.com/data')
```

### 5. Open the Dashboard

Visit http://localhost:3000 to see your API requests visualized in real-time!

## Architecture

- **Frontend**: Next.js 15 + React 19 + shadcn/ui + Tailwind CSS
- **Backend**: Bun HTTP proxy server with WebSocket support
- **AI**: Vercel AI SDK with Anthropic Claude for intelligent analysis
- **Real-time**: WebSocket connection for live request streaming

## Tech Stack

- ⚡ **Bun** - Fast JavaScript runtime
- ⚛️ **Next.js** - React framework
- 🎨 **shadcn/ui** - Beautiful UI components
- 🎯 **Tailwind CSS** - Utility-first CSS
- 🤖 **Vercel AI SDK** - AI integration
- 🔌 **WebSockets** - Real-time updates

## Project Structure

```
/workspace
├── src/
│   ├── app/              # Next.js app router
│   │   ├── page.tsx      # Main dashboard
│   │   ├── layout.tsx    # Root layout
│   │   └── api/          # API routes
│   │       └── insights/ # AI insights endpoint
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── flow-visualization.tsx
│   │   ├── proxy-settings.tsx
│   │   ├── requests-list.tsx
│   │   └── ai-insights.tsx
│   ├── proxy/            # Proxy server
│   │   └── server.ts     # Bun HTTP proxy + WebSocket
│   └── lib/              # Utilities
│       └── utils.ts      # Helper functions
```

## Use Cases

- 🐛 **Debug API Issues**: See exactly which requests are failing and why
- ⚡ **Performance Optimization**: Identify slow endpoints and bottlenecks
- 🔍 **API Flow Understanding**: Visualize complex request chains
- 📊 **Monitor Third-party APIs**: Track external API usage and performance
- 🤖 **Get AI Recommendations**: Receive intelligent optimization suggestions

## License

MIT
