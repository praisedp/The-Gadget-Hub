import { useEffect, useState } from 'react'

type Props = {
  onHomeClick: () => void
  onCatalogClick: () => void
  onCartClick: () => void
  cartCount: number
}

const THEME_KEY = 'gadget-hub-theme'

export default function NavBar({ onHomeClick, onCatalogClick, onCartClick, cartCount }: Props) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light') return stored
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="top-nav">
      <button className="btn ghost" onClick={onHomeClick} aria-label="Home">
        <span className="spark">⚡</span> The Gadget Hub
      </button>
      <div className="nav-right">
        <div className="nav-links">
          <button className="btn link" onClick={onHomeClick} aria-label="Home">
            Home
          </button>
          <button className="btn link" onClick={onCatalogClick} aria-label="Browse catalog">
            Catalog
          </button>
          <button className="btn link" onClick={onCartClick} aria-label="Cart">
            Cart
            {cartCount > 0 && <span className="pill badge">{cartCount}</span>}
          </button>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
        </button>
      </div>
    </div>
  )
}
