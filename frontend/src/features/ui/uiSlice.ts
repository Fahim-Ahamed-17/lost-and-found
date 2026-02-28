import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ThemeMode = 'light' | 'dark'

export interface UiState {
  theme: ThemeMode
  globalLoading: boolean
  toastMessage: string | null
  toastType: 'success' | 'error' | 'info' | null
}

const initialState: UiState = {
  theme: 'light',
  globalLoading: false,
  toastMessage: null,
  toastType: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload
    },
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload
    },
    showToast(state, action: PayloadAction<{ message: string; type?: 'success' | 'error' | 'info' }>) {
      state.toastMessage = action.payload.message
      state.toastType = action.payload.type ?? 'info'
    },
    clearToast(state) {
      state.toastMessage = null
      state.toastType = null
    },
  },
})

export const { setTheme, setGlobalLoading, showToast, clearToast } = uiSlice.actions
export default uiSlice.reducer

