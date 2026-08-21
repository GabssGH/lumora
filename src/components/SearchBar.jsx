import { useTranslation } from 'react-i18next'

export default function SearchBar({ value, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="searchbar">
      <span aria-hidden="true">🔎</span>
      <input
        type="search"
        value={value}
        placeholder={t('search_placeholder')}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
