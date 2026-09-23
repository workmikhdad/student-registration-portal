/**
 * Student Registration Preview Server (Node.js)
 * Serves static assets and provides mock /submit.php endpoint for instant preview.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = parsedUrl.pathname;

  // Mock /submit.php handler for testing in Node
  if (pathname === '/submit.php' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      let data = {};
      const contentType = req.headers['content-type'] || '';

      if (contentType.includes('application/json')) {
        try {
          data = JSON.parse(body);
        } catch (e) {
          data = {};
        }
      } else if (contentType.includes('multipart/form-data')) {
        const boundaryMatch = contentType.match(/boundary=(.+)$/);
        if (boundaryMatch) {
          const boundary = boundaryMatch[1];
          const parts = body.split(`--${boundary}`);
          for (const part of parts) {
            const nameMatch = part.match(/name="([^"]+)"/);
            if (nameMatch) {
              const fieldName = nameMatch[1];
              const value = part.split('\r\n\r\n')[1]?.replace(/\r\n$/, '') || '';
              data[fieldName] = value;
            }
          }
        }
      } else {
        data = querystring.parse(body);
      }

      const fullName = (data.full_name || '').trim();
      const email    = (data.email || '').trim();
      const phone    = (data.phone || '').trim();
      const course   = (data.course || '').trim();
      const dob      = (data.dob || '').trim();
      const gender   = (data.gender || '').trim();
      const address  = (data.address || '').trim();

      const errors = {};
      if (!fullName || fullName.length < 2) {
        errors.full_name = 'Full name must be at least 2 characters.';
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Please enter a valid email address.';
      }
      if (!phone || !/^[0-9]{10}$/.test(phone)) {
        errors.phone = 'Phone number must be exactly 10 digits.';
      }
      const allowedCourses = ['BCA', 'MCA', 'BSc CS', 'MSc CS', 'BBA', 'MBA'];
      if (!course || !allowedCourses.includes(course)) {
        errors.course = 'Please select a valid course.';
      }
      if (!dob) {
        errors.dob = 'Date of birth is required.';
      }
      const allowedGenders = ['Male', 'Female', 'Other'];
      if (!gender || !allowedGenders.includes(gender)) {
        errors.gender = 'Please select your gender.';
      }

      if (Object.keys(errors).length > 0) {
        res.writeHead(422, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Validation failed. Please correct the errors below.',
          data: {},
          errors
        }));
        return;
      }

      // Success Response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Registration Complete!',
        data: {
          id: Math.floor(100 + Math.random() * 900),
          full_name: fullName,
          course: course,
          email: email
        },
        errors: {}
      }));
    });
    return;
  }

  // Static File Serving
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const ext = path.extname(pathname).toLowerCase();
  const filePath = path.join(PUBLIC_DIR, pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🎓 Student Registration Server running at http://localhost:${PORT}`);
});
