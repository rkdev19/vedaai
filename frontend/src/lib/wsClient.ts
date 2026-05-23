interface WSPayload {
  type: string
  resultId?: string
  error?: string
}

export function subscribeToJob(
  assignmentId: string,
  onStatusChange: (payload: WSPayload) => void
): () => void {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000'
  const socket = new WebSocket(`${wsUrl}/ws`)

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: 'subscribe', assignmentId }))
  }

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data) as WSPayload
      onStatusChange(payload)
    } catch {
      // ignore malformed messages
    }
  }

  socket.onerror = () => {
    onStatusChange({ type: 'job:failed', error: 'WebSocket connection failed' })
  }

  return () => socket.close()
}
