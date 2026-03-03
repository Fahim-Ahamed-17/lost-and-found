import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { MapPin, Calendar, Tag } from 'lucide-react'
import type { Item } from '../../types/item'

interface ItemCardProps {
    item: Item
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
    const isLost = item.type === 'lost'

    // Default image if none provided
    const imageUrl = item.images && item.images.length > 0
        ? item.images[0]
        : 'https://images.unsplash.com/photo-1588636402741-fcf03c7344eb?q=80&w=800&auto=format&fit=crop' // placeholder

    return (
        <div className="group bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col h-full transform-gpu transition-all duration-500 ease-out will-change-transform">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-zinc-800">
                <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transform-gpu transition-transform duration-1000 ease-out will-change-transform"
                />
                {/* Type Badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md ${isLost
                        ? 'bg-rose-500/90 text-white border border-rose-400/20'
                        : 'bg-emerald-500/90 text-white border border-emerald-400/20'
                        }`}>
                        {isLost ? 'LOST' : 'FOUND'}
                    </span>
                    {item.status === 'claimed' && (
                        <span className="px-3 py-1 text-xs font-bold rounded-full shadow-sm backdrop-blur-md bg-slate-800/90 text-white border border-slate-600/20">
                            CLAIMED
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-[Outfit] font-semibold text-lg text-slate-900 dark:text-zinc-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                    </h3>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                    {item.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 gap-2">
                        <Tag size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">{item.category}</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 gap-2">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 gap-2">
                        <Calendar size={14} className="text-slate-400 shrink-0" />
                        <span>{format(new Date(item.date), 'MMM d, yyyy')}</span>
                    </div>
                </div>

                {/* Action */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 mt-auto">
                    <Link
                        to={`/items/${item.id}`}
                        className="block w-full text-center py-2.5 bg-slate-50 hover:bg-emerald-50 dark:bg-zinc-800/50 dark:hover:bg-emerald-900/20 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium rounded-xl transition-colors text-sm"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ItemCard
