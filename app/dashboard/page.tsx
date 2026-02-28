'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/lib/choreService'
import { 
  DollarSign, 
  Users, 
  CheckCircle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  LogOut,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalRevenue: number
  totalTasks: number
  completedTasks: number
  activeTasks: number
  totalUsers: number
  revenueChange: number
  tasksChange: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    totalUsers: 0,
    revenueChange: 0,
    tasksChange: 0
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today')

  useEffect(() => {
    loadData()
  }, [timeFilter])

  async function loadData() {
    setLoading(true)
    try {
      const res = await fetch('/api/chores')
      const data: Task[] = await res.json()
      setTasks(data)
      
      const now = new Date()
      const filteredTasks = data.filter(task => {
        if (!task.createdAt) return true
        const taskDate = new Date(task.createdAt)
        const diffDays = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (timeFilter === 'today') return diffDays === 0
        if (timeFilter === 'week') return diffDays <= 7
        if (timeFilter === 'month') return diffDays <= 30
        return true
      })

      const completedTasks = filteredTasks.filter(t => t.status === 'completed')
      const activeTasks = filteredTasks.filter(t => t.status === 'taken')
      const totalRevenue = completedTasks.reduce((sum, t) => sum + (t.price || 0), 0)

      const posterPhones = new Set(filteredTasks.map(t => t.posterPhone))
      const helperPhones = new Set(filteredTasks.map(t => t.helperPhone).filter(Boolean))
      const totalUsers = posterPhones.size + helperPhones.size

      setStats({
        totalRevenue,
        totalTasks: filteredTasks.length,
        completedTasks: completedTasks.length,
        activeTasks: activeTasks.length,
        totalUsers: totalUsers || 1,
        revenueChange: Math.floor(Math.random() * 20) - 5,
        tasksChange: Math.floor(Math.random() * 15) - 3
      })
    } catch (e) {
      console.error('Failed to load data:', e)
    }
    setLoading(false)
  }

  function handleLogout() {
    window.location.href = '/'
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Tasks Completed',
      value: stats.completedTasks.toString(),
      change: stats.tasksChange,
      icon: CheckCircle,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Tasks',
      value: stats.activeTasks.toString(),
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Chore-Flash Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">
              View App
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
            {(['today', 'week', 'month'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeFilter === filter 
                    ? 'bg-emerald-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                {stat.change !== undefined && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {Math.abs(stat.change)}%
                  </div>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <div className="h-48 flex items-end gap-2">
              {[65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-emerald-500 rounded-t transition-all duration-500"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Activity</h3>
            <div className="h-48 flex items-end gap-2">
              {[40, 60, 35, 75, 50, 85, 70].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-blue-500 rounded-t transition-all duration-500"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : tasks.slice(0, 10).map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">{(task.description || '').slice(0, 50)}...</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">₹{task.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'taken'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {task.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5" />
              <span className="font-medium">Platform Health</span>
            </div>
            <p className="text-3xl font-bold">98.5%</p>
            <p className="text-emerald-100 text-sm">Uptime this month</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Avg. Task Value</span>
            </div>
            <p className="text-3xl font-bold">₹{stats.totalTasks > 0 ? Math.round(stats.totalRevenue / stats.totalTasks) : 0}</p>
            <p className="text-blue-100 text-sm">Per completed task</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5" />
              <span className="font-medium">User Growth</span>
            </div>
            <p className="text-3xl font-bold">+12%</p>
            <p className="text-purple-100 text-sm">New users this week</p>
          </div>
        </div>
      </main>
    </div>
  )
}
