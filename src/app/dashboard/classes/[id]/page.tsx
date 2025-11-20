'use client'

import { useEffect, useState, use } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface AttendanceData {
    class: {
        id: string
        name: string
    }
    sessions: {
        id: string
        date: string
    }[]
    students: {
        id: string
        name: string
        studentId: string
        attendance: Record<string, boolean>
        totalPresent: number
        totalSessions: number
        percentage: number
    }[]
}

export default function ClassAttendancePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [data, setData] = useState<AttendanceData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAttendance()
    }, [id])

    const fetchAttendance = async () => {
        try {
            const res = await fetch(`/api/classes/${id}/attendance`)
            if (res.ok) {
                setData(await res.json())
            } else {
                toast.error('Failed to fetch attendance data')
            }
        } catch (error) {
            toast.error('Error fetching data')
        } finally {
            setLoading(false)
        }
    }

    const downloadCSV = () => {
        if (!data) return

        // Create CSV header
        const headers = ['Student Name', 'Student ID', ...data.sessions.map(s => new Date(s.date).toLocaleDateString()), 'Total Present', 'Percentage']

        // Create CSV rows
        const rows = data.students.map(student => [
            student.name,
            student.studentId,
            ...data.sessions.map(s => student.attendance[s.id] ? 'Present' : 'Absent'),
            student.totalPresent,
            `${student.percentage}%`
        ])

        // Combine and convert to CSV string
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        // Trigger download
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${data.class.name}_attendance.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    if (loading) return <div className="p-8">جاري التحميل...</div>
    if (!data) return <div className="p-8">الفصل غير موجود</div>

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/classes">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{data.class.name}</h2>
                        <p className="text-muted-foreground">تقرير الحضور</p>
                    </div>
                </div>
                <Button onClick={downloadCSV}>
                    <Download className="ml-2 h-4 w-4" /> تصدير CSV
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>سجل الحضور</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">اسم الطالب</TableHead>
                                    <TableHead>الرقم الجامعي</TableHead>
                                    {data.sessions.map(session => (
                                        <TableHead key={session.id} className="text-center whitespace-nowrap">
                                            {new Date(session.date).toLocaleDateString('ar-SA')}
                                        </TableHead>
                                    ))}
                                    <TableHead className="text-left">الإجمالي</TableHead>
                                    <TableHead className="text-left">%</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.students.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell>{student.studentId}</TableCell>
                                        {data.sessions.map(session => (
                                            <TableCell key={session.id} className="text-center">
                                                {student.attendance[session.id] ? (
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                                        ح
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                                                        غ
                                                    </span>
                                                )}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-left">{student.totalPresent}/{student.totalSessions}</TableCell>
                                        <TableCell className="text-left">{student.percentage}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
