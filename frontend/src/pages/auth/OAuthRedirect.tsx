import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchMe } from '../../features/auth/authSlice'
import type { AppDispatch } from '../../app/store'

const OAuthRedirect: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  useEffect(() => {
    // backend should have set the cookie already
    dispatch(fetchMe()).finally(() => {
      navigate('/', { replace: true })
    })
  }, [dispatch, navigate])

  return <div>Redirecting...</div>
}

export default OAuthRedirect
