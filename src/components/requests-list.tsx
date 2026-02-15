"use client"

import { ArrowRight, Clock, CheckCircle2, XCircle } from "lucide-react"

interface RequestsListProps {
  requests: any[]
}

export default function RequestsList({ requests }: RequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No requests captured yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {requests.map((req, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex-shrink-0">
            {req.status >= 400 ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : req.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Clock className="h-5 w-5 text-yellow-500 animate-spin" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                req.method === 'GET' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                req.method === 'POST' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                req.method === 'PUT' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                req.method === 'DELETE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
              }`}>
                {req.method}
              </span>
              <span className="text-sm font-medium truncate">{req.path}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>Status: {req.status || '...'}</span>
              <span>•</span>
              <span>{req.duration ? `${req.duration}ms` : 'Pending'}</span>
            </div>
          </div>

          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}
