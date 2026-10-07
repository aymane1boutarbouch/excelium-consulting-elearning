import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'

export const metadata = {
  title: 'Administration — Excelium LMS',
}

export default async function AdminPage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/connexion?redirectTo=/admin')

  const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', session.user.id).single()
  if (!profile || (profile as any).role !== 'admin') redirect('/dashboard')

  // Fetch admin stats
  const [
    { count: totalStudents },
    { count: totalCourses },
    { count: pendingPayments },
    { count: totalEnrollments },
    { data: recentPayments },
    { data: recentEnrollments },
    { data: topCourses },
  ] = await Promise.all([
    (supabase as any).from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    (supabase as any).from('courses').select('*', { count: 'exact', head: true }).eq('is_published', true),
    (supabase as any).from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    (supabase as any).from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    (supabase as any).from('payments')
      .select(`*, profiles(full_name, email), courses(title)`)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5),
    (supabase as any).from('enrollments')
      .select(`*, profiles(full_name, email), courses(title)`)
      .order('enrolled_at', { ascending: false })
      .limit(5),
    (supabase as any).from('courses')
      .select('id, title, total_enrolled, rating_avg')
      .eq('is_published', true)
      .order('total_enrolled', { ascending: false })
      .limit(5),
  ])

  const stats = {
    totalStudents: totalStudents || 0,
    totalCourses: totalCourses || 0,
    pendingPayments: pendingPayments || 0,
    totalEnrollments: totalEnrollments || 0,
  }

  return (
    <AdminDashboardClient
      stats={stats}
      recentPayments={recentPayments || []}
      recentEnrollments={recentEnrollments || []}
      topCourses={topCourses || []}
    />
  )
}
