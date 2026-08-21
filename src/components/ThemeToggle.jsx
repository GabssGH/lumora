import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      className="icon-btn"
      onClick={toggleTheme}
      aria-label="Alternar tema claro/escuro"
      title="Alternar tema"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
