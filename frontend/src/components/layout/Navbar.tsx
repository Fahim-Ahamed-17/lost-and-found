import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeProvider'
import { Search, Menu, X } from 'lucide-react'

const linkBase =
  'text-sm px-3 py-2 rounded-full font-medium transition-all duration-200'
const activeLink =
  'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
const inactiveLink =
  'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-white'

import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../app/store'
import { logoutUser } from '../../features/auth/authSlice'

const Navbar: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logoutUser())
    setIsMobileMenuOpen(false)
  }

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group z-50">
          <div className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/40 transition-shadow">
            <Search size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-[Outfit] font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Lost & Found
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink
            to="/"
            className={({ isActive }) => `${linkBase} ${isActive ? activeLink : inactiveLink}`}
          >
            Home
          </NavLink>
          {!auth.isAuthenticated && (
            <>
              <NavLink
                to="/auth/login"
                className={({ isActive }) => `${linkBase} ${isActive ? activeLink : inactiveLink}`}
              >
                Login
              </NavLink>
              <NavLink
                to="/auth/register"
                className={({ isActive }) => `${linkBase} ${isActive ? activeLink : inactiveLink}`}
              >
                Register
              </NavLink>
            </>
          )}
          {auth.isAuthenticated && (
            <div className="flex items-center gap-4 pl-2 border-l border-slate-200 dark:border-zinc-800 ml-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {auth.user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
          <div className="ml-2 pl-2 border-l border-slate-200 dark:border-zinc-800">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-4 z-50">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden absolute top-[64px] left-0 w-full bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-4 fade-in duration-200">
          <NavLink
            to="/"
            className={({ isActive }) => `${linkBase} block w-full text-center ${isActive ? activeLink : inactiveLink}`}
          >
            Home
          </NavLink>
          {!auth.isAuthenticated && (
            <>
              <NavLink
                to="/auth/login"
                className={({ isActive }) => `${linkBase} block w-full text-center ${isActive ? activeLink : inactiveLink}`}
              >
                Login
              </NavLink>
              <NavLink
                to="/auth/register"
                className={({ isActive }) => `${linkBase} block w-full text-center ${isActive ? activeLink : inactiveLink}`}
              >
                Register
              </NavLink>
            </>
          )}
          {auth.isAuthenticated && (
            <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-200 dark:border-zinc-800 mt-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Hello, {auth.user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="w-full text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-4 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  )
}

export default Navbar

