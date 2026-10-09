'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, Trash2, Video, FileText, CheckCircle, Eye, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function CourseEditPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.id as string

  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState({
    title: 'Pratique de la Liasse Fiscale Marocaine & IS 2026',
    slug: 'liasse-fiscale-marocaine',
    description: 'Formation complète axée sur la préparation de la liasse fiscale marocaine, les règles de passage du résultat comptable au résultat fiscal, et la liquidation de l\'Impôt sur les Sociétés (IS) selon la Loi de Finances 2026.',
    price: 1490,
    currency: 'MAD',
    durationHours: 18,
    level: 'avance',
    category: 'Fiscalité Marocaine',
    previewVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    isPublished: true,
  })

  const [modules, setModules] = useState([
    {
      id: 'm-1',
      title: 'Module 1 : Principes Fondamentaux de l\'IS 2026',
      lessons: [
        { id: 'l-1', title: 'Champ d\'application & Exonérations de l\'IS', duration: '45 min', videoUrl: 'https://vimeo.com/demo1' },
        { id: 'l-2', title: 'Déductibilité des Charges & Amortissements', duration: '60 min', videoUrl: 'https://vimeo.com/demo2' },
      ]
    },
    {
      id: 'm-2',
      title: 'Module 2 : Confection Pratique de la Liasse Fiscale',
      lessons: [
        { id: 'l-3', title: 'Tableau n°1 à n°6 : Bilan & CPC Fiscal', duration: '90 min', videoUrl: 'https://vimeo.com/demo3' },
        { id: 'l-4', title: 'Passage du Résultat Comptable au Résultat Fiscal (Tableau 9)', duration: '75 min', videoUrl: 'https://vimeo.com/demo4' },
      ]
    }
  ])

  const [newLessonTitle, setNewLessonTitle] = useState('')
  const [selectedModuleId, setSelectedModuleId] = useState('m-1')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Modifications enregistrées avec succès !')
    }, 600)
  }

  const addLesson = () => {
    if (!newLessonTitle.trim()) return
    setModules(prev => prev.map(m => {
      if (m.id === selectedModuleId) {
        return {
          ...m,
          lessons: [
            ...m.lessons,
            { id: `l-${Date.now()}`, title: newLessonTitle, duration: '45 min', videoUrl: '' }
          ]
        }
      }
      return m
    }))
    setNewLessonTitle('')
    toast.success('Leçon ajoutée au module')
  }

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
      }
      return m
    }))
    toast.success('Leçon supprimée')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top navigation header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/formations" className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-navy text-xl">
              Édition : {course.title}
            </h1>
            <p className="text-muted-foreground text-xs font-mono">ID: {courseId}</p>
          </div>
        </div>
        <Link href={`/formations/${course.slug}`} target="_blank" className="btn-outline-gold text-xs px-3.5 py-2 rounded-xl">
          <Eye className="w-4 h-4 mr-1.5" /> Voir la page publique
        </Link>
      </div>

      {/* Main form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-card-light p-6 rounded-3xl border border-border space-y-4">
          <h2 className="font-display font-bold text-navy text-lg">Informations Générales</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Titre de la formation</label>
              <input
                type="text"
                value={course.title}
                onChange={(e) => setCourse(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Description</label>
              <textarea
                value={course.description}
                onChange={(e) => setCourse(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold resize-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Prix (MAD)</label>
                <input
                  type="number"
                  value={course.price}
                  onChange={(e) => setCourse(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Durée (heures)</label>
                <input
                  type="number"
                  value={course.durationHours}
                  onChange={(e) => setCourse(prev => ({ ...prev, durationHours: Number(e.target.value) }))}
                  className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy mb-1">Niveau</label>
                <select
                  value={course.level}
                  onChange={(e) => setCourse(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none"
                >
                  <option value="debutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="avance">Avancé</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Lien Vidéo d&apos;Aperçu (Vimeo/YouTube)</label>
              <input
                type="text"
                value={course.previewVideoUrl}
                onChange={(e) => setCourse(prev => ({ ...prev, previewVideoUrl: e.target.value }))}
                className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-xs font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Syllabus / Modules Builder */}
        <div className="glass-card-light p-6 rounded-3xl border border-border space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-navy text-lg">
              Programme &amp; Leçons ({modules.reduce((acc, m) => acc + m.lessons.length, 0)} leçons)
            </h2>
          </div>

          {/* Add lesson row */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center gap-3">
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-muted border border-border text-xs focus:outline-none w-full sm:w-auto"
            >
              {modules.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>

            <input
              type="text"
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              placeholder="Titre de la nouvelle leçon..."
              className="flex-1 px-4 py-2 rounded-xl bg-muted border border-border text-xs focus:outline-none w-full"
            />

            <button
              type="button"
              onClick={addLesson}
              className="btn-gold text-xs px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>

          {/* Modules listing */}
          <div className="space-y-4">
            {modules.map((mod) => (
              <div key={mod.id} className="p-4 rounded-2xl border border-border bg-muted/20 space-y-3">
                <h3 className="font-bold text-navy text-sm flex items-center gap-2">
                  <Video className="w-4 h-4 text-gold" /> {mod.title}
                </h3>

                <div className="space-y-2 pl-6">
                  {mod.lessons.map((lesson) => (
                    <div key={lesson.id} className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium text-navy truncate">{lesson.title}</span>
                        <span className="text-muted-foreground font-mono text-[10px]">({lesson.duration})</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteLesson(mod.id, lesson.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-gold w-full rounded-2xl py-4 font-bold text-base shadow-gold inline-flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>Enregistrer toutes les modifications <Save className="w-5 h-5" /></>
          )}
        </button>
      </form>
    </div>
  )
}
