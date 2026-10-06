import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { LiveWorkshop, WorkshopAttendee } from '../../types';
import {
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Award,
  UserCheck,
  Send,
  Search,
} from 'lucide-react';

export const StudioWorkshopManager: React.FC = () => {
  const {
    workshops,
    addWorkshop,
    updateWorkshop,
    markAttendeePresence,
    issueWorkshopAttestation,
    setSelectedCertificate,
    setCurrentView,
    showToast,
    formatPrice,
  } = useApp();

  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(workshops[0]?.id || '');
  const activeWorkshop = workshops.find((w) => w.id === selectedWorkshopId) || workshops[0] || null;

  // New Workshop Modal & Form State
  const [showAddWsModal, setShowAddWsModal] = useState(false);
  const [showAddAttendeeModal, setShowAddAttendeeModal] = useState(false);

  // Workshop Form
  const [wsTitle, setWsTitle] = useState('');
  const [wsSubtitle, setWsSubtitle] = useState('');
  const [wsCategory, setWsCategory] = useState<'Comptabilité' | 'Fiscalité' | 'Finance' | 'Audit' | 'Logiciels Comptables' | 'Normes IFRS'>('Fiscalité');
  const [wsType, setWsType] = useState<'présentiel' | 'webinaire' | 'hybride'>('présentiel');
  const [wsDate, setWsDate] = useState('28 Novembre 2026');
  const [wsTimeSlot, setWsTimeSlot] = useState('09h00 - 17h00');
  const [wsLocation, setWsLocation] = useState('Hôtel Kenzi Tower, Casablanca');
  const [wsInstructor] = useState('M. Karim Alami (Expert-Comptable)');
  const [wsCapacity, setWsCapacity] = useState('30');
  const [wsPrice, setWsPrice] = useState('2500');

  // Add Attendee Form
  const [attName, setAttName] = useState('');
  const [attEmail, setAttEmail] = useState('');
  const [attCompany, setAttCompany] = useState('');
  const [attPhone, setAttPhone] = useState('');

  // Search attendee
  const [attendeeSearch, setAttendeeSearch] = useState('');

  // Submit Create Workshop
  const handleCreateWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsTitle.trim()) return;

    const newWs: LiveWorkshop = {
      id: `ws-${Date.now()}`,
      title: wsTitle,
      subtitle: wsSubtitle || 'Séminaire pratique dispensé par les experts du Cabinet Excelium.',
      category: wsCategory,
      type: wsType,
      date: wsDate,
      timeSlot: wsTimeSlot,
      locationOrUrl: wsLocation,
      instructorName: wsInstructor,
      capacity: parseInt(wsCapacity) || 30,
      enrolledCount: 0,
      priceMAD: parseFloat(wsPrice) || 0,
      status: 'planifié',
      attendees: [],
    };

    addWorkshop(newWs);
    setSelectedWorkshopId(newWs.id);
    setShowAddWsModal(false);
    setWsTitle('');
    setWsSubtitle('');
  };

  // Submit Add Attendee to Active Workshop
  const handleAddAttendee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkshop || !attName.trim()) return;

    const newAttendee: WorkshopAttendee = {
      id: `att-${Date.now()}`,
      studentName: attName,
      studentEmail: attEmail || `${attName.toLowerCase().replace(/\s+/g, '.')}@entreprise.ma`,
      company: attCompany || 'Cabinet Externe',
      phone: attPhone || '+212 6 00 00 00 00',
      attended: true,
      attestationIssued: false,
    };

    const updatedWs: LiveWorkshop = {
      ...activeWorkshop,
      enrolledCount: activeWorkshop.enrolledCount + 1,
      attendees: [...activeWorkshop.attendees, newAttendee],
    };

    updateWorkshop(updatedWs);
    setShowAddAttendeeModal(false);
    setAttName('');
    setAttEmail('');
    setAttCompany('');
    setAttPhone('');
  };

  // Issue single attestation
  const handleIssueAttestation = (attendeeId: string) => {
    if (!activeWorkshop) return;
    const cert = issueWorkshopAttestation(activeWorkshop.id, attendeeId);
    if (cert) {
      setSelectedCertificate(cert);
      setCurrentView('certificate');
    }
  };

  // Batch issue attestations to all present attendees
  const handleBatchIssueAttestations = () => {
    if (!activeWorkshop) return;
    const presentAttendees = activeWorkshop.attendees.filter((a) => a.attended && !a.attestationIssued);
    if (presentAttendees.length === 0) {
      showToast('Aucun Candidat', 'Tous les participants présents ont déjà reçu leur attestation.', 'info');
      return;
    }

    presentAttendees.forEach((a) => {
      issueWorkshopAttestation(activeWorkshop.id, a.id);
    });

    showToast('Attestations Émises !', `${presentAttendees.length} attestations de présence ont été générées avec succès.`, 'success');
  };

  const filteredAttendees = activeWorkshop?.attendees.filter((a) =>
    a.studentName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
    (a.company && a.company.toLowerCase().includes(attendeeSearch.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-8 font-sans">
      {/* Header Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-mono">Gestionnaire des Formations Présentielles & Séminaires</h2>
              <span className="px-2.5 py-0.5 bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[10px] font-mono font-bold rounded uppercase">
                ÉMARGEMENT & PARTICIPATION
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Gérez vos séminaires en présentiel et webinaires en direct, validez les présences et générez les attestations de présence en lot.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddWsModal(true)}
          className="px-5 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Planifier un Séminaire</span>
        </button>
      </div>

      {/* Workshop Selector & Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Workshop List */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-mono text-xs font-bold text-slate-700 uppercase tracking-wider">
            Sessions Programmées ({workshops.length})
          </h3>

          <div className="space-y-3">
            {workshops.map((ws) => {
              const isSelected = ws.id === selectedWorkshopId;
              return (
                <div
                  key={ws.id}
                  onClick={() => setSelectedWorkshopId(ws.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-sky-500 text-white shadow-xl ring-2 ring-sky-500/20'
                      : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        ws.type === 'présentiel'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {ws.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {formatPrice(ws.priceMAD)}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm leading-snug line-clamp-2">{ws.title}</h4>

                  <div className="text-[11px] font-mono space-y-1 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      <span>{ws.date} • {ws.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{ws.locationOrUrl}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px] font-mono">
                    <span className="text-slate-400">Inscrits : <strong className="text-white">{ws.attendees.length} / {ws.capacity}</strong></span>
                    <span className="text-emerald-400 font-bold">
                      {ws.attendees.filter((a) => a.attended).length} Présents
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Workshop Details & Attendee Roster (Émargement) */}
        <div className="lg:col-span-8 space-y-6">
          {activeWorkshop ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              {/* Active Workshop Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-mono text-[10px] font-bold rounded">
                      {activeWorkshop.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {activeWorkshop.date} ({activeWorkshop.timeSlot})
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1">{activeWorkshop.title}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Lieu : {activeWorkshop.locationOrUrl}</span>
                    <span>• Formateur : {activeWorkshop.instructorName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowAddAttendeeModal(true)}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-sky-400" />
                    <span>+ Inscrire Participant</span>
                  </button>

                  <button
                    onClick={handleBatchIssueAttestations}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>Émettre Attestations (Lot)</span>
                  </button>
                </div>
              </div>

              {/* Roster Toolbar & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Chercher un participant..."
                    value={attendeeSearch}
                    onChange={(e) => setAttendeeSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 text-slate-900 font-bold"
                  />
                </div>

                <div className="flex items-center gap-3 text-slate-600 font-bold">
                  <span>Total Inscrits : <strong className="text-slate-900">{activeWorkshop.attendees.length}</strong></span>
                  <span>• Présents : <strong className="text-emerald-700">{activeWorkshop.attendees.filter((a) => a.attended).length}</strong></span>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="p-3.5">Participant & Entreprise</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5 text-center">Émargement (Présence)</th>
                      <th className="p-3.5 text-right">Attestation de Présence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredAttendees.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 italic">
                          Aucun participant inscrit pour le moment. Cliquez sur "+ Inscrire Participant".
                        </td>
                      </tr>
                    ) : (
                      filteredAttendees.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{att.studentName}</div>
                            <div className="text-[11px] text-slate-500">{att.company || 'Cabinet Externe'}</div>
                          </td>
                          <td className="p-3.5 text-slate-600">
                            <div>{att.studentEmail}</div>
                            <div className="text-[10px] text-slate-400">{att.phone}</div>
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => markAttendeePresence(activeWorkshop.id, att.id, !att.attended)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 mx-auto transition-colors ${
                                att.attended
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {att.attended ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>PRÉSENT (ÉMARGÉ)</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>ABSENT</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="p-3.5 text-right">
                            {att.attestationIssued ? (
                              <button
                                onClick={() => handleIssueAttestation(att.id)}
                                className="px-3 py-1.5 bg-sky-50 text-sky-800 border border-sky-200 font-bold rounded-xl flex items-center gap-1.5 ml-auto text-[10px]"
                              >
                                <Award className="w-3.5 h-3.5 text-sky-600" />
                                <span>Voir Attestation ({att.attestationCode})</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleIssueAttestation(att.id)}
                                disabled={!att.attended}
                                className={`px-3 py-1.5 font-bold rounded-xl flex items-center gap-1.5 ml-auto text-[11px] transition-colors ${
                                  att.attended
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Générer Attestation</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl">
              <p className="text-slate-600">Aucune session sélectionnée.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Workshop */}
      {showAddWsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Planifier une Formation Présentielle / Webinaire</h3>
              <button onClick={() => setShowAddWsModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkshop} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Titre de la Session *</label>
                <input
                  type="text"
                  placeholder="ex: Séminaire Présentiel : Loi de Finances 2026"
                  value={wsTitle}
                  onChange={(e) => setWsTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Catégorie</label>
                  <select
                    value={wsCategory}
                    onChange={(e) => setWsCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  >
                    <option value="Fiscalité">Fiscalité</option>
                    <option value="Comptabilité">Comptabilité</option>
                    <option value="Finance">Finance</option>
                    <option value="Audit">Audit</option>
                    <option value="Logiciels Comptables">Logiciels Comptables</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Format</label>
                  <select
                    value={wsType}
                    onChange={(e) => setWsType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  >
                    <option value="présentiel">Présentiel</option>
                    <option value="webinaire">Webinaire (Zoom)</option>
                    <option value="hybride">Hybride</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Date</label>
                  <input
                    type="text"
                    value={wsDate}
                    onChange={(e) => setWsDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Horaire</label>
                  <input
                    type="text"
                    value={wsTimeSlot}
                    onChange={(e) => setWsTimeSlot(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Lieu ou Lien Zoom</label>
                <input
                  type="text"
                  value={wsLocation}
                  onChange={(e) => setWsLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Capacité (Places)</label>
                  <input
                    type="number"
                    value={wsCapacity}
                    onChange={(e) => setWsCapacity(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Prix (DH)</label>
                  <input
                    type="number"
                    value={wsPrice}
                    onChange={(e) => setWsPrice(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWsModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-xl font-black shadow"
                >
                  Enregistrer la Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Attendee */}
      {showAddAttendeeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Inscrire un Participant</h3>
              <button onClick={() => setShowAddAttendeeModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAttendee} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nom & Prénom *</label>
                <input
                  type="text"
                  placeholder="ex: Fatima-Zohra Mansouri"
                  value={attName}
                  onChange={(e) => setAttName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Adresse Email</label>
                <input
                  type="email"
                  placeholder="fz.mansouri@entreprise.ma"
                  value={attEmail}
                  onChange={(e) => setAttEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Société / Cabinet</label>
                  <input
                    type="text"
                    placeholder="Cabinet Fiduciaire"
                    value={attCompany}
                    onChange={(e) => setAttCompany(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Téléphone</label>
                  <input
                    type="text"
                    placeholder="+212 6..."
                    value={attPhone}
                    onChange={(e) => setAttPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAttendeeModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-xl font-black shadow"
                >
                  Valider l'Inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
