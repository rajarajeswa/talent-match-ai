import { mockSignInWithGoogle, mockSignOut } from './mockAuth'

export const signInWithGoogle = async () => {
  try {
    const user = await mockSignInWithGoogle()
    return user
  } catch (error: any) {
    throw error
  }
}

export const signOut = async () => {
  try {
    await mockSignOut()
  } catch (error: any) {
    throw error
  }
}
