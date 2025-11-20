'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import QRCode from 'qrcode'
import { QRCodeSVG } from 'qrcode.react' // Added import for QRCodeSVG
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, ArrowLeft, QrCode, Users, Clock } from 'lucide-react' // Added imports for new icons
import Link from 'next/link' // Added import for Link

export default function AttendancePage() {
    const params = useParams()
    const classId = params.id as string
    const [qrCode, setQrCode] = useState('') // Changed qrUrl to qrCode
    const [token, setToken] = useState('')
    const [expiresAt, setExpiresAt] = useState<Date | null>(null)
    const [timeLeft, setTimeLeft] = useState(0)
    const [loading, setLoading] = useState(false) // Added loading state
    const [className, setClassName] = useState('Class Name') // Added className state for demonstration, replace with actual data fetching

    const generateQR = async () => {
        setLoading(true) // Set loading to true when starting generation
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
                // For QRCodeSVG, we pass the URL directly, not a data URL
                setQrCode(attendUrl)
            }
        } catch (error) {
            console.error('Error generating QR', error)
        } finally {
            setLoading(false) // Set loading to false when generation is complete
        }
    }

    useEffect(() => {
        // In a real app, you'd fetch the class name here
        // For now, it's a placeholder
        // fetch(`/api/classes/${classId}`).then(res => res.json()).then(data => setClassName(data.name));
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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/classes">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{className}</h2>
                        <p className="text-muted-foreground">تسجيل الحضور المباشر</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>رمز QR للحضور</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-6">
                        {qrCode ? (
                            <>
                                <div className="bg-white p-4 rounded-lg shadow-sm border">
                                    <QRCodeSVG value={qrCode} size={256} />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-sm text-muted-foreground">ينتهي الرمز خلال</p>
                                    <div className="text-4xl font-mono font-bold text-primary">
                                        {timeLeft} ثانية
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                                انقر على "توليد رمز جديد" للبدء
                            </div>
                        )}

                        <Button size="lg" onClick={generateQR} disabled={loading} className="w-full">
                            <RefreshCw className={`ml-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'جاري التوليد...' : 'توليد رمز جديد'}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>تعليمات</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <div className="bg-primary/10 p-3 rounded-full h-fit">
                                <QrCode className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">1. عرض الرمز</h3>
                                <p className="text-sm text-muted-foreground">اعرض هذا الرمز على الشاشة الكبيرة في الفصل.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-primary/10 p-3 rounded-full h-fit">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">2. مسح الطلاب</h3>
                                <p className="text-sm text-muted-foreground">يجب على الطلاب مسح الرمز باستخدام هواتفهم لتسجيل الحضور.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-primary/10 p-3 rounded-full h-fit">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium">3. التجديد التلقائي</h3>
                                <p className="text-sm text-muted-foreground">الرمز صالح لمدة 30 ثانية فقط. قم بتوليد رمز جديد إذا لزم الأمر.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
