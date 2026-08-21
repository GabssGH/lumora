import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../firebase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured) return
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setAuthReady(true)
    })
    return unsub
  }, [])

  async function signup(name, email, password) {
    if (!isFirebaseConfigured) throw new Error('unconfigured')
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (name) await updateProfile(cred.user, { displayName: name })
    setUser({ ...cred.user, displayName: name })
    return cred.user
  }

  async function login(email, password) {
    if (!isFirebaseConfigured) throw new Error('unconfigured')
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  async function logout() {
    if (!isFirebaseConfigured) return
    await signOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{ user, authReady, isFirebaseConfigured, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
