import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { exportDatabase, importDatabase, clearAllData, getFilaments, getMachines, getProjects, getSales } from '../../services/storage';

function Backup() {
  const { t } = useTranslation();
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState(null);

  const stats = {
    filaments: getFilaments().length,
    machines: getMachines().length,
    projects: getProjects().length,
    sales: getSales().length
  };

  const handleExport = () => {
    try {
      exportDatabase();
      setMessage({ type: 'success', text: `✅ ${t('backup.exportSuccess')}` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `❌ ${t('backup.exportError')} ${error.message}` });
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      const data = await importDatabase(file);
      setMessage({ 
        type: 'success', 
        text: `✅ ${t('backup.importSuccess')} ${data.filaments.length} ${t('dashboard.filaments').toLowerCase()}, ${data.machines.length} ${t('dashboard.machines').toLowerCase()}, ${data.projects.length} ${t('dashboard.projects').toLowerCase()}, ${data.sales.length} ${t('dashboard.sales').toLowerCase()}.` 
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: `❌ ${t('backup.importError')} ${error.message}` });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const handleClear = () => {
    if (window.confirm(`⚠️ ${t('backup.clearConfirm1')}`)) {
      if (window.confirm(t('backup.clearConfirm2'))) {
        clearAllData();
        setMessage({ type: 'success', text: `✅ ${t('backup.clearSuccess')}` });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  };

  return (
    <div className="view-container">
      <h1>💾 {t('backup.title')}</h1>
      <p className="subtitle">{t('backup.subtitle')}</p>

      {message && (
        <div style={{
          padding: '1rem',
          marginBottom: '2rem',
          borderRadius: '0.5rem',
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: message.type === 'success' ? '#10b981' : '#ef4444'
        }}>
          {message.text}
        </div>
      )}

      {/* Estatísticas */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
        <div style={{background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center'}}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#6366f1'}}>{stats.filaments}</div>
          <div style={{color: '#a5b4fc', fontSize: '0.875rem'}}>{t('dashboard.filaments')}</div>
        </div>
        <div style={{background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center'}}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#6366f1'}}>{stats.machines}</div>
          <div style={{color: '#a5b4fc', fontSize: '0.875rem'}}>{t('dashboard.machines')}</div>
        </div>
        <div style={{background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center'}}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#6366f1'}}>{stats.projects}</div>
          <div style={{color: '#a5b4fc', fontSize: '0.875rem'}}>{t('dashboard.projects')}</div>
        </div>
        <div style={{background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center'}}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#6366f1'}}>{stats.sales}</div>
          <div style={{color: '#a5b4fc', fontSize: '0.875rem'}}>{t('dashboard.sales')}</div>
        </div>
      </div>

      {/* Ações */}
      <div style={{display: 'grid', gap: '1.5rem', maxWidth: '600px'}}>
        {/* Exportar */}
        <div className="form-card">
          <h3>📤 {t('backup.exportTitle')}</h3>
          <p style={{color: '#cbd5e1', marginBottom: '1rem'}}>
            {t('backup.exportDesc')}
          </p>
          <button className="btn-primary" onClick={handleExport}>
            💾 {t('backup.exportButton')}
          </button>
        </div>

        {/* Importar */}
        <div className="form-card">
          <h3>📥 {t('backup.importTitle')}</h3>
          <p style={{color: '#cbd5e1', marginBottom: '1rem'}}>
            {t('backup.importDesc')}
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={importing}
            style={{
              padding: '0.75rem',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '0.5rem',
              color: '#f1f5f9',
              width: '100%',
              cursor: 'pointer'
            }}
          />
          {importing && <p style={{color: '#fbbf24', marginTop: '0.5rem'}}>{t('backup.importing')}</p>}
        </div>

        {/* Limpar */}
        <div className="form-card" style={{borderColor: 'rgba(239, 68, 68, 0.3)'}}>
          <h3>🗑️ {t('backup.clearTitle')}</h3>
          <p style={{color: '#fca5a5', marginBottom: '1rem'}}>
            ⚠️ {t('backup.clearDesc')}
          </p>
          <button 
            className="btn-delete" 
            onClick={handleClear}
            style={{width: 'auto', padding: '0.75rem 1.5rem'}}
          >
            🗑️ {t('backup.clearButton')}
          </button>
        </div>
      </div>

      {/* Informações */}
      <div style={{marginTop: '2rem', padding: '1.5rem', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '1rem'}}>
        <h3 style={{color: '#f1f5f9', marginBottom: '1rem'}}>ℹ️ {t('backup.info')}</h3>
        <ul style={{color: '#cbd5e1', lineHeight: '1.8'}}>
          <li>✅ {t('backup.infoList.local')}</li>
          <li>✅ {t('backup.infoList.regular')}</li>
          <li>✅ {t('backup.infoList.json')}</li>
          <li>✅ {t('backup.infoList.replace')}</li>
          <li>⚠️ {t('backup.infoList.cache')}</li>
        </ul>
      </div>
    </div>
  );
}

export default Backup;
