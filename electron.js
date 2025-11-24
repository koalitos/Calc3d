const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Desabilitar aceleração de hardware para evitar erros de GPU
app.disableHardwareAcceleration();

// Detectar modo dev de forma mais robusta
let isDev;
if (process.env.NODE_ENV === 'production') {
  isDev = false;
} else if (process.env.NODE_ENV === 'development') {
  isDev = true;
} else {
  isDev = !app.isPackaged && fs.existsSync(path.join(__dirname, 'package.json'));
}

const backendPort = 35001;
let mainWindow;
let loadingWindow;
let backendProcess;
let updateDownloaded = false;

// Configurar auto-updater
autoUpdater.autoDownload = true; // Download automático
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.logger = console;

// Configuração específica para macOS
if (process.platform === 'darwin') {
  autoUpdater.allowDowngrade = false;
  autoUpdater.allowPrerelease = false;
  console.log('🍎 Configuração macOS ativada para auto-update');
}

// Prevenir múltiplas instâncias apenas no app empacotado
if (app.isPackaged) {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    console.log('⚠️  Outra instância já está rodando. Encerrando...');
    app.quit();
    process.exit(0);
  }
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Logs iniciais
console.log('='.repeat(50));
console.log('🚀 Calc 3D Print - Iniciando...');
console.log('='.repeat(50));
console.log('📍 Diretório:', __dirname);
console.log('📁 User Data:', app.getPath('userData'));
console.log('🔧 app.isPackaged:', app.isPackaged);
console.log('🔧 isDev:', isDev);
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

async function createWindow() {
  console.log('🪟 Criando janela principal...');
  
  const iconPath = process.platform === 'win32' 
    ? path.join(__dirname, 'build/icon.ico')
    : process.platform === 'darwin'
    ? path.join(__dirname, 'build/icon.icns')
    : path.join(__dirname, 'build/icons/512x512.png');
  
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
      devTools: isDev,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#0f172a',
    show: false,
    autoHideMenuBar: true
  });

  // Remover menu padrão em produção
  if (!isDev) {
    Menu.setApplicationMenu(null);
  }

  // Em dev, sempre usar porta do frontend (35000)
  // Em prod, usar o backend que serve o frontend buildado
  const startUrl = isDev
    ? 'http://localhost:35000'
    : `http://localhost:${backendPort}`;

  console.log('🌐 Loading URL:', startUrl);
  console.log('🔧 isDev:', isDev);

  mainWindow.loadURL(startUrl).catch(err => {
    console.error('❌ Failed to load URL:', err);
  });

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    console.log('✅ Main window ready to show');
    if (loadingWindow && !loadingWindow.isDestroyed()) {
      loadingWindow.close();
      loadingWindow = null;
    }
    mainWindow.show();
  });

  // Timeout de segurança
  setTimeout(() => {
    if (mainWindow && !mainWindow.isVisible()) {
      console.log('⏰ Timeout reached, showing window anyway');
      if (loadingWindow && !loadingWindow.isDestroyed()) {
        loadingWindow.close();
        loadingWindow = null;
      }
      mainWindow.show();
    }
  }, 10000);

  // Abrir DevTools em desenvolvimento
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
    
    if (loadingWindow && !loadingWindow.isDestroyed()) {
      loadingWindow.close();
      loadingWindow = null;
    }
    mainWindow.show();
    
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

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (loadingWindow && !loadingWindow.isDestroyed()) {
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

  // Abrir links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      require('electron').shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Verificar atualizações após 3 segundos
  if (!isDev) {
    console.log('🔍 Agendando verificação de atualizações...');
    setTimeout(() => {
      console.log('🔍 Verificando atualizações agora...');
      autoUpdater.checkForUpdates().then(result => {
        console.log('✅ Verificação de atualizações concluída:', result);
      }).catch(err => {
        console.error('❌ Erro ao verificar atualizações:', err);
      });
    }, 3000);
  } else {
    console.log('⚠️ Modo desenvolvimento - auto-update desabilitado');
  }

  // Verificar e corrigir quarentena no macOS (apenas na primeira execução)
  if (process.platform === 'darwin' && !isDev && mainWindow) {
    const { checkAndFixQuarantine } = require('./scripts/fix-quarantine');
    
    // Verificar se já foi executado antes
    const hasRunBefore = app.getPath('userData') + '/.quarantine-fixed';
    const fs = require('fs');
    
    if (!fs.existsSync(hasRunBefore)) {
      console.log('🍎 Primeira execução no macOS - verificando quarentena...');
      
      setTimeout(async () => {
        const fixed = await checkAndFixQuarantine(mainWindow);
        
        if (fixed) {
          // Marcar como executado
          fs.writeFileSync(hasRunBefore, new Date().toISOString());
        }
      }, 2000); // Aguardar 2 segundos após abrir o app
    }
  }
}

function startBackend() {
  let backendPath;
  let backendCwd;
  
  if (app.isPackaged) {
    const resourcesPath = process.resourcesPath || path.dirname(app.getAppPath());
    backendPath = path.join(resourcesPath, 'backend', 'server.js');
    backendCwd = path.join(resourcesPath, 'backend');
  } else {
    backendPath = path.join(__dirname, 'backend', 'server.js');
    backendCwd = path.join(__dirname, 'backend');
  }

  console.log('');
  console.log('🔧 Iniciando Backend...');
  console.log('📁 Caminho:', backendPath);
  console.log('📁 CWD:', backendCwd);
  
  if (!fs.existsSync(backendPath)) {
    console.error('❌ ERRO: Arquivo do backend não encontrado!');
    console.error('❌ Procurado em:', backendPath);
    return;
  }
  console.log('✅ Arquivo do backend encontrado');

  const nodePath = process.execPath;
  console.log('✅ Usando Node.js do Electron:', nodePath);
  
  const userDataPath = app.getPath('userData');
  console.log('📁 User Data Path:', userDataPath);

  backendProcess = spawn(nodePath, [backendPath], {
    cwd: backendCwd,
    env: {
      ...process.env,
      PORT: backendPort,
      NODE_ENV: isDev ? 'development' : 'production',
      ELECTRON_RUN_AS_NODE: '1',
      ELECTRON_USER_DATA: userDataPath
    }
  });

  backendProcess.stdout.on('data', (data) => {
    const message = data.toString().trim();
    if (message) {
      console.log(`[Backend] ${message}`);
    }
  });

  backendProcess.stderr.on('data', (data) => {
    const message = data.toString().trim();
    if (message) {
      console.error(`[Backend Error] ${message}`);
    }
  });
  
  console.log('✅ Processo do backend iniciado (PID:', backendProcess.pid, ')');

  backendProcess.on('close', (code, signal) => {
    console.log(`❌ Backend process exited with code ${code}, signal: ${signal}`);
    if (code !== 0 && code !== null) {
      console.error('Backend encerrou com erro. Verifique os logs acima.');
      if (!isDev) {
        dialog.showErrorBox(
          'Erro no Backend',
          `O servidor backend encerrou inesperadamente.\nCódigo: ${code}\n\nVerifique o terminal para mais detalhes.`
        );
      }
    }
  });

  backendProcess.on('error', (err) => {
    console.error('❌ Erro ao iniciar backend:', err);
    if (!isDev) {
      dialog.showErrorBox(
        'Erro ao Iniciar Backend',
        `Não foi possível iniciar o servidor backend.\n\nErro: ${err.message}`
      );
    }
  });
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

function checkBackendReady(retries = 0, maxRetries = 40) {
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
      timeout: 2000
    };
    
    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Backend está pronto!');
        console.log('');
        resolve(true);
      } else {
        if (retries < maxRetries) {
          if (retries % 4 === 0) {
            console.log(`⏳ Aguardando backend... (${retries + 1}/${maxRetries})`);
          }
          setTimeout(() => {
            checkBackendReady(retries + 1, maxRetries).then(resolve);
          }, 500);
        } else {
          console.log('⚠️ Backend não respondeu após várias tentativas');
          resolve(false);
        }
      }
    });
    
    req.on('error', (err) => {
      if (retries < maxRetries) {
        if (retries % 4 === 0) {
          console.log(`⏳ Aguardando backend... (${retries + 1}/${maxRetries})`);
        }
        setTimeout(() => {
          checkBackendReady(retries + 1, maxRetries).then(resolve);
        }, 500);
      } else {
        console.log('⚠️ Backend não respondeu após várias tentativas');
        console.log('⚠️ Último erro:', err.message);
        resolve(false);
      }
    });
    
    req.on('timeout', () => {
      req.destroy();
      if (retries < maxRetries) {
        setTimeout(() => {
          checkBackendReady(retries + 1, maxRetries).then(resolve);
        }, 500);
      } else {
        resolve(false);
      }
    });
    
    req.end();
  });
}

// Eventos do Electron
app.whenReady().then(async () => {
  createLoadingWindow();

  console.log('⏳ Preparando ambiente...');
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('🔍 Verificando se backend já está rodando...');
  let backendReady = await checkBackendReady(0, 2);
  
  if (!backendReady) {
    console.log('🔧 Iniciando backend...');
    startBackend();
    console.log('⏳ Aguardando backend iniciar...');
    backendReady = await checkBackendReady(0, 20);
  } else {
    console.log('✅ Backend já está rodando!');
  }
  
  if (!backendReady) {
    console.error('⚠️ Backend não respondeu, mas continuando...');
  }

  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopBackend();
    app.quit();
  }
});

app.on('before-quit', () => {
  stopBackend();
});

app.on('will-quit', () => {
  stopBackend();
});

// Função para comparar versões
function compareVersions(v1, v2) {
  const parts1 = v1.replace(/^v/, '').split('.').map(Number);
  const parts2 = v2.replace(/^v/, '').split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  return 0;
}

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Auto-updater eventos
autoUpdater.on('checking-for-update', () => {
  console.log('🔍 Verificando atualizações...');
});

autoUpdater.on('update-available', (info) => {
  const currentVersion = app.getVersion();
  const newVersion = info.version;
  
  console.log('🎉 Atualização disponível!');
  console.log('   Versão atual:', currentVersion);
  console.log('   Nova versão:', newVersion);
  
  if (compareVersions(newVersion, currentVersion) > 0) {
    console.log('✅ Nova versão é maior - iniciando download automático');
    if (mainWindow) {
      mainWindow.webContents.send('update-available', info);
    }
  } else {
    console.log('⚠️ Nova versão não é maior - ignorando');
  }
});

autoUpdater.on('update-not-available', (info) => {
  console.log('✅ App está atualizado');
});

autoUpdater.on('error', (err) => {
  console.error('❌ Erro ao verificar atualizações:', err);
  if (mainWindow) {
    mainWindow.webContents.send('update-error', err.message);
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  const percent = Math.round(progressObj.percent);
  console.log(`📥 Baixando atualização: ${percent}%`);
  
  if (mainWindow) {
    mainWindow.setProgressBar(progressObj.percent / 100);
    mainWindow.webContents.send('download-progress', {
      percent: percent
    });
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('✅ Atualização baixada:', info.version);
  updateDownloaded = true;
  
  if (mainWindow) {
    mainWindow.setProgressBar(-1);
    mainWindow.webContents.send('update-downloaded', info);
  }
});

// IPC handlers
ipcMain.on('check-for-updates', () => {
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
});

ipcMain.on('download-update', () => {
  if (!isDev) {
    autoUpdater.downloadUpdate();
  }
});

ipcMain.on('install-update', () => {
  console.log('� Recebidao comando install-update');
  
  if (!isDev) {
    if (!updateDownloaded) {
      console.error('❌ Nenhuma atualização foi baixada ainda!');
      return;
    }
    
    console.log('🔄 Instalando atualização e reiniciando...');
    
    if (mainWindow) {
      mainWindow.removeAllListeners('close');
    }
    
    setImmediate(() => {
      console.log('⚡ Executando quitAndInstall...');
      autoUpdater.quitAndInstall(false, true);
      
      setTimeout(() => {
        console.log('⚠️ quitAndInstall não fechou o app, forçando quit...');
        app.quit();
      }, 1000);
    });
  }
});
