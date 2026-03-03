import React, { useState } from 'react'
import { Filter, Search, MapPin, Tag, Calendar } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsFilters } from '../../features/items/itemsSlice'
import type { RootState, AppDispatch } from '../../app/store'

const CATEGORIES = [
    'Electronics',
    'Clothing',
    'Accessories',
    'Books',
    'Wallets',
    'Keys',
    'Other'
]

const FilterSidebar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const filters = useSelector((state: RootState) => state.items.filters)

    // Local state for immediate input feedback before dispatching
    const [search, setSearch] = useState(filters.search || '')
    const [location, setLocation] = useState(filters.location || '')

    const handleTypeChange = (type: 'lost' | 'found' | undefined) => {
        dispatch(setItemsFilters({ type }))
    }

    const handleCategoryChange = (category: string) => {
        // Toggle category
        const newCategory = filters.category === category ? undefined : category
        dispatch(setItemsFilters({ category: newCategory }))
    }

    const handleSearchBlur = () => {
        if (search !== filters.search) {
            dispatch(setItemsFilters({ search: search || undefined }))
        }
    }

    const handleLocationBlur = () => {
        if (location !== filters.location) {
            dispatch(setItemsFilters({ location: location || undefined }))
        }
    }

    const clearFilters = () => {
        setSearch('')
        setLocation('')
        // Dispatch empty object to reset all filters in the slice (assuming slice handles it, or explicit undefineds)
        dispatch(setItemsFilters({
            type: undefined,
            category: undefined,
            location: undefined,
            search: undefined,
            status: undefined
        }))
    }

    return (
        <div className="bg-white dark:bg-zinc-900 font-[Outfit]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                    <Filter size={18} className="text-emerald-500" />
                    Filters
                </h2>
                <button
                    onClick={clearFilters}
                    className="text-xs font-medium text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Search</label>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onBlur={handleSearchBlur}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchBlur()}
                            placeholder="Search items..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Type (Lost/Found) */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Type</label>
                    <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
                        <button
                            onClick={() => handleTypeChange(undefined)}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${!filters.type ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-zinc-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => handleTypeChange('lost')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${filters.type === 'lost' ? 'bg-white dark:bg-zinc-700 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Lost
                        </button>
                        <button
                            onClick={() => handleTypeChange('found')}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${filters.type === 'found' ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Found
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Tag size={14} className="text-slate-400" />
                        Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${filters.category === category
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400 shadow-sm'
                                    : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 hover:border-emerald-200 dark:hover:border-emerald-800'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        Date
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">From</span>
                            <input
                                type="date"
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-slate-600 dark:text-slate-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">To</span>
                            <input
                                type="date"
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all text-slate-600 dark:text-slate-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <MapPin size={14} className="text-slate-400" />
                        Location
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onBlur={handleLocationBlur}
                        onKeyDown={(e) => e.key === 'Enter' && handleLocationBlur()}
                        placeholder="e.g. Main Library"
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>
        </div>
    )
}

export default FilterSidebar
