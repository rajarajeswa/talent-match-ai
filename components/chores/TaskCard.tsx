'use client'

import { Task } from '@/lib/choreService'
import { MapPin, Clock, IndianRupee, User, CheckCircle, MessageCircle, CreditCard, Shield } from 'lucide-react'

interface TaskCardProps {
  task: Task
  user?: any
  onAccept?: (taskId: string) => void
  onComplete?: (taskId: string) => void
  onWhatsAppClick?: (phone: string, taskTitle: string) => string
  onUPIClick?: (posterVPA: string, price: number, posterName: string) => string
}

export function TaskCard({ task, user, onAccept, onComplete, onWhatsAppClick, onUPIClick }: TaskCardProps) {
  const timeAgo = (date: string) => {
    const now = new Date()
    const taskDate = new Date(date)
    const diffMs = now.getTime() - taskDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  const isPoster = user?.phone === task.posterPhone
  const isHelper = user?.phone === task.helperPhone

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
          ₹{task.price}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      
      <div className="space-y-1 text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{task.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{timeAgo(task.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{task.posterName}</span>
        </div>
      </div>
      
      {/* OPEN - Show Accept button */}
      {task.status === 'open' && onAccept && (
        <button
          onClick={() => onAccept(task.id)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          I'll help!
        </button>
      )}
      
      {/* TAKEN - Show Contact Poster (WhatsApp) or Complete button */}
      {task.status === 'taken' && (
        <div className="space-y-2">
          {isHelper && (
            <div className="flex gap-2">
              {onWhatsAppClick && (
                <a
                  href={onWhatsAppClick(task.posterPhone, task.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact on WhatsApp
                </a>
              )}
              {onComplete && (
                <button
                  onClick={() => onComplete(task.id)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Done
                </button>
              )}
            </div>
          )}
          {isPoster && (
            <div className="bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg text-center">
              Being helped by {task.helperName}
            </div>
          )}
          {!isHelper && !isPoster && (
            <div className="bg-gray-100 text-gray-600 font-medium py-2 px-4 rounded-lg text-center">
              Being helped by {task.helperName}
            </div>
          )}
        </div>
      )}
      
      {/* COMPLETED - Show UPI Payment */}
      {task.status === 'completed' && (
        <div className="space-y-2">
          <div className="w-full bg-gray-100 text-gray-600 font-medium py-2 px-4 rounded-lg text-center flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ✓
          </div>
          {isPoster && onUPIClick && (
            <a
              href={onUPIClick(task.helperPhone || '', task.price, task.helperName || 'Helper')}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg"
            >
              <Shield className="h-4 w-4" />
              <CreditCard className="h-4 w-4" />
              <span>Secure Pay ₹{task.price}</span>
            </a>
          )}
        </div>
      )}
    </div>
  )
}
