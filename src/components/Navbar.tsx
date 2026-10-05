import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { ViewMode } from '../context/AppContext';
import { AdminLoginModal } from './AdminLoginModal';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Search,
  Building2,
  Globe,
  Menu,
  X,
  PlusCircle,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    currency,
    setCurrency,
    searchQuery,
    setSearchQuery,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    setUserRole,
    logoutAdmin,
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Secret keyboard trigger (Ctrl+Shift+A) or URL param (?admin=login) to open secret admin modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };

    if (window.location.search.includes('admin=login')) {
      setIsAdminModalOpen(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAdminSuccess = () => {
    setIsAdminModalOpen(false);
    setIsAdminAuthenticated(true);
    setUserRole('admin');
    setCurrentView('admin');
  };

  const handleNav = (view: ViewMode) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all duration-200">
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-0.5 shadow-md shadow-emerald-600/20 group-hover:shadow-emerald-600/30 transition-all">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wider text-slate-900 font-mono">
                  EXCELIUM
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60 rounded uppercase tracking-wider">
                  Cabinet
                </span>
              </div>
              <span className="text-[11px] font-semibold text-amber-700 tracking-widest uppercase font-mono">
                Consulting Compta E-Learning
              </span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une formation (ex: IS, CGNC, Audit, Paie)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentView !== 'courses') setCurrentView('courses');
                }}
                className="w-full pl-10 pr-4 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>

          {/* Navigation Links - Desktop (100% Student View) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                currentView === 'home'
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => handleNav('courses')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'courses' || currentView === 'course-detail'
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Catalogue Formations
            </button>

            <button
              onClick={() => handleNav('resources')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'resources'
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Hub Documents
            </button>

            <button
              onClick={() => handleNav('dashboard')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentView === 'dashboard'
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Mon Espace
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <button
              onClick={() => setCurrency(currency === 'MAD' ? 'EUR' : 'MAD')}
              className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-mono font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors flex items-center gap-1"
              title="Changer de devise"
            >
              <Globe className="w-3 h-3 text-cyan-600" />
              <span>{currency === 'MAD' ? 'DH (MAD)' : '€ (EUR)'}</span>
            </button>

            {/* ONLY visible when authenticated as Admin */}
            {isAdminAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('admin')}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  Studio Cabinet
                </button>
                <button
                  onClick={logoutAdmin}
                  title="Quitter l'Espace Admin"
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Pure Student Profile Trigger - Zero Admin buttons or lock icons for students! */
              <button
                onClick={() => handleNav('dashboard')}
                className="flex items-center gap-2.5 p-1.5 pr-3 bg-slate-100 border border-slate-200 rounded-full hover:border-emerald-500/50 hover:bg-slate-200/60 transition-all text-xs font-semibold text-slate-800"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500"
                />
                <span className="hidden sm:inline font-bold">{currentUser.name.split(' ')[0]}</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3">
          <input
            type="text"
            placeholder="Rechercher une formation..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentView('courses');
            }}
            className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-500"
          />
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => handleNav('home')}
              className="p-3 bg-slate-100 rounded-xl text-xs text-slate-800 text-center font-semibold"
            >
              Accueil
            </button>
            <button
              onClick={() => handleNav('courses')}
              className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 text-center font-bold"
            >
              Catalogue
            </button>
            <button
              onClick={() => handleNav('resources')}
              className="p-3 bg-slate-100 rounded-xl text-xs text-slate-800 text-center font-semibold"
            >
              Documents
            </button>
            <button
              onClick={() => handleNav('dashboard')}
              className="p-3 bg-slate-100 rounded-xl text-xs text-slate-800 text-center font-semibold"
            >
              Mon Espace
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
