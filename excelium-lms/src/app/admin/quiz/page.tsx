'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Plus, Search, HelpCircle, CheckCircle2, Award, Clock } from 'lucide-react'
import { toast } from 'sonner'

const mockQuizzes = [
  {
    id: 'q-1',
    title: 'Examen Blanc — Maîtrise de l\'IS 2026 & Passage Fiscal',
    courseTitle: 'Pratique de la Liasse Fiscale Marocaine & IS 2026',
    totalQuestions: 15,
    passingScore: 80,
    timeLimitMinutes: 30,
    attemptsCount: 84,
    avgScore: 86,
    isPublished: true,
  },
  {
    id: 'q-2',
    title: 'Quiz d\'évaluation — Principes du Plan Comptable Marocain (PCM)',
    courseTitle: 'Comptabilité Générale des Sociétés (PCM)',
    totalQuestions: 10,
    passingScore: 70,
    timeLimitMinutes: 20,
    attemptsCount: 62,
    avgScore: 78,
    isPublished: true,
  },
  {
    id: 'q-3',
    title: 'Test Pratique — Calcul des Cotisations CNSS & IR/Paie',
    courseTitle: 'Gestion de la Paie, CNSS & SIMPL-Paie',
    totalQuestions: 12,
    passingScore: 75,
    timeLimitMinutes: 25,
    attemptsCount: 45,
    avgScore: 82,
    isPublished: true,
  },
]

export default function AdminQuizPage() {
  const [quizzes, setQuizzes] = useState(mockQuizzes)
  const [searchTerm, setSearchTerm] = useState('')

  const togglePublish = (id: string) => {
    setQuizzes(prev => prev.map(q => q.id === id ? { ...q, isPublished: !q.isPublished } : q))
    toast.success('Statut du quiz mis à jour')
  }

  const filtered = quizzes.filter(q =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-navy text-2xl">
            Gestion des Quiz &amp; Examens de Validation
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Créez et administrez les questionnaires à choix multiples pour la délivrance des certificats
          </p>
        </div>
        <Link
          href="/admin/quiz/nouveau"
          className="btn-gold text-xs px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nouveau Quiz
        </Link>
      </div>

      <div className="glass-card-light p-4 rounded-2xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par titre de quiz..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((quiz) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-light p-5 rounded-2xl border border-border flex flex-col justify-between hover:border-gold/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-bold">
                  {quiz.totalQuestions} questions
                </span>
                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold" /> {quiz.timeLimitMinutes} min
                </span>
              </div>

              <h3 className="font-display font-bold text-navy text-base leading-snug">
                {quiz.title}
              </h3>

              <p className="text-xs text-muted-foreground truncate">
                Formation : <span className="font-semibold text-navy">{quiz.courseTitle}</span>
              </p>

              <div className="p-3 rounded-xl bg-muted/40 border border-border grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <div className="text-muted-foreground text-[10px]">Score de réussite</div>
                  <div className="font-bold text-gold font-mono">{quiz.passingScore}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[10px]">Passages / Moyenne</div>
                  <div className="font-bold text-navy font-mono">{quiz.attemptsCount} ({quiz.avgScore}%)</div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
              <button
                onClick={() => togglePublish(quiz.id)}
                className="text-xs font-bold text-emerald hover:underline"
              >
                {quiz.isPublished ? '✓ Actif (Publié)' : 'Activer'}
              </button>
              <Link
                href="/admin/quiz/nouveau"
                className="btn-gold py-1.5 px-3 text-xs font-bold rounded-xl"
              >
                Éditer questions
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
