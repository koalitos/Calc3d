import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { AuthScreen } from './components/Auth';
import { analyzeSTL } from './utils/stlAnalyzer';

const API_URL = 'http://localhost:35001/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('projetos');
  const [filamentos, setFilamentos] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [custos, setCustos] = useState({});

  // Verificar se há usuário logado
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Carregar dados quando usuário estiver logado
  useEffect(() => {
    if (!user || !token) return;

    const loadData = async () => {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      try {
        // Carregar filamentos
        const filamentosRes = await fetch(`${API_URL}/filamentos`, { headers });
        const filamentosData = await filamentosRes.json();
        setFilamentos(Array.isArray(filamentosData) ? filamentosData : []);

        // Carregar máquinas
        const maquinasRes = await fetch(`${API_URL}/maquinas`, { headers });
        const maquinasData = await maquinasRes.json();
        setMaquinas(Array.isArray(maquinasData) ? maquinasData : []);

        // Carregar projetos
        const projetosRes = await fetch(`${API_URL}/projetos`, { headers });
        const projetosData = await projetosRes.json();
        setProjetos(Array.isArray(projetosData) ? projetosData : []);

        // Calcular custos de cada projeto
        if (Array.isArray(projetosData)) {
          for (const projeto of projetosData) {
            const custoRes = await fetch(`${API_URL}/projetos/${projeto.id}/calcular`, { headers });
            const custoData = await custoRes.json();
            setCustos(prev => ({ ...prev, [projeto.id]: custoData }));
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setFilamentos([]);
        setMaquinas([]);
        setProjetos([]);
      }
    };

    loadData();
  }, [user, token]);

  const loadFilamentos = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/filamentos`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setFilamentos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar filamentos:', err);
      setFilamentos([]);
    }
  }, [token]);

  const loadMaquinas = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/maquinas`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setMaquinas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar máquinas:', err);
      setMaquinas([]);
    }
  }, [token]);

  const loadProjetos = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/projetos`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setProjetos(Array.isArray(data) ? data : []);
      
      if (Array.isArray(data)) {
        for (const projeto of data) {
          const custoRes = await fetch(`${API_URL}/projetos/${projeto.id}/calcular`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          const custoData = await custoRes.json();
          setCustos(prev => ({ ...prev, [projeto.id]: custoData }));
        }
      }
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
      setProjetos([]);
    }
  }, [token]);

  if (!user || !token) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>💎 Calc 3D</h1>
          <div className="user-info">
            <strong>👤 {user.username}</strong>
            <small>Logado</small>
          </div>
        </div>
        
        <nav>
          <button 
            className={activeTab === 'projetos' ? 'active' : ''} 
            onClick={() => setActiveTab('projetos')}
          >
            📦 Projetos
          </button>
          <button 
            className={activeTab === 'filamentos' ? 'active' : ''} 
            onClick={() => setActiveTab('filamentos')}
          >
            🧵 Filamentos
          </button>
          <button 
            className={activeTab === 'maquinas' ? 'active' : ''} 
            onClick={() => setActiveTab('maquinas')}
          >
            🖨️ Máquinas
          </button>
          
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Sair
          </button>
        </nav>
      </div>

      <div className="content">
        {activeTab === 'filamentos' && (
          <Filamentos filamentos={filamentos} reload={loadFilamentos} token={token} />
        )}
        {activeTab === 'maquinas' && (
          <Maquinas maquinas={maquinas} reload={loadMaquinas} token={token} />
        )}
        {activeTab === 'projetos' && (
          <Projetos 
            projetos={projetos}
            filamentos={filamentos}
            maquinas={maquinas}
            custos={custos}
            reload={loadProjetos}
            token={token}
          />
        )}
      </div>
    </div>
  );
}

// Modal de Edição
function EditModal({ title, children, onClose, onSave }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {children}
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
          <button className="save-btn" onClick={onSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

// Componente de Filamentos
function Filamentos({ filamentos, reload, token }) {
  const [form, setForm] = useState({ nome: '', tipo: 'PLA', peso: 1000, custo: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const addFilamento = async () => {
    if (!form.nome) return alert('Preencha o nome do filamento');
    try {
      await fetch(`${API_URL}/filamentos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(form)
      });
      setForm({ nome: '', tipo: 'PLA', peso: 1000, custo: 0 });
      reload();
    } catch (err) {
      alert('Erro ao adicionar filamento');
    }
  };

  const startEdit = (filamento) => {
    setEditingId(filamento.id);
    setEditForm(filamento);
  };

  const saveEdit = async () => {
    try {
      await fetch(`${API_URL}/filamentos/${editingId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(editForm)
      });
      setEditingId(null);
      reload();
    } catch (err) {
      alert('Erro ao editar filamento');
    }
  };

  const removeFilamento = async (id) => {
    if (!window.confirm('Deseja realmente excluir?')) return;
    try {
      await fetch(`${API_URL}/filamentos/${id}`, { 
        method: 'DELETE',
        headers: getHeaders()
      });
      reload();
    } catch (err) {
      alert('Erro ao remover filamento');
    }
  };

  return (
    <div className="section">
      <h2>Cadastro de Filamentos</h2>
      
      <div className="form">
        <div className="form-field">
          <label>Nome do Filamento</label>
          <input
            placeholder="Ex: PLA Preto"
            value={form.nome}
            onChange={(e) => setForm({...form, nome: e.target.value})}
          />
        </div>
        
        <div className="form-field">
          <label>Tipo</label>
          <select value={form.tipo} onChange={(e) => setForm({...form, tipo: e.target.value})}>
            <option>PLA</option>
            <option>ABS</option>
            <option>PETG</option>
            <option>TPU</option>
            <option>Nylon</option>
          </select>
        </div>
        
        <div className="form-field">
          <label>Peso do Rolo (g)</label>
          <input
            type="number"
            placeholder="1000"
            value={form.peso}
            onChange={(e) => setForm({...form, peso: parseFloat(e.target.value)})}
          />
        </div>
        
        <div className="form-field">
          <label>Custo (R$)</label>
          <input
            type="number"
            placeholder="0.00"
            value={form.custo}
            onChange={(e) => setForm({...form, custo: parseFloat(e.target.value)})}
          />
        </div>
        
        <button onClick={addFilamento}>➕ Adicionar</button>
      </div>

      <div className="list">
        {Array.isArray(filamentos) && filamentos.map(f => (
          <div key={f.id} className="item">
            <div>
              <strong>{f.nome}</strong> - {f.tipo}
              <br />
              <small>{f.peso}g - R$ {f.custo.toFixed(2)} (R$ {(f.custo / f.peso).toFixed(2)}/g)</small>
            </div>
            <div className="item-actions">
              <button className="edit-btn" onClick={() => startEdit(f)}>✏️ Editar</button>
              <button className="delete-btn" onClick={() => removeFilamento(f.id)}>🗑️ Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <EditModal 
          title="Editar Filamento" 
          onClose={() => setEditingId(null)}
          onSave={saveEdit}
        >
          <div className="form">
            <div className="form-field">
              <label>Nome</label>
              <input
                placeholder="Nome"
                value={editForm.nome}
                onChange={(e) => setEditForm({...editForm, nome: e.target.value})}
              />
            </div>
            
            <div className="form-field">
              <label>Tipo</label>
              <select value={editForm.tipo} onChange={(e) => setEditForm({...editForm, tipo: e.target.value})}>
                <option>PLA</option>
                <option>ABS</option>
                <option>PETG</option>
                <option>TPU</option>
                <option>Nylon</option>
              </select>
            </div>
            
            <div className="form-field">
              <label>Peso (g)</label>
              <input
                type="number"
                placeholder="Peso (g)"
                value={editForm.peso}
                onChange={(e) => setEditForm({...editForm, peso: parseFloat(e.target.value)})}
              />
            </div>
            
            <div className="form-field">
              <label>Custo (R$)</label>
              <input
                type="number"
                placeholder="Custo (R$)"
                value={editForm.custo}
                onChange={(e) => setEditForm({...editForm, custo: parseFloat(e.target.value)})}
              />
            </div>
          </div>
        </EditModal>
      )}
    </div>
  );
}

// Componente de Máquinas
function Maquinas({ maquinas, reload, token }) {
  const [form, setForm] = useState({ nome: '', potencia: 200, custoKwh: 0.65, depreciacao: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const addMaquina = async () => {
    if (!form.nome) return alert('Preencha o nome da máquina');
    try {
      await fetch(`${API_URL}/maquinas`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(form)
      });
      setForm({ nome: '', potencia: 200, custoKwh: 0.65, depreciacao: 0 });
      reload();
    } catch (err) {
      alert('Erro ao adicionar máquina');
    }
  };

  const startEdit = (maquina) => {
    setEditingId(maquina.id);
    setEditForm(maquina);
  };

  const saveEdit = async () => {
    try {
      await fetch(`${API_URL}/maquinas/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      setEditingId(null);
      reload();
    } catch (err) {
      alert('Erro ao editar máquina');
    }
  };

  const removeMaquina = async (id) => {
    if (!window.confirm('Deseja realmente excluir?')) return;
    try {
      await fetch(`${API_URL}/maquinas/${id}`, { 
        method: 'DELETE',
        headers: getHeaders()
      });
      reload();
    } catch (err) {
      alert('Erro ao remover máquina');
    }
  };

  return (
    <div className="section">
      <h2>Cadastro de Máquinas</h2>
      
      <div className="form">
        <div className="form-field">
          <label>Nome da Impressora</label>
          <input
            placeholder="Ex: Ender 3"
            value={form.nome}
            onChange={(e) => setForm({...form, nome: e.target.value})}
          />
        </div>
        
        <div className="form-field">
          <label>Potência (W)</label>
          <input
            type="number"
            placeholder="200"
            value={form.potencia}
            onChange={(e) => setForm({...form, potencia: parseFloat(e.target.value)})}
          />
        </div>
        
        <div className="form-field">
          <label>Custo kWh (R$)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.65"
            value={form.custoKwh}
            onChange={(e) => setForm({...form, custoKwh: parseFloat(e.target.value)})}
          />
        </div>
        
        <div className="form-field">
          <label>Depreciação por Hora (R$)</label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.depreciacao}
            onChange={(e) => setForm({...form, depreciacao: parseFloat(e.target.value)})}
          />
        </div>
        
        <button onClick={addMaquina}>➕ Adicionar</button>
      </div>

      <div className="list">
        {Array.isArray(maquinas) && maquinas.map(m => (
          <div key={m.id} className="item">
            <div>
              <strong>{m.nome}</strong>
              <br />
              <small>{m.potencia}W - R$ {m.custoKwh}/kWh - Depreciação: R$ {m.depreciacao}/h</small>
            </div>
            <div className="item-actions">
              <button className="edit-btn" onClick={() => startEdit(m)}>✏️ Editar</button>
              <button className="delete-btn" onClick={() => removeMaquina(m.id)}>🗑️ Excluir</button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <EditModal 
          title="Editar Máquina" 
          onClose={() => setEditingId(null)}
          onSave={saveEdit}
        >
          <div className="form">
            <div className="form-field">
              <label>Nome</label>
              <input
                placeholder="Nome"
                value={editForm.nome}
                onChange={(e) => setEditForm({...editForm, nome: e.target.value})}
              />
            </div>
            
            <div className="form-field">
              <label>Potência (W)</label>
              <input
                type="number"
                placeholder="Potência (W)"
                value={editForm.potencia}
                onChange={(e) => setEditForm({...editForm, potencia: parseFloat(e.target.value)})}
              />
            </div>
            
            <div className="form-field">
              <label>Custo kWh (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Custo kWh (R$)"
                value={editForm.custoKwh}
                onChange={(e) => setEditForm({...editForm, custoKwh: parseFloat(e.target.value)})}
              />
            </div>
            
            <div className="form-field">
              <label>Depreciação/hora (R$)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Depreciação/hora (R$)"
                value={editForm.depreciacao}
                onChange={(e) => setEditForm({...editForm, depreciacao: parseFloat(e.target.value)})}
              />
            </div>
          </div>
        </EditModal>
      )}
    </div>
  );
}

// Componente de Projetos
function Projetos({ projetos, filamentos, maquinas, custos, reload, token }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    filamentoId: '',
    maquinaId: '',
    pesoUsado: 0,
    tempoHoras: 0,
    margemLucro: 50,
    observacoes: ''
  });
  const [stlFile, setStlFile] = useState(null);
  const [analyzingSTL, setAnalyzingSTL] = useState(false);
  const [stlAnalysis, setStlAnalysis] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.name.endsWith('.stl')) {
        setStlFile(file);
        setAnalyzingSTL(true);
        
        try {
          // Analisar o arquivo STL
          const analysis = await analyzeSTL(file);
          setStlAnalysis(analysis);
          
          // Preencher automaticamente os campos
          setForm({
            ...form,
            pesoUsado: parseFloat(analysis.estimatedWeight),
            tempoHoras: parseFloat(analysis.estimatedTimeHours)
          });
          
          setAnalyzingSTL(false);
        } catch (error) {
          console.error('Erro ao analisar STL:', error);
          setAnalyzingSTL(false);
          alert(`Erro ao analisar arquivo: ${error.message}\n\nVocê pode preencher os campos manualmente.`);
        }
      } else {
        alert('Por favor, selecione um arquivo .stl');
      }
    }
  };

  const addProjeto = async () => {
    if (!form.nome || !form.filamentoId || !form.maquinaId) {
      return alert('Preencha todos os campos obrigatórios');
    }
    try {
      await fetch(`${API_URL}/projetos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(form)
      });
      setForm({
        nome: '',
        filamentoId: '',
        maquinaId: '',
        pesoUsado: 0,
        tempoHoras: 0,
        margemLucro: 50,
        observacoes: ''
      });
      setStlFile(null);
      setShowAddModal(false);
      reload();
    } catch (err) {
      alert('Erro ao adicionar projeto');
    }
  };

  const startEdit = (projeto) => {
    setEditingId(projeto.id);
    setEditForm(projeto);
  };

  const saveEdit = async () => {
    try {
      await fetch(`${API_URL}/projetos/${editingId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(editForm)
      });
      setEditingId(null);
      reload();
    } catch (err) {
      alert('Erro ao editar projeto');
    }
  };

  const removeProjeto = async (id) => {
    if (!window.confirm('Deseja realmente excluir?')) return;
    try {
      await fetch(`${API_URL}/projetos/${id}`, { 
        method: 'DELETE',
        headers: getHeaders()
      });
      reload();
    } catch (err) {
      alert('Erro ao remover projeto');
    }
  };

  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Projetos / Peças</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}
        >
          ➕ Novo Projeto
        </button>
      </div>

      <div className="list">
        {Array.isArray(projetos) && projetos.map(p => {
          const custo = custos[p.id] || {};
          const filamento = filamentos.find(f => f.id === parseInt(p.filamentoId));
          const maquina = maquinas.find(m => m.id === parseInt(p.maquinaId));

          return (
            <div key={p.id} className="item projeto-item">
              <div>
                <strong>{p.nome}</strong>
                <br />
                <small>
                  {filamento?.nome} | {maquina?.nome} | {p.pesoUsado}g | {p.tempoHoras}h
                </small>
                <div className="custo-detalhes">
                  <div>Filamento: R$ {custo.custoFilamento?.toFixed(2) || '0.00'}</div>
                  <div>Energia: R$ {custo.custoEnergia?.toFixed(2) || '0.00'}</div>
                  <div>Depreciação: R$ {custo.custoDepreciacao?.toFixed(2) || '0.00'}</div>
                  <div className="custo-total">Custo Total: R$ {custo.custoTotal?.toFixed(2) || '0.00'}</div>
                  <div className="preco-venda">
                    💰 Preço de Venda: R$ {custo.precoVenda?.toFixed(2) || '0.00'} ({p.margemLucro}% lucro)
                  </div>
                </div>
              </div>
              <div className="item-actions">
                <button className="edit-btn" onClick={() => startEdit(p)}>✏️ Editar</button>
                <button className="delete-btn" onClick={() => removeProjeto(p.id)}>🗑️ Excluir</button>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>➕ Novo Projeto</h3>
            
            <div className="form">
              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Arquivo STL (Opcional)</label>
                <div className={`file-upload ${stlFile ? 'has-file' : ''}`}>
                  <input
                    type="file"
                    id="stl-upload"
                    accept=".stl"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="stl-upload" className="file-upload-label">
                    <div className="file-upload-icon">
                      {stlFile ? '✅' : '📁'}
                    </div>
                    <div className="file-info">
                      {analyzingSTL ? (
                        <>
                          <div style={{ color: '#667eea' }}>⏳ Analisando arquivo...</div>
                          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            Calculando volume e estimativas
                          </div>
                        </>
                      ) : stlFile ? (
                        <>
                          <div className="file-name">{stlFile.name}</div>
                          <div>{(stlFile.size / 1024).toFixed(2)} KB</div>
                          {stlAnalysis && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#27ae60' }}>
                              <div>📦 Volume: {stlAnalysis.volumeCM3} cm³</div>
                              <div>⚖️ Peso: ~{stlAnalysis.estimatedWeight}g</div>
                              <div>⏱️ Tempo: ~{stlAnalysis.estimatedTimeHours}h</div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div>Clique para selecionar arquivo STL</div>
                          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            O arquivo será analisado automaticamente
                          </div>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-field">
                <label>Nome do Projeto *</label>
                <input
                  placeholder="Ex: Torre 3D"
                  value={form.nome}
                  onChange={(e) => setForm({...form, nome: e.target.value})}
                />
              </div>
              
              <div className="form-field">
                <label>Filamento *</label>
                <select 
                  value={form.filamentoId} 
                  onChange={(e) => setForm({...form, filamentoId: e.target.value})}
                >
                  <option value="">Selecione o filamento</option>
                  {Array.isArray(filamentos) && filamentos.map(f => (
                    <option key={f.id} value={f.id}>{f.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Máquina *</label>
                <select 
                  value={form.maquinaId} 
                  onChange={(e) => setForm({...form, maquinaId: e.target.value})}
                >
                  <option value="">Selecione a máquina</option>
                  {Array.isArray(maquinas) && maquinas.map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Peso Usado (g) *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.pesoUsado}
                  onChange={(e) => setForm({...form, pesoUsado: parseFloat(e.target.value)})}
                />
              </div>

              <div className="form-field">
                <label>Tempo de Impressão (horas) *</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={form.tempoHoras}
                  onChange={(e) => setForm({...form, tempoHoras: parseFloat(e.target.value)})}
                />
              </div>

              <div className="form-field">
                <label>Margem de Lucro (%)</label>
                <input
                  type="number"
                  placeholder="50"
                  value={form.margemLucro}
                  onChange={(e) => setForm({...form, margemLucro: parseFloat(e.target.value)})}
                />
              </div>

              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label>Observações</label>
                <textarea
                  placeholder="Adicione observações sobre o projeto..."
                  value={form.observacoes}
                  onChange={(e) => setForm({...form, observacoes: e.target.value})}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                Cancelar
              </button>
              <button className="save-btn" onClick={addProjeto}>
                Adicionar Projeto
              </button>
            </div>
          </div>
        </div>
      )}

      {editingId && (
        <EditModal 
          title="Editar Projeto" 
          onClose={() => setEditingId(null)}
          onSave={saveEdit}
        >
          <div className="form">
            <div className="form-field">
              <label>Nome do Projeto</label>
              <input
                placeholder="Nome do projeto"
                value={editForm.nome}
                onChange={(e) => setEditForm({...editForm, nome: e.target.value})}
              />
            </div>
            
            <div className="form-field">
              <label>Filamento</label>
              <select 
                value={editForm.filamentoId} 
                onChange={(e) => setEditForm({...editForm, filamentoId: e.target.value})}
              >
                <option value="">Selecione o filamento</option>
                {filamentos.map(f => (
                  <option key={f.id} value={f.id}>{f.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Máquina</label>
              <select 
                value={editForm.maquinaId} 
                onChange={(e) => setEditForm({...editForm, maquinaId: e.target.value})}
              >
                <option value="">Selecione a máquina</option>
                {maquinas.map(m => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Peso Usado (g)</label>
              <input
                type="number"
                placeholder="Peso usado (g)"
                value={editForm.pesoUsado}
                onChange={(e) => setEditForm({...editForm, pesoUsado: parseFloat(e.target.value)})}
              />
            </div>

            <div className="form-field">
              <label>Tempo de Impressão (horas)</label>
              <input
                type="number"
                step="0.1"
                placeholder="Tempo de impressão (horas)"
                value={editForm.tempoHoras}
                onChange={(e) => setEditForm({...editForm, tempoHoras: parseFloat(e.target.value)})}
              />
            </div>

            <div className="form-field">
              <label>Margem de Lucro (%)</label>
              <input
                type="number"
                placeholder="Margem de lucro (%)"
                value={editForm.margemLucro}
                onChange={(e) => setEditForm({...editForm, margemLucro: parseFloat(e.target.value)})}
              />
            </div>
          </div>
        </EditModal>
      )}
    </div>
  );
}

export default App;
