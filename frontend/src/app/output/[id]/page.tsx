'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { Download, RefreshCw } from 'lucide-react'
import { getResult, regenerate } from '@/lib/api'
import { GeneratedPaper } from '@/types'
import QuestionPaper from '@/components/output/QuestionPaper'

export default function OutputPage() {
  const params = useParams()
  const id = params.id as string
  const paperRef = useRef<HTMLDivElement>(null)
  const [paper, setPaper] = useState<GeneratedPaper | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [regenerating, setRegenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchResult()
  }, [id])

  async function fetchResult() {
    setLoading(true)
    setError('')
    try {
      const res = await getResult(id)
      setPaper(res.data)
    } catch {
      setError('Failed to load question paper. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegenerate() {
    setRegenerating(true)
    try {
      await regenerate(id)
      await new Promise((resolve) => setTimeout(resolve, 30000))
      await fetchResult()
    } catch {
      setError('Regeneration failed. Please try again.')
    } finally {
      setRegenerating(false)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${id}/pdf`
      )
      if (!response.ok) throw new Error('PDF generation failed')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `question-paper-${paper?.subject}-${paper?.gradeLevel}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to download PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !paper) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-gray-600">{error || 'Paper not found'}</p>
        <button
          onClick={fetchResult}
          className="rounded-full bg-gray-900 text-white px-6 py-2.5 text-sm hover:bg-gray-800 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Dark header */}
      <div className="no-print bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl px-6 py-4 mb-6 flex items-start justify-between gap-4">
        <p className="text-sm leading-relaxed flex-1">
          Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade{' '}
          <strong>{paper.gradeLevel}</strong> {paper.subject} classes on the NCERT chapters:
        </p>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="shrink-0 flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition-colors disabled:opacity-60"
        >
          {downloading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download as PDF
            </>
          )}
        </button>
      </div>

      {/* Paper */}
      <QuestionPaper ref={paperRef} paper={paper} />

      {/* Action bar */}
      <div className="no-print flex justify-center gap-4 mt-6 mb-8">
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
          {regenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>
    </div>
  )
}
