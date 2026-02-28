import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeToggle } from './components/layout/ThemeProvider'
import HomePage from './pages/public/Home'
import AdminDashboard from './pages/admin/Dashboard'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-zinc-50">
        <header className="border-b px-4 py-2 flex items-center justify-between">
          <div className="font-semibold">Lost &amp; Found</div>
          <ThemeToggle />
        </header>
        <main className="px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
