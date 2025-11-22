import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPackages, savePackage, updatePackage, deletePackage } from '../../services/storage';

function Packages() {
  const { t } = useTranslation();
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cost: 0,
    stock: 0
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = () => {
    setPackages(getPackages());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updatePackage(editingId, formData);
      setEditingId(null);
    } else {
      savePackage(formData);
    }
    setFormData({ name: '', cost: 0, stock: 0 });
    setShowForm(false);
    loadPackages();
  };

  const handleEdit = (pkg) => {
    setFormData({ name: pkg.name, cost: pkg.cost, stock: pkg.stock });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('packages.confirmDelete'))) {
      deletePackage(id);
      loadPackages();
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h1>📦 {t('packages.title')}</h1>
          <p className="subtitle">{t('packages.subtitle')}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? `✕ ${t('common.cancel')}` : `+ ${t('packages.new')}`}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? t('packages.edit') : t('packages.new')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('packages.name')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Caixa Pequena"
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('packages.cost')} (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('packages.stockUnits')}</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">{t('common.save')}</button>
          </form>
        </div>
      )}

      <div className="items-grid">
        {packages.length === 0 ? (
          <div className="empty-state">
            <p>{t('packages.empty')}</p>
            <button className="btn-secondary" onClick={() => setShowForm(true)}>
              {t('packages.addFirst')}
            </button>
          </div>
        ) : (
          packages.map(pkg => (
            <div key={pkg.id} className="item-card">
              <div className="item-header">
                <h3>{pkg.name}</h3>
                <span className={`badge ${pkg.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                  {pkg.stock > 0 ? `${pkg.stock} ${t('packages.units')}` : t('packages.noStock')}
                </span>
              </div>
              <div className="item-details">
                <div className="detail-row">
                  <span>{t('packages.cost')}:</span>
                  <strong>R$ {pkg.cost.toFixed(2)}</strong>
                </div>
                <div className="detail-row">
                  <span>{t('packages.stock')}:</span>
                  <strong style={{color: pkg.stock > 0 ? '#10b981' : '#ef4444'}}>
                    {pkg.stock} {t('packages.unitsText')}
                  </strong>
                </div>
              </div>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button className="btn-edit" onClick={() => handleEdit(pkg)} style={{flex: 1}}>
                  ✏️ {t('common.edit')}
                </button>
                <button className="btn-delete" onClick={() => handleDelete(pkg.id)} style={{flex: 1}}>
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

export default Packages;
