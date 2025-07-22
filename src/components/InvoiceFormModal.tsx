"use client"

import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import type { Invoice, PaymentStatus, PaymentMethod } from "../types/invoice"
import {
  X,
  FileText,
  Plus,
  Building,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Hash,
  Trash2,
  Save,
  Sparkles,
  Check,
  AlertCircle,
  CreditCard,
  Clock,
  CheckCircle,
  FileX,
  XCircle,
  Calculator,
  Receipt,
  User,
  Package,
} from "lucide-react"

const paymentStatuses: PaymentStatus[] = ["draft", "pending", "paid", "overdue", "cancelled"]
const paymentMethods: PaymentMethod[] = ["credit_card", "bank_transfer", "cash", "check", "paypal"]

const statusLabels: Record<PaymentStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  credit_card: "Credit Card",
  bank_transfer: "Bank Transfer",
  cash: "Cash",
  check: "Check",
  paypal: "PayPal",
}

const schema = yup.object().shape({
  invoiceNumber: yup.string().required("Invoice number is required"),
  customerName: yup.string().required("Customer name is required").min(2, "Name must be at least 2 characters"),
  customerEmail: yup.string().email("Invalid email format"),
  customerAddress: yup.string(),
  date: yup.string().required("Invoice date is required"),
  dueDate: yup.string().required("Due date is required"),
  status: yup.string().oneOf(paymentStatuses).required("Status is required"),
  paymentMethod: yup.string().oneOf(paymentMethods),
  notes: yup.string(),
  items: yup
    .array()
    .of(
      yup.object().shape({
        productName: yup.string().required("Product name is required"),
        description: yup.string(),
        quantity: yup.number().positive("Quantity must be positive").integer().required("Quantity is required"),
        price: yup.number().positive("Price must be positive").required("Price is required"),
        tax: yup.number().min(0, "Tax cannot be negative"),
        discount: yup.number().min(0, "Discount cannot be negative"),
      }),
    )
    .required()
    .min(1, "At least one item is required"),
})

interface InvoiceFormModalProps {
  onClose: () => void
  onSubmit: (data: Omit<Invoice, "id">) => void
  initialData?: Invoice
}

export default function InvoiceFormModal({ onClose, onSubmit, initialData }: InvoiceFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const isEdit = !!initialData

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      invoiceNumber: "",
      customerName: "",
      customerEmail: "",
      customerAddress: "",
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "draft" as PaymentStatus,
      paymentMethod: undefined,
      notes: "",
      items: [
        {
          productName: "",
          description: "",
          quantity: 1,
          price: 0,
          tax: 0,
          discount: 0,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const watchedValues = watch()
  const watchedItems = watch("items")

  useEffect(() => {
    if (initialData) {
      reset({
        invoiceNumber: initialData.invoiceNumber,
        customerName: initialData.customerName,
        customerEmail: initialData.customerEmail || "",
        customerAddress: initialData.customerAddress || "",
        date: initialData.date,
        dueDate: initialData.dueDate,
        status: initialData.status,
        paymentMethod: initialData.paymentMethod,
        notes: initialData.notes || "",
        items: initialData.items,
      })
    } else {
      // Generate invoice number for new invoices
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
      setValue("invoiceNumber", invoiceNumber)
    }
  }, [initialData, reset, setValue])

  const calculateTotals = () => {
    const subtotal = watchedItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0
      const price = Number(item.price) || 0
      const discount = Number(item.discount) || 0
      const itemTotal = quantity * price
      return sum + (itemTotal - discount)
    }, 0)

    const taxAmount = watchedItems.reduce((sum, item) => {
      const tax = Number(item.tax) || 0
      return sum + tax
    }, 0)

    const totalAmount = subtotal + taxAmount

    return { subtotal, taxAmount, totalAmount }
  }

  const { subtotal, taxAmount, totalAmount } = calculateTotals()

  const submitHandler = async (data: any) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const invoiceData: Omit<Invoice, "id"> = {
      ...data,
      subtotal,
      taxAmount,
      totalAmount,
      discountAmount: watchedItems.reduce((sum, item) => sum + (item.discount || 0), 0),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: data.status === "paid" ? new Date().toISOString() : undefined,
    }

    onSubmit(invoiceData)
    setIsSubmitting(false)
  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "overdue":
        return <AlertCircle className="w-4 h-4" />
      case "draft":
        return <FileX className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="w-4 h-4" />
      case "bank_transfer":
        return <Building className="w-4 h-4" />
      case "cash":
        return <DollarSign className="w-4 h-4" />
      case "check":
        return <Receipt className="w-4 h-4" />
      case "paypal":
        return <CreditCard className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
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
        return watchedValues.invoiceNumber && watchedValues.customerName && watchedValues.date && watchedValues.dueDate
      case 2:
        return (
          watchedItems.length > 0 &&
          watchedItems.every((item) => item.productName && item.quantity > 0 && item.price > 0)
        )
      case 3:
        return watchedValues.status
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                {isEdit ? <FileText className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{isEdit ? "Edit Invoice" : "Create New Invoice"}</h2>
                <p className="text-indigo-100 text-sm">
                  {isEdit ? "Update invoice details and settings" : "Generate a professional invoice for your client"}
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
                        ? "bg-white text-indigo-600"
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
              <div className="flex space-x-8 text-sm text-indigo-100">
                <span className={currentStep === 1 ? "text-white font-medium" : ""}>Invoice Details</span>
                <span className={currentStep === 2 ? "text-white font-medium" : ""}>Items & Pricing</span>
                <span className={currentStep === 3 ? "text-white font-medium" : ""}>Payment & Notes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">
            {/* Step 1: Invoice Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Invoice Details</h3>
                  <p className="text-gray-500 text-sm">Basic invoice and customer information</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Invoice Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Invoice Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("invoiceNumber")}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                          errors.invoiceNumber ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                        }`}
                        placeholder="INV-2024-001"
                      />
                      {!errors.invoiceNumber && watchedValues.invoiceNumber && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.invoiceNumber && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.invoiceNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Invoice Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Invoice Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("date")}
                        type="date"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Due Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("dueDate")}
                        type="date"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Customer Information</span>
                  </h4>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("customerName")}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                          errors.customerName ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                        }`}
                        placeholder="Acme Corporation"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Customer Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          {...register("customerEmail")}
                          type="email"
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                            errors.customerEmail ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                          }`}
                          placeholder="billing@acme.com"
                        />
                      </div>
                      {errors.customerEmail && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {errors.customerEmail.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Customer Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Customer Address</label>
                    <div className="relative">
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        {...register("customerAddress")}
                        rows={3}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none bg-white"
                        placeholder="123 Business Street, City, State 12345"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Items & Pricing */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
                    <Package className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Items & Pricing</h3>
                  <p className="text-gray-500 text-sm">Add products or services to your invoice</p>
                </div>

                {/* Invoice Items */}
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium text-gray-900">Item #{index + 1}</h5>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Product Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product/Service <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register(`items.${index}.productName`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Website Development"
                          />
                          {errors.items?.[index]?.productName && (
                            <p className="text-red-500 text-xs mt-1">{errors.items[index]?.productName?.message}</p>
                          )}
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <input
                            {...register(`items.${index}.description`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Custom responsive website"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Quantity */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity <span className="text-red-500">*</span>
                          </label>
                          <input
                            {...register(`items.${index}.quantity`)}
                            type="number"
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="1"
                          />
                          {errors.items?.[index]?.quantity && (
                            <p className="text-red-500 text-xs mt-1">{errors.items[index]?.quantity?.message}</p>
                          )}
                        </div>

                        {/* Price */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit Price <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              {...register(`items.${index}.price`)}
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                          {errors.items?.[index]?.price && (
                            <p className="text-red-500 text-xs mt-1">{errors.items[index]?.price?.message}</p>
                          )}
                        </div>

                        {/* Tax */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tax</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              {...register(`items.${index}.tax`)}
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        {/* Discount */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <DollarSign className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                              {...register(`items.${index}.discount`)}
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Item Total:</span>
                          <span className="font-semibold text-gray-900">
                            $
                            {(
                              (Number(watchedItems[index]?.quantity) || 0) * (Number(watchedItems[index]?.price) || 0) -
                              (Number(watchedItems[index]?.discount) || 0) +
                              (Number(watchedItems[index]?.tax) || 0)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Item Button */}
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        productName: "",
                        description: "",
                        quantity: 1,
                        price: 0,
                        tax: 0,
                        discount: 0,
                      })
                    }
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center space-x-2 text-gray-600 hover:text-indigo-600"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Add Another Item</span>
                  </button>
                </div>

                {/* Invoice Summary */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-indigo-600" />
                    <span>Invoice Summary</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium text-gray-900">${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-medium text-gray-900">
                        -${watchedItems.reduce((sum, item) => sum + (Number(item.discount) || 0), 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-indigo-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-indigo-600">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment & Notes */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Payment & Notes</h3>
                  <p className="text-gray-500 text-sm">Set payment status and add additional notes</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Payment Status <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {paymentStatuses.map((status) => (
                        <label key={status} className="cursor-pointer">
                          <input {...register("status")} type="radio" value={status} className="sr-only" />
                          <div
                            className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                              watchedValues.status === status
                                ? getStatusColor(status) + " border-current shadow-lg"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  watchedValues.status === status ? "bg-white/20" : "bg-gray-100"
                                }`}
                              >
                                {getStatusIcon(status)}
                              </div>
                              <div>
                                <h4 className="font-semibold">{statusLabels[status]}</h4>
                                <p className="text-xs opacity-75">
                                  {status === "draft" && "Invoice is being prepared"}
                                  {status === "pending" && "Awaiting payment from customer"}
                                  {status === "paid" && "Payment has been received"}
                                  {status === "overdue" && "Payment is past due date"}
                                  {status === "cancelled" && "Invoice has been cancelled"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Payment Method</label>
                    <div className="grid grid-cols-1 gap-3">
                      {paymentMethods.map((method) => (
                        <label key={method} className="cursor-pointer">
                          <input {...register("paymentMethod")} type="radio" value={method} className="sr-only" />
                          <div
                            className={`p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                              watchedValues.paymentMethod === method
                                ? "bg-indigo-100 text-indigo-800 border-indigo-200 shadow-lg"
                                : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                  watchedValues.paymentMethod === method ? "bg-indigo-200" : "bg-gray-100"
                                }`}
                              >
                                {getPaymentMethodIcon(method)}
                              </div>
                              <span className="font-medium">{paymentMethodLabels[method]}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Additional Notes</label>
                  <textarea
                    {...register("notes")}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none bg-white"
                    placeholder="Thank you for your business! Payment terms: Net 30 days."
                  />
                  <p className="text-xs text-gray-500 mt-2">{watchedValues.notes?.length || 0} characters</p>
                </div>
              </div>
            )}

            {/* Invoice Preview */}
            <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-6 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Invoice Preview</span>
              </h4>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h5 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h5>
                    <p className="text-gray-600">{watchedValues.invoiceNumber || "INV-XXXX-XXX"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Date: {watchedValues.date || "Not set"}</p>
                    <p className="text-sm text-gray-600">Due: {watchedValues.dueDate || "Not set"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h6 className="font-semibold text-gray-900 mb-2">Bill To:</h6>
                    <p className="text-gray-700">{watchedValues.customerName || "Customer Name"}</p>
                    {watchedValues.customerEmail && (
                      <p className="text-gray-600 text-sm">{watchedValues.customerEmail}</p>
                    )}
                    {watchedValues.customerAddress && (
                      <p className="text-gray-600 text-sm whitespace-pre-line">{watchedValues.customerAddress}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {watchedValues.status && (
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                          watchedValues.status,
                        )}`}
                      >
                        {getStatusIcon(watchedValues.status)}
                        <span className="capitalize">{statusLabels[watchedValues.status]}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2 mb-4">
                    {watchedItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <div>
                          <p className="font-medium text-gray-900">{item.productName || `Item ${index + 1}`}</p>
                          {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                          <p className="text-sm text-gray-500">
                            {Number(item.quantity) || 0} × ${(Number(item.price) || 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            $
                            {(
                              (Number(item.quantity) || 0) * (Number(item.price) || 0) -
                              (Number(item.discount) || 0) +
                              (Number(item.tax) || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="text-gray-900">${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-indigo-600">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {watchedValues.notes && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">{watchedValues.notes}</p>
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
                  Cancel
                </button>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border-2 border-indigo-200 text-indigo-700 rounded-xl hover:bg-indigo-50 transition-colors duration-200 font-medium"
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
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving Invoice...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isEdit ? "Update Invoice" : "Create Invoice"}</span>
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
