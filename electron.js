const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let loadingWindow;
let backendProcess;

// Configuração do backend
const isDev = process.env.NODE_ENV === 'development';
const backendPort = 3001;

// Logs iniciais
console.log('='.repeat(50));
console.log('🚀 Calc 3D Print - Iniciando...');
console.log('='.repeat(50));
console.log('📍 Diretório:', __dirname);
console.log('🔧 Modo:', isDev ? 'DESENVOLVIMENTO' : 'PRODUÇÃO');
console.log('🌐 Porta Backend:', backendPort);
console.log('='.repeat(50));

function createLoadingWindow() {
  console.log('⏳ Criando tela de loading...');
  
  try {
    loadingWindow = new BrowserWindow({
      width: 500,
      height: 400,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    const loadingPath = path.join(__dirname, 'loading.html');
    console.log('📁 Loading path:', loadingPath);
    
    loadingWindow.loadFile(loadingPath).catch(err => {
      console.error('❌ Erro ao carregar loading.html:', err);
    });
    
    loadingWindow.center();
    loadingWindow.show();
    console.log('✅ Tela de loading criada');
  } catch (err) {
    console.error('❌ Erro ao criar tela de loading:', err);
  }
}

function createWindow() {
  console.log('🪟 Criando janela principal...');
  
  // Criar a janela do navegador
  const iconPath = process.platform === 'win32' 
    ? path.join(__dirname, 'build', 'icon.ico')
    : process.platform === 'darwin'
    ? path.join(__dirname, 'build', 'icon.icns')
    : path.join(__dirname, 'build', 'icons', '512x512.png');
  
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    icon: iconPath,
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
    : `http://localhost:${backendPort}`;

  console.log('Loading URL:', startUrl);
  console.log('Is Dev:', isDev);

  mainWindow.loadURL(startUrl).catch(err => {
    console.error('Failed to load URL:', err);
  });

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    console.log('Main window ready to show');
    // Fechar loading e mostrar janela principal
    if (loadingWindow) {
      loadingWindow.close();
      loadingWindow = null;
    }
    mainWindow.show();
  });

  // Timeout de segurança - se não carregar em 10 segundos, mostrar mesmo assim
  setTimeout(() => {
    if (mainWindow && !mainWindow.isVisible()) {
      console.log('Timeout reached, showing window anyway');
      if (loadingWindow) {
        loadingWindow.close();
        loadingWindow = null;
      }
      mainWindow.show();
    }
  }, 10000);

  // Abrir DevTools em desenvolvimento ou se houver erro
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  
  // Abrir DevTools com F12
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      mainWindow.webContents.toggleDevTools();
    }
  });

  // Listener para erros de carregamento
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Failed to load:', errorCode, errorDescription);
    console.error('❌ URL:', validatedURL);
    
    // Mostrar janela mesmo com erro para ver o que aconteceu
    if (loadingWindow) {
      loadingWindow.close();
      loadingWindow = null;
    }
    mainWindow.show();
    
    // Se falhar, mostrar erro
    dialog.showErrorBox(
      'Erro ao Carregar',
      `Não foi possível carregar o aplicativo.\n\n` +
      `Erro: ${errorDescription}\n` +
      `URL: ${validatedURL}\n\n` +
      (isDev 
        ? 'Certifique-se de que está usando: npm run dev'
        : 'Tente reinstalar o aplicativo.')
    );
  });

  // Emitido quando a janela é fechada
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (loadingWindow) {
      loadingWindow.close();
      loadingWindow = null;
    }
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

  console.log('');
  console.log('🔧 Iniciando Backend...');
  console.log('📁 Caminho:', backendPath);
  
  // Verificar se o arquivo existe
  const fs = require('fs');
  if (!fs.existsSync(backendPath)) {
    console.error('❌ ERRO: Arquivo do backend não encontrado!');
    console.error('❌ Procurado em:', backendPath);
    return;
  }
  console.log('✅ Arquivo do backend encontrado');

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
    const message = data.toString().trim();
    console.log(`[Backend] ${message}`);
  });

  backendProcess.stderr.on('data', (data) => {
    const message = data.toString().trim();
    console.error(`[Backend Error] ${message}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`❌ Backend process exited with code ${code}`);
    if (code !== 0) {
      dialog.showErrorBox(
        'Erro no Backend',
        `O servidor backend encerrou inesperadamente.\nCódigo: ${code}`
      );
    }
  });

  backendProcess.on('error', (err) => {
    console.error('❌ Erro ao iniciar backend:', err);
    dialog.showErrorBox(
      'Erro ao Iniciar Backend',
      `Não foi possível iniciar o servidor backend.\n\nErro: ${err.message}`
    );
  });
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

// Verificar se o backend está pronto
function checkBackendReady(retries = 0) {
  const maxRetries = 20;
  
  if (retries === 0) {
    console.log('');
    console.log('🔍 Verificando se backend está pronto...');
  }
  
  return new Promise((resolve) => {
    const http = require('http');
    
    const options = {
      hostname: 'localhost',
      port: backendPort,
      path: '/api/health',
      method: 'GET',
      timeout: 1000
    };
    
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Backend está pronto!');
        console.log('');
        resolve(true);
      } else {
        if (retries < maxRetries) {
          if (retries % 4 === 0) { // Log a cada 2 segundos
            console.log(`⏳ Aguardando backend... (${retries + 1}/${maxRetries})`);
          }
          setTimeout(() => {
            checkBackendReady(retries + 1).then(resolve);
          }, 500);
        } else {
          console.log('⚠️ Backend não respondeu após várias tentativas');
          console.log('');
          resolve(false);
        }
      }
    });
    
    req.on('error', () => {
      if (retries < maxRetries) {
        setTimeout(() => {
          checkBackendReady(retries + 1).then(resolve);
        }, 500);
      } else {
        console.log('⚠️ Backend não respondeu após várias tentativas');
        resolve(false);
      }
    });
    
    req.on('timeout', () => {
      req.destroy();
      if (retries < maxRetries) {
        setTimeout(() => {
          checkBackendReady(retries + 1).then(resolve);
        }, 500);
      } else {
        resolve(false);
      }
    });
    
    req.end();
  });
}

// Configurar auto-updater
autoUpdater.autoDownload = false; // Não baixar automaticamente
autoUpdater.autoInstallOnAppQuit = true; // Instalar ao fechar o app

// Eventos do auto-updater
autoUpdater.on('checking-for-update', () => {
  console.log('Verificando atualizações...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Atualização disponível:', info.version);
  
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Atualização Disponível',
    message: `Nova versão ${info.version} disponível!`,
    detail: 'Deseja baixar e instalar agora?',
    buttons: ['Sim', 'Depois'],
    defaultId: 0,
    cancelId: 1
  }).then(result => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-not-available', () => {
  console.log('App está atualizado');
});

autoUpdater.on('download-progress', (progressObj) => {
  let message = `Baixando: ${Math.round(progressObj.percent)}%`;
  console.log(message);
  
  if (mainWindow) {
    mainWindow.setProgressBar(progressObj.percent / 100);
  }
});

autoUpdater.on('update-downloaded', () => {
  console.log('Atualização baixada');
  
  if (mainWindow) {
    mainWindow.setProgressBar(-1); // Remove barra de progresso
  }
  
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Atualização Pronta',
    message: 'Atualização baixada com sucesso!',
    detail: 'O app será atualizado ao fechar. Deseja reiniciar agora?',
    buttons: ['Reiniciar', 'Depois'],
    defaultId: 0,
    cancelId: 1
  }).then(result => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on('error', (error) => {
  console.error('Erro na atualização:', error);
});

// Este método será chamado quando o Electron terminar a inicialização
app.whenReady().then(async () => {
  // Mostrar tela de loading
  createLoadingWindow();

  // Iniciar backend
  startBackend();

  // Aguardar o backend estar pronto
  console.log('⏳ Aguardando backend iniciar...');
  await checkBackendReady();
  
  // Criar janela principal
  createWindow();
  
  // Verificar atualizações após 3 segundos (dar tempo do app carregar)
  if (!isDev) {
    setTimeout(() => {
      autoUpdater.checkForUpdates();
    }, 3000);
  }

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
