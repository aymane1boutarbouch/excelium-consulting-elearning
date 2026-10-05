import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  Clock,
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Award,
  FileCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Download,
} from 'lucide-react';

export const CourseDetailView: React.FC = () => {
  const {
    courses,
    selectedCourseId,
    setCurrentView,
    setSelectedLessonId,
    isCourseEnrolled,
    formatPrice,
    enrollInCourse,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'programme' | 'objectifs' | 'instructor' | 'files'>('programme');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'c1-mod-1': true,
    'c2-mod-1': true,
  });

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const enrolled = isCourseEnrolled(course.id);

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleStartLearning = (lessonId?: string) => {
    if (lessonId) setSelectedLessonId(lessonId);
    setCurrentView('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnrollClick = () => {
    if (enrolled) {
      handleStartLearning();
    } else if (course.isFree) {
      enrollInCourse(course.id, 'coupon');
      handleStartLearning();
    } else {
      setCurrentView('checkout');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Banner Header */}
      <div className="relative bg-white border-b border-slate-200 pt-10 pb-16 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                <span className="px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold rounded-lg uppercase">
                  {course.category}
                </span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg">
                  {course.level}
                </span>
                {course.isBestseller && (
                  <span className="px-2.5 py-1 bg-amber-500 text-white font-bold rounded-lg uppercase flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" /> Bestseller Cabinet
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans font-medium">
                {course.subtitle}
              </p>

              {/* Course Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 font-mono pt-2">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{course.rating}</span>
                  <span className="text-slate-500 font-normal">({course.ratingCount} avis praticiens)</span>
                </div>

                <div className="flex items-center gap-1.5 font-semibold">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{course.durationHours} Heures de Vidéo HD</span>
                </div>

                <div className="flex items-center gap-1.5 font-semibold">
                  <BookOpen className="w-4 h-4 text-cyan-600" />
                  <span>{course.totalLessons} Leçons Pratiques</span>
                </div>
              </div>

              {/* Instructor Avatar Bar */}
              <div className="flex items-center gap-3 pt-3">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructorName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                />
                <div className="text-xs">
                  <div className="text-slate-500">Formateur Référent :</div>
                  <div className="text-slate-900 font-bold">{course.instructorName}</div>
                  <div className="text-slate-500 text-[11px]">{course.instructorTitle}</div>
                </div>
              </div>
            </div>

            {/* Right Floating Purchase Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
                {/* Video Trailer Thumbnail */}
                <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 group">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-90"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-slate-900/80 rounded text-[10px] text-white font-mono font-bold">
                    Extrait Vidéo Gratuit
                  </div>
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {formatPrice(course.priceMAD)}
                    </span>
                    {course.originalPriceMAD > course.priceMAD && (
                      <span className="text-sm text-slate-400 line-through font-mono">
                        {formatPrice(course.originalPriceMAD)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-700 font-mono font-bold">
                    {enrolled ? 'Accès illimité débloqué' : 'Accès à vie + Mises à jour 2026 gratuites'}
                  </p>
                </div>

                {/* Main Action Button */}
                <button
                  onClick={handleEnrollClick}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {enrolled ? (
                    <>
                      <BookOpen className="w-5 h-5" />
                      <span>Continuer la Formation</span>
                    </>
                  ) : course.isFree ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>S'inscrire Gratuitement</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-5 h-5" />
                      <span>S'inscrire à la Masterclass</span>
                    </>
                  )}
                </button>

                {/* Guarantee Features */}
                <div className="space-y-2.5 text-xs text-slate-600 font-medium pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Certificat de Spécialisation Certifié</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>Fichiers Excel & PDF Téléchargeables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Filigrane Sécurisé Anti-Fuite DRM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Detail Body Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 overflow-x-auto">
              <button
                onClick={() => setActiveTab('programme')}
                className={`px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'programme'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Programme de Formation
              </button>
              <button
                onClick={() => setActiveTab('objectifs')}
                className={`px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'objectifs'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Objectifs & Prérequis
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`px-5 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'files'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Documents Offerts ({course.modules.flatMap((m) => m.lessons.flatMap((l) => l.resources)).length})
              </button>
            </div>

            {/* TAB 1: Programme Accordion */}
            {activeTab === 'programme' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Modules & Leçons ({course.totalLessons} leçons)</h3>
                  <span className="text-xs text-slate-500 font-mono font-medium">
                    Durée Totale : {course.durationHours} Heures
                  </span>
                </div>

                <div className="space-y-3">
                  {course.modules.map((mod, modIdx) => {
                    const isExpanded = expandedModules[mod.id] ?? true;
                    return (
                      <div
                        key={mod.id}
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs"
                      >
                        {/* Module Header */}
                        <div
                          onClick={() => toggleModule(mod.id)}
                          className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
                        >
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span className="text-emerald-700 font-mono">0{modIdx + 1}.</span>
                              {mod.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 font-mono font-medium">
                              {mod.lessons.length} leçons
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                        </div>

                        {/* Lessons List */}
                        {isExpanded && (
                          <div className="border-t border-slate-100 divide-y divide-slate-100">
                            {mod.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="p-3.5 pl-6 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs"
                              >
                                <div className="flex items-center gap-3">
                                  {enrolled || lesson.isFreePreview ? (
                                    <Play className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                  )}
                                  <div>
                                    <span className="text-slate-800 font-semibold">{lesson.title}</span>
                                    {lesson.isFreePreview && !enrolled && (
                                      <span className="ml-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded font-mono font-bold">
                                        Aperçu Gratuit
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="text-slate-500 font-mono text-[11px]">
                                    {lesson.duration}
                                  </span>
                                  {(enrolled || lesson.isFreePreview) && (
                                    <button
                                      onClick={() => handleStartLearning(lesson.id)}
                                      className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-600 hover:text-white font-bold rounded-lg transition-colors text-[11px]"
                                    >
                                      Visionner
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Objectifs & Prérequis */}
            {activeTab === 'objectifs' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900">Ce que vous allez maîtriser</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.learningObjectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900">Public Cible & Prérequis</h3>
                  <div className="space-y-2 text-xs text-slate-600 font-medium">
                    <p className="font-bold text-slate-800">Pour qui est cette formation ?</p>
                    <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                      {course.targetAudience.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Documents Offerts */}
            {activeTab === 'files' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">Fichiers & Modèles Pratiques Inclus</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.modules
                    .flatMap((m) => m.lessons.flatMap((l) => l.resources))
                    .map((res) => (
                      <div
                        key={res.id}
                        className="p-4 bg-white border border-slate-200 rounded-2xl flex items-start gap-3 shadow-xs"
                      >
                        <FileCheck className="w-8 h-8 text-cyan-600 shrink-0 mt-1" />
                        <div className="flex-1 text-xs">
                          <h4 className="font-bold text-slate-900">{res.title}</h4>
                          <p className="text-slate-500 text-[11px] mt-1">{res.description}</p>
                          <div className="flex items-center justify-between mt-3 font-mono text-[10px]">
                            <span className="text-emerald-800 font-bold uppercase">{res.fileType} • {res.fileSize}</span>
                            {enrolled ? (
                              <button
                                onClick={() => showToast('Téléchargement', `Fichier ${res.title} téléchargé.`)}
                                className="text-cyan-700 hover:underline font-bold flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" /> Télécharger
                              </button>
                            ) : (
                              <span className="text-slate-400">Débloqué après inscription</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
