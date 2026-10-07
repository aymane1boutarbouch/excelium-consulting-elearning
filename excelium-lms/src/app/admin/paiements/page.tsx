import React, { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminPaymentsClient from './AdminPaymentsClient'

export const metadata = {
  title: 'Gestion des Paiements — Excelium LMS Admin',
}

export default async function AdminPaymentsPage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/connexion?redirectTo=/admin/paiements')

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile || (profile as any).role !== 'admin') redirect('/dashboard')

  const { data: payments } = await (supabase as any)
    .from('payments')
    .select(`
      *,
      profiles:student_id (full_name, email, phone),
      courses (title, price, currency)
    `)
    .order('created_at', { ascending: false })

  return (
    <Suspense fallback={<div className="min-h-screen bg-navy animate-pulse" />}>
      <AdminPaymentsClient initialPayments={payments || []} />
    </Suspense>
  )
}
