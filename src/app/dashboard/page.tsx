'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, CheckCircle } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalClasses: 0,
        totalStudents: 0,
        todayAttendance: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/dashboard/stats')
            .then((res) => res.json())
            .then((data) => {
                setStats(data)
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const data = [
        { name: 'Mon', attendance: 40 },
        { name: 'Tue', attendance: 30 },
        { name: 'Wed', attendance: 45 },
        { name: 'Thu', attendance: 50 },
        { name: 'Fri', attendance: 35 },
    ]

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : stats.totalClasses}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : stats.totalStudents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '...' : stats.todayAttendance}</div>
                        <p className="text-xs text-muted-foreground">Students present today</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Weekly Attendance Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip />
                                <Bar dataKey="attendance" fill="#0f172a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
