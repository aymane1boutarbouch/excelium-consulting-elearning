'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Video, Calendar, Clock, Link as LinkIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function NewSessionPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    scheduledAt: '2026-10-20T18:30',
    durationMinutes: 90,
    instructorName: 'M. Abdellah El Amrani',
    meetUrl: 'https://meet.google.com/exc-live-session',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Session live programmée avec succès !')
    router.push('/admin/sessions')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/sessions" className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-navy dark:text-white text-2xl">
            Planifier une Session Live / Webinaire
          </h1>
          <p className="text-muted-foreground text-xs">Configurez les détails du direct pour les apprenants</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card-light dark:glass-card p-6 rounded-3xl border border-border space-y-5">
        <div>
          <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Titre de la Session</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            placeholder="ex: Atelier Pratique — Clôture des Comptes & Liasse Fiscale"
            className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Date et Heure du Direct</label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Durée (Minutes)</label>
            <input
              type="number"
              value={formData.durationMinutes}
              onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: Number(e.target.value) }))}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-xs font-mono focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Lien Google Meet / Zoom / Teams</label>
          <input
            type="url"
            value={formData.meetUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, meetUrl: e.target.value }))}
            required
            placeholder="https://meet.google.com/..."
            className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-xs font-mono focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Nom de l&apos;Animateur / Formateur</label>
          <input
            type="text"
            value={formData.instructorName}
            onChange={(e) => setFormData(prev => ({ ...prev, instructorName: e.target.value }))}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="btn-gold w-full py-3.5 rounded-xl font-bold text-sm shadow-gold inline-flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> Enregistrer la Session
        </button>
      </form>
    </div>
  )
}
