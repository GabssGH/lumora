import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthModal({ onClose, unconfigured }) {
  const { t } = useTranslation()
  const { login, signup } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (unconfigured) {
      setError(t('auth_unconfigured'))
      return
    }
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signup(name, email, password)
      } else {
        await login(email, password)
      }
      onClose()
    } catch {
      setError(t('auth_error_generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <h2 className="modal-title" style={{ fontSize: 28, marginBottom: 18 }}>
            {mode === 'login' ? t('login') : t('signup')}
          </h2>

          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-field">
                <label htmlFor="auth-name">{t('name')}</label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="form-field">
              <label htmlFor="auth-email">{t('email')}</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="auth-password">{t('password')}</label>
              <input
                id="auth-password"
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-accent" type="submit" style={{ width: '100%' }} disabled={loading}>
              {mode === 'login' ? t('login') : t('create_account')}
            </button>
          </form>

          <p className="form-switch">
            {mode === 'login' ? t('no_account') : t('already_have_account')}{' '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? t('signup') : t('login')}
            </button>
          </p>
          <p className="guest-note">{t('guest_note')}</p>
        </div>
      </div>
    </div>
  )
}
