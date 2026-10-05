'use client'

import { useState, useEffect } from 'react'
import { SplineScene } from "@/components/ui/splite"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { SparklesCore } from "@/components/ui/sparkles"
import { 
  Calculator, 
  Percent, 
  Scale, 
  Users, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  Bell, 
  FileSpreadsheet, 
  Activity, 
  ArrowUpRight,
  TrendingDown,
  Sparkles,
  Info
} from 'lucide-react'

// Live Activity Item Type
interface LogItem {
  id: string
  time: string
  action: string
  status: 'success' | 'info' | 'warning'
}

export function SplineSceneBasic() {
  // Tabs: 'tva' | 'is' | 'bilan' | 'sparkles'
  const [activeTab, setActiveTab] = useState<'tva' | 'is' | 'bilan' | 'sparkles'>('tva')
  
  // TVA Simulator State
  const [amountHT, setAmountHT] = useState<string>('15000')
  const [tvaRate, setTvaRate] = useState<number>(20)
  const [calcTVA, setCalcTVA] = useState({ tva: 3000, ttc: 18000 })

  // IS Simulator State
  const [revenue, setRevenue] = useState<string>('1200000')
  const [charges, setCharges] = useState<string>('800000')
  const [calcIS, setCalcIS] = useState({ netResult: 400000, taxIS: 50000, netMargin: 350000 })

  // Audit Logs (Rule #4)
  const [logs, setLogs] = useState<LogItem[]>([
    { id: '1', time: '18:45', action: 'Simulation TVA calculée', status: 'success' },
    { id: '2', time: '17:30', action: 'Clôture mensuelle générée', status: 'success' },
    { id: '3', time: '15:12', action: 'Télédéclaration TVA T1 soumise', status: 'success' },
    { id: '4', time: '11:05', action: 'Bilan Provisoire Actif/Passif vérifié', status: 'info' }
  ])

  // Notification State (Rule #4)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Rappel fiscal : Déclaration de TVA mensuelle à soumettre avant le 30.', read: false },
    { id: 2, text: 'Nouveau bulletin de paie généré pour le personnel (Mai 2026).', read: false },
    { id: 3, text: 'Liasse fiscale IS prête à la signature électronique.', read: true }
  ])

  // Live updates for TVA Calculator
  useEffect(() => {
    const ht = parseFloat(amountHT) || 0
    const tva = (ht * tvaRate) / 100
    const ttc = ht + tva
    setCalcTVA({ tva, ttc })
  }, [amountHT, tvaRate])

  // Live updates for IS Calculator (Progressive IS Morocco 2026)
  useEffect(() => {
    const rev = parseFloat(revenue) || 0
    const chg = parseFloat(charges) || 0
    const netResult = Math.max(0, rev - chg)
    
    // Moroccan IS progressive scale
    let taxIS = 0
    if (netResult <= 300000) {
      taxIS = netResult * 0.10
    } else if (netResult <= 1000000) {
      taxIS = (300000 * 0.10) + (netResult - 300000) * 0.20
    } else {
      taxIS = (300000 * 0.10) + (700000 * 0.20) + (netResult - 1000000) * 0.32
    }
    
    const netMargin = netResult - taxIS
    setCalcIS({ netResult, taxIS, netMargin })
  }, [revenue, charges])

  // Global mousemove forwarding for React Spline Scene (follows cursor on the whole page)
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const canvas = document.querySelector('canvas[data-engine^="three.js"]') || document.querySelector('canvas');
      if (canvas) {
        const event = new MouseEvent('mousemove', {
          clientX: e.clientX,
          clientY: e.clientY,
          screenX: e.screenX,
          screenY: e.screenY,
          bubbles: true,
          cancelable: true
        });
        canvas.dispatchEvent(event);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, []);

  const addLog = (action: string, status: 'success' | 'info' | 'warning') => {
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setLogs(prev => [
      { id: Date.now().toString(), time: timeStr, action, status },
      ...prev.slice(0, 4)
    ])
  }

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const formatMAD = (val: number) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <Card className="w-full min-h-[640px] bg-white/90 border border-slate-200/80 shadow-2xl rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row transition-all duration-300">
      
      {/* Premium Spotlight for light mode (Soft blue aura) */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#3b82f6"
      />

      {/* Left Panel: Dashboard, Calculations, & Controls */}
      <div className="flex-1 p-6 md:p-8 relative z-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200/50">
        
        {/* Header Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base leading-tight font-display">Excelium Consulting</h3>
                <span className="text-[11px] text-slate-500 font-medium">Cabinet Fiduciaire Digital Agréé</span>
              </div>
            </div>
            
            {/* Notification Bell Badge */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  if (!showNotifications) markAllNotificationsRead()
                }}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/50 flex items-center justify-center text-slate-600 transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl p-4 z-40 animate-scale-in text-left">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700">Notifications Recentes</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-blue-600 hover:underline"
                    >
                      Fermer
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-2 rounded-lg text-xs leading-normal ${n.read ? 'bg-slate-50 text-slate-500' : 'bg-blue-50/50 text-slate-700 font-medium border-l-2 border-blue-500'}`}>
                        {n.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Banner Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-[11px] font-semibold text-emerald-700 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulateur Fiscal & Social Marocain 2026</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-2 font-display">
            Pilotez votre <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Activité Financière</span>
          </h2>
          <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
            Consultez instantanément vos obligations comptables, simulez vos déclarations fiscales et optimisez votre trésorerie avec notre robot fiduciaire intelligent.
          </p>

          {/* Selector Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab('tva')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1 ${
                activeTab === 'tva'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              Calcul TVA
            </button>
            <button
              onClick={() => setActiveTab('is')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1 ${
                activeTab === 'is'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              Estimation IS
            </button>
            <button
              onClick={() => setActiveTab('bilan')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1 ${
                activeTab === 'bilan'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              KPIs Financiers
            </button>
            <button
              onClick={() => setActiveTab('sparkles')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1 ${
                activeTab === 'sparkles'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tâche Sparkles
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-4 md:p-5 mb-6">
            {activeTab === 'tva' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Base Hors Taxe (HT)
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <input
                        type="number"
                        value={amountHT}
                        onChange={(e) => {
                          setAmountHT(e.target.value)
                          addLog(`Montant HT modifié : ${e.target.value} DH`, 'info')
                        }}
                        className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        placeholder="Ex: 10000"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">MAD</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Taux de TVA
                    </label>
                    <select
                      value={tvaRate}
                      onChange={(e) => {
                        setTvaRate(Number(e.target.value))
                        addLog(`Taux TVA changé à : ${e.target.value}%`, 'info')
                      }}
                      className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value={20}>20% (Taux normal)</option>
                      <option value={14}>14% (Transports / Services)</option>
                      <option value={10}>10% (Restauration / Hôtels)</option>
                      <option value={7}>7% (Eau, Electricité, Médicaments)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200/50">
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                    <span className="block text-[10px] font-bold text-blue-600/80 uppercase">Montant TVA</span>
                    <span className="text-base font-extrabold text-blue-700 font-mono">
                      {formatMAD(calcTVA.tva)}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                    <span className="block text-[10px] font-bold text-emerald-600/80 uppercase">Montant TTC</span>
                    <span className="text-base font-extrabold text-emerald-700 font-mono">
                      {formatMAD(calcTVA.ttc)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'is' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Chiffre d'Affaires
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <input
                        type="number"
                        value={revenue}
                        onChange={(e) => {
                          setRevenue(e.target.value)
                          addLog(`Revenus IS mis à jour : ${e.target.value} DH`, 'info')
                        }}
                        className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">MAD</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Total Charges
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <input
                        type="number"
                        value={charges}
                        onChange={(e) => {
                          setCharges(e.target.value)
                          addLog(`Charges IS mises à jour : ${e.target.value} DH`, 'info')
                        }}
                        className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none"
                      />
                      <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-bold">MAD</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-200/50">
                  <div className="p-2.5 bg-slate-100 rounded-xl text-center">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase">Résultat Brut</span>
                    <span className="text-xs font-bold text-slate-700 font-mono">
                      {formatMAD(calcIS.netResult)}
                    </span>
                  </div>
                  <div className="p-2.5 bg-rose-50/50 rounded-xl text-center border border-rose-100/50">
                    <span className="block text-[9px] font-bold text-rose-600/80 uppercase">IS Estimé</span>
                    <span className="text-xs font-bold text-rose-700 font-mono">
                      {formatMAD(calcIS.taxIS)}
                    </span>
                  </div>
                  <div className="p-2.5 bg-emerald-50/50 rounded-xl text-center border border-emerald-100/50">
                    <span className="block text-[9px] font-bold text-emerald-600/80 uppercase">Bénéfice Net</span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      {formatMAD(calcIS.netMargin)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-[10px] text-slate-400 bg-slate-100/40 p-2 rounded-lg leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>
                    Morocco progressive rates applied (10% under 300k, 20% under 1M, and 32% above). Accompagnement expert recommandé.
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'bilan' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    Trésorerie Provisoire
                  </span>
                  <span className="font-bold text-slate-900 font-mono">+185,400.00 DH</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    Créances Clients
                  </span>
                  <span className="font-bold text-slate-900 font-mono">+42,800.00 DH</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                    Dettes Fournisseurs
                  </span>
                  <span className="font-bold text-slate-900 font-mono">-18,250.00 DH</span>
                </div>
                
                {/* SVG Visual Spark Chart (Rule #4) */}
                <div className="pt-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Courbe d'Activité Trimestrielle</span>
                  <div className="w-full h-12 flex items-end gap-1 px-2 bg-slate-100 rounded-lg">
                    <div className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors h-[40%] rounded-t-sm" title="Janvier"></div>
                    <div className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors h-[60%] rounded-t-sm" title="Février"></div>
                    <div className="flex-1 bg-emerald-500 hover:bg-emerald-600 transition-colors h-[80%] rounded-t-sm" title="Mars"></div>
                    <div className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors h-[55%] rounded-t-sm" title="Avril"></div>
                    <div className="flex-1 bg-emerald-500 hover:bg-emerald-600 transition-colors h-[90%] rounded-t-sm" title="Mai"></div>
                    <div className="flex-1 bg-emerald-500 hover:bg-emerald-600 transition-colors h-[95%] rounded-t-sm" title="Juin"></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sparkles' && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-[11px] text-slate-600 bg-white border border-slate-200/60 p-3.5 rounded-xl space-y-2 max-h-[180px] overflow-y-auto leading-relaxed shadow-sm font-sans text-left">
                  <p className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-100 pb-1.5 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Intégration du composant SparklesCore
                  </p>
                  <p className="font-semibold text-blue-600">Objectif de la tâche :</p>
                  <p>Vous êtes chargé d'intégrer un composant React existant dans la base de code.</p>
                  <p className="font-semibold text-blue-600">La base de code doit supporter :</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Structure de projet <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">shadcn</code></li>
                    <li>Tailwind CSS</li>
                    <li>Typescript</li>
                  </ul>
                  <p className="font-semibold text-blue-600">Directives d'utilisation :</p>
                  <p>Déterminer le chemin par défaut pour les styles et composants. Si le chemin par défaut n'est pas <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600 font-mono">/components/ui</code>, expliquer pourquoi il est important de créer ce dossier.</p>
                  <p>Copiez-collez ce composant dans le répertoire <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600 font-mono">/components/ui</code>.</p>
                </div>

                {/* Live Sparkles Preview */}
                <div className="h-[120px] relative w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-800">
                  <div className="w-full absolute inset-0 h-full">
                    <SparklesCore
                      id="tsparticlestab"
                      background="transparent"
                      minSize={0.6}
                      maxSize={1.4}
                      particleDensity={100}
                      className="w-full h-full"
                      particleColor="#FFFFFF"
                      speed={1.5}
                    />
                  </div>
                  <span className="text-white text-xs font-bold relative z-20 flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700/60 backdrop-blur-sm shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    Sparkles Live Preview
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Audit/Activity Feed (Rule #4) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-slate-500" />
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Journal des Activités Fiscales</h4>
          </div>
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="flex justify-between items-center text-[10px] bg-slate-100/50 p-2 rounded-lg border border-slate-200/20 hover:bg-slate-100 transition-colors">
                <span className="text-slate-600 font-medium">{log.action}</span>
                <span className="text-slate-400 font-mono text-[9px]">{log.time}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button 
              onClick={() => addLog("Accès au portail demandé", "info")}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Accéder au Portail Client</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            
            <a 
              href="mailto:contact@excelium.ma"
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all duration-300 text-center"
            >
              Parler à un Expert
            </a>
          </div>
        </div>

      </div>

      {/* Right Panel: Animated 3D Scene + Accounting Assets */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-8 bg-slate-50/50 relative overflow-hidden">
        
        {/* Soft Background Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

        {/* Floating Badges */}
        <div className="absolute top-10 left-10 animate-float p-2.5 bg-white border border-slate-200 shadow-md rounded-xl flex items-center gap-1.5 z-20">
          <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[10px] font-extrabold text-slate-700">Liasse IS</span>
        </div>

        <div className="absolute bottom-12 left-8 animate-float-delayed p-2.5 bg-white border border-slate-200 shadow-md rounded-xl flex items-center gap-1.5 z-20">
          <Percent className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[10px] font-extrabold text-slate-700">TVA 20%</span>
        </div>

        <div className="absolute top-16 right-10 animate-float p-2.5 bg-white border border-slate-200 shadow-md rounded-xl flex items-center gap-1.5 z-20">
          <Scale className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[10px] font-extrabold text-slate-700">Bilan Annuel</span>
        </div>

        <div className="absolute bottom-16 right-12 animate-float-delayed p-2.5 bg-white border border-slate-200 shadow-md rounded-xl flex items-center gap-1.5 z-20">
          <Users className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-[10px] font-extrabold text-slate-700">CNSS & Paie</span>
        </div>

        {/* The 3D Scene Wrapper (No frame/card background) */}
        <div className="w-full max-w-[380px] h-[380px] relative flex items-center justify-center overflow-visible z-10">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
        
        {/* Caption */}
        <div className="mt-4 text-center z-10">
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase flex items-center gap-1 justify-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
            Robot Fiduciaire Actif
          </span>
          <p className="text-[11px] text-slate-500 mt-1 max-w-[280px]">
            Déplacez votre souris pour orienter le robot comptable. Il analyse vos KPIs fiscaux en temps réel.
          </p>
        </div>

      </div>

    </Card>
  )
}

export default SplineSceneBasic;
