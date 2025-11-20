import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const studentId = id

        // Verify student belongs to one of the teacher's classes
        const student = await prisma.student.findFirst({
            where: {
                id: studentId,
                classes: {
                    some: {
                        teacherId: session.user.id
                    }
                }
            }
        })

        if (!student) {
            return NextResponse.json({ error: 'Student not found or unauthorized' }, { status: 404 })
        }

        // Delete the student
        // Note: This will also delete attendance records due to cascade if configured, 
        // but Prisma default is to require explicit deletion or cascade setup in schema.
        // Assuming we want to remove the student entirely.
        await prisma.student.delete({
            where: { id: studentId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting student:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
