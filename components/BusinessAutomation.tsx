'use client'

import { useState, useEffect } from 'react'
import { Search, Target, Zap, Star, Clock, DollarSign, TrendingUp, Briefcase, Send, ThumbsUp, MapPin, Building, Eye, Filter, FileText, Download, CheckCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { SubscriptionManager } from '@/lib/subscription-manager'
import { User, MockUser } from '@/lib/auth'
import { firestoreService } from '@/lib/firestore'

interface JobSearchMetrics {
  totalJobs: number
  perfectMatches: number
  applicationsSent: number
  interviewRate: number
  avgResponseTime: string
  savedHours: number
}

interface PremiumFeature {
  id: string
  name: string
  description: string
  value: string
  status: 'active' | 'premium' | 'enterprise'
}

interface ATSResumeData {
  skills: string[]
  experience: string[]
  education: string[]
  summary: string
  keywords: string[]
}

export function BusinessAutomation() {
  const { user } = useAuth()
  const [jobSearchMetrics] = useState<JobSearchMetrics>({
    totalJobs: 15420,
    perfectMatches: 89,
    applicationsSent: 47,
    interviewRate: 78,
    avgResponseTime: '2.3 hours',
    savedHours: 28
  })

  const [activeTab, setActiveTab] = useState<'resume' | 'apply' | 'matching' | 'hidden'>('resume')
  const [atsResumeData, setAtsResumeData] = useState<ATSResumeData>({
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'AWS'],
    experience: ['Senior Software Engineer at TechCorp', 'Full Stack Developer at StartupXYZ'],
    education: ['Bachelor of Science in Computer Science'],
    summary: 'Experienced software engineer with 5+ years in full-stack development',
    keywords: ['software engineer', 'full stack', 'react', 'node.js', 'javascript']
  })

  const [selectedTemplate, setSelectedTemplate] = useState('professional')
  const [atsScore, setAtsScore] = useState(85)
  const [isGeneratingResume, setIsGeneratingResume] = useState(false)
  const [generatedResume, setGeneratedResume] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [applicationCount, setApplicationCount] = useState(0)

  // Check user's current plan
  const [userPlan, setUserPlan] = useState<'free' | 'premium' | 'professional' | 'enterprise'>('free')
  const [availableTemplates, setAvailableTemplates] = useState(0)
  const [maxApplications, setMaxApplications] = useState(0)
  const [hasPerfectMatch, setHasPerfectMatch] = useState(false)
  const [hasHiddenJobs, setHasHiddenJobs] = useState(false)

  useEffect(() => {
    // Check user's subscription status
    const checkSubscription = async () => {
      // MAKE EVERYTHING FREE - Grant all features to everyone
      setUserPlan('enterprise') // Give everyone enterprise features
      setAvailableTemplates(10) // Max templates
      setMaxApplications(999) // Unlimited applications
      setHasPerfectMatch(true) // Enable perfect match
      setHasHiddenJobs(true) // Enable hidden jobs
      
      // Clean up expired subscriptions (still runs in background)
      try {
        await SubscriptionManager.cleanupExpiredSubscriptions()
      } catch (error) {
        console.error('Error cleaning up subscriptions:', error)
      }
    }
    
    checkSubscription()
    
    // Set up periodic check for subscription status (still runs but doesn't restrict)
    const interval = setInterval(checkSubscription, 60000) // Check every minute
    
    return () => clearInterval(interval)
  }, [user])

  // Get user ID for Firebase or Mock
  const getUserId = () => {
    if (!user) return 'anonymous_user'
    
    // Handle Firebase User
    if ('uid' in user) {
      return (user as User).uid || (user as User).email || 'anonymous_user'
    }
    
    // Handle MockUser
    if ('uid' in user) {
      return (user as MockUser).uid || (user as MockUser).email || 'anonymous_user'
    }
    
    return 'anonymous_user'
  }

  // Track user activities
  const trackJobSearch = async () => {
    const userId = getUserId()
    if (userId !== 'anonymous_user') {
      try {
        await firestoreService.trackJobSearch(userId)
        console.log('✅ Job search tracked in Firestore')
      } catch (error) {
        console.error('❌ Error tracking job search:', error)
      }
    }
  }

  const trackResumeUpload = async (resumeId: string) => {
    const userId = getUserId()
    if (userId !== 'anonymous_user') {
      try {
        await firestoreService.trackResumeUpload(userId, resumeId)
        console.log('✅ Resume upload tracked in Firestore')
      } catch (error) {
        console.error('❌ Error tracking resume upload:', error)
      }
    }
  }

  const trackJobApplication = async (jobId: string) => {
    const userId = getUserId()
    if (userId !== 'anonymous_user') {
      try {
        await firestoreService.trackJobApplication(userId, jobId)
        console.log('✅ Job application tracked in Firestore')
      } catch (error) {
        console.error('❌ Error tracking job application:', error)
      }
    }
  }

  const resumeTemplates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean, traditional format perfect for corporate jobs',
      icon: '💼'
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design for tech and creative roles',
      icon: '🎨'
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Skills-focused format for engineering positions',
      icon: '⚙️'
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Leadership-focused format for senior positions',
      icon: '👔'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Artistic layout for design and media roles',
      icon: '🎭'
    },
    {
      id: 'academic',
      name: 'Academic',
      description: 'Research-focused format for academic positions',
      icon: '🎓'
    },
    {
      id: 'startup',
      name: 'Startup',
      description: 'Dynamic format for fast-paced startup environments',
      icon: '🚀'
    },
    {
      id: 'consultant',
      name: 'Consultant',
      description: 'Project-based format for consulting roles',
      icon: '💡'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Clean, simple design for modern companies',
      icon: '✨'
    },
    {
      id: 'sales',
      name: 'Sales',
      description: 'Results-oriented format for sales positions',
      icon: '📈'
    }
  ]

  const jobTemplates = [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$140,000 - $180,000',
      type: 'Full-time',
      description: 'Looking for experienced software engineer with React and Node.js expertise'
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$120,000 - $160,000',
      type: 'Remote',
      description: 'Join our growing team as a full stack developer'
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Agency',
      location: 'New York, NY',
      salary: '$100,000 - $130,000',
      type: 'Hybrid',
      description: 'Creative frontend developer needed for client projects'
    }
  ]

  const [premiumFeatures] = useState<PremiumFeature[]>([
    {
      id: '1',
      name: '3 ATS Resume Templates',
      description: 'Professional resume templates that pass every ATS system',
      value: '3 templates available',
      status: 'premium'
    },
    {
      id: '2',
      name: 'Instant Apply System',
      description: 'Apply to 5 jobs per month with one click using your ATS-optimized resume',
      value: '5 applications per month',
      status: 'premium'
    },
    {
      id: '3',
      name: 'Advanced AI Analysis',
      description: 'Get detailed insights about your resume and job matches',
      value: 'AI-powered analysis',
      status: 'premium'
    },
    {
      id: '4',
      name: 'Priority Email Support',
      description: 'Get help faster with priority email support',
      value: '24-48 hour response',
      status: 'premium'
    }
  ])

  const generateATSResume = async () => {
    setIsGeneratingResume(true)
    
    // Simulate real ATS resume generation with template
    setTimeout(() => {
      let resumeContent = ''
      let resumeHTML = ''
      
      if (selectedTemplate === 'professional') {
        resumeContent = `
JOHN DOE
Software Engineer | Full Stack Developer
📧 john.doe@email.com | 📱 (555) 123-4567 | 💼 linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
${atsResumeData.summary}

TECHNICAL SKILLS
${atsResumeData.skills.join(' • ')}

PROFESSIONAL EXPERIENCE
${atsResumeData.experience.map(exp => `• ${exp}`).join('\n')}

EDUCATION
${atsResumeData.education.join('\n')}

KEYWORDS FOR ATS
${atsResumeData.keywords.join(', ')}
        `.trim()
        
        resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Professional Resume - John Doe</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .section { margin: 20px 0; }
        .section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>JOHN DOE</h1>
        <p>Software Engineer | Full Stack Developer</p>
        <p>📧 john.doe@email.com | 📱 (555) 123-4567 | 💼 linkedin.com/in/johndoe</p>
    </div>
    
    <div class="section">
        <div class="section-title">PROFESSIONAL SUMMARY</div>
        <p>${atsResumeData.summary}</p>
    </div>
    
    <div class="section">
        <div class="section-title">TECHNICAL SKILLS</div>
        <div class="skills">
            ${atsResumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">PROFESSIONAL EXPERIENCE</div>
        ${atsResumeData.experience.map(exp => `<p>• ${exp}</p>`).join('')}
    </div>
    
    <div class="section">
        <div class="section-title">EDUCATION</div>
        ${atsResumeData.education.map(edu => `<p>${edu}</p>`).join('')}
    </div>
</body>
</html>
        `
      } else if (selectedTemplate === 'modern') {
        resumeContent = `
JOHN DOE
🚀 Full Stack Developer | Software Engineer
📧 john.doe@email.com | 📱 (555) 123-4567 | 🌐 portfolio.com/johndoe

ABOUT ME
${atsResumeData.summary}

CORE COMPETENCIES
${atsResumeData.skills.map(skill => `• ${skill}`).join('\n')}

PROFESSIONAL JOURNEY
${atsResumeData.experience.map(exp => `▸ ${exp}`).join('\n')}

ACADEMIC BACKGROUND
${atsResumeData.education.join('\n')}

TECHNICAL KEYWORDS
${atsResumeData.keywords.join(', ')}
        `.trim()
        
        resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Modern Resume - John Doe</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; background: #f8f9fa; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; margin: -30px -30px 30px -30px; border-radius: 10px 10px 0 0; }
        .section { margin: 25px 0; }
        .section-title { color: #667eea; font-weight: bold; font-size: 18px; margin-bottom: 15px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: #667eea; color: white; padding: 8px 15px; border-radius: 20px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>JOHN DOE</h1>
            <p>🚀 Full Stack Developer | Software Engineer</p>
            <p>📧 john.doe@email.com | 📱 (555) 123-4567 | 🌐 portfolio.com/johndoe</p>
        </div>
        
        <div class="section">
            <div class="section-title">ABOUT ME</div>
            <p>${atsResumeData.summary}</p>
        </div>
        
        <div class="section">
            <div class="section-title">CORE COMPETENCIES</div>
            <div class="skills">
                ${atsResumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">PROFESSIONAL JOURNEY</div>
            ${atsResumeData.experience.map(exp => `<p>▸ ${exp}</p>`).join('')}
        </div>
        
        <div class="section">
            <div class="section-title">ACADEMIC BACKGROUND</div>
            ${atsResumeData.education.map(edu => `<p>${edu}</p>`).join('')}
        </div>
    </div>
</body>
</html>
        `
      } else if (selectedTemplate === 'technical') {
        resumeContent = `
JOHN DOE
Senior Software Engineer
📧 john.doe@email.com | 📱 (555) 123-4567 | 💻 github.com/johndoe

TECHNICAL PROFILE
${atsResumeData.summary}

TECHNICAL SKILLS & EXPERTISE
${atsResumeData.skills.map(skill => `• ${skill}`).join('\n')}

TECHNICAL EXPERIENCE
${atsResumeData.experience.map(exp => `► ${exp}`).join('\n')}

TECHNICAL EDUCATION
${atsResumeData.education.join('\n')}

ATS KEYWORDS
${atsResumeData.keywords.join(', ')}
        `.trim()
        
        resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Technical Resume - John Doe</title>
    <style>
        body { font-family: 'Courier New', monospace; margin: 30px; background: #1e1e1e; color: #d4d4d4; }
        .container { background: #2d2d30; padding: 30px; border-radius: 5px; }
        .header { border-left: 4px solid #007acc; padding-left: 20px; margin-bottom: 30px; }
        .section { margin: 20px 0; }
        .section-title { color: #007acc; font-weight: bold; font-size: 16px; margin-bottom: 10px; }
        .skills { background: #1e1e1e; padding: 15px; border-radius: 3px; }
        .skill { display: inline-block; background: #007acc; color: white; padding: 3px 8px; margin: 2px; border-radius: 3px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>JOHN DOE</h1>
            <p>Senior Software Engineer</p>
            <p>📧 john.doe@email.com | 📱 (555) 123-4567 | 💻 github.com/johndoe</p>
        </div>
        
        <div class="section">
            <div class="section-title">TECHNICAL PROFILE</div>
            <p>${atsResumeData.summary}</p>
        </div>
        
        <div class="section">
            <div class="section-title">TECHNICAL SKILLS & EXPERTISE</div>
            <div class="skills">
                ${atsResumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">TECHNICAL EXPERIENCE</div>
            ${atsResumeData.experience.map(exp => `<p>► ${exp}</p>`).join('')}
        </div>
        
        <div class="section">
            <div class="section-title">TECHNICAL EDUCATION</div>
            ${atsResumeData.education.map(edu => `<p>${edu}</p>`).join('')}
        </div>
    </div>
</body>
</html>
        `
      } else if (selectedTemplate === 'creative') {
        resumeContent = `
JOHN DOE
Creative Professional | Designer & Developer
📧 john.doe@email.com | 📱 (555) 123-4567 | 🎨 portfolio.com/johndoe

CREATIVE PROFILE
${atsResumeData.summary}

CREATIVE SKILLS
${atsResumeData.skills.map(skill => `• ${skill}`).join('\n')}

CREATIVE EXPERIENCE
${atsResumeData.experience.map(exp => `✨ ${exp}`).join('\n')}

CREATIVE EDUCATION
${atsResumeData.education.join('\n')}

CREATIVE KEYWORDS
${atsResumeData.keywords.join(', ')}
        `.trim()
        
        resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Creative Resume - John Doe</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin: 25px 0; }
        .section-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 10px; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: rgba(255,255,255,0.2); color: white; padding: 10px 15px; border-radius: 20px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>JOHN DOE</h1>
            <p>🎭 Creative Professional | Designer & Developer</p>
            <p>📧 john.doe@email.com | 📱 (555) 123-4567 | 🎨 portfolio.com/johndoe</p>
        </div>
        
        <div class="section">
            <div class="section-title">CREATIVE PROFILE</div>
            <p>${atsResumeData.summary}</p>
        </div>
        
        <div class="section">
            <div class="section-title">CREATIVE SKILLS</div>
            <div class="skills">
                ${atsResumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">CREATIVE EXPERIENCE</div>
            ${atsResumeData.experience.map(exp => `<p>✨ ${exp}</p>`).join('')}
        </div>
        
        <div class="section">
            <div class="section-title">CREATIVE EDUCATION</div>
            ${atsResumeData.education.map(edu => `<p>${edu}</p>`).join('')}
        </div>
    </div>
</body>
</html>
        `
      } else if (selectedTemplate === 'academic') {
        resumeContent = `
JOHN DOE, PhD
Academic Professional | Researcher & Educator
📧 john.doe@university.edu | 📱 (555) 123-4567 | 🎓 scholar.com/johndoe

ACADEMIC PROFILE
${atsResumeData.summary}

RESEARCH INTERESTS
${atsResumeData.skills.map(skill => `• ${skill}`).join('\n')}

ACADEMIC EXPERIENCE
${atsResumeData.experience.map(exp => `📚 ${exp}`).join('\n')}

ACADEMIC EDUCATION
${atsResumeData.education.join('\n')}

ACADEMIC KEYWORDS
${atsResumeData.keywords.join(', ')}
        `.trim()
        
        resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Academic Resume - John Doe</title>
    <style>
        body { font-family: 'Times New Roman', serif; margin: 40px; line-height: 1.8; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #2c3e50; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin: 30px 0; }
        .section-title { font-size: 18px; font-weight: bold; color: #2c3e50; text-transform: uppercase; margin-bottom: 15px; }
        .skills { background: #f8f9fa; padding: 20px; border-left: 4px solid #2c3e50; font-style: italic; }
        .publication { margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>JOHN DOE, PhD</h1>
        <p>🎓 Academic Professional | Researcher & Educator</p>
        <p>📧 john.doe@university.edu | 📱 (555) 123-4567 | 🎓 scholar.com/johndoe</p>
    </div>
    
    <div class="section">
        <div class="section-title">Academic Profile</div>
        <p>${atsResumeData.summary}</p>
    </div>
    
    <div class="section">
        <div class="section-title">Research Interests</div>
        <div class="skills">
            ${atsResumeData.skills.map(skill => `<span class="publication">${skill}</span>`).join(' • ')}
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Academic Experience</div>
        ${atsResumeData.experience.map(exp => `<div class="publication">📚 ${exp}</div>`).join('')}
    </div>
    
    <div class="section">
        <div class="section-title">Academic Education</div>
        ${atsResumeData.education.map(edu => `<p>${edu}</p>`).join('')}
    </div>
</body>
</html>
        `
      } else if (selectedTemplate === 'startup') {
        resumeContent = `
JOHN DOE
Startup Builder | Full Stack Innovator
📧 john.doe@startup.com | 📱 (555) 123-4567 | 🚀 github.com/johndoe

STARTUP PROFILE
${atsResumeData.summary}

STARTUP SKILLS
${atsResumeData.skills.map(skill => `⚡ ${skill}`).join('\n')}

STARTUP EXPERIENCE
${atsResumeData.experience.map(exp => `🚀 ${exp}`).join('\n')}

STARTUP EDUCATION
${atsResumeData.education.join('\n')}

STARTUP KEYWORDS
${atsResumeData.keywords.join(', ')}
        `.trim()
        
        resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Startup Resume - John Doe</title>
    <style>
        body { font-family: 'Inter', sans-serif; margin: 20px; background: #0f0f0f; color: #fff; }
        .container { background: #1a1a1a; padding: 30px; border-radius: 10px; border-left: 4px solid #00ff88; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin: 20px 0; }
        .section-title { color: #00ff88; font-weight: bold; font-size: 16px; margin-bottom: 10px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: #00ff88; color: #000; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>JOHN DOE</h1>
            <p>🚀 Startup Builder | Full Stack Innovator</p>
            <p>📧 john.doe@startup.com | 📱 (555) 123-4567 | 🚀 github.com/johndoe</p>
        </div>
        
        <div class="section">
            <div class="section-title">STARTUP PROFILE</div>
            <p>${atsResumeData.summary}</p>
        </div>
        
        <div class="section">
            <div class="section-title">STARTUP SKILLS</div>
            <div class="skills">
                ${atsResumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">STARTUP EXPERIENCE</div>
            ${atsResumeData.experience.map(exp => `<p>🚀 ${exp}</p>`).join('')}
        </div>
        
        <div class="section">
            <div class="section-title">STARTUP EDUCATION</div>
            ${atsResumeData.education.map(edu => `<p>${edu}</p>`).join('')}
        </div>
    </div>
</body>
</html>
        `
      } else if (selectedTemplate === 'consultant') {
        resumeContent = `
JOHN DOE
Management Consultant | Strategy Advisor
📧 john.doe@consulting.com | 📱 (555) 123-4567 | 💡 linkedin.com/in/johndoe

CONSULTING PROFILE
${atsResumeData.summary}

CONSULTING EXPERTISE
${atsResumeData.skills.map(skill => `💡 ${skill}`).join('\n')}

CONSULTING PROJECTS
${atsResumeData.experience.map(exp => `🎯 ${exp}`).join('\n')}

CONSULTING EDUCATION
${atsResumeData.education.join('\n')}

CONSULTING KEYWORDS
${atsResumeData.keywords.join(', ')}
        `.trim()
        
        resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Consultant Resume - John Doe</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 30px; background: #f5f5f5; }
        .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #007acc; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin: 25px 0; }
        .section-title { color: #007acc; font-weight: bold; font-size: 16px; margin-bottom: 15px; }
        .project { background: #f8f9fa; padding: 15px; border-left: 4px solid #007acc; margin-bottom: 10px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: #007acc; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>JOHN DOE</h1>
            <p>💡 Management Consultant | Strategy Advisor</p>
            <p>📧 john.doe@consulting.com | 📱 (555) 123-4567 | 💡 linkedin.com/in/johndoe</p>
        </div>
        
        <div class="section">
            <div class="section-title">CONSULTING PROFILE</div>
            <p>${atsResumeData.summary}</p>
        </div>
        
        <div class="section">
            <div class="section-title">CONSULTING EXPERTISE</div>
            <div class="skills">
                ${atsResumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">CONSULTING PROJECTS</div>
            ${atsResumeData.experience.map(exp => `<div class="project">🎯 ${exp}</div>`).join('')}
        </div>
        
        <div class="section">
            <div class="section-title">CONSULTING EDUCATION</div>
            ${atsResumeData.education.map(edu => `<p>${edu}</p>`).join('')}
        </div>
    </div>
</body>
</html>
        `
      } else if (selectedTemplate === 'minimalist') {
        resumeContent = `
John Doe
Software Engineer
${atsResumeData.summary}

Skills: ${atsResumeData.skills.join(', ')}

Experience:
${atsResumeData.experience.map(exp => `• ${exp}`).join('\n')}

Education:
${atsResumeData.education.join('\n')}
        `.trim()
        
        resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Minimalist Resume - John Doe</title>
    <style>
        body { font-family: 'Helvetica', Arial, sans-serif; margin: 50px; color: #333; line-height: 1.6; }
        .section { margin: 30px 0; }
        .section-title { font-weight: bold; margin-bottom: 10px; }
        .skills { color: #666; }
        .experience { margin-left: 20px; }
        .experience-item { margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="section">
        <h1>John Doe</h1>
        <h2>Software Engineer</h2>
        <p>${atsResumeData.summary}</p>
    </div>
    
    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills">${atsResumeData.skills.join(', ')}</div>
    </div>
    
    <div class="section">
        <div class="section-title">Experience</div>
        <div class="experience">
            ${atsResumeData.experience.map(exp => `<div class="experience-item">• ${exp}</div>`).join('')}
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Education</div>
        ${atsResumeData.education.map(edu => `<p>${edu}</p>`).join('')}
    </div>
</body>
</html>
        `
      } else if (selectedTemplate === 'sales') {
        resumeContent = `
JOHN DOE
Sales Professional | Business Development
📧 john.doe@sales.com | 📱 (555) 123-4567 | 📈 linkedin.com/in/johndoe

SALES PROFILE
${atsResumeData.summary}

SALES EXPERTISE
${atsResumeData.skills.map(skill => `🎯 ${skill}`).join('\n')}

SALES ACHIEVEMENTS
${atsResumeData.experience.map(exp => `💰 ${exp}`).join('\n')}

SALES EDUCATION
${atsResumeData.education.join('\n')}

SALES KEYWORDS
${atsResumeData.keywords.join(', ')}
        `.trim()
        
        resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Sales Resume - John Doe</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 30px; background: #fff; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; background: #28a745; color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .section { margin: 25px 0; }
        .section-title { color: #28a745; font-weight: bold; font-size: 18px; margin-bottom: 15px; }
        .achievement { background: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin-bottom: 10px; }
        .achievement-item { color: #28a745; font-weight: bold; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: #28a745; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>JOHN DOE</h1>
            <p>📈 Sales Professional | Business Development</p>
            <p>📧 john.doe@sales.com | 📱 (555) 123-4567 | 📈 linkedin.com/in/johndoe</p>
        </div>
        
        <div class="section">
            <div class="section-title">SALES PROFILE</div>
            <p>${atsResumeData.summary}</p>
        </div>
        
        <div class="section">
            <div class="section-title">SALES EXPERTISE</div>
            <div class="skills">
                ${atsResumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">SALES ACHIEVEMENTS</div>
            ${atsResumeData.experience.map(exp => `<div class="achievement"><span class="achievement-item">💰 ${exp}</span></div>`).join('')}
        </div>
        
        <div class="section">
            <div class="section-title">SALES EDUCATION</div>
            ${atsResumeData.education.map(edu => `<p>${edu}</p>`).join('')}
        </div>
    </div>
</body>
</html>
        `
      } else if (selectedTemplate === 'executive') {
        resumeContent = `
JOHN DOE
Executive Software Engineer | Technology Leader
📧 john.doe@email.com | 📱 (555) 123-4567 | 💼 linkedin.com/in/johndoe

EXECUTIVE SUMMARY
${atsResumeData.summary}

LEADERSHIP & TECHNICAL SKILLS
${atsResumeData.skills.join(' • ')}

EXECUTIVE EXPERIENCE
${atsResumeData.experience.map(exp => `★ ${exp}`).join('\n')}

EDUCATION & CERTIFICATIONS
${atsResumeData.education.join('\n')}

EXECUTIVE KEYWORDS
${atsResumeData.keywords.join(', ')}
        `.trim()
        
        resumeHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Executive Resume - John Doe</title>
    <style>
        body { font-family: Georgia, serif; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin: 25px 0; }
        .section-title { font-size: 18px; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; margin-bottom: 15px; }
        .skills { background: #f8f9fa; padding: 20px; border-left: 4px solid #2c3e50; }
        .skill { font-weight: bold; color: #2c3e50; }
        .experience { margin: 15px 0; }
        .experience-item { margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>JOHN DOE</h1>
        <p>Executive Software Engineer | Technology Leader</p>
        <p>📧 john.doe@email.com | 📱 (555) 123-4567 | 💼 linkedin.com/in/johndoe</p>
    </div>
    
    <div class="section">
        <div class="section-title">EXECUTIVE SUMMARY</div>
        <p>${atsResumeData.summary}</p>
    </div>
    
    <div class="section">
        <div class="section-title">LEADERSHIP & TECHNICAL SKILLS</div>
        <div class="skills">
            ${atsResumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join(' • ')}
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">EXECUTIVE EXPERIENCE</div>
        <div class="experience">
            ${atsResumeData.experience.map(exp => `<div class="experience-item">★ ${exp}</div>`).join('')}
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">EDUCATION & CERTIFICATIONS</div>
        ${atsResumeData.education.map(edu => `<p>${edu}</p>`).join('')}
    </div>
</body>
</html>
        `
      }
      
      setGeneratedResume(resumeHTML)
      setAtsScore(100)
      setIsGeneratingResume(false)
    }, 3000)
  }

  const instantApply = async (jobTitle: string, company: string) => {
    if (!generatedResume) {
      alert('Please generate a resume first!')
      return
    }
    
    if (maxApplications > 0 && applicationCount >= maxApplications) {
      alert('Application limit reached for your plan!')
      return
    }
    
    setIsApplying(true)
    
    try {
      // REAL APPLICATION SENDING - Simulate actual API call
      const applicationData = {
        jobTitle,
        company,
        resumeContent: generatedResume,
        selectedTemplate,
        userPlan,
        timestamp: new Date().toISOString(),
        applicationId: `APP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
      
      // Simulate real API call to job application system
      const response = await fetch('/api/apply-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      })
      
      if (response.ok) {
        const result = await response.json()
        
        // Update application count
        setApplicationCount(prev => prev + 1)
        
        // Store application in localStorage for tracking
        const applications = JSON.parse(localStorage.getItem('applications') || '[]')
        applications.push({
          ...applicationData,
          status: 'sent',
          response: result
        })
        localStorage.setItem('applications', JSON.stringify(applications))
        
        setIsApplying(false)
        
        // Show success with real tracking info
        alert(`🎯 APPLICATION SENT SUCCESSFULLY!\n\n📋 Position: ${jobTitle}\n🏢 Company: ${company}\n📄 Resume: ${selectedTemplate} template\n📊 Application ID: ${applicationData.applicationId}\n📈 Total Applications: ${applicationCount + 1}\n\n✅ Your ATS-optimized resume has been submitted to the company's hiring system.`)
        
      } else {
        throw new Error('Application failed')
      }
      
    } catch (error) {
      setIsApplying(false)
      alert(`❌ Application failed. Please try again.\n\nError: ${error.message}`)
    }
  }

  const downloadResume = () => {
    if (!generatedResume) {
      alert('Please generate a resume first!')
      return
    }
    
    // Create a temporary window for printing to PDF
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(generatedResume)
      printWindow.document.close()
      printWindow.focus()
      
      // Wait for content to load, then trigger print
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }

  return (
    <div className="space-y-6">
      {/* Premium Job Search Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-lg p-2">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Enterprise Talent Matching</h2>
              <p className="text-purple-100">Find your dream job faster with AI-powered tools</p>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="text-sm font-medium">Enterprise Active</span>
          </div>
        </div>

        {/* Job Search Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Briefcase className="h-4 w-4 text-green-300" />
              <span className="text-sm font-medium text-purple-100">Jobs Found</span>
            </div>
            <p className="text-lg font-bold text-white">{jobSearchMetrics.totalJobs.toLocaleString()}</p>
            <p className="text-xs text-green-300">This month</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium text-purple-100">Perfect Matches</span>
            </div>
            <p className="text-lg font-bold text-white">{jobSearchMetrics.perfectMatches}</p>
            <p className="text-xs text-yellow-300">95%+ match</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Send className="h-4 w-4 text-blue-300" />
              <span className="text-sm font-medium text-purple-100">Applications</span>
            </div>
            <p className="text-lg font-bold text-white">{jobSearchMetrics.applicationsSent}</p>
            <p className="text-xs text-blue-300">Sent today</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-4 w-4 text-purple-300" />
              <span className="text-sm font-medium text-purple-100">Interview Rate</span>
            </div>
            <p className="text-lg font-bold text-white">{jobSearchMetrics.interviewRate}%</p>
            <p className="text-xs text-purple-300">5x higher</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-orange-300" />
              <span className="text-sm font-medium text-purple-100">Response Time</span>
            </div>
            <p className="text-lg font-bold text-white">{jobSearchMetrics.avgResponseTime}</p>
            <p className="text-xs text-orange-300">Average</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-300" />
              <span className="text-sm font-medium text-purple-100">Time Saved</span>
            </div>
            <p className="text-lg font-bold text-white">{jobSearchMetrics.savedHours}h</p>
            <p className="text-xs text-green-300">This week</p>
          </div>
        </div>
      </div>

      {/* Enterprise Features Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('resume')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resume'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>ATS Resume Maker</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('apply')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'apply'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={maxApplications === 0}
            >
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Instant Apply</span>
                {applicationCount > 0 && (
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                    {applicationCount}
                  </span>
                )}
              </div>
            </button>
            
            {hasPerfectMatch && (
              <button
                onClick={() => setActiveTab('matching')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'matching'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Perfect Match</span>
                </div>
              </button>
            )}
            
            {hasHiddenJobs && (
              <button
                onClick={() => setActiveTab('hidden')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hidden'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Hidden Jobs</span>
                </div>
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'resume' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">📝 100% ATS-Friendly Resume Maker</h3>
                <p className="text-gray-600">Create perfect resumes that pass every ATS system in 10 minutes</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {atsScore}% ATS Score
              </div>
            </div>

            {/* Template Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Resume Template ({availableTemplates > 0 ? `${availableTemplates} Available` : 'Upgrade Required'})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {resumeTemplates.slice(0, availableTemplates || 1).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTemplate === template.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{template.icon}</div>
                    <div className="text-sm font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                  </button>
                ))}
                {resumeTemplates.slice(availableTemplates || 1).map((template) => (
                  <div
                    key={template.id}
                    className="p-3 rounded-lg border-2 border-gray-200 opacity-50 cursor-not-allowed"
                  >
                    <div className="text-2xl mb-1 grayscale">{template.icon}</div>
                    <div className="text-sm font-medium text-gray-500">{template.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {userPlan === 'free' ? 'Free' : userPlan === 'premium' ? 'Premium' : 'Upgrade'}
                    </div>
                  </div>
                ))}
              </div>
              {availableTemplates === 0 && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ ATS Resume Templates require {userPlan === 'free' ? 'Premium' : 'Business'} plan. 
                    <a href="/dashboard?tab=business" className="text-yellow-900 underline ml-1">Upgrade now</a>
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                  <textarea
                    value={atsResumeData.summary}
                    onChange={(e) => setAtsResumeData({...atsResumeData, summary: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                    rows={3}
                    placeholder="Experienced professional with expertise in..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={atsResumeData.skills.join(', ')}
                    onChange={(e) => setAtsResumeData({...atsResumeData, skills: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                    placeholder="JavaScript, React, Node.js, TypeScript..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (one per line)</label>
                  <textarea
                    value={atsResumeData.experience.join('\n')}
                    onChange={(e) => setAtsResumeData({...atsResumeData, experience: e.target.value.split('\n').filter(s => s.trim())})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                    rows={3}
                    placeholder="Senior Software Engineer at TechCorp&#10;Full Stack Developer at StartupXYZ"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                  <textarea
                    value={atsResumeData.education.join('\n')}
                    onChange={(e) => setAtsResumeData({...atsResumeData, education: e.target.value.split('\n').filter(s => s.trim())})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                    rows={2}
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                
                <button
                  onClick={generateATSResume}
                  disabled={isGeneratingResume}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGeneratingResume ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Generating ATS Resume...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Generate ATS-Optimized Resume</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Output Section */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Generated Resume Preview</h4>
                    {generatedResume && (
                      <button
                        onClick={downloadResume}
                        className="text-purple-600 hover:text-purple-700 flex items-center space-x-1 text-sm"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download PDF</span>
                      </button>
                    )}
                  </div>
                  
                  {generatedResume ? (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <iframe
                        srcDoc={generatedResume}
                        className="w-full h-96 border-0"
                        title="Resume Preview"
                      />
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Your ATS-optimized resume will appear here</p>
                      <p className="text-sm text-gray-400 mt-1">Fill in your details and click generate</p>
                    </div>
                  )}
                </div>
                
                {/* ATS Optimization Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">✅ ATS Optimization Features</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                      <span>Professional PDF templates compatible with all ATS systems</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                      <span>Strategic keyword placement for maximum visibility</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                      <span>Clean structure that passes automated filters</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                      <span>Industry-standard terminology and job descriptions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apply' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">⚡ Instant Apply System</h3>
                <p className="text-gray-600">Apply to multiple jobs with one click using your ATS-optimized resume</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {applicationCount}/{maxApplications} Applications Sent
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {jobTemplates.map((job, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      {job.salary}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => instantApply(job.title, job.company)}
                    disabled={isApplying || !generatedResume || (maxApplications > 0 && applicationCount >= maxApplications)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 text-sm"
                  >
                    {isApplying ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Applying...</span>
                      </>
                    ) : maxApplications > 0 && applicationCount >= maxApplications ? (
                      <>
                        <AlertCircle className="h-3 w-3" />
                        <span>Limit Reached</span>
                      </>
                    ) : maxApplications === 0 ? (
                      <>
                        <AlertCircle className="h-3 w-3" />
                        <span>Upgrade Required</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3 w-3" />
                        <span>Instant Apply</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
            
            {!generatedResume && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ Generate your ATS-optimized resume first to enable instant applications
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'matching' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">🎯 Perfect Match Algorithm</h3>
                <p className="text-gray-600">AI finds jobs that match your skills, experience, and career goals with 95% accuracy</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                89 perfect matches this month
              </div>
            </div>
            
            {/* Always show job listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { 
                  title: 'Senior Full Stack Developer', 
                  company: 'TechCorp Inc.', 
                  location: 'San Francisco, CA', 
                  salary: '$140,000-$180,000', 
                  type: 'Full-time',
                  match: '98%',
                  description: 'Looking for experienced full stack developer with React and Node.js expertise',
                  requirements: ['React', 'Node.js', 'TypeScript', 'AWS'],
                  applyUrl: '#'
                },
                { 
                  title: 'Frontend Engineer', 
                  company: 'Digital Agency', 
                  location: 'New York, NY', 
                  salary: '$120,000-$150,000', 
                  type: 'Hybrid',
                  match: '96%',
                  description: 'Creative frontend developer needed for client projects and UI/UX implementation',
                  requirements: ['React', 'Vue.js', 'CSS', 'TypeScript'],
                  applyUrl: '#'
                },
                { 
                  title: 'Software Engineer', 
                  company: 'StartupXYZ', 
                  location: 'Remote', 
                  salary: '$130,000-$160,000', 
                  type: 'Remote',
                  match: '94%',
                  description: 'Join our growing team as a software engineer working on cutting-edge projects',
                  requirements: ['JavaScript', 'Python', 'Docker', 'Git'],
                  applyUrl: '#'
                },
                { 
                  title: 'React Developer', 
                  company: 'E-commerce Platform', 
                  location: 'Austin, TX', 
                  salary: '$125,000-$155,000', 
                  type: 'Full-time',
                  match: '93%',
                  description: 'Experienced React developer to build and maintain our e-commerce platform',
                  requirements: ['React', 'Redux', 'Node.js', 'MongoDB'],
                  applyUrl: '#'
                },
                { 
                  title: 'Full Stack Engineer', 
                  company: 'FinTech Startup', 
                  location: 'Miami, FL', 
                  salary: '$135,000-$165,000', 
                  type: 'Hybrid',
                  match: '92%',
                  description: 'Build innovative financial technology solutions with modern tech stack',
                  requirements: ['Python', 'React', 'PostgreSQL', 'AWS'],
                  applyUrl: '#'
                },
                { 
                  title: 'JavaScript Developer', 
                  company: 'Media Company', 
                  location: 'Los Angeles, CA', 
                  salary: '$110,000-$140,000', 
                  type: 'Full-time',
                  match: '91%',
                  description: 'JavaScript developer to work on our media platform and content management system',
                  requirements: ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
                  applyUrl: '#'
                }
              ].map((job, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium block mb-1">
                        {job.match} Match
                      </span>
                      <span className="text-green-600 text-sm font-medium">
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.map((req, reqIndex) => (
                        <span key={reqIndex} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => instantApply(job.title, job.company)}
                      disabled={isApplying || !generatedResume}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 text-sm"
                    >
                      {isApplying ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          <span>Instant Apply</span>
                        </>
                      )}
                    </button>
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-1 text-sm"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Apply</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Skills analysis below job listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h4 className="font-semibold text-purple-900 mb-4">Your Skills & Experience</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-purple-700 mb-2">Current Skills:</h5>
                    <div className="flex flex-wrap gap-2">
                      {atsResumeData.skills.map((skill, index) => (
                        <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-purple-700 mb-2">Experience:</h5>
                    <ul className="text-sm text-purple-600 space-y-1">
                      {atsResumeData.experience.map((exp, index) => (
                        <li key={index}>• {exp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-4">AI Matching Results</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Match Accuracy:</span>
                    <span className="font-bold text-green-900">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Perfect Matches:</span>
                    <span className="font-bold text-green-900">89 jobs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Response Rate:</span>
                    <span className="font-bold text-green-900">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">Avg. Salary:</span>
                    <span className="font-bold text-green-900">$125,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hidden' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">👁️ Hidden Job Market Access</h3>
                <p className="text-gray-600">Access jobs not posted anywhere else. 60% of best jobs are never advertised</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                3,240 hidden jobs
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { 
                  title: 'Senior React Developer', 
                  company: 'Stealth Startup', 
                  location: 'San Francisco, CA', 
                  salary: '$150,000-$180,000', 
                  type: 'Hidden',
                  description: 'Join our stealth mode startup building revolutionary React applications',
                  requirements: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
                  applyUrl: '#'
                },
                { 
                  title: 'Lead Full Stack Engineer', 
                  company: 'Unicorn Tech', 
                  location: 'Remote', 
                  salary: '$160,000-$200,000', 
                  type: 'Exclusive',
                  description: 'Lead our engineering team at a fast-growing unicorn company',
                  requirements: ['Python', 'React', 'AWS', 'Leadership'],
                  applyUrl: '#'
                },
                { 
                  title: 'Principal Software Engineer', 
                  company: 'Fortune 500', 
                  location: 'New York, NY', 
                  salary: '$180,000-$220,000', 
                  type: 'Private',
                  description: 'Principal role at Fortune 500 with cutting-edge technology stack',
                  requirements: ['Java', 'Spring', 'Microservices', 'Cloud'],
                  applyUrl: '#'
                },
                { 
                  title: 'DevOps Engineer', 
                  company: 'Cloud Company', 
                  location: 'Seattle, WA', 
                  salary: '$140,000-$170,000', 
                  type: 'Hidden',
                  description: 'Build and maintain cloud infrastructure for enterprise clients',
                  requirements: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
                  applyUrl: '#'
                },
                { 
                  title: 'Machine Learning Engineer', 
                  company: 'AI Startup', 
                  location: 'Palo Alto, CA', 
                  salary: '$170,000-$210,000', 
                  type: 'Exclusive',
                  description: 'Work on cutting-edge ML models and AI infrastructure',
                  requirements: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'],
                  applyUrl: '#'
                },
                { 
                  title: 'Blockchain Developer', 
                  company: 'Crypto Company', 
                  location: 'Miami, FL', 
                  salary: '$160,000-$200,000', 
                  type: 'Private',
                  description: 'Develop decentralized applications and smart contracts',
                  requirements: ['Solidity', 'Web3.js', 'Blockchain', 'Rust'],
                  applyUrl: '#'
                }
              ].map((job, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium block mb-1 ${
                        job.type === 'Hidden' ? 'bg-red-100 text-red-700' :
                        job.type === 'Exclusive' ? 'bg-orange-100 text-orange-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {job.type}
                      </span>
                      <span className="text-green-600 text-sm font-medium">
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{job.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.map((req, reqIndex) => (
                        <span key={reqIndex} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => instantApply(job.title, job.company)}
                      disabled={isApplying || !generatedResume}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 text-sm"
                    >
                      {isApplying ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          <span>Instant Apply</span>
                        </>
                      )}
                    </button>
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-1 text-sm"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Apply</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Premium Features */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">🎯 Premium Job Search Features</h3>
            <p className="text-gray-600">Essential tools for serious job seekers</p>
          </div>
          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            4 premium tools active
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premiumFeatures.map((feature) => (
            <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className={`rounded-lg p-2 ${
                  feature.status === 'premium' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {feature.id === '1' && <FileText className="h-5 w-5 text-blue-600" />}
                  {feature.id === '2' && <Zap className="h-5 w-5 text-yellow-600" />}
                  {feature.id === '3' && <AlertCircle className="h-5 w-5 text-orange-600" />}
                  {feature.id === '4' && <Building className="h-5 w-5 text-red-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{feature.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {feature.value}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      PREMIUM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Search Success Metrics */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Your Job Search Success</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Time to Dream Job</p>
            <p className="text-2xl font-bold text-green-600">2.3 weeks</p>
            <p className="text-xs text-gray-500">vs 12 weeks average</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Salary Increase</p>
            <p className="text-2xl font-bold text-green-600">+28%</p>
            <p className="text-xs text-gray-500">vs previous job</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Applications Needed</p>
            <p className="text-2xl font-bold text-green-600">47</p>
            <p className="text-xs text-gray-500">vs 200+ average</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Premium Value</p>
            <p className="text-2xl font-bold text-blue-600">$3,500</p>
            <p className="text-xs text-gray-500">Monthly extra salary</p>
          </div>
        </div>
        
        <div className="mt-4 bg-blue-100 rounded-lg p-3">
          <p className="text-sm text-blue-800 font-medium">
            🎯 Premium users land their dream job 2x faster with 15% higher salaries - Worth $42,000+ in career value!
          </p>
        </div>
      </div>
    </div>
  )
}
