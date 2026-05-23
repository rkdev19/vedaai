import WebSocket from 'ws'

const subscribers = new Map<string, Set<WebSocket>>()

export function handleConnection(ws: WebSocket) {
  ws.once('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString())
      if (msg.type === 'subscribe' && msg.assignmentId) {
        const id: string = msg.assignmentId
        if (!subscribers.has(id)) subscribers.set(id, new Set())
        subscribers.get(id)!.add(ws)

        ws.on('close', () => {
          subscribers.get(id)?.delete(ws)
          if (subscribers.get(id)?.size === 0) subscribers.delete(id)
        })
      }
    } catch {
      // malformed message — ignore
    }
  })
}

export function notifyClients(assignmentId: string, payload: object) {
  const clients = subscribers.get(assignmentId)
  if (!clients) return
  const data = JSON.stringify(payload)
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  }
}

export function cleanupClient(ws: WebSocket) {
  for (const [id, clients] of subscribers) {
    clients.delete(ws)
    if (clients.size === 0) subscribers.delete(id)
  }
}
