import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Favorites from './pages/Favorites.jsx'

export default function App() {
  const { t } = useTranslation()
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<Favorites />} />
        </Routes>
      </main>
      <footer className="site-footer">{t('footer_note')}</footer>
    </>
  )
}
