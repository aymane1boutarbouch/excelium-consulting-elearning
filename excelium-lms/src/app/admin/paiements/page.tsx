import React, { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminPaymentsClient from './AdminPaymentsClient'

export const metadata = {
  title: 'Gestion des Paiements — Excelium LMS Admin',
}

export default async function AdminPaymentsPage() {
  const supabase = createServerSupabaseClient()
  const isDevDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

  const { data: { session } } = await supabase.auth.getSession()

  if (!session && !isDevDemo) redirect('/connexion?redirectTo=/admin/paiements')

  if (session) {
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || (profile as any).role !== 'admin') redirect('/dashboard')
  }

  let payments: any[] = []

  try {
    const { data } = await (supabase as any)
      .from('payments')
      .select(`
        *,
        profiles:student_id (full_name, email, phone),
        courses (title, price, currency)
      `)
      .order('created_at', { ascending: false })

    payments = data || []
  } catch {}

  if (isDevDemo || payments.length === 0) {
    payments = [
      {
        id: 'pay-01',
        enrollment_id: 'enr-01',
        amount: 1490,
        currency: 'MAD',
        reference_code: 'EXC-2026-9481',
        status: 'pending',
        created_at: new Date().toISOString(),
        proof_file_path: 'payment-proofs/demo/receipt.pdf',
        profiles: { full_name: 'Karim Bencherif', email: 'k.bencherif@gmail.com', phone: '+212661001122' },
        courses: { title: 'Pratique de la Liasse Fiscale Marocaine & IS 2026' }
      },
      {
        id: 'pay-02',
        enrollment_id: 'enr-02',
        amount: 1250,
        currency: 'MAD',
        reference_code: 'EXC-2026-3820',
        status: 'pending',
        created_at: new Date().toISOString(),
        proof_file_path: 'payment-proofs/demo/receipt2.pdf',
        profiles: { full_name: 'Sara Loudiyi', email: 'sara.loudiyi@outlook.com', phone: '+212662334455' },
        courses: { title: 'Comptabilité Générale des Sociétés (PCM)' }
      },
      {
        id: 'pay-03',
        enrollment_id: 'enr-03',
        amount: 990,
        currency: 'MAD',
        reference_code: 'EXC-2026-7712',
        status: 'pending',
        created_at: new Date().toISOString(),
        proof_file_path: 'payment-proofs/demo/receipt3.pdf',
        profiles: { full_name: 'Youssef Chraibi', email: 'ychraibi@fiduciaire.ma', phone: '+212663556677' },
        courses: { title: 'Gestion de la Paie & Télédéclarations SIMPL-CNSS' }
      }
    ]
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-navy animate-pulse" />}>
      <AdminPaymentsClient initialPayments={payments} />
    </Suspense>
  )
}
