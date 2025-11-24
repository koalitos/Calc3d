const express = require('express');
const router = express.Router();
const { db } = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');

// Listar todos
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM filamentos', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Criar
router.post('/', authenticateToken, (req, res) => {
  const { nome, tipo, peso, custo } = req.body;
  db.run(
    'INSERT INTO filamentos (nome, tipo, peso, custo) VALUES (?, ?, ?, ?)',
    [nome, tipo, peso, custo],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, nome, tipo, peso, custo });
    }
  );
});

// Atualizar
router.put('/:id', authenticateToken, (req, res) => {
  const { nome, tipo, peso, custo } = req.body;
  db.run(
    'UPDATE filamentos SET nome = ?, tipo = ?, peso = ?, custo = ? WHERE id = ?',
    [nome, tipo, peso, custo, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Atualizado com sucesso' });
    }
  );
});

// Deletar
router.delete('/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM filamentos WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Deletado com sucesso' });
  });
});

module.exports = router;
