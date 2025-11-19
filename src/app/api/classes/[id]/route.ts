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
        const classId = id

        // Verify ownership
        const classRecord = await prisma.class.findUnique({
            where: { id: classId },
        })

        if (!classRecord || classRecord.teacherId !== session.user.id) {
            return NextResponse.json({ error: 'Class not found or unauthorized' }, { status: 404 })
        }

        // Delete class (cascade should handle relations if configured, but Prisma needs explicit delete for some relations usually unless configured in schema)
        // Schema didn't specify onDelete: Cascade, so we might need to clean up manually or update schema.
        // For now, let's try deleting. If it fails due to foreign keys, we'll know.
        // Actually, let's delete related sessions first to be safe.
        await prisma.attendanceSession.deleteMany({
            where: { classId },
        })

        // We also need to handle the many-to-many relation with students if we want to remove them from the class?
        // In Prisma implicit m-n, deleting the class removes the relation entry.
        // But we might want to keep students if they are in other classes.

        await prisma.class.delete({
            where: { id: classId },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting class:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
