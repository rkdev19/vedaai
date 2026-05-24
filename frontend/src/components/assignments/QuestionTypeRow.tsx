'use client'

import { X, Minus, Plus } from 'lucide-react'
import { QuestionType } from '@/types'
import { useAssignmentStore } from '@/store/assignmentStore'

const QUESTION_TYPES = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Answer Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'True/False Questions',
]

interface Props {
  questionType: QuestionType
  canRemove: boolean
}

export default function QuestionTypeRow({ questionType, canRemove }: Props) {
  const updateQuestionType = useAssignmentStore((s) => s.updateQuestionType)
  const removeQuestionType = useAssignmentStore((s) => s.removeQuestionType)

  function adjust(field: 'numQuestions' | 'marks', delta: number) {
    const current = questionType[field]
    const next = Math.max(1, current + delta)
    updateQuestionType(questionType.id, { [field]: next })
  }

  return (
    <div className="flex items-center gap-2 py-1.5">
      <select
        value={questionType.type}
        onChange={(e) => updateQuestionType(questionType.id, { type: e.target.value })}
        className="flex-1 text-sm focus:outline-none appearance-none"
        style={{
          height: '44px',
          borderRadius: '48px',
          border: '1px solid rgba(0,0,0,0.15)',
          background: '#FFFFFF',
          color: '#303030',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        {QUESTION_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* No. of Questions counter */}
      <div
        className="flex items-center shrink-0"
        style={{
          height: '44px',
          borderRadius: '48px',
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.15)',
          padding: '0 8px',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => adjust('numQuestions', -1)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-100"
          style={{ color: '#303030' }}
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-5 text-center text-sm font-semibold" style={{ color: '#303030' }}>
          {questionType.numQuestions}
        </span>
        <button
          type="button"
          onClick={() => adjust('numQuestions', 1)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-100"
          style={{ color: '#303030' }}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Marks counter */}
      <div
        className="flex items-center shrink-0"
        style={{
          height: '44px',
          borderRadius: '48px',
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.15)',
          padding: '0 8px',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => adjust('marks', -1)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-100"
          style={{ color: '#303030' }}
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-5 text-center text-sm font-semibold" style={{ color: '#303030' }}>
          {questionType.marks}
        </span>
        <button
          type="button"
          onClick={() => adjust('marks', 1)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all duration-100"
          style={{ color: '#303030' }}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => removeQuestionType(questionType.id)}
        disabled={!canRemove}
        className="transition-colors disabled:opacity-20 shrink-0"
        style={{ color: '#A9A9A9' }}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
