import React, { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import FormationsClient from './FormationsClient'

export const metadata = {
  title: 'Catalogue des Formations — Excelium Consulting Compta',
  description: 'Découvrez nos formations professionnelles en comptabilité, fiscalité marocaine, gestion et informatique.',
}

export default async function FormationsPage() {
  const supabase = createServerSupabaseClient()

  const [{ data: courses }, { data: categories }] = await Promise.all([
    (supabase as any)
      .from('courses')
      .select(`
        *,
        categories (id, name, slug, color),
        profiles:instructor_id (full_name, avatar_url)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    (supabase as any)
      .from('categories')
      .select('*')
      .order('name', { ascending: true }),
  ])

  return (
    <Suspense fallback={<div className="min-h-screen bg-navy animate-pulse" />}>
      <FormationsClient
        initialCourses={courses || []}
        categories={categories || []}
      />
    </Suspense>
  )
}
