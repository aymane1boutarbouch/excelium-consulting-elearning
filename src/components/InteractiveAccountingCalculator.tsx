import React, { useState } from 'react';
import { Calculator, DollarSign, PieChart, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const InteractiveAccountingCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'paie' | 'is'>('paie');

  // Paie State
  const [brut, setBrut] = useState<number>(12000);
  const [childrenCount, setChildrenCount] = useState<number>(2);

  // IS State
  const [resultatComptable, setResultatComptable] = useState<number>(450000);
  const [reintegrations, setReintegrations] = useState<number>(85000);
  const [deductions, setDeductions] = useState<number>(30000);

  // Calculation Paie 2026
  const cnssBase = Math.min(brut, 6000);
  const cnss = Math.round(cnssBase * 0.0448);
  const amo = Math.round(brut * 0.0226);
  
  // Frais Pro: 35% capped at 2916.67 DH/month (35,000 DH/year)
  const fraisPro = Math.min(brut * 0.35, 2916.67);
  const brutImposable = Math.max(0, brut - cnss - amo);
  const netImposable = Math.max(0, brutImposable - fraisPro);

  // Barème IR 2026 Monthly
  let irBrut = 0;
  if (netImposable > 15000) {
    irBrut = netImposable * 0.38 - 2033.33;
  } else if (netImposable > 8333.33) {
    irBrut = netImposable * 0.34 - 1433.33;
  } else if (netImposable > 6666.67) {
    irBrut = netImposable * 0.30 - 1100.00;
  } else if (netImposable > 5000) {
    irBrut = netImposable * 0.20 - 433.33;
  } else if (netImposable > 2500) {
    irBrut = netImposable * 0.10 - 250.00;
  }

  const reductionChargeFamille = childrenCount * 40; // 40 DH per child/spouse
  const irNet = Math.max(0, Math.round(irBrut - reductionChargeFamille));
  const netAPayer = Math.round(brut - cnss - amo - irNet);

  // Calculation IS 2026
  const resultatFiscal = Math.max(0, resultatComptable + reintegrations - deductions);
  let isRate = 0.15;
  if (resultatFiscal > 100000000) {
    isRate = 0.35;
  } else if (resultatFiscal > 300000) {
    isRate = 0.20;
  } else {
    isRate = 0.15;
  }
  const isBrut = Math.round(resultatFiscal * isRate);
  const cotisMinimale = Math.round(resultatComptable * 0.004); // 0.40%
  const isNetAPayer = Math.max(isBrut, cotisMinimale);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 font-mono">
              Outils & Calculateurs Interactifs Cabinet Excelium
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Simulateur conforme à la Loi de Finances et Code Général des Impôts (CGI 2026).
            </p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('paie')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'paie'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Simulateur de Paie (IR/CNSS)
          </button>
          <button
            onClick={() => setActiveTab('is')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'is'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Passage Fiscal IS 2026
          </button>
        </div>
      </div>

      {/* CALCULATOR 1: PAIE MAROC */}
      {activeTab === 'paie' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 text-xs font-medium bg-slate-50/70 p-6 border border-slate-200 rounded-2xl">
            <h4 className="font-bold text-slate-900 text-sm font-mono flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Saisie des Paramètres du Salarié :
            </h4>

            <div>
              <label className="block text-slate-700 font-mono mb-1 font-bold">
                Salaire Brut Mensuel (DH MAD) :
              </label>
              <input
                type="number"
                step="500"
                value={brut}
                onChange={(e) => setBrut(parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-base text-emerald-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-mono mb-1 font-bold">
                Nombre de Personnes à Charge (Conjoint + Enfants) :
              </label>
              <select
                value={childrenCount}
                onChange={(e) => setChildrenCount(parseInt(e.target.value))}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
              >
                <option value={0}>0 personne (Célibataire)</option>
                <option value={1}>1 personne (40 DH/mois)</option>
                <option value={2}>2 personnes (80 DH/mois)</option>
                <option value={3}>3 personnes (120 DH/mois)</option>
                <option value={4}>4 personnes (160 DH/mois)</option>
                <option value={5}>5 personnes (200 DH/mois)</option>
                <option value={6}>6 personnes (240 DH/mois max)</option>
              </select>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-mono">
              ⚡ Plafond CNSS : 6 000 DH/mois | Abattement Frais Pro : 35% (Plafond 35 000 DH/an).
            </div>
          </div>

          {/* PAIE OUTPUT RESULTS */}
          <div className="space-y-4 p-6 bg-slate-900 text-white rounded-2xl shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400">RÉSULTAT DU BULLETIN DE PAIE</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold rounded">
                BARÈME CGI 2026
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Salaire Brut :</span>
                <strong className="text-white">{brut.toLocaleString()} DH</strong>
              </div>
              <div className="flex justify-between text-rose-300">
                <span>Cotisation Salariale CNSS (4.48%) :</span>
                <strong>- {cnss.toLocaleString()} DH</strong>
              </div>
              <div className="flex justify-between text-rose-300">
                <span>Cotisation AMO Salarié (2.26%) :</span>
                <strong>- {amo.toLocaleString()} DH</strong>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Abattement Frais Professionnels :</span>
                <span>{Math.round(fraisPro).toLocaleString()} DH</span>
              </div>
              <div className="flex justify-between text-amber-300 border-t border-slate-800 pt-2">
                <span>Impôt sur le Revenu Net (IR Net) :</span>
                <strong>- {irNet.toLocaleString()} DH</strong>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-between shadow-lg">
              <div>
                <span className="text-[10px] text-emerald-100 font-bold uppercase block">
                  SALAIRE NET À PAYER AU SALARIÉ
                </span>
                <span className="text-2xl font-black text-white">{netAPayer.toLocaleString()} DH</span>
              </div>
              <CheckCircle2 className="w-8 h-8 text-white/80" />
            </div>
          </div>
        </div>
      )}

      {/* CALCULATOR 2: PASSAGE FISCAL IS */}
      {activeTab === 'is' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 text-xs font-medium bg-slate-50/70 p-6 border border-slate-200 rounded-2xl">
            <h4 className="font-bold text-slate-900 text-sm font-mono flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-600" />
              Saisie du Tableau de Passage Comptable-Fiscal :
            </h4>

            <div>
              <label className="block text-slate-700 font-mono mb-1 font-bold">
                Résultat Comptable Avant Impôt (DH MAD) :
              </label>
              <input
                type="number"
                step="10000"
                value={resultatComptable}
                onChange={(e) => setResultatComptable(parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-base text-cyan-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-mono mb-1 font-bold">
                + Réintégrations Fiscales (Charges Non Déductibles) :
              </label>
              <input
                type="number"
                step="5000"
                value={reintegrations}
                onChange={(e) => setReintegrations(parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-rose-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-mono mb-1 font-bold">
                - Déductions Fiscales (Produits Non Imposables) :
              </label>
              <input
                type="number"
                step="5000"
                value={deductions}
                onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-emerald-700"
              />
            </div>
          </div>

          {/* IS OUTPUT RESULTS */}
          <div className="space-y-4 p-6 bg-slate-900 text-white rounded-2xl shadow-xl font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400">LIASSE FISCALE - IMPÔT SUR LES SOCIÉTÉS</span>
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-bold rounded">
                TAUX PROGRESSIF 2026
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Résultat Comptable Initial :</span>
                <strong className="text-white">{resultatComptable.toLocaleString()} DH</strong>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Résultat Fiscal Imposable :</span>
                <strong>{resultatFiscal.toLocaleString()} DH</strong>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Taux IS Effectif Appliqué :</span>
                <strong className="text-amber-400">{(isRate * 100).toFixed(0)}%</strong>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Cotisation Minimale (0.40%) :</span>
                <span>{cotisMinimale.toLocaleString()} DH</span>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl flex items-center justify-between shadow-lg">
              <div>
                <span className="text-[10px] text-cyan-100 font-bold uppercase block">
                  NET IMPÔT SUR LES SOCIÉTÉS (IS) À PAYER
                </span>
                <span className="text-2xl font-black text-white">{isNetAPayer.toLocaleString()} DH</span>
              </div>
              <ShieldCheck className="w-8 h-8 text-white/80" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
