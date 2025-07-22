"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import type { OpportunityStage } from "../types/opportunity"
import {
  X,
  Target,
  Plus,
  Type,
  Building,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Phone,
  Mail,
  Globe,
  Linkedin,
  Save,
  Sparkles,
  Check,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Zap,
} from "lucide-react"

const stages: OpportunityStage[] = ["contacted", "meeting", "proposal", "won", "lost"]

const stageLabels: Record<OpportunityStage, string> = {
  contacted: "İlk Temas",
  meeting: "Toplantı Planlandı",
  proposal: "Teklif Gönderildi",
  won: "Kazanıldı",
  lost: "Kaybedildi",
}

const stageColors: Record<OpportunityStage, string> = {
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  meeting: "bg-yellow-100 text-yellow-800 border-yellow-200",
  proposal: "bg-purple-100 text-purple-800 border-purple-200",
  won: "bg-green-100 text-green-800 border-green-200",
  lost: "bg-red-100 text-red-800 border-red-200",
}

const stageIcons: Record<OpportunityStage, React.ReactNode> = {
  contacted: <Phone className="w-4 h-4" />,
  meeting: <Calendar className="w-4 h-4" />,
  proposal: <Mail className="w-4 h-4" />,
  won: <CheckCircle className="w-4 h-4" />,
  lost: <XCircle className="w-4 h-4" />,
}

const sources = ["Website", "Referral", "Cold Call", "LinkedIn", "Email Campaign", "Trade Show", "Partner", "Other"]

const schema = yup.object().shape({
  title: yup.string().required("Opportunity title is required").min(3, "Title must be at least 3 characters"),
  customerName: yup
    .string()
    .required("Müşteri Adı Gerekli")
    .min(2, "Müşteri Adı 2 Karakterden Fazla Olmalı"),
  value: yup
    .number()
    .required("Değer Gerekli")
    .positive("Değer Negatif Bir Sayı İçeremez")
    .min(1, "Değer ₺1'den Yüksek Olmalı"),
  stage: yup.string().oneOf(stages).required("Aşama Gerekli"),
  note: yup.string(),
  contactDate: yup.string(),
  expectedCloseDate: yup.string(),
  probability: yup.number().min(0, "Olasılık Değeri 0% Değerinden Fazla Olmalı").max(100, "Olasılık Değer 100% Değerinden Az Olmalı"),
  source: yup.string(),
})

interface OpportunityFormModalProps {
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: any
}

export default function OpportunityFormModal({ onClose, onSubmit, initialData }: OpportunityFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
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
      customerName: "",
      value: 0,
      stage: "contacted" as OpportunityStage,
      note: "",
      contactDate: new Date().toISOString().split("T")[0],
      expectedCloseDate: "",
      probability: 25,
      source: "",
    },
  })

  const watchedValues = watch()

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        customerName: initialData.customerName || "",
        value: initialData.value || 0,
        stage: initialData.stage || "contacted",
        note: initialData.note || "",
        contactDate: initialData.contactDate || new Date().toISOString().split("T")[0],
        expectedCloseDate: initialData.expectedCloseDate || "",
        probability: initialData.probability || 25,
        source: initialData.source || "",
      })
    } else {
      reset({
        title: "",
        customerName: "",
        value: 0,
        stage: "contacted",
        note: "",
        contactDate: new Date().toISOString().split("T")[0],
        expectedCloseDate: "",
        probability: 25,
        source: "",
      })
    }
  }, [initialData, reset])

  const submitHandler = async (data: any) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    onSubmit(data)
    setIsSubmitting(false)
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return "text-green-600 bg-green-100 border-green-200"
    if (probability >= 50) return "text-yellow-600 bg-yellow-100 border-yellow-200"
    if (probability >= 25) return "text-orange-600 bg-orange-100 border-orange-200"
    return "text-red-600 bg-red-100 border-red-200"
  }

  const getProbabilityIcon = (probability: number) => {
    if (probability >= 75) return <Star className="w-4 h-4" />
    if (probability >= 50) return <TrendingUp className="w-4 h-4" />
    if (probability >= 25) return <Clock className="w-4 h-4" />
    return <AlertCircle className="w-4 h-4" />
  }

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case "website":
        return <Globe className="w-4 h-4" />
      case "linkedin":
        return <Linkedin className="w-4 h-4" />
      case "email campaign":
        return <Mail className="w-4 h-4" />
      case "cold call":
        return <Phone className="w-4 h-4" />
      case "referral":
        return <Users className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const getStepValidation = (step: number) => {
    switch (step) {
      case 1:
        return watchedValues.title && watchedValues.customerName && watchedValues.value > 0
      case 2:
        return watchedValues.stage
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                {isEdit ? <Target className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{isEdit ? "Fırsatı Düzenleyin" : "Fırsat Oluşturun"}</h2>
                <p className="text-purple-100 text-sm">
                  {isEdit ? "Fırsat Ayrıntılarını ve İlerlemeyi Güncelleyin" : "Satış hattınıza yeni bir satış fırsatı ekleyin"}
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

          {/* Progress Steps */}
          <div className="relative z-10 mt-6">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${currentStep >= step
                      ? "bg-white text-purple-600"
                      : "bg-white/20 text-white border-2 border-white/30"
                      }`}
                  >
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-0.5 mx-2 transition-colors duration-200 ${currentStep > step ? "bg-white" : "bg-white/30"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2">
              <div className="flex space-x-8 text-sm text-purple-100">
                <span className={currentStep === 1 ? "text-white font-medium" : ""}>Temel Bilgiler</span>
                <span className={currentStep === 2 ? "text-white font-medium" : ""}>Süreç Hattı</span>
                <span className={currentStep === 3 ? "text-white font-medium" : ""}>Detaylar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Temel Bilgiler</h3>
                  <p className="text-gray-500 text-sm">Fırsat Hakkında Bilgi Verin</p>
                </div>

                {/* Opportunity Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Fırsat Başlığı <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Type className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register("title")}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg ${errors.title ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                        }`}
                      placeholder="örneğin, Web Sitesi Yeniden Tasarım Projesi, Mobil Uygulama Geliştirme"
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

                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Müşteri İsmi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register("customerName")}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${errors.customerName ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                        }`}
                      placeholder="örneğin, Acme Corporation, Tech Solutions Inc"
                    />
                    {!errors.customerName && watchedValues.customerName && watchedValues.customerName.length >= 2 && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                {/* Opportunity Value */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Fırsat Değeri <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-600 font-semibold text-lg">₺</span>
                    </div>

                    <input
                      {...register("value")}
                      type="number"
                      min="1"
                      step="100"
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-lg font-semibold ${errors.value ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                        }`}
                      placeholder="25000"
                    />
                    {!errors.value && watchedValues.value > 0 && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.value && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.value.message}
                    </p>
                  )}
                  {watchedValues.value > 0 && (
                    <p className="text-green-600 text-sm mt-2 font-medium">
                      ₺{Number(watchedValues.value).toLocaleString()} TL
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Pipeline Stage */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white">
                    <Target className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Süreç Hattı</h3>
                  <p className="text-gray-500 text-sm">Bu Fırsat, Satış Sürecinizin Tam Olarak Neresinde?</p>
                </div>

                {/* Stage Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Mevcut Aşama <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stages.map((stage) => (
                      <label key={stage} className="cursor-pointer group">
                        <input {...register("stage")} type="radio" value={stage} className="sr-only" />
                        <div
                          className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${watchedValues.stage === stage
                            ? stageColors[stage] + " border-current shadow-lg"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${watchedValues.stage === stage ? "bg-white/20" : "bg-gray-100"
                                }`}
                            >
                              {stageIcons[stage]}
                            </div>
                            <div>
                              <h4 className="font-semibold">{stageLabels[stage]}</h4>
                              <p className="text-xs opacity-75">
                                {stage === "contacted" && "İlk Bilgilendirilme Yapıldı"}
                                {stage === "meeting" && "Toplantı Yapıldı ya da Planlandı"}
                                {stage === "proposal" && "Teklif Müşteriye Gönderildi"}
                                {stage === "won" && "Anlaşma Başarılı Bir Şekilde Kapatıldı"}
                                {stage === "lost" && "Fırsat Kaybedildi"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Probability Slider */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Başarı Oranı
                    <span className="ml-2 text-purple-600 font-bold">{watchedValues.probability}%</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register("probability")}
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div
                      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full border ${getProbabilityColor(
                        watchedValues.probability || 25,
                      )}`}
                    >
                      {getProbabilityIcon(watchedValues.probability || 25)}
                      <span className="text-sm font-medium">
                        {(watchedValues.probability ?? 0) >= 75 && "Yüksek Güven"}
                        {(watchedValues.probability ?? 0) >= 50 && (watchedValues.probability ?? 0) < 75 && "Orta-Yüksek Güven"}
                        {(watchedValues.probability ?? 0) >= 25 && (watchedValues.probability ?? 0) < 50 && "Orta Düzey Güven"}
                        {(watchedValues.probability ?? 0) < 25 && "Düşük Güven"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Additional Details</h3>
                  <p className="text-gray-500 text-sm">Optional information to track this opportunity</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Contact Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("contactDate")}
                        type="date"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>

                  {/* Expected Close Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Expected Close Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("expectedCloseDate")}
                        type="date"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Source */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Lead Source</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sources.map((source) => (
                      <label key={source} className="cursor-pointer">
                        <input {...register("source")} type="radio" value={source} className="sr-only" />
                        <div
                          className={`p-3 rounded-xl border-2 text-center transition-all duration-200 hover:scale-105 ${watchedValues.source === source
                            ? "bg-purple-100 text-purple-800 border-purple-200"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                        >
                          <div className="flex flex-col items-center space-y-1">
                            {getSourceIcon(source)}
                            <span className="text-xs font-medium">{source}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Notes</label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      {...register("note")}
                      rows={4}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none bg-white"
                      placeholder="Add any additional notes about this opportunity, client requirements, next steps, etc."
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{watchedValues.note?.length || 0} characters</p>
                </div>
              </div>
            )}

            {/* Opportunity Preview */}
            <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Fırsat Önizlemesi</span>
              </h4>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-semibold text-gray-900 text-lg">{watchedValues.title || "Fırsat Başlığı"}</h5>
                  <div className="flex items-center space-x-2">
                    {watchedValues.stage && (
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${stageColors[watchedValues.stage as OpportunityStage]
                          }`}
                      >
                        {stageIcons[watchedValues.stage as OpportunityStage]}
                        <span>{stageLabels[watchedValues.stage as OpportunityStage]}</span>
                      </span>
                    )}
                    {watchedValues.probability && (
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getProbabilityColor(
                          watchedValues.probability,
                        )}`}
                      >
                        {getProbabilityIcon(watchedValues.probability)}
                        <span>{watchedValues.probability}%</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{watchedValues.customerName || "Müşteri İsmi"}</span>
                </div>
                <div className="flex items-center space-x-1 mb-3">
                  <span className="w-5 h-5 text-green-600 font-semibold text-base flex items-center justify-center">₺</span>
                  <span className="font-bold text-green-600 text-lg">
                    ₺{Number(watchedValues.value || 0).toLocaleString()}
                  </span>
                </div>
                {watchedValues.note && (
                  <p className="text-gray-600 text-sm mb-3 bg-gray-50 p-3 rounded-lg">{watchedValues.note}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    {watchedValues.contactDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Kontak: {new Date(watchedValues.contactDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {watchedValues.expectedCloseDate && (
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Beklenen: {new Date(watchedValues.expectedCloseDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  {watchedValues.source && (
                    <div className="flex items-center space-x-1">
                      {getSourceIcon(watchedValues.source)}
                      <span>{watchedValues.source}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Vazgeç
                </button>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border-2 border-purple-200 text-purple-700 rounded-xl hover:bg-purple-50 transition-colors duration-200 font-medium"
                  >
                    Önceki
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!getStepValidation(currentStep)}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    Sonraki Adım
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Kaydediliyor...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isEdit ? "Update Opportunity" : "Create Opportunity"}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333ea, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}
