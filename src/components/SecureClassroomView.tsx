import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VideoPlayer } from './VideoPlayer';
import { InteractiveAccountingCalculator } from './InteractiveAccountingCalculator';
import { InteractiveDataCampPractice } from './InteractiveDataCampPractice';
import {
  BookOpen,
  CheckCircle2,
  Play,
  FileCheck,
  Award,
  Download,
  ChevronLeft,
  ChevronRight,
  Save,
  Sparkles,
  ArrowLeft,
  Calculator,
  Flame,
} from 'lucide-react';

export const SecureClassroomView: React.FC = () => {
  const {
    courses,
    selectedCourseId,
    selectedLessonId,
    setSelectedLessonId,
    setCurrentView,
    isLessonCompleted,
    markLessonCompleted,
    saveLessonNote,
    currentUser,
    getCourseProgressPercent,
    showToast,
  } = useApp();

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const allLessons = course.modules.flatMap((m) => m.lessons);

  const currentLesson =
    allLessons.find((l) => l.id === selectedLessonId) || allLessons[0] || course.modules[0]?.lessons[0];

  const [activeTab, setActiveTab] = useState<'summary' | 'practice' | 'resources' | 'calculateurs' | 'notes' | 'quiz'>('summary');
  const [personalNote, setPersonalNote] = useState<string>(
    currentUser.savedNotes[currentLesson?.id || ''] || ''
  );

  const progressPercent = getCourseProgressPercent(course.id);
  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextL = allLessons[currentLessonIndex + 1];
      setSelectedLessonId(nextL.id);
      setPersonalNote(currentUser.savedNotes[nextL.id] || '');
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      const prevL = allLessons[currentLessonIndex - 1];
      setSelectedLessonId(prevL.id);
      setPersonalNote(currentUser.savedNotes[prevL.id] || '');
    }
  };

  const handleSaveNote = () => {
    if (currentLesson) {
      saveLessonNote(currentLesson.id, personalNote);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Classroom Bar */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('course-detail')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Quitter la classe</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="truncate">
              <h2 className="text-sm font-bold text-slate-900 truncate">{course.title}</h2>
              <p className="text-[11px] text-emerald-700 font-mono font-bold truncate">
                Leçon {currentLessonIndex + 1} / {allLessons.length} : {currentLesson?.title}
              </p>
            </div>
          </div>

          {/* Course Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 font-mono text-xs">
              <span className="text-slate-500 font-medium">Progression :</span>
              <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-slate-900 font-bold">{progressPercent}%</span>
            </div>

            {/* Launch Exam Button if available */}
            {course.finalExam && (
              <button
                onClick={() => setCurrentView('exam')}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs rounded-xl shadow hover:scale-105 transition-transform flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Examen Officiel</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Classroom Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Main Content: Video Player & Tabs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player */}
          {currentLesson && (
            <VideoPlayer
              videoUrl={currentLesson.videoUrl}
              videoType={currentLesson.videoType}
              title={currentLesson.title}
              lessonId={currentLesson.id}
            />
          )}

          {/* Navigation & Mark Completed Controls */}
          <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <button
              onClick={handlePrevLesson}
              disabled={currentLessonIndex === 0}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>

            <button
              onClick={() => {
                if (currentLesson) markLessonCompleted(currentLesson.id);
                handleNextLesson();
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Valider & Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Lesson Tabs Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex border-b border-slate-200 gap-4 overflow-x-auto text-xs font-bold">
              <button
                onClick={() => setActiveTab('practice')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'practice'
                    ? 'border-amber-500 text-amber-700 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>Practice Interactif (Style DataCamp)</span>
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'summary'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Notes de Cours & Synthèse
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'resources'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Fichiers Jointes ({currentLesson?.resources.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('calculateurs')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'calculateurs'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-cyan-600" />
                <span>Calculateurs & Outils</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'notes'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Mes Notes Personnelles
              </button>
              {currentLesson?.quiz && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === 'quiz'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Quiz d'Auto-Évaluation
                </button>
              )}
            </div>

            {/* TAB CONTENT: DataCamp Practice */}
            {activeTab === 'practice' && (
              <InteractiveDataCampPractice exercises={currentLesson?.exercises} />
            )}

            {/* TAB CONTENT: Calculateurs */}
            {activeTab === 'calculateurs' && (
              <InteractiveAccountingCalculator />
            )}

            {/* TAB CONTENT: Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">{currentLesson?.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                  {currentLesson?.description}
                </p>

                {currentLesson?.keyTakeaways && currentLesson.keyTakeaways.length > 0 && (
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                    <h4 className="text-xs font-mono font-bold text-emerald-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Points Clés à Retenir (CGNC / CGI 2026) :
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                      {currentLesson.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Downloadable Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Documents associés à cette leçon</h4>
                {currentLesson?.resources.length ? (
                  currentLesson.resources.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-6 h-6 text-cyan-600 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-900">{res.title}</div>
                          <div className="text-[10px] text-slate-500">{res.description}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast('Téléchargement', `Téléchargement de ${res.title}...`)}
                        className="px-3 py-1.5 bg-cyan-50 border border-cyan-200 text-cyan-800 hover:bg-cyan-600 hover:text-white font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger ({res.fileSize})</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Aucun fichier attaché à cette leçon spécifique.</p>
                )}
              </div>
            )}

            {/* TAB CONTENT: Personal Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">Bloc-Notes Personnel (Sauvegarde Auto)</h4>
                  <button
                    onClick={handleSaveNote}
                    className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-600 hover:text-white font-bold rounded-lg transition-colors text-xs flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Sauvegarder</span>
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  placeholder="Prenez vos notes personnelles ici (ex: formules comptables, références CGI, remarques)..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 font-mono"
                />
              </div>
            )}

            {/* TAB CONTENT: Quiz */}
            {activeTab === 'quiz' && currentLesson?.quiz && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">{currentLesson.quiz.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{currentLesson.quiz.description}</p>
                  </div>
                  <button
                    onClick={() => setCurrentView('exam')}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow"
                  >
                    Démarrer le Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Curriculum Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 sticky top-20">
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Sommaire du Cours</span>
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {course.modules.map((mod, modIdx) => (
                <div key={mod.id} className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-800 bg-slate-100 p-2.5 rounded-xl border border-slate-200 font-mono">
                    Module 0{modIdx + 1} : {mod.title}
                  </div>

                  <div className="pl-2 space-y-1">
                    {mod.lessons.map((lesson) => {
                      const isCurrent = lesson.id === currentLesson?.id;
                      const completed = isLessonCompleted(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            setSelectedLessonId(lesson.id);
                            setPersonalNote(currentUser.savedNotes[lesson.id] || '');
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                            isCurrent
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold shadow-xs'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] font-mono opacity-70 ml-2 shrink-0">
                            {lesson.duration}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
