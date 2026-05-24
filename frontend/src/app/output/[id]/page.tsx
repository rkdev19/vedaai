'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Download, RefreshCw } from 'lucide-react'
import { getResult, regenerate } from '@/lib/api'
import { GeneratedPaper } from '@/types'
import QuestionPaper from '@/components/output/QuestionPaper'

export default function OutputPage() {
  const params = useParams()
  const id = params.id as string
  const [paper, setPaper] = useState<GeneratedPaper | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [regenerating, setRegenerating] = useState(false)

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

  function handleDownload() {
    window.print()
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
        <p style={{ color: 'rgba(94,94,94,0.8)' }}>{error || 'Paper not found'}</p>
        <button
          onClick={fetchResult}
          className="text-white text-sm px-6 py-2.5"
          style={{ borderRadius: '48px', background: '#181818' }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Outer card */}
      <div
        className="no-print"
        style={{
          background: '#5E5E5E',
          borderRadius: '32px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        {/* AI header bar */}
        <div
          className="flex items-start justify-between gap-4 p-5"
          style={{
            background: 'rgba(24,24,24,0.8)',
            borderRadius: '24px',
          }}
        >
          <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Certainly! Here is a customized Question Paper for your{' '}
            <strong className="text-white">{paper.gradeLevel}</strong>{' '}
            {paper.subject} class:
          </p>
          <button
            onClick={handleDownload}
            className="shrink-0 flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80 active:scale-95 duration-100"
            style={{
              background: '#FFFFFF',
              color: '#303030',
              borderRadius: '48px',
              padding: '10px 20px',
              whiteSpace: 'nowrap',
            }}
          >
            <Download className="w-4 h-4" />
            Download as PDF
          </button>
        </div>

        {/* Regenerate */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70 disabled:opacity-40"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
            {regenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
        </div>
      </div>

      {/* Paper */}
      <QuestionPaper paper={paper} />
    </div>
  )
}
