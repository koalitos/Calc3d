const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initDatabase } = require('./src/utils/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 35001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar banco de dados
initDatabase();

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/filamentos', require('./src/routes/filamentosRoutes'));
app.use('/api/maquinas', require('./src/routes/maquinasRoutes'));
app.use('/api/projetos', require('./src/routes/projetosRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Servir frontend em produção
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  
  // Tentar diferentes caminhos (dev vs produção empacotada)
  let frontendPath = path.join(__dirname, '../frontend/build');
  
  // Se não existir, tentar caminho do app empacotado (resources/frontend/build)
  if (!fs.existsSync(frontendPath)) {
    frontendPath = path.join(__dirname, 'frontend/build');
  }
  
  console.log('📁 Servindo frontend de:', frontendPath);
  
  if (fs.existsSync(frontendPath)) {
    console.log('✅ Diretório do frontend encontrado');
    
    // Servir arquivos estáticos
    app.use(express.static(frontendPath));
    
    // Todas as outras rotas (não-API) servem o index.html
    app.get('*', (req, res) => {
      // Não servir index.html para rotas da API
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    console.error('❌ Diretório do frontend não encontrado:', frontendPath);
    console.error('❌ Execute: npm run build');
  }
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log('🚀 Calc 3D Print Backend - INICIADO');
  console.log('='.repeat(50));
  console.log(`🌐 Servidor: http://localhost:${PORT}`);
  console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 Diretório: ${__dirname}`);
  console.log('='.repeat(50));
});
