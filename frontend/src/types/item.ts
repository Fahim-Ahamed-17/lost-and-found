// Shared TypeScript interfaces for Items

export type ItemType = 'lost' | 'found'
export type ItemStatus = 'active' | 'claimed' | 'inactive'

export interface Item {
    id: string
    title: string
    description: string
    type: ItemType
    category: string
    location: string
    date: string // ISO date string
    images: string[] // Array of URLs
    status: ItemStatus
    // Poster information
    posterId: string
    posterName?: string
    createdAt: string
    updatedAt: string
}
