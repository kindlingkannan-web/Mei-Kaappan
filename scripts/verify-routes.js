const http = require('http');

const routes = [
  '/',
  '/scanner',
  '/incidents',
  '/incidents/inc_8941',
  '/payment-check',
  '/device-exposure',
  '/threat-intel',
  '/alerts',
  '/guardian',
  '/reports',
  '/analytics',
  '/evaluation',
  '/settings',
];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${route}`, (res) => {
      resolve({ route, statusCode: res.statusCode });
    }).on('error', (err) => {
      resolve({ route, error: err.message });
    });
  });
}

async function run() {
  console.log('\nChecking all Mei-Kaappan routes on http://localhost:3000...\n');
  let allOk = true;
  for (const r of routes) {
    const result = await checkRoute(r);
    if (result.statusCode === 200) {
      console.log(`  \x1b[32m✔\x1b[0m ${r} -> 200 OK`);
    } else {
      console.error(`  \x1b[31m✘\x1b[0m ${r} -> ${result.statusCode || result.error}`);
      allOk = false;
    }
  }

  if (allOk) {
    console.log('\n\x1b[32mAll 13 routes verified and returned HTTP 200 OK!\x1b[0m\n');
  } else {
    process.exit(1);
  }
}

run();
