'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Layers, Columns, List, Sparkles, BookOpen } from 'lucide-react'
import ThreeColumnCurriculumBuilder from '@/components/admin/ThreeColumnCurriculumBuilder'

export default function CMSManagementPage() {
  const [viewMode, setViewMode] = useState<'3columns' | 'tree'>('3columns')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-navy dark:text-white text-2xl flex items-center gap-2">
            Gestionnaire CMS : Formations, Leçons &amp; Quizz
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Mode 3 Colonnes Interactif : Sélectionnez une formation ➔ Cochez les leçons ➔ Éditez le contenu &amp; construisez les quiz
          </p>
        </div>

        {/* View mode toggle button */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
          <button
            onClick={() => setViewMode('3columns')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === '3columns'
                ? 'bg-navy dark:bg-navy-900 text-gold shadow-sm font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Columns className="w-4 h-4" /> Vue 3 Colonnes (Formations / Leçons / Quiz)
          </button>
        </div>
      </div>

      {/* Primary 3-Column Miller Columns Component */}
      <ThreeColumnCurriculumBuilder />
    </div>
  )
}
