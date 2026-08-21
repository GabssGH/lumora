import { useTranslation } from 'react-i18next'

export default function GenreFilter({ genres, active, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="filters-row">
      <button className={`chip ${active === null ? 'active' : ''}`} onClick={() => onChange(null)}>
        {t('genre_all')}
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          className={`chip ${active?.id === g.id ? 'active' : ''}`}
          onClick={() => onChange(g)}
        >
          {g.name}
        </button>
      ))}
    </div>
  )
}
