import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchItemById,
    clearItemDetail
} from '../../features/items/itemDetailSlice'
import type { AppDispatch, RootState } from '../../app/store'
import {
    MapPin,
    Calendar,
    User,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    AlertCircle,
    Hash,
    Info
} from 'lucide-react'
import { format } from 'date-fns'

const ItemDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { item, loading, error } = useSelector((state: RootState) => state.itemDetail)
    const { user } = useSelector((state: RootState) => state.auth)

    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        if (id) {
            dispatch(fetchItemById(id))
        }
        return () => {
            dispatch(clearItemDetail())
        }
    }, [id, dispatch])

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8 bg-slate-50 dark:bg-zinc-950 font-[Outfit]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 dark:text-zinc-400 font-medium">Loading details...</p>
                </div>
            </div>
        )
    }

    if (error || !item) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-8 bg-slate-50 dark:bg-zinc-950 font-[Outfit]">
                <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-zinc-900 p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-zinc-800">
                    <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 italic">Item Not Found</h2>
                    <p className="text-slate-500 dark:text-zinc-400">
                        {error || "We couldn't find the item you're looking for."}
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-200 dark:shadow-none active:scale-95"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    const isOwner = user?.id === item.posterId
    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % item.images.length)
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length)

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-emerald-100 via-white to-teal-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-900/60 font-[Outfit] pb-24 relative overflow-hidden transition-colors duration-500">

            {/* Premium Corner Patterns */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                {/* Top Left Dot Grid */}
                <div
                    className="absolute top-0 left-0 w-[300px] h-[300px] opacity-[0.15] dark:opacity-[0.1]"
                    style={{
                        backgroundImage: `radial-gradient(circle, #10b981 1.5px, transparent 1.5px)`,
                        backgroundSize: '24px 24px'
                    }}
                />
                {/* Bottom Right Dot Grid */}
                <div
                    className="absolute bottom-0 right-0 w-[400px] h-[400px] opacity-[0.15] dark:opacity-[0.1]"
                    style={{
                        backgroundImage: `radial-gradient(circle, #14b8a6 1.5px, transparent 1.5px)`,
                        backgroundSize: '32px 32px'
                    }}
                />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-slate-600 dark:text-zinc-300 font-bold rounded-xl shadow-sm border border-slate-200/50 dark:border-zinc-800/50 hover:border-emerald-500 transition-all group active:scale-95"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Back</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${item.type === 'found'
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                            }`}>
                            {item.type}
                        </span>
                    </div>
                </div>

                <div className="space-y-8 sm:space-y-12">

                    {/* Hero Section - Image */}
                    <div className="relative z-0">
                        <div className="relative aspect-[16/10] sm:aspect-[21/9] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-2 sm:border-4 border-white dark:border-zinc-800 group bg-slate-200 dark:bg-zinc-800">
                            <img
                                src={item.images[currentImageIndex]}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />

                            {item.images.length > 1 && (
                                <>
                                    <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button onClick={prevImage} className="p-2 sm:p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40">
                                            <ChevronLeft size={20} />
                                        </button>
                                    </div>
                                    <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button onClick={nextImage} className="p-2 sm:p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Floating Bento Card */}
                        <div className="mt-[-3rem] sm:mt-[-6rem] relative z-10 px-2 sm:px-10">
                            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-6 sm:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-zinc-800/50">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">

                                    {/* Core Info */}
                                    <div className="lg:col-span-7 space-y-4 sm:space-y-8 text-center sm:text-left">
                                        <div className="space-y-2 sm:space-y-4">
                                            <h1 className="text-3xl sm:text-6xl font-black text-slate-900 dark:text-zinc-50 leading-tight">
                                                {item.title}
                                            </h1>
                                            <div className="flex items-center justify-center sm:justify-start gap-3 text-emerald-600 dark:text-emerald-400">
                                                <div className="hidden sm:block w-10 h-[2px] bg-emerald-500" />
                                                <span className="font-bold tracking-widest uppercase text-xs sm:text-sm">{item.category}</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 dark:text-zinc-400 text-base sm:text-xl leading-relaxed font-medium">
                                            {item.description}
                                        </p>

                                        <div className="pt-4 sm:pt-6">
                                            {isOwner ? (
                                                <div className="inline-flex items-center gap-3 px-5 py-3 sm:px-6 sm:py-4 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 rounded-xl sm:rounded-2xl border border-amber-200 dark:border-amber-900/30 font-bold shadow-sm">
                                                    <ShieldCheck size={18} />
                                                    <span className="text-sm sm:text-base">Your Posting</span>
                                                </div>
                                            ) : (
                                                <button className="w-full sm:w-auto px-8 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-lg sm:text-xl rounded-2xl sm:rounded-3xl shadow-xl shadow-emerald-200 dark:shadow-none transition-all hover:scale-102 active:scale-95 group flex items-center justify-center gap-3">
                                                    {item.type === 'found' ? 'I lost this' : 'I found this'}
                                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bento Grid */}
                                    <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">

                                        <div className="col-span-2 bg-slate-50 dark:bg-zinc-800/40 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-zinc-800/60 flex flex-col justify-between group hover:bg-white dark:hover:bg-zinc-800 transition-colors">
                                            <MapPin className="text-emerald-500 mb-4 sm:mb-0 group-hover:scale-110 transition-transform" size={20} />
                                            <div>
                                                <p className="text-[9px] uppercase font-black text-slate-400 dark:text-zinc-500 tracking-widest mb-1">Seen At</p>
                                                <h4 className="text-base sm:text-xl font-bold text-slate-800 dark:text-zinc-200">{item.location}</h4>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 dark:bg-zinc-800/40 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-zinc-800/60 flex flex-col justify-between group hover:bg-white dark:hover:bg-zinc-800 transition-colors">
                                            <Calendar className="text-teal-500 mb-4 sm:mb-0 group-hover:scale-110 transition-transform" size={20} />
                                            <div>
                                                <p className="text-[9px] uppercase font-black text-slate-400 dark:text-zinc-500 tracking-widest mb-1">Reported</p>
                                                <h4 className="text-sm sm:text-lg font-bold text-slate-800 dark:text-zinc-200">
                                                    {format(new Date(item.date), 'MMM dd')}
                                                </h4>
                                            </div>
                                        </div>

                                        <div className="bg-emerald-600 dark:bg-emerald-500 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl flex flex-col justify-between text-white group">
                                            <User className="text-emerald-200 mb-4 sm:mb-0 group-hover:scale-110 transition-transform" size={20} />
                                            <div>
                                                <p className="text-[9px] uppercase font-black text-emerald-100 tracking-widest mb-1">Posted By</p>
                                                <h4 className="text-sm sm:text-lg font-black truncate">{item.posterName || 'Anonymous'}</h4>
                                            </div>
                                        </div>

                                        <div className="col-span-2 border-2 border-dashed border-slate-200 dark:border-zinc-800 p-3 sm:p-4 rounded-xl flex items-center justify-between text-slate-400 dark:text-zinc-600">
                                            <div className="flex items-center gap-2">
                                                <Hash size={14} />
                                                <span className="text-[10px] font-mono font-bold tracking-tighter uppercase">{item.id}</span>
                                            </div>
                                            <Info size={14} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Section */}
                    {item.images.length > 1 && (
                        <div className="pt-4 sm:pt-12 overflow-hidden">
                            <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-zinc-100 mb-4 sm:mb-6 px-4">Gallery</h3>
                            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 px-4 scrollbar-none">
                                {item.images.map((img: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImageIndex(i)}
                                        className={`relative w-40 sm:w-64 aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border-2 sm:border-4 transition-all shrink-0 shadow-lg ${i === currentImageIndex ? 'border-emerald-500 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default ItemDetail
