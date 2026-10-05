import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CourseCard } from './CourseCard';
import { BookOpen, Search, SlidersHorizontal, Layers } from 'lucide-react';

export const CourseCatalogView: React.FC = () => {
  const {
    courses,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useApp();

  const [selectedLevel, setSelectedLevel] = useState<string>('Tous');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('Tous');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  const categories = ['Tous', 'Comptabilité', 'Fiscalité', 'Finance', 'Audit', 'Logiciels Comptables'];
  const levels = ['Tous', 'Débutant', 'Intermédiaire', 'Expert', 'Tous Niveaux'];

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Category filter
        if (selectedCategory !== 'Tous' && course.category !== selectedCategory) {
          return false;
        }

        // Level filter
        if (selectedLevel !== 'Tous' && course.level !== selectedLevel) {
          return false;
        }

        // Price filter
        if (selectedPriceFilter === 'Gratuit' && !course.isFree) return false;
        if (selectedPriceFilter === 'Payant' && course.isFree) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = course.title.toLowerCase().includes(q);
          const matchSubtitle = course.subtitle.toLowerCase().includes(q);
          const matchCategory = course.category.toLowerCase().includes(q);
          const matchInstructor = course.instructorName.toLowerCase().includes(q);
          return matchTitle || matchSubtitle || matchCategory || matchInstructor;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceMAD - b.priceMAD;
        if (sortBy === 'price-desc') return b.priceMAD - a.priceMAD;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.ratingCount - a.ratingCount; // popular
      });
  }, [courses, selectedCategory, selectedLevel, selectedPriceFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Catalog Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Catalogue Officiel Cabinet Excelium</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Formations & Masterclass de Spécialisation
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Explorez nos formations pratiques certifiées adaptées à la réglementation marocaine 2026.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par mot clé, CGI, IS, Paie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat === 'Tous' && <Layers className="w-3.5 h-3.5" />}
            {cat}
          </button>
        ))}
      </div>

      {/* Secondary Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-2xl text-xs shadow-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono font-medium">Niveau :</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none font-medium"
            >
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-mono font-medium">Prix :</span>
            <select
              value={selectedPriceFilter}
              onChange={(e) => setSelectedPriceFilter(e.target.value)}
              className="bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none font-medium"
            >
              <option value="Tous">Tous les prix</option>
              <option value="Gratuit">Formations Offertes (0 DH)</option>
              <option value="Payant">Formations Premium</option>
            </select>
          </div>
        </div>

        {/* Sort switcher */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-mono font-medium">Trier par :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-100 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none font-medium"
          >
            <option value="popular">Plus populaires</option>
            <option value="rating">Meilleures notes</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Aucune formation trouvée</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Essayer de modifier vos filtres ou de chercher un autre terme (ex: Comptabilité, IS, Paie, Audit).
          </p>
          <button
            onClick={() => {
              setSelectedCategory('Tous');
              setSelectedLevel('Tous');
              setSelectedPriceFilter('Tous');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
