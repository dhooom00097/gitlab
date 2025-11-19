import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const classes = await prisma.class.findMany({
            where: { teacherId: session.user.id },
            include: {
                _count: {
                    select: { students: true, sessions: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(classes)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { name } = await req.json()

        if (!name) {
            return NextResponse.json({ error: 'Class name is required' }, { status: 400 })
        }

        const newClass = await prisma.class.create({
            data: {
                name,
                teacherId: session.user.id,
            },
        })

        return NextResponse.json(newClass)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
