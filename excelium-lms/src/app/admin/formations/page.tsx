'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen, Plus, Search, Filter, Edit3, Trash2, Eye, Star,
  Users, CheckCircle, Clock, Upload, Download, Sparkles,
  Columns, LayoutGrid, FileSpreadsheet, FileText, Layers
} from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'
import FormationImporterModal from '@/components/admin/FormationImporterModal'
import ThreeColumnCurriculumBuilder from '@/components/admin/ThreeColumnCurriculumBuilder'
import { ParsedFormation } from '@/lib/importers/formationParser'
import * as XLSX from 'xlsx'

const initialMockCourses = [
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
  const [courses, setCourses] = useState(initialMockCourses)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isImporterOpen, setIsImporterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'3columns' | 'grid'>('3columns')

  const togglePublish = (id: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPublished: !c.isPublished } : c))
    )
    toast.success('Statut de publication mis à jour !')
  }

  const handleDelete = (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette formation ?')) {
      setCourses((prev) => prev.filter((c) => c.id !== id))
      toast.success('Formation supprimée du catalogue.')
    }
  }

  const handleImportSuccess = (imported: ParsedFormation[]) => {
    const formattedNew = imported.map((imp, idx) => ({
      id: `c-imp-${Date.now()}-${idx}`,
      title: imp.title,
      slug: imp.slug,
      category: imp.category,
      price: imp.price,
      currency: imp.currency || 'MAD',
      durationHours: imp.durationHours,
      totalLessons: imp.modules.reduce((sum, m) => sum + m.lessons.length, 0),
      totalEnrolled: 0,
      ratingAvg: 5.0,
      isPublished: true,
      isFeatured: false,
      level: imp.level,
      updatedAt: new Date().toISOString().split('T')[0],
    }))

    setCourses((prev) => [...formattedNew, ...prev])
  }

  const handleExportExcel = () => {
    const dataToExport = courses.map((c) => ({
      ID: c.id,
      Titre: c.title,
      Catégorie: c.category,
      Prix_MAD: c.price,
      Niveau: c.level,
      Durée_Heures: c.durationHours,
      Nombre_Leçons: c.totalLessons,
      Inscrits: c.totalEnrolled,
      Statut: c.isPublished ? 'Publié' : 'Brouillon',
      Dernière_Mise_A_Jour: c.updatedAt,
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Catalogue_Formations')
    XLSX.writeFile(workbook, `Catalogue_Formations_Excelium_${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Catalogue des formations exporté en Excel !')
  }

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'published' && c.isPublished) ||
      (selectedStatus === 'draft' && !c.isPublished)
    return matchesSearch && matchesCat && matchesStatus
  })

  const totalValue = courses.reduce((acc, c) => acc + c.price * c.totalEnrolled, 0)

  return (
    <div className="space-y-6">
      {/* Importer Modal Component */}
      <FormationImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-navy dark:text-white text-2xl flex items-center gap-2">
            Gestion &amp; Création des Formations
            <span className="text-xs font-mono bg-gold/15 text-gold px-2.5 py-0.5 rounded-full border border-gold/30">
              {courses.length} Formations
            </span>
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Gérez votre catalogue en mode 3-Colonnes (Formations / Leçons / Quiz) ou via la grille de cartes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border">
            <button
              onClick={() => setViewMode('3columns')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
                viewMode === '3columns'
                  ? 'bg-navy dark:bg-navy-900 text-gold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Columns className="w-3.5 h-3.5" /> 3 Colonnes (Formations / Leçons / Quiz)
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5',
                viewMode === 'grid'
                  ? 'bg-navy dark:bg-navy-900 text-gold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grille Cartes
            </button>
          </div>

          {/* Main Excel/Word Import Button */}
          <button
            onClick={() => setIsImporterOpen(true)}
            className="btn-gold text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-gold"
          >
            <Upload className="w-4 h-4" />
            <span>Importer Word / Excel</span>
          </button>

          <Link
            href="/admin/formations/nouveau"
            className="px-4 py-2.5 rounded-xl bg-navy dark:bg-navy-900 border border-white/20 text-white hover:border-gold text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-gold" /> Nouvelle Formation
          </Link>
        </div>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card-light dark:glass-card p-4 rounded-2xl border border-border">
          <div className="text-xs text-muted-foreground font-semibold">Total Formations</div>
          <div className="font-display font-bold text-2xl text-navy dark:text-white mt-1 font-mono">
            {courses.length}
          </div>
        </div>

        <div className="glass-card-light dark:glass-card p-4 rounded-2xl border border-border">
          <div className="text-xs text-muted-foreground font-semibold">En Ligne (Publiées)</div>
          <div className="font-display font-bold text-2xl text-emerald mt-1 font-mono">
            {courses.filter((c) => c.isPublished).length}
          </div>
        </div>

        <div className="glass-card-light dark:glass-card p-4 rounded-2xl border border-border">
          <div className="text-xs text-muted-foreground font-semibold">Inscrits Totaux</div>
          <div className="font-display font-bold text-2xl text-gold mt-1 font-mono">
            {courses.reduce((acc, c) => acc + c.totalEnrolled, 0)}
          </div>
        </div>

        <div className="glass-card-light dark:glass-card p-4 rounded-2xl border border-border">
          <div className="text-xs text-muted-foreground font-semibold">Chiffre d&apos;Affaires Généré</div>
          <div className="font-display font-bold text-xl text-navy dark:text-white mt-1 font-mono">
            {formatCurrency(totalValue, 'MAD')}
          </div>
        </div>
      </div>

      {/* VIEW CONDITIONAL: 3 COLUMNS vs GRID */}
      {viewMode === '3columns' ? (
        <ThreeColumnCurriculumBuilder />
      ) : (
        <>
          {/* Search & Filter Bar */}
          <div className="glass-card-light dark:glass-card p-4 rounded-2xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par titre ou catégorie..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none text-navy dark:text-white"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="Fiscalité Marocaine">Fiscalité Marocaine</option>
                  <option value="Comptabilité">Comptabilité &amp; Finance</option>
                  <option value="Gestion Sociale">Gestion Sociale &amp; Paie</option>
                </select>
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none text-navy dark:text-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="published">Publiés uniquement</option>
                <option value="draft">Brouillons</option>
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
                className="glass-card-light dark:glass-card rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-gold/40 transition-all group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-gold/15 text-gold text-[10px] font-bold uppercase tracking-wider">
                      {course.category}
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1',
                        course.isPublished
                          ? 'bg-emerald/10 text-emerald border-emerald/20'
                          : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                      )}
                    >
                      <span className={cn('w-1.5 h-1.5 rounded-full', course.isPublished ? 'bg-emerald' : 'bg-yellow-500')} />
                      {course.isPublished ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-navy dark:text-white text-base leading-snug mb-2 group-hover:text-gold transition-colors line-clamp-2">
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
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Tarif officiel</div>
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
                      className="flex-1 btn-gold py-2 text-xs text-center justify-center font-bold rounded-xl flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Modifier &amp; Syllabus
                    </Link>
                    <Link
                      href={`/formations/${course.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Voir l'aperçu public"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
