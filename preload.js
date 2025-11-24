const { contextBridge, ipcRenderer } = require('electron');

// Expor API segura para o renderer process
contextBridge.exposeInMainWorld('electron', {
  // Enviar mensagens para o main process
  send: (channel, data) => {
    // Whitelist de canais permitidos
    const validChannels = [
      'check-for-updates',
      'download-update',
      'install-update',
      'restart-backend'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // Receber mensagens do main process
  on: (channel, callback) => {
    const validChannels = [
      'update-available',
      'update-not-available',
      'download-progress',
      'update-downloaded',
      'update-error',
      'backend-restarted'
    ];
    if (validChannels.includes(channel)) {
      // Remover o event do callback para segurança
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  
  // Remover listeners
  removeAllListeners: (channel) => {
    const validChannels = [
      'update-available',
      'update-not-available',
      'download-progress',
      'update-downloaded',
      'update-error',
      'backend-restarted'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
    }
  }
});
