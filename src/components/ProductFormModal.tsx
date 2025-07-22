"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
  X,
  Package,
  Plus,
  Type,
  FileText,
  DollarSign,
  Hash,
  Tag,
  ImageIcon,
  Save,
  Sparkles,
  Check,
  AlertCircle,
  Upload,
  Camera,
  Zap,
  TrendingUp,
  BarChart3,
  Eye,
  CheckCircle,
} from "lucide-react"

const categories = ["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Toys", "Beauty", "Automotive"]

// Define the status type
type ProductStatus = "active" | "inactive" | "out_of_stock"

// Define the form data interface
interface ProductFormData {
  name: string
  description: string
  price: number
  stock: number
  category: string
  status: ProductStatus
}

const schema = yup.object().shape({
  name: yup.string().required("Product name is required").min(2, "Name must be at least 2 characters"),
  description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive")
    .min(0.01, "Price must be at least $0.01"),
  stock: yup
    .number()
    .required("Stock is required")
    .integer("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  category: yup.string().required("Category is required"),
  status: yup
    .string()
    .oneOf(["active", "inactive", "out_of_stock"] as const)
    .required("Status is required"),
})

interface ProductFormModalProps {
  onClose: () => void
  onSubmit: (data: ProductFormData & { image?: string; lastUpdated?: string }) => void
  initialData?: Partial<ProductFormData & { image?: string }>
}

export default function ProductFormModal({ onClose, onSubmit, initialData }: ProductFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [dragActive, setDragActive] = useState(false)
  const isEdit = !!initialData

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      status: "active" as ProductStatus,
    },
  })

  const watchedValues = watch()

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || 0,
        stock: initialData.stock || 0,
        category: initialData.category || "",
        status: (initialData.status as ProductStatus) || "active",
      })
      setSelectedImage(initialData.image || "")
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        status: "active",
      })
      setSelectedImage("")
    }
  }, [initialData, reset])

  const submitHandler = async (data: ProductFormData) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const productData = {
      ...data,
      image: selectedImage,
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    onSubmit(productData)
    setIsSubmitting(false)
  }

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "out_of_stock":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: ProductStatus) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "inactive":
        return <Eye className="w-4 h-4" />
      case "out_of_stock":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        label: "Out of Stock",
        color: "text-red-600",
        bg: "bg-red-100",
        icon: <AlertCircle className="w-4 h-4" />,
      }
    if (stock <= 5)
      return {
        label: "Low Stock",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        icon: <TrendingUp className="w-4 h-4" />,
      }
    return { label: "In Stock", color: "text-green-600", bg: "bg-green-100", icon: <CheckCircle className="w-4 h-4" /> }
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      Electronics: <Zap className="w-4 h-4" />,
      Clothing: <Tag className="w-4 h-4" />,
      Books: <FileText className="w-4 h-4" />,
      "Home & Garden": <Package className="w-4 h-4" />,
      Sports: <TrendingUp className="w-4 h-4" />,
      Toys: <Sparkles className="w-4 h-4" />,
      Beauty: <Eye className="w-4 h-4" />,
      Automotive: <BarChart3 className="w-4 h-4" />,
    }
    return icons[category] || <Package className="w-4 h-4" />
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
        return (
          watchedValues.name &&
          watchedValues.description &&
          watchedValues.name.length >= 2 &&
          watchedValues.description.length >= 10
        )
      case 2:
        return watchedValues.price > 0 && watchedValues.stock >= 0
      case 3:
        return watchedValues.category && watchedValues.status
      default:
        return false
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(files[0])
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                {isEdit ? <Package className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{isEdit ? "Edit Product" : "Create New Product"}</h2>
                <p className="text-orange-100 text-sm">
                  {isEdit ? "Update product information and settings" : "Add a new product to your inventory"}
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      currentStep >= step
                        ? "bg-white text-orange-600"
                        : "bg-white/20 text-white border-2 border-white/30"
                    }`}
                  >
                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-0.5 mx-2 transition-colors duration-200 ${
                        currentStep > step ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2">
              <div className="flex space-x-8 text-sm text-orange-100">
                <span className={currentStep === 1 ? "text-white font-medium" : ""}>Basic Info</span>
                <span className={currentStep === 2 ? "text-white font-medium" : ""}>Pricing & Stock</span>
                <span className={currentStep === 3 ? "text-white font-medium" : ""}>Category & Status</span>
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
                  <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
                  <p className="text-gray-500 text-sm">Tell us about your product</p>
                </div>

                {/* Product Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Product Image</label>
                  <div className="flex items-start space-x-6">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                        {selectedImage ? (
                          <img
                            src={selectedImage || "/placeholder.svg"}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">No image</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload Area */}
                    <div className="flex-1">
                      <div
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                          dragActive
                            ? "border-orange-400 bg-orange-50"
                            : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-900 mb-1">Drop your image here, or browse</p>
                        <p className="text-xs text-gray-500 mb-4">PNG, JPG, GIF up to 10MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Choose Image</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Type className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register("name")}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-lg ${
                        errors.name ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                      }`}
                      placeholder="e.g., Wireless Bluetooth Headphones, Cotton T-Shirt"
                    />
                    {!errors.name && watchedValues.name && watchedValues.name.length >= 2 && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.name.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{watchedValues.name?.length || 0} characters</p>
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Product Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none ${
                        errors.description ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                      }`}
                      placeholder="Describe your product features, benefits, and specifications in detail..."
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
            )}

            {/* Step 2: Pricing & Stock */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Pricing & Inventory</h3>
                  <p className="text-gray-500 text-sm">Set your product price and stock levels</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Product Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <DollarSign className="h-6 w-6 text-gray-400" />
                      </div>
                      <input
                        {...register("price")}
                        type="number"
                        min="0.01"
                        step="0.01"
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-xl font-bold ${
                          errors.price ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                        }`}
                        placeholder="0.00"
                      />
                      {!errors.price && watchedValues.price > 0 && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.price.message}
                      </p>
                    )}
                    {watchedValues.price > 0 && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-800 font-semibold text-lg">
                          ${Number(watchedValues.price).toLocaleString()} USD
                        </p>
                        <p className="text-green-600 text-sm">
                          Tax (10%): ${(Number(watchedValues.price) * 0.1).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Hash className="h-6 w-6 text-gray-400" />
                      </div>
                      <input
                        {...register("stock")}
                        type="number"
                        min="0"
                        step="1"
                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-xl font-bold ${
                          errors.stock ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                        }`}
                        placeholder="0"
                      />
                      {!errors.stock && watchedValues.stock >= 0 && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.stock && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.stock.message}
                      </p>
                    )}
                    {watchedValues.stock >= 0 && (
                      <div className="mt-3">
                        {(() => {
                          const stockStatus = getStockStatus(Number(watchedValues.stock))
                          return (
                            <div
                              className={`p-3 rounded-lg border flex items-center space-x-2 ${stockStatus.bg} border-current`}
                            >
                              <div className={stockStatus.color}>{stockStatus.icon}</div>
                              <div>
                                <p className={`font-semibold ${stockStatus.color}`}>{stockStatus.label}</p>
                                <p className={`text-sm ${stockStatus.color} opacity-75`}>
                                  {Number(watchedValues.stock)} units available
                                </p>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Inventory Value Calculation */}
                {watchedValues.price > 0 && watchedValues.stock >= 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <span>Inventory Value</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          ${(Number(watchedValues.price) * Number(watchedValues.stock)).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Total Value</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">${Number(watchedValues.price).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Unit Price</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{Number(watchedValues.stock)}</p>
                        <p className="text-sm text-gray-600">Units</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Category & Status */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white">
                    <Tag className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Category & Status</h3>
                  <p className="text-gray-500 text-sm">Organize and set product availability</p>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Product Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((category) => (
                      <label key={category} className="cursor-pointer group">
                        <input {...register("category")} type="radio" value={category} className="sr-only" />
                        <div
                          className={`p-4 rounded-xl border-2 text-center transition-all duration-200 hover:scale-105 ${
                            watchedValues.category === category
                              ? "bg-orange-100 text-orange-800 border-orange-200 shadow-lg"
                              : "border-gray-200 hover:border-orange-300 bg-white hover:bg-orange-50"
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                watchedValues.category === category
                                  ? "bg-orange-200"
                                  : "bg-gray-100 group-hover:bg-orange-100"
                              }`}
                            >
                              {getCategoryIcon(category)}
                            </div>
                            <span className="text-sm font-medium">{category}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Product Status <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        value: "active" as ProductStatus,
                        label: "Active",
                        description: "Product is available for sale",
                      },
                      {
                        value: "inactive" as ProductStatus,
                        label: "Inactive",
                        description: "Product is hidden from customers",
                      },
                      {
                        value: "out_of_stock" as ProductStatus,
                        label: "Out of Stock",
                        description: "Product is temporarily unavailable",
                      },
                    ].map((status) => (
                      <label key={status.value} className="cursor-pointer group">
                        <input {...register("status")} type="radio" value={status.value} className="sr-only" />
                        <div
                          className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                            watchedValues.status === status.value
                              ? getStatusColor(status.value) + " border-current shadow-lg"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                watchedValues.status === status.value ? "bg-white/20" : "bg-gray-100"
                              }`}
                            >
                              {getStatusIcon(status.value)}
                            </div>
                            <div>
                              <h4 className="font-semibold">{status.label}</h4>
                              <p className="text-xs opacity-75">{status.description}</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Product Preview */}
            <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Product Preview</span>
              </h4>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-start space-x-4">
                  {/* Product Image Preview */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                      {selectedImage ? (
                        <img
                          src={selectedImage || "/placeholder.svg"}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Product Info Preview */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-semibold text-gray-900 text-lg">{watchedValues.name || "Product Name"}</h5>
                      <div className="flex items-center space-x-2">
                        {watchedValues.category && (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {getCategoryIcon(watchedValues.category)}
                            <span>{watchedValues.category}</span>
                          </span>
                        )}
                        {watchedValues.status && (
                          <span
                            className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              watchedValues.status,
                            )}`}
                          >
                            {getStatusIcon(watchedValues.status)}
                            <span>
                              {watchedValues.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                      {watchedValues.description || "Product description will appear here"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-600 text-xl">
                          ${Number(watchedValues.price || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Stock</p>
                        <p className="font-semibold text-gray-900">{Number(watchedValues.stock || 0)} units</p>
                      </div>
                    </div>
                  </div>
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
                  Cancel
                </button>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border-2 border-orange-200 text-orange-700 rounded-xl hover:bg-orange-50 transition-colors duration-200 font-medium"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!getStepValidation(currentStep)}
                    className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving Product...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isEdit ? "Update Product" : "Create Product"}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
