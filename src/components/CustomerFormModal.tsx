"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { X, User, Mail, Phone, Building, Tag, Save, UserPlus, Camera, Check } from "lucide-react"

const schema = yup.object().shape({
  name: yup.string().required("İsim Gerekli").min(2, "İsim En Az 2 Karaktere Sahip Olmalı"),
  email: yup.string().email("Geçersiz Email Formatı").required("Email Gerekli"),
  phone: yup.string().required("Telefon Numarası Gerekli").min(10, "Telefon Numarası En Az 10 Karaktere Sahip Olmalı"),
  company: yup.string(),
  tags: yup.string(),
  status: yup.string().oneOf(["active", "inactive", "vip"]).required("Status is required"),
  totalSpent: yup
    .number()
    .typeError('Toplam Harcama Değeri Bir Sayı Değerine Sahip Olmalı')
    .min(0, 'Negatif Sayı Olamaz')
})

interface CustomerFormModalProps {
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: {
    name: string
    email: string
    phone: string
    company?: string
    tags: string[]
    status?: "active" | "inactive" | "vip"
    totalSpent?: any
  }
  isEdit?: boolean
}

export default function CustomerFormModal({ onClose, onSubmit, initialData, isEdit = false }: CustomerFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      company: initialData?.company || "",
      tags: initialData?.tags?.join(", ") || "",
      status: initialData?.status || "active",
      totalSpent: initialData?.totalSpent ?? ''
    },
  })

  const watchedName = watch("name")

  const submitHandler = async (data: any) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const customerData = {
      ...data,
      tags: data.tags
        ? data.tags
          .split(",")
          .map((t: any) => t.trim())
          .filter(Boolean)
        : [],
    }
    onSubmit(customerData)
    setIsSubmitting(false)
  }

  useEffect(() => {
    reset({
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      company: initialData?.company || "",
      tags: initialData?.tags?.join(", ") || "",
      status: initialData?.status || "active",
    })
  }, [initialData, reset])

  const getAvatarColor = (name: string) => {
    if (!name) return "bg-gray-400"
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-cyan-500",
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "vip":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                {isEdit ? <User className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{isEdit ? "Müşteri Düzenleyin" : "Yeni Müşteri Ekleyin"}</h2>
                <p className="text-blue-100 text-sm">
                  {isEdit ? "Müşteri Bilgilerini Düzenleyin" : "Yeni Bir Müşteri Profili Oluşturun"}
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
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-2xl">
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full ${getAvatarColor(watchedName)} flex items-center justify-center text-white text-2xl font-bold`}
                >
                  {watchedName ? watchedName.charAt(0).toUpperCase() : "?"}
                </div>
                <button
                  type="button"
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Profil Görseli</h3>
                <p className="text-sm text-gray-600">Avatar müşterinin adından oluşturulacak</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  İsim ve Soyisim <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("name")}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                      }`}
                    placeholder="Müşterinin Adının ve Soyadının Tamamını Girin"
                  />
                  {!errors.name && watchedName && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mr-2">
                      !
                    </span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Adresi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                      }`}
                    placeholder="musteri@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mr-2">
                      !
                    </span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefon Numarası <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("phone")}
                    type="tel"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                      }`}
                    placeholder="+90 (XXX) XXX XX XX"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center mr-2">
                      !
                    </span>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Company Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Şirket</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("company")}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Şirket İsmi (opsiyonel)"
                  />
                </div>
              </div>

              {/* Status Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Durum <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("status")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">İnaktif</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Toplam Harcama (TL)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('totalSpent')}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.totalSpent && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalSpent.message}</p>
                )}
              </div>

              {/* Tags Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Etiketler</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("tags")}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="VIP, Premium, Lead (virgülle ayrılmış)"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Birden Fazla Etikete Sahip ise Virgül ile Ayırın</p>
              </div>
            </div>

            {/* Status Preview */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Önizleme</h4>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full ${getAvatarColor(watchedName)} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {watchedName ? watchedName.charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{watchedName || "Müşteri İsmi"}</p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(watch("status"))}`}
                    >
                      {watch("status")?.charAt(0).toUpperCase() + (watch("status")?.slice(1) || "")}
                    </span>
                    {watch("tags") && (
                      <span className="text-xs text-gray-500">
                        {watch("tags")?.split(",").filter(Boolean).length || 0} Etiketler
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    Harcanan&nbsp;
                    <strong>₺{watch('totalSpent')?.toLocaleString()}</strong>
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
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEdit ? "Kullanıcı Göncelleyin" : "Kullanıcı Oluşturun"}</span>
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
