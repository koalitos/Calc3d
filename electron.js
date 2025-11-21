const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

// Configuração do backend
const isDev = process.env.NODE_ENV === 'development';
const backendPort = 3001;

function createWindow() {
  // Criar a janela do navegador
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      devTools: isDev
    },
    backgroundColor: '#0f172a',
    show: false,
    autoHideMenuBar: true
  });

  // Remover menu padrão em produção
  if (!isDev) {
    Menu.setApplicationMenu(null);
  }

  // Carregar o app
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'frontend/build/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Abrir DevTools em desenvolvimento
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Emitido quando a janela é fechada
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevenir navegação externa
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      event.preventDefault();
      require('electron').shell.openExternal(url);
    }
  });
}

function startBackend() {
  const backendPath = isDev
    ? path.join(__dirname, 'backend', 'src', 'server.js')
    : path.join(process.resourcesPath, 'backend', 'src', 'server.js');

  console.log('Starting backend from:', backendPath);

  // Iniciar o servidor backend
  backendProcess = spawn('node', [backendPath], {
    cwd: isDev ? path.join(__dirname, 'backend') : path.join(process.resourcesPath, 'backend'),
    env: {
      ...process.env,
      PORT: backendPort,
      NODE_ENV: isDev ? 'development' : 'production'
    }
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

// Este método será chamado quando o Electron terminar a inicialização
app.whenReady().then(() => {
  // Iniciar backend
  startBackend();

  // Aguardar um pouco para o backend iniciar
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on('activate', () => {
    // No macOS, recriar a janela quando o ícone do dock for clicado
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Sair quando todas as janelas forem fechadas
app.on('window-all-closed', () => {
  // No macOS, é comum que aplicativos permaneçam ativos até que o usuário saia explicitamente
  if (process.platform !== 'darwin') {
    stopBackend();
    app.quit();
  }
});

// Limpar ao sair
app.on('before-quit', () => {
  stopBackend();
});

app.on('will-quit', () => {
  stopBackend();
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
