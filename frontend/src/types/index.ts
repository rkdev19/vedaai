export interface QuestionType {
  id: string
  type: string
  numQuestions: number
  marks: number
}

export interface AssignmentFormData {
  subject: string
  gradeLevel: string
  dueDate: string
  questionTypes: QuestionType[]
  additionalInstructions: string
  file?: File | null
}

export interface Assignment {
  _id: string
  title: string
  subject: string
  gradeLevel: string
  dueDate: string
  questionTypes: QuestionType[]
  status: 'pending' | 'processing' | 'done' | 'failed'
  createdAt: string
}

export interface Question {
  text: string
  difficulty: 'easy' | 'moderate' | 'hard'
  marks: number
  answer?: string
}

export interface PaperSection {
  title: string
  instruction: string
  questionType: string
  questions: Question[]
}

export interface GeneratedPaper {
  _id: string
  assignmentId: string
  schoolName: string
  subject: string
  gradeLevel: string
  timeAllowed: string
  totalMarks: number
  sections: PaperSection[]
  createdAt: string
}
