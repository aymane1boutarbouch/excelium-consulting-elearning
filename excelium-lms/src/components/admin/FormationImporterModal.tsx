'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileSpreadsheet, FileText, UploadCloud, X, CheckCircle2,
  Download, HelpCircle, Plus, Trash2, Edit3, Video, Sparkles,
  ArrowRight, Layers, Clock, AlertCircle, Copy, FileCheck
} from 'lucide-react'
import { toast } from 'sonner'
import {
  parseExcelFile,
  parseWordFile,
  downloadSampleExcelTemplate,
  getWordTemplateGuideText,
  ParsedFormation,
  ParsedModule,
  ParsedLesson
} from '@/lib/importers/formationParser'

interface Props {
  isOpen: boolean
  onClose: () => void
  onImportSuccess: (importedFormations: ParsedFormation[]) => void
}

export default function FormationImporterModal({ isOpen, onClose, onImportSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showWordGuide, setShowWordGuide] = useState(false)

  // Parsed Formations list & selected formation index
  const [parsedFormations, setParsedFormations] = useState<ParsedFormation[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!isOpen) return null

  const handleFileSelect = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!['xlsx', 'xls', 'csv', 'docx', 'doc', 'txt', 'json'].includes(ext)) {
      toast.error('Format de fichier non supporté. Veuillez envoyer un fichier Word (.docx) ou Excel (.xlsx, .csv).')
      return
    }

    setIsProcessing(true)
    try {
      let results: ParsedFormation[] = []
      if (['xlsx', 'xls', 'csv'].includes(ext)) {
        results = await parseExcelFile(file)
      } else if (['docx', 'doc'].includes(ext)) {
        const single = await parseWordFile(file)
        results = [single]
      } else if (ext === 'json') {
        const text = await file.text()
        const parsed = JSON.parse(text)
        results = Array.isArray(parsed) ? parsed : [parsed]
      } else {
        // text file fallback
        const single = await parseWordFile(file)
        results = [single]
      }

      if (results.length === 0) {
        toast.error('Aucune formation valide n\'a pu être extraite du fichier.')
        return
      }

      setParsedFormations(results)
      setSelectedIndex(0)
      toast.success(`${results.length} formation(s) détectée(s) et structurée(s) !`)
    } catch (err: any) {
      console.error(err)
      toast.error('Erreur lors du traitement du fichier : ' + (err.message || 'fichier corrompu'))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const currentFormation = parsedFormations[selectedIndex]

  const updateCurrentFormation = (updater: (prev: ParsedFormation) => ParsedFormation) => {
    setParsedFormations((prev) =>
      prev.map((item, i) => (i === selectedIndex ? updater(item) : item))
    )
  }

  const handleAddModule = () => {
    if (!currentFormation) return
    updateCurrentFormation((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          id: `mod-${Date.now()}`,
          title: `Nouveau Module ${prev.modules.length + 1}`,
          lessons: [
            {
              id: `les-${Date.now()}`,
              title: 'Nouvelle Leçon 1',
              duration: '45 min',
              type: 'video',
              isFreePreview: false,
            },
          ],
        },
      ],
    }))
    toast.success('Nouveau module ajouté')
  }

  const handleAddLesson = (moduleId: string) => {
    updateCurrentFormation((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: [
              ...m.lessons,
              {
                id: `les-${Date.now()}`,
                title: `Leçon ${m.lessons.length + 1}`,
                duration: '45 min',
                type: 'text',
                isFreePreview: false,
              },
            ],
          }
        }
        return m
      }),
    }))
  }

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    updateCurrentFormation((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.filter((l) => l.id !== lessonId),
          }
        }
        return m
      }),
    }))
  }

  const handleDeleteModule = (moduleId: string) => {
    updateCurrentFormation((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== moduleId),
    }))
    toast.success('Module supprimé')
  }

  const handleConfirmImport = () => {
    if (parsedFormations.length === 0) return
    onImportSuccess(parsedFormations)
    toast.success(`${parsedFormations.length} formation(s) importée(s) avec succès dans le catalogue !`)
    onClose()
  }

  const copyWordGuide = () => {
    navigator.clipboard.writeText(getWordTemplateGuideText())
    toast.success('Modèle Word copié dans le presse-papier !')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-navy-900 border border-white/15 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
                Importation Rapide de Formations
                <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                  Word &amp; Excel
                </span>
              </h2>
              <p className="text-white/60 text-xs mt-0.5">
                Glissez votre document (.docx) ou tableau (.xlsx) pour importer des formations complètes en 1 clic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {parsedFormations.length === 0 ? (
            /* Upload & Template Area */
            <div className="space-y-6">
              {/* Drag & Drop Card */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-10 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
                  isDragging
                    ? 'border-gold bg-gold/10 scale-[1.01]'
                    : 'border-white/20 bg-white/5 hover:border-gold/50 hover:bg-white/10'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv,.docx,.doc,.txt,.json"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0])
                    }
                  }}
                />

                <div className="w-16 h-16 rounded-2xl bg-gradient-gold text-navy flex items-center justify-center shadow-gold">
                  {isProcessing ? (
                    <div className="w-8 h-8 border-3 border-navy border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UploadCloud className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <h3 className="font-display font-bold text-white text-base">
                    Glissez votre fichier Word (.docx) ou Excel (.xlsx) ici
                  </h3>
                  <p className="text-white/50 text-xs mt-1">
                    ou cliquez pour parcourir votre ordinateur (.docx, .doc, .xlsx, .xls, .csv)
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span className="px-3 py-1 rounded-full bg-emerald/15 text-emerald border border-emerald/30 text-[11px] font-bold flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Tableaux Excel (.xlsx, .csv)
                  </span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Documents Word (.docx, .doc)
                  </span>
                </div>
              </div>

              {/* Download templates bar */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-gold" /> Besoin d&apos;un modèle pré-formaté ?
                  </h4>
                  <p className="text-white/60 text-[11px] mt-0.5">
                    Téléchargez notre trame Excel prête à remplir ou copiez notre structure Word standard.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={downloadSampleExcelTemplate}
                    className="flex-1 sm:flex-none btn-gold text-xs px-3.5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Modèle Excel (.xlsx)
                  </button>

                  <button
                    onClick={() => setShowWordGuide(!showWordGuide)}
                    className="flex-1 sm:flex-none py-2.5 px-3.5 rounded-xl border border-white/20 hover:border-gold/50 text-white/80 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <FileText className="w-4 h-4 text-blue-400" /> Structure Word
                  </button>
                </div>
              </div>

              {/* Word guide preview if opened */}
              {showWordGuide && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gold text-xs font-bold font-mono">Exemple de document Word à importer :</span>
                    <button
                      onClick={copyWordGuide}
                      className="text-xs text-white/70 hover:text-gold flex items-center gap-1 font-mono"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copier l&apos;exemple
                    </button>
                  </div>
                  <pre className="text-[11px] text-white/80 font-mono bg-navy-950 p-4 rounded-xl overflow-x-auto whitespace-pre-wrap border border-white/5">
                    {getWordTemplateGuideText()}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            /* Parsed Editor & Live Curriculum Review */
            <div className="space-y-6">
              {/* Multi-course tabs if excel contained multiple courses */}
              {parsedFormations.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
                  <span className="text-white/50 text-xs font-mono uppercase mr-2">Formations détectées:</span>
                  {parsedFormations.map((f, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                        idx === selectedIndex
                          ? 'bg-gold text-navy shadow-gold font-bold'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <span>0{idx + 1}. {f.title.substring(0, 24)}...</span>
                      <span className="text-[10px] font-mono opacity-80">({f.modules.length} mod)</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Current Formation Metadata Form */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald" /> Édition avant importation
                  </h3>
                  <button
                    onClick={() => {
                      setParsedFormations([])
                      setSelectedIndex(0)
                    }}
                    className="text-xs text-white/50 hover:text-white flex items-center gap-1"
                  >
                    Changer de fichier
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Titre de la formation</label>
                    <input
                      type="text"
                      value={currentFormation.title}
                      onChange={(e) => updateCurrentFormation((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-white/15 text-white text-xs focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Catégorie</label>
                    <select
                      value={currentFormation.category}
                      onChange={(e) => updateCurrentFormation((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-white/15 text-white text-xs focus:outline-none focus:border-gold"
                    >
                      <option value="Fiscalité Marocaine">Fiscalité Marocaine</option>
                      <option value="Comptabilité">Comptabilité &amp; Finance</option>
                      <option value="Gestion Sociale">Gestion Sociale &amp; Paie</option>
                      <option value="Audit & Contrôle">Audit &amp; Contrôle</option>
                      <option value="Droit des Affaires">Droit des Affaires</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1">Prix (MAD)</label>
                      <input
                        type="number"
                        value={currentFormation.price}
                        onChange={(e) => updateCurrentFormation((prev) => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1">Durée (H)</label>
                      <input
                        type="number"
                        value={currentFormation.durationHours}
                        onChange={(e) => updateCurrentFormation((prev) => ({ ...prev, durationHours: Number(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1">Niveau</label>
                      <select
                        value={currentFormation.level}
                        onChange={(e) => updateCurrentFormation((prev) => ({ ...prev, level: e.target.value as any }))}
                        className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/15 text-white text-xs focus:outline-none focus:border-gold"
                      >
                        <option value="Débutant">Débutant</option>
                        <option value="Intermédiaire">Intermédiaire</option>
                        <option value="Avancé">Avancé</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Lien vidéo de présentation</label>
                    <input
                      type="text"
                      value={currentFormation.previewVideoUrl || ''}
                      onChange={(e) => updateCurrentFormation((prev) => ({ ...prev, previewVideoUrl: e.target.value }))}
                      placeholder="https://vimeo.com/... ou https://youtube.com/..."
                      className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Curriculum Modules & Lessons Tree Builder */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-white text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-gold" />
                    Programme &amp; Leçons extraites ({currentFormation.modules.reduce((acc, m) => acc + m.lessons.length, 0)} leçons)
                  </h4>
                  <button
                    onClick={handleAddModule}
                    className="btn-gold text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter un module
                  </button>
                </div>

                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                  {currentFormation.modules.map((mod, modIdx) => (
                    <div key={mod.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-6 h-6 rounded-lg bg-gold/20 text-gold font-mono font-bold text-xs flex items-center justify-center">
                            {modIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={mod.title}
                            onChange={(e) => {
                              const val = e.target.value
                              updateCurrentFormation((prev) => ({
                                ...prev,
                                modules: prev.modules.map((m) => (m.id === mod.id ? { ...m, title: val } : m)),
                              }))
                            }}
                            className="flex-1 bg-transparent border-b border-white/20 focus:border-gold font-bold text-white text-sm py-0.5 focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddLesson(mod.id)}
                            className="text-xs text-gold hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Plus className="w-3 h-3" /> Leçon
                          </button>
                          <button
                            onClick={() => handleDeleteModule(mod.id)}
                            className="p-1 text-white/40 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Lessons list */}
                      <div className="space-y-2 pl-4 border-l-2 border-white/10">
                        {mod.lessons.map((les, lesIdx) => (
                          <div key={les.id} className="p-3 rounded-xl bg-navy-950/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                              <Video className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                              <input
                                type="text"
                                value={les.title}
                                onChange={(e) => {
                                  const val = e.target.value
                                  updateCurrentFormation((prev) => ({
                                    ...prev,
                                    modules: prev.modules.map((m) =>
                                      m.id === mod.id
                                        ? {
                                            ...m,
                                            lessons: m.lessons.map((l) => (l.id === les.id ? { ...l, title: val } : l)),
                                          }
                                        : m
                                    ),
                                  }))
                                }}
                                className="flex-1 bg-transparent border-b border-transparent hover:border-white/20 focus:border-gold text-white font-medium text-xs focus:outline-none"
                              />
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                              <input
                                type="text"
                                value={les.duration}
                                onChange={(e) => {
                                  const val = e.target.value
                                  updateCurrentFormation((prev) => ({
                                    ...prev,
                                    modules: prev.modules.map((m) =>
                                      m.id === mod.id
                                        ? {
                                            ...m,
                                            lessons: m.lessons.map((l) => (l.id === les.id ? { ...l, duration: val } : l)),
                                          }
                                        : m
                                    ),
                                  }))
                                }}
                                className="w-20 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 text-[11px] font-mono text-center focus:outline-none"
                              />

                              <button
                                onClick={() => handleDeleteLesson(mod.id, les.id)}
                                className="p-1 text-white/40 hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-white/10 bg-white/5 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white hover:bg-white/10 text-xs font-bold transition-all"
          >
            Fermer
          </button>

          {parsedFormations.length > 0 && (
            <button
              onClick={handleConfirmImport}
              className="btn-gold text-xs px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-gold"
            >
              <CheckCircle2 className="w-4 h-4" />
              Valider et importer dans le catalogue ({parsedFormations.length} formation{parsedFormations.length > 1 ? 's' : ''})
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
