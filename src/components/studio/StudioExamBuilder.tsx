import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Quiz, Question } from '../../types';
import {
  Award,
  PlusCircle,
  Trash2,
  Sparkles,
  BookOpen,
  FileCheck,
} from 'lucide-react';

export const StudioExamBuilder: React.FC = () => {
  const { courses, updateCourse, showToast } = useApp();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0] || null;

  // Exam Form State
  const [examTitle, setExamTitle] = useState(selectedCourse?.finalExam?.title || 'Examen de Certification Officiel');
  const [examDesc, setExamDesc] = useState(selectedCourse?.finalExam?.description || 'Évaluation finale chronométrée. Obtenez 80% ou plus pour valider votre Certificat.');
  const [timeLimit, setTimeLimit] = useState(selectedCourse?.finalExam?.timeLimitMinutes.toString() || '30');
  const [passingScore, setPassingScore] = useState(selectedCourse?.finalExam?.passingScorePercent.toString() || '80');

  // New Question Form State
  const [qText, setQText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctIdx, setCorrectIdx] = useState('0');
  const [qExplanation, setQExplanation] = useState('');
  const [qCalcStep, setQCalcStep] = useState('');

  // Handle Course Change
  const handleCourseChange = (id: string) => {
    setSelectedCourseId(id);
    const crs = courses.find((c) => c.id === id);
    if (crs?.finalExam) {
      setExamTitle(crs.finalExam.title);
      setExamDesc(crs.finalExam.description);
      setTimeLimit(crs.finalExam.timeLimitMinutes.toString());
      setPassingScore(crs.finalExam.passingScorePercent.toString());
    } else {
      setExamTitle(`Examen de Certification : ${crs?.title || ''}`);
      setExamDesc('Évaluation finale chronométrée. Obtenez le score minimum pour valider votre attestation.');
      setTimeLimit('30');
      setPassingScore('80');
    }
  };

  // Add Question to Exam
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !qText.trim() || !opt0.trim() || !opt1.trim()) {
      showToast('Formulaire Incomplet', 'Veuillez saisir la question et au moins 2 options de réponse.', 'warning');
      return;
    }

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: qText,
      options: [opt0, opt1, opt2, opt3].filter((o) => o.trim() !== ''),
      correctAnswerIndex: parseInt(correctIdx) || 0,
      explanation: qExplanation || 'Explication théorique selon le Code Général de Normalisation Comptable (CGNC).',
      calculationStep: qCalcStep || undefined,
    };

    const currentExam = selectedCourse.finalExam || {
      id: `exam-${Date.now()}`,
      title: examTitle,
      description: examDesc,
      timeLimitMinutes: parseInt(timeLimit) || 30,
      passingScorePercent: parseInt(passingScore) || 80,
      questions: [],
    };

    const updatedExam: Quiz = {
      ...currentExam,
      title: examTitle,
      description: examDesc,
      timeLimitMinutes: parseInt(timeLimit) || 30,
      passingScorePercent: parseInt(passingScore) || 80,
      questions: [...currentExam.questions, newQuestion],
    };

    const updatedCourse = {
      ...selectedCourse,
      finalExam: updatedExam,
    };

    updateCourse(updatedCourse);
    showToast('Question Ajoutée', `La question a été ajoutée à l'examen de "${selectedCourse.title}".`, 'success');
    setQText('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setQExplanation('');
    setQCalcStep('');
  };

  // Remove Question
  const handleDeleteQuestion = (questionId: string) => {
    if (!selectedCourse || !selectedCourse.finalExam) return;

    const updatedQuestions = selectedCourse.finalExam.questions.filter((q) => q.id !== questionId);
    const updatedCourse = {
      ...selectedCourse,
      finalExam: {
        ...selectedCourse.finalExam,
        questions: updatedQuestions,
      },
    };

    updateCourse(updatedCourse);
    showToast('Question Retirée', 'La question a été supprimée de l examen.', 'info');
  };

  // Save Exam Config (Title, Score %, Time Limit)
  const handleSaveExamConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const currentQuestions = selectedCourse.finalExam?.questions || [];
    const updatedExam: Quiz = {
      id: selectedCourse.finalExam?.id || `exam-${Date.now()}`,
      title: examTitle,
      description: examDesc,
      timeLimitMinutes: parseInt(timeLimit) || 30,
      passingScorePercent: parseInt(passingScore) || 80,
      questions: currentQuestions,
    };

    const updatedCourse = {
      ...selectedCourse,
      finalExam: updatedExam,
    };

    updateCourse(updatedCourse);
    showToast('Paramètres Enregistrés', 'La configuration de l examen final a été mise à jour avec succès.', 'success');
  };

  return (
    <div className="space-y-8 font-sans text-slate-900">
      {/* Light Theme Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-mono text-slate-900">
                Concepteur d'Examens de Certification (Auto-Attestation)
              </h2>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded uppercase">
                ATTRIBUTION AUTOMATIQUE
              </span>
            </div>
            <p className="text-xs text-slate-600 font-mono mt-1">
              Configurez les examens de fin de formation. Dès qu'un étudiant valide l'examen avec le score requis, son Certificat Officiel est émis immédiatement !
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Course Selector & Config */}
        <div className="lg:col-span-5 space-y-6">
          {/* Selector Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs font-mono text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>1. Choisir la Formation à Évaluer</span>
            </h3>

            <div>
              <select
                value={selectedCourseId}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.finalExam?.questions.length || 0} Questions)
                  </option>
                ))}
              </select>
            </div>

            {/* Config Form */}
            {selectedCourse && (
              <form onSubmit={handleSaveExamConfig} className="border-t border-slate-200 pt-4 space-y-4">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Paramètres de l'Examen Final</span>
                </h4>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Titre de l'Examen *</label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Description / Consignes</label>
                  <textarea
                    rows={2}
                    value={examDesc}
                    onChange={(e) => setExamDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Durée (Minutes)</label>
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Score Requis (%) *</label>
                    <input
                      type="number"
                      value={passingScore}
                      onChange={(e) => setPassingScore(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-emerald-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Enregistrer les Règlements de l'Examen
                </button>
              </form>
            )}
          </div>

          {/* Existing Questions Roster */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900">Questions de l'Examen ({selectedCourse?.finalExam?.questions.length || 0})</h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                SCORE MIN: {passingScore}%
              </span>
            </div>

            {(!selectedCourse?.finalExam || selectedCourse.finalExam.questions.length === 0) ? (
              <div className="p-6 text-center text-slate-400 italic bg-slate-50 rounded-2xl">
                Aucune question dans cet examen. Saisissez votre première question à droite.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedCourse.finalExam.questions.map((q, idx) => (
                  <div key={q.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-slate-900">
                        <span className="text-emerald-700">Q{idx + 1}.</span> {q.text}
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-rose-500 hover:bg-rose-100 p-1 rounded"
                        title="Supprimer la question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-1.5 rounded border ${
                            oIdx === q.correctAnswerIndex
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          {oIdx === q.correctAnswerIndex ? '✓ ' : ''}{opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Question Creator Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Ajouter une Question à Choix Multiples (QCM)</h3>
                <p className="text-[11px] text-slate-500">
                  Saisissez le texte de la question, les propositions et la bonne réponse.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Question / Problématique Comptable *</label>
                <textarea
                  rows={2}
                  placeholder="ex: Quel est le taux maximum de déduction fiscale pour les amortissements d un véhicule de tourisme au Maroc ?"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Options Grid */}
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="block text-slate-800 font-bold">Propositions de Réponses *</label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Option 1 :</label>
                    <input
                      type="text"
                      placeholder="300 000 DH TTC"
                      value={opt0}
                      onChange={(e) => setOpt0(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Option 2 :</label>
                    <input
                      type="text"
                      placeholder="200 000 DH HT"
                      value={opt1}
                      onChange={(e) => setOpt1(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Option 3 (Optionnelle) :</label>
                    <input
                      type="text"
                      placeholder="400 000 DH TTC"
                      value={opt2}
                      onChange={(e) => setOpt2(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Option 4 (Optionnelle) :</label>
                    <input
                      type="text"
                      placeholder="Aucun plafond légal"
                      value={opt3}
                      onChange={(e) => setOpt3(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-emerald-800 font-bold mb-1">Index de la Bonne Réponse (Réponse Correcte) :</label>
                  <select
                    value={correctIdx}
                    onChange={(e) => setCorrectIdx(e.target.value)}
                    className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-emerald-900 font-bold focus:outline-none"
                  >
                    <option value="0">Option 1 est la réponse correcte</option>
                    <option value="1">Option 2 est la réponse correcte</option>
                    {opt2.trim() && <option value="2">Option 3 est la réponse correcte</option>}
                    {opt3.trim() && <option value="3">Option 4 est la réponse correcte</option>}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Explication & Justification du CGI / CGNC</label>
                <textarea
                  rows={2}
                  placeholder="ex: Selon l article 11 du CGI marocain, la déduction est plafonnée à 300 000 DH TTC amortissable sur 5 ans."
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Étape de Calcul (si applicable)</label>
                <input
                  type="text"
                  placeholder="ex: 300 000 DH x 20% = 60 000 DH / an"
                  value={qCalcStep}
                  onChange={(e) => setQCalcStep(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Enregistrer la Question dans l'Examen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
