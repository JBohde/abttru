DROP DATABASE abttru_db;
CREATE DATABASE abttru_db;

USE abttru_db;

CREATE table doctors(
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT '1970-01-01 01:00:01',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=INNODB;

CREATE TABLE patients (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    doctor_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT '1970-01-01 01:00:01',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX doc_ind (doctor_id),
    CONSTRAINT fk_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id)
) ENGINE=INNODB;

CREATE table statistics(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(36) NOT NULL,
    risk_factor VARCHAR(255),
    diet_recommendation VARCHAR(255),
    diet_restriction VARCHAR(255),
    created_at TIMESTAMP DEFAULT '1970-01-01 01:00:01',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX patient_ind (patient_id),
    CONSTRAINT fk_patient_stats FOREIGN KEY (patient_id) REFERENCES patients(id)
) ENGINE=INNODB;

CREATE table recipes(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(36) NOT NULL,
    recipe_name VARCHAR(255),
    recipe_img VARCHAR(255),
    recipe VARCHAR(255),
    recipe_uri VARCHAR(255),
    favorite boolean,
    created_at TIMESTAMP DEFAULT '1970-01-01 01:00:01',
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX patient_ind (patient_id),
    CONSTRAINT fk_patient_recipes FOREIGN KEY (patient_id) REFERENCES patients(id)
) ENGINE=INNODB;
