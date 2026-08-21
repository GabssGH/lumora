import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import AuthModal from './AuthModal.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { t } = useTranslation()
  const { user, logout, isFirebaseConfigured } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <>
      <header className="navbar">
        <NavLink to="/" className="brand">
          {t('brand_a')}
          <span>{t('brand_b')}</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            {t('nav_home')}
          </NavLink>
          <NavLink to="/favoritos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t('nav_favorites')}
          </NavLink>
        </nav>

        <div className="nav-controls">
          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <button className="btn btn-ghost" onClick={logout}>
              {t('logout')}
            </button>
          ) : (
            <button className="btn btn-accent" onClick={() => setAuthOpen(true)}>
              {t('login')}
            </button>
          )}
        </div>
      </header>

      {authOpen && !user && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          unconfigured={!isFirebaseConfigured}
        />
      )}
    </>
  )
}
