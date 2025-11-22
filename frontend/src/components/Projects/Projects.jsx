import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getProjects, saveProject, deleteProject, getFilaments, getMachines, getPackages, getPlatforms } from '../../services/storage';

function Projects() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [filaments, setFilaments] = useState([]);
  const [machines, setMachines] = useState([]);
  const [packages, setPackages] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    filamentId: '',
    machineId: '',
    packageId: '',
    platformId: '',
    weight: 0,
    printTime: 0,
    profitMargin: 50,
    stlFileName: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProjects(getProjects());
    setFilaments(getFilaments());
    setMachines(getMachines());
    setPackages(getPackages());
    setPlatforms(getPlatforms());
  };

  const handleGcodeUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.gcode') || file.name.endsWith('.gco'))) {
      setFormData({...formData, stlFileName: file.name});
      
      // Ler o arquivo G-code para extrair informações precisas
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        
        // Extrair peso do filamento (procurar por comentários do slicer)
        const filamentMatch = content.match(/filament used.*?=\s*([\d.]+)\s*mm/i) || 
                             content.match(/filament_weight\s*=\s*([\d.]+)/i) ||
                             content.match(/;\s*Filament used:\s*([\d.]+)g/i);
        
        // Extrair tempo de impressão
        const timeMatch = content.match(/estimated printing time.*?=\s*([\d.]+)\s*h/i) ||
                         content.match(/;\s*TIME:\s*(\d+)/i) ||
                         content.match(/print time:\s*(\d+)h\s*(\d+)m/i);
        
        let estimatedWeight = 0;
        let estimatedTime = 0;
        
        // Calcular peso (converter de mm de filamento para gramas)
        if (filamentMatch) {
          const filamentLength = parseFloat(filamentMatch[1]);
          // Fórmula: peso = (comprimento * π * (diâmetro/2)² * densidade)
          // Para PLA 1.75mm: ~1.24g/m, então 1000mm ≈ 1.24g
          estimatedWeight = Math.round((filamentLength / 1000) * 1.24);
        } else {
          // Estimativa baseada no tamanho do arquivo
          const fileSizeMB = file.size / (1024 * 1024);
          estimatedWeight = Math.round(fileSizeMB * 8);
        }
        
        // Calcular tempo
        if (timeMatch) {
          if (timeMatch[2]) {
            // Formato: Xh Ym
            estimatedTime = parseFloat(timeMatch[1]) + (parseFloat(timeMatch[2]) / 60);
          } else if (timeMatch[1].length > 4) {
            // Formato: segundos
            estimatedTime = Math.round((parseFloat(timeMatch[1]) / 3600) * 10) / 10;
          } else {
            // Formato: horas
            estimatedTime = parseFloat(timeMatch[1]);
          }
        } else {
          // Estimativa baseada no tamanho
          const fileSizeMB = file.size / (1024 * 1024);
          estimatedTime = Math.round(fileSizeMB * 0.8 * 10) / 10;
        }
        
        setFormData(prev => ({
          ...prev,
          weight: estimatedWeight,
          printTime: estimatedTime
        }));
        
        alert(`📊 ${t('projects.gcodeExtracted')}\n\n` +
              `🎯 ${t('projects.weight')}: ${estimatedWeight}g\n` +
              `⏱️ ${t('projects.printTime')}: ${estimatedTime}h\n\n` +
              `✅ ${t('projects.gcodeSuccess')}`);
      };
      
      reader.readAsText(file);
    } else {
      alert(`⚠️ ${t('projects.gcodeError')}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Atualizar projeto existente
        const updatedProjects = projects.map(p => 
          p.id === editingId ? { ...p, ...formData } : p
        );
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
        setEditingId(null);
      } else {
        saveProject(formData);
      }
      setFormData({ name: '', client: '', filamentId: '', machineId: '', packageId: '', platformId: '', weight: 0, printTime: 0, profitMargin: 50, stlFileName: '' });
      setShowForm(false);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name,
      client: project.client || '',
      filamentId: project.filamentId,
      machineId: project.machineId,
      packageId: project.packageId || '',
      platformId: project.platformId || '',
      weight: project.weight,
      printTime: project.printTime,
      profitMargin: project.profitMargin,
      stlFileName: project.stlFileName || ''
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('projects.confirmDelete'))) {
      deleteProject(id);
      loadData();
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h1>📦 {t('projects.title')}</h1>
          <p className="subtitle">{t('projects.subtitle')}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? `✕ ${t('common.cancel')}` : `+ ${t('projects.new')}`}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? t('projects.edit') : t('projects.new')}</h3>
          {filaments.length === 0 || machines.length === 0 ? (
            <div style={{padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', color: '#fca5a5'}}>
              ⚠️ {t('projects.needFilamentMachine')}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>📁 {t('projects.uploadGcode')}</label>
                <input
                  type="file"
                  accept=".gcode,.gco"
                  onChange={handleGcodeUpload}
                  style={{
                    padding: '0.75rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '2px dashed rgba(99, 102, 241, 0.3)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                />
                {formData.stlFileName && (
                  <div style={{marginTop: '0.5rem', color: '#10b981', fontSize: '0.875rem'}}>
                    ✓ {t('projects.gcodeFile')}: {formData.stlFileName}
                  </div>
                )}
                <small style={{color: '#94a3b8', display: 'block', marginTop: '0.25rem'}}>
                  🎯 {t('projects.gcodeHelp')}
                </small>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('projects.name')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Vaso Decorativo"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('projects.clientOptional')}</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({...formData, client: e.target.value})}
                    placeholder={t('projects.client')}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('projects.filament')}</label>
                  <select
                    value={formData.filamentId}
                    onChange={(e) => setFormData({...formData, filamentId: e.target.value})}
                    required
                  >
                    <option value="">{t('projects.selectFilament')}</option>
                    {filaments.map(f => (
                      <option key={f.id} value={f.id}>{f.name} - R$ {f.costPerGram}/g</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('projects.machine')}</label>
                  <select
                    value={formData.machineId}
                    onChange={(e) => setFormData({...formData, machineId: e.target.value})}
                    required
                  >
                    <option value="">{t('projects.selectMachine')}</option>
                    {machines.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('projects.packageOptional')}</label>
                  <select
                    value={formData.packageId}
                    onChange={(e) => setFormData({...formData, packageId: e.target.value})}
                  >
                    <option value="">{t('projects.noPackage')}</option>
                    {packages.filter(p => p.stock > 0).map(p => (
                      <option key={p.id} value={p.id}>{p.name} - R$ {p.cost.toFixed(2)} ({p.stock} {t('packages.units')})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('projects.platformOptional')}</label>
                  <select
                    value={formData.platformId}
                    onChange={(e) => setFormData({...formData, platformId: e.target.value})}
                  >
                    <option value="">{t('projects.directSale')}</option>
                    {platforms.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {t('platforms.fee')} {p.feePercentage}%</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('projects.weightGrams')}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('projects.printTimeHours')}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.printTime}
                    onChange={(e) => setFormData({...formData, printTime: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('projects.profitMarginPercent')}</label>
                  <input
                    type="number"
                    value={formData.profitMargin}
                    onChange={(e) => setFormData({...formData, profitMargin: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                {editingId ? t('projects.update') : t('projects.calculateAndSave')}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', client: '', filamentId: '', machineId: '', packageId: '', platformId: '', weight: 0, printTime: 0, profitMargin: 50, stlFileName: '' });
                    setShowForm(false);
                  }}
                  style={{marginLeft: '0.5rem'}}
                >
                  {t('projects.cancelEdit')}
                </button>
              )}
            </form>
          )}
        </div>
      )}

      <div className="items-grid">
        {projects.length === 0 ? (
          <div className="empty-state">
            <p>{t('projects.empty')}</p>
            <button className="btn-secondary" onClick={() => setShowForm(true)}>
              {t('projects.addFirst')}
            </button>
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="item-card">
              <div className="item-header">
                <h3>{project.name}</h3>
                <span className={`badge ${project.status === 'sold' ? 'badge-success' : ''}`}>
                  {project.status === 'sold' ? `✓ ${t('projects.status.sold')}` : `⏳ ${t('projects.status.pending')}`}
                </span>
              </div>
              {project.client && (
                <div style={{color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem'}}>
                  {t('projects.client')}: {project.client}
                </div>
              )}
              <div className="item-details">
                <div className="detail-row">
                  <span>{t('projects.filament')}:</span>
                  <strong>{project.filamentName}</strong>
                </div>
                <div className="detail-row">
                  <span>{t('projects.machine')}:</span>
                  <strong>{project.machineName}</strong>
                </div>
                <div className="detail-row">
                  <span>{t('projects.weight')}:</span>
                  <strong>{project.weight}g</strong>
                </div>
                <div className="detail-row">
                  <span>{t('projects.printTime')}:</span>
                  <strong>{project.printTime}h</strong>
                </div>
                <div style={{borderTop: '1px solid rgba(99, 102, 241, 0.2)', marginTop: '0.5rem', paddingTop: '0.5rem'}}>
                  <div className="detail-row">
                    <span>{t('projects.costs.filament')}:</span>
                    <strong>R$ {project.costs.filament.toFixed(2)}</strong>
                  </div>
                  <div className="detail-row">
                    <span>{t('projects.costs.energy')}:</span>
                    <strong>R$ {project.costs.energy.toFixed(2)}</strong>
                  </div>
                  <div className="detail-row">
                    <span>{t('projects.costs.depreciation')}:</span>
                    <strong>R$ {project.costs.depreciation.toFixed(2)}</strong>
                  </div>
                  <div className="detail-row" style={{color: '#fbbf24', fontWeight: 'bold'}}>
                    <span>{t('projects.costs.total')}:</span>
                    <strong>R$ {project.costs.total.toFixed(2)}</strong>
                  </div>
                  {project.packageName && (
                    <div className="detail-row">
                      <span>{t('projects.costs.package')}:</span>
                      <strong>{project.packageName} (+R$ {project.costs.package.toFixed(2)})</strong>
                    </div>
                  )}
                  {project.platformName && (
                    <div className="detail-row" style={{color: '#ef4444'}}>
                      <span>{t('projects.costs.platform')}:</span>
                      <strong>{project.platformName} ({t('projects.costs.platformFee')}: R$ {project.platformFee.toFixed(2)})</strong>
                    </div>
                  )}
                  <div className="detail-row" style={{color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem'}}>
                    <span>{t('projects.salePrice')}:</span>
                    <strong>R$ {project.salePrice.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
              {project.stlFileName && (
                <div style={{marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '0.5rem', fontSize: '0.875rem'}}>
                  📁 {t('projects.gcodeFile')}: {project.stlFileName}
                </div>
              )}
              <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(project)}
                  style={{flex: 1}}
                >
                  ✏️ {t('common.edit')}
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(project.id)}
                  style={{flex: 1}}
                >
                  🗑️ {t('common.delete')}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Projects;
