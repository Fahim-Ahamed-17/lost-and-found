import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import itemsReducer from '../features/items/itemsSlice'
import itemDetailReducer from '../features/items/itemDetailSlice'
import claimsReducer from '../features/claims/claimsSlice'
import uiReducer from '../features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    itemDetail: itemDetailReducer,
    claims: claimsReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

