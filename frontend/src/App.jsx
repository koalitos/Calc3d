import React, { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import './i18n/config';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('loading'); // 'loading', 'login', 'register', 'dashboard'
  const [user, setUser] = useState(null);

  // Verificar se há login salvo ao carregar
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setCurrentView('dashboard');
      } catch (error) {
        console.error('Erro ao recuperar usuário:', error);
        setCurrentView('login');
      }
    } else {
      setCurrentView('login');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentView('dashboard');
    // Salvar no localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  // Tela de loading
  if (currentView === 'loading') {
    return (
      <div className="App">
        <div className="loading-screen">
          <h1>💎 Calc 3D Print</h1>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentView === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={switchToRegister}
        />
      )}
      
      {currentView === 'register' && (
        <Register 
          onRegisterSuccess={handleLoginSuccess}
          onSwitchToLogin={switchToLogin}
        />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard 
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
