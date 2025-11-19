import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('password123', 12)
  
  const teacher = await prisma.teacher.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      name: 'John Doe',
      password,
      classes: {
        create: {
          name: 'Math 101',
          students: {
            create: [
              { name: 'Alice Smith', studentId: 'S1001' },
              { name: 'Bob Jones', studentId: 'S1002' },
            ],
          },
        },
      },
    },
  })

  console.log({ teacher })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
