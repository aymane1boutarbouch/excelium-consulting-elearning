'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, CheckCircle, XCircle, Eye, Search, Filter,
  ArrowLeft, Download, FileText, Loader2, AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Props {
  initialPayments: any[]
}

export default function AdminPaymentsClient({ initialPayments }: Props) {
  const [payments, setPayments] = useState(initialPayments)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [search, setSearch] = useState('')
  const [selectedProof, setSelectedProof] = useState<any | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const filteredPayments = payments.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter
    const matchesSearch =
      p.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.reference_code?.toLowerCase().includes(search.toLowerCase()) ||
      p.courses?.title?.toLowerCase().includes(search.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const handleAction = async (paymentId: string, enrollmentId: string, status: 'approved' | 'rejected') => {
    setProcessingId(paymentId)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Update payment
      await (supabase as any).from('payments').update({
        status,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      }).eq('id', paymentId)

      // Update enrollment
      await (supabase as any).from('enrollments').update({
        status: status === 'approved' ? 'approved' : 'rejected',
        approved_at: status === 'approved' ? new Date().toISOString() : null,
        approved_by: status === 'approved' ? user?.id : null,
      }).eq('id', enrollmentId)

      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status } : p))
      toast.success(status === 'approved' ? 'Paiement approuvé ! Accès activé.' : 'Paiement refusé.')
    } catch (err: any) {
      toast.error('Erreur lors du traitement du paiement')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col p-4 md:p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-navy text-2xl">
              Gestion des Paiements par Virement
            </h1>
            <p className="text-muted-foreground text-sm">Vérification des preuves de paiement et activation des accès</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card-light p-4 rounded-2xl mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'pending', label: 'En attente' },
            { id: 'approved', label: 'Approuvés' },
            { id: 'rejected', label: 'Refusés' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap',
                filter === tab.id
                  ? 'bg-gold text-navy shadow-gold font-bold'
                  : 'text-muted-foreground hover:bg-muted'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher étudiant, réf..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card-light rounded-2xl overflow-hidden shadow-xl border border-border flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase">Étudiant</th>
                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase">Formation</th>
                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase">Référence</th>
                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase">Montant</th>
                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase">Statut</th>
                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map(payment => (
                  <tr key={payment.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-navy">{payment.profiles?.full_name}</div>
                      <div className="text-xs text-muted-foreground">{payment.profiles?.email}</div>
                    </td>
                    <td className="p-4 text-navy font-medium max-w-xs truncate">
                      {payment.courses?.title}
                    </td>
                    <td className="p-4 font-mono font-bold text-gold text-xs">
                      {payment.reference_code}
                    </td>
                    <td className="p-4 font-mono font-bold text-navy">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-semibold border',
                        payment.status === 'approved' ? 'bg-emerald/10 text-emerald border-emerald/20' :
                        payment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      )}>
                        {payment.status === 'approved' ? 'Approuvé' : payment.status === 'pending' ? 'En attente' : 'Refusé'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {payment.proof_file_path && (
                        <button
                          onClick={() => setSelectedProof(payment)}
                          className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Reçu
                        </button>
                      )}
                      {payment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(payment.id, payment.enrollment_id, 'approved')}
                            disabled={processingId === payment.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald text-white text-xs font-semibold hover:bg-emerald/90 inline-flex items-center gap-1 disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Valider
                          </button>
                          <button
                            onClick={() => handleAction(payment.id, payment.enrollment_id, 'rejected')}
                            disabled={processingId === payment.id}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20 border border-red-500/20 inline-flex items-center gap-1 disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Refuser
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Aucun paiement trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
