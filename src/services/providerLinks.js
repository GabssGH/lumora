// src/services/providerLinks.js
// -----------------------------------------------------------------------
// A TMDB informa QUAIS plataformas têm um título disponível, mas não
// fornece um link direto para a página daquele título dentro de cada
// plataforma (isso normalmente exige parceria comercial). Para manter o
// botão útil e honesto, montamos um link de busca pelo título dentro do
// site oficial de cada plataforma conhecida. Se a plataforma não estiver
// mapeada, caímos de volta no link agregador que a própria TMDB fornece.
// -----------------------------------------------------------------------

const SEARCH_BUILDERS = {
  netflix: (title) => `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
  'amazon prime video': (title) =>
    `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(title)}`,
  'disney plus': (title) => `https://www.disneyplus.com/search?q=${encodeURIComponent(title)}`,
  'disney+': (title) => `https://www.disneyplus.com/search?q=${encodeURIComponent(title)}`,
  max: (title) => `https://play.max.com/search?q=${encodeURIComponent(title)}`,
  'hbo max': (title) => `https://play.max.com/search?q=${encodeURIComponent(title)}`,
  'apple tv': (title) => `https://tv.apple.com/search?term=${encodeURIComponent(title)}`,
  'apple tv+': (title) => `https://tv.apple.com/search?term=${encodeURIComponent(title)}`,
  'paramount plus': (title) => `https://www.paramountplus.com/search/?q=${encodeURIComponent(title)}`,
  'paramount+': (title) => `https://www.paramountplus.com/search/?q=${encodeURIComponent(title)}`,
  globoplay: (title) => `https://globoplay.globo.com/busca/?q=${encodeURIComponent(title)}`,
  'star+': (title) => `https://www.starplus.com/search?q=${encodeURIComponent(title)}`,
  'star plus': (title) => `https://www.starplus.com/search?q=${encodeURIComponent(title)}`,
  crunchyroll: (title) => `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`,
  'youtube': (title) => `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`,
  'google play movies': (title) =>
    `https://play.google.com/store/search?q=${encodeURIComponent(title)}&c=movies`,
  'microsoft store': (title) =>
    `https://www.microsoft.com/en-us/search?q=${encodeURIComponent(title)}`,
  mubi: (title) => `https://mubi.com/search/films?query=${encodeURIComponent(title)}`,
  'claro video': (title) => `https://www.clarovideo.com/buscar?q=${encodeURIComponent(title)}`,
}

function normalizeName(name) {
  return name.trim().toLowerCase()
}

// Retorna a URL de busca da plataforma pelo título; se não tivermos essa
// plataforma mapeada, usa o link agregador da TMDB (página com todas as
// opções de onde assistir) como alternativa segura.
export function getProviderLink(providerName, title, fallbackLink) {
  const builder = SEARCH_BUILDERS[normalizeName(providerName)]
  if (builder) return builder(title)
  return fallbackLink || null
}
