import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

function BackendControl() {
  const { t } = useTranslation();
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [isRestarting, setIsRestarting] = useState(false);
  const [message, setMessage] = useState('');

  const checkBackendHealth = async () => {
    try {
      await api.healthCheck();
      setBackendStatus('online');
      setMessage('Backend está funcionando normalmente');
    } catch (error) {
      setBackendStatus('offline');
      setMessage('Backend não está respondendo');
    }
  };

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000); // Check a cada 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.electron) {
      window.electron.on('backend-restarted', (data) => {
        setIsRestarting(false);
        if (data.success) {
          setMessage('Backend reiniciado com sucesso!');
          setTimeout(() => {
            checkBackendHealth();
          }, 1000);
        } else {
          setMessage(`Erro ao reiniciar: ${data.error}`);
          setBackendStatus('offline');
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
      setMessage('Função disponível apenas no app desktop');
      return;
    }

    setIsRestarting(true);
    setMessage('Reiniciando backend...');
    setBackendStatus('checking');
    window.electron.send('restart-backend');
  };

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'checking':
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'online':
        return 'text-green-600 dark:text-green-400';
      case 'offline':
        return 'text-red-600 dark:text-red-400';
      case 'checking':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Controle do Backend
        </CardTitle>
        <CardDescription>
          Gerencie o servidor backend da aplicação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="font-medium">Status do Backend</p>
            <p className={`text-sm ${getStatusColor()}`}>
              {backendStatus === 'online' && '🟢 Online'}
              {backendStatus === 'offline' && '🔴 Offline'}
              {backendStatus === 'checking' && '🟡 Verificando...'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkBackendHealth}
            disabled={backendStatus === 'checking'}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${backendStatus === 'checking' ? 'animate-spin' : ''}`} />
            Verificar
          </Button>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            backendStatus === 'online' 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
              : backendStatus === 'offline'
              ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
          }`}>
            {message}
          </div>
        )}

        <div className="pt-2">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleRestartBackend}
            disabled={isRestarting || !window.electron}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRestarting ? 'animate-spin' : ''}`} />
            {isRestarting ? 'Reiniciando...' : 'Reiniciar Backend'}
          </Button>
          {!window.electron && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Disponível apenas no app desktop
            </p>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p>• Use o botão "Reiniciar" se o backend parar de responder</p>
          <p>• O backend será reiniciado automaticamente</p>
          <p>• Porta: 35001</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default BackendControl;
