'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/components/dashboard/auth-provider'
import { AuthGuard } from '@/components/dashboard/auth-guard'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/dashboard/login'

  // Login page renders without sidebar or auth guard
  if (isLoginPage) {
    return <AuthProvider>{children}</AuthProvider>
  }

  return (
    <AuthProvider>
      <AuthGuard>
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>
            <header className="flex h-14 items-center gap-2 border-b px-4">
              <SidebarTrigger />
            </header>
            <main className="flex-1 p-4 md:p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    </AuthProvider>
  )
}
