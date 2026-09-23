# 🎓 Modern Student Registration Portal

A clean, modern, and responsive student registration system built using **HTML5, CSS3, JavaScript (ES6+), PHP, and MySQL**.

---

## 🌟 Key Features

- **Modern Dual-Panel Card Design**:
  - **Left Panel**: Deep indigo (`#1e1b4b`) with graduation cap icon 🎓, *"Join Our Campus"* heading, tagline, and 3 feature highlight cards (⚡ *Fast Process*, 🔒 *Secure Data*, ✉️ *Instant Confirmation*).
  - **Right Panel**: Form with soft background, light gray inputs, rounded corners (`border-radius: 10px`), and blue glowing focus borders (`#6366f1`).
- **Real-Time Validation & Interactivity (`script.js`)**:
  - Live validation on user input and blur events.
  - Phone validation (exactly 10 digits).
  - Email format verification.
  - Live progress bar tracking completion percentage (`0 to 6 completed`).
  - Smooth scroll to first error field on invalid submission.
  - Animated success card with SVG checkmark and student details.
  - Reset button that clears all fields, inline errors, and resets the progress bar.
- **Backend & Database (`submit.php`, `config.php`, `schema.sql`)**:
  - Input sanitization (`htmlspecialchars`, `filter_var`, `trim`).
  - Server-side validation mirroring all client rules.
  - MySQL persistence using **PDO prepared statements** to prevent SQL injection.
  - Non-blocking AJAX submission via `fetch()` (zero page reloads).
  - Clean JSON responses.

---

## 📂 Project Structure

```
d:/demo/
├── index.html          # Structure & modern dual-panel card
├── style.css           # Styling, gradients, glowing inputs & animations
├── script.js           # Real-time validation, live progress bar & AJAX
├── submit.php          # Server-side validation & PDO MySQL insertion
├── config.php          # PDO database connection & JSON helpers
├── schema.sql          # MySQL database schema (student_db -> students)
├── preview-server.js   # Zero-dependency Node.js dev & preview server
└── README.md           # Instructions & documentation
```

---

## 🚀 How to Run the Project

### Option 1: Quick Local Preview (Node.js)

If you have Node.js installed:
1. Open PowerShell / Command Prompt in this folder:
   ```bash
   node preview-server.js
   ```
2. Open your browser and go to:
   ```
   http://localhost:3000
   ```

---

### Option 2: Full-Stack Setup with XAMPP (Apache + MySQL)

1. **Start XAMPP**:
   - Open XAMPP Control Panel.
   - Start **Apache** and **MySQL**.

2. **Import Database Schema**:
   - Open **phpMyAdmin**: [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/)
   - Click the **Import** tab.
   - Select `schema.sql` from this folder and click **Go**.
   - This creates the `student_db` database and `students` table.

3. **Deploy the Code**:
   - Copy this folder into your XAMPP `htdocs` directory:
     - `C:\xampp\htdocs\student-registration\`

4. **Verify Database Credentials**:
   - Open `config.php` and verify lines:
     ```php
     define('DB_HOST', '127.0.0.1');
     define('DB_PORT', '3306');
     define('DB_NAME', 'student_db');
     define('DB_USER', 'root');
     define('DB_PASS', '');
     ```

5. **Open in Browser**:
   - Visit: [http://localhost/student-registration/](http://localhost/student-registration/)

---

## 📋 Database Schema Summary (`schema.sql`)

- **Database**: `student_db`
- **Table**: `students`
- **Columns**:
  - `id`: INT AUTO_INCREMENT PRIMARY KEY
  - `full_name`: VARCHAR(100) NOT NULL
  - `email`: VARCHAR(150) NOT NULL (with Index)
  - `phone`: VARCHAR(15) NOT NULL
  - `course`: VARCHAR(50) NOT NULL
  - `dob`: DATE NOT NULL
  - `gender`: VARCHAR(20) NOT NULL
  - `address`: TEXT NULL
  - `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
