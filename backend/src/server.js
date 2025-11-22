const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'build');
  console.log('📁 Servindo frontend de:', frontendPath);
  app.use(express.static(frontendPath));
}

// Simulação de banco de dados em memória (temporário)
const users = [];

// Importar rotas
const shopeeRoutes = require('./routes/shopee');

// Usar rotas
app.use('/api/shopee', shopeeRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rota principal - servir index.html em produção
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    const indexPath = path.join(__dirname, '..', '..', 'frontend', 'build', 'index.html');
    res.sendFile(indexPath);
  } else {
    res.json({
      name: 'Calc 3D Print API',
      version: '1.0.0',
      status: 'online'
    });
  }
});

// Rota de registro
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;

  // Validações
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Usuário e senha são obrigatórios'
      }
    });
  }

  if (password.length < 4) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'A senha deve ter no mínimo 4 caracteres'
      }
    });
  }

  // Verificar se usuário já existe
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Nome de usuário já existe'
      }
    });
  }

  // Criar usuário
  const user = {
    id: users.length + 1,
    username,
    password, // Em produção, usar bcrypt para hash
    createdAt: new Date().toISOString()
  };

  users.push(user);

  console.log('✅ Usuário criado:', username);
  console.log('📊 Total de usuários:', users.length);

  // Retornar sem a senha
  const { password: _, ...userWithoutPassword } = user;

  res.status(201).json({
    success: true,
    message: 'Usuário criado com sucesso',
    data: {
      user: userWithoutPassword,
      token: 'fake-jwt-token-' + user.id // Em produção, usar JWT real
    }
  });
});

// Rota de login
app.post('/api/auth/login', (req, res) => {
  console.log('👥 Usuários cadastrados:', users.length);
  
  const { username, password } = req.body;

  // Validações
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Usuário e senha são obrigatórios'
      }
    });
  }

  // Buscar usuário
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    console.log('❌ Login falhou para:', username);
    return res.status(401).json({
      success: false,
      error: {
        message: 'Usuário ou senha incorretos'
      }
    });
  }

  console.log('✅ Login realizado:', username);

  // Retornar sem a senha
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    message: 'Login realizado com sucesso',
    data: {
      user: userWithoutPassword,
      token: 'fake-jwt-token-' + user.id // Em produção, usar JWT real
    }
  });
});

// Rota catch-all para React Router (deve ser a última rota)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '..', '..', 'frontend', 'build', 'index.html');
    res.sendFile(indexPath);
  });
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}`);
  console.log(`🌍 Modo: ${process.env.NODE_ENV || 'development'}`);
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Promise rejeitada:', error);
});
