import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const teacherId = session.user.id

        // 1. Total Classes
        const totalClasses = await prisma.class.count({
            where: { teacherId },
        })

        // 2. Total Students (in teacher's classes)
        // This is a bit complex if students are shared, but let's count unique students in teacher's classes
        const classes = await prisma.class.findMany({
            where: { teacherId },
            select: { id: true },
        })
        const classIds = classes.map((c) => c.id)

        const totalStudents = await prisma.student.count({
            where: {
                classes: {
                    some: {
                        id: { in: classIds }
                    }
                }
            }
        })

        // 3. Recent Attendance (Today)
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const todayAttendance = await prisma.attendanceRecord.count({
            where: {
                timestamp: {
                    gte: startOfDay,
                },
                session: {
                    classId: { in: classIds }
                }
            }
        })

        return NextResponse.json({
            totalClasses,
            totalStudents,
            todayAttendance,
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
