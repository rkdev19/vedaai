import mongoose, { Document, Schema } from 'mongoose'

export interface IQuestionType {
  type: string
  numQuestions: number
  marks: number
}

export interface IAssignment extends Document {
  title: string
  subject: string
  gradeLevel: string
  dueDate: Date
  questionTypes: IQuestionType[]
  additionalInstructions?: string
  fileText?: string
  status: 'pending' | 'processing' | 'done' | 'failed'
  createdAt: Date
}

const questionTypeSchema = new Schema<IQuestionType>({
  type: { type: String, required: true },
  numQuestions: { type: Number, required: true },
  marks: { type: Number, required: true },
})

const assignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  dueDate: { type: Date, required: true },
  questionTypes: { type: [questionTypeSchema], required: true },
  additionalInstructions: { type: String },
  fileText: { type: String },
  status: {
    type: String,
    enum: ['pending', 'processing', 'done', 'failed'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IAssignment>('Assignment', assignmentSchema)
