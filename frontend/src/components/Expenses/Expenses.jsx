import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getExpenses, saveExpense, deleteExpense } from '../../services/storage';

function Expenses() {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [formData, setFormData] = useState({
    description: '',
    category: t('expenses.categories.parts'),
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    setExpenses(getExpenses());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveExpense(formData);
    setFormData({ description: '', category: t('expenses.categories.parts'), amount: 0, date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
    loadExpenses();
  };

  const handleDelete = (id) => {
    if (window.confirm(t('expenses.confirmDelete'))) {
      deleteExpense(id);
      loadExpenses();
    }
  };

  const filteredExpenses = expenses.filter(exp => 
    exp.date.startsWith(selectedMonth)
  );

  const totalMonth = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const categories = [
    t('expenses.categories.parts'),
    t('expenses.categories.filament'),
    t('expenses.categories.electricity'),
    t('expenses.categories.internet'),
    t('expenses.categories.maintenance'),
    t('expenses.categories.shopeeFee'),
    t('expenses.categories.others')
  ];

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <h1>💸 {t('expenses.title')}</h1>
          <p className="subtitle">{t('expenses.subtitle')}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? `✕ ${t('common.cancel')}` : `+ ${t('expenses.new')}`}
        </button>
      </div>

      {/* Filtro de Mês */}
      <div style={{marginBottom: '1.5rem'}}>
        <label style={{color: '#cbd5e1', marginRight: '1rem'}}>{t('expenses.filterByMonth')}</label>
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

      {/* Resumo do Mês */}
      <div style={{background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center'}}>
        <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ef4444'}}>
          R$ {totalMonth.toFixed(2)}
        </div>
        <div style={{color: '#fca5a5', fontSize: '0.875rem'}}>
          {t('expenses.totalExpenses')} {new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{t('expenses.new')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('expenses.description')}</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Ex: Bico 0.4mm"
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('expenses.category')}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('expenses.amount')} (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('expenses.date')}</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">{t('common.save')}</button>
          </form>
        </div>
      )}

      <div className="items-grid">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <p>{t('expenses.emptyMonth')}</p>
            <button className="btn-secondary" onClick={() => setShowForm(true)}>
              {t('expenses.addFirst')}
            </button>
          </div>
        ) : (
          filteredExpenses.map(expense => (
            <div key={expense.id} className="item-card">
              <div className="item-header">
                <h3>{expense.description}</h3>
                <span className="badge">{expense.category}</span>
              </div>
              <div className="item-details">
                <div className="detail-row" style={{color: '#ef4444', fontWeight: 'bold', fontSize: '1.1rem'}}>
                  <span>{t('expenses.amount')}:</span>
                  <strong>R$ {parseFloat(expense.amount).toFixed(2)}</strong>
                </div>
                <div className="detail-row">
                  <span>{t('expenses.date')}:</span>
                  <strong>{new Date(expense.date).toLocaleDateString('pt-BR')}</strong>
                </div>
              </div>
              <button 
                className="btn-delete"
                onClick={() => handleDelete(expense.id)}
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

export default Expenses;
