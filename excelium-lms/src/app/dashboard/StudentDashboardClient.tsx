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
    <div className="min-h-screen bg-[#FAF8F3] flex">
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
          'w-64 bg-white border-r border-[#E7E2D6]',
          'flex flex-col transition-transform duration-300 shadow-sm md:shadow-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}>
          {/* Logo */}
          <div className="p-5 border-b border-[#E7E2D6]">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A24B] to-[#A0782E] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-serif font-bold text-[#0A1F44] text-xs leading-none">EXCELIUM</div>
                <div className="text-[#C9A24B] text-[10px] tracking-widest font-mono">LMS APPRENANT</div>
              </div>
            </Link>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-[#E7E2D6]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A24B] to-[#A0782E] flex items-center justify-center text-white font-bold text-sm">
                {profile.full_name?.charAt(0) || 'E'}
              </div>
              <div className="min-w-0">
                <div className="text-[#0A1F44] text-sm font-semibold truncate">{profile.full_name}</div>
                <div className="text-[#475569] text-xs truncate">{profile.email}</div>
              </div>
            </div>
            {/* Level & XP */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-[#E7E2D6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A24B] to-[#E8D099] rounded-full transition-all duration-700"
                  style={{ width: `${(profile.xp_points % 1000) / 10}%` }}
                />
              </div>
              <span className="text-[#C9A24B] text-xs font-mono">Niv.{profile.level}</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
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
          <div className="p-3 border-t border-[#E7E2D6]">
            <a
              href="/auth/signout"
              className="sidebar-item hover:text-red-600 hover:bg-red-50"
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
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E7E2D6] px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-muted-foreground text-xs">{format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}</p>
              <h1 className="font-display font-bold text-navy text-lg">
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
                color: 'text-navy',
                bg: 'bg-navy/5',
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
                  className="bg-white p-5 rounded-2xl border border-[#E7E2D6] shadow-sm"
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', kpi.bg)}>
                    <Icon className={cn('w-5 h-5', kpi.color)} />
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#0A1F44] font-mono">
                    {kpi.value}
                  </div>
                  <div className="text-[#475569] text-xs font-medium mt-1">{kpi.label}</div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* ── Continue Learning ─────────────────────────── */}
          {approvedEnrollments.length > 0 && (
            <motion.section custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif font-bold text-[#0A1F44] text-xl">
                  Continuer l&apos;apprentissage
                </h2>
                <Link href="/dashboard/formations" className="text-[#C9A24B] text-sm hover:underline flex items-center gap-1 font-semibold">
                  Tout voir <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedEnrollments.slice(0, 3).map((enrollment, i) => (
                  <motion.div
                    key={enrollment.id}
                    custom={i}
                    variants={fadeUp}
                    className="bg-white border border-[#E7E2D6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-36 bg-[#0A1F44] overflow-hidden">
                      {enrollment.courses?.thumbnail_url ? (
                        <img
                          src={enrollment.courses.thumbnail_url}
                          alt={enrollment.courses.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-[#C9A24B]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {/* Progress ring */}
                      <div className="absolute bottom-2 right-2">
                        <CircularProgress
                          progress={enrollment.completion_rate || 0}
                          size={40}
                          strokeWidth={3}
                        />
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-[#0A1F44] text-base mb-2 line-clamp-2">
                        {enrollment.courses?.title}
                      </h3>
                      {/* Progress bar */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex-1 h-2 bg-[#FAF8F3] border border-[#E7E2D6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C9A24B] to-[#E8D099] rounded-full transition-all duration-700"
                            style={{ width: `${enrollment.completion_rate || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#475569] font-mono font-semibold">
                          {Math.round(enrollment.completion_rate || 0)}%
                        </span>
                      </div>

                      <Link
                        href={`/apprendre/${enrollment.courses?.slug}`}
                        className="flex items-center gap-2 min-h-[44px] bg-[#0A1F44] hover:bg-[#081836] text-white text-xs font-semibold px-4 py-2.5 rounded-xl w-full justify-center shadow-sm transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-[#C9A24B]" />
                        {enrollment.completion_rate > 0 ? 'Continuer le cours' : 'Commencer le cours'}
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
              className="glass-card-light rounded-3xl p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-gold" />
              </div>
              <h3 className="font-display text-xl font-bold text-navy mb-2">
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
              <h2 className="font-serif font-bold text-[#0A1F44] text-xl mb-4">
                Paiements en attente
              </h2>
              <div className="space-y-3">
                {pendingEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="bg-white p-5 rounded-2xl border border-[#E7E2D6] shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#0A1F44] text-base">
                          {enrollment.courses?.title}
                        </div>
                        <div className="text-[#475569] text-xs">
                          Réf: <span className="font-mono font-semibold">{enrollment.reference_code}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-800 border-amber-200">
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
                <h2 className="font-serif font-bold text-[#0A1F44] text-xl">
                  Sessions en direct à venir
                </h2>
                <Link href="/dashboard/sessions" className="text-[#C9A24B] text-sm hover:underline flex items-center gap-1 font-semibold">
                  Voir tout <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {liveSessions.map((session, i) => (
                  <motion.div
                    key={session.id}
                    custom={i}
                    variants={fadeUp}
                    className="bg-white p-6 rounded-2xl border border-[#E7E2D6] shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold mb-3">
                        <Video className="w-4 h-4" />
                        Session en direct
                      </div>
                      <h3 className="font-semibold text-[#0A1F44] text-base mb-2">{session.title}</h3>
                      <div className="flex items-center gap-2 text-[#475569] text-xs mb-2">
                        <Calendar className="w-4 h-4 text-[#C9A24B]" />
                        {format(new Date(session.scheduled_at), 'EEEE d MMMM à HH:mm', { locale: fr })}
                      </div>
                      <div className="flex items-center gap-2 text-[#475569] text-xs mb-4">
                        <Clock className="w-4 h-4 text-[#C9A24B]" />
                        Durée : {session.duration_minutes} min
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/sessions/${session.id}`}
                      className="min-h-[44px] bg-[#0A1F44] hover:bg-[#081836] text-white text-xs font-semibold px-4 py-2.5 rounded-xl w-full justify-center flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <Video className="w-4 h-4 text-[#C9A24B]" />
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
                <h2 className="font-serif font-bold text-[#0A1F44] text-xl">
                  Mes certificats
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {certificates.slice(0, 2).map((cert) => (
                  <div key={cert.id} className="bg-white p-6 rounded-2xl border border-[#E7E2D6] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0A1F44] flex items-center justify-center flex-shrink-0 text-[#C9A24B] shadow-sm">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[#0A1F44] text-base truncate">
                        Certificat de formation
                      </div>
                      <div className="text-[#475569] text-xs font-mono">
                        N° {cert.certificate_number}
                      </div>
                      <div className="text-[#475569] text-xs">
                        {format(new Date(cert.issued_at), 'd MMMM yyyy', { locale: fr })}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/certificats/${cert.id}`}
                      className="px-4 py-2 rounded-xl border border-[#E7E2D6] bg-white hover:bg-[#FAF8F3] text-[#0A1F44] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C9A24B]" />
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
