import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fetchWatchProviders, isTmdbConfigured } from '../services/tmdb.js'
import { getProviderLink } from '../services/providerLinks.js'

const LOGO_BASE = 'https://image.tmdb.org/t/p/w45'

export default function ProviderButtons({ item, size = 'sm', maxVisible = 3 }) {
  const { i18n } = useTranslation()
  const [providers, setProviders] = useState(null)
  const [link, setLink] = useState(null)

  useEffect(() => {
    if (!isTmdbConfigured) return
    let cancelled = false
    fetchWatchProviders(item.mediaType, item.tmdbId, i18n.language).then((result) => {
      if (cancelled) return
      setProviders(result.providers)
      setLink(result.link)
    })
    return () => {
      cancelled = true
    }
  }, [item.mediaType, item.tmdbId, i18n.language])

  if (!providers || providers.length === 0) return null

  const visible = providers.slice(0, maxVisible)
  const extraCount = providers.length - visible.length

  return (
    <div className={`provider-row provider-row-${size}`} onClick={(e) => e.stopPropagation()}>
      {visible.map((p) => {
        const url = getProviderLink(p.name, item.title, link)
        if (!url) return null
        return (
          <a
            key={p.id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="provider-btn"
            title={p.name}
            aria-label={p.name}
          >
            {p.logoPath ? (
              <img src={`${LOGO_BASE}${p.logoPath}`} alt={p.name} />
            ) : (
              <span className="provider-btn-fallback">{p.name[0]}</span>
            )}
          </a>
        )
      })}
      {extraCount > 0 && link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="provider-btn provider-btn-more"
          title={`+${extraCount}`}
        >
          +{extraCount}
        </a>
      )}
    </div>
  )
}
