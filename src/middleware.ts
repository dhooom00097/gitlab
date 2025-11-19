import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login",
    },
})

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/attendance/generate", // Protect QR generation
        "/api/classes/:path*", // Protect class management
    ],
}
