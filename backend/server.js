const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando!' });
});

// Determinar caminho do banco de dados
// Em produção, salvar na pasta de dados do usuário
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// Obter pasta de dados do usuário
let userDataPath;
if (process.env.ELECTRON_USER_DATA) {
  userDataPath = process.env.ELECTRON_USER_DATA;
} else if (isDev) {
  userDataPath = __dirname;
} else {
  // Fallback para APPDATA/HOME
  userDataPath = process.env.APPDATA || process.env.HOME || __dirname;
}

// Criar pasta data se não existir
const dataDir = path.join(userDataPath, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Caminho do banco de dados
const dbPath = path.join(dataDir, 'database.db');

// Migração automática de dados antigos
const oldDbPath = path.join(__dirname, 'database.db');
if (fs.existsSync(oldDbPath) && !fs.existsSync(dbPath)) {
  try {
    fs.copyFileSync(oldDbPath, dbPath);
    console.log('✅ Banco de dados migrado para:', dbPath);
  } catch (err) {
    console.error('❌ Erro ao migrar banco de dados:', err);
  }
}

console.log('📁 Banco de dados em:', dbPath);

console.log('Banco de dados em:', dbPath);

// Inicializar banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao abrir banco de dados:', err);
  } else {
    console.log('✅ Banco de dados aberto com sucesso');
  }
});

// Criar tabelas
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'calc3d-secret-key-change-in-production';

// Criar tabelas de forma síncrona
db.serialize(() => {
  console.log('📋 Criando tabelas...');
  
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) console.error('❌ Erro ao criar tabela users:', err);
    else console.log('✓ Tabela users criada');
  });

  db.run(`CREATE TABLE IF NOT EXISTS filamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    peso REAL NOT NULL,
    custo REAL NOT NULL
  )`, (err) => {
    if (err) console.error('❌ Erro ao criar tabela filamentos:', err);
    else console.log('✓ Tabela filamentos criada');
  });

  db.run(`CREATE TABLE IF NOT EXISTS maquinas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    potencia REAL NOT NULL,
    custoKwh REAL NOT NULL,
    depreciacao REAL NOT NULL
  )`, (err) => {
    if (err) console.error('❌ Erro ao criar tabela maquinas:', err);
    else console.log('✓ Tabela maquinas criada');
  });

  db.run(`CREATE TABLE IF NOT EXISTS projetos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    filamentoId INTEGER NOT NULL,
    maquinaId INTEGER NOT NULL,
    pesoUsado REAL NOT NULL,
    tempoHoras REAL NOT NULL,
    margemLucro REAL NOT NULL,
    FOREIGN KEY (filamentoId) REFERENCES filamentos(id),
    FOREIGN KEY (maquinaId) REFERENCES maquinas(id)
  )`, (err) => {
    if (err) console.error('❌ Erro ao criar tabela projetos:', err);
    else console.log('✓ Tabela projetos criada');
  });
  
  console.log('✅ Todas as tabelas foram processadas');
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔐 Autenticação:', { 
    hasAuthHeader: !!authHeader, 
    hasToken: !!token,
    path: req.path 
  });

  if (!token) {
    console.log('❌ Token não fornecido');
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ Token inválido:', err.message);
      return res.status(403).json({ error: 'Token inválido' });
    }
    console.log('✅ Token válido para usuário:', user.username);
    req.user = user;
    next();
  });
};

// ROTAS DE AUTENTICAÇÃO
app.post('/api/auth/register', async (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password são obrigatórios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Usuário já existe' });
          }
          return res.status(500).json({ error: err.message });
        }
        
        const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ 
          token, 
          user: { id: this.lastID, username, email }
        });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Usuário ou senha incorretos' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Usuário ou senha incorretos' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user.id, username: user.username, email: user.email }
    });
  });
});

// ROTAS - FILAMENTOS
app.get('/api/filamentos', authenticateToken, (req, res) => {
  console.log('📥 GET /api/filamentos');
  db.all('SELECT * FROM filamentos', [], (err, rows) => {
    if (err) {
      console.error('❌ Erro ao buscar filamentos:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log(`✅ Retornando ${rows ? rows.length : 0} filamentos`);
    res.json(rows || []);
  });
});

app.post('/api/filamentos', authenticateToken, (req, res) => {
  const { nome, tipo, peso, custo } = req.body;
  db.run(
    'INSERT INTO filamentos (nome, tipo, peso, custo) VALUES (?, ?, ?, ?)',
    [nome, tipo, peso, custo],
    function(err) {
      if (err) {
        console.error('Erro ao inserir filamento:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, nome, tipo, peso, custo });
    }
  );
});

app.put('/api/filamentos/:id', authenticateToken, (req, res) => {
  const { nome, tipo, peso, custo } = req.body;
  db.run(
    'UPDATE filamentos SET nome = ?, tipo = ?, peso = ?, custo = ? WHERE id = ?',
    [nome, tipo, peso, custo, req.params.id],
    (err) => {
      if (err) {
        console.error('Erro ao atualizar filamento:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Atualizado com sucesso' });
    }
  );
});

app.delete('/api/filamentos/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM filamentos WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error('Erro ao deletar filamento:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Deletado com sucesso' });
  });
});

// ROTAS - MÁQUINAS
app.get('/api/maquinas', authenticateToken, (req, res) => {
  db.all('SELECT * FROM maquinas', [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar máquinas:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

app.post('/api/maquinas', authenticateToken, (req, res) => {
  const { nome, potencia, custoKwh, depreciacao } = req.body;
  db.run(
    'INSERT INTO maquinas (nome, potencia, custoKwh, depreciacao) VALUES (?, ?, ?, ?)',
    [nome, potencia, custoKwh, depreciacao],
    function(err) {
      if (err) {
        console.error('Erro ao inserir máquina:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, nome, potencia, custoKwh, depreciacao });
    }
  );
});

app.put('/api/maquinas/:id', authenticateToken, (req, res) => {
  const { nome, potencia, custoKwh, depreciacao } = req.body;
  db.run(
    'UPDATE maquinas SET nome = ?, potencia = ?, custoKwh = ?, depreciacao = ? WHERE id = ?',
    [nome, potencia, custoKwh, depreciacao, req.params.id],
    (err) => {
      if (err) {
        console.error('Erro ao atualizar máquina:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Atualizado com sucesso' });
    }
  );
});

app.delete('/api/maquinas/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM maquinas WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error('Erro ao deletar máquina:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Deletado com sucesso' });
  });
});

// ROTAS - PROJETOS
app.get('/api/projetos', authenticateToken, (req, res) => {
  db.all('SELECT * FROM projetos', [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar projetos:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

app.post('/api/projetos', authenticateToken, (req, res) => {
  const { nome, filamentoId, maquinaId, pesoUsado, tempoHoras, margemLucro } = req.body;
  db.run(
    'INSERT INTO projetos (nome, filamentoId, maquinaId, pesoUsado, tempoHoras, margemLucro) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, filamentoId, maquinaId, pesoUsado, tempoHoras, margemLucro],
    function(err) {
      if (err) {
        console.error('Erro ao inserir projeto:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, nome, filamentoId, maquinaId, pesoUsado, tempoHoras, margemLucro });
    }
  );
});

app.put('/api/projetos/:id', authenticateToken, (req, res) => {
  const { nome, filamentoId, maquinaId, pesoUsado, tempoHoras, margemLucro } = req.body;
  db.run(
    'UPDATE projetos SET nome = ?, filamentoId = ?, maquinaId = ?, pesoUsado = ?, tempoHoras = ?, margemLucro = ? WHERE id = ?',
    [nome, filamentoId, maquinaId, pesoUsado, tempoHoras, margemLucro, req.params.id],
    (err) => {
      if (err) {
        console.error('Erro ao atualizar projeto:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Atualizado com sucesso' });
    }
  );
});

app.delete('/api/projetos/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM projetos WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      console.error('Erro ao deletar projeto:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Deletado com sucesso' });
  });
});

// ROTA - CALCULAR CUSTO
app.get('/api/projetos/:id/calcular', authenticateToken, (req, res) => {
  const projetoId = req.params.id;
  
  db.get('SELECT * FROM projetos WHERE id = ?', [projetoId], (err, projeto) => {
    if (err) {
      console.error('Erro ao buscar projeto:', err);
      return res.status(500).json({ error: err.message });
    }
    if (!projeto) return res.status(404).json({ error: 'Projeto não encontrado' });
    
    db.get('SELECT * FROM filamentos WHERE id = ?', [projeto.filamentoId], (err, filamento) => {
      if (err) {
        console.error('Erro ao buscar filamento:', err);
        return res.status(500).json({ error: err.message });
      }
      if (!filamento) return res.status(404).json({ error: 'Filamento não encontrado' });
      
      db.get('SELECT * FROM maquinas WHERE id = ?', [projeto.maquinaId], (err, maquina) => {
        if (err) {
          console.error('Erro ao buscar máquina:', err);
          return res.status(500).json({ error: err.message });
        }
        if (!maquina) return res.status(404).json({ error: 'Máquina não encontrada' });
        
        const custoFilamento = (filamento.custo / filamento.peso) * projeto.pesoUsado;
        const custoEnergia = (maquina.potencia / 1000) * projeto.tempoHoras * maquina.custoKwh;
        const custoDepreciacao = maquina.depreciacao * projeto.tempoHoras;
        const custoTotal = custoFilamento + custoEnergia + custoDepreciacao;
        const precoVenda = custoTotal * (1 + projeto.margemLucro / 100);
        
        res.json({
          custoFilamento,
          custoEnergia,
          custoDepreciacao,
          custoTotal,
          precoVenda,
          margemLucro: projeto.margemLucro
        });
      });
    });
  });
});

// Testar conexão com o banco
db.get("SELECT name FROM sqlite_master WHERE type='table'", [], (err, row) => {
  if (err) {
    console.error('❌ Erro ao conectar com banco de dados:', err);
  } else {
    console.log('✅ Banco de dados conectado');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  console.log(`📁 Banco de dados em: ${dbPath}`);
});
