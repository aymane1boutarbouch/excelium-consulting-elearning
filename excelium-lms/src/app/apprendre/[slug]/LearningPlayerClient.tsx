'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, CheckCircle, Circle, BookOpen, Download, FileText,
  ChevronLeft, ChevronRight, Menu, X, Award, HelpCircle,
  Video, Lock, ArrowLeft
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import SecureVideoPlayer from '@/components/player/SecureVideoPlayer'
import LessonResourcesList from '@/components/lessons/LessonResourcesList'

interface LessonResource {
  id: string
  title: string
  file_path: string
  file_type: string
  file_size: number
}

interface Quiz {
  id: string
  title: string
  passing_score: number
  duration_minutes: number
}

interface Lesson {
  id: string
  title: string
  content: string
  video_url: string
  duration_minutes: number
  is_free_preview: boolean
  order_index: number
  lesson_resources?: LessonResource[]
  quizzes?: Quiz[]
}

interface Module {
  id: string
  title: string
  order_index: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  slug: string
  modules: Module[]
}

interface Props {
  course: Course
  enrollment: any
  initialProgress: any[]
}

export default function LearningPlayerClient({ course, enrollment, initialProgress }: Props) {
  const allLessons = course.modules.flatMap(m => m.lessons)
  const [activeLessonId, setActiveLessonId] = useState<string>(allLessons[0]?.id || '')
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set(initialProgress.filter(p => p.is_completed).map(p => p.lesson_id))
  )
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0]
  const currentIndex = allLessons.findIndex(l => l.id === activeLessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const progressRate = allLessons.length > 0
    ? Math.round((completedLessonIds.size / allLessons.length) * 100)
    : 0

  const toggleComplete = async (lessonId: string) => {
    const isCompleted = completedLessonIds.has(lessonId)
    const newSet = new Set(completedLessonIds)

    if (isCompleted) {
      newSet.delete(lessonId)
    } else {
      newSet.add(lessonId)
    }

    setCompletedLessonIds(newSet)

    try {
      await (supabase as any)
        .from('lesson_progress')
        .upsert({
          enrollment_id: enrollment.id,
          lesson_id: lessonId,
          is_completed: !isCompleted,
          completed_at: !isCompleted ? new Date().toISOString() : null,
        }, { onConflict: 'enrollment_id,lesson_id' })

      // Update completion rate on enrollment
      const rate = Math.round((newSet.size / allLessons.length) * 100)
      await (supabase as any)
        .from('enrollments')
        .update({ completion_rate: rate })
        .eq('id', enrollment.id)

      if (!isCompleted) toast.success('Leçon marquée comme terminée ! 🎉')
    } catch (err: any) {
      toast.error('Erreur lors de la sauvegarde de la progression')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#1E293B] flex flex-col h-screen overflow-hidden">
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <header className="h-16 bg-white border-b border-[#E7E2D6] px-4 flex items-center justify-between flex-shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2.5 rounded-xl bg-[#FAF8F3] hover:bg-[#F3EFE6] text-[#475569] hover:text-[#0A1F44] border border-[#E7E2D6] transition-colors"
            aria-label="Retour au tableau de bord"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="text-[11px] text-[#C9A24B] font-semibold uppercase tracking-wider font-mono">
              Excelium E-Learning
            </div>
            <h1 className="font-serif font-bold text-[#0A1F44] text-sm md:text-base truncate max-w-md">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Progress & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-[#FAF8F3] px-4 py-2 rounded-xl border border-[#E7E2D6]">
            <div className="text-xs text-[#475569] font-medium">Progression</div>
            <div className="w-24 h-2 bg-[#E7E2D6] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C9A24B] to-[#E8D099] rounded-full transition-all duration-500"
                style={{ width: `${progressRate}%` }}
              />
            </div>
            <div className="text-xs font-mono font-bold text-[#0A1F44]">{progressRate}%</div>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl bg-[#FAF8F3] hover:bg-[#F3EFE6] text-[#475569] hover:text-[#0A1F44] border border-[#E7E2D6] transition-colors"
            aria-label="Ouvrir le sommaire"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── Main Layout (Player + Sidebar) ──────────────────────── */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Main Content Area (Video & Lesson Details) */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#FAF8F3] p-4 md:p-8">
          {activeLesson ? (
            <div className="max-w-5xl mx-auto w-full space-y-6">
              {/* Secure Video Player Box */}
              <div className="space-y-4">
                {activeLesson.video_url ? (
                  <SecureVideoPlayer
                    videoId={activeLesson.video_url}
                    lessonId={activeLesson.id}
                    studentEmail={enrollment?.profiles?.email || 'apprenant@excelium.ma'}
                    videoDurationSeconds={(activeLesson.duration_minutes || 60) * 60}
                  />
                ) : (
                  <div className="w-full aspect-video rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-white border border-[#E7E2D6] shadow-sm">
                    <Video className="w-16 h-16 text-[#C9A24B] mb-4" />
                    <p className="text-[#0A1F44] font-serif font-bold text-lg">Support Pédagogique & Fiche Pratique</p>
                    <p className="text-[#475569] text-sm mt-1">Consultez le texte explicatif et les fichiers joints ci-dessous.</p>
                  </div>
                )}
              </div>

              {/* Lesson Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E7E2D6] shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(activeLesson.id)}
                    className={cn(
                      'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm',
                      completedLessonIds.has(activeLesson.id)
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-[#0A1F44] text-white hover:bg-[#081836]'
                    )}
                  >
                    {completedLessonIds.has(activeLesson.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-[#C9A24B]" /> Leçon terminée
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" /> Marquer comme terminée
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {prevLesson && (
                    <button
                      onClick={() => setActiveLessonId(prevLesson.id)}
                      className="px-4 py-2.5 rounded-xl border border-[#E7E2D6] bg-white hover:bg-[#FAF8F3] text-[#0A1F44] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Précédent
                    </button>
                  )}
                  {nextLesson && (
                    <button
                      onClick={() => setActiveLessonId(nextLesson.id)}
                      className="px-4 py-2.5 rounded-xl bg-[#0A1F44] hover:bg-[#081836] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      Suivant <ChevronRight className="w-4 h-4 text-[#C9A24B]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Lesson Text Content */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E7E2D6] shadow-sm space-y-4">
                <h2 className="font-serif font-bold text-2xl text-[#0A1F44]">{activeLesson.title}</h2>
                <div className="text-[#1E293B] text-[17px] leading-[1.7] whitespace-pre-wrap font-sans">
                  {activeLesson.content || 'Consultez la vidéo ci-dessus et les supports téléchargeables rattachés à ce module.'}
                </div>
              </div>

              {/* Downloadable Resources Component */}
              <LessonResourcesList
                resources={(activeLesson.lesson_resources || []).map(r => ({
                  id: r.id,
                  title: r.title,
                  fileName: r.title,
                  filePath: r.file_path,
                  sizeBytes: r.file_size || 2048000,
                  fileTypeCategory: (r.file_type as any) || 'pdf'
                }))}
                isEnrolled={true}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[#475569] text-base">
              Aucune leçon disponible pour ce cours.
            </div>
          )}
        </main>

        {/* ── Sidebar: Playlist / Modules ────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25 }}
              className="w-80 bg-white border-l border-[#E7E2D6] flex flex-col flex-shrink-0 z-20 shadow-sm"
            >
              <div className="p-4 border-b border-[#E7E2D6] font-serif font-bold text-[#0A1F44] text-sm">
                Sommaire du programme
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {course.modules.map((module, mIdx) => (
                  <div key={module.id} className="space-y-1">
                    <div className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider px-3 py-1 font-mono">
                      Module {mIdx + 1}: {module.title}
                    </div>

                    {module.lessons.map((lesson) => {
                      const isActive = lesson.id === activeLessonId
                      const isDone = completedLessonIds.has(lesson.id)

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={cn(
                            'w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 text-xs transition-all',
                            isActive
                              ? 'bg-[#0A1F44] text-white font-semibold shadow-sm'
                              : 'hover:bg-[#FAF8F3] text-[#475569] hover:text-[#0A1F44]'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isDone ? (
                              <CheckCircle className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-[#C9A24B]' : 'text-emerald-600')} />
                            ) : (
                              <Circle className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-white/40' : 'text-[#94A3B8]')} />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className={cn('font-mono text-[10px]', isActive ? 'text-[#C9A24B]' : 'text-[#64748B]')}>
                            {lesson.duration_minutes}m
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
