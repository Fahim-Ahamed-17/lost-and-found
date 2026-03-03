import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../app/store'
import { setItems, setItemsLoading, setItemsFilters } from '../../features/items/itemsSlice'
import ItemCard from '../../components/shared/ItemCard'
import FilterSidebar from '../../components/items/FilterSidebar'
import Pagination from '../../components/shared/Pagination'
import Sheet from '../../components/ui/Sheet'
import { ArchiveX, Filter } from 'lucide-react'
import type { Item } from '../../types/item'

// Mock data to demonstrate the Grid layout and ItemCards on the home page
const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    title: 'Apple AirPods Pro',
    description: 'Found a pair of AirPods Pro in the library near the west wing. Case has a small scratch on the back.',
    type: 'found',
    category: 'Electronics',
    location: 'Main Library',
    date: new Date().toISOString(),
    images: ['https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=800&auto=format&fit=crop'],
    status: 'active',
    posterId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Grey University Hoodie',
    description: 'Lost my favorite grey hoodie somewhere near the cafeteria. It has a university logo on the front.',
    type: 'lost',
    category: 'Clothing',
    location: 'Cafeteria',
    date: new Date(Date.now() - 86400000).toISOString(),
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'],
    status: 'active',
    posterId: 'user2',
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
]

const ITEMS_PER_PAGE = 6

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, filters, currentPage, totalPages, loading } = useSelector((state: RootState) => state.items)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  useEffect(() => {
    // Simulate API Call with filtering and pagination
    dispatch(setItemsLoading(true))

    // Slight delay to show loading state
    const timeout = setTimeout(() => {
      let filtered = [...MOCK_ITEMS]

      if (filters.search) {
        const query = filters.search.toLowerCase()
        filtered = filtered.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
        )
      }
      if (filters.type) {
        filtered = filtered.filter(item => item.type === filters.type)
      }
      if (filters.category) {
        filtered = filtered.filter(item => item.category === filters.category)
      }
      if (filters.location) {
        const locQuery = filters.location.toLowerCase()
        filtered = filtered.filter(item => item.location.toLowerCase().includes(locQuery))
      }

      // Pagination setup
      const page = filters.page || 1
      const totalFiltered = filtered.length
      const calculatedTotalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE) || 1

      const startIndex = (page - 1) * ITEMS_PER_PAGE
      const paginatedItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

      dispatch(setItems({
        items: paginatedItems,
        count: totalFiltered,
        totalPages: calculatedTotalPages,
        currentPage: page
      }))
      dispatch(setItemsLoading(false))
    }, 400)

    return () => clearTimeout(timeout)
  }, [dispatch, filters])

  const handlePageChange = (page: number) => {
    dispatch(setItemsFilters({ page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-emerald-100 via-white to-teal-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-900/60 font-[Outfit] transition-colors duration-500 flex flex-col items-center">
      <div className="w-full max-w-7xl space-y-8">

        {/* Header Section */}
        <div className="text-center space-y-4 pt-8 pb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent fade-in">
            Recent Items
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Help us reunite lost items with their owners. Browse recently reported items below.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex justify-end px-2">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm text-slate-700 dark:text-zinc-100 font-bold hover:border-emerald-500 dark:hover:border-emerald-500 transition-all active:scale-95 group"
          >
            <Filter size={18} className="text-emerald-500 group-hover:rotate-12 transition-transform" />
            Filters
          </button>
        </div>

        {/* Main Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8 w-full">

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block w-80 shrink-0 z-10 font-[Outfit]">
            <div className="sticky top-24 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 p-5">
              <FilterSidebar />
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1 w-full min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : items.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ItemCard item={item} />
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-zinc-800 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm h-full">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-600 mb-2">
                  <ArchiveX size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-100">No items found</h3>
                <p className="text-slate-500 dark:text-zinc-400 max-w-sm">
                  We couldn't find any items matching your current filters. Try relaxing your search criteria.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Filter Drawer for Mobile/Tablet */}
      <Sheet
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Apply Filters"
      >
        <FilterSidebar />
        <div className="mt-6">
          <button
            onClick={() => setIsFilterDrawerOpen(false)}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all"
          >
            Show Results
          </button>
        </div>
      </Sheet>
    </div>
  )
}

export default Home
