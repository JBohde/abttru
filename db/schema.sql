DROP DATABASE IF EXISTS nutri_db;

CREATE DATABASE nutri_db;
USE nutri_db;

CREATE TABLE patients (
    id INT NOT NULL AUTO_INCREMENT,
    patient_name varchar(255),
    user_name varchar(255),
    password varchar(255),
    PRIMARY KEY (id),
    createdAt TIMESTAMP DEFAULT '1970-01-01 01:00:01',
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE table healthStats(
    id INT NOT NULL AUTO_INCREMENT,
    patient_id varchar(255),
    diet_recommendation varchar(255),
    risk_factor varchar(255),
    diet_restriction varchar(255),
    PRIMARY KEY (id),
    createdAt TIMESTAMP DEFAULT '1970-01-01 01:00:01',
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE table doctors(
    id INT NOT NULL AUTO_INCREMENT,
    patient_id varchar(255),
    doctor_name varchar(255),
    user_name varchar(255),
    password varchar(255),
    PRIMARY KEY (id),
    createdAt TIMESTAMP DEFAULT '1970-01-01 01:00:01',
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE table savedRecipes(
    id INT NOT NULL AUTO_INCREMENT,
    patient_id varchar(255),
    recipe_name varchar(255),
    recipe_img varchar(255),
    recipe varchar(255),
    recipe_uri varchar(255),
    favorite boolean,
    PRIMARY KEY (id),
    createdAt TIMESTAMP DEFAULT '1970-01-01 01:00:01',
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
