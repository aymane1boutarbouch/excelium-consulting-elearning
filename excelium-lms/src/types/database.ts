export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'trainer' | 'student'
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'revoked'
export type PaymentStatus = 'pending' | 'approved' | 'rejected'
export type LessonType = 'video' | 'text' | 'quiz' | 'live' | 'resource'
export type QuestionType = 'mcq' | 'multiple_answer' | 'true_false' | 'open'
export type CertificateType = 'certificate' | 'attestation_formation' | 'attestation_stage'
export type SessionStatus = 'scheduled' | 'live' | 'ended' | 'cancelled'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          city: string | null
          country: string
          bio: string | null
          role: UserRole
          cin: string | null
          xp_points: number
          level: number
          streak_days: number
          last_active_at: string
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at' | 'xp_points' | 'level' | 'streak_days'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          short_description: string | null
          thumbnail_url: string | null
          preview_video_url: string | null
          price: number
          currency: string
          duration_hours: number | null
          level: 'debutant' | 'intermediaire' | 'avance'
          language: string
          category_id: string | null
          trainer_id: string | null
          is_published: boolean
          is_featured: boolean
          is_free: boolean
          certificate_enabled: boolean
          certificate_min_score: number
          certificate_min_completion: number
          max_attempts: number
          access_duration_days: number | null
          total_enrolled: number
          total_lessons: number
          total_duration_minutes: number
          rating_avg: number
          rating_count: number
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at' | 'updated_at' | 'total_enrolled' | 'total_lessons' | 'total_duration_minutes' | 'rating_avg' | 'rating_count'>
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          display_order: number
          is_free_preview: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['modules']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['modules']['Insert']>
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          course_id: string
          title: string
          description: string | null
          type: LessonType
          video_url: string | null
          video_duration_seconds: number
          content: string | null
          display_order: number
          is_free_preview: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['lessons']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>
      }
      resources: {
        Row: {
          id: string
          lesson_id: string | null
          course_id: string | null
          title: string
          file_path: string
          file_name: string
          file_size_bytes: number | null
          file_type: string | null
          is_public: boolean
          download_count: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['resources']['Row'], 'id' | 'created_at' | 'download_count'>
        Update: Partial<Database['public']['Tables']['resources']['Insert']>
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          status: EnrollmentStatus
          enrolled_at: string
          approved_at: string | null
          approved_by: string | null
          expires_at: string | null
          revoked_at: string | null
          revoked_by: string | null
          revoke_reason: string | null
          reference_code: string
          completion_rate: number
          completed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['enrollments']['Row'], 'id' | 'enrolled_at' | 'reference_code' | 'completion_rate'>
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>
      }
      payments: {
        Row: {
          id: string
          enrollment_id: string
          student_id: string
          course_id: string
          amount: number
          currency: string
          reference_code: string
          proof_file_path: string | null
          proof_file_name: string | null
          status: PaymentStatus
          notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
      lesson_progress: {
        Row: {
          id: string
          student_id: string
          lesson_id: string
          course_id: string
          is_completed: boolean
          completed_at: string | null
          watch_position_seconds: number
          watch_duration_seconds: number
          last_watched_at: string
        }
        Insert: Omit<Database['public']['Tables']['lesson_progress']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['lesson_progress']['Insert']>
      }
      quizzes: {
        Row: {
          id: string
          course_id: string
          lesson_id: string | null
          title: string
          description: string | null
          time_limit_minutes: number | null
          passing_score: number
          max_attempts: number
          randomize_questions: boolean
          randomize_answers: boolean
          show_answers_after: boolean
          is_final_exam: boolean
          is_published: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['quizzes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['quizzes']['Insert']>
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          type: QuestionType
          question_text: string
          explanation: string | null
          points: number
          display_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['questions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['questions']['Insert']>
      }
      question_answers: {
        Row: {
          id: string
          question_id: string
          answer_text: string
          is_correct: boolean
          display_order: number
        }
        Insert: Omit<Database['public']['Tables']['question_answers']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['question_answers']['Insert']>
      }
      quiz_attempts: {
        Row: {
          id: string
          quiz_id: string
          student_id: string
          course_id: string
          score: number | null
          total_points: number
          earned_points: number
          passed: boolean
          started_at: string
          submitted_at: string | null
          time_taken_seconds: number | null
          attempt_number: number
        }
        Insert: Omit<Database['public']['Tables']['quiz_attempts']['Row'], 'id' | 'started_at'>
        Update: Partial<Database['public']['Tables']['quiz_attempts']['Insert']>
      }
      certificates: {
        Row: {
          id: string
          student_id: string
          course_id: string | null
          type: CertificateType
          certificate_number: string
          issued_at: string
          issued_by: string | null
          is_auto_generated: boolean
          is_revoked: boolean
          revoked_at: string | null
          revoke_reason: string | null
          student_cin: string | null
          start_date: string | null
          end_date: string | null
          duration_text: string | null
          tasks_description: string | null
          supervisor_name: string | null
          supervisor_signature_url: string | null
          stamp_url: string | null
          pdf_path: string | null
          verification_url: string | null
        }
        Insert: Omit<Database['public']['Tables']['certificates']['Row'], 'id' | 'certificate_number' | 'issued_at'>
        Update: Partial<Database['public']['Tables']['certificates']['Insert']>
      }
      live_sessions: {
        Row: {
          id: string
          course_id: string | null
          title: string
          description: string | null
          trainer_id: string | null
          scheduled_at: string
          duration_minutes: number
          jitsi_room_name: string
          status: SessionStatus
          recording_url: string | null
          max_participants: number
          is_public: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['live_sessions']['Row'], 'id' | 'jitsi_room_name' | 'created_at'>
        Update: Partial<Database['public']['Tables']['live_sessions']['Insert']>
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          course_id: string | null
          is_published: boolean
          expires_at: string | null
          created_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['announcements']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>
      }
      settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'updated_at'>
        Update: Partial<Database['public']['Tables']['settings']['Insert']>
      }
    }
    Functions: {
      get_user_role: {
        Args: Record<string, never>
        Returns: UserRole
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_enrolled: {
        Args: { p_course_id: string }
        Returns: boolean
      }
    }
  }
}

// ── Convenience types ──────────────────────────────────────────
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Module = Database['public']['Tables']['modules']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type Resource = Database['public']['Tables']['resources']['Row']
export type Enrollment = Database['public']['Tables']['enrollments']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type LessonProgress = Database['public']['Tables']['lesson_progress']['Row']
export type Quiz = Database['public']['Tables']['quizzes']['Row']
export type Question = Database['public']['Tables']['questions']['Row']
export type QuestionAnswer = Database['public']['Tables']['question_answers']['Row']
export type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row']
export type Certificate = Database['public']['Tables']['certificates']['Row']
export type LiveSession = Database['public']['Tables']['live_sessions']['Row']
export type Announcement = Database['public']['Tables']['announcements']['Row']

// ── Extended types with joins ──────────────────────────────────
export type CourseWithCategory = Course & {
  categories: Category | null
  profiles: Profile | null
}

export type CourseWithDetails = Course & {
  categories: Category | null
  profiles: Profile | null
  modules: (Module & {
    lessons: Lesson[]
  })[]
}

export type EnrollmentWithDetails = Enrollment & {
  courses: Course | null
  profiles: Profile | null
}

export type PaymentWithDetails = Payment & {
  profiles: Profile | null
  courses: Course | null
  enrollments: Enrollment | null
}

export type QuestionWithAnswers = Question & {
  question_answers: QuestionAnswer[]
}

export type QuizWithQuestions = Quiz & {
  questions: QuestionWithAnswers[]
}
