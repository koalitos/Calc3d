import React, { useState, useEffect } from 'react';
import Filaments from '../Filaments/Filaments';
import Machines from '../Machines/Machines';
import Projects from '../Projects/Projects';
import Sales from '../Sales/Sales';
import Expenses from '../Expenses/Expenses';
import Packages from '../Packages/Packages';
import Platforms from '../Platforms/Platforms';
import Financial from '../Financial/Financial';
import Backup from '../Backup/Backup';
import HomeView from './HomeView';
import Sidebar from './Sidebar';
import StatusView from './StatusView';
import { ScrollArea } from '../ui/scroll-area';

function Dashboard({ user, onLogout }) {
  const [currentView, setCurrentView] = useState('home');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendInfo, setBackendInfo] = useState(null);

  // Verificar status do backend
  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:35001/api/health');
      const data = await response.json();
      if (data.status === 'ok' || data.success) {
        setBackendStatus('online');
        setBackendInfo(data);
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'status':
        return <StatusView backendStatus={backendStatus} backendInfo={backendInfo} />;
      case 'financial':
        return <Financial />;
      case 'filaments':
        return <Filaments />;
      case 'machines':
        return <Machines />;
      case 'projects':
        return <Projects />;
      case 'sales':
        return <Sales />;
      case 'expenses':
        return <Expenses />;
      case 'packages':
        return <Packages />;
      case 'platforms':
        return <Platforms />;
      case 'backup':
        return <Backup />;
      default:
        return <HomeView setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} backendStatus={backendStatus} user={user} onLogout={onLogout} />

      <ScrollArea className="flex-1 p-6">
        {renderContent()}
      </ScrollArea>
    </div>
  );
}

export default Dashboard;
