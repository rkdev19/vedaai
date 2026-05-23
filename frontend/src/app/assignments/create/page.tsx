'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadCloud, CalendarDays, Plus, Mic, ArrowLeft, ArrowRight } from 'lucide-react'
import { useAssignmentStore } from '@/store/assignmentStore'
import { createAssignment } from '@/lib/api'
import { subscribeToJob } from '@/lib/wsClient'
import QuestionTypeRow from '@/components/assignments/QuestionTypeRow'

const step1Schema = z.object({
  dueDate: z.string().min(1, 'Due date is required'),
  additionalInstructions: z.string().optional(),
})

const step2Schema = z.object({
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>

const GRADES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)

export default function CreateAssignmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'processing' | 'failed'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { formData, updateFormData, addQuestionType, totalQuestions, totalMarks,
    setCurrentAssignmentId, setCurrentResultId, setSubmissionStatus } = useAssignmentStore()

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { dueDate: formData.dueDate, additionalInstructions: formData.additionalInstructions },
  })

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { subject: formData.subject, gradeLevel: formData.gradeLevel },
  })

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0]
    if (picked) setFile(picked)
  }

  async function handleNextStep(data: Step1Data) {
    if (formData.questionTypes.length === 0) {
      return
    }
    updateFormData({ dueDate: data.dueDate, additionalInstructions: data.additionalInstructions || '' })
    setStep(2)
  }

  async function handleSubmit(data: Step2Data) {
    updateFormData({ subject: data.subject, gradeLevel: data.gradeLevel })

    if (formData.questionTypes.length === 0) {
      setErrorMsg('Add at least one question type')
      return
    }

    setStatus('submitting')
    setErrorMsg('')

    try {
      const fd = new FormData()
      fd.append('subject', data.subject)
      fd.append('gradeLevel', data.gradeLevel)
      fd.append('dueDate', formData.dueDate)
      fd.append('title', `${data.subject} - ${data.gradeLevel}`)
      fd.append('questionTypes', JSON.stringify(formData.questionTypes))
      if (formData.additionalInstructions) {
        fd.append('additionalInstructions', formData.additionalInstructions)
      }
      if (file) fd.append('file', file)

      const res = await createAssignment(fd)
      const { assignmentId } = res.data

      setCurrentAssignmentId(assignmentId)
      setStatus('processing')
      setSubmissionStatus('processing')

      const cleanup = subscribeToJob(assignmentId, (payload) => {
        if (payload.type === 'job:done' && payload.resultId) {
          cleanup()
          setCurrentResultId(payload.resultId)
          setSubmissionStatus('done')
          router.push(`/output/${assignmentId}`)
        } else if (payload.type === 'job:failed') {
          cleanup()
          setStatus('failed')
          setSubmissionStatus('failed')
          setErrorMsg(payload.error || 'Generation failed. Please try again.')
        }
      })
    } catch {
      setStatus('failed')
      setErrorMsg('Failed to create assignment. Please try again.')
    }
  }

  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        <div className="text-center">
          <p className="font-semibold text-gray-900 text-lg">Generating your question paper...</p>
          <p className="text-sm text-gray-500 mt-1">This usually takes 20-40 seconds</p>
        </div>
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        {/* Progress bar */}
        <div className="h-1 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        {step === 1 ? (
          <form onSubmit={step1Form.handleSubmit(handleNextStep)}>
            <div className="mb-6">
              <h2 className="font-semibold text-base text-gray-900">Assignment Details</h2>
              <p className="text-sm text-gray-500 mt-0.5">Basic information about your assignment</p>
            </div>

            {/* File upload */}
            <div className="mb-6">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleFileDrop}
                className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                  dragging ? 'border-orange-400 bg-orange-50' : 'border-gray-300 bg-white'
                }`}
              >
                <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium">Choose a file or drag & drop it here</p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, upto 10MB</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 rounded-full border border-gray-300 px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {file && (
                  <p className="mt-3 text-sm text-green-600 font-medium">{file.name}</p>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Upload images of your preferred document/image
              </p>
            </div>

            {/* Due Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  {...step1Form.register('dueDate')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 appearance-none"
                />
                <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {step1Form.formState.errors.dueDate && (
                <p className="text-xs text-red-500 mt-1">{step1Form.formState.errors.dueDate.message}</p>
              )}
            </div>

            {/* Question types */}
            <div className="mb-6">
              <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 gap-3">
                <span className="flex-1">Question Type</span>
                <span className="w-24 text-center">No. of Questions</span>
                <span className="w-16 text-center">Marks</span>
                <span className="w-5" />
              </div>
              {formData.questionTypes.map((qt) => (
                <QuestionTypeRow
                  key={qt.id}
                  questionType={qt}
                  canRemove={formData.questionTypes.length > 1}
                />
              ))}
              <button
                type="button"
                onClick={addQuestionType}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Question Type
              </button>
              <div className="flex justify-end gap-6 mt-3 text-sm text-gray-500">
                <span>Total Questions : <strong className="text-gray-900">{totalQuestions()}</strong></span>
                <span>Total Marks : <strong className="text-gray-900">{totalMarks()}</strong></span>
              </div>
            </div>

            {/* Additional info */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Additional Information{' '}
                <span className="font-normal text-gray-500">(For better output)</span>
              </label>
              <div className="relative">
                <textarea
                  {...step1Form.register('additionalInstructions')}
                  rows={4}
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
                <Mic className="absolute right-3 bottom-3 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                disabled
                className="flex items-center gap-2 rounded-full border border-gray-200 px-6 py-2.5 text-sm opacity-40 cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-gray-900 text-white px-6 py-2.5 text-sm hover:bg-gray-800 active:scale-95 transition-all duration-100"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={step2Form.handleSubmit(handleSubmit)}>
            <div className="mb-6">
              <h2 className="font-semibold text-base text-gray-900">Subject & Grade</h2>
              <p className="text-sm text-gray-500 mt-0.5">Tell us what this paper is for</p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
              <input
                type="text"
                {...step2Form.register('subject')}
                placeholder="e.g. Mathematics, English, Science"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              />
              {step2Form.formState.errors.subject && (
                <p className="text-xs text-red-500 mt-1">{step2Form.formState.errors.subject.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Grade Level</label>
              <select
                {...step2Form.register('gradeLevel')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20"
              >
                <option value="">Select a grade</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {step2Form.formState.errors.gradeLevel && (
                <p className="text-xs text-red-500 mt-1">{step2Form.formState.errors.gradeLevel.message}</p>
              )}
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                {errorMsg}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 rounded-full border border-gray-200 px-6 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex items-center gap-2 rounded-full bg-gray-900 text-white px-6 py-2.5 text-sm hover:bg-gray-800 active:scale-95 transition-all duration-100 disabled:opacity-60"
              >
                {status === 'submitting' ? 'Generating...' : 'Generate'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
