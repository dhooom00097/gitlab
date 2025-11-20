'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QrCode, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface ClassItem {
    id: string
    name: string
    _count: {
        students: number
        sessions: number
    }
}

export default function ClassesPage() {
    const [classes, setClasses] = useState<ClassItem[]>([])
    const [loading, setLoading] = useState(true)
    const [newClassName, setNewClassName] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    useEffect(() => {
        fetchClasses()
    }, [])

    const fetchClasses = async () => {
        try {
            const res = await fetch('/api/classes')
            const data = await res.json()
            setClasses(data)
        } catch (error) {
            toast.error('فشل في تحميل الفصول')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/classes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newClassName }),
            })

            if (res.ok) {
                toast.success('تم إنشاء الفصل')
                setNewClassName('')
                setIsDialogOpen(false)
                fetchClasses()
            } else {
                toast.error('فشل في إنشاء الفصل')
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء إنشاء الفصل')
        }
    }

    const handleDeleteClass = async (id: string) => {
        if (!confirm('هل أنت متأكد؟ سيتم حذف جميع البيانات المتعلقة بهذا الفصل.')) return

        try {
            const res = await fetch(`/api/classes/${id}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                toast.success('تم حذف الفصل')
                fetchClasses()
            } else {
                toast.error('فشل في حذف الفصل')
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء حذف الفصل')
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">فصولي</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="ml-2 h-4 w-4" /> إنشاء فصل
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>إنشاء فصل جديد</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateClass} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">اسم الفصل</Label>
                                <Input
                                    id="name"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                    placeholder="مثال: رياضيات 101"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">إنشاء</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div>جاري التحميل...</div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {classes.map((cls) => (
                        <Card key={cls.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">{cls.name}</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClass(cls.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground mb-4">
                                    {cls._count.students} طالب • {cls._count.sessions} جلسة
                                </div>
                                <Link href={`/dashboard/attendance/${cls.id}`}>
                                    <Button className="w-full mb-2">
                                        <QrCode className="ml-2 h-4 w-4" /> بدء الحضور
                                    </Button>
                                </Link>
                                <Link href={`/dashboard/classes/${cls.id}`}>
                                    <Button variant="outline" className="w-full">
                                        عرض التقارير
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
