import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../i18n.js'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  return (
    <select
      className="select-lang"
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      aria-label="Idioma"
    >
      {SUPPORTED_LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  )
}
