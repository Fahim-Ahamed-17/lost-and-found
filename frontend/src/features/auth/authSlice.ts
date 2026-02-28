import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

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

import api from '../../services/api'

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, thunkAPI) => {
  try {
    const res = await api.get('/auth/me')
    return res.data.data.user as AuthUser
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error?.message || err.message)
  }
})

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await api.post('/auth/login', credentials)
      return res.data.data.user as AuthUser
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.error?.message || err.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    payload: { name: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await api.post('/auth/register', payload)
      return res.data.data.user as AuthUser
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.error?.message || err.message)
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api.post('/auth/logout')
    return true
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error?.message || err.message)
  }
})

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.isAdmin = action.payload.role === 'admin'
        state.loading = false
        state.error = null
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false
        // Do not set global error for init session check
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.isAdmin = action.payload.role === 'admin'
        state.loading = false
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.isAdmin = action.payload.role === 'admin'
        state.loading = false
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.isAdmin = false
        state.loading = false
        state.error = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { setUser, setLoading, setError, clearAuth } = authSlice.actions
export default authSlice.reducer

