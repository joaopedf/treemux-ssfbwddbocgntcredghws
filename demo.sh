#!/bin/bash

# API Flow Visualizer Demo Script

echo "🎯 API Flow Visualizer Demo"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This script will send sample API requests through the proxy."
echo "Make sure both servers are running:"
echo "  Terminal 1: bun run proxy"
echo "  Terminal 2: bun dev"
echo ""
echo "Press Enter to start the demo..."
read

echo "📡 Sending sample API requests..."
echo ""

# Example 1: GitHub API
echo "1️⃣  Fetching GitHub user data..."
curl -x http://localhost:8080 https://api.github.com/users/github -s > /dev/null
echo "   ✓ Request sent"
sleep 1

# Example 2: JSONPlaceholder
echo "2️⃣  Fetching posts from JSONPlaceholder..."
curl -x http://localhost:8080 https://jsonplaceholder.typicode.com/posts/1 -s > /dev/null
echo "   ✓ Request sent"
sleep 1

# Example 3: Another endpoint
echo "3️⃣  Fetching user profile..."
curl -x http://localhost:8080 https://jsonplaceholder.typicode.com/users/1 -s > /dev/null
echo "   ✓ Request sent"
sleep 1

# Example 4: Comments
echo "4️⃣  Fetching comments..."
curl -x http://localhost:8080 https://jsonplaceholder.typicode.com/comments?postId=1 -s > /dev/null
echo "   ✓ Request sent"
sleep 1

echo ""
echo "✅ Demo complete!"
echo ""
echo "🌐 Check the dashboard at: http://localhost:3000"
echo "   - View the requests in real-time"
echo "   - See the flow visualization"
echo "   - Click 'Analyze' for AI-powered insights"
echo ""
