export type PaymentStatus = "paid" | "pending" | "overdue" | "draft" | "cancelled"
export type PaymentMethod = "credit_card" | "bank_transfer" | "cash" | "check" | "paypal"

export interface InvoiceItem {
  id: number
  productName: string
  description?: string
  quantity: number
  price: number
  tax?: number
  discount?: number
}

export interface Invoice {
  id: number
  invoiceNumber: string
  customerName: string
  customerEmail?: string
  customerAddress?: string
  items: InvoiceItem[]
  date: string
  dueDate: string
  status: PaymentStatus
  paymentMethod?: PaymentMethod
  subtotal: number
  taxAmount: number
  discountAmount?: number
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt: string
  paidAt?: string
}
