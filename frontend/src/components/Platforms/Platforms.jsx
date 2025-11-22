import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPlatforms, savePlatform, updatePlatform, deletePlatform } from '../../services/storage';

function Platforms() {
  const { t } = useTranslation();
  const [platforms, setPlatforms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    feePercentage: 0
  });

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = () => {
    setPlatforms(getPlatforms());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updatePlatform(editingId, formData);
      setEditingId(null);
    } else {
      savePlatform(formData);
    }
    setFormData({ name: '', feePercentage: 0 });
    setShowForm(false);
    loadPlatforms();
  };

  const handleEdit = (platform) => {
    setFormData({ name: platform.name, feePercentage: platform.feePercentage });
    setEditingId(platform.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('platforms.confirmDelete'))) {
      deletePlatform(id);
      loadPlatforms();
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h1>🛒 {t('platforms.title')}</h1>
          <p className="subtitle">{t('platforms.subtitle')}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? `✕ ${t('common.cancel')}` : `+ ${t('platforms.new')}`}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? t('platforms.edit') : t('platforms.new')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('platforms.platformName')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Shopee, Mercado Livre"
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('platforms.feePercent')}</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.feePercentage}
                  onChange={(e) => setFormData({...formData, feePercentage: parseFloat(e.target.value)})}
                  placeholder="Ex: 15.5"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">{t('common.save')}</button>
          </form>
        </div>
      )}

      <div className="items-grid">
        {platforms.length === 0 ? (
          <div className="empty-state">
            <p>{t('platforms.empty')}</p>
            <button className="btn-secondary" onClick={() => setShowForm(true)}>
              {t('platforms.addFirst')}
            </button>
          </div>
        ) : (
          platforms.map(platform => (
            <div key={platform.id} className="item-card">
              <div className="item-header">
                <h3>{platform.name}</h3>
                <span className="badge">{platform.feePercentage}%</span>
              </div>
              <div className="item-details">
                <div className="detail-row">
                  <span>{t('platforms.fee')}:</span>
                  <strong style={{color: '#ef4444'}}>{platform.feePercentage}%</strong>
                </div>
                <div className="detail-row">
                  <span>{t('platforms.example')}</span>
                  <strong>{t('platforms.fee')}: R$ {(100 * platform.feePercentage / 100).toFixed(2)}</strong>
                </div>
              </div>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button className="btn-edit" onClick={() => handleEdit(platform)} style={{flex: 1}}>
                  ✏️ {t('common.edit')}
                </button>
                <button className="btn-delete" onClick={() => handleDelete(platform.id)} style={{flex: 1}}>
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

export default Platforms;
