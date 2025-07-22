"use client"

import { useState, useEffect } from "react"
import TaskFormModal from "../components/TaskFormModal"
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  Edit,
  Trash2,
  BarChart3,
} from "lucide-react"
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask as apiDeleteTask,
} from '../services/taskService'

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([])
  const [_, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list")
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { tasks: apiTasks } = await getTasks({ page: 1, limit: 1000 }) // tüm görevler
        setTasks(apiTasks.map(task => ({
          ...task,
          description: task.description || '', // Ensure description is never undefined
        })) as any[])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.baslik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assignee && task.assignee.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || task.durum === statusFilter
    const matchesPriority = priorityFilter === "all" || task.oncelik === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleFormSubmit = async (data: Omit<any, 'id'>) => {

    console.log(data)
    if (editingTask) {
      /* güncelle */
      const updated = await updateTask(editingTask.id, {
        baslik: data.title,
        aciklama: data.description,
        bitis_tarihi: data.dueDate,
        durum: data.status as any, // Type casting to resolve type mismatch
        oncelik: data.priority,
      })
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
      setEditingTask(null)
    } else {
      /* yeni görev */
      const created = await createTask({
        baslik: data.title,
        aciklama: data.description,
        bitis_tarihi: data.dueDate,
        durum: data.status,
        oncelik: data.priority,
      })
      setTasks(prev => [...prev, created])
    }
    setShowModal(false)
  }

  const deleteTask = async (id: number) => {
    if (!confirm('Görev silinsin mi?')) return
    await apiDeleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const toggleTaskStatus = async (id: number) => {
    const current = tasks.find(t => t.id === id)
    if (!current) return

    try {
      setUpdatingTaskId(id) // Spinner'ı başlat

      const newStatus = current.durum === 'completed' ? 'pending' : 'completed'
      const updated = await updateTask(id, {
        baslik: current.baslik,
        durum: newStatus,
        aciklama: current.aciklama,
        bitis_tarihi: current.bitis_tarihi,
        oncelik: current.oncelik,
      })

      setTasks(prev => prev.map(t => t.id === id ? updated : t))
    } catch (error) {
      console.error("Görev güncellenirken hata:", error)
      // dilersen burada toast veya alert gösterimi yapılabilir
    } finally {
      setUpdatingTaskId(null) // Spinner'ı durdur
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-3 h-3" />
      case "medium":
        return <Clock className="w-3 h-3" />
      case "low":
        return <CheckCircle2 className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  const pendingTasks = tasks.filter((t) => t.durum === "pending")
  const completedTasks = tasks.filter((t) => t.durum === "completed")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Görevler
                </h1>
                <p className="text-gray-600 mt-1">
                  Görevlerinizi yönetin, takip edin ve tamamlayın.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white/50 rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors duration-200 ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors duration-200 ${viewMode === "kanban" ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Kanban
                </button>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Görev Ekle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{tasks.length}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Toplam Görev Sayısı</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{pendingTasks.length}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Gönderilen Görevler</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{completedTasks.length}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Bitmiş Görevler</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50"
                >
                  <option value="all">Tümü</option>
                  <option value="pending">Gönderildi</option>
                  <option value="completed">Tamamlandı</option>
                </select>
              </div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50"
              >
                <option value="all">Tüm Öncelikler</option>
                <option value="high">Yüksek</option>
                <option value="medium">Orta</option>
                <option value="low">Az</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task List */}
        {viewMode === "list" ? (
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Görev yok</h3>
                <p className="text-gray-600 mb-6">
                  Görev listeniz boş. Yeni bir görev oluşturmak için aşağıdaki butona tıklayın.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Görev Oluştur</span>
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 group ${isOverdue(task.bitis_tarihi) && task.durum === "pending" ? "border-red-200 bg-red-50/50" : ""
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        disabled={updatingTaskId === task.id}
                        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                        ${task.durum === "completed"
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-green-500"}
                          ${updatingTaskId === task.id ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                      >
                        {updatingTaskId === task.id ? (
                          <div
                            className={`w-3 h-3 border-2 border-t-transparent rounded-full animate-spin ${task.durum === "completed" ? "border-white" : "border-gray-500"
                              }`}
                          />
                        ) : (
                          task.durum === "completed" && <CheckCircle2 className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3
                            className={`text-lg font-semibold ${task.durum === "completed" ? "line-through text-gray-500" : "text-gray-900"
                              }`}
                          >
                            {task.baslik}
                          </h3>
                          <span
                            className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                              task.oncelik || "medium",
                            )}`}
                          >
                            {getPriorityIcon(task.oncelik || "medium")}
                            <span>
                              {{
                                high: "Yüksek",
                                medium: "Orta",
                                low: "Düşük",
                              }[task.oncelik as "high" | "medium" | "low" || "medium"]}
                            </span>
                          </span>
                        </div>
                        <p className={`text-gray-600 mb-3 ${task.durum === "completed" ? "line-through" : ""}`}>
                          {task.aciklama || "No description provided"}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span
                              className={
                                isOverdue(task.bitis_tarihi) && task.durum === "pending" ? "text-red-600 font-medium" : ""
                              }
                            >
                              {new Date(task.bitis_tarihi).toLocaleDateString()}
                              {isOverdue(task.bitis_tarihi) && task.durum === "pending" && " (Bitiş Tarihi Geçti)"}
                            </span>
                          </div>
                          {task.assignee && (
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{task.assignee}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full
                    ${task.durum === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"}`}>
                      {task.durum === "completed" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{task.durum === "completed" ? "Tamamlandı" : "Gönderildi"}</span>
                    </span>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => {
                          setEditingTask(task)
                          setShowModal(true)
                        }}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit task"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Kanban View
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gönderilen Görevler */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span>Gönderilen ({pendingTasks.length})</span>
              </h3>
              <div className="space-y-4">
                {filteredTasks
                  .filter((task) => task.durum === "pending")
                  .map((task) => (
                    <div
                      key={task.id}
                      className={`bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200 ${isOverdue(task.bitis_tarihi) ? "bg-red-50/50 border-red-200" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">{task.baslik}</h4>
                          <p className="text-sm text-gray-600 mb-3">{task.aciklama}</p>
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.oncelik || "medium")}`}
                            >
                              {getPriorityIcon(task.oncelik || "medium")}
                              <span>
                                {{
                                  high: "Yüksek",
                                  medium: "Orta",
                                  low: "Düşük",
                                }[task.oncelik as "high" | "medium" | "low" || "medium"]}
                              </span>
                            </span>
                            <span className={`text-xs ${isOverdue(task.bitis_tarihi) ? "text-red-600 font-medium" : "text-gray-500"}`}>
                              {new Date(task.bitis_tarihi).toLocaleDateString()}
                              {isOverdue(task.bitis_tarihi) && " (Bitiş Tarihi Geçti)"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Tamamlanan Görevler */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Tamamlanan ({completedTasks.length})</span>
              </h3>
              <div className="space-y-4">
                {filteredTasks
                  .filter((task) => task.durum === "completed")
                  .map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200 opacity-75"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2 line-through">{task.baslik}</h4>
                          <p className="text-sm text-gray-600 mb-3 line-through">{task.aciklama}</p>
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.oncelik || "medium")}`}
                            >
                              {getPriorityIcon(task.oncelik || "medium")}
                              <span>
                                {{
                                  high: "Yüksek",
                                  medium: "Orta",
                                  low: "Düşük",
                                }[task.oncelik as "high" | "medium" | "low" || "medium"]}
                              </span>
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(task.bitis_tarihi).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <TaskFormModal
          onClose={() => {
            setShowModal(false)
            setEditingTask(null)
          }}
          onSubmit={handleFormSubmit}
          initialData={editingTask}
        />
      )}
    </div>
  )
}
