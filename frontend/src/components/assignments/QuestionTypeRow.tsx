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
    <div className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors">
      <select
        value={questionType.type}
        onChange={(e) => updateQuestionType(questionType.id, { type: e.target.value })}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm flex-1 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
      >
        {QUESTION_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* No. of Questions counter */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => adjust('numQuestions', -1)}
          className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all duration-100"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-sm font-medium text-gray-900">
          {questionType.numQuestions}
        </span>
        <button
          type="button"
          onClick={() => adjust('numQuestions', 1)}
          className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all duration-100"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Marks counter */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => adjust('marks', -1)}
          className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all duration-100"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-sm font-medium text-gray-900">
          {questionType.marks}
        </span>
        <button
          type="button"
          onClick={() => adjust('marks', 1)}
          className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all duration-100"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => removeQuestionType(questionType.id)}
        disabled={!canRemove}
        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-20 shrink-0"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}
