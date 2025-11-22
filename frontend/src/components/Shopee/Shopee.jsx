import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './Shopee.css';

function Shopee() {
  const { t } = useTranslation();
  const [config, setConfig] = useState({
    partnerId: '',
    partnerKey: '',
    shopId: '',
    enabled: false
  });
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    loadConfig();
    loadNotifications();
    
    // Polling para novas notificações a cada 30 segundos
    const interval = setInterval(() => {
      if (config.enabled) {
        loadNotifications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [config.enabled]);

  const loadConfig = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shopee/config', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setConfig(response.data);
      setIsConnected(response.data.enabled);
    } catch (error) {
      console.error('Erro ao carregar config:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shopee/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const handleSaveConfig = async () => {
    try {
      await axios.post('http://localhost:5000/api/shopee/config', config, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(t('shopee.save') + ' ✓');
    } catch (error) {
      alert(t('common.error'));
    }
  };

  const handleTestConnection = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/shopee/test', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsConnected(response.data.success);
      alert(response.data.success ? t('shopee.connected') : t('shopee.disconnected'));
    } catch (error) {
      setIsConnected(false);
      alert(t('shopee.disconnected'));
    }
  };

  return (
    <div className="shopee-container">
      <h2>🛍️ {t('shopee.title')}</h2>

      <div className="shopee-status">
        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 ' + t('shopee.connected') : '🔴 ' + t('shopee.disconnected')}
        </span>
      </div>

      <div className="shopee-config">
        <h3>{t('shopee.configure')}</h3>
        <div className="form-group">
          <label>{t('shopee.partnerId')}</label>
          <input
            type="text"
            value={config.partnerId}
            onChange={(e) => setConfig({...config, partnerId: e.target.value})}
            placeholder="Partner ID"
          />
        </div>
        <div className="form-group">
          <label>{t('shopee.partnerKey')}</label>
          <input
            type="password"
            value={config.partnerKey}
            onChange={(e) => setConfig({...config, partnerKey: e.target.value})}
            placeholder="Partner Key"
          />
        </div>
        <div className="form-group">
          <label>{t('shopee.shopId')}</label>
          <input
            type="text"
            value={config.shopId}
            onChange={(e) => setConfig({...config, shopId: e.target.value})}
            placeholder="Shop ID"
          />
        </div>
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({...config, enabled: e.target.checked})}
            />
            {t('shopee.enableNotifications')}
          </label>
        </div>
        <div className="button-group">
          <button onClick={handleSaveConfig} className="btn-primary">
            {t('shopee.save')}
          </button>
          <button onClick={handleTestConnection} className="btn-secondary">
            {t('shopee.testConnection')}
          </button>
        </div>
      </div>

      <div className="shopee-features">
        <h3>{t('shopee.features.title')}</h3>
        <div className="features-grid">
          <div className="feature-card">📦 {t('shopee.features.orders')}</div>
          <div className="feature-card">🏷️ {t('shopee.features.products')}</div>
          <div className="feature-card">📊 {t('shopee.features.inventory')}</div>
          <div className="feature-card">🚚 {t('shopee.features.logistics')}</div>
          <div className="feature-card">🎁 {t('shopee.features.promotions')}</div>
          <div className="feature-card">📈 {t('shopee.features.reports')}</div>
          <div className="feature-card">💬 {t('shopee.features.chat')}</div>
        </div>
      </div>

      <div className="shopee-notifications">
        <h3>🔔 {t('shopee.notifications')}</h3>
        {notifications.length === 0 ? (
          <p className="no-notifications">{t('shopee.noNotifications')}</p>
        ) : (
          <div className="notifications-list">
            {notifications.map((notif, index) => (
              <div key={index} className="notification-card">
                <div className="notification-header">
                  <span className="notification-title">🎉 {t('shopee.newSale')}</span>
                  <span className="notification-time">{new Date(notif.timestamp).toLocaleString()}</span>
                </div>
                <div className="notification-body">
                  <p><strong>{t('shopee.orderNumber')}:</strong> {notif.orderId}</p>
                  <p><strong>{t('shopee.product')}:</strong> {notif.productName}</p>
                  <p><strong>{t('shopee.quantity')}:</strong> {notif.quantity}</p>
                  <p><strong>{t('shopee.total')}:</strong> R$ {notif.total}</p>
                  <p><strong>{t('shopee.status')}:</strong> {notif.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shopee;
