import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Printer, ArrowLeft, ShieldCheck, QrCode } from 'lucide-react';

export const CertificateViewer: React.FC = () => {
  const { selectedCertificate, currentUser, setCurrentView } = useApp();

  const cert = selectedCertificate || currentUser.certificates[0] || {
    id: 'cert_884920',
    certificateCode: 'EXC-2026-COMPTA-8849',
    userId: currentUser.id,
    userName: currentUser.name,
    courseId: 'course-1',
    courseTitle: 'Comptabilité Générale Marocaine & Pratique du CGNC 2026',
    issueDate: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
    scorePercent: 92,
    instructorName: 'M. Karim Alami (Expert-Comptable DPLE)',
    verificationUrl: 'https://excelium.ma/verify/EXC-2026-COMPTA-8849',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 hover:bg-slate-100 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à Mon Espace</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer / Télécharger en PDF (HD)</span>
        </button>
      </div>

      {/* Official Certificate Layout */}
      <div
        id="certificate-print-area"
        className="relative bg-white border-8 border-amber-600/80 rounded-3xl p-8 sm:p-14 shadow-2xl overflow-hidden text-center space-y-8 print:bg-white print:text-slate-950 print:border-amber-600 print:shadow-none"
      >
        {/* Background Ornament Watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Certificate Header */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-center gap-2 text-amber-700 font-mono text-xs font-bold tracking-widest uppercase">
            <Award className="w-5 h-5 text-amber-600" />
            <span>CABINET EXCELIUM CONSULTING COMPTA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-serif tracking-tight uppercase print:text-slate-900">
            CERTIFICAT DE SPÉCIALISATION
          </h1>
          <p className="text-xs sm:text-sm text-amber-800 font-mono font-bold uppercase tracking-widest">
            — DÉCERNÉ PAR LE CONSEIL DE FORMATION DU CABINET —
          </p>
        </div>

        {/* Recipient Name */}
        <div className="py-4 border-y border-slate-200 print:border-slate-300 space-y-2">
          <p className="text-xs text-slate-500 font-mono font-medium uppercase">Attesté que M. / Mme :</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-emerald-800 font-sans tracking-wide uppercase print:text-emerald-800">
            {cert.userName}
          </h2>
        </div>

        {/* Course Title */}
        <div className="space-y-3">
          <p className="text-xs text-slate-600 font-sans leading-relaxed max-w-2xl mx-auto print:text-slate-700 font-medium">
            A suivi avec succès l'intégralité du programme d'études et satisfait aux exigences des évaluations théoriques et cas pratiques officiels sur la formation :
          </p>

          <h3 className="text-lg sm:text-2xl font-black text-slate-900 font-mono leading-snug max-w-3xl mx-auto print:text-slate-900">
            « {cert.courseTitle} »
          </h3>

          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
            <span>Score Obtenu à l'Examen : <strong className="text-emerald-700">{cert.scorePercent}%</strong></span>
            <span>•</span>
            <span>Code Certificat : <strong>{cert.certificateCode}</strong></span>
          </div>
        </div>

        {/* Signatures & Verification Section */}
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end border-t border-slate-200 print:border-slate-300 text-xs font-mono">
          {/* Left: Issue Date */}
          <div className="text-left space-y-1">
            <div className="text-slate-500 text-[10px]">Date de Délivrance :</div>
            <div className="text-slate-900 font-bold print:text-slate-950">{cert.issueDate}</div>
            <div className="text-[10px] text-slate-500">Casablanca, Maroc</div>
          </div>

          {/* Center: Gold Embossed Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-600 p-1 shadow-xl flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white border-2 border-amber-500 flex flex-col items-center justify-center text-amber-800 p-2 text-[9px] font-bold tracking-tighter">
                <ShieldCheck className="w-6 h-6 mb-0.5 text-amber-600" />
                <span>EXCELIUM</span>
                <span className="text-[7px] text-slate-900">SEAL 2026</span>
              </div>
            </div>
          </div>

          {/* Right: Signature */}
          <div className="text-right space-y-1">
            <div className="text-slate-500 text-[10px]">Le Président du Cabinet :</div>
            <div className="text-slate-900 font-bold font-serif text-sm print:text-slate-950">
              {cert.instructorName}
            </div>
            <div className="text-[10px] text-emerald-800 font-bold">Expert-Comptable DPLE</div>
          </div>
        </div>

        {/* QR Verification Footer */}
        <div className="pt-4 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <QrCode className="w-4 h-4 text-amber-600" />
            <span>Vérification d'authenticité : {cert.verificationUrl}</span>
          </div>
          <div className="font-bold">Certification Officielle Cabinet Excelium</div>
        </div>
      </div>
    </div>
  );
};
