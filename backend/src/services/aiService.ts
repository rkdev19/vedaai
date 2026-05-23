import OpenAI from 'openai'
import { IAssignment } from '../models/Assignment'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

  const userPrompt = `Create a question paper for:
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

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 3000,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert Indian school exam paper creator. Return ONLY a valid JSON object with no markdown, no explanation, no code fences. Follow the exact schema provided. All questions must be appropriate for the grade level.',
      },
      { role: 'user', content: userPrompt },
    ],
  })

  const raw = response.choices[0]?.message?.content ?? ''

  try {
    return JSON.parse(raw) as IPaperData
  } catch {
    throw new Error('AI returned invalid JSON')
  }
}
