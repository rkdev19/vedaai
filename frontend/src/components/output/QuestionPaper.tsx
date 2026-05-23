'use client'

import { forwardRef } from 'react'
import { GeneratedPaper, Question } from '@/types'

interface Props {
  paper: GeneratedPaper
}

const difficultyClasses: Record<Question['difficulty'], string> = {
  easy: 'bg-green-100 text-green-700 shadow-sm',
  moderate: 'bg-yellow-100 text-yellow-700 shadow-sm',
  hard: 'bg-red-100 text-red-700 shadow-sm',
}

const QuestionPaper = forwardRef<HTMLDivElement, Props>(({ paper }, ref) => {
  const hasAnswers = paper.sections.some((s) => s.questions.some((q) => q.answer))

  return (
    <div ref={ref} id="paper-content" className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 md:p-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">{paper.schoolName}, Sector-4, Bokaro</h1>
        <p className="text-base font-medium text-gray-800 mt-1">Subject: {paper.subject}</p>
        <p className="text-base text-gray-700">Class: {paper.gradeLevel}</p>
      </div>

      {/* Meta row */}
      <div className="flex justify-between text-sm font-medium border-t border-b border-gray-300 py-2 my-4">
        <span>Time Allowed: {paper.timeAllowed}</span>
        <span>Maximum Marks: {paper.totalMarks}</span>
      </div>

      {/* Instructions */}
      <p className="text-sm text-gray-700 mb-4">All questions are compulsory unless stated otherwise.</p>

      {/* Student info */}
      <div className="text-sm flex flex-col gap-1.5 mb-6">
        <div>
          Name:{' '}
          <span className="inline-block border-b-2 border-gray-400 w-40 mx-1 mb-0.5" />
        </div>
        <div>
          Roll Number:{' '}
          <span className="inline-block border-b-2 border-gray-400 w-32 mx-1 mb-0.5" />
        </div>
        <div>
          Class: {paper.gradeLevel} Section:{' '}
          <span className="inline-block border-b-2 border-gray-400 w-24 mx-1 mb-0.5" />
        </div>
      </div>

      {/* Sections */}
      {paper.sections.map((section, si) => (
        <div key={si} className="mb-6">
          <h2 className="text-xs font-bold text-center text-gray-900 uppercase tracking-wide">{section.title}</h2>
          <p className="font-semibold text-sm mt-2 text-gray-800">{section.questionType}</p>
          <p className="italic text-sm text-gray-600 mb-3">{section.instruction}</p>
          <ol className="list-decimal pl-5 space-y-2">
            {section.questions.map((q, qi) => (
              <li key={qi} className="text-sm">
                <div className="flex items-start gap-2">
                  <span className="flex-1 text-gray-900">{q.text}</span>
                  <span
                    data-difficulty={q.difficulty}
                    className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium capitalize ${difficultyClasses[q.difficulty]}`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="shrink-0 text-xs text-gray-500 ml-1">[{q.marks} Marks]</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}

      {/* End of paper */}
      <div className="text-center font-semibold text-sm mt-6 mb-8 border-t pt-4 text-gray-900">
        End of Question Paper
      </div>

      {/* Answer key */}
      {hasAnswers && (
        <div className="mt-4 border-t pt-4">
          <p className="font-bold text-sm mb-2 text-gray-900">Answer Key:</p>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
            {paper.sections.flatMap((s) =>
              s.questions
                .filter((q) => q.answer)
                .map((q, qi) => (
                  <li key={`${s.title}-${qi}`}>{q.answer}</li>
                ))
            )}
          </ol>
        </div>
      )}
    </div>
  )
})

QuestionPaper.displayName = 'QuestionPaper'

export default QuestionPaper
