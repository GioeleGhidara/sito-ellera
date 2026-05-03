const fs = require('fs');
let c = fs.readFileSync('public/la-pedaliamo-insieme-2026.html', 'utf8');

// Testo
c = c.replace(/Pre-registrati/g, 'Registrati');
c = c.replace(/pre-registrati/g, 'registrati');
c = c.replace(/Preregistrazione/g, 'Registrazione');
c = c.replace(/preregistrazione/g, 'registrazione');

// Pulsante 1 (Hero)
c = c.replace(
  /<button class="btn-primary" onclick="openModal\(\)">([\s\S]*?)<\/button>/,
  '<a href="#" class="btn-primary" target="_blank">$1</a>'
);

// Pulsante 2 (Banner)
c = c.replace(
  /<button class="btn-primary-sm" onclick="openModal\(\)">([\s\S]*?)<\/button>/,
  '<a href="#" class="btn-primary-sm" target="_blank">$1</a>'
);

fs.writeFileSync('public/la-pedaliamo-insieme-2026.html', c);
console.log('Fatto!');
