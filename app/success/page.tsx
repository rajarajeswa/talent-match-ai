'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { SubscriptionManager } from '@/lib/subscription-manager'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  const { user } = useAuth()

  useEffect(() => {
    const activateSubscription = async () => {
      if (sessionId && user) {
        try {
          // In production, you'd verify the session with Stripe
          // For demo, we'll simulate subscription activation
          const mockSubscription = await SubscriptionManager.createSubscription(
            user.uid || 'demo_user',
            'premium', // This would come from the session metadata
            'sub_' + sessionId
          )
          
          setSubscription(mockSubscription)
          setLoading(false)
        } catch (error) {
          console.error('Error activating subscription:', error)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    // Faster activation - reduce delay
    const timer = setTimeout(activateSubscription, 500)
    
    return () => clearTimeout(timer)
  }, [sessionId, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    )
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'premium': return 'Premium'
      case 'professional': return 'Professional'
      case 'enterprise': return 'Enterprise'
      default: return 'Premium'
    }
  }

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'unlimited job matches, advanced filtering, 3 ATS resume templates, and priority email support'
      case 'professional':
        return '5 ATS resume templates, instant apply system, perfect match algorithm, and PDF download capability'
      case 'enterprise':
        return '10 ATS templates, unlimited instant apply, hidden job market access, and 24/7 AI assistant'
      default:
        return 'unlimited job matches, advanced filtering, and all premium features'
    }
  }

  const planName = subscription ? getPlanName(subscription.plan) : 'Premium'
  const planFeatures = subscription ? getPlanFeatures(subscription.plan) : 'unlimited job matches, advanced filtering, and all premium features'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            🎉 Welcome to {planName}!
          </h2>
          <p className="text-blue-700 text-sm">
            Your account is ready! You now have access to {planFeatures}
          </p>
          {subscription?.trialEnd && (
            <p className="text-blue-600 text-xs mt-2">
              🎯 Free trial active until: {new Date(subscription.trialEnd).toLocaleDateString()}
            </p>
          )}
          {!subscription?.trialEnd && (
            <p className="text-green-600 text-xs mt-2">
              ✅ Subscription is active
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          <Link href="/dashboard" className="btn-primary w-full flex items-center justify-center space-x-2">
            <span>Go to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <Link href="/pricing" className="btn-secondary w-full">
            View Plan Details
          </Link>
        </div>
        
        {sessionId && (
          <p className="text-sm text-gray-500 mt-6">
            Transaction ID: {sessionId}
          </p>
        )}
        
        {subscription && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-700 font-medium">
              ✅ Account setup complete!
            </p>
            <p className="text-xs text-green-600 mt-1">
              Status: {subscription.status === 'trialing' ? '🎯 Free Trial Active' : '💳 Subscription Active'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Plan: {planName} • Features: {subscription.plan === 'premium' ? '7' : subscription.plan === 'professional' ? '8' : '9'} available
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
