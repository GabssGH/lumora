import { useTranslation } from 'react-i18next'
import { IMAGE_BASE } from '../services/tmdb.js'
import { useFavorites } from '../context/FavoritesContext.jsx'
import ProviderButtons from './ProviderButtons.jsx'

export default function MovieCard({ item, onOpen }) {
  const { t } = useTranslation()
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite(item.id)
  const year = item.releaseDate ? item.releaseDate.slice(0, 4) : ''

  return (
    <div className="card" onClick={() => onOpen(item)}>
      <div className="card-overlay-top">
        <ProviderButtons item={item} size="sm" />
        <button
          className={`fav-btn ${fav ? 'is-fav' : ''}`}
          aria-label={fav ? t('remove_favorite') : t('add_favorite')}
          title={fav ? t('remove_favorite') : t('add_favorite')}
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(item)
          }}
        >
          {fav ? '♥' : '♡'}
        </button>
      </div>
      {item.posterPath ? (
        <img
          className="card-poster"
          src={`${IMAGE_BASE}${item.posterPath}`}
          alt={item.title}
          loading="lazy"
        />
      ) : (
        <div className="card-poster" style={{ display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', color: 'var(--text-muted)', padding: 8, textAlign: 'center' }}>
          {item.title}
        </div>
      )}
      <div className="card-body">
        <p className="card-title">{item.title}</p>
        <div className="card-meta">
          <span>{year}</span>
          {item.rating != null && <span className="rating-stub">★ {item.rating}</span>}
        </div>
      </div>
    </div>
  )
}
