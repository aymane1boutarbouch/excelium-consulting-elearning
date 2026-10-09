'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Layers, Plus, Search, Edit3, Trash2, Copy, Eye, GripVertical, CheckCircle, Clock, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const mockPrograms = [
  {
    id: 'prog-01',
    title: 'Parcours Expert-Comptable & Fiscaliste Marocain 2026',
    slug: 'parcours-expert-comptable-2026',
    description: 'Programme de haut niveau regroupant la Liasse Fiscale, l\'IS, le PCM et l\'Audit Fiscal avec certification officielle.',
    coursesCount: 4,
    totalDurationHours: 72,
    isPublished: true,
    isFeatured: true,
    displayOrder: 1,
  },
  {
    id: 'prog-02',
    title: 'Parcours Gestion Sociale, Paie & Télédéclarations SIMPL',
    slug: 'parcours-gestion-paie-simpl',
    description: 'Spécialisation complète en paie marocaine, calcul des bulletins, cotisations CNSS et télé-procédures.',
    coursesCount: 2,
    totalDurationHours: 24,
    isPublished: true,
    isFeatured: false,
    displayOrder: 2,
  },
]

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState(mockPrograms)
  const [searchTerm, setSearchTerm] = useState('')

  const handleDuplicate = (prog: typeof mockPrograms[0]) => {
    const dup = {
      ...prog,
      id: `prog-${Date.now()}`,
      title: `${prog.title} (Copie)`,
      slug: `${prog.slug}-copie`,
      displayOrder: programs.length + 1,
    }
    setPrograms([...programs, dup])
    toast.success(`Programme "${prog.title}" dupliqué avec succès !`)
  }

  const togglePublish = (id: string) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    toast.success('Statut du programme mis à jour')
  }

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce programme ?')) {
      setPrograms(prev => prev.filter(p => p.id !== id))
      toast.success('Programme supprimé')
    }
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newItems = [...programs]
    const temp = newItems[index]
    newItems[index] = newItems[index - 1]
    newItems[index - 1] = temp
    setPrograms(newItems)
    toast.success('Ordre des programmes réorganisé')
  }

  const moveDown = (index: number) => {
    if (index === programs.length - 1) return
    const newItems = [...programs]
    const temp = newItems[index]
    newItems[index] = newItems[index + 1]
    newItems[index + 1] = temp
    setPrograms(newItems)
    toast.success('Ordre des programmes réorganisé')
  }

  const filtered = programs.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-navy text-2xl">
            Gestion des Programmes d&apos;Études (Niveau Supérieur)
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Hiérarchie : <strong>Programme &gt; Cours &gt; Module &gt; Leçon</strong>
          </p>
        </div>
        <Link
          href="/admin/cms"
          className="btn-gold text-xs px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-sm"
        >
          <Layers className="w-4 h-4" /> Explorer tout le CMS Hiérarchique
        </Link>
      </div>

      <div className="glass-card-light p-4 rounded-2xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un programme..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((prog, idx) => (
          <motion.div
            key={prog.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-light p-6 rounded-3xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-gold/40 transition-all"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="flex flex-col items-center gap-1 pt-1">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-1 text-muted-foreground hover:text-gold disabled:opacity-30"
                  title="Déplacer vers le haut"
                >
                  ▲
                </button>
                <GripVertical className="w-5 h-5 text-muted-foreground" />
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === programs.length - 1}
                  className="p-1 text-muted-foreground hover:text-gold disabled:opacity-30"
                  title="Déplacer vers le bas"
                >
                  ▼
                </button>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider font-mono">
                    Programme #{idx + 1}
                  </span>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                    prog.isPublished ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-muted text-muted-foreground border-border'
                  )}>
                    {prog.isPublished ? 'Publié' : 'Brouillon'}
                  </span>
                </div>

                <h3 className="font-display font-bold text-navy text-lg leading-snug group-hover:text-gold transition-colors">
                  {prog.title}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {prog.description}
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
                  <span className="flex items-center gap-1 font-bold text-navy">
                    <BookOpen className="w-3.5 h-3.5 text-gold" /> {prog.coursesCount} cours associés
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold" /> {prog.totalDurationHours}h de formation
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => togglePublish(prog.id)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors',
                  prog.isPublished ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                )}
              >
                {prog.isPublished ? 'Masquer' : 'Publier'}
              </button>
              <button
                onClick={() => handleDuplicate(prog)}
                className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-gold transition-colors"
                title="Dupliquer le programme"
              >
                <Copy className="w-4 h-4" />
              </button>
              <Link
                href="/admin/cms"
                className="btn-gold py-1.5 px-3 text-xs font-bold rounded-xl"
              >
                Gérer la Structure
              </Link>
              <button
                onClick={() => handleDelete(prog.id)}
                className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
