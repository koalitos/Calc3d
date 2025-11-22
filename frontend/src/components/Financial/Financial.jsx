import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSales, getExpenses } from '../../services/storage';

function Financial() {
  const { t } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSales(getSales());
    setExpenses(getExpenses());
  };

  const filteredSales = sales.filter(sale => {
    const saleDate = sale.date || sale.createdAt.split('T')[0];
    return saleDate.startsWith(selectedMonth);
  });

  const filteredExpenses = expenses.filter(exp => 
    exp.date.startsWith(selectedMonth)
  );

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.salePrice), 0);
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100) : 0;

  // Agrupar despesas por categoria
  const expensesByCategory = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  return (
    <div className="view-container">
      <h1>📊 {t('financial.title')}</h1>
      <p className="subtitle">{t('financial.subtitle')}</p>

      {/* Filtro de Mês */}
      <div style={{marginBottom: '1.5rem'}}>
        <label style={{color: '#cbd5e1', marginRight: '1rem', fontWeight: '600'}}>{t('financial.month')}</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: '0.75rem',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '0.5rem',
            color: '#f1f5f9',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* Cards Principais */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '1rem', marginBottom: '2rem'}}>
        <div style={{background: 'rgba(16, 185, 129, 0.1)', border: '2px solid rgba(16, 185, 129, 0.3)', borderRadius: '0.75rem', padding: '1.5rem'}}>
          <div style={{fontSize: '0.875rem', color: '#6ee7b7', marginBottom: '0.5rem'}}>💰 {t('financial.revenue')}</div>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#10b981'}}>
            R$ {totalRevenue.toFixed(2)}
          </div>
          <div style={{fontSize: '0.75rem', color: '#6ee7b7', marginTop: '0.5rem'}}>
            {filteredSales.length} {t('financial.sales')}
          </div>
        </div>

        <div style={{background: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.75rem', padding: '1.5rem'}}>
          <div style={{fontSize: '0.875rem', color: '#fca5a5', marginBottom: '0.5rem'}}>💸 {t('financial.expenses')}</div>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ef4444'}}>
            R$ {totalExpenses.toFixed(2)}
          </div>
          <div style={{fontSize: '0.75rem', color: '#fca5a5', marginTop: '0.5rem'}}>
            {filteredExpenses.length} {t('financial.expensesCount')}
          </div>
        </div>

        <div style={{
          background: profit >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
          border: `2px solid ${profit >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, 
          borderRadius: '0.75rem', 
          padding: '1.5rem'
        }}>
          <div style={{fontSize: '0.875rem', color: profit >= 0 ? '#6ee7b7' : '#fca5a5', marginBottom: '0.5rem'}}>
            {profit >= 0 ? `📈 ${t('financial.profit')}` : `📉 ${t('financial.loss')}`}
          </div>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: profit >= 0 ? '#10b981' : '#ef4444'}}>
            R$ {Math.abs(profit).toFixed(2)}
          </div>
          <div style={{fontSize: '0.75rem', color: profit >= 0 ? '#6ee7b7' : '#fca5a5', marginTop: '0.5rem'}}>
            {t('financial.margin')} {profitMargin.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Despesas por Categoria */}
      {Object.keys(expensesByCategory).length > 0 && (
        <div style={{background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem'}}>
          <h3 style={{color: '#f1f5f9', marginBottom: '1rem'}}>{t('financial.expensesByCategory')}</h3>
          <div style={{display: 'grid', gap: '0.75rem'}}>
            {Object.entries(expensesByCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => (
                <div key={category} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '0.5rem'}}>
                  <span style={{color: '#cbd5e1'}}>{category}</span>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <div style={{
                      width: '100px',
                      height: '8px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(amount / totalExpenses) * 100}%`,
                        height: '100%',
                        background: '#ef4444',
                        borderRadius: '4px'
                      }}></div>
                    </div>
                    <strong style={{color: '#ef4444', minWidth: '100px', textAlign: 'right'}}>
                      R$ {amount.toFixed(2)}
                    </strong>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Resumo Mensal */}
      <div style={{background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '0.75rem', padding: '1.5rem'}}>
        <h3 style={{color: '#f1f5f9', marginBottom: '1rem'}}>
          {t('financial.monthlySummary')} {new Date(selectedMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h3>
        <div style={{display: 'grid', gap: '0.5rem', color: '#cbd5e1'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(99, 102, 241, 0.2)'}}>
            <span>{t('financial.totalSales')}</span>
            <strong style={{color: '#10b981'}}>R$ {totalRevenue.toFixed(2)}</strong>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(99, 102, 241, 0.2)'}}>
            <span>{t('financial.totalExpenses')}</span>
            <strong style={{color: '#ef4444'}}>R$ {totalExpenses.toFixed(2)}</strong>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '1.125rem', fontWeight: 'bold'}}>
            <span>{t('financial.result')}</span>
            <strong style={{color: profit >= 0 ? '#10b981' : '#ef4444'}}>
              {profit >= 0 ? '+' : '-'} R$ {Math.abs(profit).toFixed(2)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Financial;
