import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface SheetProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

const Sheet: React.FC<SheetProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Content */}
            <div className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col bg-white dark:bg-zinc-950 shadow-2xl transition-transform duration-300 transform translate-x-0 font-[Outfit]">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 p-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Sheet
