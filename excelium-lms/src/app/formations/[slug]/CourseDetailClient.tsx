'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Clock, Award, Users, Star, Play, CheckCircle,
  FileText, Shield, ArrowRight, ChevronDown, Lock, X, Video
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import EnrollmentFlow from '@/components/enrollment/EnrollmentFlow'
import { formatCurrency, getLevelLabel, getLevelColor, cn } from '@/lib/utils'

interface Lesson {
  id: string
  title: string
  duration_minutes: number
  is_free_preview: boolean
  order_index: number
}

interface Module {
  id: string
  title: string
  description: string
  order_index: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  slug: string
  description: string
  price: number
  currency: string
  duration_hours: number
  total_lessons: number
  level: string
  preview_video_url: string
  thumbnail_url: string
  categories?: { name: string; slug: string; color: string }
  profiles?: { full_name: string; bio: string; avatar_url: string }
  modules?: Module[]
}

interface Props {
  course: Course
  userId: string | null
  existingEnrollment: any
}

export default function CourseDetailClient({ course, userId, existingEnrollment }: Props) {
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    [course.modules?.[0]?.id || '']: true,
  })

  const toggleModule = (id: string) => {
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const isApproved = existingEnrollment?.status === 'approved'
  const isPending = existingEnrollment?.status === 'pending'

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy flex flex-col">
      <Navbar />

      {/* ── Hero section ────────────────────────────────────────── */}
      <div className="bg-mesh pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="orb-gold w-96 h-96 top-0 right-1/4 opacity-20 absolute" />

        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Left 2 Cols: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category & Level Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {course.categories && (
                  <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
                    {course.categories.name}
                  </span>
                )}
                <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', getLevelColor(course.level))}>
                  {getLevelLabel(course.level)}
                </span>
              </div>

              <h1 className="font-display text-fluid-4xl font-bold text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-white/70 text-lg leading-relaxed">
                {course.description}
              </p>

              {/* Stats badges */}
              <div className="flex flex-wrap gap-6 text-white/70 text-sm pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>{course.duration_hours}h de formation</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span>{course.total_lessons} leçons en vidéo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold" />
                  <span>Certificat inclus</span>
                </div>
              </div>

              {/* Instructor snippet */}
              {course.profiles && (
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-navy font-bold text-lg shadow-gold">
                    {course.profiles.full_name?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <div className="text-xs text-white/50">Formateur référent</div>
                    <div className="text-white font-semibold">{course.profiles.full_name}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Course Card & Price */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 rounded-3xl space-y-6 shadow-2xl border border-white/20">
                {/* Preview Video / Image Box */}
                <div className="relative aspect-video rounded-2xl bg-black overflow-hidden group">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-navy flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-all">
                    {course.preview_video_url ? (
                      <button
                        onClick={() => setShowPreviewModal(true)}
                        className="w-16 h-16 rounded-full bg-gold hover:scale-110 flex items-center justify-center text-navy shadow-gold transition-all"
                      >
                        <Play className="w-7 h-7 fill-current ml-1" />
                      </button>
                    ) : null}
                  </div>
                  {course.preview_video_url && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                      Aperçu vidéo disponible
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-center pt-2">
                  <div className="text-xs text-white/50 uppercase font-semibold">Tarif de la formation</div>
                  <div className="font-display text-4xl font-bold text-gold font-mono mt-1">
                    {formatCurrency(course.price, course.currency)}
                  </div>
                </div>

                {/* Main Action Button */}
                {isApproved ? (
                  <Link
                    href={`/apprendre/${course.slug}`}
                    className="btn-gold rounded-xl py-4 w-full justify-center inline-flex font-bold"
                  >
                    Accéder à mon espace de cours <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                ) : isPending ? (
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-center text-sm font-semibold">
                    ⏳ Paiement en cours de vérification (accès actif sous 24h)
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!userId) {
                        window.location.href = `/connexion?redirectTo=/formations/${course.slug}`
                      } else {
                        setShowEnrollModal(true)
                      }
                    }}
                    className="btn-gold rounded-xl py-4 w-full justify-center inline-flex font-bold shadow-gold text-base"
                  >
                    S&apos;inscrire à la formation <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                )}

                {/* Features list */}
                <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald" />
                    <span>Accès illimité aux contenus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald" />
                    <span>Supports de cours PDF téléchargeables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald" />
                    <span>Quiz et examen final avec correction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald" />
                    <span>Certificat de réussite authentifié par QR Code</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Syllabus / Modules Section ──────────────────────────── */}
      <div className="section-padding flex-1">
        <div className="section-container max-w-4xl">
          <h2 className="font-display text-fluid-3xl font-bold text-navy dark:text-white mb-6">
            Programme de la formation
          </h2>

          <div className="space-y-4">
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((module, i) => {
                const isOpen = openModules[module.id]
                return (
                  <div key={module.id} className="glass-card-light dark:glass-card rounded-2xl overflow-hidden border border-border">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold font-bold text-sm flex items-center justify-center font-mono">
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-navy dark:text-white text-base">
                            {module.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">{module.lessons?.length || 0} leçons</p>
                        </div>
                      </div>
                      <ChevronDown className={cn('w-5 h-5 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
                    </button>

                    {isOpen && module.lessons && (
                      <div className="px-5 pb-5 pt-2 border-t border-border/50 space-y-2">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-muted/30 text-sm">
                            <div className="flex items-center gap-3">
                              {lesson.is_free_preview ? (
                                <Video className="w-4 h-4 text-gold" />
                              ) : (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span className="text-navy dark:text-white font-medium">{lesson.title}</span>
                              {lesson.is_free_preview && (
                                <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] font-bold">
                                  Gratuit
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">{lesson.duration_minutes} min</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <p className="text-muted-foreground text-sm">Le programme détaillé sera disponible très prochainement.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Enrollment Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {showEnrollModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card-light dark:glass-card w-full max-w-2xl p-6 md:p-8 rounded-3xl relative border border-gold/30 shadow-2xl my-8"
            >
              <button
                onClick={() => setShowEnrollModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <EnrollmentFlow
                course={course as any}
                userId={userId || ''}
                existingEnrollment={existingEnrollment}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
