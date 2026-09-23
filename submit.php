<?php
/**
 * Student Registration Form Handler
 * Validates, sanitizes input, and saves to MySQL using PDO.
 */

// Include database configuration
require_once __DIR__ . '/config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, 'Method not allowed. Please submit via POST.', [], [], 405);
}

// Read input (handles both standard POST/FormData and JSON payloads)
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$data = [];

if (stripos($contentType, 'application/json') !== false) {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?? [];
} else {
    $data = $_POST;
}

// 1. Sanitize raw inputs
$fullName = trim((string)($data['full_name'] ?? ''));
$email    = trim((string)($data['email'] ?? ''));
$phone    = trim((string)($data['phone'] ?? ''));
$course   = trim((string)($data['course'] ?? ''));
$dob      = trim((string)($data['dob'] ?? ''));
$gender   = trim((string)($data['gender'] ?? ''));
$address  = trim((string)($data['address'] ?? ''));

// Array to hold validation errors
$errors = [];

// 2. Server-side Validation

// Full Name Validation (Required, min 2 chars)
if ($fullName === '') {
    $errors['full_name'] = 'Full name is required.';
} elseif (strlen($fullName) < 2) {
    $errors['full_name'] = 'Full name must be at least 2 characters.';
}

// Email Validation (Required, valid format)
if ($email === '') {
    $errors['email'] = 'Email address is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address.';
}

// Phone Validation (Required, exactly 10 digits)
if ($phone === '') {
    $errors['phone'] = 'Phone number is required.';
} elseif (!preg_match('/^[0-9]{10}$/', $phone)) {
    $errors['phone'] = 'Phone number must be exactly 10 digits.';
}

// Course Validation (Required, from allowed list)
$allowedCourses = ['BCA', 'MCA', 'BSc CS', 'MSc CS', 'BBA', 'MBA'];
if ($course === '') {
    $errors['course'] = 'Please select a course.';
} elseif (!in_array($course, $allowedCourses, true)) {
    $errors['course'] = 'Invalid course selected.';
}

// Date of Birth Validation (Required, valid date)
if ($dob === '') {
    $errors['dob'] = 'Date of birth is required.';
} else {
    $dateObj = DateTime::createFromFormat('Y-m-d', $dob);
    if (!$dateObj || $dateObj->format('Y-m-d') !== $dob) {
        $errors['dob'] = 'Please enter a valid date of birth.';
    }
}

// Gender Validation (Required, Male/Female/Other)
$allowedGenders = ['Male', 'Female', 'Other'];
if ($gender === '') {
    $errors['gender'] = 'Please select your gender.';
} elseif (!in_array($gender, $allowedGenders, true)) {
    $errors['gender'] = 'Invalid gender selected.';
}

// Address is optional; if present, sanitize it
$safeAddress = $address !== '' ? htmlspecialchars($address, ENT_QUOTES, 'UTF-8') : null;

// If there are validation errors, return response with status 422
if (!empty($errors)) {
    sendJsonResponse(false, 'Validation failed. Please correct the errors below.', [], $errors, 422);
}

// 3. Save to MySQL Database
try {
    $pdo = getDBConnection();

    // SQL query with PDO prepared placeholders
    $sql = "INSERT INTO students (full_name, email, phone, course, dob, gender, address, created_at) 
            VALUES (:full_name, :email, :phone, :course, :dob, :gender, :address, NOW())";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':full_name' => htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8'),
        ':email'     => filter_var($email, FILTER_SANITIZE_EMAIL),
        ':phone'     => $phone,
        ':course'    => $course,
        ':dob'       => $dob,
        ':gender'    => $gender,
        ':address'   => $safeAddress
    ]);

    $studentId = (int)$pdo->lastInsertId();

    // Success response
    sendJsonResponse(true, 'Registration Complete!', [
        'id'        => $studentId,
        'full_name' => $fullName,
        'course'    => $course,
        'email'     => $email
    ], [], 200);

} catch (PDOException $e) {
    // Return friendly error if database operation fails
    sendJsonResponse(false, 'Database error: Could not save registration. Please ensure MySQL is running.', [], [
        'database' => $e->getMessage()
    ], 500);
}
