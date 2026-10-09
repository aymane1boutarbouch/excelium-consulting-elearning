import React, { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import LearningPlayerClient from './LearningPlayerClient'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const supabase = createServerSupabaseClient()
  const { data: course } = await (supabase as any)
    .from('courses')
    .select('title')
    .eq('slug', params.slug)
    .single()

  if (!course) return { title: 'Apprentissage' }
  return { title: `${course.title} — Espace de cours` }
}

export default async function LearningPage({ params }: Props) {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect(`/connexion?redirectTo=/apprendre/${params.slug}`)

  // Fetch course details with modules, lessons, resources & quizzes
  const { data: course } = await (supabase as any)
    .from('courses')
    .select(`
      *,
      modules (
        id, title, order_index,
        lessons (
          id, title, content, video_url, duration_minutes, is_free_preview, order_index,
          lesson_resources (id, title, file_path, file_type, file_size),
          quizzes (id, title, passing_score, duration_minutes)
        )
      )
    `)
    .eq('slug', params.slug)
    .single()

  if (!course) notFound()

  // Sort modules & lessons
  if (course.modules) {
    course.modules.sort((a: any, b: any) => a.order_index - b.order_index)
    course.modules.forEach((mod: any) => {
      if (mod.lessons) mod.lessons.sort((a: any, b: any) => a.order_index - b.order_index)
    })
  }

  // Verify approved enrollment
  const { data: enrollment } = await (supabase as any)
    .from('enrollments')
    .select('*')
    .eq('course_id', course.id)
    .eq('student_id', session.user.id)
    .single()

  if (!enrollment || enrollment.status !== 'approved') {
    redirect(`/formations/${params.slug}`)
  }

  // Fetch user lesson progress
  const { data: progress } = await (supabase as any)
    .from('lesson_progress')
    .select('*')
    .eq('enrollment_id', enrollment.id)

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F3] animate-pulse" />}>
      <LearningPlayerClient
        course={course}
        enrollment={enrollment}
        initialProgress={progress || []}
      />
    </Suspense>
  )
}
