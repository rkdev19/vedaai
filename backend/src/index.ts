import 'dotenv/config'
import http from 'http'
import express from 'express'
import cors from 'cors'
import WebSocket from 'ws'
import { connectDB } from './config/db'
import assignmentRoutes from './routes/assignments'
import { handleConnection, cleanupClient } from './ws/socketManager'
import { startGenerationWorker } from './workers/generationWorker'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server, path: '/ws' })

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json())
app.use('/api/assignments', assignmentRoutes)

wss.on('connection', (ws) => {
  handleConnection(ws)
  ws.on('close', () => cleanupClient(ws))
})

const PORT = process.env.PORT || 4000

async function main() {
  await connectDB()
  startGenerationWorker()
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

main()
