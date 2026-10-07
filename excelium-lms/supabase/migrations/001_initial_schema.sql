-- ================================================================
-- EXCELIUM CONSULTING COMPTA LMS — Complete Database Schema
-- Run this in Supabase SQL Editor
-- ================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- ENUMS
-- ================================================================

CREATE TYPE user_role AS ENUM ('admin', 'trainer', 'student');
CREATE TYPE enrollment_status AS ENUM ('pending', 'approved', 'rejected', 'expired', 'revoked');
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE lesson_type AS ENUM ('video', 'text', 'quiz', 'live', 'resource');
CREATE TYPE question_type AS ENUM ('mcq', 'multiple_answer', 'true_false', 'open');
CREATE TYPE certificate_type AS ENUM ('certificate', 'attestation_formation', 'attestation_stage');
CREATE TYPE session_status AS ENUM ('scheduled', 'live', 'ended', 'cancelled');

-- ================================================================
-- PROFILES (extends auth.users)
-- ================================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  city TEXT,
  country TEXT DEFAULT 'Maroc',
  bio TEXT,
  role user_role NOT NULL DEFAULT 'student',
  cin TEXT,
  xp_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- CATEGORIES
-- ================================================================

CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#C9A24B',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- COURSES
-- ================================================================

CREATE TABLE courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  preview_video_url TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'MAD',
  duration_hours DECIMAL(5,1),
  level TEXT CHECK (level IN ('debutant', 'intermediaire', 'avance')) DEFAULT 'debutant',
  language TEXT DEFAULT 'fr',
  category_id UUID REFERENCES categories(id),
  trainer_id UUID REFERENCES profiles(id),
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_free BOOLEAN DEFAULT FALSE,
  certificate_enabled BOOLEAN DEFAULT TRUE,
  certificate_min_score INTEGER DEFAULT 70,
  certificate_min_completion INTEGER DEFAULT 80,
  max_attempts INTEGER DEFAULT 3,
  access_duration_days INTEGER, -- NULL = unlimited
  total_enrolled INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  total_duration_minutes INTEGER DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- MODULES (chapters within a course)
-- ================================================================

CREATE TABLE modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_free_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- LESSONS
-- ================================================================

CREATE TABLE lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type lesson_type NOT NULL DEFAULT 'video',
  video_url TEXT,         -- YouTube/Vimeo URL or Supabase storage path
  video_duration_seconds INTEGER DEFAULT 0,
  content TEXT,           -- Rich text for text lessons
  display_order INTEGER DEFAULT 0,
  is_free_preview BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- RESOURCES (downloadable files per lesson)
-- ================================================================

CREATE TABLE resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,  -- Supabase storage path
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT,
  file_type TEXT,           -- pdf, xlsx, docx, zip...
  is_public BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- LEARNING PATHS (bundles of courses)
-- ================================================================

CREATE TABLE learning_paths (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE learning_path_courses (
  learning_path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (learning_path_id, course_id)
);

-- ================================================================
-- ENROLLMENTS
-- ================================================================

CREATE TABLE enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  status enrollment_status NOT NULL DEFAULT 'pending',
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES profiles(id),
  revoke_reason TEXT,
  reference_code TEXT UNIQUE DEFAULT upper(substring(md5(random()::text), 1, 8)),
  completion_rate DECIMAL(5,2) DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, course_id)
);

-- ================================================================
-- PAYMENTS (manual bank transfer)
-- ================================================================

CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) NOT NULL,
  course_id UUID REFERENCES courses(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MAD',
  reference_code TEXT NOT NULL,
  proof_file_path TEXT,       -- Supabase storage path
  proof_file_name TEXT,
  status payment_status DEFAULT 'pending',
  notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- PROGRESS TRACKING
-- ================================================================

CREATE TABLE lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  watch_position_seconds INTEGER DEFAULT 0,
  watch_duration_seconds INTEGER DEFAULT 0,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, lesson_id)
);

-- ================================================================
-- QUIZZES & EXAMS
-- ================================================================

CREATE TABLE quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,  -- NULL = final exam
  title TEXT NOT NULL,
  description TEXT,
  time_limit_minutes INTEGER,       -- NULL = no limit
  passing_score INTEGER DEFAULT 70, -- percentage
  max_attempts INTEGER DEFAULT 3,
  randomize_questions BOOLEAN DEFAULT FALSE,
  randomize_answers BOOLEAN DEFAULT FALSE,
  show_answers_after BOOLEAN DEFAULT TRUE,
  is_final_exam BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  type question_type NOT NULL DEFAULT 'mcq',
  question_text TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE question_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) NOT NULL,
  score DECIMAL(5,2),           -- percentage
  total_points INTEGER DEFAULT 0,
  earned_points INTEGER DEFAULT 0,
  passed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  time_taken_seconds INTEGER,
  attempt_number INTEGER DEFAULT 1
);

CREATE TABLE student_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES questions(id) NOT NULL,
  selected_answer_ids UUID[],   -- for MCQ/multiple_answer
  open_answer TEXT,             -- for open questions
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0
);

-- ================================================================
-- CERTIFICATES & ATTESTATIONS
-- ================================================================

CREATE TABLE certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id),
  type certificate_type NOT NULL DEFAULT 'certificate',
  certificate_number TEXT UNIQUE NOT NULL DEFAULT 'EXC-' || upper(substring(md5(uuid_generate_v4()::text), 1, 8)),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  issued_by UUID REFERENCES profiles(id),
  is_auto_generated BOOLEAN DEFAULT FALSE,
  is_revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT,
  -- Attestation fields
  student_cin TEXT,
  start_date DATE,
  end_date DATE,
  duration_text TEXT,
  tasks_description TEXT,
  supervisor_name TEXT,
  supervisor_signature_url TEXT,
  stamp_url TEXT,
  -- PDF
  pdf_path TEXT,
  verification_url TEXT
);

-- ================================================================
-- LIVE SESSIONS
-- ================================================================

CREATE TABLE live_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  trainer_id UUID REFERENCES profiles(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  jitsi_room_name TEXT UNIQUE NOT NULL DEFAULT 'exc-' || lower(substring(md5(uuid_generate_v4()::text), 1, 12)),
  status session_status DEFAULT 'scheduled',
  recording_url TEXT,
  max_participants INTEGER DEFAULT 100,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session_attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  UNIQUE(session_id, student_id)
);

-- ================================================================
-- ANNOUNCEMENTS
-- ================================================================

CREATE TABLE announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  course_id UUID REFERENCES courses(id),  -- NULL = global
  is_published BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- SETTINGS
-- ================================================================

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- INDEXES
-- ================================================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_trainer ON courses(trainer_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_progress_student ON lesson_progress(student_id);
CREATE INDEX idx_progress_course ON lesson_progress(course_id);
CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX idx_certificates_student ON certificates(student_id);
CREATE INDEX idx_certificates_number ON certificates(certificate_number);
CREATE INDEX idx_live_sessions_course ON live_sessions(course_id);
CREATE INDEX idx_live_sessions_scheduled ON live_sessions(scheduled_at);

-- ================================================================
-- FUNCTIONS
-- ================================================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update enrollment completion rate when lesson_progress changes
CREATE OR REPLACE FUNCTION update_enrollment_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_total INTEGER;
  v_completed INTEGER;
  v_rate DECIMAL;
BEGIN
  SELECT COUNT(*) INTO v_total
  FROM lessons WHERE course_id = NEW.course_id AND is_published = TRUE;

  SELECT COUNT(*) INTO v_completed
  FROM lesson_progress
  WHERE student_id = NEW.student_id AND course_id = NEW.course_id AND is_completed = TRUE;

  IF v_total > 0 THEN
    v_rate := (v_completed::DECIMAL / v_total::DECIMAL) * 100;
  ELSE
    v_rate := 0;
  END IF;

  UPDATE enrollments
  SET completion_rate = v_rate,
      completed_at = CASE WHEN v_rate = 100 AND completed_at IS NULL THEN NOW() ELSE completed_at END
  WHERE student_id = NEW.student_id AND course_id = NEW.course_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_completion_on_progress
AFTER INSERT OR UPDATE ON lesson_progress
FOR EACH ROW EXECUTE FUNCTION update_enrollment_completion();

-- Auto-update course total_enrolled
CREATE OR REPLACE FUNCTION update_course_enrolled_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET total_enrolled = (
    SELECT COUNT(*) FROM enrollments
    WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
    AND status = 'approved'
  )
  WHERE id = COALESCE(NEW.course_id, OLD.course_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enrolled_count
AFTER INSERT OR UPDATE OR DELETE ON enrollments
FOR EACH ROW EXECUTE FUNCTION update_course_enrolled_count();

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: is current user admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: is current user enrolled in course?
CREATE OR REPLACE FUNCTION is_enrolled(p_course_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM enrollments
    WHERE student_id = auth.uid()
    AND course_id = p_course_id
    AND status = 'approved'
    AND (expires_at IS NULL OR expires_at > NOW())
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ─── PROFILES policies ───
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (TRUE);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE USING (is_admin());

CREATE POLICY "New users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ─── CATEGORIES policies ───
CREATE POLICY "Categories visible to all"
  ON categories FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can manage categories"
  ON categories FOR ALL USING (is_admin());

-- ─── COURSES policies ───
CREATE POLICY "Published courses visible to all"
  ON courses FOR SELECT USING (is_published = TRUE OR is_admin() OR trainer_id = auth.uid());

CREATE POLICY "Admins can manage all courses"
  ON courses FOR ALL USING (is_admin());

CREATE POLICY "Trainers can manage own courses"
  ON courses FOR UPDATE USING (trainer_id = auth.uid());

-- ─── MODULES policies ───
CREATE POLICY "Modules visible if course visible"
  ON modules FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM courses c WHERE c.id = course_id
    AND (c.is_published = TRUE OR is_admin() OR c.trainer_id = auth.uid())
  ));

CREATE POLICY "Admins manage modules"
  ON modules FOR ALL USING (is_admin());

-- ─── LESSONS policies ───
CREATE POLICY "Free preview lessons visible to all"
  ON lessons FOR SELECT
  USING (
    is_free_preview = TRUE
    OR is_admin()
    OR is_enrolled(course_id)
    OR EXISTS (SELECT 1 FROM courses c WHERE c.id = course_id AND c.trainer_id = auth.uid())
  );

CREATE POLICY "Admins manage lessons"
  ON lessons FOR ALL USING (is_admin());

-- ─── RESOURCES policies ───
CREATE POLICY "Resources visible to enrolled students"
  ON resources FOR SELECT
  USING (is_public = TRUE OR is_admin() OR is_enrolled(course_id));

CREATE POLICY "Admins manage resources"
  ON resources FOR ALL USING (is_admin());

-- ─── ENROLLMENTS policies ───
CREATE POLICY "Students see own enrollments"
  ON enrollments FOR SELECT USING (student_id = auth.uid() OR is_admin());

CREATE POLICY "Students can enroll"
  ON enrollments FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins manage enrollments"
  ON enrollments FOR ALL USING (is_admin());

-- ─── PAYMENTS policies ───
CREATE POLICY "Students see own payments"
  ON payments FOR SELECT USING (student_id = auth.uid() OR is_admin());

CREATE POLICY "Students can submit payments"
  ON payments FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins manage payments"
  ON payments FOR ALL USING (is_admin());

-- ─── LESSON PROGRESS policies ───
CREATE POLICY "Students see own progress"
  ON lesson_progress FOR SELECT USING (student_id = auth.uid() OR is_admin());

CREATE POLICY "Students update own progress"
  ON lesson_progress FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Admins see all progress"
  ON lesson_progress FOR SELECT USING (is_admin());

-- ─── QUIZZES policies ───
CREATE POLICY "Quizzes visible to enrolled students"
  ON quizzes FOR SELECT
  USING (is_admin() OR is_enrolled(course_id));

CREATE POLICY "Admins manage quizzes"
  ON quizzes FOR ALL USING (is_admin());

-- ─── QUESTIONS policies ───
CREATE POLICY "Questions visible during quiz attempt"
  ON questions FOR SELECT
  USING (is_admin() OR EXISTS (
    SELECT 1 FROM quizzes q WHERE q.id = quiz_id AND is_enrolled(q.course_id)
  ));

CREATE POLICY "Admins manage questions"
  ON questions FOR ALL USING (is_admin());

-- ─── QUESTION ANSWERS policies ───
CREATE POLICY "Answers visible to enrolled students"
  ON question_answers FOR SELECT
  USING (is_admin() OR EXISTS (
    SELECT 1 FROM questions q JOIN quizzes qz ON q.quiz_id = qz.id
    WHERE q.id = question_id AND is_enrolled(qz.course_id)
  ));

CREATE POLICY "Admins manage answers"
  ON question_answers FOR ALL USING (is_admin());

-- ─── QUIZ ATTEMPTS policies ───
CREATE POLICY "Students see own attempts"
  ON quiz_attempts FOR SELECT USING (student_id = auth.uid() OR is_admin());

CREATE POLICY "Students create attempts"
  ON quiz_attempts FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students update own attempts"
  ON quiz_attempts FOR UPDATE USING (student_id = auth.uid());

-- ─── STUDENT ANSWERS policies ───
CREATE POLICY "Students see own answers"
  ON student_answers FOR SELECT
  USING (EXISTS (SELECT 1 FROM quiz_attempts a WHERE a.id = attempt_id AND (a.student_id = auth.uid() OR is_admin())));

CREATE POLICY "Students submit answers"
  ON student_answers FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM quiz_attempts a WHERE a.id = attempt_id AND a.student_id = auth.uid()));

-- ─── CERTIFICATES policies ───
CREATE POLICY "Students see own certificates"
  ON certificates FOR SELECT USING (student_id = auth.uid() OR is_admin());

CREATE POLICY "Anyone can verify certificates (public)"
  ON certificates FOR SELECT USING (is_revoked = FALSE);

CREATE POLICY "Admins manage certificates"
  ON certificates FOR ALL USING (is_admin());

-- ─── LIVE SESSIONS policies ───
CREATE POLICY "Enrolled students see sessions"
  ON live_sessions FOR SELECT
  USING (is_public = TRUE OR is_admin() OR (course_id IS NOT NULL AND is_enrolled(course_id)));

CREATE POLICY "Admins manage sessions"
  ON live_sessions FOR ALL USING (is_admin());

-- ─── SESSION ATTENDANCE policies ───
CREATE POLICY "Students see own attendance"
  ON session_attendance FOR SELECT USING (student_id = auth.uid() OR is_admin());

CREATE POLICY "Students can join sessions"
  ON session_attendance FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students update own attendance"
  ON session_attendance FOR UPDATE USING (student_id = auth.uid());

-- ─── ANNOUNCEMENTS policies ───
CREATE POLICY "Announcements visible to all authenticated users"
  ON announcements FOR SELECT USING (
    auth.uid() IS NOT NULL
    AND is_published = TRUE
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (course_id IS NULL OR is_admin() OR is_enrolled(course_id))
  );

CREATE POLICY "Admins manage announcements"
  ON announcements FOR ALL USING (is_admin());

-- ─── LEARNING PATHS policies ───
CREATE POLICY "Published paths visible to all"
  ON learning_paths FOR SELECT USING (is_published = TRUE OR is_admin());

CREATE POLICY "Admins manage paths"
  ON learning_paths FOR ALL USING (is_admin());

-- ─── SETTINGS policies ───
CREATE POLICY "Anyone can read settings"
  ON settings FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can modify settings"
  ON settings FOR ALL USING (is_admin());

-- ================================================================
-- SEED DATA
-- ================================================================

-- Insert categories
INSERT INTO categories (name, slug, description, icon, color, display_order) VALUES
  ('Comptabilité', 'comptabilite', 'Formation en comptabilité générale et analytique', 'Calculator', '#0A1F44', 1),
  ('Fiscalité', 'fiscalite', 'Fiscalité marocaine, TVA, IS, IR', 'FileText', '#C9A24B', 2),
  ('Gestion', 'gestion', 'Gestion d''entreprise et management', 'BarChart', '#10B981', 3),
  ('Économie', 'economie', 'Économie générale et macroéconomie', 'TrendingUp', '#2D5896', 4),
  ('Développement informatique', 'developpement-informatique', 'Programmation et développement web', 'Code', '#7C3AED', 5),
  ('Bureautique', 'bureautique', 'Maîtrise des outils bureautiques', 'Monitor', '#059669', 6);

-- Insert settings
INSERT INTO settings (key, value) VALUES
  ('site_name', '"Excelium Consulting Compta"'),
  ('bank_details', '{
    "bank_name": "CIH Bank",
    "rib": "00000 00000 000000000000 00",
    "account_name": "EXCELIUM CONSULTING COMPTA",
    "iban": "MA64 0000 0000 0000 0000 0000 00"
  }'),
  ('whatsapp_number', '"+212600000000"'),
  ('contact_email', '"contact@excelium.ma"'),
  ('social_links', '{
    "facebook": "",
    "linkedin": "",
    "instagram": "",
    "youtube": ""
  }');

-- ================================================================
-- Storage Buckets (run after creating buckets in Supabase dashboard)
-- ================================================================

-- NOTE: Create these buckets in Supabase Storage dashboard:
-- 1. "course-thumbnails" (public)
-- 2. "course-videos" (private, authenticated)
-- 3. "resources" (private, authenticated)
-- 4. "payment-proofs" (private)
-- 5. "certificates" (private, authenticated)
-- 6. "avatars" (public)
-- 7. "signatures" (private)
