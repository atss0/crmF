"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  DollarSign,
  Users,
  Target,
  Package,
  Clock,
  CheckCircle,
  Trophy,
  FileText,
  UserPlus,
  FileEdit,
  Edit3,
  Rocket,
  LogOut,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { getMusteriler } from '../services/musteriService'
import { getFirsatlar } from "../services/firsatService"
import { getTasks } from '../services/taskService'
import { getProducts } from '../services/productService'  
// import { getInvoices }       from '../services/invoiceService' 

interface DashboardStats {
  totalCustomers: number
  totalProducts: number
  totalInvoices: number
  totalRevenue: number
  pendingTasks: number
  completedTasks: number
  activeOpportunities: number
  wonOpportunities: number
  monthlyGrowth: number
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalProducts: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingTasks: 0,
    completedTasks: 0,
    activeOpportunities: 0,
    wonOpportunities: 0,
    monthlyGrowth: 0,
  })
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)

        /* Paralel istek gönder – daha hızlı */
        const [
          { musteri_sayisi },
          { firsatlar },
          { tasks },
          { products },
          // { invoices },
        ] = await Promise.all([
          getMusteriler(),     // sadece sayaç önemli
          getFirsatlar({ page: 1, limit: 1000 }),   // küçük veri seti varsayımı
          getTasks({ page: 1, limit: 1000 }),   // tüm görevler
          getProducts(),      // toplam sayıyı Response.pagination.total'dan al
          // getInvoices({ page: 1, limit: 1 }),
        ])

        /* Rakamlar */

        const pendingTasks = tasks.filter(t => t.status === 'pending').length
        const completedTasks = tasks.filter(t => t.status === 'completed').length
        const activeOpportunities = firsatlar.filter(f => !['won', 'lost'].includes(f.asama)).length
        const wonOpportunities = firsatlar.filter(f => f.asama === 'won').length

        setStats({
          totalCustomers: musteri_sayisi,
          totalProducts: products.length,
          totalInvoices: 4,
          totalRevenue: products.reduce((acc, p) => acc + (p.fiyat * p.stok), 0),
          pendingTasks,
          completedTasks,
          activeOpportunities,
          wonOpportunities,
          monthlyGrowth: 12.5,           // örnek sabit
        })
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Kontrol Paneli
              </h1>
              <p className="text-gray-600 mt-1">Hoş geldiniz.</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Bugün</p>
                <p className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
              <button
                onClick={logout}
                className="ml-4 flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md shadow transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Toplam Stok Değeri"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            change="+12.5%"
            changeType="positive"
            icon={<DollarSign className="w-6 h-6" />}
            gradient="from-green-500 to-emerald-600"
            onClick={() => navigate("/products")}
          />
          <MetricCard
            title="Müşteriler"
            value={stats.totalCustomers.toString()}
            change="+8.2%"
            changeType="positive"
            icon={<Users className="w-6 h-6" />}
            gradient="from-blue-500 to-cyan-600"
            onClick={() => navigate("/customers")}
          />
          <MetricCard
            title="Aktif Fırsatlar"
            value={stats.activeOpportunities.toString()}
            change="+15.3%"
            changeType="positive"
            icon={<Target className="w-6 h-6" />}
            gradient="from-purple-500 to-pink-600"
            onClick={() => navigate("/pipeline")}
          />
          <MetricCard
            title="Ürünler"
            value={stats.totalProducts.toString()}
            change="+5.1%"
            changeType="positive"
            icon={<Package className="w-6 h-6" />}
            gradient="from-orange-500 to-red-600"
            onClick={() => navigate("/products")}
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Gönderilen Görevler"
            value={stats.pendingTasks}
            total={stats.pendingTasks + stats.completedTasks}
            icon={<Clock className="w-5 h-5" />}
            color="yellow"
            onClick={() => navigate("/tasks")}
          />
          <StatCard
            title="Tamamlanan Görevler"
            value={stats.completedTasks}
            total={stats.pendingTasks + stats.completedTasks}
            icon={<CheckCircle className="w-5 h-5" />}
            color="green"
            onClick={() => navigate("/tasks")}
          />
          <StatCard
            title="Başarılı Fırsatlar"
            value={stats.wonOpportunities}
            total={stats.wonOpportunities + stats.activeOpportunities}
            icon={<Trophy className="w-5 h-5" />}
            color="purple"
            onClick={() => navigate("/pipeline")}
          />
          <StatCard
            title="Toplam Faturalar"
            value={stats.totalInvoices}
            total={stats.totalInvoices}
            icon={<FileText className="w-5 h-5" />}
            color="blue"
            onClick={() => navigate("/invoices")}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı Menü</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              title="Müşteri Ekle"
              icon={<UserPlus className="w-6 h-6" />}
              onClick={() => navigate("/customers")}
              color="blue"
            />
            <QuickActionButton
              title="Fatura Oluştur"
              icon={<FileEdit className="w-6 h-6" />}
              onClick={() => navigate("/invoices")}
              color="purple"
            />
            <QuickActionButton
              title="Görev Ekle"
              icon={<Edit3 className="w-6 h-6" />}
              onClick={() => navigate("/tasks")}
              color="green"
            />
            <QuickActionButton
              title="Yeni Fırsat"
              icon={<Rocket className="w-6 h-6" />}
              onClick={() => navigate("/pipeline")}
              color="orange"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20">
        <div className="px-6 py-4">
          <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/70 rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: React.ReactNode
  gradient: string
  onClick: () => void
}

function MetricCard({ title, value, change, changeType, icon, gradient, onClick }: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <div
          className={`text-sm font-medium px-2 py-1 rounded-full ${changeType === "positive" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
            }`}
        >
          {change}
        </div>
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  total: number
  icon: React.ReactNode
  color: "blue" | "green" | "yellow" | "purple"
  onClick: () => void
}

function StatCard({ title, value, total, icon, color, onClick }: StatCardProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0

  const colorClasses = {
    blue: "from-blue-500 to-blue-600 bg-blue-100",
    green: "from-green-500 to-green-600 bg-green-100",
    yellow: "from-yellow-500 to-yellow-600 bg-yellow-100",
    purple: "from-purple-500 to-purple-600 bg-purple-100",
  }

  return (
    <div
      onClick={onClick}
      className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 cursor-pointer hover:scale-105 transition-all duration-300"
    >
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
    </div>
  )
}

interface QuickActionButtonProps {
  title: string
  icon: React.ReactNode
  onClick: () => void
  color: "blue" | "purple" | "green" | "orange"
}

function QuickActionButton({ title, icon, onClick, color }: QuickActionButtonProps) {
  const colorClasses = {
    blue: "hover:bg-blue-50 text-blue-700 border-blue-200",
    purple: "hover:bg-purple-50 text-purple-700 border-purple-200",
    green: "hover:bg-green-50 text-green-700 border-green-200",
    orange: "hover:bg-orange-50 text-orange-700 border-orange-200",
  }

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:scale-105 ${colorClasses[color]}`}
    >
      <div className="mb-2 flex justify-center">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
    </button>
  )
}