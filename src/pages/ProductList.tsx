"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Product } from "../types/product"
import ProductFormModal from "../components/ProductFormModal"
import {
  Package,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Tag,
} from "lucide-react"
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct as apiDeleteProduct,
  getProductCategories,
  type ProductCategory,
} from "../services/productService"
import { mapProduct } from "../utils/mapper"

interface ProductWithCategory extends Omit<Product, 'description' | 'status'> {
  description: string
  category?: string
  image?: string
  status?: "active" | "inactive" | "out_of_stock"
  lastUpdated?: string
}

export default function ProductList() {
  const [products, setProducts] = useState<any>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])   // API’den
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch =
      product.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "out_of_stock"
          ? product.stock === 0
          : product.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        const [{ products }, cats] = await Promise.all([
          getProducts({ page: 1, limit: 1000 }),   // filtre parametresi ekleyebilirsin
          getProductCategories(),
        ])

        setProducts(products.map(mapProduct))
        setCategories(cats)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleFormSubmit = async (data: {
    name: string;
    price: number;
    stock: number;
    description: string;
    category?: string;
    image?: string;
    status?: "active" | "inactive" | "out_of_stock";
    lastUpdated?: string;
  }) => {
    console.log(data)
    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, {
        ad: data.name,
        sku: `${data.name.toLowerCase().replace(/\s+/g, "-")}`,
        aciklama: data.description,
        fiyat: data.price,
        stok: data.stock,
        status: data.status ?? "active",
        kategori_id: data.category,
        images: data.image ? [data.image] : undefined,
      })
      setProducts((prev: any) => prev.map((p: any) => p.id === updated.id ? mapProduct(updated) : p))
      setEditingProduct(null)
    } else {
      const created = await createProduct({
        ad: data.name,
        sku: `${data.name.toLowerCase().replace(/\s+/g, "-")}`,
        aciklama: data.description,
        fiyat: data.price,
        stok: data.stock,
        status: "active",
        kategori_id: data.category,
        images: data.image ? [data.image] : undefined,
      })
      setProducts((prev: any) => [...prev, mapProduct(created)])
    }
    setShowModal(false)
  }

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return
    await apiDeleteProduct(id)
    setProducts((prev: any) => prev.filter((p: any) => p.id !== id))
  }

  const toggleProductSelection = (id: number) => {
    setSelectedProducts((prev) => (prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]))
  }

  const selectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((p: any) => p.id))
    }
  }

  // Calculate stats
  const totalProducts = products.length
  const activeProducts = products.filter((p: any) => p.status === "active").length
  const outOfStockProducts = products.filter((p: any) => p.stock === 0).length
  const totalValue = products.reduce((sum: any, p: any) => sum + p.price * p.stock, 0)

  if (isLoading) {
    return <ProductListSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Ürünler
                </h1>
                <p className="text-gray-600 mt-1">Ürünleri yönet</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white/50 rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors duration-200 ${viewMode === "grid" ? "bg-orange-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors duration-200 ${viewMode === "list" ? "bg-orange-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Ürün Ekle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Toplam Ürün"
            value={totalProducts}
            icon={<Package className="w-5 h-5" />}
            color="blue"
            change="+12%"
          />
          <StatsCard
            title="Aktif Ürünler"
            value={activeProducts}
            icon={<CheckCircle className="w-5 h-5" />}
            color="green"
            change="+8%"
          />
          <StatsCard
            title="Stokta Olmayan Ürünler"
            value={outOfStockProducts}
            icon={<AlertTriangle className="w-5 h-5" />}
            color="red"
            change="-5%"
          />
          <StatsCard
            title="Toplam Değer"
            value={`₺${totalValue.toLocaleString()}`}
            icon={
              <span className="w-5 h-5 flex items-center justify-center text-white text-xl font-bold">
                ₺
              </span>
            }
            color="purple"
            change="+23%"
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
                  placeholder="Ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50"
                >
                  <option value="all">Tüm Kategoriler</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="out_of_stock">Stoğu Olmayan</option>
              </select>
              {selectedProducts.length > 0 && (
                <div className="text-sm text-gray-600 bg-orange-50 px-3 py-2 rounded-lg">
                  {selectedProducts.length} seçildi
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Content */}
        {viewMode === "grid" ? (
          <ProductGrid
            products={filteredProducts}
            selectedProducts={selectedProducts}
            onToggleSelection={toggleProductSelection}
            onEdit={(product) => {
              setEditingProduct(product)
              setShowModal(true)
            }}
            onDelete={deleteProduct}
          />
        ) : (
          <ProductTable
            products={filteredProducts}
            selectedProducts={selectedProducts}
            onToggleSelection={toggleProductSelection}
            onSelectAll={selectAllProducts}
            onEdit={(product) => {
              setEditingProduct(product)
              setShowModal(true)
            }}
            onDelete={deleteProduct}
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProductFormModal
          onClose={() => {
            setShowModal(false)
            setEditingProduct(null)
          }}
          onSubmit={handleFormSubmit}
          initialData={editingProduct || undefined}
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
  color: "blue" | "green" | "red" | "purple"
  change: string
}

function StatsCard({ title, value, icon, color, change }: StatsCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
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

// Product Grid Component
interface ProductGridProps {
  products: ProductWithCategory[]
  selectedProducts: number[]
  onToggleSelection: (id: number) => void
  onEdit: (product: ProductWithCategory) => void
  onDelete: (id: number) => void
}

function ProductGrid({ products, selectedProducts, onToggleSelection, onEdit, onDelete }: ProductGridProps) {
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600", bg: "bg-red-100" }
    if (stock <= 5) return { label: "Low Stock", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { label: "In Stock", color: "text-green-600", bg: "bg-green-100" }
  }

  if (products.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Ürün bulunamadı.</h3>
        <p className="text-gray-600 mb-6">
          Aramanızı veya filtrelerinizi ayarlamayı deneyin.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const stockStatus = getStockStatus(product.stock)
        const isSelected = selectedProducts.includes(product.id)

        return (
          <div
            key={product.id}
            className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl group ${isSelected ? "border-orange-300 bg-orange-50/50" : "border-white/20 hover:border-orange-200"
              }`}
          >
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image || "https://www.ebaajans.com/wp-content/uploads/2018/05/urun-fotograf-cekimi-ankara.jpg"}
                alt={product.ad}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="absolute top-3 left-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelection(product.id)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-t-2xl" />
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">{product.ad}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-green-600 text-lg">₺{product.price.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className={`font-semibold ${stockStatus.color}`}>{product.stock}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                {product.category && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    <Tag className="w-3 h-3" />
                    <span>{product.category}</span>
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => onEdit(product)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Product Table Component
interface ProductTableProps {
  products: ProductWithCategory[]
  selectedProducts: number[]
  onToggleSelection: (id: number) => void
  onSelectAll: () => void
  onEdit: (product: ProductWithCategory) => void
  onDelete: (id: number) => void
}

function ProductTable({
  products,
  selectedProducts,
  onToggleSelection,
  onSelectAll,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600", bg: "bg-red-100" }
    if (stock <= 5) return { label: "Low Stock", color: "text-yellow-600", bg: "bg-yellow-100" }
    return { label: "In Stock", color: "text-green-600", bg: "bg-green-100" }
  }

  if (products.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
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
            checked={selectedProducts.length === products.length && products.length > 0}
            onChange={onSelectAll}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <div className="ml-6 grid grid-cols-12 gap-4 w-full text-sm font-medium text-gray-700">
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Stock</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Actions</div>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock)
          const isSelected = selectedProducts.includes(product.id)

          return (
            <div
              key={product.id}
              className={`px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200 group ${isSelected ? "bg-orange-50/50" : ""
                }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelection(product.id)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <div className="ml-6 grid grid-cols-12 gap-4 w-full items-center">
                  {/* Product */}
                  <div className="col-span-4 flex items-center space-x-3">
                    <img
                      src={product.image || "/placeholder.svg?height=40&width=40&query=product"}
                      alt={product.ad}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{product.ad}</p>
                      <p className="text-sm text-gray-500 truncate">{product.description}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    {product.category ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        <Tag className="w-3 h-3" />
                        <span>{product.category}</span>
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Kategori Yok</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <span className="w-4 h-4 flex items-center justify-center text-green-600 text-sm font-bold">
                        ₺
                      </span>
                      <span className="font-semibold text-green-600">${product.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="col-span-2">
                    <div>
                      <p className={`font-semibold ${stockStatus.color}`}>{product.stock}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.bg} ${stockStatus.color}`}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      <span>Aktif</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
                      title="Edit product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
function ProductListSkeleton() {
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
              <div className="h-10 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-20 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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

        {/* Search Skeleton */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="h-12 bg-gray-200 rounded-xl w-96 animate-pulse"></div>
            <div className="flex space-x-3">
              <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
              <div className="h-48 bg-gray-200 rounded-t-2xl animate-pulse"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
