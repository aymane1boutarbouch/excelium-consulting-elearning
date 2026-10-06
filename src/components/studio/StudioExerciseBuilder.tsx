import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { InteractiveExercise } from '../../types';
import {
  PlusCircle,
  Calculator,
  BookOpen,
} from 'lucide-react';

export const StudioExerciseBuilder: React.FC = () => {
  const { courses, updateCourse, showToast } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0] || null;

  // Selected Module & Lesson
  const [selectedModuleId, setSelectedModuleId] = useState<string>(selectedCourse?.modules[0]?.id || '');
  const selectedModule = selectedCourse?.modules.find((m) => m.id === selectedModuleId) || selectedCourse?.modules[0] || null;

  const [selectedLessonId, setSelectedLessonId] = useState<string>(selectedModule?.lessons[0]?.id || '');
  const selectedLesson = selectedModule?.lessons.find((l) => l.id === selectedLessonId) || selectedModule?.lessons[0] || null;

  // Form State: Add PCM Journal Entry Exercise
  const [exTitle, setExTitle] = useState('');
  const [exPrompt, setExPrompt] = useState('');
  const [exExplanation, setExExplanation] = useState('');
  const [exXpPoints] = useState('50');

  // Accounts PCM
  const [debitCode, setDebitCode] = useState('6111');
  const [debitName, setDebitName] = useState('Achats de marchandises');
  const [debitAmount, setDebitAmount] = useState('50000');

  const [creditCode, setCreditCode] = useState('5141');
  const [creditName, setCreditName] = useState('Banques');
  const [creditAmount, setCreditAmount] = useState('50000');

  // Add PCM Exercise Submit
  const handleAddPCMExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedModule || !selectedLesson || !exTitle.trim()) return;

    const newEx: InteractiveExercise = {
      id: `ex-pcm-${Date.now()}`,
      type: 'journal_entry',
      title: exTitle,
      prompt: exPrompt || 'Enregistrez l écriture comptable correspondante au journal général.',
      debitAccounts: [
        {
          code: debitCode,
          name: debitName,
          amountMAD: parseFloat(debitAmount) || 0,
        },
      ],
      creditAccounts: [
        {
          code: creditCode,
          name: creditName,
          amountMAD: parseFloat(creditAmount) || 0,
        },
      ],
      correctDebitCode: debitCode,
      correctCreditCode: creditCode,
      explanation: exExplanation || 'Les comptes d actif et de charge augmentent au débit et diminuent au crédit.',
      xpPoints: parseInt(exXpPoints) || 50,
    };

    // Update lesson exercises
    const updatedLessons = selectedModule.lessons.map((l) => {
      if (l.id === selectedLesson.id) {
        return {
          ...l,
          exercises: [...(l.exercises || []), newEx],
        };
      }
      return l;
    });

    const updatedModules = selectedCourse.modules.map((m) => {
      if (m.id === selectedModule.id) {
        return { ...m, lessons: updatedLessons };
      }
      return m;
    });

    const updatedCourse = {
      ...selectedCourse,
      modules: updatedModules,
    };

    updateCourse(updatedCourse);
    showToast('Exercice PCM Ajouté', `L'exercice d'écriture comptable "${exTitle}" a été rattaché à la leçon.`, 'success');
    setExTitle('');
    setExPrompt('');
    setExExplanation('');
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
            <Calculator className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-mono">Concepteur d'Exercices PCM & Quizzes Fiscaux</h2>
              <span className="px-2.5 py-0.5 bg-teal-500/20 border border-teal-500/40 text-teal-300 text-[10px] font-mono font-bold rounded uppercase">
                PLAN COMPTABLE MAROCAIN 2026
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Créez des cas pratiques d'écritures au journal général, des décomptes fiscaux et des quiz interactifs pour vos apprenants.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Selector & Lesson Content */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs font-mono text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Target Course & Lesson Selection</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">1. Sélectionner la Formation :</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCourse && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">2. Sélectionner le Module :</label>
                  <select
                    value={selectedModuleId}
                    onChange={(e) => setSelectedModuleId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  >
                    {selectedCourse.modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedModule && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">3. Sélectionner la Leçon :</label>
                  <select
                    value={selectedLessonId}
                    onChange={(e) => setSelectedLessonId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  >
                    {selectedModule.lessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Existing Exercises in Lesson */}
            {selectedLesson && (
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Exercices Intégrés à cette leçon :</span>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-800 font-bold rounded">
                    {selectedLesson.exercises?.length || 0} Exercices
                  </span>
                </div>

                {(!selectedLesson.exercises || selectedLesson.exercises.length === 0) ? (
                  <div className="p-4 text-slate-400 italic text-center bg-slate-50 rounded-xl">
                    Aucun exercice interactif dans cette leçon pour l instant.
                  </div>
                ) : (
                  selectedLesson.exercises.map((ex) => (
                    <div key={ex.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="font-bold text-slate-900">{ex.title}</div>
                      <div className="text-[11px] text-slate-500">{ex.prompt}</div>
                      <div className="text-[10px] text-teal-700 font-bold">
                        Débit : {ex.correctDebitCode} • Crédit : {ex.correctCreditCode} ({ex.xpPoints} XP)
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: PCM Journal Exercise Creator Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Créer un Exercice de Journal Général (PCM Maroc)</h3>
                <p className="text-[11px] text-slate-500">
                  Définissez l'opération commerciale, les comptes Débit / Crédit et l'explication théorique.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddPCMExercise} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Titre du Cas Pratique *</label>
                <input
                  type="text"
                  placeholder="ex: Comptabilisation de la Facture d Achat Marchandises n°F881"
                  value={exTitle}
                  onChange={(e) => setExTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Énoncé de la Transaction (Prompt) *</label>
                <textarea
                  rows={3}
                  placeholder="ex: L entreprise ATLAS acquiert des marchandises pour 50 000 DH HT (TVA 20%). Le règlement est effectué par chèque bancaire n°4819."
                  value={exPrompt}
                  onChange={(e) => setExPrompt(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  required
                />
              </div>

              {/* PCM Account Entry Grid */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-teal-600" />
                  <span>Écriture Comptable PCM Attendue (Réponse Correcte)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Debit Side */}
                  <div className="p-3 bg-white border border-teal-200 rounded-xl space-y-2">
                    <span className="font-bold text-teal-700 uppercase text-[10px] block">
                      Côté DÉBIT (Augmentation Charge/Actif)
                    </span>
                    <div>
                      <label className="block text-slate-600 text-[10px]">Code Compte PCM :</label>
                      <input
                        type="text"
                        value={debitCode}
                        onChange={(e) => setDebitCode(e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[10px]">Intitulé Compte :</label>
                      <input
                        type="text"
                        value={debitName}
                        onChange={(e) => setDebitName(e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[10px]">Montant (DH) :</label>
                      <input
                        type="number"
                        value={debitAmount}
                        onChange={(e) => setDebitAmount(e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900 font-bold"
                      />
                    </div>
                  </div>

                  {/* Credit Side */}
                  <div className="p-3 bg-white border border-sky-200 rounded-xl space-y-2">
                    <span className="font-bold text-sky-700 uppercase text-[10px] block">
                      Côté CRÉDIT (Règlement / Diminution)
                    </span>
                    <div>
                      <label className="block text-slate-600 text-[10px]">Code Compte PCM :</label>
                      <input
                        type="text"
                        value={creditCode}
                        onChange={(e) => setCreditCode(e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[10px]">Intitulé Compte :</label>
                      <input
                        type="text"
                        value={creditName}
                        onChange={(e) => setCreditName(e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[10px]">Montant (DH) :</label>
                      <input
                        type="number"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900 font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Explication & Note Pédagogique de Correction</label>
                <textarea
                  rows={2}
                  placeholder="ex: Le compte 6111 Achats est débité du HT. Le compte 5141 Banque est crédité du TTC."
                  value={exExplanation}
                  onChange={(e) => setExExplanation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Enregistrer l'Exercice Pratique dans la Leçon</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
