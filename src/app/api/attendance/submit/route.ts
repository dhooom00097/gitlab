import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(req: Request) {
    try {
        const { token, studentId, deviceInfo } = await req.json()
        const headersList = await headers()
        const ipAddress = headersList.get('x-forwarded-for') || 'unknown'

        if (!token || !studentId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Find the session by token
        const session = await prisma.attendanceSession.findUnique({
            where: { token },
            include: { class: true },
        })

        if (!session) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
        }

        // 2. Check if session is active and not expired
        if (!session.isActive) {
            return NextResponse.json({ error: 'Session is no longer active' }, { status: 400 })
        }

        if (new Date() > session.expiresAt) {
            return NextResponse.json({ error: 'QR code has expired' }, { status: 400 })
        }

        // 3. Find the student (by custom studentId, e.g. "S1001")
        const student = await prisma.student.findUnique({
            where: { studentId },
        })

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 })
        }

        // 4. Check if student belongs to the class (optional, depending on rules. Assuming yes for security)
        // For now, we'll assume if they have the QR and valid ID, they can mark. 
        // But strictly, we should check enrollment.
        // Let's check enrollment:
        const enrollment = await prisma.class.findFirst({
            where: {
                id: session.classId,
                students: {
                    some: {
                        id: student.id
                    }
                }
            }
        })

        if (!enrollment) {
            return NextResponse.json({ error: 'Student is not enrolled in this class' }, { status: 403 })
        }

        // 5. Check for duplicate attendance
        const existingRecord = await prisma.attendanceRecord.findUnique({
            where: {
                studentId_sessionId: {
                    studentId: student.id,
                    sessionId: session.id,
                },
            },
        })

        if (existingRecord) {
            return NextResponse.json({ error: 'Attendance already recorded' }, { status: 409 })
        }

        // 6. Record attendance
        await prisma.attendanceRecord.create({
            data: {
                studentId: student.id,
                sessionId: session.id,
                ipAddress,
                deviceInfo,
            },
        })

        return NextResponse.json({ success: true, message: 'Attendance marked successfully' })
    } catch (error) {
        console.error('Error submitting attendance:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
