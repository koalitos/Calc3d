const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const dbPath = isDev
  ? path.join(__dirname, 'database.db')
  : path.join(process.env.APPDATA || process.env.HOME, 'Calc3DPrint', 'database.db');

console.log('Migrando banco de dados em:', dbPath);

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('Verificando e adicionando colunas userId...');

  // Adicionar userId em filamentos se não existir
  db.run(`ALTER TABLE filamentos ADD COLUMN userId INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Erro ao adicionar userId em filamentos:', err.message);
    } else {
      console.log('✓ Coluna userId adicionada/verificada em filamentos');
    }
  });

  // Adicionar userId em maquinas se não existir
  db.run(`ALTER TABLE maquinas ADD COLUMN userId INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Erro ao adicionar userId em maquinas:', err.message);
    } else {
      console.log('✓ Coluna userId adicionada/verificada em maquinas');
    }
  });

  // Adicionar userId em projetos se não existir
  db.run(`ALTER TABLE projetos ADD COLUMN userId INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column')) {
      console.error('Erro ao adicionar userId em projetos:', err.message);
    } else {
      console.log('✓ Coluna userId adicionada/verificada em projetos');
    }
  });

  // Criar tabela users se não existir
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Erro ao criar tabela users:', err.message);
    } else {
      console.log('✓ Tabela users criada/verificada');
    }
  });

  setTimeout(() => {
    console.log('\n✅ Migração concluída!');
    db.close();
  }, 1000);
});
