'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function StudentAttendPage() {
    const params = useParams()
    const token = params.token as string
    const [studentId, setStudentId] = useState('')
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')

        try {
            // Get device info (simple user agent for now)
            const deviceInfo = navigator.userAgent

            const res = await fetch('/api/attendance/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    studentId,
                    deviceInfo,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setStatus('success')
            } else {
                setStatus('error')
                setErrorMessage(data.error || 'Failed to submit attendance')
            }
        } catch (error) {
            setStatus('error')
            setErrorMessage('Network error. Please try again.')
        }
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <CardTitle className="text-green-700">Attendance Recorded!</CardTitle>
                        <CardDescription>
                            You have successfully marked your attendance.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Mark Attendance</CardTitle>
                    <CardDescription>Enter your Student ID to mark your presence.</CardDescription>
                </CardHeader>
                <CardContent>
                    {status === 'error' && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2 text-sm">
                            <XCircle className="w-4 h-4" />
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="studentId" className="text-sm font-medium">
                                Student ID
                            </label>
                            <Input
                                id="studentId"
                                placeholder="e.g. S12345"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                                disabled={status === 'submitting'}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={status === 'submitting'}
                        >
                            {status === 'submitting' ? 'Submitting...' : 'Submit Attendance'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
