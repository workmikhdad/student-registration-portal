-- ==========================================================
-- Student Registration Database Schema
-- Database: student_db
-- ==========================================================

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS `student_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- 2. Select Database
USE `student_db`;

-- 3. Create students Table
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `course` VARCHAR(50) NOT NULL,
  `dob` DATE NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  `address` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Index on email for fast search & verification
  INDEX `idx_students_email` (`email`),
  INDEX `idx_students_course` (`course`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- Sample Queries for Testing:
-- SELECT * FROM students ORDER BY id DESC;
-- ==========================================================
