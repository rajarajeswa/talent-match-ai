import { auth, googleProvider, isDemoMode } from './firebase'
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged as firebaseOnAuthStateChanged, User } from 'firebase/auth'
import { mockSignInWithGoogle, mockSignOut, MockUser } from './mockAuth'

export const signInWithGoogle = async (): Promise<User | MockUser> => {
  try {
    if (isDemoMode) {
      console.log('Using demo mode - Firebase not configured')
      return await mockSignInWithGoogle()
    }
    
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error: any) {
    console.error('Google sign-in error:', error)
    
    // Fallback to demo mode on error
    console.log('Falling back to demo mode')
    return await mockSignInWithGoogle()
  }
}

export const signOut = async (): Promise<void> => {
  try {
    if (isDemoMode) {
      await mockSignOut()
      return
    }
    
    await firebaseSignOut(auth)
  } catch (error: any) {
    console.error('Sign-out error:', error)
    // Fallback to demo sign-out
    await mockSignOut()
  }
}

export const onAuthStateChanged = (callback: (user: User | MockUser | null) => void) => {
  if (isDemoMode) {
    // Use mock auth state changes
    const mockUser = localStorage.getItem('mockUser')
    callback(mockUser ? JSON.parse(mockUser) : null)
    return () => {} // Return unsubscribe function
  }
  
  return firebaseOnAuthStateChanged(auth, callback)
}

export type { User }
export type { MockUser }
