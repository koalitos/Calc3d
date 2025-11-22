const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🔍 Verificando configuração do Calc 3D Print...\n');

// Verificar arquivos essenciais
const essentialFiles = [
  'electron.js',
  'loading.html',
  'package.json',
  'backend/package.json',
  'frontend/package.json',
  'build/icon.ico',
  'build/icon.icns'
];

console.log('📁 Verificando arquivos essenciais:');
let allFilesExist = true;
essentialFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Verificar node_modules
console.log('\n📦 Verificando dependências:');
const nodeModulesDirs = [
  'node_modules',
  'backend/node_modules',
  'frontend/node_modules'
];

nodeModulesDirs.forEach(dir => {
  const exists = fs.existsSync(path.join(__dirname, '..', dir));
  console.log(`  ${exists ? '✅' : '❌'} ${dir}`);
  if (!exists) {
    console.log(`     ⚠️  Execute: cd ${path.dirname(dir)} && npm install`);
  }
});

// Verificar portas
console.log('\n🔌 Verificando portas:');

function checkPort(port, name) {
  return new Promise((resolve) => {
    const server = http.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`  ⚠️  Porta ${port} (${name}) está em uso`);
        resolve(false);
      } else {
        resolve(true);
      }
    });
    
    server.once('listening', () => {
      server.close();
      console.log(`  ✅ Porta ${port} (${name}) disponível`);
      resolve(true);
    });
    
    server.listen(port);
  });
}

async function checkPorts() {
  await checkPort(3000, 'Frontend');
  await checkPort(3001, 'Backend');
  
  console.log('\n📋 Resumo:');
  if (allFilesExist) {
    console.log('  ✅ Todos os arquivos essenciais estão presentes');
  } else {
    console.log('  ❌ Alguns arquivos estão faltando');
  }
  
  console.log('\n🚀 Para iniciar o app em desenvolvimento:');
  console.log('  npm run dev');
  console.log('\n📦 Para criar o instalador:');
  console.log('  npm run dist:win');
  console.log('\n📖 Para mais informações:');
  console.log('  Veja QUICK-START.md');
}

checkPorts();
