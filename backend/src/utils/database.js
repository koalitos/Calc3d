const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Determinar o caminho correto para os dados do usuário
let userDataPath;

// Se estiver rodando no Electron, usar app.getPath('userData')
if (process.env.ELECTRON_USER_DATA) {
  userDataPath = process.env.ELECTRON_USER_DATA;
} else {
  // Fallback para desenvolvimento
  userDataPath = path.join(__dirname, '../..');
}

// Criar diretório de dados se não existir
const dataDir = path.join(userDataPath, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Diretório de dados criado:', dataDir);
}

const dbPath = path.join(dataDir, 'database.db');
console.log('📊 Banco de dados:', dbPath);

// Migração automática: copiar banco antigo se existir
const oldDbPath = path.join(__dirname, '../../database.db');
if (fs.existsSync(oldDbPath) && !fs.existsSync(dbPath)) {
  console.log('🔄 Migrando banco de dados antigo...');
  try {
    fs.copyFileSync(oldDbPath, dbPath);
    console.log('✅ Banco de dados migrado com sucesso!');
    console.log('   De:', oldDbPath);
    console.log('   Para:', dbPath);
  } catch (err) {
    console.error('❌ Erro ao migrar banco de dados:', err);
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao abrir banco de dados:', err);
  } else {
    console.log('✅ Banco de dados conectado');
  }
});

function initDatabase() {
  db.serialize(() => {
    console.log('📋 Inicializando tabelas...');

    // Tabela de usuários
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

    // Tabela de filamentos
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

    // Tabela de máquinas
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

    // Tabela de projetos
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

    console.log('✅ Database initialized');
  });
}

module.exports = { db, initDatabase };
