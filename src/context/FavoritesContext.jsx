import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase.js'
import { useAuth } from './AuthContext.jsx'

const FavoritesContext = createContext(null)
const STORAGE_KEY = 'lumora_favorites'

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState(readLocal)
  const hydratedFromCloud = useRef(false)

  // Sempre espelha em localStorage — funciona mesmo sem conta/Firebase.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  // Quando o usuário loga, busca a lista salva na nuvem e faz merge com a local.
  useEffect(() => {
    if (!isFirebaseConfigured || !user) {
      hydratedFromCloud.current = false
      return
    }
    let cancelled = false
    async function hydrate() {
      const ref = doc(db, 'favorites', user.uid)
      const snap = await getDoc(ref)
      const cloud = snap.exists() ? snap.data().items || [] : []
      if (cancelled) return
      setFavorites((local) => {
        const byId = new Map()
        ;[...cloud, ...local].forEach((item) => byId.set(item.id, item))
        return Array.from(byId.values())
      })
      hydratedFromCloud.current = true
    }
    hydrate()
    return () => {
      cancelled = true
    }
  }, [user])

  // Depois de hidratado, toda mudança é persistida na nuvem também.
  useEffect(() => {
    if (!isFirebaseConfigured || !user || !hydratedFromCloud.current) return
    const ref = doc(db, 'favorites', user.uid)
    setDoc(ref, { items: favorites }, { merge: true }).catch(() => {})
  }, [favorites, user])

  function isFavorite(id) {
    return favorites.some((f) => f.id === id)
  }

  function toggleFavorite(item) {
    setFavorites((prev) =>
      prev.some((f) => f.id === item.id)
        ? prev.filter((f) => f.id !== item.id)
        : [{ ...item }, ...prev]
    )
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites deve ser usado dentro de FavoritesProvider')
  return ctx
}
