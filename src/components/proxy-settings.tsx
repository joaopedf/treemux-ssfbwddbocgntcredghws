"use client"

import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function ProxySettings() {
  const [copied, setCopied] = useState(false)

  const proxyUrl = "http://localhost:8080"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Proxy Server URL</label>
        <div className="flex gap-2">
          <code className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-md text-sm">
            {proxyUrl}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(proxyUrl)}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Environment Variables</label>
        <div className="space-y-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
            <code className="text-xs block">
              export HTTP_PROXY={proxyUrl}
            </code>
            <code className="text-xs block">
              export HTTPS_PROXY={proxyUrl}
            </code>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => copyToClipboard(`export HTTP_PROXY=${proxyUrl}\nexport HTTPS_PROXY=${proxyUrl}`)}
          >
            Copy to Clipboard
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Usage Example (curl)</label>
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
          <code className="text-xs block break-all">
            curl -x {proxyUrl} https://api.example.com/users
          </code>
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          Configure your application to route HTTP/HTTPS requests through the proxy server to enable real-time monitoring and visualization.
        </p>
      </div>
    </div>
  )
}
