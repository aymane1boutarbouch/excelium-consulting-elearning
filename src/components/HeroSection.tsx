import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Award,
  Sparkles,
  BookOpen,
  FileCheck,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Download,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-10 pb-20 border-b border-slate-200">
      {/* Background Subtle Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Cabinet Excelium Consulting Compta • Édition Officielle 2026</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Formations Avancées en{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 bg-clip-text text-transparent">
                Comptabilité & Fiscalité
              </span>{' '}
              au Maroc.
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-sans font-medium">
              Rejoignez la référence e-learning des praticiens du chiffre. Masterclass pratiques dispensées par des <strong className="text-slate-900">Experts-Comptables DPLE</strong>, avec accès aux vidéos haute sécurité, matrices Excel professionnelles et certificats officiels.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  setCurrentView('courses');
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorer le Catalogue</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setCurrentView('resources')}
                className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-cyan-600" />
                <span>Télécharger les Outils Excel</span>
              </button>
            </div>

            {/* Features Checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Conforme CGI & LF 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vidéos Anti-Fuite DRM</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Certificat Officiel Signé</span>
              </div>
            </div>
          </div>

          {/* Right Card / Visual Section */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Glass Light Card */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Espace Certification</h4>
                      <p className="text-[11px] text-slate-500">Vérification instantanée en ligne</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono font-bold rounded-lg uppercase">
                    Diplômant
                  </span>
                </div>

                {/* Stat Counters Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 text-emerald-700 text-xs font-mono font-bold mb-1">
                      <Users className="w-3.5 h-3.5" />
                      Apprenants
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">5,420+</div>
                    <div className="text-[10px] text-slate-500">Comptables & DAF formés</div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 text-cyan-700 text-xs font-mono font-bold mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Taux de Réussite
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">98.4%</div>
                    <div className="text-[10px] text-slate-500">Validation des examens</div>
                  </div>
                </div>

                {/* Sample Live Certificate Preview Box */}
                <div className="p-4 bg-gradient-to-r from-emerald-50 via-slate-50 to-amber-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-8 h-8 text-amber-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Certificat Spécialiste CGNC</div>
                      <div className="text-[10px] text-amber-800 font-mono font-bold">EXC-2026-COMPTA-8849</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="text-[11px] font-mono text-emerald-700 font-bold hover:underline"
                  >
                    Voir démo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
