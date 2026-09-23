/**
 * Student Registration Portal JavaScript
 * Real-time validation, dynamic progress bar, and AJAX submission.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Select DOM Elements
  const form = document.getElementById('student-form');
  const btnSubmit = document.getElementById('btn-submit');
  const btnReset = document.getElementById('btn-reset');
  const btnText = document.getElementById('btn-text');
  
  // Input fields
  const fullNameInput = document.getElementById('full_name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const courseSelect = document.getElementById('course');
  const dobInput = document.getElementById('dob');
  const genderRadios = document.querySelectorAll('input[name="gender"]');
  const addressTextarea = document.getElementById('address');

  // Progress Bar & Step Indicator
  const progressFill = document.getElementById('progress-fill');
  const fieldsCompletedCount = document.getElementById('fields-completed-count');
  const TOTAL_REQUIRED_FIELDS = 6;

  // Success Card Elements
  const successCard = document.getElementById('success-card');
  const successStudentName = document.getElementById('success-student-name');
  const successCourseName = document.getElementById('success-course-name');
  const successAppId = document.getElementById('success-app-id');
  const btnRegisterAnother = document.getElementById('btn-register-another');

  // ==========================================================
  // 2. Validation Helper Functions
  // ==========================================================

  /**
   * Sets an error state on a field group and displays the message
   */
  function setFieldError(fieldId, message) {
    const group = document.getElementById(`group-${fieldId}`);
    const errEl = document.getElementById(`err-${fieldId}`);
    if (group && errEl) {
      group.classList.remove('is-valid');
      group.classList.add('has-error');
      errEl.textContent = message;
    }
  }

  /**
   * Sets a valid state on a field group and removes any error
   */
  function setFieldValid(fieldId) {
    const group = document.getElementById(`group-${fieldId}`);
    const errEl = document.getElementById(`err-${fieldId}`);
    if (group && errEl) {
      group.classList.remove('has-error');
      group.classList.add('is-valid');
      errEl.textContent = '';
    }
  }

  /**
   * Clears both error and valid states on a field group
   */
  function clearFieldState(fieldId) {
    const group = document.getElementById(`group-${fieldId}`);
    const errEl = document.getElementById(`err-${fieldId}`);
    if (group && errEl) {
      group.classList.remove('has-error', 'is-valid');
      errEl.textContent = '';
    }
  }

  // ==========================================================
  // 3. Field-Specific Validation Logic
  // ==========================================================

  // Validate Full Name (Min 2 chars, letters and spaces)
  function validateFullName(showError = true) {
    const value = fullNameInput.value.trim();
    if (!value) {
      if (showError) setFieldError('full_name', 'Full name is required.');
      return false;
    }
    if (value.length < 2) {
      if (showError) setFieldError('full_name', 'Name must be at least 2 characters.');
      return false;
    }
    setFieldValid('full_name');
    return true;
  }

  // Validate Email (Valid email format regex)
  function validateEmail(showError = true) {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      if (showError) setFieldError('email', 'Email address is required.');
      return false;
    }
    if (!emailPattern.test(value)) {
      if (showError) setFieldError('email', 'Please enter a valid email address.');
      return false;
    }
    setFieldValid('email');
    return true;
  }

  // Validate Phone (Exactly 10 digits)
  function validatePhone(showError = true) {
    const value = phoneInput.value.trim();
    const phonePattern = /^[0-9]{10}$/;
    if (!value) {
      if (showError) setFieldError('phone', 'Phone number is required.');
      return false;
    }
    if (!phonePattern.test(value)) {
      if (showError) setFieldError('phone', 'Phone number must be exactly 10 digits.');
      return false;
    }
    setFieldValid('phone');
    return true;
  }

  // Validate Course Selection
  function validateCourse(showError = true) {
    const value = courseSelect.value;
    if (!value) {
      if (showError) setFieldError('course', 'Please select a course.');
      return false;
    }
    setFieldValid('course');
    return true;
  }

  // Validate Date of Birth
  function validateDob(showError = true) {
    const value = dobInput.value;
    if (!value) {
      if (showError) setFieldError('dob', 'Date of birth is required.');
      return false;
    }
    setFieldValid('dob');
    return true;
  }

  // Validate Gender (Radio Selection)
  function validateGender(showError = true) {
    let isSelected = false;
    genderRadios.forEach(radio => {
      if (radio.checked) isSelected = true;
    });

    if (!isSelected) {
      if (showError) setFieldError('gender', 'Please select your gender.');
      return false;
    }
    setFieldValid('gender');
    return true;
  }

  // ==========================================================
  // 4. Real-time Progress Bar & Step Indicator
  // ==========================================================

  function updateProgress() {
    let completedCount = 0;

    if (validateFullName(false)) completedCount++;
    if (validateEmail(false)) completedCount++;
    if (validatePhone(false)) completedCount++;
    if (validateCourse(false)) completedCount++;
    if (validateDob(false)) completedCount++;
    if (validateGender(false)) completedCount++;

    const percentage = Math.round((completedCount / TOTAL_REQUIRED_FIELDS) * 100);

    // Update Progress UI
    progressFill.style.width = `${percentage}%`;
    fieldsCompletedCount.textContent = completedCount;
  }

  // ==========================================================
  // 5. Event Listeners for Real-Time Validation
  // ==========================================================

  // Full Name: validate on input & blur
  fullNameInput.addEventListener('input', () => {
    if (fullNameInput.value.trim().length > 0) {
      validateFullName(true);
    } else {
      clearFieldState('full_name');
    }
    updateProgress();
  });
  fullNameInput.addEventListener('blur', () => validateFullName(true));

  // Email: validate on input & blur
  emailInput.addEventListener('input', () => {
    if (emailInput.value.trim().length > 0) {
      validateEmail(false);
    } else {
      clearFieldState('email');
    }
    updateProgress();
  });
  emailInput.addEventListener('blur', () => validateEmail(true));

  // Phone: allow only digits and validate on input & blur
  phoneInput.addEventListener('input', () => {
    // Automatically filter out any non-numeric characters
    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
    if (phoneInput.value.length === 10) {
      validatePhone(true);
    } else if (phoneInput.value.length > 0) {
      validatePhone(false);
    } else {
      clearFieldState('phone');
    }
    updateProgress();
  });
  phoneInput.addEventListener('blur', () => validatePhone(true));

  // Course: validate on change
  courseSelect.addEventListener('change', () => {
    validateCourse(true);
    updateProgress();
  });

  // Date of Birth: validate on change & blur
  dobInput.addEventListener('change', () => {
    validateDob(true);
    updateProgress();
  });
  dobInput.addEventListener('blur', () => validateDob(true));

  // Gender: validate on radio change
  genderRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      validateGender(true);
      updateProgress();
    });
  });

  // ==========================================================
  // 6. Reset Button Handling
  // ==========================================================

  btnReset.addEventListener('click', () => {
    form.reset();
    ['full_name', 'email', 'phone', 'course', 'dob', 'gender', 'address'].forEach(clearFieldState);
    updateProgress();
  });

  // ==========================================================
  // 7. Form Submission Handling (AJAX Fetch)
  // ==========================================================

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Run full validation check
    const isNameValid = validateFullName(true);
    const isEmailValid = validateEmail(true);
    const isPhoneValid = validatePhone(true);
    const isCourseValid = validateCourse(true);
    const isDobValid = validateDob(true);
    const isGenderValid = validateGender(true);

    updateProgress();

    // If any required field is invalid, scroll to the first invalid field
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isCourseValid || !isDobValid || !isGenderValid) {
      const firstErrorGroup = form.querySelector('.form-group.has-error');
      if (firstErrorGroup) {
        firstErrorGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = firstErrorGroup.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
      }
      return;
    }

    // Set submit button to loading state
    btnSubmit.classList.add('loading');
    btnSubmit.disabled = true;
    btnText.textContent = 'Submitting...';

    // Prepare FormData
    const formData = new FormData(form);

    try {
      // Send AJAX request to submit.php
      const response = await fetch('submit.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success Flow: populate success card
        const studentName = fullNameInput.value.trim();
        const courseName = courseSelect.options[courseSelect.selectedIndex].text;
        const regId = result.data?.id ? `#STU-2026-${String(result.data.id).padStart(3, '0')}` : '#STU-2026-001';

        successStudentName.textContent = studentName;
        successCourseName.textContent = courseName;
        successAppId.textContent = regId;

        // Display animated success card
        successCard.hidden = false;

        // Reset the form
        form.reset();
        ['full_name', 'email', 'phone', 'course', 'dob', 'gender', 'address'].forEach(clearFieldState);
        updateProgress();

      } else {
        // Validation / Server Error Flow
        if (result.errors && typeof result.errors === 'object') {
          Object.entries(result.errors).forEach(([field, message]) => {
            setFieldError(field, message);
          });
          const firstErrorGroup = form.querySelector('.form-group.has-error');
          if (firstErrorGroup) {
            firstErrorGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          alert(result.message || 'Submission failed. Please check your inputs.');
        }
      }

    } catch (error) {
      console.error('Fetch error:', error);
      alert('Network or server error. Please ensure your web server (Apache/PHP) is running.');
    } finally {
      // Restore submit button state
      btnSubmit.classList.remove('loading');
      btnSubmit.disabled = false;
      btnText.textContent = 'Submit Registration';
    }
  });

  // ==========================================================
  // 8. Register Another Student Button Handler
  // ==========================================================

  btnRegisterAnother.addEventListener('click', () => {
    successCard.hidden = true;
    updateProgress();
    fullNameInput.focus();
  });

  // Initial progress update on load
  updateProgress();
});
