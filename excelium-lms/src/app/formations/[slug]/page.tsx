import React, { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CourseDetailClient from './CourseDetailClient'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const supabase = createServerSupabaseClient()
  const { data: course } = await (supabase as any)
    .from('courses')
    .select('title, description')
    .eq('slug', params.slug)
    .single()

  if (!course) return { title: 'Formation non trouvée' }

  return {
    title: `${course.title} — Excelium Consulting Compta`,
    description: course.description,
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: course } = await (supabase as any)
    .from('courses')
    .select(`
      *,
      categories (name, slug, color),
      profiles:instructor_id (full_name, bio, avatar_url),
      modules (
        id, title, description, order_index,
        lessons (id, title, duration_minutes, is_free_preview, order_index)
      )
    `)
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!course) notFound()

  // Sort modules & lessons
  if (course.modules) {
    course.modules.sort((a: any, b: any) => a.order_index - b.order_index)
    course.modules.forEach((mod: any) => {
      if (mod.lessons) mod.lessons.sort((a: any, b: any) => a.order_index - b.order_index)
    })
  }

  // Check if user is already enrolled
  let existingEnrollment = null
  if (session) {
    const { data: enroll } = await (supabase as any)
      .from('enrollments')
      .select('*')
      .eq('course_id', course.id)
      .eq('student_id', session.user.id)
      .maybeSingle()
    existingEnrollment = enroll
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-navy animate-pulse" />}>
      <CourseDetailClient
        course={course}
        userId={session?.user?.id || null}
        existingEnrollment={existingEnrollment}
      />
    </Suspense>
  )
}
