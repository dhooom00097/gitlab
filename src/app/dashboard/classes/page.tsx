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
            toast.error('Failed to fetch classes')
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
                toast.success('Class created')
                setNewClassName('')
                setIsDialogOpen(false)
                fetchClasses()
            } else {
                toast.error('Failed to create class')
            }
        } catch (error) {
            toast.error('Error creating class')
        }
    }

    const handleDeleteClass = async (id: string) => {
        if (!confirm('Are you sure? This will delete all data for this class.')) return

        try {
            const res = await fetch(`/api/classes/${id}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                toast.success('Class deleted')
                fetchClasses()
            } else {
                toast.error('Failed to delete class')
            }
        } catch (error) {
            toast.error('Error deleting class')
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">My Classes</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Class</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateClass} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Class Name</Label>
                                <Input
                                    id="name"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                    placeholder="e.g. Math 101"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Create</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div>Loading...</div>
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
                                    {cls._count.students} Students • {cls._count.sessions} Sessions
                                </div>
                                <Link href={`/dashboard/attendance/${cls.id}`}>
                                    <Button className="w-full">
                                        <QrCode className="mr-2 h-4 w-4" /> Start Attendance
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
