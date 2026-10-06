export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  company?: string;
  phone?: string;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  savedNotes: Record<string, string>; // lessonId -> note text
  examScores: Record<string, number>; // examId -> percentage score
  certificates: Certificate[];
  createdDate: string;
}

export interface DownloadableResource {
  id: string;
  title: string;
  fileType: 'pdf' | 'excel' | 'word' | 'zip';
  fileSize: string;
  downloadUrl: string;
  description: string;
  isPremium: boolean;
}

export interface InteractiveExercise {
  id: string;
  type: 'journal_entry' | 'fill_in_blank' | 'multiple_choice' | 'matching';
  title: string;
  prompt: string;
  options?: string[];
  correctAnswerIndex?: number;
  correctAnswer?: string;
  debitAccounts?: { code: string; name: string; amountMAD: number }[];
  creditAccounts?: { code: string; name: string; amountMAD: number }[];
  correctDebitCode?: string;
  correctCreditCode?: string;
  explanation: string;
  xpPoints: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  calculationStep?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScorePercent: number;
  questions: Question[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  videoUrl: string; // YouTube, MP4 or Vimeo URL
  videoType: 'mp4' | 'youtube' | 'vimeo';
  description: string;
  keyTakeaways: string[];
  resources: DownloadableResource[];
  isFreePreview: boolean;
  quiz?: Quiz;
  exercises?: InteractiveExercise[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: 'Comptabilité' | 'Fiscalité' | 'Finance' | 'Audit' | 'Logiciels Comptables' | 'Normes IFRS';
  level: 'Débutant' | 'Intermédiaire' | 'Expert' | 'Tous Niveaux';
  priceMAD: number;
  originalPriceMAD: number;
  isFree: boolean;
  isBestseller?: boolean;
  rating: number;
  ratingCount: number;
  durationHours: number;
  totalLessons: number;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  imageUrl: string;
  previewVideoUrl: string;
  description: string;
  learningObjectives: string[];
  targetAudience: string[];
  prerequisites: string[];
  modules: CourseModule[];
  finalExam?: Quiz;
}

export type CertificateType = 'certificate_completion' | 'attestation_presence' | 'attestation_stage';

export interface Certificate {
  id: string;
  certificateCode: string;
  type: CertificateType;
  typeTitle: string; // e.g. "ATTESTATION DE PRÉSENCE & PARTICIPATION" or "CERTIFICAT DE MAÎTRISE ET RÉUSSITE"
  userId: string;
  userName: string;
  recipientCompany?: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  scorePercent: number;
  instructorName: string;
  instructorTitle?: string;
  durationHours?: number;
  location?: string;
  sealTitle?: string;
  verificationUrl: string;
}

export interface CertificateTemplate {
  id: string;
  type: CertificateType;
  title: string;
  headerText: string;
  subheadText: string;
  bodyTemplate: string;
  signatoryName: string;
  signatoryTitle: string;
  cabinetSealText: string;
  primaryColorHex: string;
  accentColorHex: string;
  showQrCode: boolean;
  showScore: boolean;
}

export interface WorkshopAttendee {
  id: string;
  studentName: string;
  studentEmail: string;
  company?: string;
  phone?: string;
  attended: boolean;
  attestationIssued: boolean;
  attestationCode?: string;
}

export interface LiveWorkshop {
  id: string;
  title: string;
  subtitle: string;
  category: 'Comptabilité' | 'Fiscalité' | 'Finance' | 'Audit' | 'Logiciels Comptables' | 'Normes IFRS';
  type: 'présentiel' | 'webinaire' | 'hybride';
  date: string;
  timeSlot: string;
  locationOrUrl: string;
  instructorName: string;
  capacity: number;
  enrolledCount: number;
  priceMAD: number;
  status: 'planifié' | 'en_cours' | 'terminé';
  attendees: WorkshopAttendee[];
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  amountMAD: number;
  paymentMethod: 'carte_bancaire' | 'virement' | 'cash' | 'coupon';
  status: 'payé' | 'en_attente' | 'échoué';
  transactionId: string;
  date: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: 'video_stream' | 'document_download' | 'exam_submitted' | 'anti_leak_triggered' | 'login';
  ipAddress: string;
  details: string;
  status: 'succès' | 'avertissement' | 'bloqué';
}

