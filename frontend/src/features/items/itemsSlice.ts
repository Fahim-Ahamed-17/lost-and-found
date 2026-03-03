import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { Item } from '../../types/item'
import axios from 'axios'

export interface ItemsFilters {
  type?: 'lost' | 'found'
  category?: string
  location?: string
  startDate?: string
  endDate?: string
  status?: 'open' | 'claimed' | 'closed'
  search?: string
  page?: number
  limit?: number
}

export interface ItemsState {
  items: Item[]
  totalPages: number
  currentPage: number
  count: number
  loading: boolean
  error: string | null
  filters: ItemsFilters
}

const initialState: ItemsState = {
  items: [],
  totalPages: 0,
  currentPage: 1,
  count: 0,
  loading: false,
  error: null,
  filters: {},
}

// Thunk to fetch items from the API
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (filters: ItemsFilters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })

      const response = await axios.get(`/api/items?${params.toString()}`, {
        withCredentials: true
      })

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch items')
    }
  }
)

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<{ items: Item[]; totalPages: number; currentPage: number; count: number }>) {
      state.items = action.payload.items
      state.totalPages = action.payload.totalPages
      state.currentPage = action.payload.currentPage
      state.count = action.payload.count
    },
    setItemsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setItemsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setItemsFilters(state, action: PayloadAction<ItemsFilters>) {
      state.filters = { ...state.filters, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
        state.count = action.payload.count
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setItems, setItemsLoading, setItemsError, setItemsFilters } = itemsSlice.actions
export default itemsSlice.reducer

