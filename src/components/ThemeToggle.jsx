import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e)}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-200 hover:border-clay hover:bg-clay hover:text-white dark:border-night-text/20 dark:text-night-text dark:hover:bg-sage-light dark:hover:text-night dark:hover:border-sage-light"
    >
      {isDark ? <Sun size={17} strokeWidth={1.75} /> : <Moon size={17} strokeWidth={1.75} />}
    </button>
  )
}
