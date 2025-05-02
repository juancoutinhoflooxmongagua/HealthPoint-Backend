create database HealthPoint;
use HealthPoint;

CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_role ENUM('admin', 'coadmin', 'volunteer') NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Hospitals (
    hospital_id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_name VARCHAR(150) NOT NULL,
    hospital_address VARCHAR(255),
    hospital_phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    job_id INT PRIMARY KEY AUTO_INCREMENT,
    creator_id INT NOT NULL,
    hospital_name VARCHAR(150),
    hospital_id INT,
    job_type ENUM('Teen', 'Elderly', 'Communication') NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    job_description TEXT,
    job_points INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES Users(user_id),
    FOREIGN KEY (hospital_id) REFERENCES Hospitals(hospital_id)
);

CREATE TABLE applications (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    volunteer_id INT NOT NULL,
    application_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    points_awarded INT,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    decision_at DATETIME,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id),
    FOREIGN KEY (volunteer_id) REFERENCES Users(user_id)
);


-- Inserindo usuários
INSERT INTO Users (user_email, user_password, user_role, user_name, user_phone)
VALUES 
('admin@org.com', 'hashed_pw_admin', 'admin', 'Admin User', '11999999999'),
('joao@email.com', 'hashed_pw_joao', 'volunteer', 'João da Silva', '11988888888'),
('maria@email.com', 'hashed_pw_maria', 'volunteer', 'Maria Oliveira', '11977777777');

-- Inserindo hospital
INSERT INTO Hospitals (hospital_name, hospital_address, hospital_phone)
VALUES 
('Hospital Vida', 'Rua das Flores, 123', '1133334444');

-- Criando um job
INSERT INTO jobs (creator_id, hospital_name, hospital_id, job_type, job_title, job_description, job_points)
VALUES 
(1, 'Hospital Vida', 1, 'Elderly', 'Acompanhamento de idosos', 'Acompanhar pacientes idosos em passeios pelo jardim', 50);

-- Voluntários se candidatam à vaga
INSERT INTO applications (job_id, volunteer_id, application_status, points_awarded, decision_at)
VALUES
(1, 2, 'approved', 50, NOW()),
(1, 3, 'pending', NULL, NULL);

SELECT 
    j.job_id,
    j.job_title,
    j.job_type,
    j.job_points,
    h.hospital_name,
    u.user_name AS creator_name
FROM jobs j
JOIN Hospitals h ON j.hospital_id = h.hospital_id
JOIN Users u ON j.creator_id = u.user_id;


SELECT 
    u.user_name,
    SUM(a.points_awarded) AS total_points
FROM applications a
JOIN Users u ON a.volunteer_id = u.user_id
WHERE a.application_status = 'approved'
GROUP BY u.user_id;