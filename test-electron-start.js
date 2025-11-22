#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

console.log('🧪 Simulando inicialização do Electron...');
console.log('');

const backendPath = path.join(__dirname, 'backend', 'src', 'server.js');
const backendCwd = path.join(__dirname, 'backend');

console.log('📁 Backend path:', backendPath);
console.log('📁 Backend cwd:', backendCwd);
console.log('');

// Verificar se o arquivo existe
const fs = require('fs');
if (!fs.existsSync(backendPath)) {
  console.error('❌ Arquivo do backend não encontrado!');
  process.exit(1);
}

console.log('🚀 Iniciando backend...');
const backendProcess = spawn('node', [backendPath], {
  cwd: backendCwd,
  env: {
    ...process.env,
    PORT: 3001,
    NODE_ENV: 'development'
  },
  stdio: ['ignore', 'pipe', 'pipe']
});

console.log('✅ Processo iniciado (PID:', backendProcess.pid, ')');
console.log('');

backendProcess.stdout.on('data', (data) => {
  const message = data.toString().trim();
  if (message) {
    console.log(`[Backend] ${message}`);
  }
});

backendProcess.stderr.on('data', (data) => {
  const message = data.toString().trim();
  if (message) {
    console.error(`[Backend Error] ${message}`);
  }
});

backendProcess.on('close', (code, signal) => {
  console.log('');
  console.log(`❌ Backend encerrou - Código: ${code}, Signal: ${signal}`);
  if (code !== 0 && code !== null) {
    console.error('❌ Backend encerrou com erro!');
  }
});

backendProcess.on('error', (err) => {
  console.error('');
  console.error('❌ Erro ao iniciar backend:', err);
});

// Função para verificar se o backend está pronto
function checkBackendReady(retries = 0) {
  const maxRetries = 40;
  
  if (retries === 0) {
    console.log('🔍 Verificando se backend está pronto...');
  }
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET',
      timeout: 2000
    };
    
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Backend está pronto!');
        resolve(true);
      } else {
        if (retries < maxRetries) {
          if (retries % 4 === 0) {
            console.log(`⏳ Aguardando... (${retries + 1}/${maxRetries})`);
          }
          setTimeout(() => {
            checkBackendReady(retries + 1).then(resolve);
          }, 500);
        } else {
          console.log('⚠️ Backend não respondeu');
          resolve(false);
        }
      }
    });
    
    req.on('error', (err) => {
      if (retries < maxRetries) {
        if (retries % 4 === 0) {
          console.log(`⏳ Aguardando... (${retries + 1}/${maxRetries}) - ${err.code}`);
        }
        setTimeout(() => {
          checkBackendReady(retries + 1).then(resolve);
        }, 500);
      } else {
        console.log('⚠️ Backend não respondeu');
        console.log('⚠️ Último erro:', err.message);
        resolve(false);
      }
    });
    
    req.on('timeout', () => {
      req.destroy();
      if (retries < maxRetries) {
        setTimeout(() => {
          checkBackendReady(retries + 1).then(resolve);
        }, 500);
      } else {
        resolve(false);
      }
    });
    
    req.end();
  });
}

// Aguardar e verificar
setTimeout(async () => {
  const ready = await checkBackendReady();
  
  console.log('');
  if (ready) {
    console.log('✅ SUCESSO! Backend iniciou corretamente.');
    console.log('');
    console.log('Isso significa que o Electron deveria funcionar.');
    console.log('Se o Electron ainda falhar, o problema é outra coisa.');
  } else {
    console.log('❌ FALHA! Backend não respondeu.');
    console.log('');
    console.log('Verifique os logs acima para ver o erro.');
  }
  
  console.log('');
  console.log('Encerrando teste em 2 segundos...');
  setTimeout(() => {
    backendProcess.kill();
    setTimeout(() => process.exit(ready ? 0 : 1), 500);
  }, 2000);
}, 1000);
