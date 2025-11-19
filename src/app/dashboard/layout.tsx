'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Users, LogOut, QrCode } from 'lucide-react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const { data: session } = useSession()

    const navItems = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/classes', label: 'Classes', icon: Users },
    ]

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-primary">Attendance Sys</h1>
                    <p className="text-sm text-gray-500">Teacher Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-2",
                                        pathname === item.href && "bg-gray-100 text-primary font-medium"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t">
                    <div className="mb-4 px-4">
                        <p className="text-sm font-medium">{session?.user?.name}</p>
                        <p className="text-xs text-gray-500">{session?.user?.email}</p>
                    </div>
                    <Button
                        variant="destructive"
                        className="w-full justify-start gap-2"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
