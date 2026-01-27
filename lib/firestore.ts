import { db } from './firebase'
import { collection, doc, setDoc, getDoc, updateDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'

// User interfaces
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  emailVerified: boolean
  createdAt: any
  lastLogin: any
  subscription: 'free' | 'premium' | 'professional' | 'enterprise'
  plan: string
}

export interface UserActivity {
  userId: string
  resumesUploaded: string[]
  jobsApplied: string[]
  searchesPerformed: number
  templatesUsed: string[]
  lastActivity: any
}

// Firestore service
export class FirestoreService {
  private static instance: FirestoreService

  static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService()
    }
    return FirestoreService.instance
  }

  // Create or update user profile
  async createUserProfile(userData: any): Promise<void> {
    try {
      console.log('🔍 Creating user profile for:', userData.uid)
      console.log('🔍 Database available:', !!db)
      
      const userRef = doc(db, 'users', userData.uid)
      console.log('🔍 User ref created:', userRef.path)
      
      const userDoc = await getDoc(userRef)
      console.log('🔍 User doc exists:', userDoc.exists())

      if (!userDoc.exists()) {
        // Create new user profile
        const userProfile: UserProfile = {
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL || '',
          emailVerified: userData.emailVerified || false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          subscription: 'enterprise', // All features free!
          plan: 'enterprise'
        }

        console.log('🔍 Creating user profile:', userProfile)
        await setDoc(userRef, userProfile)
        console.log('✅ User profile created successfully in Firestore')

        // Create user activity record
        const activityRef = doc(db, 'activities', userData.uid)
        console.log('🔍 Activity ref created:', activityRef.path)
        
        const userActivity: UserActivity = {
          userId: userData.uid,
          resumesUploaded: [],
          jobsApplied: [],
          searchesPerformed: 0,
          templatesUsed: [],
          lastActivity: serverTimestamp()
        }

        console.log('🔍 Creating user activity:', userActivity)
        await setDoc(activityRef, userActivity)
        console.log('✅ User activity created successfully in Firestore')
        
      } else {
        // Update last login
        console.log('🔍 Updating existing user last login')
        await updateDoc(userRef, {
          lastLogin: serverTimestamp()
        })
        console.log('✅ User login updated successfully in Firestore')
      }
    } catch (error) {
      console.error('❌ Error creating user profile:', error)
      console.error('❌ Error details:', error.code, error.message)
      // Fallback to localStorage
      localStorage.setItem('userProfile', JSON.stringify(userData))
    }
  }

  // Get user profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        return userDoc.data() as UserProfile
      }
      return null
    } catch (error) {
      console.error('❌ Error getting user profile:', error)
      return null
    }
  }

  // Update user activity
  async updateUserActivity(uid: string, activity: Partial<UserActivity>): Promise<void> {
    try {
      const activityRef = doc(db, 'activities', uid)
      await updateDoc(activityRef, {
        ...activity,
        lastActivity: serverTimestamp()
      })
    } catch (error) {
      console.error('❌ Error updating user activity:', error)
    }
  }

  // Track resume upload
  async trackResumeUpload(uid: string, resumeId: string): Promise<void> {
    try {
      const activityRef = doc(db, 'activities', uid)
      const activityDoc = await getDoc(activityRef)

      if (activityDoc.exists()) {
        const currentData = activityDoc.data() as UserActivity
        await updateDoc(activityRef, {
          resumesUploaded: [...currentData.resumesUploaded, resumeId],
          lastActivity: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('❌ Error tracking resume upload:', error)
    }
  }

  // Track job application
  async trackJobApplication(uid: string, jobId: string): Promise<void> {
    try {
      const activityRef = doc(db, 'activities', uid)
      const activityDoc = await getDoc(activityRef)

      if (activityDoc.exists()) {
        const currentData = activityDoc.data() as UserActivity
        await updateDoc(activityRef, {
          jobsApplied: [...currentData.jobsApplied, jobId],
          lastActivity: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('❌ Error tracking job application:', error)
    }
  }

  // Track job search
  async trackJobSearch(uid: string): Promise<void> {
    try {
      const activityRef = doc(db, 'activities', uid)
      const activityDoc = await getDoc(activityRef)

      if (activityDoc.exists()) {
        const currentData = activityDoc.data() as UserActivity
        await updateDoc(activityRef, {
          searchesPerformed: currentData.searchesPerformed + 1,
          lastActivity: serverTimestamp()
        })
      }
    } catch (error) {
      console.error('❌ Error tracking job search:', error)
    }
  }

  // Get user statistics
  async getUserStats(uid: string): Promise<UserActivity | null> {
    try {
      const activityRef = doc(db, 'activities', uid)
      const activityDoc = await getDoc(activityRef)

      if (activityDoc.exists()) {
        return activityDoc.data() as UserActivity
      }
      return null
    } catch (error) {
      console.error('❌ Error getting user stats:', error)
      return null
    }
  }
}

export const firestoreService = FirestoreService.getInstance()
