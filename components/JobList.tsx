'use client'

import { useState } from 'react'
import { ExternalLink, MapPin, DollarSign, Building, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  salary: string
  type: string
  experience: string
  industry: string
  postedDate: string
  applyUrl: string
  matchPercentage?: number
}

interface JobListProps {
  jobs: Job[]
  showMatches?: boolean
  showFilters?: boolean
  onFiltersChange?: (filters: any) => void
  onClearFilters?: () => void
}

export function JobList({ jobs = [], showMatches = false, showFilters = false, onFiltersChange, onClearFilters }: JobListProps) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    industry: '',
    company: '',
    salary: '',
    type: '',
    text: ''
  })

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId)
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    if (onFiltersChange) {
      onFiltersChange(newFilters)
    }
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      location: '',
      experience: '',
      industry: '',
      company: '',
      salary: '',
      type: '',
      text: ''
    }
    setFilters(clearedFilters)
    if (onClearFilters) {
      onClearFilters()
    }
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-600 bg-green-100'
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600">
          {showMatches 
            ? 'Upload your resume to get personalized job matches'
            : 'Try adjusting your search criteria or filters'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="font-medium text-gray-900 mb-3">Filters</h3>
          
          {/* Text Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Search
            </label>
            <input
              type="text"
              placeholder="Search in job titles, descriptions, or requirements..."
              value={filters.text}
              onChange={(e) => {
                const newFilters = { ...filters, text: e.target.value }
                setFilters(newFilters)
                if (onFiltersChange) {
                  onFiltersChange(newFilters)
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const newFilters = { ...filters, text: 'React' }
                setFilters(newFilters)
                if (onFiltersChange) onFiltersChange(newFilters)
              }}
              className="px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-medium"
            >
              React
            </button>
            <button
              onClick={() => {
                const newFilters = { ...filters, text: 'Python' }
                setFilters(newFilters)
                if (onFiltersChange) onFiltersChange(newFilters)
              }}
              className="px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-medium"
            >
              Python
            </button>
            <button
              onClick={() => {
                const newFilters = { ...filters, text: 'JavaScript' }
                setFilters(newFilters)
                if (onFiltersChange) onFiltersChange(newFilters)
              }}
              className="px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-medium"
            >
              JavaScript
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    {showMatches && job.matchPercentage && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.matchPercentage)}`}>
                        {job.matchPercentage}% Match
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatPostedDate(job.postedDate)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 line-clamp-2 mb-3">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {req}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        +{job.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <button
                    onClick={() => toggleJobExpansion(job.id)}
                    className="btn-secondary"
                  >
                    {expandedJob === job.id ? 'Hide Details' : 'View Details'}
                  </button>
                  
                  <a
                    href={`/apply?company=${encodeURIComponent(job.company)}&jobId=${job.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
              
              {expandedJob === job.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Job Description</h4>
                      <p className="text-gray-700">{job.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-primary-600 mt-1">•</span>
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Job Type</h5>
                        <p className="text-gray-600">{job.type}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Experience Level</h5>
                        <p className="text-gray-600 capitalize">{job.experience}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Industry</h5>
                        <p className="text-gray-600 capitalize">{job.industry}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Posted</h5>
                        <p className="text-gray-600">{formatPostedDate(job.postedDate)}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <a
                        href={`/apply?company=${encodeURIComponent(job.company)}&jobId=${job.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full flex items-center justify-center space-x-2"
                      >
                        <span>Apply for {job.title} at {job.company}</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
