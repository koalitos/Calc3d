import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMachines, saveMachine, updateMachine, deleteMachine } from '../../services/storage';

function Machines() {
  const { t } = useTranslation();
  const [machines, setMachines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    power: 0,
    costPerKwh: 0.80,
    machineCost: 0,
    lifespan: 5000
  });

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = () => {
    setMachines(getMachines());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMachine(editingId, formData);
      setEditingId(null);
    } else {
      saveMachine(formData);
    }
    setFormData({ name: '', power: 0, costPerKwh: 0.80, machineCost: 0, lifespan: 5000 });
    setShowForm(false);
    loadMachines();
  };

  const handleEdit = (machine) => {
    setFormData({
      name: machine.name,
      power: machine.power,
      costPerKwh: machine.costPerKwh,
      machineCost: machine.machineCost,
      lifespan: machine.lifespan
    });
    setEditingId(machine.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('machines.confirmDelete'))) {
      deleteMachine(id);
      loadMachines();
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h1>🖨️ {t('machines.title')}</h1>
          <p className="subtitle">{t('machines.subtitle')}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? `✕ ${t('common.cancel')}` : `+ ${t('machines.new')}`}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? t('machines.edit') : t('machines.new')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('machines.name')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Ender 3 V2"
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('machines.power')} (W)</label>
                <input
                  type="number"
                  value={formData.power}
                  onChange={(e) => setFormData({...formData, power: parseFloat(e.target.value)})}
                  placeholder="350"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('machines.costPerKwh')} (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costPerKwh}
                  onChange={(e) => setFormData({...formData, costPerKwh: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('machines.machineCost')} (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.machineCost}
                  onChange={(e) => setFormData({...formData, machineCost: parseFloat(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>{t('machines.lifespan')} ({t('machines.hours')})</label>
              <input
                type="number"
                value={formData.lifespan}
                onChange={(e) => setFormData({...formData, lifespan: parseFloat(e.target.value)})}
                required
              />
            </div>
            <button type="submit" className="btn-primary">{t('common.save')}</button>
          </form>
        </div>
      )}

      <div className="items-grid">
        {machines.length === 0 ? (
          <div className="empty-state">
            <p>{t('machines.empty')}</p>
            <button className="btn-secondary" onClick={() => setShowForm(true)}>
              {t('machines.addFirst')}
            </button>
          </div>
        ) : (
          machines.map(machine => (
            <div key={machine.id} className="item-card">
              <div className="item-header">
                <h3>{machine.name}</h3>
              </div>
              <div className="item-details">
                <div className="detail-row">
                  <span>{t('machines.power')}:</span>
                  <strong>{machine.power}W</strong>
                </div>
                <div className="detail-row">
                  <span>{t('machines.costPerKwh')}:</span>
                  <strong>R$ {machine.costPerKwh.toFixed(2)}</strong>
                </div>
                <div className="detail-row">
                  <span>{t('machines.energyPerHour')}:</span>
                  <strong>R$ {machine.energyCostPerHour}</strong>
                </div>
                <div className="detail-row">
                  <span>{t('machines.depreciationPerHour')}:</span>
                  <strong>R$ {machine.depreciationPerHour}</strong>
                </div>
                <div className="detail-row">
                  <span>{t('machines.lifespan')}:</span>
                  <strong>{machine.lifespan}h</strong>
                </div>
              </div>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(machine)}
                  style={{flex: 1}}
                >
                  ✏️ {t('common.edit')}
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(machine.id)}
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

export default Machines;
