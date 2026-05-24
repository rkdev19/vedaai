'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MoreVertical } from 'lucide-react'
import { format } from 'date-fns'
import { Assignment } from '@/types'
import { deleteAssignment } from '@/lib/api'

interface Props {
  assignment: Assignment
  onDeleted: (id: string) => void
}

export default function AssignmentCard({ assignment, onDeleted }: Props) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function formatDate(dateStr: string) {
    try {
      return format(new Date(dateStr), 'dd-MM-yyyy')
    } catch {
      return dateStr
    }
  }

  function handleCardClick() {
    if (assignment.status === 'done') {
      router.push(`/output/${assignment._id}`)
    } else {
      router.push(`/assignments/create`)
    }
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    setDeleting(true)
    try {
      await deleteAssignment(assignment._id)
      onDeleted(assignment._id)
    } catch {
      alert('Failed to delete assignment')
    } finally {
      setDeleting(false)
      setMenuOpen(false)
    }
  }

  function handleView(e: React.MouseEvent) {
    e.stopPropagation()
    setMenuOpen(false)
    handleCardClick()
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    done: { bg: '#dcfce7', text: '#166534' },
    failed: { bg: '#fee2e2', text: '#991b1b' },
    processing: { bg: '#fef9c3', text: '#854d0e' },
    pending: { bg: '#F0F0F0', text: '#5E5E5E' },
  }
  const sc = statusColors[assignment.status] ?? statusColors.pending

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer relative transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
      style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className="leading-tight"
          style={{
            fontWeight: 800,
            fontSize: '24px',
            letterSpacing: '-0.04em',
            color: '#303030',
          }}
        >
          {assignment.title}
        </h3>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((v) => !v)
            }}
            className="p-1 rounded-full transition-colors hover:bg-gray-100"
          >
            <MoreVertical className="w-5 h-5" style={{ color: '#A9A9A9' }} />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-9 w-44 bg-white z-10 py-1 overflow-hidden"
              style={{
                borderRadius: '16px',
                boxShadow: '0px 16px 48px rgba(0,0,0,0.2), 0px 32px 48px rgba(0,0,0,0.05)',
              }}
            >
              <button
                onClick={handleView}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                style={{ color: '#303030' }}
              >
                View Assignment
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors disabled:opacity-50"
                style={{
                  color: '#C53535',
                  background: '#F6F6F6',
                  borderRadius: '0 0 8px 8px',
                }}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <p
          style={{
            fontWeight: 800,
            fontSize: '16px',
            lineHeight: '120%',
            color: '#303030',
          }}
        >
          Assigned on : {formatDate(assignment.createdAt)}
        </p>
        <p
          style={{
            fontWeight: 800,
            fontSize: '16px',
            lineHeight: '120%',
            color: '#303030',
          }}
        >
          Due : {formatDate(assignment.dueDate)}
        </p>
      </div>

      <div className="mt-4">
        <span
          className="inline-block text-xs px-3 py-1 rounded-full font-semibold capitalize"
          style={{ background: sc.bg, color: sc.text }}
        >
          {assignment.status}
        </span>
      </div>
    </div>
  )
}
