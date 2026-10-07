import { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StudentDashboardClient from './StudentDashboardClient'

export const metadata = {
  title: 'Mon Tableau de Bord',
  description: 'Votre espace apprenant Excelium Consulting Compta',
}

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/connexion?redirectTo=/dashboard')

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) redirect('/connexion')
  if ((profile as any).role === 'admin') redirect('/admin')

  // Fetch enrollments with course info
  const { data: enrollments } = await (supabase as any)
    .from('enrollments')
    .select(`
      *,
      courses (
        id, title, slug, thumbnail_url, total_lessons, duration_hours, level,
        categories (name, color)
      )
    `)
    .eq('student_id', session.user.id)
    .order('enrolled_at', { ascending: false })

  // Fetch upcoming live sessions
  const { data: liveSessions } = await (supabase as any)
    .from('live_sessions')
    .select('*')
    .gte('scheduled_at', new Date().toISOString())
    .eq('status', 'scheduled')
    .order('scheduled_at', { ascending: true })
    .limit(3)

  // Fetch announcements
  const { data: announcements } = await (supabase as any)
    .from('announcements')
    .select('*')
    .eq('is_published', true)
    .is('course_id', null)
    .order('created_at', { ascending: false })
    .limit(3)

  // Fetch certificates
  const { data: certificates } = await (supabase as any)
    .from('certificates')
    .select('*')
    .eq('student_id', session.user.id)
    .eq('is_revoked', false)
    .order('issued_at', { ascending: false })

  return (
    <Suspense fallback={<div className="min-h-screen bg-background animate-pulse" />}>
      <StudentDashboardClient
        profile={profile}
        enrollments={enrollments || []}
        liveSessions={liveSessions || []}
        announcements={announcements || []}
        certificates={certificates || []}
      />
    </Suspense>
  )
}
