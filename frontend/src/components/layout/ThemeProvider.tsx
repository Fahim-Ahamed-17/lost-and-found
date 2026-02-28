import React, { createContext, useContext, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setTheme, type ThemeMode } from '../../features/ui/uiSlice'

interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.ui.theme)

  useEffect(() => {
    const initial = getInitialTheme()
    dispatch(setTheme(initial))
  }, [dispatch])

  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    root.dataset.theme = theme
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const next: ThemeMode = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(next))
  }

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      className="border px-3 py-1 text-sm bg-white text-black dark:bg-zinc-900 dark:text-zinc-100"
    >
      {theme === 'light' ? 'Light' : 'Dark'}
    </button>
  )
}

