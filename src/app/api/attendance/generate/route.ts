import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { classId } = await req.json()

        if (!classId) {
            return NextResponse.json({ error: 'Class ID is required' }, { status: 400 })
        }

        // Verify teacher owns the class
        const classRecord = await prisma.class.findUnique({
            where: { id: classId },
        })

        if (!classRecord || classRecord.teacherId !== session.user.id) {
            return NextResponse.json({ error: 'Class not found or unauthorized' }, { status: 404 })
        }

        // Deactivate previous active sessions for this class (optional, but good for cleanup)
        await prisma.attendanceSession.updateMany({
            where: { classId, isActive: true },
            data: { isActive: false },
        })

        // Create new session
        const token = randomUUID()
        const expiresAt = new Date(Date.now() + 60 * 1000) // 1 minute expiry

        const newSession = await prisma.attendanceSession.create({
            data: {
                classId,
                token,
                expiresAt,
            },
        })

        return NextResponse.json({ token: newSession.token, expiresAt: newSession.expiresAt })
    } catch (error) {
        console.error('Error generating QR:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
