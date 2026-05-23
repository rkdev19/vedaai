import { Worker } from 'bullmq'
import redis from '../config/redis'
import Assignment from '../models/Assignment'
import GeneratedPaper from '../models/GeneratedPaper'
import { generatePaper } from '../services/aiService'
import { notifyClients } from '../ws/socketManager'

export function startGenerationWorker() {
  const worker = new Worker(
    'paper-generation',
    async (job) => {
      const { assignmentId } = job.data as { assignmentId: string }

      const assignment = await Assignment.findById(assignmentId)
      if (!assignment) throw new Error(`Assignment ${assignmentId} not found`)

      assignment.status = 'processing'
      await assignment.save()
      notifyClients(assignmentId, { type: 'job:processing', assignmentId })

      try {
        const paperData = await generatePaper(assignment)

        const paper = await GeneratedPaper.create({
          assignmentId: assignment._id,
          ...paperData,
        })

        assignment.status = 'done'
        await assignment.save()

        notifyClients(assignmentId, {
          type: 'job:done',
          assignmentId,
          resultId: paper._id.toString(),
        })
      } catch (err) {
        assignment.status = 'failed'
        await assignment.save()

        const message = err instanceof Error ? err.message : 'Unknown error'
        notifyClients(assignmentId, { type: 'job:failed', assignmentId, error: message })
        throw err
      }
    },
    { connection: redis, concurrency: 2 }
  )

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message)
  })

  return worker
}
