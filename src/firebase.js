// src/firebase.js
// -----------------------------------------------------------------------
// Configuração do Firebase usada para autenticação (criar conta / login)
// e para guardar os favoritos de quem estiver logado no Firestore.
//
// Para funcionar de verdade:
// 1. Crie um projeto em https://console.firebase.google.com
// 2. Ative "Authentication" -> método "E-mail/senha"
// 3. Ative "Firestore Database" (modo produção ou teste)
// 4. Copie o objeto de configuração do seu app e cole em .env (veja .env.example)
//
// Enquanto as variáveis de ambiente não forem preenchidas, o app continua
// funcionando normalmente em modo "convidado": busca, favoritos e tema
// funcionam 100% via localStorage, só a criação de conta fica indisponível.
// -----------------------------------------------------------------------
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let app = null
let auth = null
let db = null

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
}

export { app, auth, db }
