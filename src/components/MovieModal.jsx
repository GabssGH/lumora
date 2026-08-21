import { useTranslation } from 'react-i18next'
import { BACKDROP_BASE, IMAGE_BASE } from '../services/tmdb.js'
import { useFavorites } from '../context/FavoritesContext.jsx'
import ProviderButtons from './ProviderButtons.jsx'

export default function MovieModal({ item, onClose }) {
  const { t } = useTranslation()
  const { isFavorite, toggleFavorite } = useFavorites()
  if (!item) return null
  const fav = isFavorite(item.id)
  const year = item.releaseDate ? item.releaseDate.slice(0, 4) : ''
  const backdrop = item.backdropPath || item.posterPath

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-hero">
          {backdrop && (
            <img src={`${item.backdropPath ? BACKDROP_BASE : IMAGE_BASE}${backdrop}`} alt={item.title} />
          )}
          <button className="modal-close" onClick={onClose} aria-label={t('close')}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <h2 className="modal-title">{item.title}</h2>
          <div className="modal-tags">
            {year && <span>{year}</span>}
            <span>{item.mediaType === 'tv' ? 'TV' : 'Movie'}</span>
            {item.rating != null && <span>★ {item.rating} {t('rating')}</span>}
          </div>
          <p className="modal-synopsis">{item.overview || t('overview_missing')}</p>
          <div className="modal-actions">
            <button
              className={`btn ${fav ? 'btn-ghost' : 'btn-accent'}`}
              onClick={() => toggleFavorite(item)}
            >
              {fav ? `♥ ${t('remove_favorite')}` : `♡ ${t('add_favorite')}`}
            </button>
            <ProviderButtons item={item} size="md" maxVisible={8} />
          </div>
        </div>
      </div>
    </div>
  )
}
