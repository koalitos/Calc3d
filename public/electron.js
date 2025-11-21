const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let backendProcess = null;
let mainWindow = null;

// Iniciar o servidor backend
function startBackend() {
  const backendPath = isDev
    ? path.join(__dirname, '../backend/server.js')
    : path.join(process.resourcesPath, 'backend/server.js');

  console.log('Iniciando backend em:', backendPath);

  backendProcess = spawn('node', [backendPath], {
    cwd: path.dirname(backendPath),
    stdio: 'inherit'
  });

  backendProcess.on('error', (err) => {
    console.error('Erro ao iniciar backend:', err);
  });

  backendProcess.on('exit', (code) => {
    console.log('Backend encerrado com código:', code);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Aguardar o backend iniciar antes de carregar a UI
  setTimeout(() => {
    mainWindow.loadURL(
      isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`
    );

    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  }, 2000);
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  // Encerrar o backend quando fechar o app
  if (backendProcess) {
    backendProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  // Garantir que o backend seja encerrado
  if (backendProcess) {
    backendProcess.kill();
  }
});
