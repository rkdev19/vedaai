import { Router, Request, Response } from 'express'
import multer from 'multer'
import { Queue } from 'bullmq'
import Assignment from '../models/Assignment'
import GeneratedPaper from '../models/GeneratedPaper'
import redis from '../config/redis'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })
const queue = new Queue('paper-generation', { connection: redis })

router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { subject, gradeLevel, dueDate, questionTypes, additionalInstructions, title } = req.body

    if (!subject || !gradeLevel || !dueDate) {
      res.status(400).json({ error: 'subject, gradeLevel, and dueDate are required' })
      return
    }

    let parsedQuestionTypes
    try {
      parsedQuestionTypes = typeof questionTypes === 'string' ? JSON.parse(questionTypes) : questionTypes
    } catch {
      res.status(400).json({ error: 'Invalid questionTypes format' })
      return
    }

    if (!Array.isArray(parsedQuestionTypes) || parsedQuestionTypes.length === 0) {
      res.status(400).json({ error: 'At least one question type is required' })
      return
    }

    for (const qt of parsedQuestionTypes) {
      if (!qt.numQuestions || qt.numQuestions < 1 || !qt.marks || qt.marks < 1) {
        res.status(400).json({ error: 'Each question type needs numQuestions >= 1 and marks >= 1' })
        return
      }
    }

    let fileText: string | undefined
    if (req.file) {
      const ext = req.file.originalname.split('.').pop()?.toLowerCase()
      if (ext === 'txt') {
        fileText = req.file.buffer.toString('utf-8')
      } else if (ext === 'pdf') {
        fileText = '[PDF uploaded - content extraction pending]'
      }
    }

    const assignment = await Assignment.create({
      title: title || `${subject} - ${gradeLevel}`,
      subject,
      gradeLevel,
      dueDate: new Date(dueDate),
      questionTypes: parsedQuestionTypes,
      additionalInstructions,
      fileText,
    })

    await queue.add('generate', { assignmentId: assignment._id.toString() })

    res.status(201).json({ assignmentId: assignment._id.toString() })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create assignment' })
  }
})

router.get('/', async (_req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 })
    res.json(assignments)
  } catch {
    res.status(500).json({ error: 'Failed to fetch assignments' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' })
      return
    }
    res.json(assignment)
  } catch {
    res.status(500).json({ error: 'Failed to fetch assignment' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id)
    await GeneratedPaper.deleteOne({ assignmentId: req.params.id })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete assignment' })
  }
})

router.get('/:id/result', async (req: Request, res: Response) => {
  try {
    const paper = await GeneratedPaper.findOne({ assignmentId: req.params.id })
    if (!paper) {
      res.status(404).json({ error: 'Result not found' })
      return
    }
    res.json(paper)
  } catch {
    res.status(500).json({ error: 'Failed to fetch result' })
  }
})

router.post('/:id/regenerate', async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' })
      return
    }

    assignment.status = 'pending'
    await assignment.save()

    await queue.add('generate', { assignmentId: assignment._id.toString() })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to regenerate' })
  }
})

export default router
