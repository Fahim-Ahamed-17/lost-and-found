import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type UserRole = 'user' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.isAdmin = action.payload?.role === 'admin'
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    clearAuth(state) {
      state.user = null
      state.isAuthenticated = false
      state.isAdmin = false
      state.error = null
      state.loading = false
    },
  },
})

export const { setUser, setLoading, setError, clearAuth } = authSlice.actions
export default authSlice.reducer

