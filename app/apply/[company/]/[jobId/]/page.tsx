'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ExternalLink, ArrowLeft } from 'lucide-react'

export default function ApplyPage({ params }: { params: { company: string; jobId: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [jobInfo, setJobInfo] = useState<any>(null)

  useEffect(() => {
    // Simulate job information retrieval
    setTimeout(() => {
      setJobInfo({
        title: 'Software Developer',
        company: params.company,
        location: 'San Francisco, CA',
        type: 'Full-time'
      })
      setLoading(false)
    }, 500)
  }, [params.company, params.jobId])

  const handleApplyRedirect = () => {
    // Redirect to Indeed jobs search with relevant keywords
    const searchQuery = encodeURIComponent('software developer jobs')
    window.location.href = `https://www.indeed.com/jobs?q=${searchQuery}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary-600 mx-auto animate-spin mb-4" />
          <p className="text-gray-600">Loading application page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Jobs</span>
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Apply for {jobInfo.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>{jobInfo.company}</span>
              <span>•</span>
              <span>{jobInfo.location}</span>
              <span>•</span>
              <span>{jobInfo.type}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Application Redirect
            </h2>
            <p className="text-blue-700 mb-4">
              You'll be redirected to Indeed where you can find and apply for similar positions. 
              Indeed has millions of real job listings from thousands of companies.
            </p>
            
            <button
              onClick={handleApplyRedirect}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <span>Continue to Indeed Jobs</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Why Indeed Jobs?</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Millions of active job listings</li>
                <li>• Direct company applications</li>
                <li>• Easy resume upload</li>
                <li>• Job alerts and tracking</li>
                <li>• Salary information</li>
                <li>• Company reviews</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Application Tips</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Update your resume</li>
                <li>• Tailor your application</li>
                <li>• Write a custom cover letter</li>
                <li>• Prepare for interviews</li>
                <li>• Follow up after applying</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              This redirect helps you find real job opportunities. 
              TalentMatch AI is not affiliated with Indeed but recommends it for job searching.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
