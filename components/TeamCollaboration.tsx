'use client'

import { useState } from 'react'
import { Users, Plus, Mail, Crown, Settings, BarChart3, MessageSquare, Share2, Calendar, Target, Award, TrendingUp, Zap, Globe, Shield, Rocket, Database, Bot, Lightbulb, Clock, DollarSign, LineChart } from 'lucide-react'

interface BusinessMetrics {
  revenue: number
  activeUsers: number
  conversionRate: number
  avgDealSize: number
  monthlyGrowth: number
}

interface AutomationRule {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  savings: string
}

export function TeamCollaboration() {
  const [businessMetrics] = useState<BusinessMetrics>({
    revenue: 2480,
    activeUsers: 47,
    conversionRate: 12.5,
    avgDealSize: 199,
    monthlyGrowth: 23.4
  })

  const [automationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Auto-Resume Screening',
      description: 'AI automatically screens and ranks incoming resumes',
      status: 'active',
      savings: '15 hours/week'
    },
    {
      id: '2',
      name: 'Smart Job Matching',
      description: 'Automatically matches candidates to perfect job opportunities',
      status: 'active',
      savings: '8 hours/week'
    },
    {
      id: '3',
      name: 'Email Automation',
      description: 'Sends personalized follow-ups to candidates automatically',
      status: 'active',
      savings: '6 hours/week'
    },
    {
      id: '4',
      name: 'Interview Scheduling',
      description: 'AI coordinates interview times with candidates',
      status: 'inactive',
      savings: '4 hours/week'
    }
  ])

  return (
    <div className="space-y-6">
      {/* Business Dashboard Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-lg p-2">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">CEO Business Dashboard</h2>
              <p className="text-purple-100">Automate your entire recruitment business</p>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="text-sm font-medium">Enterprise Active</span>
          </div>
        </div>

        {/* Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-300" />
              <span className="text-sm font-medium text-purple-100">Revenue</span>
            </div>
            <p className="text-lg font-bold text-white">${businessMetrics.revenue.toLocaleString()}</p>
            <p className="text-xs text-green-300">+23% this month</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-blue-300" />
              <span className="text-sm font-medium text-purple-100">Active Users</span>
            </div>
            <p className="text-lg font-bold text-white">{businessMetrics.activeUsers}</p>
            <p className="text-xs text-blue-300">+12 this week</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium text-purple-100">Conversion</span>
            </div>
            <p className="text-lg font-bold text-white">{businessMetrics.conversionRate}%</p>
            <p className="text-xs text-yellow-300">+2.3% improvement</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-300" />
              <span className="text-sm font-medium text-purple-100">Avg Deal</span>
            </div>
            <p className="text-lg font-bold text-white">${businessMetrics.avgDealSize}</p>
            <p className="text-xs text-green-300">+$15 increase</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <LineChart className="h-4 w-4 text-purple-300" />
              <span className="text-sm font-medium text-purple-100">Growth</span>
            </div>
            <p className="text-lg font-bold text-white">{businessMetrics.monthlyGrowth}%</p>
            <p className="text-xs text-purple-300">Monthly growth</p>
          </div>
        </div>
      </div>

      {/* Automation Center */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">🤖 Business Automation Center</h3>
            <p className="text-gray-600">AI works 24/7 so you don't have to</p>
          </div>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            Saving 33 hours/week
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {automationRules.map((rule) => (
            <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`rounded-lg p-2 ${
                    rule.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Bot className={`h-5 w-5 ${
                      rule.status === 'active' ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{rule.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Saves {rule.savings}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        rule.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rule.status === 'active' ? '● Active' : '○ Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced CEO Tools */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Advanced CEO Tools</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 rounded-lg p-2 mt-1">
                <Database className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Unlimited Data Storage</h4>
                <p className="text-sm text-gray-600">Store unlimited resumes, jobs, and candidate data with automatic backups</p>
                <div className="mt-2 text-xs text-purple-600 font-medium">✓ 1TB Cloud Storage</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 rounded-lg p-2 mt-1">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Global Job Database</h4>
                <p className="text-sm text-gray-600">Access 10M+ jobs from 50+ countries with real-time updates</p>
                <div className="mt-2 text-xs text-blue-600 font-medium">✓ 50+ Countries</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 rounded-lg p-2 mt-1">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Enterprise Security</h4>
                <p className="text-sm text-gray-600">Bank-level encryption, GDPR compliance, and data protection</p>
                <div className="mt-2 text-xs text-green-600 font-medium">✓ SOC2 Compliant</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 rounded-lg p-2 mt-1">
                <Zap className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">AI-Powered Lead Generation</h4>
                <p className="text-sm text-gray-600">AI finds and qualifies high-value clients automatically</p>
                <div className="mt-2 text-xs text-yellow-600 font-medium">✓ 100+ Leads/Month</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-red-100 rounded-lg p-2 mt-1">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Revenue Optimization</h4>
                <p className="text-sm text-gray-600">AI analyzes pricing, conversion, and suggests revenue improvements</p>
                <div className="mt-2 text-xs text-red-600 font-medium">✓ +23% Revenue</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 rounded-lg p-2 mt-1">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">24/7 AI Assistant</h4>
                <p className="text-sm text-gray-600">Your AI business assistant works around the clock</p>
                <div className="mt-2 text-xs text-indigo-600 font-medium">✓ Always Available</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-pink-100 rounded-lg p-2 mt-1">
                <Lightbulb className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Business Intelligence</h4>
                <p className="text-sm text-gray-600">Advanced analytics and insights for strategic decisions</p>
                <div className="mt-2 text-xs text-pink-600 font-medium">✓ Real-time Analytics</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 rounded-lg p-2 mt-1">
                <MessageSquare className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Priority CEO Support</h4>
                <p className="text-sm text-gray-600">Direct access to founders and engineers for immediate help</p>
                <div className="mt-2 text-xs text-orange-600 font-medium">✓ Less than 1hr Response</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-teal-100 rounded-lg p-2 mt-1">
                <Award className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">White-Label Rights</h4>
                <p className="text-sm text-gray-600">Rebrand and resell under your own company name</p>
                <div className="mt-2 text-xs text-teal-600 font-medium">✓ 100% Customizable</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Your Enterprise ROI</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Time Saved Weekly</p>
            <p className="text-2xl font-bold text-green-600">33 hours</p>
            <p className="text-xs text-gray-500">Worth $1,650/week</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Additional Revenue</p>
            <p className="text-2xl font-bold text-green-600">$2,480</p>
            <p className="text-xs text-gray-500">Monthly increase</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Enterprise Cost</p>
            <p className="text-2xl font-bold text-gray-600">$199</p>
            <p className="text-xs text-gray-500">Per month</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Net Profit</p>
            <p className="text-2xl font-bold text-green-600">$3,931</p>
            <p className="text-xs text-gray-500">Monthly ROI</p>
          </div>
        </div>
        
        <div className="mt-4 bg-green-100 rounded-lg p-3">
          <p className="text-sm text-green-800 font-medium">
            🎯 Your Enterprise investment generates $3,931 monthly profit - 1,976% ROI!
          </p>
        </div>
      </div>
    </div>
  )
}
