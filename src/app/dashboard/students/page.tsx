'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Student {
    id: string
    name: string
    studentId: string
    classes: { id: string; name: string }[]
}

interface ClassItem {
    id: string
    name: string
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([])
    const [classes, setClasses] = useState<ClassItem[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [newStudentName, setNewStudentName] = useState('')
    const [newStudentId, setNewStudentId] = useState('')
    const [selectedClassId, setSelectedClassId] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [studentsRes, classesRes] = await Promise.all([
                fetch('/api/students'), // We need to implement GET /api/students
                fetch('/api/classes')
            ])

            if (studentsRes.ok) setStudents(await studentsRes.json())
            if (classesRes.ok) setClasses(await classesRes.json())
        } catch (error) {
            toast.error('Failed to fetch data')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateStudent = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newStudentName,
                    studentId: newStudentId,
                    classId: selectedClassId
                }),
            })

            if (res.ok) {
                toast.success('Student added')
                setNewStudentName('')
                setNewStudentId('')
                setSelectedClassId('')
                setIsDialogOpen(false)
                fetchData()
            } else {
                toast.error('Failed to add student')
            }
        } catch (error) {
            toast.error('Error adding student')
        }
    }

    const handleDeleteStudent = async (id: string) => {
        if (!confirm('Are you sure?')) return

        try {
            const res = await fetch(`/api/students/${id}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                toast.success('Student deleted')
                fetchData()
            } else {
                toast.error('Failed to delete student')
            }
        } catch (error) {
            toast.error('Error deleting student')
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Students</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Student
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Student</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateStudent} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={newStudentName}
                                    onChange={(e) => setNewStudentName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="studentId">Student ID</Label>
                                <Input
                                    id="studentId"
                                    value={newStudentId}
                                    onChange={(e) => setNewStudentId(e.target.value)}
                                    placeholder="S12345"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="class">Class</Label>
                                <Select value={selectedClassId} onValueChange={setSelectedClassId} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">Add Student</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {students.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-sm text-muted-foreground">ID: {student.studentId}</p>
                                    <div className="flex gap-2 mt-1">
                                        {student.classes.map((c) => (
                                            <span key={c.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {c.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                        {students.length === 0 && !loading && (
                            <p className="text-center text-muted-foreground py-8">No students found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
