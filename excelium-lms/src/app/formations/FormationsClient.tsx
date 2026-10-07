'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, BookOpen, Clock, Users, ArrowRight, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { formatCurrency, getLevelLabel, getLevelColor, cn } from '@/lib/utils'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  price: number
  currency: string
  duration_hours: number
  total_lessons: number
  level: string
  rating_avg: number
  rating_count: number
  total_enrolled: number
  thumbnail_url: string
  is_featured: boolean
  categories?: { name: string; slug: string; color: string }
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Props {
  initialCourses: Course[]
  categories: Category[]
}

const levels = [
  { label: 'Tous les niveaux', value: 'all' },
  { label: 'Pratique', value: 'debutant' },
  { label: 'Intermédiaire', value: 'intermediaire' },
  { label: 'Avancé', value: 'avance' },
]

export default function FormationsClient({ initialCourses, categories }: Props) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')

  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        selectedCategory === 'all' || course.categories?.slug === selectedCategory

      const matchesLevel =
        selectedLevel === 'all' || course.level === selectedLevel

      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [initialCourses, search, selectedCategory, selectedLevel])

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-navy pt-32 pb-16 px-4 border-b border-white/10 text-white">
        <div className="section-container text-center max-w-3xl mx-auto space-y-4">
          <span className="text-gold text-xs font-mono uppercase tracking-widest">Offre Académique & Professionnelle</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Catalogue des Formations Pratiques
          </h1>
          <p className="text-white/70 text-sm leading-relaxed">
            Assistances, séminaires et modules certifiants axés sur les exigences du Code Général des Impôts et de la comptabilité des sociétés au Maroc.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher (ex: Liasse Fiscale, SIMPL, TVA, Paie...)"
                className="w-full pl-11 pr-4 py-3 rounded-lg bg-navy-light border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-gold text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Content Section */}
      <div className="section-padding flex-1">
        <div className="section-container space-y-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                selectedCategory === 'all'
                  ? 'bg-gold text-navy font-bold'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              )}
            >
              Toutes les matières
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-semibold transition-all',
                  selectedCategory === cat.slug
                    ? 'bg-gold text-navy font-bold'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="editorial-card flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      {course.categories && (
                        <span className="px-2.5 py-1 rounded bg-navy/5 dark:bg-white/5 text-gold font-mono font-semibold">
                          {course.categories.name}
                        </span>
                      )}
                      <span className={cn('px-2 py-0.5 rounded text-[11px] font-semibold', getLevelColor(course.level))}>
                        {getLevelLabel(course.level)}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-navy dark:text-white leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                      <span>{course.duration_hours}h de formation</span>
                      <span>{course.total_lessons} leçons</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-semibold">Frais d&apos;inscription</div>
                        <div className="font-serif font-bold text-lg text-navy dark:text-gold font-mono">
                          {formatCurrency(course.price, course.currency)}
                        </div>
                      </div>

                      <Link
                        href={`/formations/${course.slug}`}
                        className="btn-navy text-xs px-4 py-2"
                      >
                        Consulter <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 editorial-card max-w-md mx-auto">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-serif text-base font-bold text-navy dark:text-white mb-1">
                Aucun programme ne correspond à votre recherche
              </h3>
              <p className="text-muted-foreground text-xs mb-4">
                Modifiez vos critères de recherche ou réinitialisez les filtres.
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedLevel('all') }}
                className="btn-gold text-xs px-4 py-2"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
