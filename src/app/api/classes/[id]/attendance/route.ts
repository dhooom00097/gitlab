import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const classId = id

        // Verify class ownership
        const classRecord = await prisma.class.findUnique({
            where: { id: classId },
            include: {
                students: {
                    orderBy: { name: 'asc' }
                },
                sessions: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!classRecord || classRecord.teacherId !== session.user.id) {
            return NextResponse.json({ error: 'Class not found or unauthorized' }, { status: 404 })
        }

        // Fetch all attendance records for this class's sessions
        const attendanceRecords = await prisma.attendanceRecord.findMany({
            where: {
                session: {
                    classId: classId
                }
            },
            include: {
                session: true
            }
        })

        // Transform data for the frontend
        // We want a list of students, and for each student, their attendance status for each session
        const sessions = classRecord.sessions
        const students = classRecord.students.map(student => {
            const studentAttendance = attendanceRecords.filter(r => r.studentId === student.id)

            const attendanceBySession: Record<string, boolean> = {}
            sessions.forEach(session => {
                attendanceBySession[session.id] = studentAttendance.some(r => r.sessionId === session.id)
            })

            return {
                id: student.id,
                name: student.name,
                studentId: student.studentId,
                attendance: attendanceBySession,
                totalPresent: studentAttendance.length,
                totalSessions: sessions.length,
                percentage: sessions.length > 0
                    ? Math.round((studentAttendance.length / sessions.length) * 100)
                    : 0
            }
        })

        return NextResponse.json({
            class: {
                id: classRecord.id,
                name: classRecord.name
            },
            sessions: sessions.map(s => ({
                id: s.id,
                date: s.createdAt
            })),
            students
        })

    } catch (error) {
        console.error('Error fetching class attendance:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
