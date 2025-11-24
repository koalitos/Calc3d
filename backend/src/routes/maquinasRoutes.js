const express = require('express');
const router = express.Router();
const { db } = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');

// Listar todas
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM maquinas', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Criar
router.post('/', authenticateToken, (req, res) => {
  const { nome, potencia, custoKwh, depreciacao } = req.body;
  db.run(
    'INSERT INTO maquinas (nome, potencia, custoKwh, depreciacao) VALUES (?, ?, ?, ?)',
    [nome, potencia, custoKwh, depreciacao],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, nome, potencia, custoKwh, depreciacao });
    }
  );
});

// Atualizar
router.put('/:id', authenticateToken, (req, res) => {
  const { nome, potencia, custoKwh, depreciacao } = req.body;
  db.run(
    'UPDATE maquinas SET nome = ?, potencia = ?, custoKwh = ?, depreciacao = ? WHERE id = ?',
    [nome, potencia, custoKwh, depreciacao, req.params.id],
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
  db.run('DELETE FROM maquinas WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Deletado com sucesso' });
  });
});

module.exports = router;
