import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { DownloadableResource } from '../types';
import { InteractiveAccountingCalculator } from './InteractiveAccountingCalculator';
import {
  FileText,
  FileSpreadsheet,
  FileCheck,
  Search,
  Download,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

export const DocumentHubView: React.FC = () => {
  const { resources, addResource, currentUser, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('Tous');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Resource state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<'pdf' | 'excel' | 'word'>('excel');
  const [newSize, setNewSize] = useState('2.5 MB');

  const filteredResources = resources.filter((res) => {
    if (filterType !== 'Tous') {
      if (filterType === 'excel' && res.fileType !== 'excel') return false;
      if (filterType === 'pdf' && res.fileType !== 'pdf') return false;
      if (filterType === 'word' && res.fileType !== 'word') return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return res.title.toLowerCase().includes(q) || res.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newRes: DownloadableResource = {
      id: `res_${Math.random().toString(36).substring(2, 8)}`,
      title: newTitle,
      description: newDescription,
      fileType: newType,
      fileSize: newSize,
      downloadUrl: '#download',
      isPremium: true,
    };

    addResource(newRes);
    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-mono font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Centre de Téléchargement Officiel Cabinet Excelium</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Hub Documents & Matrices Comptables
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Téléchargez les plans comptables révisés CGNC 2026, matrices automatisées Excel et dossiers d'audit.
          </p>
        </div>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs rounded-xl shadow-md hover:scale-105 transition-transform flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajouter un Fichier</span>
          </button>
        )}
      </div>

      {/* Interactive Calculator Section */}
      <InteractiveAccountingCalculator />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, Plan Comptable, IS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['Tous', 'excel', 'pdf', 'word'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-colors ${
                filterType === t
                  ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'Tous' ? 'Tous les formats' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="p-5 bg-white border border-slate-200 rounded-2xl hover:border-cyan-400 transition-all flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {res.fileType === 'excel' ? (
                    <FileSpreadsheet className="w-7 h-7 text-emerald-600 shrink-0" />
                  ) : res.fileType === 'pdf' ? (
                    <FileText className="w-7 h-7 text-rose-600 shrink-0" />
                  ) : (
                    <FileCheck className="w-7 h-7 text-cyan-600 shrink-0" />
                  )}
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono text-slate-700 uppercase font-bold">
                    {res.fileType}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-500 font-medium">{res.fileSize}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{res.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{res.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-800 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Vérifié par Cabinet Excelium
              </span>

              <button
                onClick={() => showToast('Téléchargement', `Téléchargement de ${res.title}...`)}
                className="px-3.5 py-1.5 bg-cyan-50 border border-cyan-200 text-cyan-800 hover:bg-cyan-600 hover:text-white font-bold rounded-xl transition-all text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-6 animate-in fade-in zoom-in-95 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Ajouter un Document Téléchargeable</h3>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Titre du fichier :</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Matrice Amortissements 2026 Excel"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Description :</label>
                <textarea
                  rows={3}
                  placeholder="Préciser le contenu et les avantages du fichier..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">Format :</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="pdf">PDF (.pdf)</option>
                    <option value="word">Word (.docx)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">Taille estimée :</label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Publier dans le Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
