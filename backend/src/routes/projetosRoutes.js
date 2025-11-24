const express = require('express');
const router = express.Router();
const { db } = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');

// Listar todos
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM projetos', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Criar
router.post('/', authenticateToken, (req, res) => {
  const { nome, filamentoId, maquinaId, pesoUsado, tempoHoras, margemLucro } = req.body;
  db.run(
    'INSERT INTO projetos (nome, filamentoId, maquinaId, pesoUsado, tempoHoras, margemLucro) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, filamentoId, maquinaId, pesoUsado, tempoHoras, margemLucro],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, nome, filamentoId, maquinaId, pesoUsado, tempoHoras, margemLucro });
    }
  );
});

// Atualizar
router.put('/:id', authenticateToken, (req, res) => {
  const { nome, filamentoId, maquinaId, pesoUsado, tempoHoras, margemLucro } = req.body;
  db.run(
    'UPDATE projetos SET nome = ?, filamentoId = ?, maquinaId = ?, pesoUsado = ?, tempoHoras = ?, margemLucro = ? WHERE id = ?',
    [nome, filamentoId, maquinaId, pesoUsado, tempoHoras, margemLucro, req.params.id],
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
  db.run('DELETE FROM projetos WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Deletado com sucesso' });
  });
});

// Calcular custo
router.get('/:id/calcular', authenticateToken, (req, res) => {
  const projetoId = req.params.id;
  
  db.get('SELECT * FROM projetos WHERE id = ?', [projetoId], (err, projeto) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!projeto) return res.status(404).json({ error: 'Projeto não encontrado' });
    
    db.get('SELECT * FROM filamentos WHERE id = ?', [projeto.filamentoId], (err, filamento) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!filamento) return res.status(404).json({ error: 'Filamento não encontrado' });
      
      db.get('SELECT * FROM maquinas WHERE id = ?', [projeto.maquinaId], (err, maquina) => {
        if (err) {
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

module.exports = router;
