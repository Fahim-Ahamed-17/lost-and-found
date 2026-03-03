import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/public/Home'
import AdminDashboard from './pages/admin/Dashboard'
import LoginPage from './pages/auth/Login'
import RegisterPage from './pages/auth/Register'
import OAuthRedirect from './pages/auth/OAuthRedirect'
import ItemDetail from './pages/public/ItemDetail'
import ProtectedRoute from './components/layout/ProtectedRoute'
import { fetchMe } from './features/auth/authSlice'
import type { AppDispatch } from './app/store'

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  return (
    <BrowserRouter>
      <div className="relative min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-50 overflow-hidden font-sans">
        {/* Ambient Top Left Gradient Blob */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/50 dark:bg-emerald-600/40 blur-[100px] pointer-events-none -z-10" />
        {/* Ambient Top Right Gradient Blob */}
        <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-teal-400/50 dark:bg-teal-600/40 blur-[100px] pointer-events-none -z-10" />
        {/* Ambient Bottom Right Gradient Blob */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-green-400/50 dark:bg-green-600/40 blur-[100px] pointer-events-none -z-10" />

        <Navbar />

        <main className="flex-1 flex flex-col w-full relative z-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/oauth-redirect" element={<OAuthRedirect />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
