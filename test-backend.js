// Script para testar o backend standalone
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

console.log('🧪 Testando Backend...\n');

const backendPath = path.join(__dirname, 'backend', 'src', 'server.js');
console.log('📁 Caminho:', backendPath);

const backendProcess = spawn('node', [backendPath], {
  cwd: path.join(__dirname, 'backend'),
  env: {
    ...process.env,
    PORT: 3001,
    NODE_ENV: 'production'
  }
});

backendProcess.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backendProcess.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

backendProcess.on('close', (code) => {
  console.log(`\n❌ Backend encerrou com código ${code}`);
  process.exit(code);
});

// Aguardar 3 segundos e testar
setTimeout(() => {
  console.log('\n🔍 Testando conexão...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/health',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Resposta:', data);
      console.log('\n✅ Backend está funcionando!');
      console.log('\n🌐 Teste no navegador: http://localhost:3001');
      console.log('🌐 API Health: http://localhost:3001/api/health');
      console.log('\n⏹️  Pressione Ctrl+C para parar');
    });
  });
  
  req.on('error', (err) => {
    console.error('❌ Erro ao conectar:', err.message);
    backendProcess.kill();
    process.exit(1);
  });
  
  req.end();
}, 3000);

// Ctrl+C para parar
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Parando backend...');
  backendProcess.kill();
  process.exit(0);
});
