import React, { useState } from 'react';
import type { InteractiveExercise } from '../types';
import {
  Flame,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';

interface Props {
  exercises?: InteractiveExercise[];
  onCompleteAll?: (totalXp: number) => void;
}

const DEFAULT_EXERCISES: InteractiveExercise[] = [
  {
    id: 'ex-1',
    type: 'journal_entry',
    title: 'Exercice 1 : Enregistrement de Facture d Achat HT avec TVA',
    prompt: 'Facture N° 1024 : Achat de marchandises pour 10.000 DH HT, TVA 20% (2.000 DH), règlement par chèque bancaire.',
    debitAccounts: [
      { code: '6111', name: '6111 Achats de marchandises', amountMAD: 10000 },
      { code: '3455', name: '3455 Etat - TVA récupérable sur charges', amountMAD: 2000 },
      { code: '6121', name: '6121 Achats de matières premières', amountMAD: 10000 },
    ],
    creditAccounts: [
      { code: '5141', name: '5141 Banque', amountMAD: 12000 },
      { code: '4411', name: '4411 Fournisseurs', amountMAD: 12000 },
      { code: '5161', name: '5161 Caisse', amountMAD: 12000 },
    ],
    correctDebitCode: '6111',
    correctCreditCode: '5141',
    explanation: 'Le compte 6111 est débité du montant HT (10.000 DH), le 3455 de la TVA (2.000 DH), et le compte Banque 5141 est crédité du TTC (12.000 DH).',
    xpPoints: 50,
  },
  {
    id: 'ex-2',
    type: 'fill_in_blank',
    title: 'Exercice 2 : Règle du Pro-rata TVA (Loi de Finances 2026)',
    prompt: 'Complétez la règle officielle du Code Général des Impôts (CGI) :',
    options: ['35%', '20%', '15%', '100%'],
    correctAnswer: '20%',
    explanation: 'Le taux normal de la TVA selon l article 98 du CGI au Maroc est de 20%.',
    xpPoints: 40,
  },
  {
    id: 'ex-3',
    type: 'multiple_choice',
    title: 'Exercice 3 : Classification au Plan Comptable Marocain (CGNC)',
    prompt: 'Dans quelle classe du Plan Comptable Général Marocain se classe le compte "34552 TVA récupérable sur immobilisations" ?',
    options: [
      'Classe 1 : Financement Permanent',
      'Classe 2 : Actif Immobilisé',
      'Classe 3 : Actif Circulant (hors trésorerie)',
      'Classe 4 : Passif Circulant',
    ],
    correctAnswerIndex: 2,
    explanation: 'Les créances de TVA et comptes 34XX appartiennent à la Classe 3 (Actif Circulant).',
    xpPoints: 50,
  },
];

export const InteractiveDataCampPractice: React.FC<Props> = ({ exercises = DEFAULT_EXERCISES, onCompleteAll }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userXp, setUserXp] = useState(150);
  const [streak] = useState(3);
  
  // States for user selection
  const [selectedDebit, setSelectedDebit] = useState<string | null>(null);
  const [selectedCredit, setSelectedCredit] = useState<string | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [selectedFillAnswer, setSelectedFillAnswer] = useState<string | null>(null);

  // Status state
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentEx = exercises[currentIndex] || exercises[0];

  const handleVerifyAnswer = () => {
    let isCorrect = false;

    if (currentEx.type === 'journal_entry') {
      isCorrect = selectedDebit === currentEx.correctDebitCode && selectedCredit === currentEx.correctCreditCode;
    } else if (currentEx.type === 'multiple_choice') {
      isCorrect = selectedOptionIndex === currentEx.correctAnswerIndex;
    } else if (currentEx.type === 'fill_in_blank') {
      isCorrect = selectedFillAnswer === currentEx.correctAnswer;
    }

    if (isCorrect) {
      setFeedbackStatus('correct');
      setUserXp((prev) => prev + currentEx.xpPoints);
    } else {
      setFeedbackStatus('incorrect');
    }
  };

  const handleNextExercise = () => {
    setFeedbackStatus('idle');
    setShowHint(false);
    setSelectedDebit(null);
    setSelectedCredit(null);
    setSelectedOptionIndex(null);
    setSelectedFillAnswer(null);

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      if (onCompleteAll) onCompleteAll(userXp);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setFeedbackStatus('idle');
    setIsCompleted(false);
    setSelectedDebit(null);
    setSelectedCredit(null);
    setSelectedOptionIndex(null);
    setSelectedFillAnswer(null);
  };

  if (isCompleted) {
    return (
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 text-center space-y-6 shadow-2xl border border-slate-800 animate-in fade-in font-mono">
        <div className="w-20 h-20 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto text-amber-400">
          <Award className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-xs font-bold uppercase">
            SESSION DE PRACTICE TERMINÉE !
          </span>
          <h3 className="text-2xl sm:text-3xl font-black">Félicitations !</h3>
          <p className="text-xs text-slate-300">
            Vous avez maîtrisé l'ensemble des cas pratiques de ce module style DataCamp / Duolingo.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center space-y-1">
            <span className="text-slate-400 text-[10px] font-bold block">XP GAGNÉS</span>
            <span className="text-2xl font-black text-amber-400 flex items-center justify-center gap-1">
              <Zap className="w-5 h-5" /> +{exercises.reduce((sum, e) => sum + e.xpPoints, 0)} XP
            </span>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center space-y-1">
            <span className="text-slate-400 text-[10px] font-bold block">SÉRIE ACTIVES</span>
            <span className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
              <Flame className="w-5 h-5" /> {streak + 1} Jours
            </span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Refaire la Session d'Exercices</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs font-sans">
      {/* Top Gamification Status Bar (Duolingo Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 font-mono">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{userXp} XP</span>
          </span>

          <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-700 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>Série : {streak} Jours 🔥</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-bold">
            Exercice {currentIndex + 1} sur {exercises.length}
          </span>
          <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercise Title & Prompt */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded uppercase">
            {currentEx.type.replace('_', ' ')}
          </span>
          <span className="text-xs font-mono font-bold text-amber-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> +{currentEx.xpPoints} XP à gagner
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-black text-slate-900">{currentEx.title}</h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          {currentEx.prompt}
        </p>
      </div>

      {/* TYPE 1: JOURNAL ENTRY EXERCISE */}
      {currentEx.type === 'journal_entry' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Debit Account Picker */}
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Sélectionner le Compte au DÉBIT (3/6) :</span>
              </h4>

              <div className="space-y-2">
                {currentEx.debitAccounts?.map((acc) => (
                  <button
                    key={acc.code}
                    onClick={() => setSelectedDebit(acc.code)}
                    className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
                      selectedDebit === acc.code
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{acc.name}</span>
                      <span>{acc.amountMAD.toLocaleString()} DH</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Account Picker */}
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-600" />
                <span>Sélectionner le Compte au CRÉDIT (4/5) :</span>
              </h4>

              <div className="space-y-2">
                {currentEx.creditAccounts?.map((acc) => (
                  <button
                    key={acc.code}
                    onClick={() => setSelectedCredit(acc.code)}
                    className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
                      selectedCredit === acc.code
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-cyan-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{acc.name}</span>
                      <span>{acc.amountMAD.toLocaleString()} DH</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TYPE 2: MULTIPLE CHOICE */}
      {currentEx.type === 'multiple_choice' && (
        <div className="space-y-3 font-mono text-xs">
          {currentEx.options?.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOptionIndex(idx)}
              className={`w-full p-4 rounded-2xl border text-left font-bold transition-all flex items-center gap-3 ${
                selectedOptionIndex === idx
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-white hover:border-emerald-500'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                  selectedOptionIndex === idx ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </div>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}

      {/* TYPE 3: FILL IN THE BLANK */}
      {currentEx.type === 'fill_in_blank' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentEx.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFillAnswer(opt)}
                className={`p-3 rounded-xl border text-center font-bold text-sm transition-all ${
                  selectedFillAnswer === opt
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FEEDBACK & VERIFY CONTROLS */}
      {feedbackStatus === 'idle' ? (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-mono text-slate-500 hover:text-amber-700 flex items-center gap-1 font-bold"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>{showHint ? 'Masquer l\'indice' : 'Besoin d\'un Indice ?'}</span>
          </button>

          <button
            onClick={handleVerifyAnswer}
            disabled={
              (currentEx.type === 'journal_entry' && (!selectedDebit || !selectedCredit)) ||
              (currentEx.type === 'multiple_choice' && selectedOptionIndex === null) ||
              (currentEx.type === 'fill_in_blank' && !selectedFillAnswer)
            }
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow transition-transform active:scale-95 flex items-center gap-2"
          >
            <span>Vérifier la Réponse</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : feedbackStatus === 'correct' ? (
        <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Excellent ! Réponse Correcte (+{currentEx.xpPoints} XP) 🎉</span>
          </div>
          <p className="text-xs text-slate-700 font-mono font-medium">{currentEx.explanation}</p>
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNextExercise}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
            >
              <span>Exercice Suivant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-rose-50 border border-rose-300 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <XCircle className="w-5 h-5 text-rose-600" />
            <span>Oups ! Réponse Incorrecte. Réessayez.</span>
          </div>
          <p className="text-xs text-slate-700 font-mono font-medium">{currentEx.explanation}</p>
          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => setFeedbackStatus('idle')}
              className="px-4 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
            >
              Réessayer
            </button>
            <button
              onClick={handleNextExercise}
              className="px-5 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow"
            >
              Passer
            </button>
          </div>
        </div>
      )}

      {/* Hint Alert */}
      {showHint && feedbackStatus === 'idle' && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-mono">
          💡 <strong>Indice Cabinet Excelium :</strong> {currentEx.explanation}
        </div>
      )}
    </div>
  );
};
