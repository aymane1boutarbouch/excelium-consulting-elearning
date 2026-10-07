'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, BookOpen, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function NewCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: 990,
    currency: 'MAD',
    durationHours: 12,
    totalLessons: 10,
    level: 'debutant',
    previewVideoUrl: '',
    thumbnailUrl: '',
    isPublished: true,
    isFeatured: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
    setFormData(prev => ({ ...prev, [target.name]: value }))
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    setFormData(prev => ({ ...prev, title, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await (supabase as any)
        .from('courses')
        .insert({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          price: Number(formData.price),
          currency: formData.currency,
          duration_hours: Number(formData.durationHours),
          total_lessons: Number(formData.totalLessons),
          level: formData.level,
          preview_video_url: formData.previewVideoUrl,
          thumbnail_url: formData.thumbnailUrl,
          is_published: formData.isPublished,
          is_featured: formData.isFeatured,
          instructor_id: user?.id,
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Formation créée avec succès !')
      router.push('/admin')
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création de la formation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-navy dark:text-white text-2xl">
              Ajouter une Nouvelle Formation
            </h1>
            <p className="text-muted-foreground text-sm">Renseignez les détails pour publier un nouveau cours sur Excelium</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card-light dark:glass-card p-6 md:p-8 rounded-3xl space-y-6 border border-border">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Titre de la formation</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                placeholder="ex: Comptabilité Générale — Les Fondamentaux"
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Slug URL</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border text-xs font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Description détaillée</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                placeholder="Présentez les objectifs, prérequis et ce que l'apprenant saura faire..."
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold resize-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Prix (MAD)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Durée (heures)</label>
                <input
                  type="number"
                  name="durationHours"
                  value={formData.durationHours}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Nombre de leçons</label>
                <input
                  type="number"
                  name="totalLessons"
                  value={formData.totalLessons}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Niveau</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none"
                >
                  <option value="debutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="avance">Avancé</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy dark:text-white mb-1">URL de l&apos;image (Miniature)</label>
                <input
                  type="url"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">URL de la vidéo d&apos;aperçu (YouTube / Vimeo)</label>
              <input
                type="url"
                name="previewVideoUrl"
                value={formData.previewVideoUrl}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm font-medium text-navy dark:text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-gold focus:ring-gold"
                />
                Publier immédiatement
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-navy dark:text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-gold focus:ring-gold"
                />
                Mettre en vedette ⭐
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold rounded-xl py-3.5 w-full justify-center inline-flex font-bold text-base disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>Enregistrer et publier la formation <Save className="w-5 h-5 ml-2" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
