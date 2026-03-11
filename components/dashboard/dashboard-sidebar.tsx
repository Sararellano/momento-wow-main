'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CalendarDays, LogOut, Sparkles } from 'lucide-react'
import { useAuth } from './auth-provider'
import { Badge } from '@/components/ui/badge'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar'

const navItems = [
  { href: '/dashboard', label: 'Panel General', icon: LayoutDashboard },
  { href: '/dashboard/rsvps', label: 'Confirmaciones', icon: Users },
  { href: '/dashboard/eventos', label: 'Eventos', icon: CalendarDays },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, role, signOut } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg">Momento Wow</span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.href} className="gap-3">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3">
        <SidebarSeparator />
        <div className="flex items-center gap-2 text-sm">
          <div className="flex-1 truncate">
            <p className="font-medium truncate">{user?.email}</p>
            <Badge variant={role === 'admin' ? 'default' : 'secondary'} className="text-xs mt-1">
              {role === 'admin' ? 'Admin' : 'Cliente'}
            </Badge>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
