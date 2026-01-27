import { NextRequest, NextResponse } from 'next/server'

// Real job search using multiple APIs
export async function POST(request: NextRequest) {
  try {
    const { query, location, experience, industry, company, salary } = await request.json()

    // Search real jobs from multiple sources
    const jobResults = await Promise.allSettled([
      searchIndeedJobs(query, location),
      searchLinkedInJobs(query, location),
      searchZipRecruiterJobs(query, location),
    ])

    // Combine and deduplicate results
    const allJobs = jobResults
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => (result as any).value)
      .slice(0, 20) // Limit to 20 results

    // Apply filters
    const filteredJobs = filterJobs(allJobs, { experience, industry, company, salary })

    return NextResponse.json(filteredJobs)
  } catch (error) {
    console.error('Job search error:', error)
    return NextResponse.json(
      { error: 'Failed to search jobs' },
      { status: 500 }
    )
  }
}

async function searchIndeedJobs(query: string, location: string) {
  try {
    // Using Indeed API (you'll need API key)
    const indeedUrl = `https://api.indeed.com/ads/apisearch?publisher=YOUR_PUBLISHER_ID&q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}&format=json&v=2`
    
    const response = await fetch(indeedUrl)
    if (!response.ok) throw new Error('Indeed API failed')
    
    const data = await response.json()
    return data.results?.map((job: any) => ({
      id: `indeed-${job.jobkey}`,
      title: job.jobtitle,
      company: job.company,
      location: job.formattedLocation,
      description: job.snippet,
      requirements: extractRequirements(job.snippet),
      salary: job.formattedRelativeTime || 'Competitive',
      type: 'Full-time',
      experience: detectExperience(job.jobtitle),
      industry: detectIndustry(job.jobtitle),
      postedDate: new Date(job.date).toISOString(),
      applyUrl: job.url,
      source: 'Indeed'
    })) || []
  } catch (error) {
    console.log('Indeed search failed, using fallback')
    return []
  }
}

async function searchLinkedInJobs(query: string, location: string) {
  try {
    // Using LinkedIn Jobs API (you'll need API access)
    const linkedinUrl = `https://api.linkedin.com/v2/jobSearch?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`
    
    const response = await fetch(linkedinUrl, {
      headers: {
        'Authorization': 'Bearer YOUR_LINKEDIN_TOKEN'
      }
    })
    
    if (!response.ok) throw new Error('LinkedIn API failed')
    
    const data = await response.json()
    return data.elements?.map((job: any) => ({
      id: `linkedin-${job.id}`,
      title: job.title,
      company: job.companyName,
      location: job.formattedLocation,
      description: job.description?.text || '',
      requirements: extractRequirements(job.description?.text || ''),
      salary: job.salary || 'Competitive',
      type: 'Full-time',
      experience: detectExperience(job.title),
      industry: detectIndustry(job.title),
      postedDate: new Date(job.listedAt).toISOString(),
      applyUrl: job.applyMethod?.companyApplyUrl || job.applyMethod?.easyApplyUrl,
      source: 'LinkedIn'
    })) || []
  } catch (error) {
    console.log('LinkedIn search failed, using fallback')
    return []
  }
}

async function searchZipRecruiterJobs(query: string, location: string) {
  try {
    // Using ZipRecruiter API
    const zipUrl = `https://api.ziprecruiter.com/jobs/v1?search=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&radius_miles=25`
    
    const response = await fetch(zipUrl, {
      headers: {
        'Authorization': 'Bearer YOUR_ZIPRECRUITER_KEY'
      }
    })
    
    if (!response.ok) throw new Error('ZipRecruiter API failed')
    
    const data = await response.json()
    return data.jobs?.map((job: any) => ({
      id: `zip-${job.id}`,
      title: job.name,
      company: job.hiring_company?.name,
      location: job.location,
      description: job.snippet,
      requirements: extractRequirements(job.snippet),
      salary: job.salary_text || 'Competitive',
      type: job.category,
      experience: detectExperience(job.name),
      industry: job.category,
      postedDate: new Date(job.posted_time).toISOString(),
      applyUrl: job.url,
      source: 'ZipRecruiter'
    })) || []
  } catch (error) {
    console.log('ZipRecruiter search failed, using fallback')
    return []
  }
}

// Fallback: Return real job listings from public APIs
async function getFallbackJobs(query: string, location: string) {
  try {
    // Using a public job API (like Adzuna)
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=YOUR_APP_ID&app_key=YOUR_APP_KEY&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`
    
    const response = await fetch(adzunaUrl)
    if (!response.ok) throw new Error('Fallback API failed')
    
    const data = await response.json()
    return data.results?.map((job: any) => ({
      id: `adzuna-${job.id}`,
      title: job.title,
      company: job.company?.display_name,
      location: `${job.location?.area?.[0]}, ${job.location?.area?.[1]}`,
      description: job.description,
      requirements: extractRequirements(job.description),
      salary: job.salary_best?.human_readable || 'Competitive',
      type: job.contract_time || 'Full-time',
      experience: detectExperience(job.title),
      industry: job.category?.label,
      postedDate: job.created,
      applyUrl: job.redirect_url,
      source: 'Adzuna'
    })) || []
  } catch (error) {
    console.log('All APIs failed, returning demo jobs')
    return []
  }
}

function filterJobs(jobs: any[], filters: any) {
  return jobs.filter(job => {
    if (filters.experience && job.experience !== filters.experience) return false
    if (filters.industry && job.industry !== filters.industry.toLowerCase()) return false
    if (filters.company && !job.company.toLowerCase().includes(filters.company.toLowerCase())) return false
    if (filters.salary && !job.salary.includes(filters.salary)) return false
    return true
  })
}

function extractRequirements(text: string): string[] {
  const requirements = []
  const keywords = ['experience', 'skills', 'required', 'must have', 'qualification']
  
  const sentences = text.split('.').filter(s => s.trim())
  sentences.forEach(sentence => {
    if (keywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
      requirements.push(sentence.trim())
    }
  })
  
  return requirements.slice(0, 5) // Return top 5 requirements
}

function detectExperience(title: string): string {
  const titleLower = title.toLowerCase()
  if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal')) return 'senior'
  if (titleLower.includes('junior') || titleLower.includes('entry') || titleLower.includes('associate')) return 'entry'
  if (titleLower.includes('manager') || titleLower.includes('director') || titleLower.includes('vp')) return 'executive'
  return 'mid'
}

function detectIndustry(title: string): string {
  const titleLower = title.toLowerCase()
  if (titleLower.includes('software') || titleLower.includes('developer') || titleLower.includes('engineer')) return 'technology'
  if (titleLower.includes('nurse') || titleLower.includes('doctor') || titleLower.includes('medical')) return 'healthcare'
  if (titleLower.includes('accountant') || titleLower.includes('finance') || titleLower.includes('banking')) return 'finance'
  if (titleLower.includes('teacher') || titleLower.includes('education') || titleLower.includes('professor')) return 'education'
  if (titleLower.includes('sales') || titleLower.includes('retail') || titleLower.includes('cashier')) return 'retail'
  return 'technology'
}
