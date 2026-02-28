import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Item {
  id: string
  title: string
  description: string
  category: string
  type: 'lost' | 'found'
  location: string
  status: 'open' | 'claimed' | 'closed'
  createdAt: string
}

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
})

export const { setItems, setItemsLoading, setItemsError, setItemsFilters } = itemsSlice.actions
export default itemsSlice.reducer

