const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✅ Banco de dados deletado com sucesso!');
  console.log('Execute "npm start" para criar um novo banco.');
} else {
  console.log('ℹ️ Banco de dados não existe.');
}
