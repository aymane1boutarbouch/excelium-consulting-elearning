'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Users, BookOpen, CreditCard, TrendingUp, Clock,
  CheckCircle, XCircle, Eye, ArrowRight, BarChart2,
  Plus, Settings, GraduationCap, Video, Award,
  Bell, FileText, LayoutDashboard, LogOut, Menu, X,
  ChevronRight, Star, AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { formatCurrency, cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

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

const adminLinks = [
  { label: 'Tableau de bord', icon: LayoutDashboard, href: '/admin', active: true },
  { label: 'Formations', icon: BookOpen, href: '/admin/formations' },
  { label: 'Étudiants', icon: Users, href: '/admin/etudiants' },
  { label: 'Paiements', icon: CreditCard, href: '/admin/paiements', badge: 'pending' },
  { label: 'Inscriptions', icon: FileText, href: '/admin/inscriptions' },
  { label: 'Quiz & Examens', icon: FileText, href: '/admin/quiz' },
  { label: 'Sessions live', icon: Video, href: '/admin/sessions' },
  { label: 'Certificats', icon: Award, href: '/admin/certificats' },
  { label: 'Annonces', icon: Bell, href: '/admin/annonces' },
  { label: 'Paramètres', icon: Settings, href: '/admin/parametres' },
]

export default function AdminDashboardClient({ stats, recentPayments, recentEnrollments, topCourses }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)

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

      toast.success(action === 'approved' ? 'Paiement approuvé ! L\'étudiant a maintenant accès.' : 'Paiement refusé.')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setProcessingPayment(null)
    }
  }

  const kpis = [
    {
      label: 'Étudiants inscrits',
      value: stats.totalStudents.toLocaleString('fr-MA'),
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      change: '+12%',
      trend: 'up',
    },
    {
      label: 'Formations publiées',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-navy dark:text-blue-300',
      bg: 'bg-navy/5 dark:bg-blue-300/10',
      change: '+3',
      trend: 'up',
    },
    {
      label: 'Paiements en attente',
      value: stats.pendingPayments,
      icon: CreditCard,
      color: stats.pendingPayments > 0 ? 'text-yellow-600' : 'text-emerald',
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
      trend: 'up',
    },
  ]

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy flex">
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Admin Sidebar */}
      <aside className={cn(
        'fixed md:sticky top-0 left-0 h-screen z-50 md:z-auto',
        'w-64 bg-navy dark:bg-navy-900 border-r border-white/10',
        'flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-gold flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-navy" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-xs">EXCELIUM ADMIN</div>
              <div className="text-gold text-[10px] tracking-widest">PANNEAU D&apos;ADMINISTRATION</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => {
            const Icon = link.icon
            const hasBadge = link.badge === 'pending' && stats.pendingPayments > 0
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn('sidebar-item relative', link.active && 'active')}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{link.label}</span>
                {hasBadge && (
                  <span className="w-5 h-5 rounded-full bg-yellow-500 text-navy text-[10px] font-bold flex items-center justify-center">
                    {stats.pendingPayments}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <Link href="/" className="sidebar-item text-white/50 hover:text-white" target="_blank">
            <Eye className="w-4 h-4" />
            <span>Voir le site</span>
          </Link>
          <a href="/auth/signout" className="sidebar-item text-white/50 hover:text-red-400 hover:bg-red-500/10">
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-ivory/80 dark:bg-navy/80 backdrop-blur-md border-b border-border px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-muted">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-muted-foreground text-xs">{format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}</p>
              <h1 className="font-display font-bold text-navy dark:text-white text-xl">Tableau de bord</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {stats.pendingPayments > 0 && (
              <Link href="/admin/paiements" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{stats.pendingPayments} paiement{stats.pendingPayments > 1 ? 's' : ''} en attente</span>
              </Link>
            )}
            <Link href="/admin/formations/nouveau" className="btn-gold text-sm px-4 py-2 rounded-xl">
              <Plus className="w-4 h-4" />
              Nouveau cours
            </Link>
          </div>
        </div>

        <div className="p-4 md:p-8 space-y-8">
          {/* KPI Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {kpis.map((kpi, i) => {
              const Icon = kpi.icon
              return (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                  className="glass-card-light dark:glass-card p-5 rounded-2xl"
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
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-navy dark:text-white text-lg">
                  Paiements en attente
                </h2>
                <Link href="/admin/paiements" className="text-gold text-sm hover:underline">
                  Voir tous <ChevronRight className="w-4 h-4 inline" />
                </Link>
              </div>

              {recentPayments.length === 0 ? (
                <div className="glass-card-light dark:glass-card p-8 rounded-2xl text-center">
                  <CheckCircle className="w-10 h-10 text-emerald mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">Aucun paiement en attente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="glass-card-light dark:glass-card p-4 rounded-2xl">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-navy dark:text-white text-sm">
                            {payment.profiles?.full_name || 'Étudiant'}
                          </div>
                          <div className="text-muted-foreground text-xs truncate">
                            {payment.courses?.title}
                          </div>
                          <div className="text-muted-foreground text-xs font-mono mt-0.5">
                            Réf: {payment.reference_code}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-navy dark:text-white text-sm font-mono">
                            {formatCurrency(payment.amount, payment.currency)}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {format(new Date(payment.created_at), 'd MMM', { locale: fr })}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {payment.proof_file_path && (
                          <a
                            href={`/api/admin/payment-proof/${payment.id}`}
                            target="_blank"
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground text-xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> Voir preuve
                          </a>
                        )}
                        <button
                          onClick={() => handlePaymentAction(payment.id, payment.enrollment_id, 'approved')}
                          disabled={processingPayment === payment.id}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald/10 text-emerald border border-emerald/20 hover:bg-emerald/20 text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approuver
                        </button>
                        <button
                          onClick={() => handlePaymentAction(payment.id, payment.enrollment_id, 'rejected')}
                          disabled={processingPayment === payment.id}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold transition-colors disabled:opacity-50"
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
              animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-navy dark:text-white text-lg">
                  Meilleures formations
                </h2>
                <Link href="/admin/formations" className="text-gold text-sm hover:underline">
                  Gérer <ChevronRight className="w-4 h-4 inline" />
                </Link>
              </div>
              <div className="space-y-3">
                {topCourses.map((course, i) => (
                  <div key={course.id} className="glass-card-light dark:glass-card p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold font-bold text-sm flex items-center justify-center font-mono">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-navy dark:text-white text-sm truncate">
                        {course.title}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
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
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
                <Link
                  href="/admin/formations/nouveau"
                  className="block glass-card-light dark:glass-card p-4 rounded-2xl border-2 border-dashed border-gold/20 hover:border-gold/40 text-center text-sm text-muted-foreground hover:text-gold transition-all"
                >
                  <Plus className="w-4 h-4 mx-auto mb-1" />
                  Ajouter une formation
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Recent enrollments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-navy dark:text-white text-lg">
                Inscriptions récentes
              </h2>
              <Link href="/admin/inscriptions" className="text-gold text-sm hover:underline">
                Voir tout <ChevronRight className="w-4 h-4 inline" />
              </Link>
            </div>
            <div className="glass-card-light dark:glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Étudiant</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Formation</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-navy/10 dark:bg-gold/10 flex items-center justify-center text-xs font-bold text-navy dark:text-gold">
                              {enrollment.profiles?.full_name?.charAt(0) || 'E'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-navy dark:text-white">
                                {enrollment.profiles?.full_name}
                              </div>
                              <div className="text-xs text-muted-foreground">{enrollment.profiles?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-navy dark:text-white max-w-[200px] truncate">
                          {enrollment.courses?.title}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {format(new Date(enrollment.enrolled_at), 'd MMM yyyy', { locale: fr })}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-semibold border',
                            enrollment.status === 'approved' ? 'bg-emerald/10 text-emerald border-emerald/20' :
                            enrollment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                            'bg-red-500/10 text-red-500 border-red-500/20'
                          )}>
                            {enrollment.status === 'approved' ? 'Approuvé' :
                             enrollment.status === 'pending' ? 'En attente' : 'Refusé'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}
          >
            <h2 className="font-display font-bold text-navy dark:text-white text-lg mb-4">Actions rapides</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Nouvelle formation', icon: BookOpen, href: '/admin/formations/nouveau', color: 'text-navy' },
                { label: 'Gérer étudiants', icon: Users, href: '/admin/etudiants', color: 'text-blue-500' },
                { label: 'Créer un quiz', icon: FileText, href: '/admin/quiz/nouveau', color: 'text-purple-500' },
                { label: 'Planifier session', icon: Video, href: '/admin/sessions/nouvelle', color: 'text-emerald' },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="glass-card-light dark:glass-card p-4 rounded-2xl flex flex-col items-center gap-2 text-center hover:border-gold/30 hover:shadow-gold transition-all group"
                  >
                    <Icon className={cn('w-6 h-6 group-hover:scale-110 transition-transform', action.color)} />
                    <span className="text-xs font-medium text-navy dark:text-white">{action.label}</span>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
