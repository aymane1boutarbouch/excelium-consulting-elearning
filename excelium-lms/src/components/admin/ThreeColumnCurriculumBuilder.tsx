'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Layers, FileText, Video, HelpCircle, Plus, Search,
  Edit3, Trash2, CheckCircle2, ChevronRight, Save, Clock, Star,
  Eye, Check, X, HelpCircle as QuizIcon, Sparkles, Copy, Award
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuestionItem {
  id: string
  text: string
  type: 'mcq' | 'true_false' | 'single'
  points: number
  explanation?: string
  options: QuestionOption[]
}

export interface QuizData {
  id: string
  title: string
  timeLimitMinutes: number
  passingScorePercent: number
  isPublished: boolean
  questions: QuestionItem[]
}

export interface LessonData {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz' | 'file'
  durationMinutes: number
  isFreePreview: boolean
  isPublished: boolean
  videoUrl?: string
  content?: string
  quiz?: QuizData
}

export interface ModuleData {
  id: string
  title: string
  lessons: LessonData[]
}

export interface FormationData {
  id: string
  title: string
  slug: string
  category: string
  price: number
  currency: string
  level: 'Débutant' | 'Intermédiaire' | 'Avancé'
  isPublished: boolean
  modules: ModuleData[]
}

const initialFormationsData: FormationData[] = [
  {
    id: 'f-1',
    title: 'Pratique de la Liasse Fiscale Marocaine & IS 2026',
    slug: 'liasse-fiscale-marocaine',
    category: 'Fiscalité Marocaine',
    price: 1490,
    currency: 'MAD',
    level: 'Avancé',
    isPublished: true,
    modules: [
      {
        id: 'm-1',
        title: 'Module 1 : Champ d\'application & Exonérations de l\'IS',
        lessons: [
          {
            id: 'l-1',
            title: '1.1 Principes fondamentaux du passage au résultat fiscal',
            type: 'video',
            durationMinutes: 45,
            isFreePreview: true,
            isPublished: true,
            videoUrl: 'https://vimeo.com/76979871',
            content: 'Analyse détaillée des charges réintégrables et des déductions fiscales selon la Loi de Finances 2026.',
            quiz: {
              id: 'q-1',
              title: 'Quiz d\'évaluation : Champ d\'application de l\'IS',
              timeLimitMinutes: 15,
              passingScorePercent: 75,
              isPublished: true,
              questions: [
                {
                  id: 'quest-1',
                  text: 'Quel est le taux d\'imposition d\'IS plafonné pour les sociétés exportatrices en 2026 ?',
                  type: 'mcq',
                  points: 5,
                  explanation: 'Selon le barème progressif de la LF 2026.',
                  options: [
                    { id: 'opt-1', text: '15%', isCorrect: false },
                    { id: 'opt-2', text: '20%', isCorrect: true },
                    { id: 'opt-3', text: '35%', isCorrect: false },
                  ],
                },
                {
                  id: 'quest-2',
                  text: 'Les pénalités et amendes fiscales sont-elles déductibles du résultat comptable ?',
                  type: 'true_false',
                  points: 5,
                  explanation: 'Article 11 du CGI : Les amendes et pénalités de toute nature ne sont jamais déductibles.',
                  options: [
                    { id: 'opt-tf-1', text: 'Vrai', isCorrect: false },
                    { id: 'opt-tf-2', text: 'Faux (Réintégration obligatoire)', isCorrect: true },
                  ],
                },
              ],
            },
          },
          {
            id: 'l-2',
            title: '1.2 Tableau n°9 : Passages du résultat comptable au fiscal',
            type: 'text',
            durationMinutes: 60,
            isFreePreview: false,
            isPublished: true,
            content: '## Guide pratique du Tableau 9\n\n1. Réintégrez les amortissements excédentaires\n2. Vérifiez le plafond de déductibilité des dons (2‰ du chiffre d affaires)\n3. Calculez l impôt brut',
            quiz: {
              id: 'q-2',
              title: 'Quiz : Traitement des Amortissements & Dons',
              timeLimitMinutes: 10,
              passingScorePercent: 80,
              isPublished: true,
              questions: [
                {
                  id: 'quest-3',
                  text: 'Quel est le plafond de déductibilité des dons versés aux œuvres sociales des entreprises ?',
                  type: 'mcq',
                  points: 10,
                  options: [
                    { id: 'o-1', text: '2 pour mille du chiffre d affaires', isCorrect: true },
                    { id: 'o-2', text: '5 pour mille du chiffre d affaires', isCorrect: false },
                    { id: 'o-3', text: 'Sans limitation', isCorrect: false },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        id: 'm-2',
        title: 'Module 2 : Confection Pratique sur Portails SIMPL-IS',
        lessons: [
          {
            id: 'l-3',
            title: '2.1 Télé-déclaration de la liasse sur SIMPL-IS',
            type: 'video',
            durationMinutes: 90,
            isFreePreview: false,
            isPublished: true,
            videoUrl: 'https://vimeo.com/76979871',
            content: 'Démonstration en direct sur le portail de la DGI marocaine.',
          },
        ],
      },
    ],
  },
  {
    id: 'f-2',
    title: 'Comptabilité Générale des Sociétés selon le PCM',
    slug: 'comptabilite-societes-pcm',
    category: 'Comptabilité',
    price: 1250,
    currency: 'MAD',
    level: 'Intermédiaire',
    isPublished: true,
    modules: [
      {
        id: 'm-3',
        title: 'Module 1 : Constitution des Sociétés Anonymes & SARL',
        lessons: [
          {
            id: 'l-4',
            title: '1.1 Écritures comptables des apports en nature et en numéraire',
            type: 'video',
            durationMinutes: 50,
            isFreePreview: true,
            isPublished: true,
            content: 'Enregistrement du compte 3461 Associés - comptes d apports.',
          },
        ],
      },
    ],
  },
  {
    id: 'f-3',
    title: 'Gestion de la Paie, CNSS & SIMPL-Paie',
    slug: 'paie-cnss-simpl-paie',
    category: 'Gestion Sociale',
    price: 990,
    currency: 'MAD',
    level: 'Débutant',
    isPublished: true,
    modules: [
      {
        id: 'm-4',
        title: 'Module 1 : Établissement du Bulletin de Paie',
        lessons: [
          {
            id: 'l-5',
            title: '1.1 Salaire Brut, Salaire Brut Imposable & Retenues',
            type: 'video',
            durationMinutes: 40,
            isFreePreview: true,
            isPublished: true,
            content: 'Calcul détaillé des primes et cotisations sociales CNSS & AMO.',
          },
        ],
      },
    ],
  },
]

export default function ThreeColumnCurriculumBuilder() {
  const [formations, setFormations] = useState<FormationData[]>(initialFormationsData)
  const [selectedFormationId, setSelectedFormationId] = useState<string>('f-1')
  const [selectedLessonId, setSelectedLessonId] = useState<string>('l-1')

  const [activeTab, setActiveTab] = useState<'editor' | 'quiz'>('editor')

  // Search terms per column
  const [searchFormation, setSearchFormation] = useState('')
  const [searchLesson, setSearchLesson] = useState('')

  // Selected Formation & Selected Lesson objects
  const selectedFormation = formations.find((f) => f.id === selectedFormationId) || formations[0]

  const allLessonsOfSelectedFormation = selectedFormation
    ? selectedFormation.modules.flatMap((m) => m.lessons)
    : []

  const selectedLesson = allLessonsOfSelectedFormation.find((l) => l.id === selectedLessonId) || allLessonsOfSelectedFormation[0]

  // Form states for adding new Question inline
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false)
  const [newQuestionText, setNewQuestionText] = useState('')
  const [newQuestionType, setNewQuestionType] = useState<'mcq' | 'true_false'>('mcq')
  const [newQuestionPoints, setNewQuestionPoints] = useState(5)
  const [newQuestionOptions, setNewQuestionOptions] = useState<QuestionOption[]>([
    { id: 'opt-a', text: 'Option A', isCorrect: true },
    { id: 'opt-b', text: 'Option B', isCorrect: false },
    { id: 'opt-c', text: 'Option C', isCorrect: false },
  ])

  // ── Actions: Formations ──
  const handleAddFormation = () => {
    const title = prompt('Titre de la nouvelle formation :')
    if (!title) return
    const newF: FormationData = {
      id: `f-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: 'Fiscalité Marocaine',
      price: 1200,
      currency: 'MAD',
      level: 'Intermédiaire',
      isPublished: true,
      modules: [
        {
          id: `m-${Date.now()}`,
          title: 'Module 1 : Leçons Initiales',
          lessons: [
            {
              id: `l-${Date.now()}`,
              title: '1.1 Leçon de bienvenue',
              type: 'video',
              durationMinutes: 30,
              isFreePreview: true,
              isPublished: true,
              content: 'Bienvenue dans cette formation.',
            },
          ],
        },
      ],
    }
    setFormations([newF, ...formations])
    setSelectedFormationId(newF.id)
    setSelectedLessonId(newF.modules[0].lessons[0].id)
    toast.success('Nouvelle formation créée !')
  }

  // ── Actions: Modules & Lessons ──
  const handleAddModule = () => {
    if (!selectedFormation) return
    const title = prompt('Titre du nouveau module :')
    if (!title) return
    const newMod: ModuleData = {
      id: `m-${Date.now()}`,
      title,
      lessons: [],
    }
    setFormations((prev) =>
      prev.map((f) =>
        f.id === selectedFormation.id
          ? { ...f, modules: [...f.modules, newMod] }
          : f
      )
    )
    toast.success('Module ajouté à la formation !')
  }

  const handleAddLesson = (moduleId: string) => {
    const title = prompt('Titre de la nouvelle leçon :')
    if (!title) return
    const newLes: LessonData = {
      id: `l-${Date.now()}`,
      title,
      type: 'video',
      durationMinutes: 45,
      isFreePreview: false,
      isPublished: true,
      content: 'Contenu de la nouvelle leçon...',
    }

    setFormations((prev) =>
      prev.map((f) => {
        if (f.id !== selectedFormationId) return f
        return {
          ...f,
          modules: f.modules.map((m) =>
            m.id === moduleId ? { ...m, lessons: [...m.lessons, newLes] } : m
          ),
        }
      })
    )
    setSelectedLessonId(newLes.id)
    toast.success('Leçon ajoutée !')
  }

  const handleDeleteLesson = (lessonId: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette leçon ?')) {
      setFormations((prev) =>
        prev.map((f) => {
          if (f.id !== selectedFormationId) return f
          return {
            ...f,
            modules: f.modules.map((m) => ({
              ...m,
              lessons: m.lessons.filter((l) => l.id !== lessonId),
            })),
          }
        })
      )
      toast.success('Leçon supprimée.')
    }
  }

  // ── Actions: Lesson Details Edit ──
  const handleUpdateLessonField = (field: keyof LessonData, value: any) => {
    if (!selectedLesson) return
    setFormations((prev) =>
      prev.map((f) => {
        if (f.id !== selectedFormationId) return f
        return {
          ...f,
          modules: f.modules.map((m) => ({
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === selectedLessonId ? { ...l, [field]: value } : l
            ),
          })),
        }
      })
    )
  }

  // ── Actions: Quiz & Questions Edit ──
  const handleCreateQuiz = () => {
    if (!selectedLesson) return
    const newQuiz: QuizData = {
      id: `q-${Date.now()}`,
      title: `Quiz : ${selectedLesson.title}`,
      timeLimitMinutes: 15,
      passingScorePercent: 80,
      isPublished: true,
      questions: [],
    }
    handleUpdateLessonField('quiz', newQuiz)
    setActiveTab('quiz')
    toast.success('Quiz créé pour la leçon !')
  }

  const handleAddQuestionToQuiz = () => {
    if (!newQuestionText.trim() || !selectedLesson?.quiz) return
    const newQuestion: QuestionItem = {
      id: `quest-${Date.now()}`,
      text: newQuestionText,
      type: newQuestionType,
      points: newQuestionPoints,
      options: newQuestionOptions,
    }

    const updatedQuiz: QuizData = {
      ...selectedLesson.quiz,
      questions: [...selectedLesson.quiz.questions, newQuestion],
    }

    handleUpdateLessonField('quiz', updatedQuiz)
    setNewQuestionText('')
    setShowAddQuestionForm(false)
    toast.success('Question ajoutée au Quiz !')
  }

  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedLesson?.quiz) return
    const updatedQuiz: QuizData = {
      ...selectedLesson.quiz,
      questions: selectedLesson.quiz.questions.filter((q) => q.id !== questionId),
    }
    handleUpdateLessonField('quiz', updatedQuiz)
    toast.success('Question supprimée.')
  }

  // Filters
  const filteredFormations = formations.filter((f) =>
    f.title.toLowerCase().includes(searchFormation.toLowerCase()) ||
    f.category.toLowerCase().includes(searchFormation.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Top Banner & Instructions */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-navy via-navy-900 to-navy border border-white/15 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold" />
            Gestion Colonnes : Formations &gt; Leçons &gt; Quiz &amp; Questions
          </h2>
          <p className="text-white/60 text-xs mt-0.5">
            Sélectionnez une formation à gauche pour afficher ses cours/leçons, puis cochez une leçon pour la modifier et gérer ses quiz.
          </p>
        </div>

        <button
          onClick={handleAddFormation}
          className="btn-gold text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-gold shrink-0"
        >
          <Plus className="w-4 h-4" /> Nouvelle Formation
        </button>
      </div>

      {/* 3 COLUMNS CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start min-h-[680px]">
        {/* ========================================================= */}
        {/* COLUMN 1: FORMATIONS (Width: 3.5 / 12)                    */}
        {/* ========================================================= */}
        <div className="md:col-span-4 lg:col-span-3.5 glass-card-light dark:glass-card rounded-2xl border border-border p-4 space-y-3 flex flex-col h-full max-h-[720px]">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="font-display font-bold text-navy dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-gold" />
              1. Formations ({filteredFormations.length})
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">Sélectionner ➔</span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchFormation}
              onChange={(e) => setSearchFormation(e.target.value)}
              placeholder="Rechercher formation..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold"
            />
          </div>

          {/* Formations List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredFormations.map((f) => {
              const isSelected = f.id === selectedFormationId
              const totalLessonsCount = f.modules.reduce((acc, m) => acc + m.lessons.length, 0)

              return (
                <div
                  key={f.id}
                  onClick={() => {
                    setSelectedFormationId(f.id)
                    const firstL = f.modules[0]?.lessons[0]?.id
                    if (firstL) setSelectedLessonId(firstL)
                  }}
                  className={cn(
                    'p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between gap-2',
                    isSelected
                      ? 'bg-gold/15 dark:bg-gold/15 border-gold shadow-gold text-navy dark:text-white font-semibold'
                      : 'bg-muted/30 border-border/60 hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/20 text-gold">
                      {f.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-navy dark:text-white">
                      {formatCurrency(f.price, f.currency)}
                    </span>
                  </div>

                  <div className="font-bold text-xs leading-snug line-clamp-2 text-navy dark:text-white">
                    {f.title}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono pt-1 border-t border-border/40">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-gold" /> {f.modules.length} mod ({totalLessonsCount} leçons)
                    </span>
                    {isSelected && (
                      <span className="text-gold font-bold flex items-center gap-0.5">
                        Actif <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: LEÇONS, COURS & QUIZZ (Width: 4 / 12)           */}
        {/* ========================================================= */}
        <div className="md:col-span-4 lg:col-span-4 glass-card-light dark:glass-card rounded-2xl border border-border p-4 space-y-3 flex flex-col h-full max-h-[720px]">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-bold text-navy dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5 truncate">
                <FileText className="w-4 h-4 text-gold" />
                2. Leçons &amp; Cours
              </h3>
              <p className="text-[10px] text-gold font-bold truncate">
                {selectedFormation?.title}
              </p>
            </div>
            <button
              onClick={handleAddModule}
              className="px-2.5 py-1 rounded-xl bg-gold/15 text-gold hover:bg-gold hover:text-navy text-[10px] font-bold flex items-center gap-1 transition-all shrink-0"
              title="Ajouter un module"
            >
              <Plus className="w-3 h-3" /> Module
            </button>
          </div>

          {/* Search lessons bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchLesson}
              onChange={(e) => setSearchLesson(e.target.value)}
              placeholder="Filtrer les leçons..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold"
            />
          </div>

          {/* Modules & Lessons tree list */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {selectedFormation?.modules.map((mod, modIdx) => {
              const filteredLessons = mod.lessons.filter((l) =>
                l.title.toLowerCase().includes(searchLesson.toLowerCase())
              )

              return (
                <div key={mod.id} className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-navy dark:text-white text-xs flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-gold" />
                      {mod.title}
                    </span>
                    <button
                      onClick={() => handleAddLesson(mod.id)}
                      className="text-[10px] font-bold text-gold hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" /> Leçon
                    </button>
                  </div>

                  <div className="space-y-1.5 pl-2 border-l-2 border-gold/30">
                    {filteredLessons.map((les) => {
                      const isChecked = les.id === selectedLessonId

                      return (
                        <div
                          key={les.id}
                          onClick={() => setSelectedLessonId(les.id)}
                          className={cn(
                            'p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all cursor-pointer group',
                            isChecked
                              ? 'bg-navy dark:bg-navy-900 border-gold text-white font-semibold shadow-md'
                              : 'bg-card border-border/80 hover:border-gold/40 text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {/* Checkbox indicator */}
                            <div
                              className={cn(
                                'w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all',
                                isChecked
                                  ? 'bg-gold border-gold text-navy'
                                  : 'border-muted-foreground/40 group-hover:border-gold'
                              )}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            {les.type === 'video' ? (
                              <Video className="w-3.5 h-3.5 text-gold shrink-0" />
                            ) : les.type === 'quiz' ? (
                              <QuizIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            ) : (
                              <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            )}

                            <span className="truncate text-xs text-navy dark:text-white font-medium">
                              {les.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {les.quiz && (
                              <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[9px] font-bold font-mono">
                                Quiz ({les.quiz.questions.length})
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {les.durationMinutes}m
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: QUIZZ, QUESTIONS & SECTION D'ÉDITION (4.5 / 12) */}
        {/* ========================================================= */}
        <div className="md:col-span-4 lg:col-span-4.5 glass-card-light dark:glass-card rounded-2xl border border-border p-4 space-y-4 flex flex-col h-full max-h-[720px] overflow-y-auto">
          {selectedLesson ? (
            <>
              {/* Header & Tabs */}
              <div className="border-b border-border pb-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">
                      ÉDITEUR / DÉTAILS
                    </span>
                    <h3 className="font-display font-bold text-navy dark:text-white text-sm truncate">
                      {selectedLesson.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDeleteLesson(selectedLesson.id)}
                    className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs"
                    title="Supprimer la leçon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sub-tabs: Leçon Editor vs Quiz & Questions */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/60">
                  <button
                    onClick={() => setActiveTab('editor')}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5',
                      activeTab === 'editor'
                        ? 'bg-navy dark:bg-navy-900 text-gold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Éditeur Leçon
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative',
                      activeTab === 'quiz'
                        ? 'bg-navy dark:bg-navy-900 text-gold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <QuizIcon className="w-3.5 h-3.5 text-purple-400" />
                    Quiz &amp; Questions
                    {selectedLesson.quiz && (
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>

              {/* TAB 1: LESSON EDITOR */}
              {activeTab === 'editor' && (
                <div className="space-y-4 flex-1">
                  <div>
                    <label className="block text-[11px] font-bold text-navy dark:text-white mb-1">
                      Titre de la Leçon
                    </label>
                    <input
                      type="text"
                      value={selectedLesson.title}
                      onChange={(e) => handleUpdateLessonField('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold text-navy dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-navy dark:text-white mb-1">
                        Type de contenu
                      </label>
                      <select
                        value={selectedLesson.type}
                        onChange={(e) => handleUpdateLessonField('type', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none text-navy dark:text-white"
                      >
                        <option value="video">Vidéo (Vimeo / Bunny)</option>
                        <option value="text">Texte / Markdown</option>
                        <option value="file">Support PDF / Excel</option>
                        <option value="quiz">Évaluation / Quiz</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-navy dark:text-white mb-1">
                        Durée (minutes)
                      </label>
                      <input
                        type="number"
                        value={selectedLesson.durationMinutes}
                        onChange={(e) => handleUpdateLessonField('durationMinutes', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs font-mono focus:outline-none text-navy dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-navy dark:text-white mb-1">
                      Lien vidéo (URL Vimeo / YouTube)
                    </label>
                    <input
                      type="text"
                      value={selectedLesson.videoUrl || ''}
                      onChange={(e) => handleUpdateLessonField('videoUrl', e.target.value)}
                      placeholder="https://vimeo.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs font-mono focus:outline-none text-navy dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-navy dark:text-white mb-1">
                      Support de cours (Contenu textuel / Markdown)
                    </label>
                    <textarea
                      value={selectedLesson.content || ''}
                      onChange={(e) => handleUpdateLessonField('content', e.target.value)}
                      rows={5}
                      placeholder="Description et résumés de la leçon..."
                      className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold text-navy dark:text-white resize-none font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                    <label className="flex items-center gap-2 text-xs font-bold text-navy dark:text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLesson.isFreePreview}
                        onChange={(e) => handleUpdateLessonField('isFreePreview', e.target.checked)}
                        className="w-4 h-4 rounded text-gold focus:ring-gold"
                      />
                      Activer en Aperçu Gratuit 👁️
                    </label>
                  </div>

                  <button
                    onClick={() => toast.success('Modifications de la leçon enregistrées !')}
                    className="btn-gold w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-gold"
                  >
                    <Save className="w-4 h-4" /> Sauvegarder les modifications
                  </button>
                </div>
              )}

              {/* TAB 2: QUIZ & QUESTIONS */}
              {activeTab === 'quiz' && (
                <div className="space-y-4 flex-1">
                  {!selectedLesson.quiz ? (
                    <div className="p-8 text-center rounded-2xl border-2 border-dashed border-border bg-muted/10 space-y-3">
                      <QuizIcon className="w-10 h-10 text-purple-400 mx-auto" />
                      <div>
                        <h4 className="font-bold text-navy dark:text-white text-sm">Aucun Quiz rattaché</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Créez un quiz interactif avec des QCM et questions Vrai/Faux pour cette leçon.
                        </p>
                      </div>
                      <button
                        onClick={handleCreateQuiz}
                        className="btn-gold text-xs px-4 py-2 rounded-xl font-bold inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" /> Créer un Quiz
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Quiz Meta Settings */}
                      <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                            <QuizIcon className="w-4 h-4" /> {selectedLesson.quiz.title}
                          </span>
                          <span className="text-[10px] font-mono text-purple-300 font-bold">
                            {selectedLesson.quiz.questions.length} Question(s)
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="block text-[10px] text-muted-foreground font-semibold mb-0.5">
                              Temps limite (min)
                            </label>
                            <input
                              type="number"
                              value={selectedLesson.quiz.timeLimitMinutes}
                              onChange={(e) => {
                                const q = { ...selectedLesson.quiz!, timeLimitMinutes: Number(e.target.value) }
                                handleUpdateLessonField('quiz', q)
                              }}
                              className="w-full px-2.5 py-1 rounded-lg bg-muted/60 border border-border text-xs font-mono focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-muted-foreground font-semibold mb-0.5">
                              Score de passage (%)
                            </label>
                            <input
                              type="number"
                              value={selectedLesson.quiz.passingScorePercent}
                              onChange={(e) => {
                                const q = { ...selectedLesson.quiz!, passingScorePercent: Number(e.target.value) }
                                handleUpdateLessonField('quiz', q)
                              }}
                              className="w-full px-2.5 py-1 rounded-lg bg-muted/60 border border-border text-xs font-mono focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Questions Header & Add Button */}
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-navy dark:text-white text-xs uppercase tracking-wider">
                          Questions du Quiz ({selectedLesson.quiz.questions.length})
                        </h4>
                        <button
                          onClick={() => setShowAddQuestionForm(!showAddQuestionForm)}
                          className="btn-gold text-[11px] px-3 py-1 rounded-lg font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Nouvelle Question
                        </button>
                      </div>

                      {/* Inline Add Question Form */}
                      {showAddQuestionForm && (
                        <div className="p-4 rounded-xl bg-navy dark:bg-navy-950 border border-gold/40 text-white space-y-3">
                          <div className="font-bold text-xs text-gold flex items-center gap-1">
                            <Sparkles className="w-4 h-4" /> Ajouter une Question au Quiz
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-white/80 mb-1">Énoncé de la question</label>
                            <input
                              type="text"
                              value={newQuestionText}
                              onChange={(e) => setNewQuestionText(e.target.value)}
                              placeholder="ex: Quel est le taux normal de TVA en 2026 ?"
                              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-gold"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-semibold text-white/80 mb-1">Type</label>
                              <select
                                value={newQuestionType}
                                onChange={(e) => setNewQuestionType(e.target.value as any)}
                                className="w-full px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none"
                              >
                                <option value="mcq">QCM Choix Multiples</option>
                                <option value="true_false">Vrai / Faux</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-white/80 mb-1">Points</label>
                              <input
                                type="number"
                                value={newQuestionPoints}
                                onChange={(e) => setNewQuestionPoints(Number(e.target.value))}
                                className="w-full px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-mono focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Options Editor */}
                          <div className="space-y-2 pt-1">
                            <label className="block text-[10px] font-semibold text-gold">Choix de réponses (Cochez la bonne réponse) :</label>
                            {newQuestionOptions.map((opt, oIdx) => (
                              <div key={opt.id} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="correctOpt"
                                  checked={opt.isCorrect}
                                  onChange={() => {
                                    setNewQuestionOptions(
                                      newQuestionOptions.map((o) => ({
                                        ...o,
                                        isCorrect: o.id === opt.id,
                                      }))
                                    )
                                  }}
                                  className="w-4 h-4 text-gold focus:ring-gold"
                                />
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    setNewQuestionOptions(
                                      newQuestionOptions.map((o) =>
                                        o.id === opt.id ? { ...o, text: val } : o
                                      )
                                    )
                                  }}
                                  className="flex-1 px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-xs focus:outline-none"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => setShowAddQuestionForm(false)}
                              className="px-3 py-1.5 rounded-lg border border-white/20 text-white/70 text-xs"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={handleAddQuestionToQuiz}
                              className="btn-gold px-4 py-1.5 rounded-lg font-bold text-xs"
                            >
                              Ajouter la Question
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Existing Questions List */}
                      <div className="space-y-3">
                        {selectedLesson.quiz.questions.map((quest, qIdx) => (
                          <div
                            key={quest.id}
                            className="p-3.5 rounded-xl border border-border bg-card space-y-2 text-xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-navy dark:text-white flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-md bg-gold/20 text-gold font-mono text-[10px] flex items-center justify-center">
                                  {qIdx + 1}
                                </span>
                                {quest.text}
                              </span>
                              <button
                                onClick={() => handleDeleteQuestion(quest.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Options List */}
                            <div className="space-y-1 pl-6">
                              {quest.options.map((opt) => (
                                <div
                                  key={opt.id}
                                  className={cn(
                                    'px-2.5 py-1 rounded-lg border text-[11px] flex items-center justify-between',
                                    opt.isCorrect
                                      ? 'bg-emerald/15 text-emerald border-emerald/30 font-bold'
                                      : 'bg-muted/40 text-muted-foreground border-border/50'
                                  )}
                                >
                                  <span>{opt.text}</span>
                                  {opt.isCorrect && (
                                    <span className="text-[9px] uppercase font-mono tracking-wider text-emerald font-extrabold flex items-center gap-1">
                                      <Check className="w-3 h-3" /> Correcte
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-xs my-auto">
              Sélectionnez une leçon dans la colonne 2 pour afficher et modifier ses détails et ses quiz.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
