'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function StudentAttendPage() {
    const params = useParams()
    const token = params.token as string
    const [studentId, setStudentId] = useState('')
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [studentName, setStudentName] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/attendance/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    studentId,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(true)
                setStudentName(data.studentName)
            } else {
                setError(data.error || 'فشل في تسجيل الحضور')
            }
        } catch (error) {
            setError('حدث خطأ ما. يرجى المحاولة مرة أخرى.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl text-green-700">تم تسجيل الحضور بنجاح!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600">
                            أهلاً بك، <span className="font-bold text-gray-900">{studentName}</span>
                        </p>
                        <p className="text-sm text-gray-500">تم تسجيل حضورك لهذه الجلسة.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">تسجيل الحضور</CardTitle>
                    <CardDescription className="text-center">
                        أدخل رقمك الجامعي لتسجيل الحضور
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="studentId">الرقم الجامعي</Label>
                            <Input
                                id="studentId"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="مثال: 441234567"
                                required
                                className="text-center text-lg tracking-widest"
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? 'جاري التسجيل...' : 'تسجيل الحضور'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
