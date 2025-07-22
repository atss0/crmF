"use client"

import { Edit, Trash2, Mail, Phone, Building } from "lucide-react"
import type { Customer } from "./CustomerList"

interface CustomerRowProps {
  customer: Customer
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function CustomerRow({ customer, isSelected, onSelect, onEdit, onDelete }: CustomerRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "vip":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-cyan-500",
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="px-6 py-4 hover:bg-gray-50/50 transition-colors duration-200 group">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <div className="ml-6 grid grid-cols-12 gap-4 w-full items-center">
          {/* Customer Info */}
          <div className="col-span-3 flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full ${getAvatarColor(customer.name)} flex items-center justify-center text-white font-semibold text-sm`}
            >
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{customer.name}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {customer.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="inline-block text-xs bg-gray-100 text-gray-600 rounded px-2 py-1">
                    {tag}
                  </span>
                ))}
                {customer.tags.length > 2 && (
                  <span className="inline-block text-xs bg-gray-100 text-gray-600 rounded px-2 py-1">
                    +{customer.tags.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-2 space-y-1">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-3 h-3" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{customer.phone}</span>
            </div>
          </div>

          {/* Company */}
          <div className="col-span-2">
            {customer.company ? (
              <div className="flex items-center space-x-2 text-sm text-gray-900">
                <Building className="w-4 h-4 text-gray-400" />
                <span>{customer.company}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">No company</span>
            )}
          </div>

          {/* Status */}
          <div className="col-span-2">
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status || "active")}`}
            >
              {customer.status?.charAt(0).toUpperCase() + (customer.status?.slice(1) || "")}
            </span>
          </div>

          {/* Total Spent */}
          <div className="col-span-2">
            <div>
              <p className="font-semibold text-gray-900">₺{(customer.totalSpent || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                Last: {customer.lastContact ? new Date(customer.lastContact).toLocaleDateString() : "Never"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="col-span-1 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={onEdit}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
              title="Edit customer"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200"
              title="Delete customer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
