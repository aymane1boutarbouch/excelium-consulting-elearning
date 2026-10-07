'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Plus, Search, Filter, Edit3, Trash2, Eye, Star, Users, CheckCircle, Clock } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'

const mockCourses = [
  {
    id: 'c-01',
    title: 'Pratique de la Liasse Fiscale Marocaine & IS 2026',
    slug: 'liasse-fiscale-marocaine',
    category: 'Fiscalité Marocaine',
    price: 1490,
    currency: 'MAD',
    durationHours: 18,
    totalLessons: 12,
    totalEnrolled: 142,
    ratingAvg: 4.9,
    isPublished: true,
    isFeatured: true,
    level: 'Avancé',
    updatedAt: '2026-03-01',
  },
  {
    id: 'c-02',
    title: 'Comptabilité Générale des Sociétés selon le PCM',
    slug: 'comptabilite-societes-pcm',
    category: 'Comptabilité',
    price: 1250,
    currency: 'MAD',
    durationHours: 24,
    totalLessons: 16,
    totalEnrolled: 98,
    ratingAvg: 4.8,
    isPublished: true,
    isFeatured: false,
    level: 'Intermédiaire',
    updatedAt: '2026-02-15',
  },
  {
    id: 'c-03',
    title: 'Gestion de la Paie, CNSS & SIMPL-Paie',
    slug: 'paie-cnss-simpl-paie',
    category: 'Gestion Sociale',
    price: 990,
    currency: 'MAD',
    durationHours: 14,
    totalLessons: 10,
    totalEnrolled: 76,
    ratingAvg: 4.7,
    isPublished: true,
    isFeatured: true,
    level: 'Débutant',
    updatedAt: '2026-03-10',
  },
  {
    id: 'c-04',
    title: 'Audit Fiscal & Préparation au Contrôle de l\'Administration',
    slug: 'audit-fiscal-maroc',
    category: 'Fiscalité Marocaine',
    price: 1890,
    currency: 'MAD',
    durationHours: 20,
    totalLessons: 14,
    totalEnrolled: 54,
    ratingAvg: 5.0,
    isPublished: true,
    isFeatured: false,
    level: 'Avancé',
    updatedAt: '2026-01-20',
  },
  {
    id: 'c-05',
    title: 'Déclarations de TVA & Télé-procédures SIMPL-TVA',
    slug: 'tva-simpl-tva',
    category: 'Fiscalité Marocaine',
    price: 890,
    currency: 'MAD',
    durationHours: 10,
    totalLessons: 8,
    totalEnrolled: 32,
    ratingAvg: 4.6,
    isPublished: false,
    isFeatured: false,
    level: 'Débutant',
    updatedAt: '2026-03-25',
  },
]

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState(mockCourses)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const togglePublish = (id: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, isPublished: !c.isPublished } : c))
    toast.success('Statut de publication mis à jour')
  }

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette formation ?')) {
      setCourses(prev => prev.filter(c => c.id !== id))
      toast.success('Formation supprimée')
    }
  }

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-navy dark:text-white text-2xl">
            Gestion du Catalogue des Formations
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Gérez vos cours, leçons, tarifs et paramètres de publication
          </p>
        </div>
        <Link
          href="/admin/formations/nouveau"
          className="btn-gold text-xs px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nouvelle Formation
        </Link>
      </div>

      {/* Filters bar */}
      <div className="glass-card-light dark:glass-card p-4 rounded-2xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une formation..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none text-navy dark:text-white"
          >
            <option value="all">Toutes les catégories</option>
            <option value="Fiscalité Marocaine">Fiscalité Marocaine</option>
            <option value="Comptabilité">Comptabilité</option>
            <option value="Gestion Sociale">Gestion Sociale</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-light dark:glass-card rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-gold/40 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider">
                  {course.category}
                </span>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                  course.isPublished ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-muted text-muted-foreground border-border'
                )}>
                  {course.isPublished ? 'Publié' : 'Brouillon'}
                </span>
              </div>

              <h3 className="font-display font-bold text-navy dark:text-white text-base leading-snug mb-2 group-hover:text-gold transition-colors">
                {course.title}
              </h3>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gold" />
                  {course.totalEnrolled} étudiants
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {course.durationHours}h ({course.totalLessons} leçons)
                </span>
              </div>
            </div>

            <div>
              <div className="pt-4 border-t border-border flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Prix de vente</div>
                  <div className="font-mono font-bold text-navy dark:text-white text-base">
                    {formatCurrency(course.price, course.currency)}
                  </div>
                </div>
                <button
                  onClick={() => togglePublish(course.id)}
                  className={cn(
                    'text-xs font-bold px-3 py-1.5 rounded-xl border transition-all',
                    course.isPublished
                      ? 'bg-emerald/10 text-emerald border-emerald/20 hover:bg-emerald/20'
                      : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20'
                  )}
                >
                  {course.isPublished ? 'Masquer' : 'Publier'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/formations/${course.id}`}
                  className="flex-1 btn-gold py-2 text-xs text-center justify-center font-bold rounded-xl"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1" /> Modifier &amp; Syllabus
                </Link>
                <Link
                  href={`/formations/${course.slug}`}
                  target="_blank"
                  className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
