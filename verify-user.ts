import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    try {
        const teacher = await prisma.teacher.findUnique({
            where: { email: 'teacher@example.com' },
        })

        if (!teacher) {
            console.log('User NOT found')
            return
        }

        console.log('User found:', teacher.email)
        console.log('Password hash:', teacher.password)

        const isMatch = await compare('password123', teacher.password)
        console.log('Password match for "password123":', isMatch)

    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
