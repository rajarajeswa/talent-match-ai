import { auth, googleProvider, isDemoMode } from './firebase'
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged as firebaseOnAuthStateChanged, User } from 'firebase/auth'
import { mockSignInWithGoogle, mockSignOut, MockUser } from './mockAuth'
import { firestoreService } from './firestore'

export const signInWithGoogle = async (): Promise<User | MockUser> => {
  try {
    if (isDemoMode) {
      console.log('Using demo mode - Firebase not configured')
      const mockUser = await mockSignInWithGoogle()
      // Store mock user data in localStorage for demo
      localStorage.setItem('userProfile', JSON.stringify(mockUser))
      return mockUser
    }
    
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Store user data in Firestore
    await firestoreService.createUserProfile({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    })
    
    console.log('✅ User signed in and data stored in Firestore')
    return user
  } catch (error: any) {
    console.error('Google sign-in error:', error)
    
    // Fallback to demo mode on error
    console.log('Falling back to demo mode')
    const mockUser = await mockSignInWithGoogle()
    localStorage.setItem('userProfile', JSON.stringify(mockUser))
    return mockUser
  }
}

export const signOut = async (): Promise<void> => {
  try {
    if (isDemoMode) {
      await mockSignOut()
      localStorage.removeItem('userProfile')
      return
    }
    
    await firebaseSignOut(auth)
    localStorage.removeItem('userProfile')
    console.log('✅ User signed out')
  } catch (error: any) {
    console.error('Sign-out error:', error)
    // Fallback to demo sign-out
    await mockSignOut()
    localStorage.removeItem('userProfile')
  }
}

export const onAuthStateChanged = (callback: (user: User | MockUser | null) => void) => {
  if (isDemoMode) {
    // Don't auto-login from localStorage in demo mode
    // User must explicitly click sign in
    callback(null)
    return () => {} // Return unsubscribe function
  }
  
  return firebaseOnAuthStateChanged(auth, async (user) => {
    if (user) {
      // Store user data in Firestore when they come back
      await firestoreService.createUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      })
    }
    callback(user)
  })
}

export type { User }
export type { MockUser }
