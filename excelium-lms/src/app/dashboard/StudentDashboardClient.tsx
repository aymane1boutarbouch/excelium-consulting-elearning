'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen, Clock, Award, TrendingUp, Play, Calendar,
  Bell, ChevronRight, Flame, Star, BarChart2, Video,
  CheckCircle, Lock, Download, LayoutDashboard, User,
  Settings, LogOut, GraduationCap, Menu, X, Zap
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Profile, Enrollment, LiveSession, Announcement, Certificate } from '@/types/database'
import { cn, formatDuration, getLevelLabel, getLevelColor, getEnrollmentStatusLabel, getEnrollmentStatusColor } from '@/lib/utils'
import CircularProgress from '@/components/ui/CircularProgress'

interface Props {
  profile: Profile
  enrollments: any[]
  liveSessions: LiveSession[]
  announcements: Announcement[]
  certificates: Certificate[]
}

const sidebarLinks = [
  { label: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard', active: true },
  { label: 'Mes formations', icon: BookOpen, href: '/dashboard/formations' },
  { label: 'Sessions en direct', icon: Video, href: '/dashboard/sessions' },
  { label: 'Mes certificats', icon: Award, href: '/dashboard/certificats' },
  { label: 'Mon profil', icon: User, href: '/dashboard/profil' },
  { label: 'Paramètres', icon: Settings, href: '/dashboard/parametres' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  }),
}

export default function StudentDashboardClient({ profile, enrollments, liveSessions, announcements, certificates }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const approvedEnrollments = enrollments.filter(e => e.status === 'approved')
  const pendingEnrollments = enrollments.filter(e => e.status === 'pending')
  const avgProgress = approvedEnrollments.length > 0
    ? Math.round(approvedEnrollments.reduce((sum, e) => sum + (e.completion_rate || 0), 0) / approvedEnrollments.length)
    : 0

  const firstName = profile.full_name?.split(' ')[0] || 'Apprenant'
  const greetingHour = new Date().getHours()
  const greeting = greetingHour < 12 ? 'Bonjour' : greetingHour < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy flex">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={cn(
          'fixed md:sticky top-0 left-0 h-screen z-50 md:z-auto',
          'w-64 bg-navy dark:bg-navy-800 border-r border-white/10',
          'flex flex-col transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}>
          {/* Logo */}
          <div className="p-5 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-gold flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-navy" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-xs leading-none">EXCELIUM</div>
                <div className="text-gold text-[10px] tracking-widest">LMS</div>
              </div>
            </Link>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-navy font-bold text-sm">
                {profile.full_name?.charAt(0) || 'E'}
              </div>
              <div className="min-w-0">
                <div className="text-white text-sm font-semibold truncate">{profile.full_name}</div>
                <div className="text-white/40 text-xs truncate">{profile.email}</div>
              </div>
            </div>
            {/* Level & XP */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-gold rounded-full transition-all duration-700"
                  style={{ width: `${(profile.xp_points % 1000) / 10}%` }}
                />
              </div>
              <span className="text-gold text-xs font-mono">Niv.{profile.level}</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn('sidebar-item', link.active && 'active')}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Signout */}
          <div className="p-3 border-t border-white/10">
            <a
              href="/auth/signout"
              className="sidebar-item text-white/50 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </a>
          </div>
        </aside>
      </>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-ivory/80 dark:bg-navy/80 backdrop-blur-md border-b border-border px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-muted-foreground text-xs">{format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}</p>
              <h1 className="font-display font-bold text-navy dark:text-white text-lg">
                {greeting}, {firstName} 👋
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Streak */}
            {profile.streak_days > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-orange-500 text-sm font-bold">{profile.streak_days}</span>
                <span className="text-orange-400 text-xs">jours</span>
              </div>
            )}
            {/* Notifications */}
            {pendingEnrollments.length > 0 && (
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-navy text-[10px] font-bold flex items-center justify-center">
                  {pendingEnrollments.length}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 md:p-8 space-y-8">
          {/* ── KPI Cards ──────────────────────────────────── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              {
                label: 'Formations actives',
                value: approvedEnrollments.length,
                icon: BookOpen,
                color: 'text-navy dark:text-blue-400',
                bg: 'bg-navy/5 dark:bg-blue-400/10',
              },
              {
                label: 'Progression moy.',
                value: `${avgProgress}%`,
                icon: TrendingUp,
                color: 'text-emerald',
                bg: 'bg-emerald/10',
              },
              {
                label: 'Certificats obtenus',
                value: certificates.length,
                icon: Award,
                color: 'text-gold',
                bg: 'bg-gold/10',
              },
              {
                label: 'Points XP',
                value: profile.xp_points.toLocaleString('fr-MA'),
                icon: Zap,
                color: 'text-purple-500',
                bg: 'bg-purple-500/10',
              },
            ].map((kpi, i) => {
              const Icon = kpi.icon
              return (
                <motion.div
                  key={kpi.label}
                  custom={i}
                  variants={fadeUp}
                  className="glass-card-light dark:glass-card p-5 rounded-2xl"
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', kpi.bg)}>
                    <Icon className={cn('w-5 h-5', kpi.color)} />
                  </div>
                  <div className="font-display text-2xl font-bold text-navy dark:text-white font-mono">
                    {kpi.value}
                  </div>
                  <div className="text-muted-foreground text-xs mt-0.5">{kpi.label}</div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* ── Continue Learning ─────────────────────────── */}
          {approvedEnrollments.length > 0 && (
            <motion.section custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-navy dark:text-white text-xl">
                  Continuer l&apos;apprentissage
                </h2>
                <Link href="/dashboard/formations" className="text-gold text-sm hover:underline flex items-center gap-1">
                  Tout voir <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedEnrollments.slice(0, 3).map((enrollment, i) => (
                  <motion.div
                    key={enrollment.id}
                    custom={i}
                    variants={fadeUp}
                    className="glass-card-light dark:glass-card rounded-2xl overflow-hidden group hover:shadow-card-hover transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-36 bg-gradient-navy overflow-hidden">
                      {enrollment.courses?.thumbnail_url ? (
                        <img
                          src={enrollment.courses.thumbnail_url}
                          alt={enrollment.courses.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {/* Progress ring */}
                      <div className="absolute bottom-2 right-2">
                        <CircularProgress
                          progress={enrollment.completion_rate || 0}
                          size={40}
                          strokeWidth={3}
                        />
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-navy dark:text-white text-sm mb-2 line-clamp-2">
                        {enrollment.courses?.title}
                      </h3>
                      {/* Progress bar */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-gold rounded-full transition-all duration-700"
                            style={{ width: `${enrollment.completion_rate || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          {Math.round(enrollment.completion_rate || 0)}%
                        </span>
                      </div>

                      <Link
                        href={`/apprendre/${enrollment.courses?.slug}`}
                        className="flex items-center gap-2 btn-navy text-xs px-4 py-2 rounded-xl w-full justify-center"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {enrollment.completion_rate > 0 ? 'Continuer' : 'Commencer'}
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Empty state */}
          {approvedEnrollments.length === 0 && (
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="glass-card-light dark:glass-card rounded-3xl p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-gold" />
              </div>
              <h3 className="font-display text-xl font-bold text-navy dark:text-white mb-2">
                Vous n&apos;êtes inscrit à aucune formation
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Explorez notre catalogue et inscrivez-vous à votre première formation.
              </p>
              <Link href="/formations" className="btn-gold rounded-xl px-6 py-3 inline-flex">
                Explorer les formations
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          {/* ── Pending payments ─────────────────────────── */}
          {pendingEnrollments.length > 0 && (
            <motion.section custom={5} variants={fadeUp} initial="hidden" animate="visible">
              <h2 className="font-display font-bold text-navy dark:text-white text-xl mb-4">
                Paiements en attente
              </h2>
              <div className="space-y-3">
                {pendingEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="glass-card-light dark:glass-card p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-navy dark:text-white text-sm">
                          {enrollment.courses?.title}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Réf: <span className="font-mono font-semibold">{enrollment.reference_code}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                      En attente de validation
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ── Upcoming sessions ────────────────────────── */}
          {liveSessions.length > 0 && (
            <motion.section custom={6} variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-navy dark:text-white text-xl">
                  Sessions en direct à venir
                </h2>
                <Link href="/dashboard/sessions" className="text-gold text-sm hover:underline flex items-center gap-1">
                  Voir tout <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {liveSessions.map((session, i) => (
                  <motion.div
                    key={session.id}
                    custom={i}
                    variants={fadeUp}
                    className="glass-card-light dark:glass-card p-5 rounded-2xl border border-blue-500/20"
                  >
                    <div className="flex items-center gap-2 text-xs text-blue-500 font-semibold mb-3">
                      <Video className="w-3.5 h-3.5" />
                      Session en direct
                    </div>
                    <h3 className="font-semibold text-navy dark:text-white text-sm mb-2">{session.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(session.scheduled_at), 'EEEE d MMMM à HH:mm', { locale: fr })}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-4">
                      <Clock className="w-3.5 h-3.5" />
                      Durée : {session.duration_minutes} min
                    </div>
                    <Link
                      href={`/dashboard/sessions/${session.id}`}
                      className="btn-navy text-xs px-4 py-2 rounded-xl w-full justify-center flex items-center gap-2"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Voir les détails
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ── Certificates ─────────────────────────────── */}
          {certificates.length > 0 && (
            <motion.section custom={7} variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-navy dark:text-white text-xl">
                  Mes certificats
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {certificates.slice(0, 2).map((cert) => (
                  <div key={cert.id} className="glass-card-light dark:glass-card p-5 rounded-2xl border border-gold/20 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-navy" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-navy dark:text-white text-sm truncate">
                        Certificat de formation
                      </div>
                      <div className="text-muted-foreground text-xs font-mono">
                        N° {cert.certificate_number}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {format(new Date(cert.issued_at), 'd MMMM yyyy', { locale: fr })}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/certificats/${cert.id}`}
                      className="btn-outline-gold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </Link>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>
    </div>
  )
}
