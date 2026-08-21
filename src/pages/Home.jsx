import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SearchBar from '../components/SearchBar.jsx'
import GenreFilter from '../components/GenreFilter.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import MovieModal from '../components/MovieModal.jsx'
import {
  fetchTrending,
  searchMulti,
  discoverByGenre,
  fetchGenres,
  isTmdbConfigured,
} from '../services/tmdb.js'

export default function Home() {
  const { t, i18n } = useTranslation()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [genres, setGenres] = useState([])
  const [activeGenre, setActiveGenre] = useState(null)
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState(false)

  const sentinelRef = useRef(null)
  const loadingMoreRef = useRef(false)

  // debounce da busca
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 400)
    return () => clearTimeout(id)
  }, [query])

  useEffect(() => {
    if (!isTmdbConfigured) return
    fetchGenres(i18n.language).then(setGenres).catch(() => {})
  }, [i18n.language])

  const fetchPage = useCallback(
    async (targetPage) => {
      if (debouncedQuery.trim()) return searchMulti(debouncedQuery, i18n.language, targetPage)
      if (activeGenre) return discoverByGenre(activeGenre, i18n.language, targetPage)
      return fetchTrending(i18n.language, targetPage)
    },
    [debouncedQuery, activeGenre, i18n.language]
  )

  // Sempre que busca, filtro ou idioma mudam, recomeça do zero na página 1.
  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!isTmdbConfigured) {
        setLoading(false)
        setError(true)
        return
      }
      setLoading(true)
      setError(false)
      try {
        const result = await fetchPage(1)
        if (!cancelled) {
          setItems(result.items)
          setPage(result.page)
          setTotalPages(result.totalPages)
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [fetchPage])

  // Carrega a próxima página e concatena, evitando duplicar itens já vistos.
  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || page >= totalPages) return
    loadingMoreRef.current = true
    setLoadingMore(true)
    try {
      const result = await fetchPage(page + 1)
      setItems((prev) => {
        const seen = new Set(prev.map((i) => i.id))
        return [...prev, ...result.items.filter((i) => !seen.has(i.id))]
      })
      setPage(result.page)
      setTotalPages(result.totalPages)
    } catch {
      // silencioso: se a próxima página falhar, o usuário ainda vê a lista atual
    } finally {
      loadingMoreRef.current = false
      setLoadingMore(false)
    }
  }, [fetchPage, page, totalPages])

  // Observa o sentinela no fim da grade para disparar loadMore automaticamente.
  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '600px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [loadMore])

  const heading = useMemo(() => {
    if (debouncedQuery.trim()) return `${t('results_for')} "${debouncedQuery}"`
    return t('trending_title')
  }, [debouncedQuery, t])

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="hero-eyebrow">{t('hero_eyebrow')}</p>
          <h1 className="hero-title">{t('hero_title')}</h1>
          <p className="hero-sub">{t('hero_sub')}</p>
          <SearchBar value={query} onChange={setQuery} />
          {genres.length > 0 && (
            <GenreFilter genres={genres} active={activeGenre} onChange={setActiveGenre} />
          )}
        </div>
      </section>

      <section className="container">
        <h2 className="section-title">
          {heading} {!debouncedQuery.trim() && <small>{t('trending_sub')}</small>}
        </h2>

        {error && !isTmdbConfigured ? (
          <div className="empty-state">
            <h3>TMDB_API_KEY ausente</h3>
            <p>Adicione sua chave da TMDB em <code>.env</code> (VITE_TMDB_API_KEY) para carregar filmes e séries reais. Veja o README.</p>
          </div>
        ) : (
          <>
            <MovieGrid
              items={items}
              loading={loading}
              onOpen={setSelected}
              emptyTitle={debouncedQuery.trim() ? t('empty_no_results_title') : t('empty_search_title')}
              emptySub={debouncedQuery.trim() ? t('empty_no_results_sub') : t('empty_search_sub')}
            />
            {!loading && items.length > 0 && page < totalPages && (
              <div ref={sentinelRef} style={{ height: 1 }} />
            )}
            {loadingMore && <div className="spinner" role="status" aria-label="loading more" />}
          </>
        )}
      </section>

      <MovieModal item={selected} onClose={() => setSelected(null)} />
    </>
  )
}
