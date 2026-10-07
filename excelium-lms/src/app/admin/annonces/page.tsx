'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Plus, Trash2, Send, AlertCircle, BookOpen, Globe } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'

const mockAnnouncements = [
  {
    id: 'ann-1',
    title: '📢 Publication des Mises à Jour Loi de Finances 2026 sur le Module IS',
    content: 'Chers apprenants, les leçons 4 et 5 du cours Liasse Fiscale ont été mises à jour pour intégrer les barèmes définitifs de la Loi de Finances 2026.',
    targetScope: 'Pratique de la Liasse Fiscale Marocaine & IS 2026',
    priority: 'haute',
    createdAt: '2026-03-02T11:00:00Z',
    isPublished: true,
  },
  {
    id: 'ann-2',
    title: '🎥 Prochaine Masterclass Live — Jeudi 15 Octobre à 18h30',
    content: 'Rejoignez M. Abdellah El Amrani pour une session de questions-réponses en direct axée sur les télédéclarations SIMPL-Paie et CNSS.',
    targetScope: 'Tous les apprenants',
    priority: 'normale',
    createdAt: '2026-02-28T09:30:00Z',
    isPublished: true,
  },
]

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements)
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [targetScope, setTargetScope] = useState('Tous les apprenants')
  const [priority, setPriority] = useState('normale')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const newAnn = {
      id: `ann-${Date.now()}`,
      title,
      content,
      targetScope,
      priority,
      createdAt: new Date().toISOString(),
      isPublished: true,
    }
    setAnnouncements([newAnn, ...announcements])
    setTitle('')
    setContent('')
    setShowModal(false)
    toast.success('Annonce diffusée à tous les apprenants concernés !')
  }

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id))
    toast.success('Annonce supprimée')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-navy dark:text-white text-2xl">
            Gestion des Annonces &amp; Communications
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Diffusez des messages officiels sur le tableau de bord des étudiants
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-gold text-xs px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Diffuser une Annonce
        </button>
      </div>

      {/* New Announcement Form Card */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-light dark:glass-card p-6 rounded-3xl border border-gold/40 space-y-4"
        >
          <h2 className="font-display font-bold text-navy dark:text-white text-lg">Nouvelle Annonce Globale</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Titre de l&apos;Annonce</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="ex: Rappel important — Clôture des inscriptions à l'atelier"
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Message détaillé</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                required
                placeholder="Rédigez ici le contenu du message à destination des étudiants..."
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Cible</label>
                <select
                  value={targetScope}
                  onChange={(e) => setTargetScope(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none"
                >
                  <option value="Tous les apprenants">Tous les apprenants (Global)</option>
                  <option value="Pratique de la Liasse Fiscale Marocaine & IS 2026">Formation Liasse Fiscale IS</option>
                  <option value="Comptabilité Générale des Sociétés (PCM)">Formation Comptabilité PCM</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Priorité</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none"
                >
                  <option value="normale">Normale</option>
                  <option value="haute">Haute (Alerte Rouge)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-gold px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Publier l&apos;Annonce
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-light dark:glass-card p-6 rounded-3xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {ann.targetScope}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {format(new Date(ann.createdAt), 'd MMMM yyyy à HH:mm', { locale: fr })}
                </span>
              </div>

              <h3 className="font-display font-bold text-navy dark:text-white text-base">
                {ann.title}
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {ann.content}
              </p>
            </div>

            <button
              onClick={() => handleDelete(ann.id)}
              className="p-2.5 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors self-end md:self-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
