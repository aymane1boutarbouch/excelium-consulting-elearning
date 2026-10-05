import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Award,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Calculator,
} from 'lucide-react';
import type { Certificate } from '../types';

export const QuizExamView: React.FC = () => {
  const {
    courses,
    selectedCourseId,
    setCurrentView,
    submitExamResult,
    setSelectedCertificate,
  } = useApp();

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const exam = course.finalExam || course.modules[0]?.lessons[0]?.quiz;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState<number>(0);
  const [earnedCertificate, setEarnedCertificate] = useState<Certificate | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>((exam?.timeLimitMinutes || 20) * 60);

  // Timer countdown effect
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, timeLeft]);

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center text-slate-900 space-y-4">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-xl font-bold">Aucun examen disponible pour cette formation.</h3>
        <button
          onClick={() => setCurrentView('classroom')}
          className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
        >
          Retourner au cours
        </button>
      </div>
    );
  }

  const questions = exam.questions;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIdx,
    }));
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / questions.length) * 100);
    setScorePercent(percent);
    setIsSubmitted(true);

    const cert = submitExamResult(course.id, percent);
    if (cert) {
      setEarnedCertificate(cert);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Exam Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('classroom')}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-mono font-bold rounded uppercase">
              Examen Officiel Cabinet
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{exam.title}</h2>
          </div>
        </div>

        {/* Live Timer */}
        {!isSubmitted && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-emerald-800">
            <Clock className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Temps Restant : {formatTimer(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Main Examination View */}
      {!isSubmitted ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
          {/* Question Index Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-mono">
            <span className="text-slate-500 font-medium">
              Question <strong className="text-slate-900">{currentQuestionIndex + 1}</strong> sur {questions.length}
            </span>
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    i === currentQuestionIndex
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : selectedAnswers[i] !== undefined
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Body */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.text}
            </h3>

            {/* Optional Calculation Step Prompt */}
            {currentQ.calculationStep && (
              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs font-mono text-cyan-900 font-bold flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-700 shrink-0" />
                <span>Formule appliquée : {currentQ.calculationStep}</span>
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{option}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-white text-emerald-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Question Précédente
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                Soumettre l'Examen
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Breakdown Screen */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-8 text-center">
          <div className="space-y-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 mx-auto flex items-center justify-center text-white shadow-xl">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Résultat de l'Examen</h3>
            <p className="text-xs text-slate-500 font-medium">Score minimum requis pour la certification : 80%</p>
          </div>

          {/* Score Badge */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 inline-block max-w-sm w-full">
            <div className="text-4xl font-black text-emerald-700 font-mono">{scorePercent}%</div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              {scorePercent >= 80 ? 'EXAMEN VALIDÉ AVEC SUCCÈS' : 'ÉCHEC - REPASSAGE AUTORISÉ'}
            </div>
          </div>

          {/* Unlocked Certificate Banner */}
          {earnedCertificate ? (
            <div className="p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-300 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-center gap-2 text-emerald-900 font-mono text-xs font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>CERTIFICAT OFFICIEL DÉBLOQUÉ ET SIGNÉ</span>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                Félicitations ! Votre certificat d'Expertise Comptable Spécialisée est maintenant disponible pour téléchargement et vérification publique.
              </p>
              <button
                onClick={() => {
                  setSelectedCertificate(earnedCertificate);
                  setCurrentView('certificate');
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto"
              >
                <Award className="w-4 h-4" />
                <span>Consulter / Imprimer le Certificat (HD)</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              Votre score est inférieur à 80%. Révisez le programme de la formation et retentez l'examen.
            </div>
          )}

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setSelectedAnswers({});
                setCurrentQuestionIndex(0);
                setTimeLeft((exam?.timeLimitMinutes || 20) * 60);
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repasser l'Examen</span>
            </button>
            <button
              onClick={() => setCurrentView('classroom')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
            >
              Retourner au Cours
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
