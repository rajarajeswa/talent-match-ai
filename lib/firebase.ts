import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Use demo configuration for development
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForDevelopmentOnly",
  authDomain: "talent-match-demo.firebaseapp.com",
  projectId: "talent-match-demo",
  storageBucket: "talent-match-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678"
}

// Only initialize if all required config is available
let app: any = null
let auth: any = null
let db: any = null
let storage: any = null
let googleProvider: any = null

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  googleProvider = new GoogleAuthProvider()
} catch (error) {
  console.warn('Firebase initialization failed:', error)
}

export { auth, db, storage, googleProvider }
