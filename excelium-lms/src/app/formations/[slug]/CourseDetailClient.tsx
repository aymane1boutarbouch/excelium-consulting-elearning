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
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col">
      <Navbar />

      {/* ── Hero section ────────────────────────────────────────── */}
      <div className="bg-[#F3EFE6] border-b border-[#E7E2D6] pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Left 2 Cols: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category & Level Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                {course.categories && (
                  <span className="px-3.5 py-1 rounded-full bg-[#C9A24B]/15 border border-[#C9A24B]/30 text-[#0A1F44] text-xs font-semibold">
                    {course.categories.name}
                  </span>
                )}
                <span className={cn('px-3.5 py-1 rounded-full text-xs font-semibold', getLevelColor(course.level))}>
                  {getLevelLabel(course.level)}
                </span>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#0A1F44] leading-tight">
                {course.title}
              </h1>

              <p className="text-[#475569] text-base md:text-lg leading-relaxed">
                {course.description}
              </p>

              {/* Stats badges */}
              <div className="flex flex-wrap gap-6 text-[#475569] text-sm pt-4 border-t border-[#E7E2D6]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C9A24B]" />
                  <span className="font-medium text-[#1E293B]">{course.duration_hours}h de formation</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#C9A24B]" />
                  <span className="font-medium text-[#1E293B]">{course.total_lessons} leçons en vidéo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C9A24B]" />
                  <span className="font-medium text-[#1E293B]">Certificat officiel inclus</span>
                </div>
              </div>

              {/* Instructor snippet */}
              {course.profiles && (
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-12 h-12 rounded-full bg-[#C9A24B]/20 border border-[#C9A24B]/40 flex items-center justify-center text-[#0A1F44] font-bold text-lg">
                    {course.profiles.full_name?.charAt(0) || 'E'}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[#475569]">Formateur référent</div>
                    <div className="text-[#0A1F44] font-semibold text-base">{course.profiles.full_name}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Course Card & Price */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl space-y-6 shadow-md border border-[#E7E2D6]">
                {/* Preview Video / Image Box */}
                <div className="relative aspect-video rounded-xl bg-[#F3EFE6] border border-[#E7E2D6] overflow-hidden group">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#F3EFE6] to-[#E7E2D6] flex items-center justify-center">
                      <BookOpen className="w-14 h-14 text-[#C9A24B]/70" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/25 transition-all">
                    {course.preview_video_url ? (
                      <button
                        onClick={() => setShowPreviewModal(true)}
                        className="w-14 h-14 rounded-full bg-[#C9A24B] hover:scale-110 flex items-center justify-center text-[#0A1F44] shadow-lg transition-all"
                      >
                        <Play className="w-6 h-6 fill-current ml-1" />
                      </button>
                    ) : null}
                  </div>
                  {course.preview_video_url && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-xs font-semibold">
                      Aperçu vidéo disponible
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-center pt-2">
                  <div className="text-xs text-[#475569] uppercase font-semibold">Tarif de la formation</div>
                  <div className="font-serif text-3xl font-bold text-[#0A1F44] font-mono mt-1">
                    {formatCurrency(course.price, course.currency)}
                  </div>
                </div>

                {/* Main Action Button */}
                {isApproved ? (
                  <Link
                    href={`/apprendre/${course.slug}`}
                    className="min-h-[48px] rounded-xl py-3.5 px-6 w-full justify-center inline-flex items-center font-bold bg-[#0A1F44] hover:bg-[#081836] text-white shadow-sm transition-all"
                  >
                    Accéder à mon espace de cours <ArrowRight className="w-5 h-5 ml-2 text-[#C9A24B]" />
                  </Link>
                ) : isPending ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-center text-sm font-semibold">
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
                    className="min-h-[48px] rounded-xl py-3.5 px-6 w-full justify-center inline-flex items-center font-bold bg-[#0A1F44] hover:bg-[#081836] text-white shadow-md text-base transition-all group"
                  >
                    S&apos;inscrire à la formation <ArrowRight className="w-5 h-5 ml-2 text-[#C9A24B] group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                {/* Features list */}
                <div className="space-y-3 pt-4 border-t border-[#E7E2D6] text-xs text-[#475569]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Accès illimité aux contenus vidéo</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Supports de cours PDF téléchargeables</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Quiz et examen final avec correction</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Certificat authentifié avec QR Code</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Syllabus / Modules Section ──────────────────────────── */}
      <div className="py-20 flex-1">
        <div className="section-container max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0A1F44] mb-8">
            Programme détaillé de la formation
          </h2>

          <div className="space-y-4">
            {course.modules && course.modules.length > 0 ? (
              course.modules.map((module, i) => {
                const isOpen = openModules[module.id]
                return (
                  <div key={module.id} className="bg-white rounded-2xl overflow-hidden border border-[#E7E2D6] shadow-sm">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF8F3] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-[#0A1F44] text-white font-bold text-sm flex items-center justify-center font-mono">
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#0A1F44] text-base">
                            {module.title}
                          </h3>
                          <p className="text-xs text-[#475569]">{module.lessons?.length || 0} leçons</p>
                        </div>
                      </div>
                      <ChevronDown className={cn('w-5 h-5 text-[#475569] transition-transform duration-200', isOpen && 'rotate-180')} />
                    </button>

                    {isOpen && module.lessons && (
                      <div className="px-5 pb-5 pt-2 border-t border-[#E7E2D6] space-y-2 bg-[#FAF8F3]/50">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white border border-[#E7E2D6] text-sm">
                            <div className="flex items-center gap-3">
                              {lesson.is_free_preview ? (
                                <Video className="w-4 h-4 text-[#C9A24B]" />
                              ) : (
                                <Lock className="w-4 h-4 text-[#94A3B8]" />
                              )}
                              <span className="text-[#0A1F44] font-medium">{lesson.title}</span>
                              {lesson.is_free_preview && (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                                  Extrait gratuit
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#475569] font-mono">{lesson.duration_minutes} min</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <p className="text-[#475569] text-base">Le programme détaillé sera disponible très prochainement.</p>
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
              className="glass-card-light w-full max-w-2xl p-6 md:p-8 rounded-3xl relative border border-gold/30 shadow-2xl my-8"
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
