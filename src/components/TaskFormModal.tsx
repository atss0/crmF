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
  Clock,
  AlertCircle,
  Save,
  Sparkles,
  Check,
} from "lucide-react"

const schema = yup.object().shape({
  title: yup.string().required("Task title is required").min(3, "Görev başlığı en az 3 karakter olmalıdır"),
  description: yup.string().required("Description is required").min(10, "Görev açıklaması en az 10 karakter olmalıdır"),
  dueDate: yup.string().required("Due date is required"),
  status: yup.string().oneOf(["pending", "completed"]).required("Status is required"),
  priority: yup.string().oneOf(["high", "medium", "low"]).required("Priority is required"),
  assignee: yup.string(),
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
      })
    } else {
      reset({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split("T")[0],
        status: "pending",
        priority: "medium",
        assignee: "",
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
    return status === "completed"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-blue-100 text-blue-800 border-blue-200"
  }

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
                <h2 className="text-2xl font-bold">{isEdit ? "Görev Düzenle" : "Yeni Görev"}</h2>
                <p className="text-green-100 text-sm">
                  {isEdit ? "Görevi düzenle" : "Yeni görev ekle"}
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
                <h3 className="text-lg font-semibold text-gray-900">Görev Özeti</h3>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Başlık <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("title")}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg ${errors.title ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                      }`}
                    placeholder="Görev başlığını girin..."
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
                  Açıklama <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none ${errors.description ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                      }`}
                    placeholder="Görev açıklamasını girin..."
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
                      {watchedValues.description?.length || 0} karakter / {watchedValues.description?.length < 10 ? "En az 10 karakter" : "Yeterli"}
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
                <h3 className="text-lg font-semibold text-gray-900">Görev Ayarları</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Due Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bitiş Tarihi <span className="text-red-500">*</span>
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
                    Öncelik <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["high", "medium", "low"].map((priority) => {
                      const labels = {
                        high: "Yüksek",
                        medium: "Orta",
                        low: "Düşük",
                      }

                      return (
                        <label key={priority} className="cursor-pointer">
                          <input {...register("priority")} type="radio" value={priority} className="sr-only" />
                          <div
                            className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${watchedValues.priority === priority
                              ? getPriorityColor(priority) + " border-current"
                              : "border-gray-200 hover:border-gray-300"
                              }`}
                          >
                            <div className="flex items-center justify-center space-x-1">
                              {getPriorityIcon(priority)}
                              <span className="text-sm font-medium capitalize">{labels[priority as "high" | "medium" | "low"]}</span>
                            </div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Durum</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["pending", "completed"].map((status) => {
                      const labels = {
                        pending: "Bekliyor",
                        completed: "Tamamlandı",
                      }

                      return (
                        <label key={status} className="cursor-pointer">
                          <input {...register("status")} type="radio" value={status} className="sr-only" />
                          <div
                            className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${watchedValues.status === status
                              ? getStatusColor(status) + " border-current"
                              : "border-gray-200 hover:border-gray-300"
                              }`}
                          >
                            <div className="flex items-center justify-center space-x-1">
                              {status === "completed" ? <CheckSquare className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              <span className="text-sm font-medium capitalize">{labels[status as "pending" | "completed"]}</span>
                            </div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Task Preview */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Görev Önizlemesi</span>
              </h4>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-semibold text-gray-900 text-lg">{watchedValues.title || "Görev Başlığı"}</h5>
                  <div className="flex items-center space-x-2">
                    {watchedValues.priority && (
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                          watchedValues.priority,
                        )}`}
                      >
                        {getPriorityIcon(watchedValues.priority)}
                        <span>
                          {{
                            high: "Yüksek",
                            medium: "Orta",
                            low: "Düşük",
                          }[watchedValues.priority as "high" | "medium" | "low"]}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{watchedValues.description || "Görev açıklaması"}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {watchedValues.dueDate ? new Date(watchedValues.dueDate).toLocaleDateString() : "Bitiş tarihi yok"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      watchedValues.status,
                    )}`}
                  >
                    {watchedValues.status === "completed" ? "Tamamlandı" : "Bekliyor"}{" "}
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
                İptal
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="relative h-12 min-w-[200px] px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center"
              >
                {/* Normal metin */}
                <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-200 ${isSubmitting ? "opacity-0" : "opacity-100"}`}>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? "Görevi Güncelle" : "Görev Oluştur"}</span>
                </div>

                {/* Yükleniyor metni */}
                <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-200 ${isSubmitting ? "opacity-100" : "opacity-0"}`}>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Görev Kaydediliyor...</span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
