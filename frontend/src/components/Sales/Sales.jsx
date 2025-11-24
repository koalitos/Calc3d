import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSales, saveSale, deleteSale, getProjects } from '../../services/storage';

function Sales() {
  const { t } = useTranslation();
  const [sales, setSales] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [formData, setFormData] = useState({
    projectId: '',
    customerName: '',
    salePrice: 0,
    quantity: 1,
    paymentMethod: 'Dinheiro',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSales(getSales());
    setProjects(getProjects().filter(p => p.status !== 'sold'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const project = projects.find(p => p.id === parseInt(formData.projectId));
      const totalAmount = formData.salePrice * formData.quantity;
      saveSale({
        ...formData,
        salePrice: totalAmount,
        unitPrice: formData.salePrice,
        projectName: project?.name || 'Venda Avulsa',
        packageId: project?.packageId,
        platformName: project?.platformName,
        projectId: formData.projectId ? parseInt(formData.projectId) : null
      });
      setFormData({ projectId: '', customerName: '', salePrice: 0, quantity: 1, paymentMethod: 'Dinheiro', notes: '', date: new Date().toISOString().split('T')[0] });
      setShowForm(false);
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(t('sales.confirmDelete'))) {
      deleteSale(id);
      loadData();
    }
  };

  const filteredSales = sales.filter(sale => {
    const saleDate = sale.date || sale.createdAt.split('T')[0];
    return saleDate.startsWith(selectedMonth);
  });

  const totalMonth = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.salePrice), 0);
  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.salePrice), 0);

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h1>💰 {t('sales.title')}</h1>
          <p className="subtitle">{t('sales.subtitle')}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? `✕ ${t('common.cancel')}` : `+ ${t('sales.new')}`}
        </button>
      </div>

      {/* Filtro de Mês */}
      <div style={{marginBottom: '1.5rem'}}>
        <label style={{color: '#cbd5e1', marginRight: '1rem'}}>{t('sales.filterByMonth')}</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: '0.5rem',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '0.5rem',
            color: '#f1f5f9'
          }}
        />
      </div>

      {/* Resumo */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem'}}>
        <div style={{background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center'}}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#10b981'}}>
            R$ {totalMonth.toFixed(2)}
          </div>
          <div style={{color: '#6ee7b7', fontSize: '0.875rem'}}>
            {t('sales.salesIn')} {new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div style={{background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center'}}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#6366f1'}}>
            {filteredSales.length}
          </div>
          <div style={{color: '#a5b4fc', fontSize: '0.875rem'}}>{t('sales.salesInMonth')}</div>
        </div>
        <div style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center'}}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6'}}>
            R$ {totalSales.toFixed(2)}
          </div>
          <div style={{color: '#c4b5fd', fontSize: '0.875rem'}}>{t('sales.totalGeneral')}</div>
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{t('sales.new')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('sales.project')}</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => {
                    const project = projects.find(p => p.id === parseInt(e.target.value));
                    setFormData({
                      ...formData,
                      projectId: e.target.value,
                      salePrice: project ? project.salePrice : 0
                    });
                  }}
                  required
                >
                  <option value="">{t('sales.selectProject')}</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - R$ {p.salePrice.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('sales.customer')}</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  placeholder={t('sales.customer')}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('sales.quantity')}</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('sales.unitPrice')} (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({...formData, salePrice: parseFloat(e.target.value) || 0})}
                  required
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('sales.totalSale')} (R$)</label>
                <input
                  type="text"
                  value={`R$ ${(formData.salePrice * formData.quantity).toFixed(2)}`}
                  readOnly
                  style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem'}}
                />
              </div>
              <div className="form-group">
                <label>{t('sales.paymentMethod')}</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                >
                  <option>{t('sales.paymentMethods.cash')}</option>
                  <option>{t('sales.paymentMethods.pix')}</option>
                  <option>{t('sales.paymentMethods.credit')}</option>
                  <option>{t('sales.paymentMethods.debit')}</option>
                  <option>{t('sales.paymentMethods.transfer')}</option>
                  <option>{t('sales.paymentMethods.shopee')}</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>{t('sales.saleDate')}</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('sales.notes')}</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder={t('sales.notesPlaceholder')}
                rows="3"
              />
            </div>
            <button type="submit" className="btn-primary">{t('sales.register')}</button>
          </form>
        </div>
      )}

      <div className="items-grid">
        {filteredSales.length === 0 ? (
          <div className="empty-state">
            <p>{t('sales.emptyMonth')}</p>
            <button className="btn-secondary" onClick={() => setShowForm(true)}>
              {t('sales.addFirst')}
            </button>
          </div>
        ) : (
          filteredSales.map(sale => (
            <div key={sale.id} className="item-card">
              <div className="item-header">
                <h3>{sale.customerName}</h3>
                <span className="badge badge-success">✓ {t('sales.paid')}</span>
              </div>
              <div className="item-details">
                {sale.projectName && (
                  <div className="detail-row">
                    <span>{t('sales.project')}:</span>
                    <strong>{sale.projectName}</strong>
                  </div>
                )}
                {sale.platformName && (
                  <div className="detail-row">
                    <span>{t('projects.platform')}:</span>
                    <strong>{sale.platformName}</strong>
                  </div>
                )}
                {sale.quantity && sale.quantity > 1 && (
                  <div className="detail-row">
                    <span>{t('sales.quantity')}:</span>
                    <strong>{sale.quantity}x</strong>
                  </div>
                )}
                {sale.unitPrice && (
                  <div className="detail-row">
                    <span>{t('sales.unit')}:</span>
                    <strong>R$ {parseFloat(sale.unitPrice).toFixed(2)}</strong>
                  </div>
                )}
                <div className="detail-row" style={{color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem'}}>
                  <span>{t('sales.total')}:</span>
                  <strong>R$ {parseFloat(sale.salePrice).toFixed(2)}</strong>
                </div>
                <div className="detail-row">
                  <span>{t('sales.paymentMethod')}:</span>
                  <strong>{sale.paymentMethod}</strong>
                </div>
                <div className="detail-row">
                  <span>{t('sales.date')}:</span>
                  <strong>{new Date(sale.date || sale.createdAt).toLocaleDateString('pt-BR')}</strong>
                </div>
                {sale.notes && (
                  <div style={{marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1'}}>
                    {sale.notes}
                  </div>
                )}
              </div>
              <button 
                className="btn-delete"
                onClick={() => handleDelete(sale.id)}
              >
                🗑️ {t('common.delete')}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sales;
