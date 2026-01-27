import toast from 'react-hot-toast'

export interface MockUser {
  uid: string
  displayName: string
  email: string
  photoURL: string
}

export const mockSignInWithGoogle = async (): Promise<MockUser> => {
  // Reduced delay from 1000ms to 200ms for faster experience
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const mockUser: MockUser = {
    uid: 'demo_user_123',
    displayName: 'Demo User',
    email: 'demo@talentmatch.ai',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  }
  
  // Store in localStorage for persistence
  localStorage.setItem('mockUser', JSON.stringify(mockUser))
  
  toast.success('Successfully signed in with Google (Demo Mode)')
  return mockUser
}

export const mockSignOut = async (): Promise<void> => {
  // Reduced delay from 500ms to 100ms
  await new Promise(resolve => setTimeout(resolve, 100))
  
  localStorage.removeItem('mockUser')
  toast.success('Successfully signed out')
}

export const getMockUser = (): MockUser | null => {
  try {
    const userStr = localStorage.getItem('mockUser')
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

export const onMockAuthStateChanged = (callback: (user: MockUser | null) => void) => {
  // Check for existing user on load
  const user = getMockUser()
  callback(user)
  
  // Return unsubscribe function (no-op for mock)
  return () => {}
}
