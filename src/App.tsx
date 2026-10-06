import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { HeroSection } from './components/HeroSection';
import { CourseCatalogView } from './components/CourseCatalogView';
import { CourseDetailView } from './components/CourseDetailView';
import { SecureClassroomView } from './components/SecureClassroomView';
import { QuizExamView } from './components/QuizExamView';
import { CertificateViewer } from './components/CertificateViewer';
import { DocumentHubView } from './components/DocumentHubView';
import { StudentDashboardView } from './components/StudentDashboardView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ExceliumStudioView } from './components/studio/ExceliumStudioView';
import { CheckoutView } from './components/CheckoutView';
import { CourseCard } from './components/CourseCard';
import {
  ShieldCheck,
  Award,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView, courses, setCurrentView, isAdminAuthenticated, setIsAdminAuthenticated, setUserRole } = useApp();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const featuredCourses = courses.slice(0, 3);

  const handleAdminAuthSuccess = () => {
    setIsAdminModalOpen(false);
    setIsAdminAuthenticated(true);
    setUserRole('admin');
    setCurrentView('studio');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <Toast />

      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <div className="space-y-16 pb-20">
            <HeroSection />

            {/* Featured Courses Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Incontournables Cabinet Excelium</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Formations Vedettes les Plus Demandées
                  </h2>
                </div>

                <button
                  onClick={() => setCurrentView('courses')}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-emerald-800 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Voir toutes les formations ({courses.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            </section>

            {/* Why Cabinet Excelium Section */}
            <section className="bg-white border-y border-slate-200 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-bold rounded uppercase">
                    Excellence & Sécurité Garanties
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                    Pourquoi choisir la plateforme E-Learning d'Excelium ?
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Nous combinons l'expertise de terrain d'un cabinet fiduciaire avec les meilleures technologies e-learning modernes.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 shadow-xs">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-6 h-6 text-emerald-700" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Vidéos Haute Sécurité DRM</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Filigrane dynamique personnalisé (Nom, Email, IP) affiché en temps réel sur le lecteur pour garantir la confidentialité absolue des formations du cabinet.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 shadow-xs">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-300 text-cyan-800 flex items-center justify-center font-bold">
                      <FileSpreadsheet className="w-6 h-6 text-cyan-700" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Matrices Excel Complètes</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Téléchargez les vrais outils de travail du cabinet : matrices automatisées de passage comptable-fiscal IS 2026, calculatrices de paie CNSS/IR et liasses fiscales.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 shadow-xs">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-bold">
                      <Award className="w-6 h-6 text-amber-700" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Certificat Officiel Signé</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Obtenez un certificat professionnel d'Expertise Comptable Spécialisée vérifiable par QR code, reconnu par les cabinets et entreprises au Maroc.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Complete Catalog Section */}
            <CourseCatalogView />
          </div>
        )}

        {currentView === 'courses' && <CourseCatalogView />}
        {currentView === 'course-detail' && <CourseDetailView />}
        {currentView === 'classroom' && <SecureClassroomView />}
        {currentView === 'exam' && <QuizExamView />}
        {currentView === 'certificate' && <CertificateViewer />}
        {currentView === 'resources' && <DocumentHubView />}
        {currentView === 'dashboard' && <StudentDashboardView />}
        {(currentView === 'admin' || currentView === 'studio') && (
          isAdminAuthenticated ? (
            <ExceliumStudioView />
          ) : (
            <div className="min-h-screen bg-slate-950 py-20 px-4 text-center space-y-4 text-white">
              <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-xl font-bold">Accès Espace Studio Requis</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-mono">
                Veuillez vous authentifier pour accéder au Studio Pédagogique du Cabinet Excelium.
              </p>
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg font-mono"
              >
                Se connecter au Studio
              </button>
            </div>
          )
        )}
        {currentView === 'checkout' && <CheckoutView />}
      </main>

      {currentView !== 'classroom' && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
