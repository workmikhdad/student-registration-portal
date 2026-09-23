/**
 * Automated Verification Test Suite for Student Registration Form
 */

const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🎓 Starting Student Registration Test Suite...\n');
  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} - ${details}`);
    }
  }

  // 1. Static Assets Verification
  console.log('--- Static Assets Tests ---');
  try {
    const indexRes = await makeRequest({ hostname: 'localhost', port: 3000, path: '/', method: 'GET' });
    assert(indexRes.statusCode === 200, 'GET / returns HTTP 200');
    assert(indexRes.body.includes('Join Our Campus'), 'index.html contains Left Panel heading');
    assert(indexRes.body.includes('Student Registration'), 'index.html contains Right Panel form');
    assert(indexRes.body.includes('progress-bar-fill'), 'index.html contains progress bar');
    assert(indexRes.body.includes('success-card'), 'index.html contains success card');

    const cssRes = await makeRequest({ hostname: 'localhost', port: 3000, path: '/style.css', method: 'GET' });
    assert(cssRes.statusCode === 200, 'GET /style.css returns HTTP 200');
    assert(cssRes.body.includes('--bg-gradient-start: #e0f2fe'), 'style.css defines light blue gradient');
    assert(cssRes.body.includes('--panel-bg: #1e1b4b'), 'style.css defines deep indigo panel');

    const jsRes = await makeRequest({ hostname: 'localhost', port: 3000, path: '/script.js', method: 'GET' });
    assert(jsRes.statusCode === 200, 'GET /script.js returns HTTP 200');
    assert(jsRes.body.includes('updateProgress'), 'script.js implements progress bar calculation');
    assert(jsRes.body.includes('validatePhone'), 'script.js implements 10-digit phone validation');
  } catch (err) {
    assert(false, 'Static assets check', err.message);
  }

  // 2. API Submission & Validation Tests
  console.log('\n--- Server-Side Validation & API Tests ---');

  // Test 2.1: Empty submission
  try {
    const payload = JSON.stringify({});
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/submit.php',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, payload);

    const json = JSON.parse(res.body);
    assert(res.statusCode === 422, 'Empty POST /submit.php returns HTTP 422');
    assert(json.success === false, 'success is false for empty submission');
    assert(json.errors.full_name !== undefined, 'Returns full_name validation error');
    assert(json.errors.email !== undefined, 'Returns email validation error');
    assert(json.errors.phone !== undefined, 'Returns phone validation error');
    assert(json.errors.course !== undefined, 'Returns course validation error');
    assert(json.errors.dob !== undefined, 'Returns dob validation error');
    assert(json.errors.gender !== undefined, 'Returns gender validation error');
  } catch (err) {
    assert(false, 'Empty submission test', err.message);
  }

  // Test 2.2: Invalid phone (not 10 digits)
  try {
    const payload = JSON.stringify({
      full_name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '12345',
      course: 'BCA',
      dob: '2004-05-15',
      gender: 'Male'
    });
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/submit.php',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, payload);

    const json = JSON.parse(res.body);
    assert(res.statusCode === 422, 'Short phone returns HTTP 422');
    assert(json.errors.phone !== undefined, 'Catches non-10-digit phone error');
  } catch (err) {
    assert(false, 'Phone validation test', err.message);
  }

  // Test 2.3: Valid Student Registration
  try {
    const payload = JSON.stringify({
      full_name: 'Aanya Verma',
      email: 'aanya.verma@example.com',
      phone: '9876543210',
      course: 'BSc CS',
      dob: '2005-08-20',
      gender: 'Female',
      address: '42 Academic Way, Silicon City'
    });
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/submit.php',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, payload);

    const json = JSON.parse(res.body);
    assert(res.statusCode === 200, 'Valid submission returns HTTP 200 OK');
    assert(json.success === true, 'JSON response has success: true');
    assert(json.data.full_name === 'Aanya Verma', 'Response returns correct student name');
    assert(json.data.course === 'BSc CS', 'Response returns correct course');
    assert(json.data.id !== undefined, 'Response returns generated student id');
  } catch (err) {
    assert(false, 'Valid registration test', err.message);
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} / ${total} Passed (${Math.round((passed / total) * 100)}%)`);
  console.log(`========================================\n`);
}

runTests();
