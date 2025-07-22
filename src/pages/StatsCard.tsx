import type React from "react"

interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: "blue" | "green" | "purple" | "orange"
  change: string
}

export default function StatsCard({ title, value, icon, color, change }: StatsCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 bg-blue-100",
    green: "from-green-500 to-green-600 bg-green-100",
    purple: "from-purple-500 to-purple-600 bg-purple-100",
    orange: "from-orange-500 to-orange-600 bg-orange-100",
  }

  return (
    <div className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorClasses[color].split(" ")[0]} ${colorClasses[color].split(" ")[1]} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
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
