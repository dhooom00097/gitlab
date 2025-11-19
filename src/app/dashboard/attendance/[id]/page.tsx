'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import QRCode from 'qrcode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

export default function AttendancePage() {
    const params = useParams()
    const classId = params.id as string
    const [qrUrl, setQrUrl] = useState('')
    const [token, setToken] = useState('')
    const [expiresAt, setExpiresAt] = useState<Date | null>(null)
    const [timeLeft, setTimeLeft] = useState(0)

    const generateQR = async () => {
        try {
            const res = await fetch('/api/attendance/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classId }),
            })
            const data = await res.json()

            if (data.token) {
                setToken(data.token)
                setExpiresAt(new Date(data.expiresAt))

                // Create the URL that students will scan
                // Assuming the app is deployed or local, we use window.location.origin
                const attendUrl = `${window.location.origin}/attend/${data.token}`
                const qrDataUrl = await QRCode.toDataURL(attendUrl)
                setQrUrl(qrDataUrl)
            }
        } catch (error) {
            console.error('Error generating QR', error)
        }
    }

    useEffect(() => {
        generateQR()
    }, [])

    useEffect(() => {
        if (!expiresAt) return

        const interval = setInterval(() => {
            const now = new Date()
            const diff = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000))
            setTimeLeft(diff)

            if (diff === 0) {
                // Expired
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [expiresAt])

    return (
        <div className="space-y-8 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold">Live Attendance</h2>

            <Card className="p-8">
                <CardContent className="flex flex-col items-center space-y-6">
                    {qrUrl ? (
                        <>
                            <div className="relative">
                                <img src={qrUrl} alt="Attendance QR Code" className="w-64 h-64" />
                                {timeLeft === 0 && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                        <span className="text-red-500 font-bold text-xl">Expired</span>
                                    </div>
                                )}
                            </div>

                            <div className="text-2xl font-mono font-bold">
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>

                            <Button onClick={generateQR} disabled={timeLeft > 10}>
                                <RefreshCw className="mr-2 h-4 w-4" /> Regenerate QR
                            </Button>

                            <p className="text-sm text-muted-foreground">
                                Scan this code to mark attendance.
                            </p>
                        </>
                    ) : (
                        <div>Generating QR...</div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
