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

export interface Certificate {
  id: string;
  certificateCode: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  scorePercent: number;
  instructorName: string;
  verificationUrl: string;
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
