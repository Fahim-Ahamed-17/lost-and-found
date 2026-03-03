import React from 'react'
import ItemCard from '../../components/shared/ItemCard'
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
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
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
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
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
    category: 'Accessories',
    location: 'Gym',
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
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
    category: 'Accessories',
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
]

const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-emerald-100 via-white to-teal-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-900/60 font-[Outfit] transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="text-center space-y-4 pt-8 pb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent fade-in">
            Recent Items
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Help us reunite lost items with their owners. Browse recently reported items below.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {MOCK_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ItemCard item={item} />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Home

