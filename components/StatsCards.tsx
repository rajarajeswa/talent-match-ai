'use client'

import { Briefcase, TrendingUp, Users, FileText } from 'lucide-react'

export function StatsCards() {
  const stats = [
    {
      label: 'Jobs Matched',
      value: '127',
      change: '+12%',
      icon: Briefcase,
      color: 'primary'
    },
    {
      label: 'Applications Sent',
      value: '43',
      change: '+8%',
      icon: FileText,
      color: 'premium'
    },
    {
      label: 'Profile Views',
      value: '89',
      change: '+23%',
      icon: Users,
      color: 'primary'
    },
    {
      label: 'Match Rate',
      value: '87%',
      change: '+5%',
      icon: TrendingUp,
      color: 'premium'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="card">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
              <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {stat.change}
            </span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
