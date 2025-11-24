import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { APP_VERSION } from '../../config/version';

function StatusView({ backendStatus, backendInfo }) {
  const { t } = useTranslation();
  const [frontendInfo, setFrontendInfo] = useState({
    version: APP_VERSION,
    uptime: 0
  });
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartMessage, setRestartMessage] = useState('');

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const uptime = Math.floor((Date.now() - startTime) / 1000);
      setFrontendInfo(prev => ({ ...prev, uptime }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.electron) {
      window.electron.on('backend-restarted', (data) => {
        setIsRestarting(false);
        if (data.success) {
          setRestartMessage('✅ Backend reiniciado com sucesso!');
          setTimeout(() => setRestartMessage(''), 3000);
        } else {
          setRestartMessage(`❌ Erro: ${data.error}`);
        }
      });
    }

    return () => {
      if (window.electron) {
        window.electron.removeAllListeners('backend-restarted');
      }
    };
  }, []);

  const handleRestartBackend = () => {
    if (!window.electron) {
      setRestartMessage('⚠️ Função disponível apenas no app desktop');
      return;
    }

    setIsRestarting(true);
    setRestartMessage('🔄 Reiniciando backend...');
    window.electron.send('restart-backend');
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getStatusBadge = (status) => {
    if (status === 'online') return <Badge className="bg-green-500">🟢 {t('dashboard.statusLabels.online')}</Badge>;
    if (status === 'offline') return <Badge variant="destructive">🔴 {t('dashboard.statusLabels.offline')}</Badge>;
    return <Badge variant="secondary">🟡 {t('dashboard.statusLabels.checking')}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.statusTitle')} 📊</h1>
        <p className="text-muted-foreground">{t('dashboard.statusSubtitle')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Backend Status */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">🔧 Backend API</CardTitle>
              {getStatusBadge(backendStatus)}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.port')}:</span>
              <span className="font-medium">35001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.url')}:</span>
              <span className="font-medium">http://localhost:35001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.lastCheck')}:</span>
              <span className="font-medium">
                {backendInfo?.timestamp ? new Date(backendInfo.timestamp).toLocaleTimeString('pt-BR') : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.message')}:</span>
              <span className="font-medium">{backendInfo?.message || t('dashboard.statusLabels.waiting')}</span>
            </div>
            
            {restartMessage && (
              <div className={`p-2 rounded text-xs ${
                restartMessage.includes('✅') 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                  : restartMessage.includes('❌')
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                  : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
              }`}>
                {restartMessage}
              </div>
            )}
            
            <Button
              variant="destructive"
              size="sm"
              className="w-full mt-2"
              onClick={handleRestartBackend}
              disabled={isRestarting || !window.electron}
            >
              <span className={isRestarting ? 'inline-block animate-spin mr-2' : 'mr-2'}>🔄</span>
              {isRestarting ? 'Reiniciando...' : 'Reiniciar Backend'}
            </Button>
            {!window.electron && (
              <p className="text-xs text-muted-foreground text-center">
                Disponível apenas no app desktop
              </p>
            )}
          </CardContent>
        </Card>

        {/* Frontend Status */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">⚛️ Frontend React</CardTitle>
              <Badge className="bg-green-500">🟢 {t('dashboard.statusLabels.online')}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.version')}:</span>
              <span className="font-medium">{frontendInfo.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.framework')}:</span>
              <span className="font-medium">React 18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.uptime')}:</span>
              <span className="font-medium">{formatUptime(frontendInfo.uptime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.environment')}:</span>
              <span className="font-medium">{t('dashboard.statusLabels.development')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Electron Status */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">🖥️ Electron Desktop</CardTitle>
              <Badge className="bg-green-500">🟢 {t('dashboard.statusLabels.online')}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.version')}:</span>
              <span className="font-medium">27.x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.platform')}:</span>
              <span className="font-medium">Windows</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Node.js:</span>
              <span className="font-medium">18.x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium">{t('dashboard.statusLabels.running')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">💾 Banco de Dados</CardTitle>
              <Badge className="bg-green-500">🟢 SQLite</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.type')}:</span>
              <span className="font-medium">SQLite (Arquivo Local)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.persistence')}:</span>
              <span className="font-medium text-green-500">✓ {t('dashboard.statusLabels.permanent')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t('dashboard.statusLabels.location')}:</span>
              <span className="font-medium">{t('dashboard.statusLabels.appFolder')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-green-500">✓ {t('dashboard.statusLabels.dataSaved')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>ℹ️ {t('dashboard.systemInfo.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 bg-muted rounded-md border">
              <span className="text-sm">✅ {t('dashboard.systemInfo.frontendIntegrated')}</span>
            </div>
            <div className="p-3 bg-muted rounded-md border">
              <span className="text-sm">✅ {t('dashboard.systemInfo.backendPort')}</span>
            </div>
            <div className="p-3 bg-muted rounded-md border">
              <span className="text-sm">✅ {t('dashboard.systemInfo.jwtAuth')}</span>
            </div>
            <div className="p-3 bg-muted rounded-md border">
              <span className="text-sm">✅ {t('dashboard.systemInfo.electronApp')}</span>
            </div>
            <div className="p-3 bg-muted rounded-md border">
              <span className="text-sm">🔄 {t('dashboard.systemInfo.inDevelopment')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StatusView;
