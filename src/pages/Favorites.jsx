import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import MovieGrid from '../components/MovieGrid.jsx'
import MovieModal from '../components/MovieModal.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'

export default function Favorites() {
  const { t } = useTranslation()
  const { favorites } = useFavorites()
  const [selected, setSelected] = useState(null)

  return (
    <section className="container" style={{ paddingTop: 32 }}>
      <h2 className="section-title">{t('nav_favorites')}</h2>
      <MovieGrid
        items={favorites}
        loading={false}
        onOpen={setSelected}
        emptyTitle={t('empty_favorites_title')}
        emptySub={t('empty_favorites_sub')}
      />
      <MovieModal item={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
