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

  return (
    <div
      onClick={handleCardClick}
      className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer relative"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{assignment.title}</h3>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen((v) => !v)
            }}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1 overflow-hidden animate-in fade-in duration-150">
              <button
                onClick={handleView}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Assignment
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <p className="text-sm text-gray-500">
          Assigned on : {formatDate(assignment.createdAt)}
        </p>
        <p className="text-sm text-gray-500">Due : {formatDate(assignment.dueDate)}</p>
      </div>

      <div className="mt-3">
        <span
          className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
            assignment.status === 'done'
              ? 'bg-green-100 text-green-700'
              : assignment.status === 'failed'
              ? 'bg-red-100 text-red-700'
              : assignment.status === 'processing'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {assignment.status}
        </span>
      </div>
    </div>
  )
}
