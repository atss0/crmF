export type UIProductStatus = 'active' | 'inactive' | 'discontinued' | 'out_of_stock'

export interface Product {
  id: number
  ad: string
  description: string
  sku: string
  category?: string
  categoryId?: number
  price: number
  cost?: number
  stock: number
  minStock: number
  status: UIProductStatus
  image?: string
  tags?: string[]
  customFields?: Record<string, any>
  createdAt: string
  updatedAt: string
}