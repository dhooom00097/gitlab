'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { LayoutDashboard, Users, School, LogOut, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { data: session } = useSession()

    const navigation = [
        { name: 'نظرة عامة', href: '/dashboard', icon: LayoutDashboard },
        { name: 'فصولي', href: '/dashboard/classes', icon: School },
        { name: 'الطلاب', href: '/dashboard/students', icon: Users },
    ]

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 right-0 z-50 w-64 bg-white border-l shadow-sm hidden md:block">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                        <QrCode className="h-6 w-6" />
                        <span>نظام الحضور</span>
                    </Link>
                </div>
                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="md:mr-64 min-h-screen flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-40">
                    <h1 className="text-xl font-semibold">
                        {navigation.find((n) => n.href === pathname)?.name || 'لوحة التحكم'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar>
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.email}`} />
                                        <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer">
                                    <LogOut className="ml-2 h-4 w-4" />
                                    تسجيل الخروج
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
