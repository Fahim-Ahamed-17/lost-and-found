import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { loginUser, clearAuth } from '../../features/auth/authSlice'
import type { RootState, AppDispatch } from '../../app/store'

interface LoginForm {
  email: string
  password: string
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginForm>()
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [auth.isAuthenticated, navigate, from])

  useEffect(() => {
    dispatch(clearAuth())
  }, [dispatch])

  const onSubmit = (data: LoginForm) => {
    dispatch(loginUser(data))
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-emerald-100 via-white to-teal-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-900/60">
      <div className="w-full max-w-md p-8 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-zinc-700/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
            Sign in to access the Lost & Found portal
          </p>
        </div>

        {auth.error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm text-center">
            {auth.error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              University Email
            </label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
              placeholder="student@university.edu"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={auth.loading}
          >
            {auth.loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-slate-200 dark:border-zinc-700" />
          <span className="px-3 text-sm text-slate-400 dark:text-slate-500 bg-transparent">OR</span>
          <hr className="w-full border-slate-200 dark:border-zinc-700" />
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => alert('Please use manual login for now.')}
            className="w-full py-2.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-600 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#4285F4" d="M24 9.5c3.4 0 6.1 1.2 7.9 2.2l5.8-5.7C34.6 3 29.7 1 24 1 14.7 1 7 6.8 3.4 14.3l6.8 5.3C11.8 14.1 17.2 9.5 24 9.5z" />
              <path fill="#34A853" d="M46.5 24c0-1.5-.1-2.6-.3-3.8H24v7.2h12.7c-.5 2.8-2 5.1-4.3 6.7l6.8 5.3c4-3.7 6.3-9.1 6.3-15.4z" />
              <path fill="#FBBC05" d="M10.2 28.6c-.4-1.2-.6-2.4-.6-3.6s.2-2.4.6-3.6l-6.8-5.3C2.3 19.9 1.5 22.9 1.5 26c0 3.1.8 6.1 2.3 8.3l6.4-5.7z" />
              <path fill="#EA4335" d="M24 46c5.7 0 10.6-1.9 14.1-5.2l-6.8-5.3c-1.9 1.3-4.3 2.1-7.3 2.1-6.8 0-12.2-4.6-14.2-10.8l-6.8 5.3C7 41.2 14.7 46 24 46z" />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            <span className="font-medium text-slate-700 dark:text-slate-200">Sign in with Google</span>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/auth/register" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
