-- ecoles
CREATE TABLE
  IF NOT EXISTS schools (
    id BIGINT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(150),
    address VARCHAR(300),
    logo VARCHAR(255),
    option JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- année scolaires
CREATE TABLE
  academic_years (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT,
    name VARCHAR(50), -- ex: 2024-2025
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (school_id) REFERENCES schools (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- roles
CREATE TABLE
  roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE,
    permission JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- utilisateurs
CREATE TABLE
  IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT,
    username VARCHAR(50),
    password VARCHAR(255),
    photos VARCHAR(255),
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    numbers VARCHAR(15),
    address VARCHAR(300),
    role_id BIGINT,
    FOREIGN KEY (school_id) REFERENCES schools (id),
    FOREIGN KEY (role_id) REFERENCES roles (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- classes
CREATE TABLE
  IF NOT EXISTS classes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT,
    academic_year_id BIGINT,
    name VARCHAR(50), -- "Tle A"
    level VARCHAR(50), -- terminale
    capacity INT, -- 60
    classroom VARCHAR(50), -- salle 10
    FOREIGN KEY (school_id) REFERENCES schools (id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- etudiants
CREATE TABLE
  IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT,
    academic_year_id BIGINT,
    firstname VARCHAR(100),
    lastname VARCHAR(100),
    photos TEXT DEFAULT NULL,
    address VARCHAR(300),
    birthdate DATE,
    status ENUM ('ACTIF', 'RENVOYE', 'DIPLOME'),
    FOREIGN KEY (school_id) REFERENCES schools (id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

CREATE TABLE
  enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT,
    class_id BIGINT,
    academic_year_id BIGINT,
    status ENUM ('INSCRIT', 'REDOUBLANT', 'TRANSFERE'),
    FOREIGN KEY (student_id) REFERENCES students (id),
    FOREIGN KEY (class_id) REFERENCES classes (id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years (id)
  );

-- matières
CREATE TABLE
  IF NOT EXISTS subjects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT,
    name VARCHAR(100),
    coefficient FLOAT,
    FOREIGN KEY (school_id) REFERENCES schools (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- emplois du temps
CREATE TABLE
  IF NOT EXISTS schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT,
    class_id BIGINT,
    subject_id BIGINT,
    teacher_id BIGINT,
    day ENUM (
      'LUNDI',
      'MARDI',
      'MERCREDI',
      'JEUDI',
      'VENDREDI',
      'SAMEDI'
    ),
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (school_id) REFERENCES schools (id),
    FOREIGN KEY (class_id) REFERENCES classes (id),
    FOREIGN KEY (subject_id) REFERENCES subjects (id),
    FOREIGN KEY (teacher_id) REFERENCES users (id) created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- notes
CREATE TABLE
  IF NOT EXISTS grades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT,
    student_id BIGINT,
    subject_id BIGINT,
    academic_year_id BIGINT,
    value FLOAT,
    term ENUM ('TRIMESTRE1', 'TRIMESTRE2', 'TRIMESTRE3'),
    FOREIGN KEY (school_id) REFERENCES schools (id),
    FOREIGN KEY (student_id) REFERENCES students (id),
    FOREIGN KEY (subject_id) REFERENCES subjects (id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- bulettin
CREATE TABLE
  IF NOT EXISTS report_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT,
    student_id BIGINT,
    academic_year_id BIGINT,
    term ENUM ('TRIMESTRE1', 'TRIMESTRE2', 'TRIMESTRE3'),
    average FLOAT,
    rank INT,
    decision ENUM ('ADMIS', 'REDOUBLE', 'RENVOYE'),
    FOREIGN KEY (school_id) REFERENCES schools (id),
    FOREIGN KEY (student_id) REFERENCES students (id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- paiements
CREATE TABLE
  IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    school_id BIGINT,
    student_id BIGINT,
    academic_year_id BIGINT,
    amount FLOAT,
    payment_date DATE,
    receipt_number VARCHAR(100),
    type ENUM ('INSCRIPTION', 'ECOLAGE'),
    FOREIGN KEY (school_id) REFERENCES schools (id),
    FOREIGN KEY (student_id) REFERENCES students (id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );

-- La Vue de Calcul des Moyennes (v_student_averages)
CREATE VIEW
  v_student_averages AS
SELECT
  g.school_id,
  g.student_id,
  g.academic_year_id,
  g.term,
  SUM(g.value * s.coefficient) / SUM(s.coefficient) AS calculated_average
FROM
  grades g
  JOIN subjects s ON g.subject_id = s.id
GROUP BY
  g.school_id,
  g.student_id,
  g.academic_year_id,
  g.term;

-- Automatisation du Rang (Procédure Stockée)
DELIMITER / / CREATE PROCEDURE generate_term_report_cards (
  IN p_school_id BIGINT,
  IN p_academic_year_id BIGINT,
  IN p_term ENUM ('TRIMESTRE1', 'TRIMESTRE2', 'TRIMESTRE3')
) BEGIN
-- 1. Nettoyer les anciens bulletins du trimestre pour éviter les doublons
DELETE FROM report_cards
WHERE
  school_id = p_school_id
  AND academic_year_id = p_academic_year_id
  AND term = p_term;

-- 2. Insérer les nouvelles moyennes et calculer les rangs
INSERT INTO
  report_cards (
    school_id,
    student_id,
    academic_year_id,
    term,
    average,
    rank,
    decision
  )
SELECT
  sub.school_id,
  sub.student_id,
  sub.academic_year_id,
  sub.term,
  sub.calculated_average,
  RANK() OVER (
    PARTITION BY
      e.class_id
    ORDER BY
      sub.calculated_average DESC
  ) as student_rank,
  CASE
    WHEN sub.calculated_average >= 10 THEN 'ADMIS'
    ELSE 'REDOUBLE'
  END
FROM
  v_student_averages sub
  JOIN enrollments e ON sub.student_id = e.student_id
  AND sub.academic_year_id = e.academic_year_id
WHERE
  sub.school_id = p_school_id
  AND sub.academic_year_id = p_academic_year_id
  AND sub.term = p_term;

END / / DELIMITER;

-- Automatisation des Impayés (Le "Moteur")
CREATE VIEW
  v_student_balances AS
SELECT
  s.id AS student_id,
  s.firstname,
  s.lastname,
  s.school_id,
  ay.id AS academic_year_id,
  -- Supposons un tarif fixe défini dans une config ou calculé ici
  (150000) AS total_due, -- Exemple: Frais annuels totaux
  COALESCE(SUM(p.amount), 0) AS total_paid,
  (150000 - COALESCE(SUM(p.amount), 0)) AS balance
FROM
  students s
  JOIN academic_years ay ON s.academic_year_id = ay.id
  LEFT JOIN payments p ON s.id = p.student_id
  AND ay.id = p.academic_year_id
GROUP BY
  s.id,
  ay.id;
