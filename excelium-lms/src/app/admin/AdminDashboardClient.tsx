'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users, BookOpen, CreditCard, TrendingUp, Clock,
  CheckCircle, XCircle, Eye, ArrowRight, BarChart2,
  Plus, Settings, GraduationCap, Video, Award,
  Bell, FileText, LayoutDashboard, ChevronRight, Star, AlertCircle, Upload, Sparkles
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { formatCurrency, cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import FormationImporterModal from '@/components/admin/FormationImporterModal'
import { ParsedFormation } from '@/lib/importers/formationParser'

interface Props {
  stats: {
    totalStudents: number
    totalCourses: number
    pendingPayments: number
    totalEnrollments: number
  }
  recentPayments: any[]
  recentEnrollments: any[]
  topCourses: any[]
}

export default function AdminDashboardClient({ stats, recentPayments, recentEnrollments, topCourses }: Props) {
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)
  const [isImporterOpen, setIsImporterOpen] = useState(false)

  const handlePaymentAction = async (paymentId: string, enrollmentId: string, action: 'approved' | 'rejected') => {
    setProcessingPayment(paymentId)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Update payment
      await (supabase as any).from('payments').update({
        status: action,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      }).eq('id', paymentId)

      // Update enrollment
      await (supabase as any).from('enrollments').update({
        status: action === 'approved' ? 'approved' : 'rejected',
        approved_at: action === 'approved' ? new Date().toISOString() : null,
        approved_by: action === 'approved' ? user?.id : null,
      }).eq('id', enrollmentId)

      toast.success(action === 'approved' ? 'Paiement approuvé ! Accès accordé.' : 'Paiement refusé.')
    } catch (err: any) {
      toast.error(err.message || 'Action exécutée en mode démo')
    } finally {
      setProcessingPayment(null)
    }
  }

  const handleImportSuccess = (imported: ParsedFormation[]) => {
    toast.success(`${imported.length} formation(s) ajoutée(s) au catalogue !`)
  }

  const kpis = [
    {
      label: 'Étudiants inscrits',
      value: stats.totalStudents.toLocaleString('fr-MA'),
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      change: '+12%',
    },
    {
      label: 'Formations publiées',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-navy dark:text-blue-300',
      bg: 'bg-navy/5 dark:bg-blue-300/10',
      change: '+3',
    },
    {
      label: 'Paiements en attente',
      value: stats.pendingPayments,
      icon: CreditCard,
      color: stats.pendingPayments > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-emerald',
      bg: stats.pendingPayments > 0 ? 'bg-yellow-500/10' : 'bg-emerald/10',
      alert: stats.pendingPayments > 0,
    },
    {
      label: 'Inscriptions actives',
      value: stats.totalEnrollments.toLocaleString('fr-MA'),
      icon: TrendingUp,
      color: 'text-gold',
      bg: 'bg-gold/10',
      change: '+24%',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Importer Modal */}
      <FormationImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* Quick Hero Banner for Easy Control & Creator */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-light dark:glass-card p-6 rounded-3xl border border-border bg-gradient-to-r from-navy via-navy-900 to-navy text-white relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" /> CENTRE DE CRÉATION &amp; CONTRÔLE ADMIN
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight">
            Pilotez votre plateforme et importez vos formations en 1-clic
          </h1>
          <p className="text-white/70 text-xs md:text-sm">
            Importez des cours complets depuis des fichiers Word (.docx) ou Excel (.xlsx), gérez vos inscriptions et validez les virement bancaires instantanément.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full md:w-auto">
          <button
            onClick={() => setIsImporterOpen(true)}
            className="w-full sm:w-auto btn-gold px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-gold text-navy"
          >
            <Upload className="w-4 h-4" /> Importer Word / Excel
          </button>
          <Link
            href="/admin/formations/nouveau"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-white/20 hover:border-gold text-white text-xs font-bold flex items-center justify-center gap-2 transition-all bg-white/5 hover:bg-white/10"
          >
            <Plus className="w-4 h-4 text-gold" /> Créer Manuellement
          </Link>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08 } }}
              className="glass-card-light dark:glass-card p-5 rounded-2xl border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', kpi.bg)}>
                  <Icon className={cn('w-5 h-5', kpi.color)} />
                </div>
                {kpi.alert && (
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
                )}
                {kpi.change && (
                  <span className="text-emerald text-xs font-semibold bg-emerald/10 px-2 py-0.5 rounded-full">
                    {kpi.change}
                  </span>
                )}
              </div>
              <div className="font-display text-2xl font-bold text-navy dark:text-white font-mono">
                {kpi.value}
              </div>
              <div className="text-muted-foreground text-xs mt-0.5">{kpi.label}</div>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending payments panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-navy dark:text-white text-lg">
              Paiements en attente de validation
            </h2>
            <Link href="/admin/paiements" className="text-gold text-xs font-bold hover:underline flex items-center gap-1">
              Voir tous ({stats.pendingPayments}) <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentPayments.length === 0 ? (
            <div className="glass-card-light dark:glass-card p-8 rounded-2xl text-center border border-border">
              <CheckCircle className="w-10 h-10 text-emerald mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Tous les paiements sont validés !</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="glass-card-light dark:glass-card p-4 rounded-2xl border border-border">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-navy dark:text-white text-sm">
                        {payment.profiles?.full_name || 'Étudiant'}
                      </div>
                      <div className="text-muted-foreground text-xs truncate">
                        {payment.courses?.title}
                      </div>
                      <div className="text-muted-foreground text-[11px] font-mono mt-0.5">
                        Réf: <span className="text-gold font-bold">{payment.reference_code}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-navy dark:text-white text-sm font-mono">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                      <div className="text-muted-foreground text-[11px]">
                        {format(new Date(payment.created_at), 'd MMM yyyy', { locale: fr })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePaymentAction(payment.id, payment.enrollment_id, 'approved')}
                      disabled={processingPayment === payment.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald/10 text-emerald border border-emerald/20 hover:bg-emerald/20 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approuver le virement
                    </button>
                    <button
                      onClick={() => handlePaymentAction(payment.id, payment.enrollment_id, 'rejected')}
                      disabled={processingPayment === payment.id}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Top courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-navy dark:text-white text-lg">
              Formations phares
            </h2>
            <Link href="/admin/formations" className="text-gold text-xs font-bold hover:underline flex items-center gap-1">
              Gérer le catalogue <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {topCourses.map((course, i) => (
              <div key={course.id} className="glass-card-light dark:glass-card p-4 rounded-2xl flex items-center gap-4 border border-border">
                <div className="w-8 h-8 rounded-xl bg-gold/15 text-gold font-bold text-xs flex items-center justify-center font-mono">
                  0{i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-navy dark:text-white text-sm truncate">
                    {course.title}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gold" />
                      {course.total_enrolled} inscrits
                    </span>
                    {course.rating_avg > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-gold text-gold" />
                        {course.rating_avg.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/admin/formations/${course.id}`}
                  className="px-3 py-1.5 rounded-xl bg-navy/5 dark:bg-white/5 hover:bg-gold hover:text-navy text-xs font-bold transition-all text-navy dark:text-white"
                >
                  Modifier
                </Link>
              </div>
            ))}
            <button
              onClick={() => setIsImporterOpen(true)}
              className="w-full p-4 rounded-2xl border-2 border-dashed border-gold/40 hover:border-gold bg-gold/5 text-center text-xs font-bold text-gold transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Importer une formation depuis Word ou Excel
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
