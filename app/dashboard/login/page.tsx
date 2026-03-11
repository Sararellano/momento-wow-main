'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { LoginForm } from '@/components/dashboard/login-form'

export default function DashboardLoginPage() {
  const router = useRouter()

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.push('/dashboard')
    })

    return () => subscription.unsubscribe()
  }, [router])

  return <LoginForm />
}
