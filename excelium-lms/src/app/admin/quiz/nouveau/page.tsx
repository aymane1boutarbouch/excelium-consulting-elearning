'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Save, Trash2, CheckCircle2, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function NewQuizPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [courseTitle, setCourseTitle] = useState('Pratique de la Liasse Fiscale Marocaine & IS 2026')
  const [passingScore, setPassingScore] = useState(80)
  const [timeLimit, setTimeLimit] = useState(30)

  const [questions, setQuestions] = useState([
    {
      id: 1,
      questionText: 'Quel est le taux normal de l\'IS au Maroc selon les réformes récentes de la Loi de Finances ?',
      options: ['15%', '20%', '30%', '35%'],
      correctOptionIndex: 1,
    }
  ])

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        id: Date.now(),
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
      }
    ])
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Quiz créé avec succès !')
    router.push('/admin/quiz')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/quiz" className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-navy text-2xl">
            Créer un Nouveau Quiz d&apos;Évaluation
          </h1>
          <p className="text-muted-foreground text-xs">Définissez les questions et critères de validation</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-card-light p-6 rounded-3xl border border-border space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1">Titre du Quiz</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="ex: Test Final — Liasse Fiscale Marocaine 2026"
              className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Score minimum de réussite (%)</label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy mb-1">Limite de temps (Minutes)</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Question items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-navy text-lg">Questions ({questions.length})</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="btn-gold text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Ajouter une question
            </button>
          </div>

          {questions.map((q, idx) => (
            <div key={q.id} className="glass-card-light p-5 rounded-2xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gold text-xs">Question #{idx + 1}</span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setQuestions(questions.filter(item => item.id !== q.id))}
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </button>
                )}
              </div>

              <input
                type="text"
                value={q.questionText}
                onChange={(e) => {
                  const val = e.target.value
                  setQuestions(questions.map(item => item.id === q.id ? { ...item, questionText: val } : item))
                }}
                required
                placeholder="Intitulé de la question..."
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold"
              />

              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctOptionIndex === optIdx}
                      onChange={() => {
                        setQuestions(questions.map(item => item.id === q.id ? { ...item, correctOptionIndex: optIdx } : item))
                      }}
                      className="text-gold focus:ring-gold"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...q.options]
                        newOpts[optIdx] = e.target.value
                        setQuestions(questions.map(item => item.id === q.id ? { ...item, options: newOpts } : item))
                      }}
                      placeholder={`Choix ${optIdx + 1}`}
                      className="w-full px-3 py-1.5 rounded-xl bg-muted/30 border border-border text-xs focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="btn-gold w-full py-4 rounded-2xl font-bold text-base shadow-gold inline-flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Enregistrer le Quiz
        </button>
      </form>
    </div>
  )
}
