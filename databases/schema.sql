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
