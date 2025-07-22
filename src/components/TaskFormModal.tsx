"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
  X,
  CheckSquare,
  Plus,
  Type,
  FileText,
  Calendar,
  Flag,
  User,
  Tag,
  Clock,
  AlertCircle,
  Save,
  Sparkles,
  Check,
} from "lucide-react"

const schema = yup.object().shape({
  title: yup.string().required("Task title is required").min(3, "Title must be at least 3 characters"),
  description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  dueDate: yup.string().required("Due date is required"),
  status: yup.string().oneOf(["pending", "done"]).required("Status is required"),
  priority: yup.string().oneOf(["high", "medium", "low"]).required("Priority is required"),
  assignee: yup.string(),
  category: yup.string(),
})

interface TaskFormModalProps {
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
}

export default function TaskFormModal({ onClose, onSubmit, initialData }: TaskFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEdit = !!initialData

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date().toISOString().split("T")[0],
      status: "pending",
      priority: "medium",
      assignee: "",
      category: "",
    },
  })

  const watchedValues = watch()

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        dueDate: initialData.dueDate || new Date().toISOString().split("T")[0],
        status: initialData.status || "pending",
        priority: initialData.priority || "medium",
        assignee: initialData.assignee || "",
        category: initialData.category || "",
      })
    } else {
      reset({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split("T")[0],
        status: "pending",
        priority: "medium",
        assignee: "",
        category: "",
      })
    }
  }, [initialData, reset])

  const submitHandler = async (data: any) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    onSubmit(data)
    setIsSubmitting(false)
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
        return <AlertCircle className="w-4 h-4" />
      case "medium":
        return <Clock className="w-4 h-4" />
      case "low":
        return <Check className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    return status === "done"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-blue-100 text-blue-800 border-blue-200"
  }

  const categories = ["Design", "Development", "Meeting", "Research", "Marketing", "Support", "Planning"]
  const assignees = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "Tom Brown"]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                {isEdit ? <CheckSquare className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{isEdit ? "Edit Task" : "Create New Task"}</h2>
                <p className="text-green-100 text-sm">
                  {isEdit ? "Update task details and settings" : "Add a new task to your project"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-140px)]">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">
            {/* Task Overview Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Task Overview</h3>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("title")}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg ${
                      errors.title ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                    }`}
                    placeholder="Enter a clear and descriptive task title"
                  />
                  {!errors.title && watchedValues.title && watchedValues.title.length >= 3 && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none ${
                      errors.description ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                    }`}
                    placeholder="Provide detailed information about what needs to be done..."
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  {errors.description ? (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.description.message}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {watchedValues.description?.length || 0} characters (minimum 10 required)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Task Settings Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white">
                  <Flag className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Task Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Due Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register("dueDate")}
                      type="date"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["high", "medium", "low"].map((priority) => (
                      <label key={priority} className="cursor-pointer">
                        <input {...register("priority")} type="radio" value={priority} className="sr-only" />
                        <div
                          className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                            watchedValues.priority === priority
                              ? getPriorityColor(priority) + " border-current"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-1">
                            {getPriorityIcon(priority)}
                            <span className="text-sm font-medium capitalize">{priority}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["pending", "done"].map((status) => (
                      <label key={status} className="cursor-pointer">
                        <input {...register("status")} type="radio" value={status} className="sr-only" />
                        <div
                          className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                            watchedValues.status === status
                              ? getStatusColor(status) + " border-current"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-1">
                            {status === "done" ? <CheckSquare className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            <span className="text-sm font-medium capitalize">{status}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      {...register("category")}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Assignee</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    {...register("assignee")}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="">Assign to someone</option>
                    {assignees.map((assignee) => (
                      <option key={assignee} value={assignee}>
                        {assignee}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Task Preview */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Task Preview</span>
              </h4>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-semibold text-gray-900 text-lg">{watchedValues.title || "Task Title"}</h5>
                  <div className="flex items-center space-x-2">
                    {watchedValues.priority && (
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                          watchedValues.priority,
                        )}`}
                      >
                        {getPriorityIcon(watchedValues.priority)}
                        <span>{watchedValues.priority}</span>
                      </span>
                    )}
                    {watchedValues.category && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {watchedValues.category}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{watchedValues.description || "Task description will appear here"}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {watchedValues.dueDate ? new Date(watchedValues.dueDate).toLocaleDateString() : "No date"}
                      </span>
                    </div>
                    {watchedValues.assignee && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{watchedValues.assignee}</span>
                      </div>
                    )}
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      watchedValues.status,
                    )}`}
                  >
                    {watchedValues.status === "done" ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Task...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEdit ? "Update Task" : "Create Task"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
