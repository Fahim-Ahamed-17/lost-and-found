import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../../app/store'

interface ProtectedRouteProps {
  children: React.ReactElement
  adminOnly?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const auth = useSelector((state: RootState) => state.auth)
  const location = useLocation()

  if (!auth.isAuthenticated) {
    // redirect to login page
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (adminOnly && !auth.isAdmin) {
    // optionally redirect to home or 403 page
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
