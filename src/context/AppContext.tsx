import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  Course,
  Certificate,
  CertificateTemplate,
  LiveWorkshop,
  DownloadableResource,
  Order,
  SecurityAuditLog,
  UserRole,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_COURSES,
  GLOBAL_RESOURCES,
  MOCK_ORDERS,
  MOCK_SECURITY_LOGS,
  INITIAL_CERTIFICATE_TEMPLATES,
  INITIAL_WORKSHOPS,
} from '../data/mockData';

export type ViewMode =
  | 'home'
  | 'courses'
  | 'course-detail'
  | 'classroom'
  | 'exam'
  | 'certificate'
  | 'resources'
  | 'dashboard'
  | 'admin'
  | 'checkout'
  | 'studio';

interface ToastInfo {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;
  selectedCertificate: Certificate | null;
  setSelectedCertificate: (cert: Certificate | null) => void;
  
  // User & Auth
  currentUser: User;
  setUserRole: (role: UserRole) => void;
  updateUserProfile: (data: Partial<User>) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  logoutAdmin: () => void;
  
  // Courses
  courses: Course[];
  addCourse: (newCourse: Course) => void;
  updateCourse: (updatedCourse: Course) => void;
  deleteCourse: (courseId: string) => void;

  // Studio: Certificates & Attestations
  certificateTemplates: CertificateTemplate[];
  updateCertificateTemplate: (template: CertificateTemplate) => void;
  issueCustomCertificate: (cert: Partial<Certificate> & { userName: string; courseTitle: string }) => Certificate;

  // Studio: Workshops & Live Seminars
  workshops: LiveWorkshop[];
  addWorkshop: (workshop: LiveWorkshop) => void;
  updateWorkshop: (workshop: LiveWorkshop) => void;
  markAttendeePresence: (workshopId: string, attendeeId: string, attended: boolean) => void;
  issueWorkshopAttestation: (workshopId: string, attendeeId: string) => Certificate | null;
  
  // Enrollment & Progress
  enrollInCourse: (courseId: string, paymentMethod: 'carte_bancaire' | 'virement' | 'cash' | 'coupon') => boolean;
  markLessonCompleted: (lessonId: string) => void;
  saveLessonNote: (lessonId: string, note: string) => void;
  submitExamResult: (courseId: string, scorePercent: number) => Certificate | null;
  isCourseEnrolled: (courseId: string) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  getCourseProgressPercent: (courseId: string) => number;
  
  // Resources & Orders
  resources: DownloadableResource[];
  addResource: (res: DownloadableResource) => void;
  orders: Order[];
  securityLogs: SecurityAuditLog[];
  logSecurityAction: (action: SecurityAuditLog['action'], details: string, status?: SecurityAuditLog['status']) => void;
  
  // UI Helpers
  currency: 'MAD' | 'EUR';
  setCurrency: (c: 'MAD' | 'EUR') => void;
  formatPrice: (priceMAD: number) => string;
  toast: ToastInfo | null;
  showToast: (title: string, message: string, type?: ToastInfo['type']) => void;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Load state from localStorage if available, or fall back to mock data
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('excelium_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('excelium_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [certificateTemplates, setCertificateTemplates] = useState<CertificateTemplate[]>(() => {
    const saved = localStorage.getItem('excelium_templates');
    return saved ? JSON.parse(saved) : INITIAL_CERTIFICATE_TEMPLATES;
  });

  const [workshops, setWorkshops] = useState<LiveWorkshop[]>(() => {
    const saved = localStorage.getItem('excelium_workshops');
    return saved ? JSON.parse(saved) : INITIAL_WORKSHOPS;
  });

  const [resources, setResources] = useState<DownloadableResource[]>(GLOBAL_RESOURCES);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>(MOCK_SECURITY_LOGS);
  
  const [currency, setCurrency] = useState<'MAD' | 'EUR'>('MAD');
  const [toast, setToast] = useState<ToastInfo | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('excelium_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('excelium_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('excelium_templates', JSON.stringify(certificateTemplates));
  }, [certificateTemplates]);

  useEffect(() => {
    localStorage.setItem('excelium_workshops', JSON.stringify(workshops));
  }, [workshops]);

  const showToast = (title: string, message: string, type: ToastInfo['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2);
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const setUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setUserRole('student');
    setCurrentView('home');
    showToast('Déconnexion Admin', 'Vous avez quitté l\'Espace Administration.', 'info');
  };

  const updateUserProfile = (data: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...data }));
    showToast('Profil Mis à Jour', 'Vos informations ont été modifiées avec succès.');
  };

  const addCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    logSecurityAction('video_stream', `Création d'une nouvelle formation : ${newCourse.title}`);
    showToast('Formation Créée', `La formation "${newCourse.title}" a été ajoutée avec succès.`);
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    showToast('Formation Modifiée', `Les modifications de "${updatedCourse.title}" ont été enregistrées.`);
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    showToast('Formation Supprimée', 'La formation a été retirée du catalogue.', 'warning');
  };

  const updateCertificateTemplate = (template: CertificateTemplate) => {
    setCertificateTemplates((prev) => prev.map((t) => (t.id === template.id ? template : t)));
    showToast('Template Modifié', `Le modèle "${template.title}" a été mis à jour avec succès.`);
  };

  const issueCustomCertificate = (data: Partial<Certificate> & { userName: string; courseTitle: string }): Certificate => {
    const certCode = data.certificateCode || `EXC-STUDIO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: Certificate = {
      id: `cert_${Math.random().toString(36).substring(2, 8)}`,
      certificateCode: certCode,
      type: data.type || 'certificate_completion',
      typeTitle: data.typeTitle || (data.type === 'attestation_presence' ? 'ATTESTATION DE PRÉSENCE & PARTICIPATION' : 'CERTIFICAT DE MAÎTRISE ET RÉUSSITE'),
      userId: data.userId || currentUser.id,
      userName: data.userName,
      recipientCompany: data.recipientCompany || 'Cabinet Externe',
      courseId: data.courseId || 'custom-studio-course',
      courseTitle: data.courseTitle,
      issueDate: data.issueDate || new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
      scorePercent: data.scorePercent || 100,
      instructorName: data.instructorName || 'M. Karim Alami (Expert-Comptable DPLE)',
      instructorTitle: data.instructorTitle || 'Associé Gérant Cabinet Excelium',
      durationHours: data.durationHours || 20,
      location: data.location || 'Casablanca, Maroc',
      sealTitle: data.sealTitle || 'EXCELIUM CONSULTING • SECTEUR FINANCIER & COMPTABLE',
      verificationUrl: `https://excelium.ma/verify/${certCode}`,
    };

    setCurrentUser((prev) => ({
      ...prev,
      certificates: [newCert, ...prev.certificates],
    }));

    showToast('Document Émis !', `L'attestation/certificat pour ${data.userName} a été généré(e) avec le code ${certCode}.`, 'success');
    return newCert;
  };

  const addWorkshop = (newWs: LiveWorkshop) => {
    setWorkshops((prev) => [newWs, ...prev]);
    showToast('Séminaire Planifié', `La session "${newWs.title}" a été ajoutée.`);
  };

  const updateWorkshop = (updatedWs: LiveWorkshop) => {
    setWorkshops((prev) => prev.map((w) => (w.id === updatedWs.id ? updatedWs : w)));
    showToast('Séminaire Mis à Jour', `La session "${updatedWs.title}" a été modifiée.`);
  };

  const markAttendeePresence = (workshopId: string, attendeeId: string, attended: boolean) => {
    setWorkshops((prev) =>
      prev.map((w) => {
        if (w.id === workshopId) {
          const updatedAttendees = w.attendees.map((att) =>
            att.id === attendeeId ? { ...att, attended } : att
          );
          return { ...w, attendees: updatedAttendees };
        }
        return w;
      })
    );
    showToast('Présence Validée', attended ? 'Participant marqué PRÉSENT (Émargé).' : 'Participant marqué ABSENT.', 'info');
  };

  const issueWorkshopAttestation = (workshopId: string, attendeeId: string): Certificate | null => {
    const ws = workshops.find((w) => w.id === workshopId);
    if (!ws) return null;
    const attendee = ws.attendees.find((a) => a.id === attendeeId);
    if (!attendee) return null;

    const certCode = `EXC-PRES-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const attestationCert = issueCustomCertificate({
      certificateCode: certCode,
      type: 'attestation_presence',
      typeTitle: 'ATTESTATION DE PRÉSENCE & PARTICIPATION',
      userName: attendee.studentName,
      recipientCompany: attendee.company || 'Entreprise Partenaire',
      courseId: ws.id,
      courseTitle: ws.title,
      issueDate: ws.date,
      scorePercent: 100,
      instructorName: ws.instructorName,
      durationHours: 8,
      location: ws.locationOrUrl,
    });

    // Update attendee record
    setWorkshops((prev) =>
      prev.map((w) => {
        if (w.id === workshopId) {
          const updatedAttendees = w.attendees.map((att) =>
            att.id === attendeeId ? { ...att, attestationIssued: true, attestationCode: certCode } : att
          );
          return { ...w, attendees: updatedAttendees };
        }
        return w;
      })
    );

    return attestationCert;
  };

  const isCourseEnrolled = (courseId: string): boolean => {
    if (currentUser.role === 'admin' && isAdminAuthenticated) return true;
    const course = courses.find((c) => c.id === courseId);
    if (course && course.isFree) return true;
    return currentUser.enrolledCourseIds.includes(courseId);
  };

  const isLessonCompleted = (lessonId: string): boolean => {
    return currentUser.completedLessonIds.includes(lessonId);
  };

  const getCourseProgressPercent = (courseId: string): number => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return 0;
    const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    if (allLessonIds.length === 0) return 0;
    const completedInCourse = allLessonIds.filter((id) => currentUser.completedLessonIds.includes(id));
    return Math.round((completedInCourse.length / allLessonIds.length) * 100);
  };

  const enrollInCourse = (courseId: string, paymentMethod: 'carte_bancaire' | 'virement' | 'cash' | 'coupon'): boolean => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return false;

    if (currentUser.enrolledCourseIds.includes(courseId)) {
      showToast('Déjà Inscrit', 'Vous possédez déjà cette formation.');
      return true;
    }

    // Add to enrolled list
    setCurrentUser((prev) => ({
      ...prev,
      enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
    }));

    // Create Order Record
    const newOrder: Order = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      courseId,
      courseTitle: course.title,
      amountMAD: course.priceMAD,
      paymentMethod,
      status: 'payé',
      transactionId: `${paymentMethod.toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setOrders((prev) => [newOrder, ...prev]);
    logSecurityAction('login', `Achat validé pour la formation "${course.title}" (${course.priceMAD} DH)`);
    showToast('Félicitations !', `Votre inscription à "${course.title}" a été confirmée. Bon apprentissage !`, 'success');
    return true;
  };

  const markLessonCompleted = (lessonId: string) => {
    if (!currentUser.completedLessonIds.includes(lessonId)) {
      setCurrentUser((prev) => ({
        ...prev,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
      }));
      showToast('Leçon Validée', 'Votre progression a été mise à jour.', 'info');
    }
  };

  const saveLessonNote = (lessonId: string, note: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      savedNotes: {
        ...prev.savedNotes,
        [lessonId]: note,
      },
    }));
    showToast('Note Enregistrée', 'Votre prise de note personnelle a été sauvegardée.');
  };

  const submitExamResult = (courseId: string, scorePercent: number): Certificate | null => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return null;

    setCurrentUser((prev) => ({
      ...prev,
      examScores: {
        ...prev.examScores,
        [course.finalExam?.id || courseId]: scorePercent,
      },
    }));

    logSecurityAction('exam_submitted', `Examen passé pour "${course.title}" - Score: ${scorePercent}%`);

    if (scorePercent >= (course.finalExam?.passingScorePercent || 80)) {
      // Create Certificate
      const certCode = `EXC-2026-${course.category.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCert: Certificate = {
        id: `cert_${Math.random().toString(36).substring(2, 8)}`,
        certificateCode: certCode,
        type: 'certificate_completion',
        typeTitle: 'CERTIFICAT DE MAÎTRISE & RÉUSSITE EXAMEN',
        userId: currentUser.id,
        userName: currentUser.name,
        courseId: course.id,
        courseTitle: course.title,
        issueDate: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
        scorePercent,
        instructorName: course.instructorName,
        verificationUrl: `https://excelium.ma/verify/${certCode}`,
      };

      // Check if user already has certificate for this course
      const existingCert = currentUser.certificates.find((c) => c.courseId === courseId);
      if (!existingCert) {
        setCurrentUser((prev) => ({
          ...prev,
          certificates: [newCert, ...prev.certificates],
        }));
      }

      showToast('Examen Réussi !', `Félicitations ! Vous avez obtenu votre Certificat Officiel avec un score de ${scorePercent}%.`, 'success');
      return existingCert || newCert;
    } else {
      showToast('Examen Non Validé', `Score obtenu : ${scorePercent}%. Le score minimum requis est de ${course.finalExam?.passingScorePercent || 80}%. Vous pouvez repasser l'examen.`, 'warning');
      return null;
    }
  };

  const addResource = (res: DownloadableResource) => {
    setResources((prev) => [res, ...prev]);
    showToast('Document Ajouté', `Le fichier "${res.title}" est maintenant disponible dans le Hub.`);
  };

  const logSecurityAction = (action: SecurityAuditLog['action'], details: string, status: SecurityAuditLog['status'] = 'succès') => {
    const newLog: SecurityAuditLog = {
      id: `log_${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userEmail: currentUser.email,
      action,
      ipAddress: '196.200.142.18',
      details,
      status,
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const formatPrice = (priceMAD: number): string => {
    if (priceMAD === 0) return 'Gratuit';
    if (currency === 'EUR') {
      const eur = Math.round(priceMAD / 10.8);
      return `${eur} €`;
    }
    return `${priceMAD.toLocaleString('fr-FR')} DH`;
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCourseId,
        setSelectedCourseId,
        selectedLessonId,
        setSelectedLessonId,
        selectedCertificate,
        setSelectedCertificate,
        currentUser,
        setUserRole,
        updateUserProfile,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        logoutAdmin,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        certificateTemplates,
        updateCertificateTemplate,
        issueCustomCertificate,
        workshops,
        addWorkshop,
        updateWorkshop,
        markAttendeePresence,
        issueWorkshopAttestation,
        enrollInCourse,
        markLessonCompleted,
        saveLessonNote,
        submitExamResult,
        isCourseEnrolled,
        isLessonCompleted,
        getCourseProgressPercent,
        resources,
        addResource,
        orders,
        securityLogs,
        logSecurityAction,
        currency,
        setCurrency,
        formatPrice,
        toast,
        showToast,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};


