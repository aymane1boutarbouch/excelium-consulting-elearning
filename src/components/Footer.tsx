import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminLoginModal } from './AdminLoginModal';
import { Building2, ShieldCheck, Mail, Phone, MapPin, Award, FileCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setIsAdminAuthenticated, setUserRole } = useApp();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleAdminSuccess = () => {
    setIsAdminModalOpen(false);
    setIsAdminAuthenticated(true);
    setUserRole('admin');
    setCurrentView('admin');
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs">
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold shadow-md">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 font-mono">EXCELIUM</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Cabinet d'Expertise Comptable, d'Audit et de Conseil Fiscal à Casablanca. Plateforme E-Learning certifiée pour professionnels du chiffre et gestionnaires au Maroc.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-mono font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Contenu Protégé DRM & Filigrane Anti-Fuite</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4 text-xs font-mono uppercase tracking-wider">
              Formations Clés
            </h4>
            <ul className="space-y-2.5 font-medium text-slate-600">
              <li>
                <button
                  onClick={() => setCurrentView('courses')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Comptabilité Générale CGNC 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('courses')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Masterclass Fiscalité CGI (IS / IR / TVA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('courses')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Audit Financier & Révision des Comptes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('courses')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Sage Saari 100c Comptabilité & Paie
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('courses')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Analyse Financière & Normes IFRS
                </button>
              </li>
            </ul>
          </div>

          {/* Hub & Certifications */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4 text-xs font-mono uppercase tracking-wider">
              Outils & Documents
            </h4>
            <ul className="space-y-2.5 font-medium text-slate-600">
              <li>
                <button
                  onClick={() => setCurrentView('resources')}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5 text-cyan-600" />
                  Plan Comptable Marocain (PDF)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('resources')}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5 text-cyan-600" />
                  Matrice Passage Comptable-Fiscal Excel
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('resources')}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5 text-cyan-600" />
                  Simulateur de Paie Maroc 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="hover:text-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Vérificateur de Certificats Officiels
                </button>
              </li>
            </ul>
          </div>

          {/* Cabinet Address & Hidden Admin Access */}
          <div>
            <h4 className="text-slate-900 font-bold mb-4 text-xs font-mono uppercase tracking-wider">
              Cabinet Excelium
            </h4>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Bd Al Massira Al Khadra, Maarif / CFC, Casablanca - Maroc</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>+212 (0) 5 22 88 99 00</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>contact@excelium-consulting.ma</span>
              </li>

              <li className="pt-2">
                <span className="text-[11px] font-mono text-slate-400">
                  Plateforme Agréée - Cabinet d'Expertise Comptable DPLE
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © 2026 EXCELIUM CONSULTING COMPTA S.A.R.L. Tous droits réservés.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 cursor-pointer">Conditions Générales de Vente</span>
            <span className="hover:text-slate-900 cursor-pointer">Politique de Confidentialité</span>
            <span className="hover:text-slate-900 cursor-pointer">Protection des Données (CNDP)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
