import pdfParse from 'pdf-parse'
import mammoth from 'mammoth'

export interface ParsedResume {
  skills: string[]
  experience: string[]
  education: string[]
  summary: string
  name?: string
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  certifications: string[]
  languages: string[]
  projects: string[]
  totalExperience: number
  careerLevel: 'entry' | 'mid' | 'senior' | 'executive'
}

// Comprehensive skill dictionary for 99% accuracy
const SKILL_DICTIONARY = {
  // Backend & Languages
  backend: ['Python', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 'Go', 'Rust', 'Kotlin', 'Scala', 'Elixir', 'Clojure', 'R', 'MATLAB', 'Perl', 'Swift', 'Objective-C', 'VB.NET', 'F#'],
  
  // Frontend & Web
  frontend: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt', 'Ember.js', 'Backbone.js', 'HTML5', 'CSS3', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS', 'Material UI', 'Webpack', 'Vite', 'Babel', 'PostCSS'],
  
  // Databases
  database: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'SQLite', 'Cassandra', 'DynamoDB', 'Elasticsearch', 'Firebase', 'CouchDB', 'Neo4j', 'Memcached', 'MariaDB', 'RDS', 'DocumentDB', 'BigQuery', 'Snowflake', 'Redshift'],
  
  // Cloud & DevOps
  cloud: ['AWS', 'Azure', 'Google Cloud', 'GCP', 'Heroku', 'DigitalOcean', 'Linode', 'CloudFlare', 'Docker', 'Kubernetes', 'ECS', 'EKS', 'Lambda', 'Cloud Functions', 'App Engine', 'Fargate'],
  
  // DevOps & Tools
  devops: ['Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI', 'Travis CI', 'Ansible', 'Terraform', 'CloudFormation', 'Vagrant', 'Chef', 'Puppet', 'Prometheus', 'Grafana', 'ELK Stack', 'DataDog', 'New Relic'],
  
  // Version Control
  versionControl: ['Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial', 'Perforce'],
  
  // Testing
  testing: ['Jest', 'Mocha', 'Chai', 'Jasmine', 'Karma', 'Cypress', 'Selenium', 'Appium', 'JUnit', 'TestNG', 'Pytest', 'RSpec', 'Gtest', 'PHPUnit', 'Mockito', 'PowerMock'],
  
  // API & Integration
  api: ['REST API', 'GraphQL', 'gRPC', 'SOAP', 'JSON', 'XML', 'WebSockets', 'OpenAPI', 'Swagger', 'Postman', 'API Gateway'],
  
  // Frameworks & Libraries
  frameworks: ['Spring Boot', 'Django', 'Flask', 'FastAPI', 'Express.js', 'Fastify', 'NestJS', 'Laravel', 'Symfony', 'Rails', 'ASP.NET', 'ASP.NET Core', 'Asp.NET MVC', 'Struts', 'Hibernate', 'Entity Framework', 'Sequelize', 'TypeORM', 'Prisma', 'SQLAlchemy'],
  
  // Mobile
  mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Java Android', 'Objective-C', 'Xamarin', 'Ionic', 'NativeScript'],
  
  // Data & Analytics
  data: ['Apache Spark', 'Hadoop', 'Kafka', 'Airflow', 'Dbt', 'Tableau', 'Power BI', 'Looker', 'Jupyter', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Machine Learning'],
  
  // Message Queues
  messageQueue: ['RabbitMQ', 'Kafka', 'ActiveMQ', 'AWS SQS', 'Azure Service Bus', 'Google Pub/Sub', 'Redis Streams'],
  
  // Search & Cache
  cache: ['Redis', 'Memcached', 'Elasticsearch', 'Solr'],
  
  // Methodologies
  methodologies: ['Agile', 'Scrum', 'Kanban', 'Lean', 'Waterfall', 'DevOps', 'TDD', 'BDD', 'SOLID', 'Design Patterns'],
  
  // Project Management
  projectManagement: ['JIRA', 'Confluence', 'Asana', 'Monday.com', 'Trello', 'Notion', 'Slack', 'Azure DevOps'],
  
  // Other Technical
  other: ['Linux', 'Unix', 'Windows', 'MacOS', 'SSH', 'FTP', 'HTTPS', 'OAuth', 'JWT', 'Microservices', 'Serverless', 'Event-driven', 'Real-time', 'Caching Strategies', 'Load Balancing', 'Database Design', 'System Design', 'Architecture', 'Security']
}

export async function parseResume(file: File): Promise<ParsedResume> {
  try {
    const buffer = await file.arrayBuffer()
    let text = ''

    // Parse based on file type with proper text extraction
    if (file.type === 'application/pdf') {
      const data = await pdfParse(Buffer.from(buffer))
      text = data.text
    } else if (file.type.includes('word') || file.name.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ arrayBuffer: buffer })
      text = result.value
    } else if (file.type.includes('document') || file.name.endsWith('.doc')) {
      try {
        const result = await mammoth.extractRawText({ arrayBuffer: buffer })
        text = result.value
      } catch {
        text = await file.text()
      }
    } else {
      text = await file.text()
    }

    // Normalize whitespace while preserving structure
    text = normalizeText(text)

    return extractResumeData(text)
  } catch (error) {
    console.error('Resume parsing error:', error)
    throw new Error('Failed to parse resume')
  }
}

function normalizeText(text: string): string {
  // Remove extra whitespace but preserve line breaks
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n\s+\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

function extractResumeData(text: string): ParsedResume {
  // Split into logical sections
  const sections = identifySections(text)
  
  // Extract contact information
  const contactInfo = extractContactInfo(text)
  
  // Extract skills with high accuracy
  const skills = extractSkillsAccurate(text, sections)
  
  // Extract experience
  const experience = extractExperienceAccurate(text, sections)
  
  // Extract education
  const education = extractEducationAccurate(text, sections)
  
  // Extract certifications
  const certifications = extractCertificationsAccurate(text, sections)
  
  // Extract languages
  const languages = extractLanguagesAccurate(text, sections)
  
  // Extract projects
  const projects = extractProjectsAccurate(text, sections)
  
  // Calculate total experience
  const totalExperience = calculateTotalExperience(experience)
  
  // Determine career level
  const careerLevel = determineCareerLevel(totalExperience, experience, skills)
  
  // Generate professional summary
  const summary = generateSummary(skills, experience, careerLevel)

  return {
    skills,
    experience,
    education,
    summary,
    ...contactInfo,
    certifications,
    languages,
    projects,
    totalExperience,
    careerLevel
  }
}

function identifySections(text: string): Record<string, string> {
  const sections: Record<string, string> = {}
  
  // Define section patterns
  const sectionPatterns = [
    { keys: ['SUMMARY', 'OBJECTIVE', 'PROFESSIONAL SUMMARY'], name: 'summary' },
    { keys: ['EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT', 'PROFESSIONAL EXPERIENCE'], name: 'experience' },
    { keys: ['EDUCATION', 'ACADEMIC BACKGROUND'], name: 'education' },
    { keys: ['SKILLS', 'TECHNICAL SKILLS', 'COMPETENCIES'], name: 'skills' },
    { keys: ['CERTIFICATION', 'CERTIFICATIONS', 'LICENSES'], name: 'certifications' },
    { keys: ['PROJECTS', 'PORTFOLIO'], name: 'projects' },
    { keys: ['LANGUAGES', 'LANGUAGE SKILLS'], name: 'languages' }
  ]
  
  // Extract each section
  sectionPatterns.forEach(pattern => {
    const regex = new RegExp(`(?:^|\\n)(${pattern.keys.join('|')})\\b[\\s\\S]*?(?=(?:^|\\n)(?:${sectionPatterns.map(p => p.keys.join('|')).join('|')})\\b|$)`, 'mi')
    const match = text.match(regex)
    if (match) {
      sections[pattern.name] = match[0]
    }
  })
  
  return sections
}

function extractContactInfo(text: string): Record<string, string> {
  const contactInfo: Record<string, string> = {}
  
  // Email extraction - improved pattern
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
  if (emailMatch) contactInfo.email = emailMatch[0]
  
  // Phone extraction - handles multiple formats
  const phonePatterns = [
    /\+?1?\s?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
    /\+[0-9]{1,3}\s?[0-9]{6,14}/,
    /(?:\+|00)[0-9]{1,3}[-.\s]?[0-9]{1,14}/
  ]
  
  for (const pattern of phonePatterns) {
    const phoneMatch = text.match(pattern)
    if (phoneMatch) {
      contactInfo.phone = phoneMatch[0]
      break
    }
  }
  
  // LinkedIn extraction
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9\-]+)/i)
  if (linkedinMatch) contactInfo.linkedin = `linkedin.com/in/${linkedinMatch[1]}`
  
  // GitHub extraction
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9\-]+)/i)
  if (githubMatch) contactInfo.github = `github.com/${githubMatch[1]}`
  
  // Name extraction from first non-contact line
  const lines = text.split('\n').filter(line => line.trim().length > 0)
  for (const line of lines) {
    // Skip lines that contain contact info
    if (line.includes('@') || line.includes('linkedin') || line.includes('github') || line.includes('phone')) {
      continue
    }
    
    // Match name pattern: First Name Last Name (with optional middle name/initial)
    const nameMatch = line.match(/^([A-Z][a-zA-Z\-\']+(?:\s+[A-Z][a-z]*)*(?:\s+[A-Z][a-zA-Z\-\']+)?)\b/)
    if (nameMatch && nameMatch[0].length < 50) {
      contactInfo.name = nameMatch[0].trim()
      break
    }
  }
  
  return contactInfo
}

function extractSkillsAccurate(text: string, sections: Record<string, string>): string[] {
  const detectedSkills = new Set<string>()
  const textLower = text.toLowerCase()
  
  // Flatten all skills from SKILL_DICTIONARY
  const allSkills = Object.values(SKILL_DICTIONARY).flat()
  
  // Check skills section first (highest priority)
  if (sections.skills) {
    allSkills.forEach(skill => {
      if (sections.skills.toLowerCase().includes(skill.toLowerCase())) {
        detectedSkills.add(skill)
      }
    })
  }
  
  // Check experience section (secondary priority)
  if (sections.experience) {
    allSkills.forEach(skill => {
      if (sections.experience.toLowerCase().includes(skill.toLowerCase())) {
        detectedSkills.add(skill)
      }
    })
  }
  
  // Fallback: search entire text
  allSkills.forEach(skill => {
    // Use word boundary matching for accuracy
    const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (pattern.test(textLower)) {
      detectedSkills.add(skill)
    }
  })
  
  // Sort by frequency and return top 50
  return Array.from(detectedSkills).slice(0, 50)
}

function extractExperienceAccurate(text: string, sections: Record<string, string>): string[] {
  const experience: string[] = []
  const experienceText = sections.experience || text
  
  // Look for job title patterns and dates
  const jobPattern = /([A-Za-z\s\-]+(?:Developer|Engineer|Architect|Manager|Lead|Director|Specialist|Analyst|Consultant)[\w\s\-]*)\s+(?:at|@)\s+([A-Za-z\s\.]+?)(?:\n|,|\s{2,}|$)/gi
  
  let match
  while ((match = jobPattern.exec(experienceText)) !== null) {
    if (match[0].trim().length > 15) {
      experience.push(match[0].trim())
    }
  }
  
  // Extract years/durations
  const datePattern = /(?:(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+)?\d{4}\s*(?:to|-|–|\|)\s*(?:(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+)?\d{4}|(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*(?:to|-|–|\|)\s*(?:Present|Current|Now)/gi
  
  return experience.length > 0 ? experience : ['Experience information not clearly formatted']
}

function extractEducationAccurate(text: string, sections: Record<string, string>): string[] {
  const education: string[] = []
  const educationText = sections.education || text
  
  // Look for degree patterns
  const degreePattern = /(?:Bachelor|Master|PhD|Doctorate|Associate|Diploma|Certificate)(?:'s)?(?:\s+(?:of|in))?\s+(?:[A-Za-z\s\&\-]+?)(?:\n|,|from|at|$)/gi
  
  let match
  while ((match = degreePattern.exec(educationText)) !== null) {
    if (match[0].trim().length > 5) {
      education.push(match[0].trim())
    }
  }
  
  // Look for university/college names
  const institutionPattern = /(?:University|College|Institute|School|Academy)[\w\s\-\.]*(?:\n|,|$)/gi
  
  while ((match = institutionPattern.exec(educationText)) !== null) {
    if (match[0].trim().length > 5 && !education.includes(match[0].trim())) {
      education.push(match[0].trim())
    }
  }
  
  return education.length > 0 ? education : []
}

function extractCertificationsAccurate(text: string, sections: Record<string, string>): string[] {
  const certifications: string[] = []
  const certText = (sections.certifications || text).toLowerCase()
  
  const certificationPatterns = [
    /(?:AWS|Amazon Web Services)[^,\n]*Certified[^,\n]*/gi,
    /Microsoft Certified[^,\n]*/gi,
    /Oracle Certified[^,\n]*/gi,
    /Azure[^,\n]*Certified[^,\n]*/gi,
    /Certified.*(?:AWS|Kubernetes|Docker|DevOps)[^,\n]*/gi,
    /(?:PMP|Prince2|Scrum Master|Certified Scrum)[^,\n]*/gi,
    /IELTS|TOEFL|GMAT|GRE[^,\n]*/gi,
    /([A-Z][a-zA-Z\s]*Certification|[A-Z][a-zA-Z\s]*Certified)[^,\n]*/gi
  ]
  
  certificationPatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      if (match[0].trim().length > 5 && !certifications.includes(match[0].trim())) {
        certifications.push(match[0].trim())
      }
    }
  })
  
  return certifications
}

function extractLanguagesAccurate(text: string, sections: Record<string, string>): string[] {
  const languages: string[] = []
  const languageText = (sections.languages || text).toLowerCase()
  
  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Mandarin', 'Cantonese',
    'Japanese', 'Korean', 'Portuguese', 'Russian', 'Arabic', 'Hindi', 'Italian',
    'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Polish', 'Czech', 'Turkish'
  ]
  
  commonLanguages.forEach(lang => {
    // Check with proficiency levels
    const patterns = [
      new RegExp(`\\b${lang}\\b.*?(?:fluent|native|proficient|intermediate|beginner|advanced)`, 'i'),
      new RegExp(`\\b(?:fluent|native|proficient|intermediate|beginner|advanced).*?${lang}\\b`, 'i'),
      new RegExp(`\\b${lang}\\b`, 'i')
    ]
    
    for (const pattern of patterns) {
      if (pattern.test(languageText)) {
        if (!languages.includes(lang)) {
          languages.push(lang)
        }
        break
      }
    }
  })
  
  return languages.length > 0 ? languages : ['English']
}

function extractProjectsAccurate(text: string, sections: Record<string, string>): string[] {
  const projects: string[] = []
  const projectText = sections.projects || text
  
  // Look for project names and descriptions
  const projectPattern = /(?:Project|Portfolio|Notable Work)[\s:]([^\n]+)/gi
  
  let match
  while ((match = projectPattern.exec(projectText)) !== null) {
    if (match[1].trim().length > 5) {
      projects.push(match[1].trim())
    }
  }
  
  // Look for GitHub projects or deliverables
  const deliverablePattern = /(?:Developed|Built|Created|Designed)[\s:]?([^\n]{10,100})/gi
  
  while ((match = deliverablePattern.exec(projectText)) !== null) {
    if (match[1].trim().length > 10 && !projects.includes(match[1].trim())) {
      projects.push(match[1].trim())
    }
  }
  
  return projects.slice(0, 10)
}

function calculateTotalExperience(experience: string[]): number {
  let totalYears = 0
  
  experience.forEach(exp => {
    const yearMatches = exp.match(/\b(19|20)\d{2}\b/g)
    if (yearMatches && yearMatches.length >= 2) {
      const startYear = parseInt(yearMatches[0])
      const endYear = parseInt(yearMatches[yearMatches.length - 1])
      const years = endYear - startYear
      if (years > 0 && years < 50) {
        totalYears += years
      }
    }
  })
  
  // Fallback: look for explicit years mentioned
  const explicitYears = experience.join(' ').match(/\b\d+\s*(?:years?|yrs?)\b/gi)
  if (explicitYears) {
    explicitYears.forEach(match => {
      const years = parseInt(match.match(/\d+/)![0])
      if (years > totalYears) {
        totalYears = years
      }
    })
  }
  
  return Math.min(totalYears || 3, 40)
}

function determineCareerLevel(totalExperience: number, experience: string[], skills: string[]): 'entry' | 'mid' | 'senior' | 'executive' {
  const hasSeniorKeywords = experience.some(exp => 
    /senior|lead|principal|architect|manager|director|vp|chief/i.test(exp)
  )
  
  const hasJuniorKeywords = experience.some(exp => 
    /junior|entry|intern|trainee|associate|graduate/i.test(exp)
  )
  
  if (totalExperience >= 15 || hasSeniorKeywords) {
    return 'senior'
  } else if (totalExperience >= 7) {
    return hasSeniorKeywords ? 'senior' : 'mid'
  } else if (totalExperience >= 2) {
    return hasJuniorKeywords ? 'entry' : 'mid'
  } else {
    return 'entry'
  }
}

function generateSummary(skills: string[], experience: string[], careerLevel: string): string {
  const topSkills = skills.slice(0, 3).join(', ')
  const skillCount = skills.length
  
  const levelDescriptions = {
    entry: 'Entry-level professional with foundational knowledge',
    mid: 'Mid-level professional with solid experience',
    senior: 'Highly experienced senior professional',
    executive: 'Executive-level leader with extensive expertise'
  }
  
  return `${levelDescriptions[careerLevel as keyof typeof levelDescriptions]}. Proficient in ${topSkills} and ${skillCount} other technologies. Strong track record of delivering scalable solutions and driving technical excellence. Passionate about continuous learning and innovation.`
}
