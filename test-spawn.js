const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testando spawn do backend...');
console.log('');

const backendPath = path.join(__dirname, 'backend', 'src', 'server.js');
console.log('📁 Caminho:', backendPath);

const fs = require('fs');
if (!fs.existsSync(backendPath)) {
  console.error('❌ Arquivo não encontrado!');
  process.exit(1);
}
console.log('✅ Arquivo existe');
console.log('');

console.log('🚀 Iniciando processo...');
const backendProcess = spawn('node', [backendPath], {
  cwd: path.join(__dirname, 'backend'),
  env: {
    ...process.env,
    PORT: 35001,
    NODE_ENV: 'development'
  }
});

backendProcess.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backendProcess.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

backendProcess.on('close', (code, signal) => {
  console.log('');
  console.log(`❌ Processo encerrou - Código: ${code}, Signal: ${signal}`);
  process.exit(code || 0);
});

backendProcess.on('error', (err) => {
  console.error('');
  console.error('❌ Erro ao iniciar:', err);
  process.exit(1);
});

// Aguardar 5 segundos e então testar
setTimeout(() => {
  console.log('');
  console.log('📡 Testando conexão...');
  
  const http = require('http');
  const options = {
    hostname: 'localhost',
    port: 35001,
    path: '/api/health',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('✅ Resposta:', data);
      console.log('');
      console.log('✅ Teste passou! Backend está funcionando.');
      console.log('');
      console.log('Matando processo...');
      backendProcess.kill();
    });
  });
  
  req.on('error', (err) => {
    console.error('❌ Erro na conexão:', err.message);
    backendProcess.kill();
  });
  
  req.end();
}, 5000);

console.log('⏳ Aguardando 5 segundos...');
