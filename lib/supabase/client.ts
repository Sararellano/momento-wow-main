import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://clgtmhgrozfdxumptomb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZ3RtaGdyb3pmZHh1bXB0b21iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNTQwMjAsImV4cCI6MjA4ODgzMDAyMH0.NDkbhcx9kEJRb6YF10n-Nd6mR8qM2LpG95edHg2r8c0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
