import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { CertificateTemplate, CertificateType } from '../../types';
import {
  Award,
  FileCheck,
  Printer,
  Sparkles,
  QrCode,
  Building,
  Send,
  Sliders,
} from 'lucide-react';

export const StudioCertificateDesigner: React.FC = () => {
  const {
    certificateTemplates,
    updateCertificateTemplate,
    issueCustomCertificate,
    courses,
    setSelectedCertificate,
    setCurrentView,
    showToast,
  } = useApp();

  const [activeType, setActiveType] = useState<CertificateType>('certificate_completion');

  // Selected Template
  const activeTemplate =
    certificateTemplates.find((t) => t.type === activeType) || certificateTemplates[0];

  // Editable Template Form State
  const [title, setTitle] = useState(activeTemplate?.title || '');
  const [headerText, setHeaderText] = useState(activeTemplate?.headerText || '');
  const [subheadText, setSubheadText] = useState(activeTemplate?.subheadText || '');
  const [bodyTemplate, setBodyTemplate] = useState(activeTemplate?.bodyTemplate || '');
  const [signatoryName, setSignatoryName] = useState(activeTemplate?.signatoryName || '');
  const [signatoryTitle, setSignatoryTitle] = useState(activeTemplate?.signatoryTitle || '');
  const [cabinetSealText, setCabinetSealText] = useState(activeTemplate?.cabinetSealText || '');
  const [primaryColor, setPrimaryColor] = useState(activeTemplate?.primaryColorHex || '#059669');

  // Manual Instant Issuance Form State
  const [issueRecipientName, setIssueRecipientName] = useState('');
  const [issueRecipientCompany, setIssueRecipientCompany] = useState('');
  const [issueCourseTitle, setIssueCourseTitle] = useState(courses[0]?.title || 'Formation Approfondie en Comptabilité Marocaine');
  const [issueDuration, setIssueDuration] = useState('25 Heures');
  const [issueScore, setIssueScore] = useState('92');
  const [issueLocation, setIssueLocation] = useState('Casablanca, Maroc');

  // Switch Template tab handler
  const handleSelectTemplate = (type: CertificateType) => {
    setActiveType(type);
    const tmpl = certificateTemplates.find((t) => t.type === type);
    if (tmpl) {
      setTitle(tmpl.title);
      setHeaderText(tmpl.headerText);
      setSubheadText(tmpl.subheadText);
      setBodyTemplate(tmpl.bodyTemplate);
      setSignatoryName(tmpl.signatoryName);
      setSignatoryTitle(tmpl.signatoryTitle);
      setCabinetSealText(tmpl.cabinetSealText);
      setPrimaryColor(tmpl.primaryColorHex);
    }
  };

  // Save Template modifications
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTemplate) return;

    const updated: CertificateTemplate = {
      ...activeTemplate,
      title,
      headerText,
      subheadText,
      bodyTemplate,
      signatoryName,
      signatoryTitle,
      cabinetSealText,
      primaryColorHex: primaryColor,
    };

    updateCertificateTemplate(updated);
  };

  // Issue custom certificate/attestation
  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueRecipientName.trim()) {
      showToast('Nom Requis', 'Veuillez saisir le nom complet de l apprenant.', 'warning');
      return;
    }

    const typeTitleMap: Record<CertificateType, string> = {
      certificate_completion: 'CERTIFICAT DE MAÎTRISE ET RÉUSSITE EXAMEN',
      attestation_presence: 'ATTESTATION DE PRÉSENCE & PARTICIPATION',
      attestation_stage: 'ATTESTATION DE STAGE & IMMERSION PRATIQUE',
    };

    const newCert = issueCustomCertificate({
      type: activeType,
      typeTitle: typeTitleMap[activeType],
      userName: issueRecipientName,
      recipientCompany: issueRecipientCompany || 'Cabinet / Entreprise Externe',
      courseTitle: issueCourseTitle,
      scorePercent: parseInt(issueScore) || 90,
      instructorName: signatoryName || 'M. Karim Alami',
      instructorTitle: signatoryTitle || 'Expert-Comptable DPLE',
      durationHours: parseInt(issueDuration) || 20,
      location: issueLocation,
      sealTitle: cabinetSealText,
    });

    // Preview certificate
    setSelectedCertificate(newCert);
    setCurrentView('certificate');
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-mono">Studio Designer & Émission d'Attestations</h2>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold rounded uppercase">
                MOTEUR VERIFIÉ QR-CODE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Personnalisez les modèles officiels du Cabinet Excelium et émettez des Attestations de Présence ou Certificats de Réussite en 1 clic.
            </p>
          </div>
        </div>

        {/* Document Type Selector Tabs */}
        <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 font-mono text-xs font-bold w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => handleSelectTemplate('certificate_completion')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeType === 'certificate_completion'
                ? 'bg-emerald-600 text-white shadow-lg font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificat Réussite</span>
          </button>

          <button
            onClick={() => handleSelectTemplate('attestation_presence')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeType === 'attestation_presence'
                ? 'bg-sky-600 text-white shadow-lg font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Attestation Présence</span>
          </button>

          <button
            onClick={() => handleSelectTemplate('attestation_stage')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeType === 'attestation_stage'
                ? 'bg-purple-600 text-white shadow-lg font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Attestation Stage</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Live Certificate Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs font-bold text-slate-700">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Aperçu Visuel en Temps Réel du Document :</span>
            </span>
            <span className="text-slate-500 font-normal">Format Officiel A4 Paysage HD</span>
          </div>

          {/* Certificate Render Card */}
          <div className="bg-slate-950 p-6 sm:p-10 rounded-3xl border-2 border-slate-800 shadow-2xl relative overflow-hidden font-serif">
            {/* Background luxury watermark */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
              <div className="w-96 h-96 rounded-full border-8 border-amber-400 flex items-center justify-center font-black text-6xl font-mono text-amber-400">
                EXCELIUM
              </div>
            </div>

            {/* Certificate Frame Border */}
            <div
              className="border-4 p-6 sm:p-8 rounded-2xl relative space-y-6 text-center"
              style={{ borderColor: primaryColor }}
            >
              {/* Top Header */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono tracking-widest uppercase font-bold text-amber-400">
                  {headerText}
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
                  {title}
                </h3>
                <div className="text-[10px] font-mono text-slate-400 tracking-wider">
                  {subheadText}
                </div>
              </div>

              {/* Recipient Name Slot */}
              <div className="py-4 space-y-2 border-y border-slate-800/80">
                <p className="text-xs text-slate-300 font-sans italic">Ce document est décerné à :</p>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-sans tracking-wide">
                  {issueRecipientName || 'Mme / M. [Nom Complet de l\'Apprenant]'}
                </div>
                {issueRecipientCompany && (
                  <p className="text-xs text-slate-400 font-mono">
                    Entreprise / Organisme : <strong className="text-slate-200">{issueRecipientCompany}</strong>
                  </p>
                )}
              </div>

              {/* Body Text */}
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed font-sans">
                {bodyTemplate} pour la formation intitulée :
                <br />
                <strong className="text-white text-base block mt-1 font-bold">
                  "{issueCourseTitle}"
                </strong>
              </p>

              {/* Details & QR Code Footer */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 text-left font-mono text-[10px] text-slate-400">
                <div className="space-y-1">
                  <div>Date de Délivrance : <strong className="text-white">2026-10-06</strong></div>
                  <div>Lieu : <strong className="text-slate-300">{issueLocation}</strong></div>
                  <div>Durée Totale : <strong className="text-slate-300">{issueDuration}</strong></div>
                  {activeType === 'certificate_completion' && (
                    <div>Score Examen : <strong className="text-emerald-400">{issueScore}% (Mention Très Bien)</strong></div>
                  )}
                </div>

                {/* QR Code Placeholder */}
                <div className="flex items-center gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <QrCode className="w-10 h-10 text-amber-400 shrink-0" />
                  <div className="text-[9px] leading-tight">
                    <div className="font-bold text-slate-200">VÉRIFICATION DIGITALE</div>
                    <div className="text-slate-400 font-mono">Code: EXC-2026-STUDIO</div>
                    <div className="text-emerald-400 font-bold mt-0.5">AUTHENTIQUE</div>
                  </div>
                </div>

                {/* Signature Box */}
                <div className="text-right space-y-1">
                  <div className="text-[10px] font-bold text-amber-400">{cabinetSealText}</div>
                  <div className="text-xs font-black text-white font-sans">{signatoryName}</div>
                  <div className="text-[9px] text-slate-400">{signatoryTitle}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Template Configurator & Instant Issuer Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section A: Instant Custom Issuance */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Send className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Émission Immédiate d'un Document</h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  Saisissez les coordonnées de l'apprenant pour lui générer son attestation.
                </p>
              </div>
            </div>

            <form onSubmit={handleIssueCertificate} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nom & Prénom de l'Apprenant *
                </label>
                <input
                  type="text"
                  placeholder="ex: Youssef Mansouri"
                  value={issueRecipientName}
                  onChange={(e) => setIssueRecipientName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Société / Cabinet</label>
                  <input
                    type="text"
                    placeholder="ex: Fiduciaire Maroc"
                    value={issueRecipientCompany}
                    onChange={(e) => setIssueRecipientCompany(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Score / Note (%)</label>
                  <input
                    type="number"
                    value={issueScore}
                    onChange={(e) => setIssueScore(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Intitulé de la Formation / Séminaire *</label>
                <select
                  value={issueCourseTitle}
                  onChange={(e) => setIssueCourseTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                  <option value="Séminaire Pratique : Loi de Finances 2026 & Clôture Fiscale">
                    Séminaire Pratique : Loi de Finances 2026 & Clôture Fiscale
                  </option>
                  <option value="Atelier Immersion Sage 100c Paie & Damancom">
                    Atelier Immersion Sage 100c Paie & Damancom
                  </option>
                  <option value="Stage Pratique Comptable et Fiscal 3 Mois">
                    Stage Pratique Comptable et Fiscal 3 Mois
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Durée (Heures)</label>
                  <input
                    type="text"
                    value={issueDuration}
                    onChange={(e) => setIssueDuration(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Ville / Lieu</label>
                  <input
                    type="text"
                    value={issueLocation}
                    onChange={(e) => setIssueLocation(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Générer & Prévisualiser le Document PDF</span>
              </button>
            </form>
          </div>

          {/* Section B: Template Customizer Form */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-bold text-white text-sm">Personnaliser le Modèle Visuel</h3>
                <p className="text-[11px] text-slate-400">
                  Modifier les textes officiels et la signature du cabinet.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Titre Principal du Document</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">En-tête Officiel</label>
                <input
                  type="text"
                  value={headerText}
                  onChange={(e) => setHeaderText(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Texte d'Attestation (Corps)</label>
                <textarea
                  rows={2}
                  value={bodyTemplate}
                  onChange={(e) => setBodyTemplate(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Signataire (Nom)</label>
                  <input
                    type="text"
                    value={signatoryName}
                    onChange={(e) => setSignatoryName(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Titre du Signataire</label>
                  <input
                    type="text"
                    value={signatoryTitle}
                    onChange={(e) => setSignatoryTitle(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <label className="text-slate-300 font-bold">Couleur Principale :</label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-colors"
                >
                  Enregistrer le Modèle
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
