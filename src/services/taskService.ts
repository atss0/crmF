// src/services/taskService.ts
import axios from '../utils/axios'        // ↩︎ interceptors + baseURL
import qs from 'qs'

/* ---------- Tipler ---------- */
export type TaskStatus   = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type Task = {
  id: number
  baslik: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  atanan: string
  assignedUser?: { id: number; name: string; email: string }
  customerId?: number
  customer?:   { id: number; name: string }
  opportunityId?: number
  opportunity?: { id: number; title: string }
  tags?: string[]
  estimatedHours?: number
  actualHours?: number
  dependencies?: number[]
  subtasks?: { id: number; title: string; completed: boolean }[]
  createdAt: string
  updatedAt: string
  completedAt?: string | null
}

export type Pagination = { page: number; limit: number; total: number; pages: number }

/* ---------- API Yanıt Şablonları ---------- */
type ListResponse   = { success: true; data: { tasks: any[]; pagination: Pagination } }
type SingleResponse = { success: true; data: Task }

/* ---------- Filtre Parametreleri ---------- */
export type TaskFilters = {
  page?: number
  limit?: number
  search?: string
  status?: TaskStatus
  priority?: TaskPriority
  assignedTo?: number
  dueDate?: string                          // ISO / YYYY-MM-DD
  sort?: string
  order?: 'asc' | 'desc'
}

/* ---------- CRUD Servisleri ---------- */

// GET /tasks
export const getTasks = async (
  params: TaskFilters = {},
): Promise<ListResponse['data']> => {
  const res = await axios.get<ListResponse>('/tasks', {
    params,
    paramsSerializer: p => qs.stringify(p, { arrayFormat: 'repeat' }),
  })
  return res.data.data
}

// GET /tasks/:id
export const getTask = async (id: number): Promise<Task> => {
  const res = await axios.get<SingleResponse>(`/tasks/${id}`)
  return res.data.data
}

// POST /tasks
export const createTask = async (data: Partial<any>): Promise<Task> => {
  const res = await axios.post<SingleResponse>('/tasks', data)
  return res.data.data
}

// PUT /tasks/:id
export const updateTask = async (
  id: number,
  data: Partial<any>,
): Promise<Task> => {
  const res = await axios.put<SingleResponse>(`/tasks/${id}`, data)
  return res.data.data
}

// DELETE /tasks/:id
export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`/tasks/${id}`)
}

/* ---------- Ek Uç-Noktalar ---------- */

// POST /tasks/:id/comments
export const addTaskComment = async (
  taskId: number,
  content: string,
) => {
  const res = await axios.post(`/tasks/${taskId}/comments`, { content })
  return res.data.data                                   // yeni yorum nesnesi
}

// POST /tasks/:id/time-tracking
export const addTimeTracking = async (
  taskId: number,
  hours: number,
  description: string,
  date: string,            // 'YYYY-MM-DD'
) => {
  const res = await axios.post(`/tasks/${taskId}/time-tracking`, {
    hours,
    description,
    date,
  })
  return res.data.data                                   // zaman takip kaydı
}