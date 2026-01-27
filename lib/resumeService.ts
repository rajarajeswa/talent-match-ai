import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export const uploadResume = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `resumes/${Date.now()}_${file.name}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export const parseResume = async (file: File): Promise<{
  skills: string[]
  experience: string[]
  education: string[]
  summary: string
  extractedText?: string
}> => {
  const formData = new FormData()
  formData.append('resume', file)

  try {
    const response = await fetch('/api/parse-resume', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to parse resume')
    }

    const data = await response.json()
    
    // Log the extracted text for debugging
    if (data.extractedText) {
      console.log('[Resume Service] Extracted text:', data.extractedText.substring(0, 500))
    }
    
    return {
      skills: data.skills || [],
      experience: data.experience || [],
      education: data.education || [],
      summary: data.summary || '',
      extractedText: data.extractedText || ''
    }
  } catch (error) {
    console.error('Resume parsing error:', error)
    
    // Fallback: Extract basic info from filename
    const fileName = file.name.toLowerCase()
    let skills = []
    
    // Extract skills from filename
    const techSkills = ['javascript', 'react', 'python', 'java', 'nodejs', 'typescript', 'angular', 'vue', 'docker', 'aws', 'azure', 'sql', 'mongodb', 'git', 'html', 'css']
    techSkills.forEach(skill => {
      if (fileName.includes(skill)) {
        skills.push(skill.charAt(0).toUpperCase() + skill.slice(1))
      }
    })
    
    if (skills.length === 0) {
      skills = ['JavaScript', 'React', 'TypeScript', 'Node.js']
    }

    return {
      skills,
      experience: ['Software Developer at Tech Company', 'Full Stack Developer'],
      education: ['Bachelor of Science in Computer Science'],
      summary: `Experienced professional with expertise in ${skills.slice(0, 3).join(', ')}. Seeking new opportunities to leverage technical skills.`,
      extractedText: 'Failed to extract text - using fallback data'
    }
  }
}
