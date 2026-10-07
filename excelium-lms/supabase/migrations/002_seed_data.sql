-- ================================================================
-- SEED DATA — 3 Sample Courses
-- Run AFTER the main schema AND after creating an admin profile
-- Replace 'YOUR_ADMIN_UUID' with the actual admin user UUID
-- ================================================================

-- You'll need to replace these UUIDs after running the schema
-- Get your admin UUID from: SELECT id FROM profiles WHERE role = 'admin' LIMIT 1;

DO $$
DECLARE
  v_admin_id UUID;
  v_cat_bureautique UUID;
  v_cat_economie UUID;
  v_cat_dev UUID;
  v_course1_id UUID;
  v_course2_id UUID;
  v_course3_id UUID;
  v_module1_id UUID;
  v_module2_id UUID;
  v_lesson_id UUID;
  v_quiz_id UUID;
BEGIN

  -- Get first admin user (update this if needed)
  SELECT id INTO v_admin_id FROM profiles WHERE role = 'admin' LIMIT 1;

  -- Get categories
  SELECT id INTO v_cat_bureautique FROM categories WHERE slug = 'bureautique';
  SELECT id INTO v_cat_economie FROM categories WHERE slug = 'economie';
  SELECT id INTO v_cat_dev FROM categories WHERE slug = 'developpement-informatique';

  -- ── COURSE 1: Excel Avancé ──────────────────────────────────
  INSERT INTO courses (
    title, slug, description, short_description, price, currency,
    duration_hours, level, category_id, trainer_id,
    is_published, is_featured, certificate_enabled,
    meta_title, meta_description
  ) VALUES (
    'Excel Avancé — Maîtrisez les Données',
    'excel-avance',
    'Ce cours complet vous permettra de maîtriser les fonctions avancées d''Excel, les tableaux croisés dynamiques, les macros VBA, et l''analyse de données financières. Idéal pour les professionnels de la comptabilité et de la gestion.',
    'Maîtrisez Excel de A à Z : TCD, VBA, Power Query et analyse financière.',
    990.00, 'MAD', 24, 'intermediaire',
    v_cat_bureautique, v_admin_id,
    TRUE, TRUE, TRUE,
    'Formation Excel Avancé au Maroc | Excelium Consulting',
    'Maîtrisez Excel avec notre formation intensive. Tableaux croisés dynamiques, macros VBA, Power Query. Certification incluse.'
  ) RETURNING id INTO v_course1_id;

  -- Module 1
  INSERT INTO modules (course_id, title, description, display_order)
  VALUES (v_course1_id, 'Les Fondamentaux Avancés', 'Formules imbriquées, tableaux structurés et fonctions de recherche', 1)
  RETURNING id INTO v_module1_id;

  -- Lessons for module 1
  INSERT INTO lessons (module_id, course_id, title, type, video_url, video_duration_seconds, display_order, is_free_preview)
  VALUES
    (v_module1_id, v_course1_id, 'Introduction au cours', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 600, 1, TRUE),
    (v_module1_id, v_course1_id, 'Fonctions RECHERCHEV et INDEX/MATCH', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1800, 2, FALSE),
    (v_module1_id, v_course1_id, 'Formules conditionnelles avancées', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1500, 3, FALSE);

  -- Module 2
  INSERT INTO modules (course_id, title, description, display_order)
  VALUES (v_course1_id, 'Tableaux Croisés Dynamiques', 'Analyse multidimensionnelle des données', 2)
  RETURNING id INTO v_module2_id;

  INSERT INTO lessons (module_id, course_id, title, type, video_url, video_duration_seconds, display_order)
  VALUES
    (v_module2_id, v_course1_id, 'Créer votre premier TCD', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2100, 1),
    (v_module2_id, v_course1_id, 'Graphiques croisés dynamiques', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1800, 2),
    (v_module2_id, v_course1_id, 'Quiz — Tableaux Croisés Dynamiques', 'quiz', NULL, 0, 3);

  -- Quiz for course 1
  INSERT INTO quizzes (course_id, title, passing_score, max_attempts, is_final_exam)
  VALUES (v_course1_id, 'Examen Final — Excel Avancé', 70, 3, TRUE)
  RETURNING id INTO v_quiz_id;

  INSERT INTO questions (quiz_id, type, question_text, display_order) VALUES
    (v_quiz_id, 'mcq', 'Quelle fonction permet de chercher une valeur dans une colonne et retourner une valeur correspondante dans une autre colonne ?', 1),
    (v_quiz_id, 'true_false', 'Un tableau croisé dynamique peut être créé à partir de données dans plusieurs feuilles sans Power Query.', 2),
    (v_quiz_id, 'mcq', 'Quelle est la syntaxe correcte pour la fonction INDEX/MATCH ?', 3);

  -- ── COURSE 2: Introduction à l'Économie ─────────────────────
  INSERT INTO courses (
    title, slug, description, short_description, price, currency,
    duration_hours, level, category_id, trainer_id,
    is_published, is_featured, certificate_enabled
  ) VALUES (
    'Introduction à l''Économie Générale',
    'introduction-economie',
    'Découvrez les fondements de l''économie : microéconomie, macroéconomie, politique monétaire et fiscale, économie marocaine. Ce cours accessible est conçu pour les étudiants et professionnels souhaitant comprendre les mécanismes économiques.',
    'Les bases de l''économie moderne : marchés, politiques économiques, économie marocaine.',
    790.00, 'MAD', 18, 'debutant',
    v_cat_economie, v_admin_id,
    TRUE, TRUE, TRUE
  ) RETURNING id INTO v_course2_id;

  INSERT INTO modules (course_id, title, display_order)
  VALUES (v_course2_id, 'Les Fondements de l''Économie', 1)
  RETURNING id INTO v_module1_id;

  INSERT INTO lessons (module_id, course_id, title, type, video_url, video_duration_seconds, display_order, is_free_preview)
  VALUES
    (v_module1_id, v_course2_id, 'Qu''est-ce que l''économie ?', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 900, 1, TRUE),
    (v_module1_id, v_course2_id, 'L''offre et la demande', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1800, 2, FALSE),
    (v_module1_id, v_course2_id, 'Les marchés et la concurrence', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1500, 3, FALSE);

  -- ── COURSE 3: Développement Web ─────────────────────────────
  INSERT INTO courses (
    title, slug, description, short_description, price, currency,
    duration_hours, level, category_id, trainer_id,
    is_published, is_featured, certificate_enabled
  ) VALUES (
    'Développement Web Moderne — HTML, CSS & JavaScript',
    'developpement-web',
    'Apprenez à créer des sites web professionnels de A à Z. HTML5, CSS3, JavaScript ES6+, React et les bases du développement web moderne. Ce cours pratique vous donnera toutes les compétences pour créer vos premiers projets web.',
    'Créez des sites web professionnels : HTML, CSS, JavaScript et React.',
    1290.00, 'MAD', 40, 'debutant',
    v_cat_dev, v_admin_id,
    TRUE, FALSE, TRUE
  ) RETURNING id INTO v_course3_id;

  INSERT INTO modules (course_id, title, display_order)
  VALUES (v_course3_id, 'HTML5 — La Structure du Web', 1)
  RETURNING id INTO v_module1_id;

  INSERT INTO lessons (module_id, course_id, title, type, video_url, video_duration_seconds, display_order, is_free_preview)
  VALUES
    (v_module1_id, v_course3_id, 'Introduction au HTML', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1200, 1, TRUE),
    (v_module1_id, v_course3_id, 'Les balises essentielles', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1500, 2, FALSE),
    (v_module1_id, v_course3_id, 'Formulaires et validation', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1800, 3, FALSE);

  -- Update course lesson counts
  UPDATE courses SET total_lessons = (
    SELECT COUNT(*) FROM lessons WHERE course_id = v_course1_id
  ) WHERE id = v_course1_id;

  UPDATE courses SET total_lessons = (
    SELECT COUNT(*) FROM lessons WHERE course_id = v_course2_id
  ) WHERE id = v_course2_id;

  UPDATE courses SET total_lessons = (
    SELECT COUNT(*) FROM lessons WHERE course_id = v_course3_id
  ) WHERE id = v_course3_id;

  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Course 1 ID: %', v_course1_id;
  RAISE NOTICE 'Course 2 ID: %', v_course2_id;
  RAISE NOTICE 'Course 3 ID: %', v_course3_id;

END $$;
