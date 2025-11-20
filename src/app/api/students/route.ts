import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { name, studentId, classId } = await req.json()

        if (!name || !studentId || !classId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Verify class ownership
        const classRecord = await prisma.class.findUnique({
            where: { id: classId },
        })

        if (!classRecord || classRecord.teacherId !== session.user.id) {
            return NextResponse.json({ error: 'Class not found or unauthorized' }, { status: 404 })
        }

        // Create or update student and connect to class
        const student = await prisma.student.upsert({
            where: { studentId },
            update: {
                classes: {
                    connect: { id: classId }
                }
            },
            create: {
                name,
                studentId,
                classes: {
                    connect: { id: classId }
                }
            }
        })

        return NextResponse.json(student)
    } catch (error) {
        console.error('Error creating student:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Fetch students who are enrolled in any class taught by the teacher
        const students = await prisma.student.findMany({
            where: {
                classes: {
                    some: {
                        teacherId: session.user.id
                    }
                }
            },
            include: {
                classes: {
                    where: {
                        teacherId: session.user.id
                    },
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(students)
    } catch (error) {
        console.error('Error fetching students:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
