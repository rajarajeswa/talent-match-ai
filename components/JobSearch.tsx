'use client'

import { useState } from 'react'
import { Search, Filter, MapPin, Briefcase, DollarSign, Building } from 'lucide-react'
import { searchJobs } from '@/lib/jobService'
import { JobList } from './JobList'
import toast from 'react-hot-toast'

interface SearchFilters {
  query: string
  location: string
  experience: string
  industry: string
  company: string
  salary: string
  type: string  // Added this
  text: string  // Added this
}

export function JobSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    experience: '',
    industry: '',
    company: '',
    salary: ''
  })
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = async () => {
    if (!filters.query.trim()) {
      toast.error('Please enter a job title or keywords')
      return
    }

    setSearching(true)
    try {
      // Fast search (reduced delay)
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const results = await searchJobs(filters)
      setSearchResults(results)
      toast.success(`Found ${results.length} matching jobs`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to search jobs')
    } finally {
      setSearching(false)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Jobs</h2>
        <p className="text-gray-600">
          Find your perfect job with AI-powered matching and smart filters
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pl-10"
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          
          <button
            onClick={handleSearch}
            disabled={searching}
            className="btn-primary"
          >
            {searching ? 'Searching...' : 'Search Jobs'}
          </button>
        </div>

        {showFilters && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, State, or Remote"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="inline h-4 w-4 mr-1" />
                  Experience Level
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline h-4 w-4 mr-1" />
                  Industry
                </label>
                <select
                  value={filters.industry}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                  className="input-field"
                >
                  <option value="">All Industries</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline h-4 w-4 mr-1" />
                  Company
                </label>
                <input
                  type="text"
                  placeholder="Company name"
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Salary Range
                </label>
                <select
                  value={filters.salary}
                  onChange={(e) => handleFilterChange('salary', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any Salary</option>
                  <option value="0-50000">$0 - $50,000</option>
                  <option value="50000-75000">$50,000 - $75,000</option>
                  <option value="75000-100000">$75,000 - $100,000</option>
                  <option value="100000-150000">$100,000 - $150,000</option>
                  <option value="150000+">$150,000+</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {searchResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Search Results ({searchResults.length} jobs found)
          </h3>
          <JobList jobs={searchResults} />
        </div>
      )}
    </div>
  )
}
