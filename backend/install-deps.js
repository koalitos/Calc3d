// Script para instalar dependências do backend em produção
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const backendPath = path.join(__dirname);
const nodeModulesPath = path.join(backendPath, 'node_modules');

// Verificar se node_modules existe
if (!fs.existsSync(nodeModulesPath)) {
  console.log('Instalando dependências do backend...');
  try {
    execSync('npm install --production', {
      cwd: backendPath,
      stdio: 'inherit'
    });
    console.log('Dependências instaladas com sucesso!');
  } catch (err) {
    console.error('Erro ao instalar dependências:', err);
  }
}
