import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ClaimStatus = 'pending' | 'approved' | 'rejected'

export interface Claim {
  id: string
  itemId: string
  message?: string
  status: ClaimStatus
  createdAt: string
}

export interface ClaimsState {
  claims: Claim[]
  loading: boolean
  error: string | null
}

const initialState: ClaimsState = {
  claims: [],
  loading: false,
  error: null,
}

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setClaims(state, action: PayloadAction<Claim[]>) {
      state.claims = action.payload
    },
    setClaimsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setClaimsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
  },
})

export const { setClaims, setClaimsLoading, setClaimsError } = claimsSlice.actions
export default claimsSlice.reducer

