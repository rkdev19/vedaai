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
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (assignments.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <h1 className="font-bold text-lg text-gray-900">Assignments</h1>
        <span className="w-2 h-2 rounded-full bg-green-500" />
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Manage and create assignments for your classes.
      </p>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter By
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Assignment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-12">
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
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
        <Link
          href="/assignments/create"
          className="flex items-center gap-2 rounded-full bg-gray-900 text-white px-6 py-3 shadow-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </Link>
      </div>
    </div>
  )
}
