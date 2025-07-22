"use client"

import type React from "react"

import { useState } from "react"
import type { Opportunity, OpportunityStage } from "../types/opportunity"
import OpportunityFormModal from "../components/OpportunityFormModal"
import {
  Target,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Calendar,
  Edit,
  Trash2,
  Phone,
  Mail,
  Building,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react"

const stages: OpportunityStage[] = ["contacted", "meeting", "proposal", "won", "lost"]
const stageLabels: Record<OpportunityStage, string> = {
  contacted: "İlk Temas",
  meeting: "Toplantısı Planlanan",
  proposal: "Teklif Gönderildi",
  won: "Kazanıldı",
  lost: "Kaybedildi",
}

const stageColors: Record<OpportunityStage, string> = {
  contacted: "bg-blue-500",
  meeting: "bg-yellow-500",
  proposal: "bg-purple-500",
  won: "bg-green-500",
  lost: "bg-red-500",
}

const stageIcons: Record<OpportunityStage, React.ReactNode> = {
  contacted: <Phone className="w-4 h-4" />,
  meeting: <Calendar className="w-4 h-4" />,
  proposal: <Mail className="w-4 h-4" />,
  won: <CheckCircle className="w-4 h-4" />,
  lost: <XCircle className="w-4 h-4" />,
}

export default function Pipeline() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 1,
      title: "Web Sitesi Yenileme Projesi",
      customerName: "Acme Corporation",
      value: 15000,
      stage: "contacted",
      note: "Tam kapsamlı web sitesi yenilemesi için ilk görüşme yapıldı",
      contactDate: "2024-01-15",
      expectedCloseDate: "2024-02-15",
      probability: 25,
      source: "Referans"
    },
    {
      id: 2,
      title: "E-ticaret Platformu",
      customerName: "Tech Solutions Inc",
      value: 25000,
      stage: "meeting",
      note: "Gereksinimleri görüşmek üzere gelecek hafta toplantı planlandı",
      contactDate: "2024-01-10",
      expectedCloseDate: "2024-02-28",
      probability: 50,
      source: "Web Sitesi"
    },
    {
      id: 3,
      title: "Mobil Uygulama Geliştirme",
      customerName: "StartupXYZ",
      value: 35000,
      stage: "proposal",
      note: "Teklif gönderildi, geri dönüş bekleniyor",
      contactDate: "2024-01-05",
      expectedCloseDate: "2024-02-10",
      probability: 75,
      source: "LinkedIn"
    },
    {
      id: 4,
      title: "Dijital Pazarlama Kampanyası",
      customerName: "Yerel İşletme",
      value: 8000,
      stage: "won",
      note: "Sözleşme imzalandı, proje gelecek ay başlıyor",
      contactDate: "2024-01-01",
      expectedCloseDate: "2024-01-20",
      probability: 100,
      source: "Soğuk Arama"
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStage, setSelectedStage] = useState<OpportunityStage | "all">("all")
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opp.note && opp.note.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStage = selectedStage === "all" || opp.stage === selectedStage

    return matchesSearch && matchesStage
  })

  const getByStage = (stage: OpportunityStage) => filteredOpportunities.filter((o) => o.stage === stage)

  const handleFormSubmit = (data: Omit<Opportunity, "id">) => {
    if (editingOpportunity) {
      setOpportunities((prev) =>
        prev.map((opp) => (opp.id === editingOpportunity.id ? { ...opp, ...data, id: opp.id } : opp)),
      )
      setEditingOpportunity(undefined)
    } else {
      const newOpp: Opportunity = { ...data, id: Date.now() }
      setOpportunities((prev) => [...prev, newOpp])
    }
    setShowModal(false)
  }

  const deleteOpportunity = (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this opportunity?")
    if (confirmed) {
      setOpportunities((prev) => prev.filter((opp) => opp.id !== id))
    }
  }

  const moveOpportunity = (id: number, newStage: OpportunityStage) => {
    setOpportunities((prev) => prev.map((opp) => (opp.id === id ? { ...opp, stage: newStage } : opp)))
  }

  // Calculate pipeline metrics
  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0)
  const weightedValue = opportunities.reduce((sum, opp) => sum + (opp.value * (opp.probability || 50)) / 100, 0)
  const wonValue = opportunities.filter((opp) => opp.stage === "won").reduce((sum, opp) => sum + opp.value, 0)
  const conversionRate =
    opportunities.length > 0
      ? (opportunities.filter((opp) => opp.stage === "won").length / opportunities.length) * 100
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Satış Fırsatları
                </h1>
                <p className="text-gray-600 mt-1">Satış fırsatları</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white/50 rounded-lg border border-gray-200">
                <button
                  onClick={() => setViewMode("kanban")}
                  className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors duration-200 ${viewMode === "kanban" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors duration-200 ${viewMode === "list" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                >
                  Liste
                </button>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Yeni Fırsat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Pipeline Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">₺{totalValue.toLocaleString()}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Toplam Fırsat Kazancı</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">₺{Math.round(weightedValue).toLocaleString()}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Ağırlıklı Fırsatlar</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">₺{wonValue.toLocaleString()}</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Kazanan Teklifler</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{Math.round(conversionRate)}%</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">Dönüşüm Oranı</p>
          </div>
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value as any)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50"
                >
                  <option value="all">Tümü</option>
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stageLabels[stage]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Content */}
        {viewMode === "kanban" ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {stages.map((stage) => (
              <PipelineColumn
                key={stage}
                stage={stage}
                opportunities={getByStage(stage)}
                onEdit={(opp) => {
                  setEditingOpportunity(opp)
                  setShowModal(true)
                }}
                onDelete={deleteOpportunity}
                onMove={moveOpportunity}
              />
            ))}
          </div>
        ) : (
          <PipelineList
            opportunities={filteredOpportunities}
            onEdit={(opp) => {
              setEditingOpportunity(opp)
              setShowModal(true)
            }}
            onDelete={deleteOpportunity}
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <OpportunityFormModal
          onClose={() => {
            setShowModal(false)
            setEditingOpportunity(undefined)
          }}
          onSubmit={handleFormSubmit}
          initialData={editingOpportunity}
        />
      )}
    </div>
  )
}

// Pipeline Column Component for Kanban View
interface PipelineColumnProps {
  stage: OpportunityStage
  opportunities: Opportunity[]
  onEdit: (opp: Opportunity) => void
  onDelete: (id: number) => void
  onMove: (id: number, stage: OpportunityStage) => void
}

function PipelineColumn({ stage, opportunities, onEdit, onDelete, onMove }: PipelineColumnProps) {
  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0)

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 min-h-[600px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg ${stageColors[stage]} flex items-center justify-center text-white`}>
            {stageIcons[stage]}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{stageLabels[stage]}</h3>
            <p className="text-sm text-gray-500">{opportunities.length} Fırsat(lar)</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">₺{totalValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Toplam Değer</p>
        </div>
      </div>

      <div className="space-y-4">
        {opportunities.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            onEdit={() => onEdit(opp)}
            onDelete={() => onDelete(opp.id)}
            onMove={onMove}
          />
        ))}
        {opportunities.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No opportunities in this stage</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Opportunity Card Component
interface OpportunityCardProps {
  opportunity: Opportunity
  onEdit: () => void
  onDelete: () => void
  onMove: (id: number, stage: OpportunityStage) => void
}

function OpportunityCard({ opportunity, onEdit, onDelete, onMove }: OpportunityCardProps) {
  const [showActions, setShowActions] = useState(false)

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return "text-green-600 bg-green-100"
    if (probability >= 50) return "text-yellow-600 bg-yellow-100"
    if (probability >= 25) return "text-orange-600 bg-orange-100"
    return "text-red-600 bg-red-100"
  }

  const isOverdue = opportunity.expectedCloseDate && new Date(opportunity.expectedCloseDate) < new Date()

  return (
    <div
      className={`bg-white rounded-xl p-4 border-2 hover:shadow-lg transition-all duration-200 group cursor-pointer ${isOverdue ? "border-red-200 bg-red-50/50" : "border-gray-200 hover:border-purple-300"
        }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{opportunity.title}</h4>
        <div
          className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${showActions ? "opacity-100" : ""
            }`}
        >
          <div className="flex items-center space-x-1">
            <button
              onClick={onEdit}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
              title="Fırsatı Güncelle"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
              title="Fırsatı Sil"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <Building className="w-3 h-3 text-gray-400" />
        <p className="text-sm text-gray-600 truncate">{opportunity.customerName}</p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          <span className="w-4 h-4 text-green-600 text-sm font-semibold flex items-center justify-center">₺</span>
          <span className="font-bold text-green-600">${opportunity.value.toLocaleString()}</span>
        </div>
        {opportunity.probability && (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getProbabilityColor(opportunity.probability)}`}
          >
            {opportunity.probability}%
          </span>
        )}
      </div>

      {opportunity.note && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{opportunity.note}</p>}

      <div className="flex items-center justify-between text-xs text-gray-500">
        {opportunity.expectedCloseDate && (
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
              {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
              {isOverdue && " (Süresi Dolmuş)"}
            </span>
          </div>
        )}
        {opportunity.source && (
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{opportunity.source}</span>
        )}
      </div>

      {/* Quick Move Actions */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Quick Move:</span>
          <div className="flex space-x-1">
            {stages
              .filter((stage) => stage !== opportunity.stage)
              .slice(0, 3)
              .map((stage) => (
                <button
                  key={stage}
                  onClick={() => onMove(opportunity.id, stage)}
                  className={`w-6 h-6 rounded-full ${stageColors[stage]} flex items-center justify-center text-white hover:scale-110 transition-transform duration-200`}
                  title={`Move to ${stageLabels[stage]}`}
                >
                  {stageIcons[stage]}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Pipeline List Component
interface PipelineListProps {
  opportunities: Opportunity[]
  onEdit: (opp: Opportunity) => void
  onDelete: (id: number) => void
}

function PipelineList({ opportunities, onEdit, onDelete }: PipelineListProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
          <div className="col-span-3">Fırsat</div>
          <div className="col-span-2">Müşteri</div>
          <div className="col-span-1">Değer</div>
          <div className="col-span-2">Aşama</div>
          <div className="col-span-1">Olasılık</div>
          <div className="col-span-2">Beklenen Kapanış</div>
          <div className="col-span-1">Aksiyonlar</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {opportunities.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Herhangi Bir Fırsat Bulunamadı</p>
            <p className="text-gray-400 text-sm">Aramanızı veya filtrelerinizi ayarlamayı deneyin</p>
          </div>
        ) : (
          opportunities.map((opp) => (
            <div key={opp.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200 group">
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Opportunity */}
                <div className="col-span-3">
                  <h4 className="font-medium text-gray-900">{opp.title}</h4>
                  {opp.note && <p className="text-sm text-gray-500 truncate">{opp.note}</p>}
                </div>

                {/* Customer */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{opp.customerName}</span>
                  </div>
                </div>

                {/* Value */}
                <div className="col-span-1">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600">₺{opp.value.toLocaleString()}</span>
                  </div>
                </div>

                {/* Stage */}
                <div className="col-span-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${stageColors[opp.stage]}`}></div>
                    <span className="text-sm text-gray-900">{stageLabels[opp.stage]}</span>
                  </div>
                </div>

                {/* Probability */}
                <div className="col-span-1">
                  {opp.probability && <span className="text-sm font-medium text-gray-900">{opp.probability}%</span>}
                </div>

                {/* Expected Close */}
                <div className="col-span-2">
                  {opp.expectedCloseDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(opp.expectedCloseDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-1">
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => onEdit(opp)}
                      className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
                      title="Fırsatı Düzenleyin"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(opp.id)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
                      title="Fırsatı Kaldırın"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
