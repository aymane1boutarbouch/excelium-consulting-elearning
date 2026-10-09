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
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col font-sans">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-[#F3EFE6] border-b border-[#E7E2D6] pt-32 pb-16 px-4 text-center">
        <div className="section-container max-w-3xl mx-auto space-y-4">
          <span className="text-[#C9A24B] text-xs font-bold uppercase tracking-widest">
            Offre Académique & Professionnelle
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0A1F44]">
            Catalogue des Formations Pratiques
          </h1>
          <p className="text-[#475569] text-base md:text-lg leading-relaxed">
            Assistances, séminaires et modules certifiants axés sur les exigences du Code Général des Impôts et de la comptabilité des sociétés au Maroc.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher (ex: Liasse Fiscale, SIMPL, TVA, Paie...)"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-[#E7E2D6] text-[#1E293B] placeholder:text-[#94A3B8] shadow-sm focus:outline-none focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B] text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Content Section */}
      <div className="py-16 flex-1">
        <div className="section-container space-y-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                selectedCategory === 'all'
                  ? 'bg-[#0A1F44] text-white shadow-sm'
                  : 'bg-white border border-[#E7E2D6] text-[#475569] hover:text-[#0A1F44] hover:border-[#C9A24B]/40'
              )}
            >
              Toutes les matières
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  selectedCategory === cat.slug
                    ? 'bg-[#0A1F44] text-white shadow-sm'
                    : 'bg-white border border-[#E7E2D6] text-[#475569] hover:text-[#0A1F44] hover:border-[#C9A24B]/40'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-[#E7E2D6] p-6 shadow-sm hover:shadow-md hover:border-[#C9A24B]/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      {course.categories && (
                        <span className="px-3 py-1 rounded-full bg-[#C9A24B]/10 text-[#0A1F44] font-semibold text-xs border border-[#C9A24B]/20">
                          {course.categories.name}
                        </span>
                      )}
                      <span className={cn('px-2.5 py-0.5 rounded text-xs font-semibold', getLevelColor(course.level))}>
                        {getLevelLabel(course.level)}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-xl text-[#0A1F44] leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-[#475569] text-sm line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-6 mt-6 border-t border-[#E7E2D6]">
                    <div className="flex items-center justify-between text-xs text-[#475569] font-mono">
                      <span>{course.duration_hours}h de formation</span>
                      <span>{course.total_lessons} leçons</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <div className="text-[11px] text-[#475569] uppercase font-semibold">Frais d&apos;inscription</div>
                        <div className="font-serif font-bold text-xl text-[#0A1F44] font-mono">
                          {formatCurrency(course.price, course.currency)}
                        </div>
                      </div>

                      <Link
                        href={`/formations/${course.slug}`}
                        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0A1F44] hover:bg-[#081836] text-white font-semibold text-xs transition-all duration-200 inline-flex items-center gap-2 group shadow-sm"
                      >
                        Consulter <ArrowRight className="w-3.5 h-3.5 text-[#C9A24B] group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E7E2D6] p-8 max-w-md mx-auto shadow-sm">
              <BookOpen className="w-12 h-12 text-[#C9A24B] mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#0A1F44] mb-2">
                Aucun programme ne correspond à votre recherche
              </h3>
              <p className="text-[#475569] text-sm mb-5 leading-relaxed">
                Modifiez vos critères de recherche ou réinitialisez les filtres.
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedLevel('all') }}
                className="btn-gold rounded-xl text-xs px-5 py-3 font-semibold"
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
