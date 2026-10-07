'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers, BookOpen, ChevronDown, ChevronRight, Plus, Search,
  Edit3, Trash2, Copy, Eye, GripVertical, CheckCircle, Clock,
  Video, FileText, Download, HelpCircle, Save, Sparkles, AlertCircle, RefreshCw
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import BunnyVideoUploader from '@/components/admin/BunnyVideoUploader'
import ResourceDropzone, { AttachedResource } from '@/components/admin/ResourceDropzone'
import { toast } from 'sonner'

export interface CMSLesson {
  id: string
  title: string
  type: 'video' | 'text' | 'file' | 'quiz' | 'live'
  durationMinutes: number
  isFreePreview: boolean
  isPublished: boolean
  videoId?: string
  content?: string
  resources?: AttachedResource[]
}

export interface CMSModule {
  id: string
  title: string
  isExpanded: boolean
  isFreePreview: boolean
  isPublished: boolean
  lessons: CMSLesson[]
}

export interface CMSCourse {
  id: string
  title: string
  slug: string
  price: number
  isPublished: boolean
  modules: CMSModule[]
}

export interface CMSProgram {
  id: string
  title: string
  isPublished: boolean
  courses: CMSCourse[]
}

const initialHierarchy: CMSProgram[] = [
  {
    id: 'prog-1',
    title: 'Parcours Expert-Comptable & Fiscaliste Marocain 2026',
    isPublished: true,
    courses: [
      {
        id: 'c-1',
        title: 'Pratique de la Liasse Fiscale Marocaine & IS 2026',
        slug: 'liasse-fiscale-marocaine',
        price: 1490,
        isPublished: true,
        modules: [
          {
            id: 'm-1',
            title: 'Module 1 : Champ d\'application de l\'IS & Déductibilité des Charges',
            isExpanded: true,
            isFreePreview: true,
            isPublished: true,
            lessons: [
              {
                id: 'l-1',
                title: 'Introduction aux principes de l\'IS 2026 selon la CGI Maroc',
                type: 'video',
                durationMinutes: 45,
                isFreePreview: true,
                isPublished: true,
                videoId: 'demo-bunny-is-01',
                content: 'Dans cette leçon vidéo, nous analysons les conditions d\'exonération permanente et temporaire prévues par l\'article 6 du CGI.',
                resources: [
                  { id: 'r-1', fileName: 'Support_Liasse_Fiscale_2026.pdf', filePath: 'demo/pdf1.pdf', sizeBytes: 4200000, fileTypeCategory: 'pdf' },
                  { id: 'r-2', fileName: 'Tableau_Passage_Fiscal_Excel.xlsx', filePath: 'demo/xls1.xlsx', sizeBytes: 1800000, fileTypeCategory: 'excel' }
                ]
              },
              {
                id: 'l-2',
                title: 'Passage du Résultat Comptable au Résultat Fiscal (Tableau 9)',
                type: 'text',
                durationMinutes: 60,
                isFreePreview: false,
                isPublished: true,
                content: '## Guide méthodologique du Tableau 9\n\n1. Réintégrations fiscales (Charges non déductibles)\n2. Déductions fiscales (Produits non imposables)\n3. Amortissements dérogatoires',
                resources: []
              }
            ]
          },
          {
            id: 'm-2',
            title: 'Module 2 : Confection des Tableaux de la Liasse Fiscale (SIMPL-IS)',
            isExpanded: false,
            isFreePreview: false,
            isPublished: true,
            lessons: [
              {
                id: 'l-3',
                title: 'Tableau n°1 à n°6 : Bilan & CPC Fiscal',
                type: 'file',
                durationMinutes: 90,
                isFreePreview: false,
                isPublished: true,
                resources: [
                  { id: 'r-3', fileName: 'Modele_Liasse_Complete_SIMPL.zip', filePath: 'demo/zip1.zip', sizeBytes: 12500000, fileTypeCategory: 'zip' }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

export default function CMSManagementPage() {
  const [hierarchy, setHierarchy] = useState<CMSProgram[]>(initialHierarchy)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingLesson, setEditingLesson] = useState<{ progId: string; courseId: string; moduleId: string; lesson: CMSLesson } | null>(null)

  // ── Auto-calculated Total Duration Helper ──
  const calculateCourseDuration = (course: CMSCourse) => {
    let totalMinutes = 0
    course.modules.forEach(m => {
      m.lessons.forEach(l => {
        totalMinutes += l.durationMinutes || 0
      })
    })
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    return `${hours}h ${mins}m (${totalMinutes} min)`
  }

  // ── Drag & Drop Reordering Logic ──
  const moveProgram = (index: number, direction: 'up' | 'down') => {
    const newHierarchy = [...hierarchy]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= newHierarchy.length) return
    const temp = newHierarchy[index]
    newHierarchy[index] = newHierarchy[targetIdx]
    newHierarchy[targetIdx] = temp
    setHierarchy(newHierarchy)
    toast.success('Ordre des programmes mis à jour')
  }

  const moveModule = (progId: string, courseId: string, modIndex: number, direction: 'up' | 'down') => {
    setHierarchy(prev => prev.map(p => {
      if (p.id !== progId) return p
      return {
        ...p,
        courses: p.courses.map(c => {
          if (c.id !== courseId) return c
          const newMods = [...c.modules]
          const targetIdx = direction === 'up' ? modIndex - 1 : modIndex + 1
          if (targetIdx < 0 || targetIdx >= newMods.length) return c
          const temp = newMods[modIndex]
          newMods[modIndex] = newMods[targetIdx]
          newMods[targetIdx] = temp
          return { ...c, modules: newMods }
        })
      }
    }))
    toast.success('Ordre des modules mis à jour')
  }

  const moveLesson = (progId: string, courseId: string, modId: string, lessonIndex: number, direction: 'up' | 'down') => {
    setHierarchy(prev => prev.map(p => {
      if (p.id !== progId) return p
      return {
        ...p,
        courses: p.courses.map(c => {
          if (c.id !== courseId) return c
          return {
            ...c,
            modules: c.modules.map(m => {
              if (m.id !== modId) return m
              const newLessons = [...m.lessons]
              const targetIdx = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1
              if (targetIdx < 0 || targetIdx >= newLessons.length) return m
              const temp = newLessons[lessonIndex]
              newLessons[lessonIndex] = newLessons[targetIdx]
              newLessons[targetIdx] = temp
              return { ...m, lessons: newLessons }
            })
          }
        })
      }
    }))
    toast.success('Ordre des leçons mis à jour')
  }

  // ── Duplication Logic ──
  const duplicateLesson = (progId: string, courseId: string, modId: string, lesson: CMSLesson) => {
    const dup: CMSLesson = {
      ...lesson,
      id: `l-${Date.now()}`,
      title: `${lesson.title} (Copie)`,
    }
    setHierarchy(prev => prev.map(p => {
      if (p.id !== progId) return p
      return {
        ...p,
        courses: p.courses.map(c => {
          if (c.id !== courseId) return c
          return {
            ...c,
            modules: c.modules.map(m => {
              if (m.id !== modId) return m
              return { ...m, lessons: [...m.lessons, dup] }
            })
          }
        })
      }
    }))
    toast.success('Leçon dupliquée')
  }

  const duplicateModule = (progId: string, courseId: string, moduleItem: CMSModule) => {
    const dup: CMSModule = {
      ...moduleItem,
      id: `m-${Date.now()}`,
      title: `${moduleItem.title} (Copie)`,
      lessons: moduleItem.lessons.map(l => ({ ...l, id: `l-${Date.now()}-${Math.random()}` }))
    }
    setHierarchy(prev => prev.map(p => {
      if (p.id !== progId) return p
      return {
        ...p,
        courses: p.courses.map(c => {
          if (c.id !== courseId) return c
          return { ...c, modules: [...c.modules, dup] }
        })
      }
    }))
    toast.success('Module dupliqué avec toutes ses leçons')
  }

  // ── Toggles ──
  const toggleLessonFreePreview = (progId: string, courseId: string, modId: string, lessonId: string) => {
    setHierarchy(prev => prev.map(p => {
      if (p.id !== progId) return p
      return {
        ...p,
        courses: p.courses.map(c => {
          if (c.id !== courseId) return c
          return {
            ...c,
            modules: c.modules.map(m => {
              if (m.id !== modId) return m
              return {
                ...m,
                lessons: m.lessons.map(l => l.id === lessonId ? { ...l, isFreePreview: !l.isFreePreview } : l)
              }
            })
          }
        })
      }
    }))
    toast.success('Aperçu gratuit de la leçon modifié')
  }

  const toggleModuleExpand = (progId: string, courseId: string, modId: string) => {
    setHierarchy(prev => prev.map(p => {
      if (p.id !== progId) return p
      return {
        ...p,
        courses: p.courses.map(c => {
          if (c.id !== courseId) return c
          return {
            ...c,
            modules: c.modules.map(m => m.id === modId ? { ...m, isExpanded: !m.isExpanded } : m)
          }
        })
      }
    }))
  }

  const addModule = (progId: string, courseId: string) => {
    const title = prompt('Titre du nouveau module :')
    if (!title) return
    const newMod: CMSModule = {
      id: `m-${Date.now()}`,
      title,
      isExpanded: true,
      isFreePreview: false,
      isPublished: true,
      lessons: []
    }
    setHierarchy(prev => prev.map(p => {
      if (p.id !== progId) return p
      return {
        ...p,
        courses: p.courses.map(c => c.id === courseId ? { ...c, modules: [...c.modules, newMod] } : c)
      }
    }))
    toast.success('Module créé !')
  }

  const addLessonToModule = (progId: string, courseId: string, modId: string) => {
    const title = prompt('Titre de la nouvelle leçon :')
    if (!title) return
    const newLesson: CMSLesson = {
      id: `l-${Date.now()}`,
      title,
      type: 'video',
      durationMinutes: 45,
      isFreePreview: false,
      isPublished: true,
      resources: []
    }
    setHierarchy(prev => prev.map(p => {
      if (p.id !== progId) return p
      return {
        ...p,
        courses: p.courses.map(c => {
          if (c.id !== courseId) return c
          return {
            ...c,
            modules: c.modules.map(m => m.id === modId ? { ...m, lessons: [...m.lessons, newLesson] } : m)
          }
        })
      }
    }))
    toast.success('Leçon ajoutée au module !')
  }

  const saveLessonEdits = (updatedLesson: CMSLesson) => {
    if (!editingLesson) return
    const { progId, courseId, moduleId } = editingLesson

    setHierarchy(prev => prev.map(p => {
      if (p.id !== progId) return p
      return {
        ...p,
        courses: p.courses.map(c => {
          if (c.id !== courseId) return c
          return {
            ...c,
            modules: c.modules.map(m => {
              if (m.id !== moduleId) return m
              return {
                ...m,
                lessons: m.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l)
              }
            })
          }
        })
      }
    }))
    setEditingLesson(null)
    toast.success('Leçon mise à jour et sauvegardée !')
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-navy dark:text-white text-2xl">
            CMS &amp; Gestionnaire de Structure d&apos;Apprentissage
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Hiérarchie complète : <strong className="text-gold">Programme &gt; Cours &gt; Module &gt; Leçon</strong> (Drag-and-drop, Duplicate, Free Preview, Bunny Stream)
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="glass-card-light dark:glass-card p-4 rounded-2xl border border-border flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une leçon, module ou cours..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Hierarchy Tree Explorer */}
      <div className="space-y-6">
        {hierarchy.map((prog, pIdx) => (
          <div key={prog.id} className="glass-card-light dark:glass-card rounded-3xl border border-border overflow-hidden">
            {/* Program Banner */}
            <div className="bg-navy p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center text-white/40">
                  <button onClick={() => moveProgram(pIdx, 'up')} disabled={pIdx === 0} className="hover:text-gold disabled:opacity-20 text-[10px]">▲</button>
                  <GripVertical className="w-4 h-4" />
                  <button onClick={() => moveProgram(pIdx, 'down')} disabled={pIdx === hierarchy.length - 1} className="hover:text-gold disabled:opacity-20 text-[10px]">▼</button>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gold font-bold tracking-widest uppercase">PROGRAMME #{pIdx + 1}</span>
                  <h2 className="font-display font-bold text-lg leading-tight">{prog.title}</h2>
                </div>
              </div>
            </div>

            {/* Courses inside Program */}
            <div className="p-6 space-y-6">
              {prog.courses.map((course) => (
                <div key={course.id} className="space-y-4">
                  {/* Course Header */}
                  <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">COURS (SECTIONS COLLAPSIBLES)</span>
                      <h3 className="font-display font-bold text-navy dark:text-white text-base">{course.title}</h3>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">
                        Durée calculée automatiquement : <span className="text-gold font-bold">{calculateCourseDuration(course)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addModule(prog.id, course.id)}
                      className="btn-gold text-xs px-3.5 py-2 rounded-xl font-bold inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Ajouter un Module
                    </button>
                  </div>

                  {/* Modules inside Course */}
                  <div className="space-y-4 pl-2 sm:pl-4 border-l-2 border-gold/20">
                    {course.modules.map((mod, mIdx) => (
                      <div key={mod.id} className="rounded-2xl border border-border bg-muted/20 overflow-hidden">
                        {/* Module Header Bar */}
                        <div className="p-4 bg-muted/40 flex items-center justify-between gap-3 border-b border-border/60">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-center text-muted-foreground">
                              <button onClick={() => moveModule(prog.id, course.id, mIdx, 'up')} disabled={mIdx === 0} className="hover:text-gold disabled:opacity-20 text-[9px]">▲</button>
                              <GripVertical className="w-3.5 h-3.5" />
                              <button onClick={() => moveModule(prog.id, course.id, mIdx, 'down')} disabled={mIdx === course.modules.length - 1} className="hover:text-gold disabled:opacity-20 text-[9px]">▼</button>
                            </div>

                            <button
                              onClick={() => toggleModuleExpand(prog.id, course.id, mod.id)}
                              className="p-1 text-navy dark:text-white hover:text-gold transition-colors"
                            >
                              {mod.isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                            </button>

                            <div>
                              <div className="font-bold text-navy dark:text-white text-sm flex items-center gap-2">
                                {mod.title}
                                <span className="text-[10px] font-mono text-muted-foreground">({mod.lessons.length} leçons)</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => duplicateModule(prog.id, course.id, mod)}
                              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-gold text-xs"
                              title="Dupliquer le module"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => addLessonToModule(prog.id, course.id, mod.id)}
                              className="btn-gold text-xs py-1 px-3 rounded-lg font-bold inline-flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> Leçon
                            </button>
                          </div>
                        </div>

                        {/* Lessons List (Collapsible) */}
                        {mod.isExpanded && (
                          <div className="p-4 space-y-3">
                            {mod.lessons.length === 0 ? (
                              <div className="text-center text-xs text-muted-foreground py-4">
                                Aucune leçon dans ce module. Cliquez sur &quot;+ Leçon&quot; pour ajouter du contenu.
                              </div>
                            ) : (
                              mod.lessons.map((lesson, lIdx) => (
                                <div
                                  key={lesson.id}
                                  className="p-3.5 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-gold/40 transition-all"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="flex flex-col items-center text-muted-foreground">
                                      <button onClick={() => moveLesson(prog.id, course.id, mod.id, lIdx, 'up')} disabled={lIdx === 0} className="hover:text-gold disabled:opacity-20 text-[9px]">▲</button>
                                      <GripVertical className="w-3.5 h-3.5" />
                                      <button onClick={() => moveLesson(prog.id, course.id, mod.id, lIdx, 'down')} disabled={lIdx === mod.lessons.length - 1} className="hover:text-gold disabled:opacity-20 text-[9px]">▼</button>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-navy dark:text-white text-xs truncate">
                                          {lesson.title}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-navy/10 dark:bg-white/10 text-[10px] font-mono font-bold uppercase text-gold">
                                          {lesson.type}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-mono mt-0.5">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3 text-gold" /> {lesson.durationMinutes} min
                                        </span>
                                        {lesson.resources && lesson.resources.length > 0 && (
                                          <span className="flex items-center gap-1 text-emerald font-bold">
                                            <Download className="w-3 h-3" /> {lesson.resources.length} fichier(s) joint(s)
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    {/* Free Preview Toggle */}
                                    <button
                                      onClick={() => toggleLessonFreePreview(prog.id, course.id, mod.id, lesson.id)}
                                      className={cn(
                                        'px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors',
                                        lesson.isFreePreview
                                          ? 'bg-emerald/10 text-emerald border-emerald/20'
                                          : 'bg-muted text-muted-foreground border-border'
                                      )}
                                    >
                                      {lesson.isFreePreview ? '👁️ Aperçu Gratuit' : '🔒 Réservé'}
                                    </button>

                                    {/* Actions */}
                                    <button
                                      onClick={() => setEditingLesson({ progId: prog.id, courseId: course.id, moduleId: mod.id, lesson })}
                                      className="p-1.5 rounded-lg bg-gold/15 text-gold hover:bg-gold hover:text-navy text-xs font-bold transition-all flex items-center gap-1"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" /> Éditer
                                    </button>

                                    <button
                                      onClick={() => duplicateLesson(prog.id, course.id, mod.id, lesson)}
                                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-gold"
                                      title="Dupliquer la leçon"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Drawer / Editor Modal */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card-light dark:glass-card p-6 md:p-8 rounded-3xl border border-gold/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-display font-bold text-navy dark:text-white text-lg">
                Édition Complète de la Leçon : {editingLesson.lesson.title}
              </h2>
              <button
                onClick={() => setEditingLesson(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                saveLessonEdits(editingLesson.lesson)
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Titre de la Leçon</label>
                <input
                  type="text"
                  value={editingLesson.lesson.title}
                  onChange={(e) => setEditingLesson({
                    ...editingLesson,
                    lesson: { ...editingLesson.lesson, title: e.target.value }
                  })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Type de Contenu</label>
                  <select
                    value={editingLesson.lesson.type}
                    onChange={(e) => setEditingLesson({
                      ...editingLesson,
                      lesson: { ...editingLesson.lesson, type: e.target.value as any }
                    })}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none"
                  >
                    <option value="video">Vidéo (Bunny Stream)</option>
                    <option value="text">Texte Enrichi / Markdown</option>
                    <option value="file">Support &amp; Fichier Téléchargeable</option>
                    <option value="quiz">Quiz / Évaluation</option>
                    <option value="live">Session Live Direct</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Durée Estimée (Minutes)</label>
                  <input
                    type="number"
                    value={editingLesson.lesson.durationMinutes}
                    onChange={(e) => setEditingLesson({
                      ...editingLesson,
                      lesson: { ...editingLesson.lesson, durationMinutes: Number(e.target.value) }
                    })}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Video upload section if type == video */}
              {editingLesson.lesson.type === 'video' && (
                <BunnyVideoUploader
                  existingVideoId={editingLesson.lesson.videoId}
                  onVideoUploaded={(vId, dur) => {
                    setEditingLesson({
                      ...editingLesson,
                      lesson: {
                        ...editingLesson.lesson,
                        videoId: vId,
                        durationMinutes: Math.round(dur / 60)
                      }
                    })
                  }}
                />
              )}

              {/* Text content rich editor if type == text */}
              {editingLesson.lesson.type === 'text' && (
                <div>
                  <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Contenu Texte (Éditeur Enrichi / Markdown)</label>
                  <textarea
                    value={editingLesson.lesson.content || ''}
                    onChange={(e) => setEditingLesson({
                      ...editingLesson,
                      lesson: { ...editingLesson.lesson, content: e.target.value }
                    })}
                    rows={6}
                    placeholder="Saisissez votre leçon au format Markdown..."
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold resize-none font-mono"
                  />
                </div>
              )}

              {/* Downloadable files dropzone */}
              <ResourceDropzone
                lessonId={editingLesson.lesson.id}
                initialResources={editingLesson.lesson.resources}
                onResourcesChanged={(newRes) => {
                  setEditingLesson({
                    ...editingLesson,
                    lesson: { ...editingLesson.lesson, resources: newRes }
                  })
                }}
              />

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" /> Sauvegarder la Leçon
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
