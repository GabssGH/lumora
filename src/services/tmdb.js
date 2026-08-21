// src/services/tmdb.js
// -----------------------------------------------------------------------
// Camada de acesso à API do TMDB (The Movie Database).
// Crie uma chave grátis em https://www.themoviedb.org/settings/api
// e coloque em VITE_TMDB_API_KEY no seu .env
// -----------------------------------------------------------------------
const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'
export const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'

export const isTmdbConfigured = Boolean(API_KEY)

async function tmdbFetch(path, params = {}, lang = 'pt-BR') {
  if (!isTmdbConfigured) {
    throw new Error('tmdb_unconfigured')
  }
  const url = new URL(BASE_URL + path)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', lang)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
  })
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

// Mapeia o idioma da interface para o formato esperado pelo TMDB.
export function toTmdbLang(appLang) {
  const map = {
    pt: 'pt-BR',
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    ja: 'ja-JP',
  }
  return map[appLang] || 'en-US'
}

// Mapeia o idioma da interface para a região usada no endpoint de
// "onde assistir" (a disponibilidade em cada plataforma varia por país).
export function toWatchRegion(appLang) {
  const map = { pt: 'BR', en: 'US', es: 'ES', fr: 'FR', de: 'DE', it: 'IT', ja: 'JP' }
  return map[appLang] || 'US'
}

const providersCache = new Map()

// Busca em quais plataformas o título está disponível (assinatura, grátis
// com anúncios, aluguel ou compra, nessa ordem de preferência) na região
// do idioma atual. Resultado fica em cache em memória por título+região,
// já que a mesma requisição pode se repetir ao rolar a grade.
export async function fetchWatchProviders(mediaType, tmdbId, appLang) {
  const region = toWatchRegion(appLang)
  const cacheKey = `${mediaType}-${tmdbId}-${region}`
  if (providersCache.has(cacheKey)) return providersCache.get(cacheKey)

  const path = mediaType === 'tv' ? `/tv/${tmdbId}/watch/providers` : `/movie/${tmdbId}/watch/providers`
  let result = { providers: [], link: null }
  try {
    const data = await tmdbFetch(path, {})
    const byRegion = data.results?.[region]
    if (byRegion) {
      const list = byRegion.flatrate || byRegion.ads || byRegion.free || byRegion.rent || byRegion.buy || []
      const seen = new Set()
      result = {
        providers: list
          .filter((p) => (seen.has(p.provider_id) ? false : seen.add(p.provider_id)))
          .map((p) => ({ id: p.provider_id, name: p.provider_name, logoPath: p.logo_path })),
        link: byRegion.link || null,
      }
    }
  } catch {
    // silencioso: se falhar, o card simplesmente não mostra botões de plataforma
  }
  providersCache.set(cacheKey, result)
  return result
}

function normalizeItem(raw) {
  const mediaType = raw.media_type || (raw.first_air_date ? 'tv' : 'movie')
  return {
    id: `${mediaType}-${raw.id}`,
    tmdbId: raw.id,
    mediaType,
    title: raw.title || raw.name,
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    overview: raw.overview,
    rating: raw.vote_average ? Number(raw.vote_average.toFixed(1)) : null,
    releaseDate: raw.release_date || raw.first_air_date,
    genreIds: raw.genre_ids || [],
  }
}

export async function fetchTrending(lang, page = 1) {
  const data = await tmdbFetch('/trending/all/week', { page }, toTmdbLang(lang))
  return {
    items: data.results.map(normalizeItem),
    page: data.page,
    totalPages: data.total_pages,
  }
}

export async function searchMulti(query, lang, page = 1) {
  if (!query.trim()) return { items: [], page: 1, totalPages: 1 }
  const data = await tmdbFetch(
    '/search/multi',
    { query, include_adult: false, page },
    toTmdbLang(lang)
  )
  return {
    items: data.results
      .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
      .map(normalizeItem),
    page: data.page,
    totalPages: data.total_pages,
  }
}

// Busca por gênero de verdade: filme e série têm IDs de gênero DIFERENTES
// na TMDB mesmo quando o nome é igual (ex: "Ação" tem um id pra filme e
// outro pra série; alguns gêneros como "Kids" ou "War & Politics" só
// existem oficialmente para série). Por isso consultamos os dois endpoints
// em paralelo, cada um com o id correto, e juntamos o resultado.
export async function discoverByGenre(genre, lang, page = 1) {
  const requests = []
  if (genre.movieId != null) {
    requests.push(
      tmdbFetch(
        '/discover/movie',
        { with_genres: genre.movieId, sort_by: 'popularity.desc', page },
        toTmdbLang(lang)
      ).then((data) => ({
        items: data.results.map((r) => normalizeItem({ ...r, media_type: 'movie' })),
        totalPages: data.total_pages || 1,
      }))
    )
  }
  if (genre.tvId != null) {
    requests.push(
      tmdbFetch(
        '/discover/tv',
        { with_genres: genre.tvId, sort_by: 'popularity.desc', page },
        toTmdbLang(lang)
      ).then((data) => ({
        items: data.results.map((r) => normalizeItem({ ...r, media_type: 'tv' })),
        totalPages: data.total_pages || 1,
      }))
    )
  }

  const results = await Promise.all(requests)
  const items = []
  const maxLen = Math.max(...results.map((r) => r.items.length), 0)
  // intercala filme/série pra não ficar todo mundo do mesmo tipo no topo
  for (let i = 0; i < maxLen; i++) {
    results.forEach((r) => {
      if (r.items[i]) items.push(r.items[i])
    })
  }

  return {
    items,
    page,
    totalPages: Math.max(...results.map((r) => r.totalPages), 1),
  }
}

export async function fetchGenres(lang) {
  const [movieGenres, tvGenres] = await Promise.all([
    tmdbFetch('/genre/movie/list', {}, toTmdbLang(lang)),
    tmdbFetch('/genre/tv/list', {}, toTmdbLang(lang)),
  ])
  const byName = new Map()
  movieGenres.genres.forEach((g) => {
    byName.set(g.name, { name: g.name, movieId: g.id, tvId: null })
  })
  tvGenres.genres.forEach((g) => {
    const existing = byName.get(g.name)
    if (existing) existing.tvId = g.id
    else byName.set(g.name, { name: g.name, movieId: null, tvId: g.id })
  })
  return Array.from(byName.values()).map((g) => ({ ...g, id: g.name }))
}

export async function fetchDetails(mediaType, tmdbId, lang) {
  const path = mediaType === 'tv' ? `/tv/${tmdbId}` : `/movie/${tmdbId}`
  const raw = await tmdbFetch(path, {}, toTmdbLang(lang))
  return normalizeItem({ ...raw, media_type: mediaType })
}
