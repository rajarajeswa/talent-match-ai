'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Upload, FileText, Search, Filter, TrendingUp, Crown, Users, BarChart3 } from 'lucide-react'
import { ResumeUpload } from '@/components/ResumeUpload'
import { AIJobRecommendations } from '@/components/AIJobRecommendations'
import { JobList } from '@/components/JobList'
import { StatsCards } from '@/components/StatsCards'
import { getJobMatches } from '@/lib/jobService'
import { Pricing } from '@/components/Pricing'
import { TrialStatus } from '@/components/TrialStatus'
import { BusinessAutomation } from '@/components/BusinessAutomation'
import { UserAnalytics } from '@/components/UserAnalytics'

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'upload' | 'search' | 'matches' | 'business' | 'analytics' | 'pricing'>('upload')
  const [matchedJobs, setMatchedJobs] = useState<any[]>([])
  const [resumeData, setResumeData] = useState<any>(null)
  const [isEnterprise, setIsEnterprise] = useState(false)

  useEffect(() => {
    // Check if user has any trial or subscription
    const enterpriseTrial = localStorage.getItem('enterpriseTrial')
    const professionalTrial = localStorage.getItem('professionalTrial')
    const premiumTrial = localStorage.getItem('premiumTrial')
    
    if (enterpriseTrial || professionalTrial || premiumTrial) {
      setIsEnterprise(true)
    }
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your dashboard</h1>
        </div>
      </div>
    )
  }

  const handleJobsFound = (jobs: any[]) => {
    setMatchedJobs(jobs)
  }

  const handleResumeParsed = (parsedData: any) => {
    setResumeData(parsedData)
  }

  const handleTabChange = (tab: 'search' | 'matches') => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.displayName || 'Job Seeker'}!
          </h1>
          <p className="text-gray-600">
            Find your perfect job match with AI-powered recommendations
          </p>
        </div>

        <StatsCards />

        <TrialStatus />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Resume</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('search')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'search'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>AI Job Recommendations</span>
                  {matchedJobs.length > 0 && (
                    <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-medium">
                      {matchedJobs.length}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('matches')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'matches'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Your Matches</span>
                  {matchedJobs.length > 0 && (
                    <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-medium">
                      {matchedJobs.length}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('business')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'business'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Business</span>
                  {isEnterprise && (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                      PRO
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('pricing')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pricing'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Crown className="h-4 w-4" />
                  <span>Enterprise</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'upload' && (
              <ResumeUpload 
                onJobsFound={handleJobsFound}
                onActiveTabChange={handleTabChange}
                onResumeParsed={handleResumeParsed}
              />
            )}
            {activeTab === 'search' && (
              <AIJobRecommendations resumeData={resumeData} matchedJobs={matchedJobs} />
            )}
            {activeTab === 'matches' && (
              <JobList 
                jobs={matchedJobs} 
                showMatches={true} 
                showFilters={true}
                onFiltersChange={(filters) => {
                  // Apply filters to matched jobs
                  const filteredJobs = matchedJobs.filter(job => {
                    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false
                    if (filters.experience && job.experience !== filters.experience) return false
                    if (filters.industry && job.industry !== filters.industry.toLowerCase()) return false
                    if (filters.company && !job.company.toLowerCase().includes(filters.company.toLowerCase())) return false
                    if (filters.salary && !job.salary.includes(filters.salary)) return false
                    if (filters.type && job.type !== filters.type) return false
                    return true
                  })
                  setMatchedJobs(filteredJobs)
                }}
                onClearFilters={() => {
                  // Reset to original matched jobs
                  if (resumeData) {
                    getJobMatches(resumeData).then(setMatchedJobs)
                  }
                }}
              />
            )}
            {activeTab === 'business' && (
              isEnterprise ? (
                <BusinessAutomation />
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <Crown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Feature</h3>
                  <p className="text-gray-600 mb-4">
                    Business automation and CEO tools are available with Enterprise plan. Upgrade to unlock features that grow your business.
                  </p>
                  <button
                    onClick={() => setActiveTab('pricing')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Upgrade to Enterprise
                  </button>
                </div>
              )
            )}
            {activeTab === 'pricing' && (
              <Pricing />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
