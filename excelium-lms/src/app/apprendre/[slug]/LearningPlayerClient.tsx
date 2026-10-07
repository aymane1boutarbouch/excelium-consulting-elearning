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
    <div className="min-h-screen bg-navy text-white flex flex-col h-screen overflow-hidden">
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <header className="h-16 bg-navy-900 border-b border-white/10 px-4 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <div className="text-xs text-gold font-semibold uppercase tracking-wider">Excelium E-Learning</div>
            <h1 className="font-display font-bold text-white text-sm md:text-base truncate max-w-md">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Progress & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <div className="text-xs text-white/70">Progression</div>
            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-gold rounded-full transition-all duration-500"
                style={{ width: `${progressRate}%` }}
              />
            </div>
            <div className="text-xs font-mono font-bold text-gold">{progressRate}%</div>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── Main Layout (Player + Sidebar) ──────────────────────── */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Main Content Area (Video & Lesson Details) */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-navy-950 p-4 md:p-8">
          {activeLesson ? (
            <div className="max-w-5xl mx-auto w-full space-y-6">
              {/* Video Player Box */}
              <div className="relative aspect-video rounded-3xl bg-black overflow-hidden shadow-2xl border border-white/10">
                {activeLesson.video_url ? (
                  <iframe
                    src={activeLesson.video_url.includes('youtube')
                      ? activeLesson.video_url.replace('watch?v=', 'embed/')
                      : activeLesson.video_url}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-navy">
                    <Video className="w-16 h-16 text-white/20 mb-4" />
                    <p className="text-white/70 text-lg font-semibold">Contenu texte pour cette leçon</p>
                  </div>
                )}
              </div>

              {/* Lesson Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(activeLesson.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all',
                      completedLessonIds.has(activeLesson.id)
                        ? 'bg-emerald text-white'
                        : 'bg-gold text-navy hover:bg-gold/90'
                    )}
                  >
                    {completedLessonIds.has(activeLesson.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Leçon terminée
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
                      className="btn-outline-gold text-xs px-4 py-2 rounded-xl flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Précédent
                    </button>
                  )}
                  {nextLesson && (
                    <button
                      onClick={() => setActiveLessonId(nextLesson.id)}
                      className="btn-gold text-xs px-4 py-2 rounded-xl flex items-center gap-1"
                    >
                      Suivant <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Lesson Text Content */}
              <div className="glass-card p-6 md:p-8 rounded-3xl space-y-4">
                <h2 className="font-display font-bold text-2xl text-white">{activeLesson.title}</h2>
                <div className="text-white/80 text-base leading-relaxed whitespace-pre-wrap">
                  {activeLesson.content || 'Aucune note textuelle pour cette leçon.'}
                </div>
              </div>

              {/* Downloadable Resources */}
              {activeLesson.lesson_resources && activeLesson.lesson_resources.length > 0 && (
                <div className="glass-card p-6 rounded-3xl space-y-3">
                  <h3 className="font-display font-semibold text-white text-base flex items-center gap-2">
                    <Download className="w-5 h-5 text-gold" /> Resources & Documents téléchargeables
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {activeLesson.lesson_resources.map((res) => (
                      <a
                        key={res.id}
                        href={res.file_path}
                        target="_blank"
                        download
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-gold/10 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gold" />
                          <div>
                            <div className="text-sm font-medium text-white group-hover:text-gold transition-colors">
                              {res.title}
                            </div>
                            <div className="text-xs text-white/40 font-mono">
                              {(res.file_size / 1024 / 1024).toFixed(1)} MB
                            </div>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-white/40 group-hover:text-gold transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-white/50">
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
              transition={{ duration: 0.3 }}
              className="w-80 bg-navy-900 border-l border-white/10 flex flex-col flex-shrink-0 z-20"
            >
              <div className="p-4 border-b border-white/10 font-display font-semibold text-white text-sm">
                Sommaire de la formation
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {course.modules.map((module, mIdx) => (
                  <div key={module.id} className="space-y-1">
                    <div className="text-xs font-bold text-gold uppercase tracking-wider px-3 py-1">
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
                              ? 'bg-gold text-navy font-bold shadow-gold'
                              : 'hover:bg-white/5 text-white/80'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isDone ? (
                              <CheckCircle className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-navy' : 'text-emerald')} />
                            ) : (
                              <Circle className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-navy' : 'text-white/30')} />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className={cn('font-mono text-[10px]', isActive ? 'text-navy/70' : 'text-white/40')}>
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
