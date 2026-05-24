'use client'

import { forwardRef } from 'react'
import { GeneratedPaper, Question } from '@/types'

interface Props {
  paper: GeneratedPaper
}

const difficultyColors: Record<Question['difficulty'], { bg: string; color: string }> = {
  easy: { bg: '#dcfce7', color: '#166534' },
  moderate: { bg: '#fef9c3', color: '#854d0e' },
  hard: { bg: '#fee2e2', color: '#991b1b' },
}

const QuestionPaper = forwardRef<HTMLDivElement, Props>(({ paper }, ref) => {
  const hasAnswers = paper.sections.some((s) => s.questions.some((q) => q.answer))

  return (
    <div
      ref={ref}
      id="paper-content"
      className="bg-white max-w-3xl mx-auto"
      style={{ borderRadius: '32px', padding: '32px' }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1
          style={{
            fontFamily: 'var(--font-inter), Inter, serif',
            fontSize: '32px',
            fontWeight: 700,
            color: '#303030',
            letterSpacing: '-0.02em',
          }}
        >
          {paper.schoolName}
        </h1>
        <p className="text-base font-semibold mt-1" style={{ color: '#303030' }}>
          Subject: {paper.subject}
        </p>
        <p className="text-base" style={{ color: '#5E5E5E' }}>
          Class: {paper.gradeLevel}
        </p>
      </div>

      {/* Meta row */}
      <div
        className="flex justify-between text-sm font-medium py-2 my-4"
        style={{
          borderTop: '1px solid rgba(0,0,0,0.15)',
          borderBottom: '1px solid rgba(0,0,0,0.15)',
          color: '#303030',
        }}
      >
        <span>Time Allowed: {paper.timeAllowed}</span>
        <span>Maximum Marks: {paper.totalMarks}</span>
      </div>

      {/* Instructions */}
      <p className="text-sm mb-4" style={{ color: '#5E5E5E' }}>
        All questions are compulsory unless stated otherwise.
      </p>

      {/* Student info */}
      <div className="text-sm flex flex-col gap-1.5 mb-6" style={{ color: '#303030' }}>
        <div>
          Name:{' '}
          <span className="inline-block border-b-2 border-gray-400 w-40 mx-1 mb-0.5" />
        </div>
        <div>
          Roll Number:{' '}
          <span className="inline-block border-b-2 border-gray-400 w-32 mx-1 mb-0.5" />
        </div>
        <div>
          Class: {paper.gradeLevel} &nbsp; Section:{' '}
          <span className="inline-block border-b-2 border-gray-400 w-24 mx-1 mb-0.5" />
        </div>
      </div>

      {/* Sections */}
      {paper.sections.map((section, si) => (
        <div key={si} className="mb-8">
          <h2
            className="text-center uppercase tracking-wide"
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#303030',
              letterSpacing: '-0.02em',
            }}
          >
            {section.title}
          </h2>
          <p className="font-semibold text-sm mt-1" style={{ color: '#303030' }}>
            {section.questionType}
          </p>
          <p className="italic text-sm mb-4" style={{ color: '#5E5E5E' }}>
            {section.instruction}
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            {section.questions.map((q, qi) => (
              <li key={qi}>
                <div className="flex items-start gap-2">
                  <span
                    className="flex-1"
                    style={{
                      fontSize: '16px',
                      lineHeight: '240%',
                      color: '#303030',
                    }}
                  >
                    {q.text}
                  </span>
                  <span
                    className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium capitalize mt-2"
                    style={{
                      background: difficultyColors[q.difficulty]?.bg ?? '#F0F0F0',
                      color: difficultyColors[q.difficulty]?.color ?? '#5E5E5E',
                    }}
                  >
                    {q.difficulty}
                  </span>
                  <span className="shrink-0 text-xs ml-1 mt-2" style={{ color: '#A9A9A9' }}>
                    [{q.marks} Marks]
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}

      {/* End of paper */}
      <div
        className="text-center font-semibold text-sm mt-6 mb-8 pt-4"
        style={{ borderTop: '1px solid rgba(0,0,0,0.15)', color: '#303030' }}
      >
        End of Question Paper
      </div>

      {/* Answer key */}
      {hasAnswers && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.15)' }}>
          <p className="font-bold text-sm mb-2" style={{ color: '#303030' }}>Answer Key:</p>
          <ol className="list-decimal pl-5 space-y-1 text-sm" style={{ color: '#5E5E5E' }}>
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
