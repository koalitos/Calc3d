// Script para injetar a versão no loading.html
const fs = require('fs');
const path = require('path');

// Ler version.js do frontend
const versionPath = path.join(__dirname, '../frontend/src/config/version.js');
const versionContent = fs.readFileSync(versionPath, 'utf8');

// Extrair versão do arquivo
const versionMatch = versionContent.match(/APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
const version = versionMatch ? versionMatch[1] : '1.0.0';

// Ler loading.html
const loadingPath = path.join(__dirname, '../loading.html');
let loadingHtml = fs.readFileSync(loadingPath, 'utf8');

// Substituir a versão
loadingHtml = loadingHtml.replace(
  /<div class="version" id="app-version">v[\d.]+<\/div>/,
  `<div class="version" id="app-version">v${version}</div>`
);

// Salvar
fs.writeFileSync(loadingPath, loadingHtml, 'utf8');

console.log(`✅ Versão ${version} injetada no loading.html (de frontend/src/config/version.js)`);
