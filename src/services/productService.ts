/* ──────────────────────────────────────────────────────────────
 *  Product Service  •  src/services/productService.ts
 * ──────────────────────────────────────────────────────────────*/

import axios from '../utils/axios'
import qs    from 'qs'

/* ─────── Tipler ────────────────────────────────────────────── */

export type ProductStatus   = 'active' | 'inactive' | 'discontinued'

export interface ProductVariant {
  id?: number
  name: string
  price: number
  sku?: string
  stock?: number
}

export interface ProductCustomFields {
  [key: string]: any
}

export interface Product {
  id: number
  ad: string
  description?: string
  sku: string
  category?: string         // kategori adı (populate edilirse)
  categoryId?: number       // kategori_id
  fiyat: number
  cost?: number
  stok: number
  minStock: number
  status: any
  images?: string[]
  tags?: string[]
  variants?: ProductVariant[]
  customFields?: ProductCustomFields
  createdAt: string
  updatedAt: string

  /* opsiyonel analytics (GET /products/:id) */
  analytics?: {
    totalSold: number
    revenue: number
    averageRating: number
  }
}

export interface ProductCategory {
  id: number
  name: string
  description?: string
  productCount: number
  createdAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

/* ─────── Filtre parametreleri (GET /products) ─────────────── */

export interface ProductFilters {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: ProductStatus
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sort?: string
  order?: 'asc' | 'desc'
}

/* ─────── API Yanıt Şablonları ─────────────────────────────── */

type ListResponse   = { success: true; data: { products: Product[]; pagination: Pagination } }
type SingleResponse = { success: true; data: Product }
type CatResponse    = { success: true; data: ProductCategory[] }
type BulkImportResponse = {
  success: true
  data: { imported: number; updated: number; errors: { row: number; error: string }[] }
}

/* ─────── CRUD İşlevleri ───────────────────────────────────── */

/** GET /products */
export const getProducts = async (
  params: ProductFilters = {},
): Promise<{ products: Product[]; pagination: Pagination }> => {
  const res = await axios.get<ListResponse>('/products', {
    params,
    paramsSerializer: p => qs.stringify(p, { arrayFormat: 'repeat' }),
  })
  return res.data.data
}

/** GET /products/:id */
export const getProduct = async (id: number): Promise<Product> => {
  const res = await axios.get<SingleResponse>(`/products/${id}`)
  return res.data.data
}

/** POST /products */
export const createProduct = async (payload: Partial<Product>): Promise<Product> => {
  const res = await axios.post<SingleResponse>('/products', payload)
  return res.data.data
}

/** PUT /products/:id */
export const updateProduct = async (id: number, payload: Partial<Product>): Promise<Product> => {
  const res = await axios.put<SingleResponse>(`/products/${id}`, payload)
  return res.data.data
}

/** DELETE /products/:id */
export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`/products/${id}`)
}

/* ─────── Kategori & Toplu İçe Aktarım ─────────────────────── */

/** GET /products/categories */
export const getProductCategories = async (): Promise<ProductCategory[]> => {
  const res = await axios.get<CatResponse>('/products/categories')
  return res.data.data
}

/** POST /products/bulk-import  (CSV / Excel) */
export const bulkImportProducts = async (
  file: File,
  options?: { skipFirstRow?: boolean; updateExisting?: boolean },
): Promise<BulkImportResponse['data']> => {
  const formData = new FormData()
  formData.append('file', file)
  if (options) formData.append('options', JSON.stringify(options))

  const res = await axios.post<BulkImportResponse>('/products/bulk-import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data
}