import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const teacher = await prisma.teacher.findUnique({
                    where: {
                        email: credentials.email,
                    },
                })

                if (!teacher) {
                    return null
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    teacher.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: teacher.id,
                    email: teacher.email,
                    name: teacher.name,
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                },
            }
        },
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id,
                }
            }
            return token
        },
    },
}
