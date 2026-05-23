import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { Assignment, AssignmentFormData, QuestionType } from '@/types'

interface AssignmentStore {
  formData: AssignmentFormData
  updateFormData: (data: Partial<AssignmentFormData>) => void
  addQuestionType: () => void
  updateQuestionType: (id: string, updates: Partial<QuestionType>) => void
  removeQuestionType: (id: string) => void
  resetForm: () => void

  submissionStatus: 'idle' | 'submitting' | 'processing' | 'done' | 'failed'
  setSubmissionStatus: (status: AssignmentStore['submissionStatus']) => void
  currentAssignmentId: string | null
  currentResultId: string | null
  setCurrentAssignmentId: (id: string) => void
  setCurrentResultId: (id: string) => void

  assignments: Assignment[]
  setAssignments: (assignments: Assignment[]) => void

  totalQuestions: () => number
  totalMarks: () => number
}

const defaultFormData: AssignmentFormData = {
  subject: '',
  gradeLevel: '',
  dueDate: '',
  questionTypes: [
    { id: uuid(), type: 'Short Questions', numQuestions: 1, marks: 1 },
  ],
  additionalInstructions: '',
  file: null,
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  formData: { ...defaultFormData, questionTypes: [...defaultFormData.questionTypes] },

  updateFormData: (data) =>
    set((s) => ({ formData: { ...s.formData, ...data } })),

  addQuestionType: () =>
    set((s) => ({
      formData: {
        ...s.formData,
        questionTypes: [
          ...s.formData.questionTypes,
          { id: uuid(), type: 'Short Questions', numQuestions: 1, marks: 1 },
        ],
      },
    })),

  updateQuestionType: (id, updates) =>
    set((s) => ({
      formData: {
        ...s.formData,
        questionTypes: s.formData.questionTypes.map((qt) =>
          qt.id === id ? { ...qt, ...updates } : qt
        ),
      },
    })),

  removeQuestionType: (id) =>
    set((s) => ({
      formData: {
        ...s.formData,
        questionTypes: s.formData.questionTypes.filter((qt) => qt.id !== id),
      },
    })),

  resetForm: () =>
    set({
      formData: {
        ...defaultFormData,
        questionTypes: [{ id: uuid(), type: 'Short Questions', numQuestions: 1, marks: 1 }],
      },
    }),

  submissionStatus: 'idle',
  setSubmissionStatus: (status) => set({ submissionStatus: status }),
  currentAssignmentId: null,
  currentResultId: null,
  setCurrentAssignmentId: (id) => set({ currentAssignmentId: id }),
  setCurrentResultId: (id) => set({ currentResultId: id }),

  assignments: [],
  setAssignments: (assignments) => set({ assignments }),

  totalQuestions: () =>
    get().formData.questionTypes.reduce((sum, qt) => sum + qt.numQuestions, 0),

  totalMarks: () =>
    get().formData.questionTypes.reduce(
      (sum, qt) => sum + qt.numQuestions * qt.marks,
      0
    ),
}))
