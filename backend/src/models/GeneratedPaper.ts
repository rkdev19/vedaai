import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IQuestion {
  text: string
  difficulty: 'easy' | 'moderate' | 'hard'
  marks: number
  answer?: string
}

export interface ISection {
  title: string
  instruction: string
  questionType: string
  questions: IQuestion[]
}

export interface IGeneratedPaper extends Document {
  assignmentId: Types.ObjectId
  schoolName: string
  subject: string
  gradeLevel: string
  timeAllowed: string
  totalMarks: number
  sections: ISection[]
  createdAt: Date
}

const questionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'moderate', 'hard'], required: true },
  marks: { type: Number, required: true },
  answer: { type: String },
})

const sectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questionType: { type: String, required: true },
  questions: { type: [questionSchema], required: true },
})

const generatedPaperSchema = new Schema<IGeneratedPaper>({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  schoolName: { type: String, required: true },
  subject: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  timeAllowed: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  sections: { type: [sectionSchema], required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IGeneratedPaper>('GeneratedPaper', generatedPaperSchema)
