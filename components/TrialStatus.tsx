'use client'

import { useState, useEffect } from 'react'
import { Crown, Clock, CheckCircle } from 'lucide-react'

interface TrialData {
  plan: string
  trialStart: string
  trialEnd: string
  features: string[]
  sessionId: string
}

export function TrialStatus() {
  const [trialData, setTrialData] = useState<TrialData | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    // Check for active trials
    const enterpriseTrial = localStorage.getItem('enterpriseTrial')
    const premiumTrial = localStorage.getItem('premiumTrial')
    
    if (enterpriseTrial) {
      const trial = JSON.parse(enterpriseTrial)
      if (new Date(trial.trialEnd) > new Date()) {
        setTrialData(trial)
      } else {
        localStorage.removeItem('enterpriseTrial')
      }
    } else if (premiumTrial) {
      const trial = JSON.parse(premiumTrial)
      if (new Date(trial.trialEnd) > new Date()) {
        setTrialData(trial)
      } else {
        localStorage.removeItem('premiumTrial')
      }
    }
  }, [])

  useEffect(() => {
    if (trialData) {
      const interval = setInterval(() => {
        const now = new Date()
        const end = new Date(trialData.trialEnd)
        const diff = end.getTime() - now.getTime()
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          
          setTimeLeft(`${days}d ${hours}h ${minutes}m`)
        } else {
          setTimeLeft('Expired')
          clearInterval(interval)
        }
      }, 60000) // Update every minute
      
      return () => clearInterval(interval)
    }
  }, [trialData])

  if (!trialData) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Crown className="h-6 w-6" />
          <div>
            <h3 className="font-semibold text-lg">
              {trialData.plan === 'enterprise' ? 'Enterprise' : 'Premium'} Trial Active
            </h3>
            <p className="text-sm opacity-90">
              Full access to all {trialData.plan} features
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{timeLeft}</span>
          </div>
          <p className="text-xs opacity-75">Trial remaining</p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Active Features:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {trialData.features.slice(0, 6).map((feature, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
