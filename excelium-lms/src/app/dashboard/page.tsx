import { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StudentDashboardClient from './StudentDashboardClient'

export const metadata = {
  title: 'Mon Tableau de Bord — Excelium Consulting Compta',
  description: 'Votre espace apprenant Excelium Consulting Compta',
}

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const isDevDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

  const { data: { session } } = await supabase.auth.getSession()

  if (!session && !isDevDemo) redirect('/connexion?redirectTo=/dashboard')

  let profile: any = null
  let enrollments: any[] = []
  let liveSessions: any[] = []
  let announcements: any[] = []
  let certificates: any[] = []

  if (session) {
    try {
      const { data: p } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      profile = p
      if (profile && (profile as any).role === 'admin') redirect('/admin')

      const [
        { data: dEnrollments },
        { data: dLive },
        { data: dAnnouncements },
        { data: dCertificates }
      ] = await Promise.all([
        (supabase as any).from('enrollments').select(`*, courses (*)`).eq('student_id', session.user.id),
        (supabase as any).from('live_sessions').select('*').gte('scheduled_at', new Date().toISOString()).limit(3),
        (supabase as any).from('announcements').select('*').eq('is_published', true).limit(3),
        (supabase as any).from('certificates').select('*').eq('student_id', session.user.id).eq('is_revoked', false),
      ])

      enrollments = dEnrollments || []
      liveSessions = dLive || []
      announcements = dAnnouncements || []
      certificates = dCertificates || []
    } catch {}
  }

  // Fallbacks for dev demo mode
  if (!profile) {
    profile = {
      id: 'demo-student-id',
      full_name: 'Mohammed Al Fassi',
      email: 'm.alfassi@excelium.ma',
      phone: '+212600000000',
      role: 'student',
      avatar_url: null,
      level: 3,
      xp_points: 1450,
      streak_days: 5,
    }
  }

  if (enrollments.length === 0) {
    enrollments = [
      {
        id: 'enr-demo-1',
        status: 'approved',
        completion_rate: 65,
        reference_code: 'EXC-2026-9481',
        enrolled_at: new Date().toISOString(),
        courses: {
          id: 'c-01',
          title: 'Pratique de la Liasse Fiscale Marocaine & IS 2026',
          slug: 'liasse-fiscale-marocaine',
          thumbnail_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
          total_lessons: 12,
          duration_hours: 18,
          level: 'avance',
        }
      },
      {
        id: 'enr-demo-2',
        status: 'approved',
        completion_rate: 30,
        reference_code: 'EXC-2026-3820',
        enrolled_at: new Date().toISOString(),
        courses: {
          id: 'c-02',
          title: 'Comptabilité Générale des Sociétés (PCM)',
          slug: 'comptabilite-societes-pcm',
          thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
          total_lessons: 16,
          duration_hours: 24,
          level: 'intermediaire',
        }
      }
    ]
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-navy animate-pulse" />}>
      <StudentDashboardClient
        profile={profile}
        enrollments={enrollments}
        liveSessions={liveSessions}
        announcements={announcements}
        certificates={certificates}
      />
    </Suspense>
  )
}
