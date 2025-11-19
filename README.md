# Student Attendance System

A full-stack student attendance system built with Next.js 14, Prisma, PostgreSQL, and TailwindCSS.

## Features

- **Teacher Dashboard**: Manage classes, students, and view attendance stats.
- **QR Attendance**: Generate dynamic QR codes for students to scan.
- **Student Interface**: Mobile-friendly page for students to mark attendance.
- **Secure**: NextAuth authentication, token validation, and device checks.

## Setup Instructions

### 1. Database Setup

This project uses PostgreSQL. You need a running Postgres instance.

1.  Copy `.env.example` to `.env` (or create `.env`):
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/attendance_db"
    NEXTAUTH_SECRET="your-secret-key"
    NEXTAUTH_URL="http://localhost:3000"
    ```
2.  Update `DATABASE_URL` with your actual connection string.

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

Run the following commands to create tables and seed initial data:

```bash
# Create tables
npx prisma migrate dev --name init

# Seed data (default teacher: teacher@example.com / password123)
npx prisma db seed
```

### 4. Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` to start.

## Deployment

- **Vercel**: Connect your repository and set the Environment Variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).
- **Database**: Use Supabase or NeonDB for a cloud Postgres database.

## Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components (Shadcn/UI).
- `src/lib`: Utility functions (Prisma, Auth).
- `prisma`: Database schema and seed script.
