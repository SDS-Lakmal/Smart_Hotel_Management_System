
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Sidebar from '@/components/Sidebar'

const font = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Housekeeping Management',
    description: 'Smart Hotel Housekeeping Dashboard',
}


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={`${font.className} min-h-[calc(100vh-theme(spacing.16))] h-full flex flex-col md:flex-row bg-slate-50 text-slate-800 selection:bg-blue-100 selection:text-blue-900`}>
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto max-h-screen">
                <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    )
}
