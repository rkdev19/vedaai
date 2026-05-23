import axios from 'axios'
import { Assignment, GeneratedPaper } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export const createAssignment = (formData: FormData) =>
  api.post<{ assignmentId: string }>('/api/assignments', formData)

export const getAssignments = () => api.get<Assignment[]>('/api/assignments')

export const deleteAssignment = (id: string) =>
  api.delete(`/api/assignments/${id}`)

export const getResult = (id: string) =>
  api.get<GeneratedPaper>(`/api/assignments/${id}/result`)

export const regenerate = (id: string) =>
  api.post(`/api/assignments/${id}/regenerate`)
