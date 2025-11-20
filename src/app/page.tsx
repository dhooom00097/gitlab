import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QrCode, ShieldCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <QrCode className="h-6 w-6" />
          <span className="mr-2 font-bold">نظام الحضور</span>
        </Link>
        <nav className="mr-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            دخول المعلمين
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  نظام ذكي لتسجيل الحضور
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  أنشئ رموز QR ديناميكية لتسجيل حضور الطلاب بشكل فوري وآمن. وداعاً للأوراق التقليدية.
                </p>
              </div>
              <div className="space-x-4 space-x-reverse">
                <Link href="/login">
                  <Button size="lg">ابدأ الآن</Button>
                </Link>
                <Link href="https://github.com/dhooom00097/gitlab" target="_blank">
                  <Button variant="outline" size="lg">عرض الكود</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="p-2 bg-black bg-opacity-5 rounded-full">
                  <QrCode className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">رموز QR ديناميكية</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  رموز محددة بوقت لمنع المشاركة وضمان تواجد الطلاب فعلياً.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="p-2 bg-black bg-opacity-5 rounded-full">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">تحقق آمن</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  التحقق من بصمة الجهاز وعنوان IP لمنع التلاعب في الحضور.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="p-2 bg-black bg-opacity-5 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">إدارة الفصول</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  لوحة تحكم سهلة للمعلمين لإدارة الفصول وعرض التقارير.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 نظام الحضور. جميع الحقوق محفوظة.</p>
        <nav className="sm:mr-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            شروط الخدمة
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            الخصوصية
          </Link>
        </nav>
      </footer>
    </div>
  );
}
