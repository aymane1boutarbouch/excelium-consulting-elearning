import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudioCertificateDesigner } from './StudioCertificateDesigner';
import { StudioWorkshopManager } from './StudioWorkshopManager';
import { StudioExamBuilder } from './StudioExamBuilder';
import {
  Layers,
  Award,
  Calendar,
  BookOpen,
  PlusCircle,
  LogOut,
  TrendingUp,
  FileSpreadsheet,
  FolderPlus,
  Video,
  FilePlus,
  Download,
  Zap,
  UserPlus,
  Search,
  Trash2,
} from 'lucide-react';
import type { Course, CourseModule, Lesson, DownloadableResource } from '../../types';

export const ExceliumStudioView: React.FC = () => {
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    orders,
    workshops,
    logoutAdmin,
    resources,
    addResource,
    formatPrice,
    showToast,
    enrollInCourse,
  } = useApp();

  const [studioTab, setStudioTab] = useState<'curriculum' | 'exams' | 'certificates' | 'workshops' | 'exercises' | 'resources'>('curriculum');

  // Search filter across studio courses
  const [studioSearch, setStudioSearch] = useState('');

  // Selected Course for Curriculum Editor
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0] || null;

  // Modals visibility
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showQuickGrantModal, setShowQuickGrantModal] = useState(false);

  // Form State: Create / Edit Course
  const [courseFormTitle, setCourseFormTitle] = useState('');
  const [courseFormSubtitle, setCourseFormSubtitle] = useState('');
  const [courseFormCategory, setCourseFormCategory] = useState<'Comptabilité' | 'Fiscalité' | 'Finance' | 'Audit' | 'Logiciels Comptables' | 'Normes IFRS'>('Comptabilité');
  const [courseFormLevel, setCourseFormLevel] = useState<'Débutant' | 'Intermédiaire' | 'Expert' | 'Tous Niveaux'>('Intermédiaire');
  const [courseFormPrice, setCourseFormPrice] = useState('1990');
  const [courseFormInstructor] = useState('Cabinet Excelium Consulting');
  const [courseFormImage] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80');

  // Form State: Add Module
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');

  // Form State: Add Lesson
  const [targetModuleId, setTargetModuleId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('35 min');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [lessonVideoType, setLessonVideoType] = useState<'mp4' | 'youtube' | 'vimeo'>('mp4');
  const [lessonKeyAstuce, setLessonKeyAstuce] = useState('');

  // Form State: Global Resource Hub
  const [resTitle, setResTitle] = useState('');
  const [resFileType, setResFileType] = useState<'pdf' | 'excel' | 'word' | 'zip'>('excel');
  const [resFileSize, setResFileSize] = useState('3.5 MB');
  const [resDesc, setResDesc] = useState('');

  // Form State: Quick Grant Access
  const [grantEmail, setGrantEmail] = useState('');
  const [grantCourseId, setGrantCourseId] = useState(courses[0]?.id || '');

  const totalRevenue = orders.reduce((sum, o) => sum + o.amountMAD, 0);

  // 1-Click Fast Template Generator for Moroccan Accounting
  const handleGeneratePresetCourse = (presetType: 'cgi' | 'sage' | 'audit' | 'liasse') => {
    let preset: Course;
    const now = Date.now();

    if (presetType === 'cgi') {
      preset = {
        id: `course-cgi-${now}`,
        title: 'Masterclass Fiscalité Marocaine CGI 2026 (Passage IS, TVA & IR)',
        subtitle: 'Guide complet révisé selon la Loi de Finances 2026 avec matrices automatisées.',
        category: 'Fiscalité',
        level: 'Tous Niveaux',
        priceMAD: 2890,
        originalPriceMAD: 4500,
        isFree: false,
        rating: 5.0,
        ratingCount: 88,
        durationHours: 32,
        totalLessons: 8,
        instructorName: 'Mme Souad Benjelloun',
        instructorTitle: 'Conseil Fiscal & Ex-Inspectrice DGI',
        instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        description: 'Formation approfondie sur le passage du résultat comptable au résultat fiscal, la Cotisation Minimale et la télé-déclaration SIMPL-IS.',
        learningObjectives: ['Réalisations des réintégrations et déductions CGI 2026', 'Calcul de la Cotisation Minimale'],
        targetAudience: ['Comptables, DAF et auditeurs'],
        prerequisites: ['Notions en comptabilité générale'],
        modules: [
          {
            id: `mod-cgi-1-${now}`,
            title: 'Module 1 : Réintégrations & Déductions Impôt sur les Sociétés',
            description: 'Analyse des dépenses déductibles et plafonds d amortissements.',
            lessons: [
              {
                id: `les-cgi-1-${now}`,
                moduleId: `mod-cgi-1-${now}`,
                title: '1.1 Plafond des règlements en espèces (5000 DH/jour/fournisseur)',
                duration: '40 min',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                videoType: 'mp4',
                description: 'Explication détaillée des seuils CGI 2026.',
                keyTakeaways: ['Les paiements espèces supérieurs à 5 000 DH sont réintégrés à 50% au-delà du plafond mensuel.'],
                resources: [],
                isFreePreview: true,
              },
            ],
          },
        ],
      };
    } else if (presetType === 'sage') {
      preset = {
        id: `course-sage-${now}`,
        title: 'Sage Saari 100c Paie & Déclaration Damancom (Cas Pratique 2026)',
        subtitle: 'Configuration complète du fichier de paie, bulletins et télé-déclaration CNSS.',
        category: 'Logiciels Comptables',
        level: 'Tous Niveaux',
        priceMAD: 2490,
        originalPriceMAD: 3800,
        isFree: false,
        rating: 4.9,
        ratingCount: 120,
        durationHours: 20,
        totalLessons: 6,
        instructorName: 'Mlle Kenza El Fassi',
        instructorTitle: 'Consultante Certifiée Sage ERP',
        instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
        previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        description: 'Prise en main guidée pas-à-pas de Sage Paie 100c.',
        learningObjectives: ['Paramétrer les constantes de salaire', 'Télé-déclarer sur Damancom'],
        targetAudience: ['Gestionnaires de paie et RH'],
        prerequisites: ['Bases du droit du travail marocain'],
        modules: [
          {
            id: `mod-sage-1-${now}`,
            title: 'Module 1 : Initialisation de la Paie & Rubriques',
            description: 'Création du profil salarié et primes exonérées.',
            lessons: [
              {
                id: `les-sage-1-${now}`,
                moduleId: `mod-sage-1-${now}`,
                title: '1.1 Saisie de la fiche salarié et calcul des cotisations CNSS/AMO',
                duration: '35 min',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                videoType: 'mp4',
                description: 'Configuration du plafond CNSS de 6000 DH.',
                keyTakeaways: ['Appliquer le barème IR révisé 2026.'],
                resources: [],
                isFreePreview: true,
              },
            ],
          },
        ],
      };
    } else {
      preset = {
        id: `course-audit-${now}`,
        title: 'Dossier de Clôture & Audit Financier (Méthodologie OEC)',
        subtitle: 'Démarche d audit légal, circularisation des tiers et revue analytique.',
        category: 'Audit',
        level: 'Expert',
        priceMAD: 3200,
        originalPriceMAD: 4800,
        isFree: false,
        rating: 4.95,
        ratingCount: 65,
        durationHours: 25,
        totalLessons: 5,
        instructorName: 'M. Mehdi Tazi',
        instructorTitle: 'Senior Partner Audit Excelium',
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        description: 'Guide pratique d audit d entreprise.',
        learningObjectives: ['Élaborer la cartographie des risques'],
        targetAudience: ['Auditeurs et contrôleurs de gestion'],
        prerequisites: ['Maîtrise de la comptabilité'],
        modules: [
          {
            id: `mod-aud-1-${now}`,
            title: 'Module 1 : Seuil de Signification & Plan de Mission',
            description: 'Calcul des risques d anomalies.',
            lessons: [
              {
                id: `les-aud-1-${now}`,
                moduleId: `mod-aud-1-${now}`,
                title: '1.1 Détermination du seuil de planification',
                duration: '45 min',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                videoType: 'mp4',
                description: 'Prise de connaissance générale de l entreprise.',
                keyTakeaways: ['Le seuil de planification est égal à 75% du seuil global.'],
                resources: [],
                isFreePreview: true,
              },
            ],
          },
        ],
      };
    }

    addCourse(preset);
    setSelectedCourseId(preset.id);
    showToast('Formation Générée !', `La formation "${preset.title}" a été ajoutée au catalogue en 1 clic.`, 'success');
  };

  // Submit Create Course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormTitle.trim()) return;

    const newCourseObj: Course = {
      id: `course-${Date.now()}`,
      title: courseFormTitle,
      subtitle: courseFormSubtitle || 'Formation pratique dispensée par les experts du Cabinet Excelium.',
      category: courseFormCategory,
      level: courseFormLevel,
      priceMAD: parseFloat(courseFormPrice) || 0,
      originalPriceMAD: Math.round((parseFloat(courseFormPrice) || 0) * 1.5),
      isFree: parseFloat(courseFormPrice) === 0,
      rating: 5.0,
      ratingCount: 1,
      durationHours: 15,
      totalLessons: 1,
      instructorName: courseFormInstructor,
      instructorTitle: 'Expert-Comptable DPLE & Formateur Cabinet',
      instructorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      imageUrl: courseFormImage,
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'Formation professionnelle complète avec cas pratiques réels sur Excel et logiciels comptables.',
      learningObjectives: [
        'Maîtriser les principes comptables et fiscaux marocains 2026.',
        'Appliquer les méthodes de calcul et d enregistrement sur cas réels.',
      ],
      targetAudience: ['Comptables, DAF, auditeurs et étudiants en gestion.'],
      prerequisites: ['Notions élémentaires en comptabilité.'],
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'Module 1 : Fondamentaux & Pratique du Cabinet',
          description: 'Présentation des principes et méthodologie de travail.',
          lessons: [
            {
              id: `lesson-${Date.now()}`,
              moduleId: `mod-${Date.now()}`,
              title: '1.1 Démonstration & Introduction au Programme',
              duration: '25 min',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              videoType: 'mp4',
              description: 'Explication détaillée du programme et mise en situation.',
              keyTakeaways: ['Conserver l historique des pièces justificatives.', 'Vérifier la conformité fiscale.'],
              resources: [],
              isFreePreview: true,
            },
          ],
        },
      ],
    };

    addCourse(newCourseObj);
    setSelectedCourseId(newCourseObj.id);
    setShowCreateCourseModal(false);
    setCourseFormTitle('');
    setCourseFormSubtitle('');
  };

  // Submit Add Module
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !moduleTitle.trim()) return;

    const newMod: CourseModule = {
      id: `mod-${Date.now()}`,
      title: moduleTitle,
      description: moduleDesc || 'Contenu et exercices du module.',
      lessons: [],
    };

    const updatedCourse: Course = {
      ...selectedCourse,
      modules: [...selectedCourse.modules, newMod],
    };

    updateCourse(updatedCourse);
    setShowAddModuleModal(false);
    setModuleTitle('');
    setModuleDesc('');
  };

  // Submit Add Lesson
  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !targetModuleId || !lessonTitle.trim()) return;

    const newLess: Lesson = {
      id: `lesson-${Date.now()}`,
      moduleId: targetModuleId,
      title: lessonTitle,
      duration: lessonDuration || '30 min',
      videoUrl: lessonVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      videoType: lessonVideoType,
      description: 'Leçon vidéo pratique avec astuces du cabinet.',
      keyTakeaways: lessonKeyAstuce.trim() ? [lessonKeyAstuce] : ['Vérifier la conformité des données.'],
      resources: [],
      isFreePreview: false,
    };

    const updatedModules = selectedCourse.modules.map((m) => {
      if (m.id === targetModuleId) {
        return { ...m, lessons: [...m.lessons, newLess] };
      }
      return m;
    });

    const updatedCourse: Course = {
      ...selectedCourse,
      modules: updatedModules,
      totalLessons: updatedModules.flatMap((m) => m.lessons).length,
    };

    updateCourse(updatedCourse);
    setShowAddLessonModal(false);
    setLessonTitle('');
    setLessonKeyAstuce('');
  };

  // Submit Add Global Resource
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    const newRes: DownloadableResource = {
      id: `res-${Date.now()}`,
      title: resTitle,
      fileType: resFileType,
      fileSize: resFileSize || '3.5 MB',
      downloadUrl: '#download-resource',
      description: resDesc || 'Fichier de travail et support officiel Cabinet Excelium.',
      isPremium: true,
    };

    addResource(newRes);
    setShowAddResourceModal(false);
    setResTitle('');
    setResDesc('');
  };

  // Grant Access Submit
  const handleGrantAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim() || !grantCourseId) return;

    enrollInCourse(grantCourseId, 'coupon');
    showToast('Accès Accordé', `L'adresse ${grantEmail} bénéficie désormais de l'accès à la formation.`, 'success');
    setShowQuickGrantModal(false);
    setGrantEmail('');
  };

  // Export Roster to CSV
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Titre Formation,Categorie,Prix MAD,Total Lecons']
        .concat(courses.map((c) => `"${c.title}","${c.category}",${c.priceMAD},${c.totalLessons}`))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Excelium_Studio_Catalogue_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exportation Réussie', 'Le fichier CSV du catalogue a été téléchargé.', 'info');
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(studioSearch.toLowerCase()) ||
    c.category.toLowerCase().includes(studioSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Light Theme Command Center Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                Excelium Studio Command Center
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded uppercase">
                2026 EDITION PRO
              </span>
            </div>
            <p className="text-xs text-slate-600 font-mono mt-1 font-medium">
              Gérez vos cours vidéo longs, vos examens avec attribution d'attestation, vos séminaires et vos fichiers téléchargeables en toute simplicité.
            </p>
          </div>
        </div>

        {/* Command Shortcuts Bar */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto font-mono text-xs font-bold">
          <button
            onClick={() => setShowQuickGrantModal(true)}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
            title="Accorder un accès gratuit par email"
          >
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>+ Accès Express</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
            title="Exporter les données au format CSV"
          >
            <Download className="w-4 h-4 text-cyan-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setStudioTab('curriculum');
              setShowCreateCourseModal(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>+ Créer Formation</span>
          </button>

          <button
            onClick={logoutAdmin}
            title="Quitter l'Espace Studio"
            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* 1-Click Fast AI Assistant / Template Generator Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-cyan-500/10 border border-amber-300/60 rounded-3xl p-5 space-y-3 font-mono text-xs shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span className="font-black text-slate-900 uppercase">
              Générateur Clé-en-main 1-Click (Assistants Métier Maroc) :
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Génération automatique des leçons & astuces</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => handleGeneratePresetCourse('cgi')}
            className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-slate-900 rounded-xl font-bold text-left transition-all shadow-2xs space-y-1"
          >
            <div className="text-emerald-700 font-mono text-[10px] uppercase font-bold">+ Masterclass CGI 2026</div>
            <div className="text-[11px] text-slate-600 font-medium">IS, TVA, Cotisation Minimale</div>
          </button>

          <button
            onClick={() => handleGeneratePresetCourse('sage')}
            className="p-3 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-400 text-slate-900 rounded-xl font-bold text-left transition-all shadow-2xs space-y-1"
          >
            <div className="text-sky-700 font-mono text-[10px] uppercase font-bold">+ Pack Sage Paie 100c</div>
            <div className="text-[11px] text-slate-600 font-medium">Fiches de Paie & Damancom</div>
          </button>

          <button
            onClick={() => handleGeneratePresetCourse('audit')}
            className="p-3 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-slate-900 rounded-xl font-bold text-left transition-all shadow-2xs space-y-1"
          >
            <div className="text-amber-700 font-mono text-[10px] uppercase font-bold">+ Kit Audit & Contrôle</div>
            <div className="text-[11px] text-slate-600 font-medium">Seuil & Circularisations</div>
          </button>

          <button
            onClick={() => {
              setStudioTab('exams');
              showToast('Moteur d Examens', 'Sélectionnez une formation pour lui ajouter des questions d examen.', 'info');
            }}
            className="p-3 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-400 text-slate-900 rounded-xl font-bold text-left transition-all shadow-2xs space-y-1"
          >
            <div className="text-purple-700 font-mono text-[10px] uppercase font-bold">+ Examen & Quiz Expres</div>
            <div className="text-[11px] text-slate-600 font-medium">Attestation automatique</div>
          </button>
        </div>
      </div>

      {/* KPI Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>REVENUS CUMULÉS</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{formatPrice(totalRevenue)}</div>
          <div className="text-[10px] text-slate-500 font-medium">{orders.length} commandes enregistrées</div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>CATALOGUE DE COURS</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{courses.length} Formations</div>
          <div className="text-[10px] text-slate-500 font-medium">Structure pour cours longs</div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>SÉMINAIRES PRÉSENTIEL</span>
            <Calendar className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-800">{workshops.length} Sessions</div>
          <div className="text-[10px] text-slate-500 font-medium">Émargement & Attestations</div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>DOCUMENTS PDF & EXCEL</span>
            <FileSpreadsheet className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-cyan-800">{resources.length} Fichiers</div>
          <div className="text-[10px] text-slate-500 font-medium">Hub de téléchargement</div>
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-3 text-xs font-bold font-mono overflow-x-auto pb-1">
        <button
          onClick={() => setStudioTab('curriculum')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            studioTab === 'curriculum'
              ? 'border-emerald-600 text-emerald-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>🎓 Cours Vidéo & Astuces (Programme Long)</span>
        </button>

        <button
          onClick={() => setStudioTab('exams')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            studioTab === 'exams'
              ? 'border-amber-600 text-amber-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>📝 Examens Blancs & Certifications (Auto)</span>
        </button>

        <button
          onClick={() => setStudioTab('certificates')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            studioTab === 'certificates'
              ? 'border-sky-600 text-sky-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-sky-600" />
          <span>📜 Studio Attestations & Certificats</span>
        </button>

        <button
          onClick={() => setStudioTab('resources')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            studioTab === 'resources'
              ? 'border-cyan-600 text-cyan-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-cyan-600" />
          <span>📂 Hub Documents (PDF & Excel)</span>
        </button>

        <button
          onClick={() => setStudioTab('workshops')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            studioTab === 'workshops'
              ? 'border-indigo-600 text-indigo-800 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>📅 Séminaires Présentiel</span>
        </button>
      </div>

      {/* TAB 1: CURRICULUM & LONG COURSES BUILDER */}
      {studioTab === 'curriculum' && (
        <div className="space-y-6">
          {/* Course Selector Toolbar with Live Filter */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-bold rounded uppercase">
                  Structure des Cours Longs & Astuces du Cabinet
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Sélectionnez la Formation à Modifier :</h3>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs flex-wrap">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Filtrer les cours..."
                    value={studioSearch}
                    onChange={(e) => setStudioSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 font-bold"
                  />
                </div>

                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="p-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl font-bold focus:outline-none focus:border-emerald-500 max-w-md"
                >
                  {filteredCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.modules.length} Modules • {c.totalLessons} Leçons)
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowCreateCourseModal(true)}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Créer Formation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Curriculum Structure Card */}
          {selectedCourse ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded">
                      {selectedCourse.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      Prix : {formatPrice(selectedCourse.priceMAD)}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1">{selectedCourse.title}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Formateur : {selectedCourse.instructorName} • {selectedCourse.modules.length} Modules • {selectedCourse.totalLessons} Leçons Vidéo
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddModuleModal(true)}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 font-mono"
                  >
                    <FolderPlus className="w-4 h-4 text-emerald-400" />
                    <span>+ Nouveau Module</span>
                  </button>

                  <button
                    onClick={() => deleteCourse(selectedCourse.id)}
                    className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
                    title="Supprimer la formation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modules & Lessons List */}
              <div className="space-y-6">
                {selectedCourse.modules.map((mod, modIdx) => (
                  <div key={mod.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-mono">
                          <span className="text-emerald-700 font-mono">Module 0{modIdx + 1} :</span>
                          {mod.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                      </div>

                      <button
                        onClick={() => {
                          setTargetModuleId(mod.id);
                          setShowAddLessonModal(true);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors font-mono self-start sm:self-center"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ Ajouter Leçon Vidéo</span>
                      </button>
                    </div>

                    {/* Lessons list */}
                    <div className="space-y-2 pl-2 sm:pl-4">
                      {mod.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-2xs"
                        >
                          <div className="flex items-start gap-3">
                            <Video className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-2">
                                <span>{lesson.title}</span>
                                {lesson.isFreePreview && (
                                  <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                                    APERÇU GRATUIT
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Durée : <strong className="text-slate-700">{lesson.duration}</strong> • Flux Vidéo :{' '}
                                <span className="text-cyan-700 truncate max-w-xs inline-block align-bottom">{lesson.videoUrl}</span>
                              </div>
                              {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                                <div className="mt-1 text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                                  <strong>💡 Astuce Cabinet :</strong> {lesson.keyTakeaways[0]}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded font-bold uppercase">
                              {lesson.videoType}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 2: EXAMS & AUTO CERTIFICATION */}
      {studioTab === 'exams' && <StudioExamBuilder />}

      {/* TAB 3: CERTIFICATES & ATTESTATIONS DESIGNER */}
      {studioTab === 'certificates' && <StudioCertificateDesigner />}

      {/* TAB 4: GLOBAL DOCUMENTS HUB */}
      {studioTab === 'resources' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-mono">Hub Documents (PDF & Matrices Excel)</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Gérez les fichiers téléchargeables gratuitement ou accessibles uniquement aux abonnés.
              </p>
            </div>
            <button
              onClick={() => setShowAddResourceModal(true)}
              className="px-4 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 font-mono"
            >
              <FilePlus className="w-4 h-4" />
              <span>+ Ajouter Fichier PDF/Excel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div key={res.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 text-[10px] font-mono font-bold rounded uppercase">
                    {res.fileType} • {res.fileSize}
                  </span>
                  {res.isPremium && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-mono font-bold rounded">
                      PREMIUM
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{res.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{res.description}</p>

                <div className="pt-2 flex justify-end">
                  <span className="text-xs text-cyan-700 font-mono font-bold flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>Disponible au téléchargement</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: WORKSHOPS & LIVE SEMINARS */}
      {studioTab === 'workshops' && <StudioWorkshopManager />}

      {/* Modal: Quick Grant Access */}
      {showQuickGrantModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Octroyer un Accès Gratuit Express</h3>
              <button onClick={() => setShowQuickGrantModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleGrantAccessSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Adresse Email de l'Apprenant *</label>
                <input
                  type="email"
                  placeholder="etudiant@domaine.ma"
                  value={grantEmail}
                  onChange={(e) => setGrantEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Formation à Accorder *</label>
                <select
                  value={grantCourseId}
                  onChange={(e) => setGrantCourseId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickGrantModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-black shadow"
                >
                  Valider l'Accès Express
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Course */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Créer une Nouvelle Formation Vidéo</h3>
              <button onClick={() => setShowCreateCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Titre de la Formation *</label>
                <input
                  type="text"
                  placeholder="ex: Masterclass Normes IFRS 2026"
                  value={courseFormTitle}
                  onChange={(e) => setCourseFormTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Sous-titre / Accroche</label>
                <input
                  type="text"
                  placeholder="ex: Maîtrisez les écritures complexes IFRS 15 et 16"
                  value={courseFormSubtitle}
                  onChange={(e) => setCourseFormSubtitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Catégorie</label>
                  <select
                    value={courseFormCategory}
                    onChange={(e) => setCourseFormCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  >
                    <option value="Comptabilité">Comptabilité</option>
                    <option value="Fiscalité">Fiscalité</option>
                    <option value="Finance">Finance</option>
                    <option value="Audit">Audit</option>
                    <option value="Logiciels Comptables">Logiciels Comptables</option>
                    <option value="Normes IFRS">Normes IFRS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Niveau</label>
                  <select
                    value={courseFormLevel}
                    onChange={(e) => setCourseFormLevel(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  >
                    <option value="Tous Niveaux">Tous Niveaux</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Prix (DH MAD)</label>
                <input
                  type="number"
                  value={courseFormPrice}
                  onChange={(e) => setCourseFormPrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-black shadow"
                >
                  Créer la Formation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Module */}
      {showAddModuleModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Ajouter un Module Pédagogique</h3>
              <button onClick={() => setShowAddModuleModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddModule} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Titre du Module *</label>
                <input
                  type="text"
                  placeholder="ex: Module 2 : Retraitements Fiscaux"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description Synthétique</label>
                <textarea
                  rows={2}
                  placeholder="Objectifs pratiques du module..."
                  value={moduleDesc}
                  onChange={(e) => setModuleDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModuleModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-black shadow"
                >
                  Ajouter le Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Lesson */}
      {showAddLessonModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Ajouter une Leçon Vidéo</h3>
              <button onClick={() => setShowAddLessonModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLesson} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Titre de la Leçon Vidéo *</label>
                <input
                  type="text"
                  placeholder="ex: 2.1 Calcul de la Cotisation Minimale"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Durée (ex: 35 min)</label>
                  <input
                    type="text"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Source Vidéo</label>
                  <select
                    value={lessonVideoType}
                    onChange={(e) => setLessonVideoType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  >
                    <option value="mp4">Fichier MP4 / HLS</option>
                    <option value="youtube">YouTube Embed</option>
                    <option value="vimeo">Vimeo Pro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">URL Flux Vidéo *</label>
                <input
                  type="text"
                  placeholder="https://commondatastorage.googleapis.com/..."
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-cyan-800 focus:outline-none font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Astuce & Point Clé du Cabinet (Conseil)</label>
                <input
                  type="text"
                  placeholder="ex: Toujours réintégrer les amendes et pénalités fiscales."
                  value={lessonKeyAstuce}
                  onChange={(e) => setLessonKeyAstuce(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-black shadow"
                >
                  Ajouter la Leçon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Global Resource */}
      {showAddResourceModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Ajouter un Document Téléchargeable</h3>
              <button onClick={() => setShowAddResourceModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Titre du Document *</label>
                <input
                  type="text"
                  placeholder="ex: Matrice Automatisée Calcul IS 2026.xlsx"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Type de Fichier</label>
                  <select
                    value={resFileType}
                    onChange={(e) => setResFileType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  >
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="pdf">PDF (.pdf)</option>
                    <option value="word">Word (.docx)</option>
                    <option value="zip">Archive (.zip)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Taille (ex: 4.5 MB)</label>
                  <input
                    type="text"
                    value={resFileSize}
                    onChange={(e) => setResFileSize(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description / Contenu du Fichier</label>
                <textarea
                  rows={2}
                  placeholder="Fichier automatisé avec formules de calcul..."
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-700 text-white rounded-xl font-black shadow"
                >
                  Ajouter au Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
