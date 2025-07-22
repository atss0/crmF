"use client"

import { useEffect, useState } from "react"
import CustomerFormModal from "../components/CustomerFormModal"
import { Users, Search, Plus, Building, Filter, Star, UserCheck } from "lucide-react"
import CustomerListSkeleton from "./CustomerListSkeleton"
import StatsCard from "./StatsCard"
import CustomerRow from "./CustomerRow"
import { getMusteriler, createMusteri, updateMusteri, deleteMusteri } from "../services/musteriService"

export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  tags: string[]
  company?: string
  status?: "active" | "inactive" | "vip"
  lastContact?: string
  totalSpent?: number
}

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"all" | "active" | "inactive" | "vip">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.tags.some((tag: string) => tag.toLowerCase().includes(term)) ||
      (c.company && c.company.toLowerCase().includes(term))

    const matchesFilter = selectedFilter === "all" || c.status === selectedFilter

    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    const loadCustomers = async () => {
      setIsLoading(true)
      try {
        const { musteriler } = await getMusteriler() // API'den gerçek veriler geliyor
        const enhancedData = musteriler.map((m: any) => ({
          id: m.id,
          name: m.isim,
          email: m.eposta,
          phone: m.telefon,
          tags: m.etiketler || [],
          company: m.sirket,
          status: (m.durum === "aktif" ? "active" : m.durum === "pasif" ? "inactive" : "vip") as "active" | "inactive" | "vip",
          lastContact: m.son_iletisim,
          totalSpent: m.toplam_deger,
        }))
        setCustomers(enhancedData)
      } catch (error) {
        console.error("Müşteriler yüklenemedi:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomers()
  }, [])

  const handleFormSubmit = async (data: Omit<Customer, "id">) => {
    try {
      const durum =
        data.status === "active"
          ? "aktif"
          : data.status === "inactive"
            ? "pasif"
            : "vip"

      if (editingCustomer) {
        // GÜNCELLEME
        const updated = await updateMusteri(editingCustomer.id, {
          isim: data.name,
          eposta: data.email,
          telefon: data.phone,
          sirket: data.company || "",
          adres: "",
          etiketler: data.tags,
          durum,
          toplam_deger: data.totalSpent ? parseFloat(String(data.totalSpent)) : 0,
          son_iletisim: data.lastContact,
        })

        const mapped: Customer = {
          id: updated.id,
          name: updated.isim,
          email: updated.eposta,
          phone: updated.telefon,
          tags: updated.etiketler,
          company: updated.sirket,
          status:
            updated.durum === "aktif"
              ? "active"
              : updated.durum === "pasif"
                ? "inactive"
                : "vip",
          lastContact: updated.son_iletisim || undefined,
          totalSpent: updated.toplam_deger,
        }

        setCustomers((prev) =>
          prev.map((cust) => (cust.id === updated.id ? mapped : cust))
        )
        setEditingCustomer(null)
      } else {
        // YENİ OLUŞTURMA
        const created = await createMusteri({
          isim: data.name,
          eposta: data.email,
          telefon: data.phone,
          sirket: data.company || "",
          adres: "",
          etiketler: data.tags,
          durum,
          toplam_deger: data.totalSpent === 0 ? 0 : parseFloat(String(data.totalSpent)),
          son_iletisim: null,
        })

        const mapped: Customer = {
          id: created.id,
          name: created.isim,
          email: created.eposta,
          phone: created.telefon,
          tags: created.etiketler,
          company: created.sirket,
          status:
            created.durum === "aktif"
              ? "active"
              : created.durum === "pasif"
                ? "inactive"
                : "vip",
          lastContact: created.son_iletisim || undefined,
          totalSpent: created.toplam_deger,
        }

        setCustomers((prev) => [...prev, mapped])
      }
    } catch (err) {
      console.error("Form işlemi sırasında hata:", err)
    } finally {
      setShowModal(false)
    }
  }

  const deleteCustomer = async (id: number) => {
    const confirmed = confirm("Bu müşteriyi silmek istediğinize emin misiniz?")
    if (confirmed) {
      try {
        await deleteMusteri(id)
        setCustomers((prev) => prev.filter((c) => c.id !== id))
      } catch (error) {
        console.error("Silme işlemi başarısız:", error)
      }
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCustomer(null)
  }

  const toggleCustomerSelection = (id: number) => {
    setSelectedCustomers((prev) => (prev.includes(id) ? prev.filter((customerId) => customerId !== id) : [...prev, id]))
  }

  const selectAllCustomers = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.id))
    }
  }

  if (isLoading) {
    return <CustomerListSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Müşteriler
                </h1>
                <p className="text-gray-600 mt-1">Müşteri yönetimi</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Müşteri Ekle</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Toplam Müşteri"
            value={customers.length}
            icon={<Users className="w-5 h-5" />}
            color="blue"
            change="+12%"
          />
          <StatsCard
            title="Aktif Müşteriler"
            value={customers.filter((c) => c.status === "active").length}
            icon={<UserCheck className="w-5 h-5" />}
            color="green"
            change="+8%"
          />
          <StatsCard
            title="VIP Müşteriler"
            value={customers.filter((c) => c.status === "vip").length}
            icon={<Star className="w-5 h-5" />}
            color="purple"
            change="+15%"
          />
          <StatsCard
            title="Toplam Harcama"
            value={`₺${customers
              .reduce((sum, c) => sum + Number(c.totalSpent || 0), 0)  // ← Number(…)
              .toLocaleString()}`}
            icon={<Building className="w-5 h-5" />}
            color="orange"
            change="+23%"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Arama yap..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                >
                  <option value="all">Tümü</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              {selectedCustomers.length > 0 && (
                <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                  {selectedCustomers.length} seçildi
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Cards */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                onChange={selectAllCustomers}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="ml-6 grid grid-cols-12 gap-4 w-full text-sm font-medium text-gray-700">
                <div className="col-span-3">Müşteri</div>
                <div className="col-span-2">İletişim</div>
                <div className="col-span-2">Şirket</div>
                <div className="col-span-2">Durum</div>
                <div className="col-span-2">Toplam Harcama</div>
                <div className="col-span-1">İşlemler</div>
              </div>
            </div>
          </div>

          {/* Customer List */}
          <div className="divide-y divide-gray-200">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Müşteri bulunamadı.</p>
                <p className="text-gray-400 text-sm">
                  Lütfen farklı bir arama terimi deneyin veya yeni müşteri ekleyin.
                </p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  isSelected={selectedCustomers.includes(customer.id)}
                  onSelect={() => toggleCustomerSelection(customer.id)}
                  onEdit={() => {
                    setEditingCustomer(customer)
                    setShowModal(true)
                  }}
                  onDelete={() => deleteCustomer(customer.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CustomerFormModal
          onClose={closeModal}
          onSubmit={handleFormSubmit}
          initialData={editingCustomer || undefined}
          isEdit={!!editingCustomer}
        />
      )}
    </div>
  )
}
