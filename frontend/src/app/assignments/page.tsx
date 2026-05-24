'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Plus } from 'lucide-react'
import { useAssignmentStore } from '@/store/assignmentStore'
import { getAssignments } from '@/lib/api'
import { Assignment } from '@/types'
import AssignmentCard from '@/components/assignments/AssignmentCard'
import EmptyState from '@/components/assignments/EmptyState'

export default function AssignmentsPage() {
  const { assignments, setAssignments } = useAssignmentStore()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAssignments()
      .then((res) => setAssignments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [setAssignments])

  function handleDeleted(id: string) {
    setAssignments(assignments.filter((a) => a._id !== id))
  }

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (assignments.length === 0) return <EmptyState />

  return (
    <div className="max-w-4xl mx-auto">
      {/* Filter bar */}
      <div
        className="flex items-center gap-3 mb-6 h-16 px-4 rounded-[20px]"
        style={{ background: '#FFFFFF' }}
      >
        <button className="flex items-center gap-1.5 shrink-0">
          <Filter className="w-4 h-4" style={{ color: '#A9A9A9' }} />
          <span className="font-bold text-sm" style={{ color: '#A9A9A9' }}>Filter By</span>
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#A9A9A9' }} />
          <input
            type="text"
            placeholder="Search Assignment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-9 pr-4 rounded-full text-sm bg-transparent focus:outline-none"
            style={{
              border: '1px solid rgba(0,0,0,0.2)',
              color: '#303030',
            }}
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-sm text-center py-12" style={{ color: 'rgba(94,94,94,0.8)' }}>
          No assignments match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((a: Assignment) => (
            <AssignmentCard key={a._id} assignment={a} onDeleted={handleDeleted} />
          ))}
        </div>
      )}

      {/* Floating create button */}
      <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-20">
        <Link
          href="/assignments/create"
          className="flex items-center gap-2 text-white text-base font-medium px-6 py-3 transition-opacity hover:opacity-90 active:scale-95 duration-100"
          style={{
            background: '#181818',
            borderRadius: '48px',
            boxShadow: '0px 16px 48px rgba(0,0,0,0.12), 0px 32px 48px rgba(0,0,0,0.2)',
          }}
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </Link>
      </div>
    </div>
  )
}
