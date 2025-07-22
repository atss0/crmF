"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Invoice, PaymentStatus } from "../types/invoice"
import InvoiceFormModal from "../components/InvoiceFormModal"
import { downloadInvoicePDF, printInvoice } from "../utils/pdfExport"
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileX,
  Mail,
  Printer,
} from "lucide-react"

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([])

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.customerEmail && invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    const loadInvoices = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Enhanced mock data
      const mockInvoices: Invoice[] = [
        {
          id: 1,
          invoiceNumber: "INV-2024-001",
          customerName: "Acme Corporation",
          customerEmail: "billing@acme.com",
          customerAddress: "Orhangazi, 81620 Düzce",
          items: [
            {
              id: 1,
              productName: "Website Development",
              description: "Custom website with responsive design",
              quantity: 1,
              price: 2500,
              tax: 250,
            },
            {
              id: 2,
              productName: "SEO Optimization",
              description: "3-month SEO package",
              quantity: 1,
              price: 800,
              tax: 80,
            },
          ],
          date: "2024-01-15",
          dueDate: "2024-02-15",
          status: "paid",
          paymentMethod: "bank_transfer",
          subtotal: 3300,
          taxAmount: 330,
          totalAmount: 3630,
          notes: "Thank you for your business!",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-20T14:30:00Z",
          paidAt: "2024-01-18T09:15:00Z",
        },
        {
          id: 2,
          invoiceNumber: "INV-2024-002",
          customerName: "Tech Solutions Inc",
          customerEmail: "accounts@techsolutions.com",
          items: [
            {
              id: 3,
              productName: "Mobile App Development",
              description: "iOS and Android app development",
              quantity: 1,
              price: 5000,
              tax: 500,
            },
          ],
          date: "2024-01-20",
          dueDate: "2024-02-20",
          status: "pending",
          subtotal: 5000,
          taxAmount: 500,
          totalAmount: 5500,
          createdAt: "2024-01-20T11:00:00Z",
          updatedAt: "2024-01-20T11:00:00Z",
        },
        {
          id: 3,
          invoiceNumber: "INV-2024-003",
          customerName: "StartupXYZ",
          customerEmail: "finance@startupxyz.com",
          items: [
            {
              id: 4,
              productName: "Consulting Services",
              description: "Business strategy consultation",
              quantity: 10,
              price: 150,
              tax: 150,
            },
          ],
          date: "2024-01-10",
          dueDate: "2024-01-25",
          status: "overdue",
          subtotal: 1500,
          taxAmount: 150,
          totalAmount: 1650,
          createdAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-01-10T09:00:00Z",
        },
        {
          id: 4,
          invoiceNumber: "INV-2024-004",
          customerName: "Local Business",
          customerEmail: "owner@localbusiness.com",
          items: [
            {
              id: 5,
              productName: "Logo Design",
              description: "Brand identity package",
              quantity: 1,
              price: 800,
              tax: 80,
            },
          ],
          date: "2024-01-25",
          dueDate: "2024-02-25",
          status: "draft",
          subtotal: 800,
          taxAmount: 80,
          totalAmount: 880,
          createdAt: "2024-01-25T15:00:00Z",
          updatedAt: "2024-01-25T15:00:00Z",
        },
      ]

      setInvoices(mockInvoices)
      setIsLoading(false)
    }

    loadInvoices()
  }, [])

  const handleFormSubmit = (data: Omit<Invoice, "id">) => {
    if (editingInvoice) {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === editingInvoice.id ? { ...inv, ...data, updatedAt: new Date().toISOString() } : inv,
        ),
      )
      setEditingInvoice(null)
    } else {
      const newInvoice: Invoice = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setInvoices((prev) => [...prev, newInvoice])
    }
    setShowModal(false)
  }

  const deleteInvoice = (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this invoice?")
    if (confirmDelete) {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id))
    }
  }

  const duplicateInvoice = (invoice: Invoice) => {
    const duplicated: Invoice = {
      ...invoice,
      id: Date.now(),
      invoiceNumber: `${invoice.invoiceNumber}-COPY`,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paidAt: undefined,
    }
    setInvoices((prev) => [...prev, duplicated])
  }

  const toggleInvoiceSelection = (id: number) => {
    setSelectedInvoices((prev) => (prev.includes(id) ? prev.filter((invoiceId) => invoiceId !== id) : [...prev, id]))
  }

  const selectAllInvoices = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(filteredInvoices.map((inv) => inv.id))
    }
  }

  const isOverdue = (dueDate: string, status: PaymentStatus) => {
    return status !== "paid" && new Date(dueDate) < new Date()
  }

  // Calculate stats
  const totalInvoices = invoices.length
  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length
  const pendingInvoices = invoices.filter((inv) => inv.status === "pending").length
  const overdueInvoices = invoices.filter((inv) => isOverdue(inv.dueDate, inv.status)).length
  const totalRevenue = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.totalAmount, 0)
  const pendingAmount = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.totalAmount, 0)

  if (isLoading) {
    return <InvoiceListSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Faturalar
                </h1>
                <p className="text-gray-600 mt-1">Faturaları yönet.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Yeni Fatura</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Toplam Fatura"
            value={totalInvoices}
            icon={<FileText className="w-5 h-5" />}
            color="blue"
            change="+12%"
          />
          <StatsCard
            title="Toplam Gelir"
            value={`₺${totalRevenue.toLocaleString()}`}
            icon={
              <span className="w-5 h-5 text-white text-lg font-bold flex items-center justify-center">
                ₺
              </span>
            }
            color="green"
            change="+23%"
          />

          <StatsCard
            title="Bekleyen Faturalar"
            value={`₺${pendingAmount.toLocaleString()}`}
            icon={<Clock className="w-5 h-5" />}
            color="yellow"
            change="+8%"
          />
          <StatsCard
            title="Geçmiş Faturalar"
            value={overdueInvoices}
            icon={<AlertTriangle className="w-5 h-5" />}
            color="red"
            change="-5%"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <QuickStatCard
            title="Bu ayki Ödemeler"
            value={paidInvoices}
            total={totalInvoices}
            icon={<CheckCircle className="w-5 h-5" />}
            color="green"
          />
          <QuickStatCard
            title="Bekleyen Faturalar"
            value={pendingInvoices}
            total={totalInvoices}
            icon={<Clock className="w-5 h-5" />}
            color="blue"
          />
          <QuickStatCard
            title="Geçmiş Faturalar"
            value={overdueInvoices}
            total={totalInvoices}
            icon={<AlertTriangle className="w-5 h-5" />}
            color="red"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Fatura Arama"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50"
                >
                  <option value="all">tüm Durumlar</option>
                  <option value="draft">Taslak</option>
                  <option value="pending">Askıda</option>
                  <option value="paid">Ödendi</option>
                  <option value="overdue">Vadesi Dolmuş</option>
                  <option value="cancelled">Vazgeçildi</option>
                </select>
              </div>
              {selectedInvoices.length > 0 && (
                <div className="text-sm text-gray-600 bg-indigo-50 px-3 py-2 rounded-lg">
                  {selectedInvoices.length} seçildi
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <InvoiceTable
          invoices={filteredInvoices}
          selectedInvoices={selectedInvoices}
          onToggleSelection={toggleInvoiceSelection}
          onSelectAll={selectAllInvoices}
          onEdit={(invoice) => {
            setEditingInvoice(invoice)
            setShowModal(true)
          }}
          onDelete={deleteInvoice}
          onDuplicate={duplicateInvoice}
        />
      </div>

      {/* Hidden PDF Content for each invoice */}
      {invoices.map((invoice) => (
        <div key={`pdf-${invoice.id}`} style={{ position: "absolute", left: "-9999px", top: "0" }}>
          <div
            id={`pdf-content-${invoice.id}`}
            className="invoice-container"
            style={{
              width: "800px",
              background: "white",
              padding: "40px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <div
              className="invoice-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "40px",
                paddingBottom: "20px",
                borderBottom: "2px solid #e5e7eb",
              }}
            >
              <div>
                <h1
                  className="invoice-title"
                  style={{ fontSize: "32px", fontWeight: "bold", color: "#1f2937", marginBottom: "8px" }}
                >
                  FATURA
                </h1>
                <p className="invoice-number" style={{ fontSize: "16px", color: "#6b7280" }}>
                  {invoice.invoiceNumber}
                </p>
              </div>
              <div className="invoice-dates" style={{ textAlign: "right", fontSize: "14px", color: "#6b7280" }}>
                <p>
                  <strong>Tarih:</strong> {new Date(invoice.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Bitiş Tarihi:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div
              className="invoice-parties"
              style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}
            >
              <div className="bill-to">
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "12px" }}>
                  Kime
                </h3>
                <div className="customer-info" style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.5" }}>
                  <p style={{ fontWeight: "500", color: "#1f2937", marginBottom: "4px" }}>{invoice.customerName}</p>
                  {invoice.customerEmail && <p>{invoice.customerEmail}</p>}
                  {invoice.customerAddress && <p style={{ whiteSpace: "pre-line" }}>{invoice.customerAddress}</p>}
                </div>
              </div>
              <div className="invoice-status" style={{ textAlign: "right" }}>
                <span
                  className={`status-badge status-${invoice.status}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    textTransform: "capitalize",
                    ...(invoice.status === "paid" && {
                      backgroundColor: "#dcfce7",
                      color: "#166534",
                      border: "1px solid #bbf7d0",
                    }),
                    ...(invoice.status === "pending" && {
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      border: "1px solid #bfdbfe",
                    }),
                    ...(invoice.status === "overdue" && {
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                    }),
                    ...(invoice.status === "draft" && {
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      border: "1px solid #d1d5db",
                    }),
                  }}
                >
                  {invoice.status}
                </span>
              </div>
            </div>

            <table className="items-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    Ürün
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    Adet
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    Birim Fiyat
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    Vergi
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "1px solid #e5e7eb",
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    Toplam
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                      <div className="item-name" style={{ fontWeight: "500", color: "#1f2937" }}>
                        {item.productName}
                      </div>
                      {item.description && (
                        <div
                          className="item-description"
                          style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}
                        >
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#4b5563",
                        fontSize: "14px",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#4b5563",
                        fontSize: "14px",
                      }}
                    >
                      ${(Number(item.price) || 0).toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#4b5563",
                        fontSize: "14px",
                      }}
                    >
                      ${(Number(item.tax) || 0).toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        borderBottom: "1px solid #e5e7eb",
                        color: "#4b5563",
                        fontSize: "14px",
                      }}
                    >
                      $
                      {(
                        (Number(item.quantity) || 0) * (Number(item.price) || 0) +
                        (Number(item.tax) || 0) -
                        (Number(item.discount) || 0)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              className="invoice-totals"
              style={{ marginLeft: "auto", width: "300px", borderTop: "2px solid #e5e7eb", paddingTop: "20px" }}
            >
              <div
                className="total-row"
                style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "14px" }}
              >
                <span>Ara Toplam:</span>
                <span>${(Number(invoice.subtotal) || 0).toFixed(2)}</span>
              </div>
              <div
                className="total-row"
                style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "14px" }}
              >
                <span>Vergi:</span>
                <span>${(Number(invoice.taxAmount) || 0).toFixed(2)}</span>
              </div>
              {invoice.discountAmount && invoice.discountAmount > 0 && (
                <div
                  className="total-row"
                  style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: "14px" }}
                >
                  <span>İndirim:</span>
                  <span>-${(Number(invoice.discountAmount) || 0).toFixed(2)}</span>
                </div>
              )}
              <div
                className="total-row final"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "16px 0 8px 0",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#1f2937",
                  borderTop: "1px solid #e5e7eb",
                  marginTop: "12px",
                }}
              >
                <span>Total:</span>
                <span>${(Number(invoice.totalAmount) || 0).toFixed(2)}</span>
              </div>
            </div>

            {invoice.notes && (
              <div
                className="invoice-notes"
                style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}
              >
                <h4
                  className="notes-title"
                  style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}
                >
                  Notes:
                </h4>
                <p className="notes-content" style={{ color: "#4b5563", fontSize: "14px", lineHeight: "1.6" }}>
                  {invoice.notes}
                </p>
              </div>
            )}

            {invoice.paymentMethod && (
              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>
                  <strong>Ödeme Yöntemi:</strong>{" "}
                  {invoice.paymentMethod.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
                {invoice.paidAt && (
                  <p style={{ fontSize: "14px", color: "#059669", marginTop: "4px" }}>
                    <strong>Paid on:</strong> {new Date(invoice.paidAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <InvoiceFormModal
          onClose={() => {
            setShowModal(false)
            setEditingInvoice(null)
          }}
          onSubmit={handleFormSubmit}
          initialData={editingInvoice || undefined}
        />
      )}
    </div>
  )
}

// Stats Card Component
interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: "blue" | "green" | "yellow" | "red"
  change: string
}

function StatsCard({ title, value, icon, color, change }: StatsCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    red: "from-red-500 to-red-600",
  }

  return (
    <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <div className="text-sm font-medium px-2 py-1 rounded-full text-green-700 bg-green-100">{change}</div>
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

// Quick Stat Card Component
interface QuickStatCardProps {
  title: string
  value: number
  total: number
  icon: React.ReactNode
  color: "green" | "blue" | "red"
}

function QuickStatCard({ title, value, total, icon, color }: QuickStatCardProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0

  const colorClasses = {
    green: "from-green-500 to-green-600 bg-green-100",
    blue: "from-blue-500 to-blue-600 bg-blue-100",
    red: "from-red-500 to-red-600 bg-red-100",
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorClasses[color].split(" ")[0]} ${colorClasses[color].split(" ")[1]} flex items-center justify-center text-white`}
        >
          {icon}
        </div>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-gray-600 text-sm font-medium mb-3">{title}</p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${colorClasses[color].split(" ")[0]} ${colorClasses[color].split(" ")[1]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{Math.round(percentage)}%</p>
    </div>
  )
}

// Invoice Table Component
interface InvoiceTableProps {
  invoices: Invoice[]
  selectedInvoices: number[]
  onToggleSelection: (id: number) => void
  onSelectAll: () => void
  onEdit: (invoice: Invoice) => void
  onDelete: (id: number) => void
  onDuplicate: (invoice: Invoice) => void
}

function InvoiceTable({
  invoices,
  selectedInvoices,
  onToggleSelection,
  onSelectAll,
  onEdit,
  onDelete,
  onDuplicate,
}: InvoiceTableProps) {
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
        return <CheckCircle className="w-3 h-3" />
      case "pending":
        return <Clock className="w-3 h-3" />
      case "overdue":
        return <AlertTriangle className="w-3 h-3" />
      case "draft":
        return <FileX className="w-3 h-3" />
      case "cancelled":
        return <XCircle className="w-3 h-3" />
      default:
        return <FileText className="w-3 h-3" />
    }
  }

  const isOverdue = (dueDate: string, status: PaymentStatus) => {
    return status !== "paid" && new Date(dueDate) < new Date()
  }

  const handlePrintInvoice = async (invoice: Invoice) => {
    await printInvoice(`pdf-content-${invoice.id}`)
  }

  const handleDownloadPDF = async (invoice: Invoice) => {
    await downloadInvoicePDF(`pdf-content-${invoice.id}`, `invoice-${invoice.invoiceNumber}.pdf`)
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No invoices found</h3>
        <p className="text-gray-600 mb-6">Get started by creating your first invoice</p>
      </div>
    )
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedInvoices.length === invoices.length && invoices.length > 0}
            onChange={onSelectAll}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <div className="ml-6 grid grid-cols-12 gap-4 w-full text-sm font-medium text-gray-700">
            <div className="col-span-2">Fatura</div>
            <div className="col-span-2">Müşteri</div>
            <div className="col-span-2">Tutar</div>
            <div className="col-span-2">Durum</div>
            <div className="col-span-2">Son Ödeme Tarihi</div>
            <div className="col-span-2">İşlemler</div>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {invoices.map((invoice) => {
          const isSelected = selectedInvoices.includes(invoice.id)
          const overdue = isOverdue(invoice.dueDate, invoice.status)

          return (
            <div
              key={invoice.id}
              className={`px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200 group ${isSelected ? "bg-indigo-50/50" : ""
                } ${overdue ? "border-l-4 border-red-400" : ""}`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelection(invoice.id)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <div className="ml-6 grid grid-cols-12 gap-4 w-full items-center">
                  {/* Invoice */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {invoice.invoiceNumber.slice(-3)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="col-span-2">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.customerName}</p>
                      {invoice.customerEmail && (
                        <p className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {invoice.customerEmail}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="col-span-2">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">₺{invoice.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">
                        {invoice.items.length} adet
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                        invoice.status,
                      )}`}
                    >
                      {getStatusIcon(invoice.status)}
                      <span className="capitalize">{invoice.status}</span>
                    </span>
                    {overdue && (
                      <p className="text-xs text-red-600 font-medium mt-1">
                        {Math.ceil(
                          (new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24),
                        )}{" "}
                        Gün Gecikmiş
                      </p>
                    )}
                  </div>

                  {/* Due Date */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={`text-sm ${overdue ? "text-red-600 font-medium" : "text-gray-900"}`}>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {invoice.paidAt && (
                      <p className="text-xs text-green-600 mt-1">
                        Ödendi {new Date(invoice.paidAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => onEdit(invoice)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit invoice"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDuplicate(invoice)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="Duplicate invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePrintInvoice(invoice)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        title="Print invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(invoice)}
                        className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(invoice.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Loading Skeleton Component
function InvoiceListSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Skeleton */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded-lg w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-10 bg-gray-200 rounded-xl w-20 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
              <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Search Skeleton */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="h-12 bg-gray-200 rounded-xl w-96 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="ml-6 grid grid-cols-12 gap-4 w-full">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="col-span-2 h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="ml-6 grid grid-cols-12 gap-4 w-full items-center">
                    <div className="col-span-2 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="col-span-2">
                      <div className="h-6 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="col-span-2">
                      <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                    </div>
                    <div className="col-span-2">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="col-span-2 flex space-x-2">
                      {[...Array(6)].map((_, j) => (
                        <div key={j} className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
