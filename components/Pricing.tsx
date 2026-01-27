'use client'

import { useState } from 'react'
import { Check, Crown, Star } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { signInWithGoogle } from '@/lib/auth'

export function Pricing() {
  const { user } = useAuth()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  // Demo subscription creator for when Stripe is not configured
  const createDemoSubscription = async (plan: string, userId: string) => {
    try {
      // Create a demo subscription
      const response = await fetch('/api/start-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Show success message
        alert(`🎉 ${data.message}\n\n✨ Demo ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Activated!\n\n📋 Features:\n${data.trialData.features.join('\n• ')}\n\n📅 Trial ends: ${new Date(data.trialData.trialEnd).toLocaleDateString()}\n\n💳 Note: This is a demo. Real payments require Stripe setup.`)
        
        // Store trial info
        localStorage.setItem(`${plan}Trial`, JSON.stringify(data.trialData))
        
        // Redirect to success page
        window.location.href = `/success?session_id=demo_${plan}_${Date.now()}`
      } else {
        throw new Error('Failed to create demo subscription')
      }
    } catch (error) {
      console.error('Demo subscription error:', error)
      alert('Demo mode temporarily unavailable. Please try again later.')
    }
  }

  const plans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started',
      monthlyFeatures: [
        'Upload up to 3 resumes',
        'Basic AI analysis',
        '5 job matches per day',
        'Basic filtering',
        'Email support'
      ],
      yearlyFeatures: [
        'Upload up to 3 resumes',
        'Basic AI analysis',
        '5 job matches per day',
        'Basic filtering',
        'Email support'
      ],
      excluded: [
        'Advanced AI insights',
        'Unlimited job matches',
        'Priority support',
        'Resume optimization',
        'Interview preparation'
      ],
      popular: false,
      buttonText: 'Current Plan - FREE',
      buttonAction: () => {
        alert('🎉 All features are now FREE! Enjoy unlimited access to everything!');
      }
    },
    {
      name: 'Premium',
      monthlyPrice: 29,
      yearlyPrice: 290,
      description: 'For serious job seekers',
      monthlyFeatures: [
        'Unlimited resume uploads',
        'Advanced AI analysis',
        'Unlimited job matches',
        'Advanced filtering',
        '3 ATS resume templates',
        'Instant System',
        'Priority email support'
      ],
      yearlyFeatures: [
        'Unlimited resume uploads',
        'Advanced AI analysis',
        'Unlimited job matches',
        'Advanced filtering',
        '3 ATS resume templates',
        'Instant System',
        'Priority email support'
      ],
      excluded: [
        'PDF download capability',
        'Perfect Match Algorithm',
        'Hidden Job Market Access',
        'Resume optimization tools',
        'Interview preparation',
        'Career insights dashboard'
      ],
      popular: false,
      buttonText: 'FREE - All Features Unlocked',
      buttonAction: () => {
        alert('🎉 Premium features are now FREE! Unlimited access to all advanced features!');
      }
    },
    {
      name: 'Professional',
      monthlyPrice: 49,
      yearlyPrice: 490,
      description: 'For career-focused professionals',
      monthlyFeatures: [
        'Everything in Premium',
        '5 ATS resume templates',
        'Instant Perfect Match System',
        'PDF download capability',
        'Resume optimization tools',
        'Priority email support'
      ],
      yearlyFeatures: [
        'Everything in Premium',
        '5 ATS resume templates',
        'Instant Perfect Match System',
        'PDF download capability',
        'Resume optimization tools',
        'Priority email support'
      ],
      excluded: [
        'Hidden Job Market Access',
        '24/7 AI assistant',
        'Business intelligence',
        'Priority CEO Support',
        'White-Label Rights'
      ],
      popular: false,
      buttonText: 'FREE - Professional Features',
      buttonAction: () => {
        alert('🎉 Professional features are now FREE! Access to perfect match and advanced tools!');
      }
    },
    {
      name: 'Enterprise',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      description: 'For teams and organizations',
      monthlyFeatures: [
        'Everything in Professional',
        '10 professional ATS templates',
        'Unlimited instant apply',
        'Perfect Match Algorithm (95% accuracy)',
        'Hidden Job Market Access (3,240+ jobs)',
        '24/7 AI Assistant',
        'Business Intelligence',
        'Priority CEO Support',
        'White-Label Rights'
      ],
      yearlyFeatures: [
        'Everything in Professional',
        '10 professional ATS templates',
        'Unlimited instant apply',
        'Perfect Match Algorithm (95% accuracy)',
        'Hidden Job Market Access (3,240+ jobs)',
        '24/7 AI Assistant',
        'Business Intelligence',
        'Priority CEO Support',
        'White-Label Rights'
      ],
      excluded: [],
      popular: false,
      buttonText: 'FREE - Enterprise Features',
      buttonAction: () => {
        alert('🎉 Enterprise features are now FREE! Access to all advanced tools and hidden jobs!');
      }
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            🎉 All Features Are Now FREE!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Unlimited access to all premium features - No credit card required
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                billingCycle === 'yearly'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-premium-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-br from-premium-50 to-premium-100 border-2 border-premium-300 shadow-xl'
                  : 'bg-white border border-gray-200 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>Great Value</span>
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  {(billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice) > 0 && (
                    <span className="text-gray-600 ml-2">
                      /{billingCycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  )}
                </div>
              </div>
              
              <button
                onClick={plan.buttonAction}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  plan.popular
                    ? 'btn-premium'
                    : plan.monthlyPrice === 0
                    ? 'btn-secondary'
                    : 'btn-primary'
                } ${user && plan.monthlyPrice === 0 ? 'cursor-not-allowed opacity-75' : ''}`}
                disabled={user && plan.monthlyPrice === 0}
              >
                {plan.buttonText}
              </button>
              
              <div className="mt-8 space-y-4">
                {(billingCycle === 'monthly' ? plan.monthlyFeatures : plan.yearlyFeatures).map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
                {plan.excluded.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3 opacity-50">
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-full flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Enterprise Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 mt-1">•</span>
                <span className="text-gray-700">🎯 <strong>Perfect Match Algorithm</strong> - 95% accurate job matching</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 mt-1">•</span>
                <span className="text-gray-700">⚡ <strong>Instant Apply System</strong> - Apply to 100+ jobs with one click</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 mt-1">•</span>
                <span className="text-gray-700">⭐ <strong>Priority Application Queue</strong> - 5x faster responses</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 mt-1">•</span>
                <span className="text-gray-700">📝 <strong>100% ATS-Friendly Resume Maker</strong> - AI creates perfect resumes that pass every ATS system</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 mt-1">•</span>
                <span className="text-gray-700">👁️ <strong>Hidden Job Market Access</strong> - 3,240+ unadvertised jobs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
