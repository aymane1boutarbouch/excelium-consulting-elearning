import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Course, CourseModule, Lesson, DownloadableResource } from '../types';
import {
  ShieldAlert,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  PlusCircle,
  Trash2,
  Edit3,
  ShieldCheck,
  Video,
  FileSpreadsheet,
  FolderPlus,
  LogOut,
  Layers,
  UserPlus,
  FilePlus,
  Zap,
  X,
  Lock,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    orders,
    securityLogs,
    formatPrice,
    logoutAdmin,
    resources,
    addResource,
    showToast,
    enrollInCourse,
  } = useApp();

  const [adminTab, setAdminTab] = useState<'overview' | 'courses' | 'builder' | 'students' | 'resources' | 'logs'>('builder');
  const [selectedCourseIdForEdit, setSelectedCourseIdForEdit] = useState<string>(courses[0]?.id || '');
  
  const selectedCourseForEdit = courses.find((c) => c.id === selectedCourseIdForEdit) || courses[0] || null;

  // Modals visibility
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [showManualGrantModal, setShowManualGrantModal] = useState(false);

  // Form State: Create / Edit Course
  const [courseFormTitle, setCourseFormTitle] = useState('');
  const [courseFormSubtitle, setCourseFormSubtitle] = useState('');
  const [courseFormCategory, setCourseFormCategory] = useState<'Comptabilité' | 'Fiscalité' | 'Finance' | 'Audit' | 'Logiciels Comptables' | 'Normes IFRS'>('Comptabilité');
  const [courseFormLevel, setCourseFormLevel] = useState<'Débutant' | 'Intermédiaire' | 'Expert' | 'Tous Niveaux'>('Intermédiaire');
  const [courseFormPrice, setCourseFormPrice] = useState('1990');
  const [courseFormInstructor, setCourseFormInstructor] = useState('Cabinet Excelium Consulting');
  const [courseFormImage, setCourseFormImage] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80');
  const [courseFormDesc, setCourseFormDesc] = useState('');

  // Form State: Add Module
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');

  // Form State: Add Lesson
  const [targetModuleId, setTargetModuleId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('35 min');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [lessonVideoType, setLessonVideoType] = useState<'mp4' | 'youtube'>('mp4');
  const [uploadedVideoFileName, setUploadedVideoFileName] = useState<string | null>(null);
  const [lessonDesc, setLessonDesc] = useState('');
  const [attachResTitle, setAttachResTitle] = useState('');
  const [attachResType, setAttachResType] = useState<'pdf' | 'excel'>('excel');

  // Form State: Global Resource Hub
  const [resHubTitle, setResHubTitle] = useState('');
  const [resHubType, setResHubType] = useState<'pdf' | 'excel'>('excel');
  const [resHubDesc, setResHubDesc] = useState('');

  // Form State: Manual Grant Access
  const [grantEmail, setGrantEmail] = useState('');
  const [grantCourseId, setGrantCourseId] = useState(courses[0]?.id || '');

  const totalRevenue = orders.reduce((sum, o) => sum + o.amountMAD, 0);

  // Open Edit Course Modal
  const handleOpenEditCourse = (course: Course) => {
    setCourseFormTitle(course.title);
    setCourseFormSubtitle(course.subtitle);
    setCourseFormCategory(course.category);
    setCourseFormLevel(course.level);
    setCourseFormPrice(course.priceMAD.toString());
    setCourseFormInstructor(course.instructorName);
    setCourseFormImage(course.imageUrl);
    setCourseFormDesc(course.description);
    setShowEditCourseModal(true);
  };

  // Submit Edit Course
  const handleSaveEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForEdit) return;

    const updated: Course = {
      ...selectedCourseForEdit,
      title: courseFormTitle,
      subtitle: courseFormSubtitle,
      category: courseFormCategory,
      level: courseFormLevel,
      priceMAD: parseFloat(courseFormPrice) || 0,
      isFree: parseFloat(courseFormPrice) === 0,
      instructorName: courseFormInstructor,
      imageUrl: courseFormImage,
      description: courseFormDesc,
    };

    updateCourse(updated);
    setShowEditCourseModal(false);
  };

  // Create New Course
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
      imageUrl: courseFormImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: courseFormDesc || 'Formation professionnelle complète avec cas pratiques réels sur Excel et logiciels comptables.',
      learningObjectives: [
        'Maîtriser les principes comptables et fiscaux marocains 2026.',
        'Appliquer les méthodes de calcul et d\'enregistrement sur cas réels.',
      ],
      targetAudience: ['Comptables, DAF, auditeurs et étudiants en gestion.'],
      prerequisites: ['Notions élémentaires en comptabilité.'],
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'Module 1 : Introduction & Pratique',
          description: 'Présentation des fondamentaux et méthodologie du cabinet.',
          lessons: [
            {
              id: `lesson-${Date.now()}`,
              moduleId: `mod-${Date.now()}`,
              title: '1.1 Démonstration & Introduction au Cours',
              duration: '25 min',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              videoType: 'mp4',
              description: 'Explication détaillée du programme et mise en situation.',
              keyTakeaways: ['Conserver l historique des pièces justificatives.', 'Vérifier la conformité fiscale.'],
              resources: [
                {
                  id: `res-${Date.now()}`,
                  title: 'Guide d application PDF Cabinet Excelium',
                  fileType: 'pdf',
                  fileSize: '2.4 MB',
                  downloadUrl: '#download',
                  description: 'Support de cours téléchargeable.',
                  isPremium: true,
                },
              ],
              isFreePreview: true,
            },
          ],
        },
      ],
    };

    addCourse(newCourseObj);
    setSelectedCourseIdForEdit(newCourseObj.id);
    setShowCreateCourseModal(false);
    setCourseFormTitle('');
    setCourseFormSubtitle('');
    setCourseFormDesc('');
  };

  // Quick 1-Click Template Course Generator
  const handleGenerateTemplateCourse = () => {
    const templateCourse: Course = {
      id: `course-template-${Date.now()}`,
      title: 'Sage Saari 100c Paie & Gestion Sociale 2026 (Cas Réel)',
      subtitle: 'Configuration complète, bulletins de paie, déclarations CNSS et télé-déclaration Damancom.',
      category: 'Logiciels Comptables',
      level: 'Tous Niveaux',
      priceMAD: 2490,
      originalPriceMAD: 3500,
      isFree: false,
      rating: 4.9,
      ratingCount: 14,
      durationHours: 18,
      totalLessons: 6,
      instructorName: 'Cabinet Excelium Consulting',
      instructorTitle: 'Consultant Certifié Sage & Expert-Comptable',
      instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'Apprenez à paramétrer le logiciel Sage Paie 100c de A à Z selon le barème IR Marocain 2026. Générez les fiches de paie et fichiers télé-déclaratifs.',
      learningObjectives: [
        'Créer le fichier de paie et les constantes de salaire.',
        'Calculer les cotisations CNSS, AMO, CIMR et l IR brut/net.',
        'Télé-déclarer sur la plateforme Damancom sans aucune erreur.',
      ],
      targetAudience: ['Responsables RH, Gestionnaires de Paie, Comptables & Auditeurs.'],
      prerequisites: ['Bases en droit du travail et calcul des salaires.'],
      modules: [
        {
          id: `mod-sage-1`,
          title: 'Module 1 : Initialisation du Fichier de Paie Sage 100c',
          description: 'Paramétrage de la société, établissements et profils de cotisations.',
          lessons: [
            {
              id: `lesson-sage-11`,
              moduleId: `mod-sage-1`,
              title: '1.1 Création du fichier et création de la fiche employé',
              duration: '35 min',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              videoType: 'mp4',
              description: 'Définition des éléments d identification, état civil et situation familiale.',
              keyTakeaways: ['Bien saisir le numéro d immatriculation CNSS.', 'Sélectionner le profil de paie adéquat.'],
              resources: [
                {
                  id: `res-sage-1`,
                  title: 'Matrice Calculatrice Paie Excel 2026.xlsx',
                  fileType: 'excel',
                  fileSize: '4.8 MB',
                  downloadUrl: '#download',
                  description: 'Fichier Excel de contrôle automatique.',
                  isPremium: true,
                },
              ],
              isFreePreview: true,
            },
            {
              id: `lesson-sage-12`,
              moduleId: `mod-sage-1`,
              title: '1.2 Paramétrage des Rubriques de Salaire & Primes',
              duration: '40 min',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              videoType: 'mp4',
              description: 'Création des primes imposables et exonérées selon la législation fiscale.',
              keyTakeaways: ['Les primes de transport ont un plafond d exonération de 500 DH/mois.'],
              resources: [],
              isFreePreview: false,
            },
          ],
        },
        {
          id: `mod-sage-2`,
          title: 'Module 2 : Calcul des Bulletins & Clôture Mensuelle',
          description: 'Saisie des variables, calcul de l IR net et génération du journal de paie.',
          lessons: [
            {
              id: `lesson-sage-21`,
              moduleId: `mod-sage-2`,
              title: '2.1 Saisie des absences, heures supplémentaires et déductions',
              duration: '45 min',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              videoType: 'mp4',
              description: 'Gestion des congés payés et calcul des majorations d heures sup.',
              keyTakeaways: ['Appliquer le barème IR révisé 2026.'],
              resources: [],
              isFreePreview: false,
            },
          ],
        },
      ],
    };

    addCourse(templateCourse);
    setSelectedCourseIdForEdit(templateCourse.id);
  };

  // Add Module
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForEdit || !moduleTitle.trim()) return;

    const newMod: CourseModule = {
      id: `mod-${Date.now()}`,
      title: moduleTitle,
      description: moduleDesc || 'Contenu et exercices du module.',
      lessons: [],
    };

    const updatedCourse: Course = {
      ...selectedCourseForEdit,
      modules: [...selectedCourseForEdit.modules, newMod],
    };

    updateCourse(updatedCourse);
    setShowAddModuleModal(false);
    setModuleTitle('');
    setModuleDesc('');
  };

  // Delete Module
  const handleDeleteModule = (moduleId: string) => {
    if (!selectedCourseForEdit) return;
    const updatedModules = selectedCourseForEdit.modules.filter((m) => m.id !== moduleId);
    const updatedCourse: Course = {
      ...selectedCourseForEdit,
      modules: updatedModules,
      totalLessons: updatedModules.flatMap((m) => m.lessons).length,
    };
    updateCourse(updatedCourse);
  };

  // Add Lesson
  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForEdit || !targetModuleId || !lessonTitle.trim()) return;

    const resourcesList: DownloadableResource[] = [];
    if (attachResTitle.trim()) {
      resourcesList.push({
        id: `res-${Date.now()}`,
        title: attachResTitle,
        fileType: attachResType,
        fileSize: '3.5 MB',
        downloadUrl: '#download',
        description: 'Fichier joint à la leçon.',
        isPremium: true,
      });
    }

    const newLess: Lesson = {
      id: `lesson-${Date.now()}`,
      moduleId: targetModuleId,
      title: lessonTitle,
      duration: lessonDuration || '30 min',
      videoUrl: lessonVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      videoType: lessonVideoType,
      description: lessonDesc || 'Description de la leçon vidéo.',
      keyTakeaways: ['Vérifier la conformité des données.'],
      resources: resourcesList,
      isFreePreview: false,
    };

    const updatedModules = selectedCourseForEdit.modules.map((m) => {
      if (m.id === targetModuleId) {
        return { ...m, lessons: [...m.lessons, newLess] };
      }
      return m;
    });

    const updatedCourse: Course = {
      ...selectedCourseForEdit,
      modules: updatedModules,
      totalLessons: updatedModules.flatMap((m) => m.lessons).length,
    };

    updateCourse(updatedCourse);
    setShowAddLessonModal(false);
    setLessonTitle('');
    setLessonDesc('');
    setAttachResTitle('');
  };

  // Delete Lesson
  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    if (!selectedCourseForEdit) return;
    const updatedModules = selectedCourseForEdit.modules.map((m) => {
      if (m.id === moduleId) {
        return { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) };
      }
      return m;
    });

    const updatedCourse: Course = {
      ...selectedCourseForEdit,
      modules: updatedModules,
      totalLessons: updatedModules.flatMap((m) => m.lessons).length,
    };

    updateCourse(updatedCourse);
  };

  // Add Global Document Resource
  const handleAddGlobalResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resHubTitle.trim()) return;

    const newRes: DownloadableResource = {
      id: `res-hub-${Date.now()}`,
      title: resHubTitle,
      fileType: resHubType,
      fileSize: '3.2 MB',
      downloadUrl: '#download',
      description: resHubDesc || 'Document de travail et support officiel Cabinet Excelium.',
      isPremium: true,
    };

    addResource(newRes);
    setShowAddResourceModal(false);
    setResHubTitle('');
    setResHubDesc('');
  };

  // Grant Manual Student Access
  const handleGrantAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim() || !grantCourseId) return;

    enrollInCourse(grantCourseId, 'coupon');
    showToast('Accès Accordé !', `L'accès gratuit à la formation a été attribué à l'adresse email : ${grantEmail}`);
    setShowManualGrantModal(false);
    setGrantEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Studio Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                Studio Studio Cabinet Excelium
              </h1>
              <span className="px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold rounded uppercase">
                ESPACE PROPRIÉTAIRE PRIVÉ
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-1 font-medium">
              Plateforme d'administration sécurisée. Aucun étudiant ne peut accéder à cette page sans authentification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto">
          <button
            onClick={() => setShowCreateCourseModal(true)}
            className="flex-1 lg:flex-none px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Créer une Formation</span>
          </button>

          <button
            onClick={handleGenerateTemplateCourse}
            title="Générer un modèle de cours prêt en 1 clic"
            className="px-3.5 py-2.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-mono font-bold text-xs rounded-xl border border-amber-500/40 transition-colors flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>+ Modèle Sage Paie 1-Click</span>
          </button>

          <button
            onClick={logoutAdmin}
            title="Quitter le Studio"
            className="p-2.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white rounded-xl border border-rose-500/40 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>REVENUS CUMULÉS</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{formatPrice(totalRevenue)}</div>
          <div className="text-[10px] text-slate-500 font-medium">{orders.length} transactions enregistrées</div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>FORMATIONS EN LIGNE</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{courses.length}</div>
          <div className="text-[10px] text-slate-500 font-medium">Formations au catalogue</div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>DOCUMENTS HUB</span>
            <FileSpreadsheet className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-cyan-700">{resources.length}</div>
          <div className="text-[10px] text-slate-500 font-medium">Fichiers Excel & PDF</div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>SÉCURITÉ DRM</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">100% Actif</div>
          <div className="text-[10px] text-slate-500 font-medium">Anti-capture & Anti-fuite</div>
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold font-mono overflow-x-auto pb-1">
        <button
          onClick={() => setAdminTab('builder')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            adminTab === 'builder'
              ? 'border-emerald-600 text-emerald-700 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-600" />
          <span>Éditeur de Programme & Leçons (Studio)</span>
        </button>

        <button
          onClick={() => setAdminTab('courses')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            adminTab === 'courses'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Gestion des Formations ({courses.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('students')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            adminTab === 'students'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-cyan-600" />
          <span>Inscriptions & Apprenants</span>
        </button>

        <button
          onClick={() => setAdminTab('resources')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            adminTab === 'resources'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FilePlus className="w-4 h-4 text-teal-600" />
          <span>Hub Documents PDF/Excel</span>
        </button>

        <button
          onClick={() => setAdminTab('overview')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            adminTab === 'overview'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Vue d'Ensemble Financière</span>
        </button>

        <button
          onClick={() => setAdminTab('logs')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            adminTab === 'logs'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Logs DRM ({securityLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: STUDIO BUILDER (Visual Curriculum & Video Lesson Manager) */}
      {adminTab === 'builder' && (
        <div className="space-y-6">
          {/* Course Selector Toolbar */}
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 font-mono text-[10px] font-bold rounded uppercase">
                  Studio Pédagogique Cabinet Excelium
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Sélectionnez la Formation à Structurer :</h3>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedCourseIdForEdit}
                  onChange={(e) => setSelectedCourseIdForEdit(e.target.value)}
                  className="p-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl font-bold text-xs focus:outline-none focus:border-emerald-500 font-mono max-w-md"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.modules.length} Modules)
                    </option>
                  ))}
                </select>

                {selectedCourseForEdit && (
                  <button
                    onClick={() => handleOpenEditCourse(selectedCourseForEdit)}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-600" />
                    <span>Modifier Infos</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Course Curriculum Editor */}
          {selectedCourseForEdit ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded">
                      {selectedCourseForEdit.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Prix : {formatPrice(selectedCourseForEdit.priceMAD)}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1">{selectedCourseForEdit.title}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Formateur : {selectedCourseForEdit.instructorName} • {selectedCourseForEdit.modules.length} Modules • {selectedCourseForEdit.totalLessons} Leçons Vidéo
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddModuleModal(true)}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-2"
                  >
                    <FolderPlus className="w-4 h-4 text-emerald-400" />
                    <span>+ Nouveau Module</span>
                  </button>
                </div>
              </div>

              {/* Modules Outline */}
              <div className="space-y-6">
                {selectedCourseForEdit.modules.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl space-y-3">
                    <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-600 font-medium">Aucun module dans cette formation pour l instant.</p>
                    <button
                      onClick={() => setShowAddModuleModal(true)}
                      className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                    >
                      Ajouter le 1er Module
                    </button>
                  </div>
                ) : (
                  selectedCourseForEdit.modules.map((mod, modIdx) => (
                    <div key={mod.id} className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <span className="text-emerald-700 font-mono">Module 0{modIdx + 1} :</span>
                            {mod.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setTargetModuleId(mod.id);
                              setShowAddLessonModal(true);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Ajouter Leçon Vidéo</span>
                          </button>

                          <button
                            onClick={() => handleDeleteModule(mod.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                            title="Supprimer ce module"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Lessons list inside module */}
                      <div className="space-y-2 pl-2 sm:pl-4">
                        {mod.lessons.length === 0 ? (
                          <div className="p-3 text-slate-400 text-xs font-mono italic">
                            Aucune leçon vidéo ajoutée dans ce module. Cliquez sur "+ Ajouter Leçon Vidéo".
                          </div>
                        ) : (
                          mod.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-2xs"
                            >
                              <div className="flex items-start gap-3">
                                <Video className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900">{lesson.title}</span>
                                    {lesson.isFreePreview && (
                                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                                        APERÇU GRATUIT
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                                    Durée : <strong className="text-slate-700">{lesson.duration}</strong> • Video MP4/YouTube :{' '}
                                    <span className="text-cyan-700 truncate max-w-xs inline-block align-bottom">{lesson.videoUrl}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center">
                                {lesson.resources.length > 0 && (
                                  <span className="px-2 py-0.5 bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] rounded font-bold">
                                    {lesson.resources.length} Fichier Excel/PDF
                                  </span>
                                )}
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded font-bold uppercase">
                                  {lesson.videoType}
                                </span>
                                <button
                                  onClick={() => handleDeleteLesson(mod.id, lesson.id)}
                                  className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                                  title="Supprimer la leçon"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-4">
              <p className="text-slate-600 font-medium">Veuillez sélectionner une formation pour l'éditer.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COURSE CATALOG MANAGEMENT */}
      {adminTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 font-mono">Toutes les Formations du Cabinet ({courses.length})</h3>
            <button
              onClick={() => setShowCreateCourseModal(true)}
              className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Créer une Formation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100">
                    <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 border border-slate-200 rounded text-[10px] font-mono font-bold text-emerald-800">
                      {c.category}
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-slate-900/90 text-amber-400 font-mono font-bold text-[10px] rounded">
                      {formatPrice(c.priceMAD)}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">{c.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{c.subtitle}</p>
                  <div className="text-xs text-slate-500 font-mono">
                    {c.modules.length} Modules • {c.totalLessons} Leçons • Formateur : <strong className="text-slate-800">{c.instructorName}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedCourseIdForEdit(c.id);
                      setAdminTab('builder');
                    }}
                    className="flex-1 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-600 hover:text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Éditer le Programme</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditCourse(c)}
                    className="p-2 text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl"
                    title="Modifier les infos du cours"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteCourse(c.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl"
                    title="Supprimer la formation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENTS & ENROLLMENT MANAGEMENT */}
      {adminTab === 'students' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-mono">Gestion des Inscriptions & Apprenants</h3>
              <p className="text-xs text-slate-500">Accordez l'accès manuel ou consultez les ventes d'accès aux formations.</p>
            </div>

            <button
              onClick={() => setShowManualGrantModal(true)}
              className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Accorder un Accès Manuel</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-xs font-mono shadow-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-4">Réf Transaction</th>
                  <th className="p-4">Apprenant</th>
                  <th className="p-4">Formation Accédée</th>
                  <th className="p-4">Montant</th>
                  <th className="p-4">Mode Paiement</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Statut Accès</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{o.transactionId}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{o.userName}</div>
                      <div className="text-[10px] text-slate-500">{o.userEmail}</div>
                    </td>
                    <td className="p-4 text-slate-800 font-bold max-w-xs truncate">{o.courseTitle}</td>
                    <td className="p-4 text-emerald-700 font-bold">{formatPrice(o.amountMAD)}</td>
                    <td className="p-4 uppercase text-slate-600 font-semibold">{o.paymentMethod.replace('_', ' ')}</td>
                    <td className="p-4 text-slate-500">{o.date}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                        PAYÉ & ACTIF
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GLOBAL RESOURCE HUB PUBLISHER */}
      {adminTab === 'resources' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-mono">Hub de Documents & Calculatrices Excel</h3>
              <p className="text-xs text-slate-500">Téléversez les fichiers officiels mis à disposition des étudiants.</p>
            </div>

            <button
              onClick={() => setShowAddResourceModal(true)}
              className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
            >
              <FilePlus className="w-4 h-4 text-emerald-400" />
              <span>Ajouter un Fichier PDF / Excel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res) => (
              <div key={res.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-mono font-bold rounded uppercase">
                    {res.fileType} ({res.fileSize})
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs">{res.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{res.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FINANCIAL OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Rapport d'Inscriptions & Croissance 2026</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono font-medium">Données en temps réel</span>
            </div>

            <div className="h-64 w-full pt-4">
              <svg className="w-full h-full text-emerald-600 overflow-visible" viewBox="0 0 600 200">
                <defs>
                  <linearGradient id="chartGradStudio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 160 Q 100 120, 200 140 T 400 60 T 600 30 L 600 200 L 0 200 Z"
                  fill="url(#chartGradStudio)"
                />
                <path
                  d="M 0 160 Q 100 120, 200 140 T 400 60 T 600 30"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                />
                <circle cx="200" cy="140" r="4" fill="#059669" />
                <circle cx="400" cy="60" r="4" fill="#059669" />
                <circle cx="600" cy="30" r="6" fill="#d97706" />
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-500 font-medium">
              <span>Janvier</span>
              <span>Mars</span>
              <span>Juin</span>
              <span>Septembre</span>
              <span>Octobre 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DRM AUDIT LOGS */}
      {adminTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden text-xs font-mono shadow-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-4">Horodatage</th>
                <th className="p-4">Utilisateur</th>
                <th className="p-4">Adresse IP</th>
                <th className="p-4">Événement DRM</th>
                <th className="p-4">Détails Audit</th>
                <th className="p-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {securityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-4 text-slate-500">{log.timestamp}</td>
                  <td className="p-4 font-bold text-slate-900">{log.userEmail}</td>
                  <td className="p-4 text-cyan-800 font-bold">{log.ipAddress}</td>
                  <td className="p-4 uppercase text-slate-700 font-semibold">{log.action}</td>
                  <td className="p-4 text-slate-700">{log.details}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        log.status === 'succès'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL 1: Create New Course */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-mono">Créer une Nouvelle Formation</h3>
              <button onClick={() => setShowCreateCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Titre de la Formation :</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Masterclass TVA & SIMPL-TVA Maroc 2026"
                  value={courseFormTitle}
                  onChange={(e) => setCourseFormTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Sous-titre / Résumé Court :</label>
                <input
                  type="text"
                  placeholder="ex: Gérer les déclarations mensuelles, pro-rata et régularisations."
                  value={courseFormSubtitle}
                  onChange={(e) => setCourseFormSubtitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">Catégorie :</label>
                  <select
                    value={courseFormCategory}
                    onChange={(e) => setCourseFormCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
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
                  <label className="block text-slate-700 font-mono mb-1 font-bold">Prix (DH MAD) :</label>
                  <input
                    type="number"
                    value={courseFormPrice}
                    onChange={(e) => setCourseFormPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Nom du Formateur :</label>
                <input
                  type="text"
                  value={courseFormInstructor}
                  onChange={(e) => setCourseFormInstructor(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Description Détaillée :</label>
                <textarea
                  rows={3}
                  value={courseFormDesc}
                  onChange={(e) => setCourseFormDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Publier la Formation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Course */}
      {showEditCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-mono">Modifier la Formation</h3>
              <button onClick={() => setShowEditCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCourse} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Titre de la Formation :</label>
                <input
                  type="text"
                  required
                  value={courseFormTitle}
                  onChange={(e) => setCourseFormTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Sous-titre :</label>
                <input
                  type="text"
                  value={courseFormSubtitle}
                  onChange={(e) => setCourseFormSubtitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">Catégorie :</label>
                  <select
                    value={courseFormCategory}
                    onChange={(e) => setCourseFormCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
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
                  <label className="block text-slate-700 font-mono mb-1 font-bold">Prix (DH MAD) :</label>
                  <input
                    type="number"
                    value={courseFormPrice}
                    onChange={(e) => setCourseFormPrice(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Description Détaillée :</label>
                <textarea
                  rows={4}
                  value={courseFormDesc}
                  onChange={(e) => setCourseFormDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditCourseModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Enregistrer Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Module */}
      {showAddModuleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-6 animate-in fade-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-mono">Ajouter un Module de Formation</h3>
              <button onClick={() => setShowAddModuleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddModule} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Titre du Module :</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Module 2 : Déclarations SIMPL-TVA & Pratique"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Description du Module :</label>
                <textarea
                  rows={3}
                  placeholder="Expliquer les objectifs du module..."
                  value={moduleDesc}
                  onChange={(e) => setModuleDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModuleModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl shadow"
                >
                  Ajouter le Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Video Lesson & Resource */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full space-y-6 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-mono">Ajouter une Leçon Vidéo au Module</h3>
              <button onClick={() => setShowAddLessonModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLesson} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Titre de la Leçon :</label>
                <input
                  type="text"
                  required
                  placeholder="ex: 2.1 Calcul du Pro-Rata et Déductions"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">Durée estimée :</label>
                  <input
                    type="text"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">Type de Vidéo :</label>
                  <select
                    value={lessonVideoType}
                    onChange={(e) => setLessonVideoType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                  >
                    <option value="mp4">Fichier MP4 Direct</option>
                    <option value="youtube">Intégration YouTube / Vimeo</option>
                  </select>
                </div>
              </div>

              {/* Direct Local Video File Uploader */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <label className="block text-slate-900 font-mono text-xs font-bold flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-emerald-700" />
                  <span>Téléverser un Fichier Vidéo Directement depuis votre PC :</span>
                </label>
                
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const blobUrl = URL.createObjectURL(file);
                      setLessonVideoUrl(blobUrl);
                      setLessonVideoType('mp4');
                      setUploadedVideoFileName(`${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
                      showToast('Vidéo Chargée !', `Fichier vidéo local "${file.name}" prêt à être utilisé.`);
                    }
                  }}
                  className="w-full text-xs font-mono text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                />

                {uploadedVideoFileName && (
                  <div className="text-[11px] font-mono text-emerald-800 font-bold bg-white p-2 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Vidéo Chargée : {uploadedVideoFileName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Ou Saisir une URL Web Vidéo (MP4 / YouTube / Vimeo) :</label>
                <input
                  type="text"
                  required
                  placeholder="https://commondatastorage.googleapis.com/.../video.mp4"
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Description de la leçon :</label>
                <textarea
                  rows={3}
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              {/* Attach File Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-600" />
                  <span>Attacher un Fichier Excel / PDF à la Leçon :</span>
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="ex: Matrice Pro-Rata TVA.xlsx"
                    value={attachResTitle}
                    onChange={(e) => setAttachResTitle(e.target.value)}
                    className="col-span-2 p-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                  />

                  <select
                    value={attachResType}
                    onChange={(e) => setAttachResType(e.target.value as any)}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono"
                  >
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="pdf">PDF (.pdf)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Ajouter la Leçon Vidéo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Add Global Resource */}
      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-6 animate-in fade-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-mono">Ajouter un Fichier au Hub</h3>
              <button onClick={() => setShowAddResourceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGlobalResource} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Nom du Document :</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Calculatrice Impôt Sociétés 2026.xlsx"
                  value={resHubTitle}
                  onChange={(e) => setResHubTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Type de Fichier :</label>
                <select
                  value={resHubType}
                  onChange={(e) => setResHubType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                >
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="pdf">PDF (.pdf)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Description :</label>
                <textarea
                  rows={3}
                  value={resHubDesc}
                  onChange={(e) => setResHubDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl shadow"
                >
                  Publier dans le Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: Manual Grant Access */}
      {showManualGrantModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-6 animate-in fade-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 font-mono">Accorder un Accès Manuel à un Apprenant</h3>
              <button onClick={() => setShowManualGrantModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGrantAccess} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Email de l'Apprenant :</label>
                <input
                  type="email"
                  required
                  placeholder="etudiant@domaine.ma"
                  value={grantEmail}
                  onChange={(e) => setGrantEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold">Sélectionner la Formation :</label>
                <select
                  value={grantCourseId}
                  onChange={(e) => setGrantCourseId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({formatPrice(c.priceMAD)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowManualGrantModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Accorder l'Accès
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
