'use client'

import { useState, useRef } from 'react'
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

const inputStyle = {
  height: '44px',
  borderRadius: '48px',
  border: '1px solid rgba(0,0,0,0.15)',
  background: '#FFFFFF',
  color: '#303030',
  paddingLeft: '16px',
  paddingRight: '16px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
}

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
    if (formData.questionTypes.length === 0) return
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
          <p className="font-bold text-lg" style={{ color: '#303030' }}>Generating your question paper...</p>
          <p className="text-sm mt-1" style={{ color: 'rgba(94,94,94,0.8)' }}>This usually takes 20–40 seconds</p>
        </div>
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#A9A9A9', animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="p-8"
        style={{
          background: 'rgba(255,255,255,0.5)',
          borderRadius: '32px',
        }}
      >
        {/* Two-segment progress bar */}
        <div className="flex gap-2 mb-8">
          <div
            className="flex-1 h-1.5 rounded-full"
            style={{
              border: step >= 1 ? '2.5px solid #5E5E5E' : '2.5px solid #DADADA',
              background: 'transparent',
            }}
          />
          <div
            className="flex-1 h-1.5 rounded-full"
            style={{
              border: step >= 2 ? '2.5px solid #5E5E5E' : '2.5px solid #DADADA',
              background: 'transparent',
            }}
          />
        </div>

        {step === 1 ? (
          <form onSubmit={step1Form.handleSubmit(handleNextStep)}>
            <div className="mb-6">
              <h2 className="font-bold text-xl" style={{ color: '#303030' }}>Assignment Details</h2>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(94,94,94,0.8)' }}>Basic information about your assignment</p>
            </div>

            {/* File upload */}
            <div className="mb-6">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer text-center transition-colors p-8"
                style={{
                  borderRadius: '16px',
                  border: `2px dashed ${dragging ? '#FF5623' : 'rgba(0,0,0,0.2)'}`,
                  background: dragging ? 'rgba(255,86,35,0.04)' : 'rgba(255,255,255,0.25)',
                }}
              >
                <UploadCloud className="w-10 h-10 mx-auto mb-3" style={{ color: '#A9A9A9' }} />
                <p className="text-sm font-medium" style={{ color: '#303030' }}>Choose a file or drag & drop it here</p>
                <p className="text-xs mt-1" style={{ color: '#A9A9A9' }}>JPEG, PNG, PDF up to 10MB</p>
                <button
                  type="button"
                  className="mt-4 text-sm px-5 py-1.5 transition-colors"
                  style={{
                    borderRadius: '48px',
                    border: '1px solid rgba(0,0,0,0.2)',
                    color: '#5E5E5E',
                    background: '#FFFFFF',
                  }}
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
                  <p className="mt-3 text-sm font-medium" style={{ color: '#FF5623' }}>{file.name}</p>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#303030' }}>Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  {...step1Form.register('dueDate')}
                  style={inputStyle}
                  className="focus:outline-none"
                />
                <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#A9A9A9' }} />
              </div>
              {step1Form.formState.errors.dueDate && (
                <p className="text-xs mt-1" style={{ color: '#C53535' }}>{step1Form.formState.errors.dueDate.message}</p>
              )}
            </div>

            {/* Question types */}
            <div className="mb-6">
              <div className="flex items-center text-xs font-semibold uppercase tracking-wider mb-3 gap-2" style={{ color: '#A9A9A9' }}>
                <span className="flex-1">Question Type</span>
                <span className="w-28 text-center">Questions</span>
                <span className="w-20 text-center">Marks</span>
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
                className="flex items-center gap-1 text-sm mt-3 transition-colors hover:opacity-70"
                style={{ color: '#5E5E5E' }}
              >
                <Plus className="w-4 h-4" />
                Add Question Type
              </button>
              <div className="flex justify-end gap-6 mt-3 text-sm" style={{ color: 'rgba(94,94,94,0.8)' }}>
                <span>Total Questions : <strong style={{ color: '#303030' }}>{totalQuestions()}</strong></span>
                <span>Total Marks : <strong style={{ color: '#303030' }}>{totalMarks()}</strong></span>
              </div>
            </div>

            {/* Additional info */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#303030' }}>
                Additional Information{' '}
                <span className="font-normal" style={{ color: '#A9A9A9' }}>(For better output)</span>
              </label>
              <div className="relative">
                <textarea
                  {...step1Form.register('additionalInstructions')}
                  rows={4}
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  className="w-full resize-none focus:outline-none text-sm"
                  style={{
                    borderRadius: '16px',
                    border: '1.5px dashed rgba(0,0,0,0.2)',
                    background: 'rgba(255,255,255,0.25)',
                    color: '#303030',
                    padding: '12px 40px 12px 16px',
                  }}
                />
                <Mic className="absolute right-3 bottom-3 w-4 h-4" style={{ color: '#A9A9A9' }} />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                disabled
                className="flex items-center gap-2 text-sm opacity-30 cursor-not-allowed"
                style={{
                  borderRadius: '48px',
                  border: '1px solid rgba(0,0,0,0.2)',
                  padding: '10px 24px',
                  color: '#303030',
                  background: 'transparent',
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 text-white text-sm font-medium active:scale-95 transition-all duration-100"
                style={{
                  borderRadius: '48px',
                  background: '#181818',
                  padding: '10px 24px',
                }}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={step2Form.handleSubmit(handleSubmit)}>
            <div className="mb-6">
              <h2 className="font-bold text-xl" style={{ color: '#303030' }}>Subject & Grade</h2>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(94,94,94,0.8)' }}>Tell us what this paper is for</p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#303030' }}>Subject</label>
              <input
                type="text"
                {...step2Form.register('subject')}
                placeholder="e.g. Mathematics, English, Science"
                style={inputStyle}
                className="focus:outline-none placeholder:text-[#A9A9A9]"
              />
              {step2Form.formState.errors.subject && (
                <p className="text-xs mt-1" style={{ color: '#C53535' }}>{step2Form.formState.errors.subject.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#303030' }}>Grade Level</label>
              <select
                {...step2Form.register('gradeLevel')}
                style={inputStyle}
                className="focus:outline-none appearance-none"
              >
                <option value="">Select a grade</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {step2Form.formState.errors.gradeLevel && (
                <p className="text-xs mt-1" style={{ color: '#C53535' }}>{step2Form.formState.errors.gradeLevel.message}</p>
              )}
            </div>

            {errorMsg && (
              <div
                className="mb-4 p-3 text-sm"
                style={{
                  borderRadius: '12px',
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#C53535',
                }}
              >
                {errorMsg}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm transition-colors hover:opacity-70"
                style={{
                  borderRadius: '48px',
                  border: '1px solid rgba(0,0,0,0.2)',
                  padding: '10px 24px',
                  color: '#303030',
                  background: 'transparent',
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex items-center gap-2 text-white text-sm font-medium active:scale-95 transition-all duration-100 disabled:opacity-60"
                style={{
                  borderRadius: '48px',
                  background: '#181818',
                  padding: '10px 24px',
                }}
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
