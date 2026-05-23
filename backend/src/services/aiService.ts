import { GoogleGenerativeAI } from '@google/generative-ai'
import { IAssignment } from '../models/Assignment'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export interface IPaperData {
  schoolName: string
  subject: string
  gradeLevel: string
  timeAllowed: string
  totalMarks: number
  sections: Array<{
    title: string
    instruction: string
    questionType: string
    questions: Array<{
      text: string
      difficulty: 'easy' | 'moderate' | 'hard'
      marks: number
      answer?: string
    }>
  }>
}

export async function generatePaper(assignment: IAssignment): Promise<IPaperData> {
  const questionTypesText = assignment.questionTypes
    .map((q) => `- ${q.type}: ${q.numQuestions} questions, ${q.marks} marks each`)
    .join('\n')

  const prompt = `You are an expert Indian school exam paper creator. Return ONLY a valid JSON object with no markdown, no explanation, no code fences. Follow the exact schema provided. All questions must be appropriate for the grade level.

Create a question paper for:
- Subject: ${assignment.subject}
- Grade/Class: ${assignment.gradeLevel}
- School: Delhi Public School

Question types required:
${questionTypesText}

Additional instructions: ${assignment.additionalInstructions || 'None'}
${assignment.fileText ? `Reference material:\n${assignment.fileText.slice(0, 2000)}` : ''}

Return this exact JSON structure:
{
  "schoolName": "Delhi Public School",
  "subject": "${assignment.subject}",
  "gradeLevel": "${assignment.gradeLevel}",
  "timeAllowed": "estimate based on total marks",
  "totalMarks": <sum of all marks>,
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries X marks",
      "questionType": "Short Answer Questions",
      "questions": [
        {
          "text": "question text here",
          "difficulty": "easy" | "moderate" | "hard",
          "marks": 2,
          "answer": "brief answer for answer key"
        }
      ]
    }
  ]
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
    return parsed as IPaperData
  } catch {
    throw new Error('AI returned invalid JSON')
  }
}
