import React, { useEffect, useState } from 'react';

export default function AutoUpdater() {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar se está rodando no Electron
    if (!window.electron) {
      return;
    }

    // Listeners para eventos de atualização
    window.electron.on('update-available', (info) => {
      console.log('Atualização disponível:', info);
      setUpdateInfo(info);
      setError(null);
    });

    window.electron.on('update-not-available', () => {
      console.log('App está atualizado');
    });

    window.electron.on('download-progress', ({ percent }) => {
      console.log('Progresso:', percent);
      setProgress(percent);
    });

    window.electron.on('update-downloaded', (info) => {
      console.log('Atualização baixada:', info);
      setDownloaded(true);
      setDownloading(false);
    });

    window.electron.on('update-error', (errorMessage) => {
      console.error('Erro na atualização:', errorMessage);
      setError(errorMessage);
      setDownloading(false);
    });

    // Cleanup
    return () => {
      if (window.electron) {
        window.electron.removeAllListeners('update-available');
        window.electron.removeAllListeners('update-not-available');
        window.electron.removeAllListeners('download-progress');
        window.electron.removeAllListeners('update-downloaded');
        window.electron.removeAllListeners('update-error');
      }
    };
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    setError(null);
    window.electron.send('download-update');
  };

  // Iniciar download automaticamente quando detectar atualização
  useEffect(() => {
    if (updateInfo && !downloading && !downloaded && !error) {
      setDownloading(true);
    }
  }, [updateInfo, downloading, downloaded, error]);

  const handleInstall = () => {
    window.electron.send('install-update');
  };

  const handleDismiss = () => {
    setUpdateInfo(null);
    setDownloaded(false);
    setError(null);
  };

  // Não mostrar nada se não houver atualização ou se não estiver no Electron
  if (!updateInfo || !window.electron) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md z-50 border border-gray-700">
      {error ? (
        <>
          <div className="flex items-start gap-3 mb-3">
            <div className="text-red-500 text-2xl">⚠️</div>
            <div className="flex-1">
              <h3 className="font-bold mb-1">Erro na Atualização</h3>
              <p className="text-sm text-gray-300">{error}</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
          >
            Fechar
          </button>
        </>
      ) : !downloaded ? (
        <>
          <div className="flex items-start gap-3 mb-3">
            <div className="text-blue-500 text-2xl">🔄</div>
            <div className="flex-1">
              <h3 className="font-bold mb-1">
                Baixando Atualização
              </h3>
              <p className="text-sm text-gray-300">
                Versão {updateInfo.version}
              </p>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-center text-gray-300">
            {progress}% concluído
          </p>
        </>
      ) : (
        <>
          <div className="flex items-start gap-3 mb-3">
            <div className="text-green-500 text-2xl">✅</div>
            <div className="flex-1">
              <h3 className="font-bold mb-1">Atualização Pronta!</h3>
              <p className="text-sm text-gray-300">
                Reinicie o app para aplicar a versão {updateInfo.version}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors font-medium"
            >
              Reiniciar Agora
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
            >
              Depois
            </button>
          </div>
        </>
      )}
    </div>
  );
}
