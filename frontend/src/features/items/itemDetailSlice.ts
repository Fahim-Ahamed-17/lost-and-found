import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { Item } from '../../types/item'

export interface ItemDetailState {
    item: Item | null
    loading: boolean
    error: string | null
    claimLoading: boolean
    claimSuccess: boolean
    claimError: string | null
}

const initialState: ItemDetailState = {
    item: null,
    loading: false,
    error: null,
    claimLoading: false,
    claimSuccess: false,
    claimError: null,
}

// Mock data for simulation
const MOCK_ITEMS: Item[] = [
    {
        id: '1',
        title: 'Apple AirPods Pro',
        description: 'Found a pair of AirPods Pro in the library near the west wing. Case has a small scratch on the back. They are currently with the front desk librarian.',
        type: 'found',
        category: 'Electronics',
        location: 'Main Library',
        date: new Date().toISOString(),
        images: [
            'https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1588156979435-379b9d802b0a?q=80&w=800&auto=format&fit=crop'
        ],
        status: 'active',
        posterId: 'user1',
        posterName: 'Sarah Jenkins',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Grey University Hoodie',
        description: 'Lost my favorite grey hoodie somewhere near the cafeteria. It has a university logo on the front. Size is Large.',
        type: 'lost',
        category: 'Clothing',
        location: 'Cafeteria',
        date: new Date(Date.now() - 86400000).toISOString(),
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'],
        status: 'active',
        posterId: 'user2',
        posterName: 'Mike Ross',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '3',
        title: 'Calculus Textbook',
        description: 'Found a Calculus textbook (8th Edition) in Engineering Building Room 302.',
        type: 'found',
        category: 'Books',
        location: 'Engineering Bldg',
        date: new Date(Date.now() - 172800000).toISOString(),
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop'],
        status: 'active',
        posterId: 'user3',
        posterName: 'Alex Thorne',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '4',
        title: 'Keys with Blue Lanyard',
        description: 'Lost my keys. They are attached to a bright blue lanyard. Last seen near the gym.',
        type: 'lost',
        category: 'Keys',
        location: 'Gym',
        date: new Date(Date.now() - 345600000).toISOString(),
        images: ['https://images.unsplash.com/photo-1584985226462-841f3d611843?q=80&w=800&auto=format&fit=crop'],
        status: 'active',
        posterId: 'user4',
        posterName: 'Jordan Smith',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '5',
        title: 'Water Bottle (Hydro Flask)',
        description: 'Found a yellow Hydro Flask bottle in the Science lab.',
        type: 'found',
        category: 'Other',
        location: 'Science Lab',
        date: new Date(Date.now() - 600000000).toISOString(),
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop'],
        status: 'active',
        posterId: 'user5',
        posterName: 'Emma Watson',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '6',
        title: 'MacBook Pro Charger',
        description: 'Lost my charger. It has a tiny bite mark on the cable from my cat.',
        type: 'lost',
        category: 'Electronics',
        location: 'Student Center',
        date: new Date(Date.now() - 800000000).toISOString(),
        images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800&auto=format&fit=crop'],
        status: 'active',
        posterId: 'user6',
        posterName: 'Chris Evans',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '7',
        title: 'Leather Wallet',
        description: 'Found a brown leather wallet near the stadium entrance.',
        type: 'found',
        category: 'Wallets',
        location: 'Stadium',
        date: new Date().toISOString(),
        images: ['https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=800&auto=format&fit=crop'],
        status: 'active',
        posterId: 'user7',
        posterName: 'Robert Downey',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]

// Thunk to fetch a single item by ID
export const fetchItemById = createAsyncThunk(
    'itemDetail/fetchItemById',
    async (id: string, { rejectWithValue }) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 600))

            const item = MOCK_ITEMS.find(i => i.id === id)
            if (!item) {
                throw new Error('Item not found')
            }
            return item
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch item details')
        }
    }
)

// Thunk to submit a claim for an item
export const submitClaim = createAsyncThunk(
    'itemDetail/submitClaim',
    async ({ itemId, message }: { itemId: string; message: string }, { rejectWithValue }) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            return { id: 'claim_' + Math.random(), itemId, message, status: 'pending' }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to submit claim')
        }
    }
)

const itemDetailSlice = createSlice({
    name: 'itemDetail',
    initialState,
    reducers: {
        clearItemDetail(state) {
            state.item = null
            state.loading = false
            state.error = null
            state.claimSuccess = false
            state.claimError = null
        },
        resetClaimStatus(state) {
            state.claimSuccess = false
            state.claimError = null
            state.claimLoading = false
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Item
            .addCase(fetchItemById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchItemById.fulfilled, (state, action: PayloadAction<Item>) => {
                state.loading = false
                state.item = action.payload
            })
            .addCase(fetchItemById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Submit Claim
            .addCase(submitClaim.pending, (state) => {
                state.claimLoading = true
                state.claimError = null
                state.claimSuccess = false
            })
            .addCase(submitClaim.fulfilled, (state) => {
                state.claimLoading = false
                state.claimSuccess = true
            })
            .addCase(submitClaim.rejected, (state, action) => {
                state.claimLoading = false
                state.claimError = action.payload as string
            })
    },
})

export const { clearItemDetail, resetClaimStatus } = itemDetailSlice.actions
export default itemDetailSlice.reducer
