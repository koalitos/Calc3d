const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let loadingWindow;
let backendProcess;

// Configuração do backend
const fs = require('fs');

// Detectar se está em desenvolvimento de forma mais robusta
// 1. Se NODE_ENV=production, forçar produção
// 2. Se NODE_ENV=development, forçar desenvolvimento
// 3. Senão, verificar se está empacotado
// 4. Senão, verificar se package.json existe (código fonte)
let isDev;
if (process.env.NODE_ENV === 'production') {
  isDev = false;
} else if (process.env.NODE_ENV === 'development') {
  isDev = true;
} else {
  isDev = !app.isPackaged && fs.existsSync(path.join(__dirname, 'package.json'));
}

const backendPort = 35001;

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

async function createWindow() {
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

  // Carregar o app
  // Se o frontend dev estiver rodando (porta 35000), usar ele
  // Senão, carregar do backend (que serve o frontend buildado)
  const frontendDevRunning = await checkPort(35000);
  const startUrl = frontendDevRunning
    ? 'http://localhost:35000'
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
  // Determinar o caminho do backend baseado em onde o app está rodando
  let backendPath;
  let backendCwd;
  
  // Se o app está empacotado (instalado), usar process.resourcesPath
  // Senão, usar o diretório do projeto (__dirname)
  if (app.isPackaged) {
    // App empacotado (instalado): backend está em Resources
    // __dirname aponta para app.asar, então usar process.resourcesPath
    const resourcesPath = process.resourcesPath || path.dirname(app.getAppPath());
    backendPath = path.join(resourcesPath, 'backend', 'server.js');
    backendCwd = path.join(resourcesPath, 'backend');
  } else {
    // App não empacotado (desenvolvimento ou test-prod): backend está no projeto
    backendPath = path.join(__dirname, 'backend', 'server.js');
    backendCwd = path.join(__dirname, 'backend');
  }

  console.log('');
  console.log('🔧 Iniciando Backend...');
  console.log('📁 Caminho:', backendPath);
  console.log('📁 CWD:', backendCwd);
  console.log('🔧 Modo:', isDev ? 'DESENVOLVIMENTO' : 'PRODUÇÃO');
  
  // Verificar se o arquivo existe
  if (!fs.existsSync(backendPath)) {
    console.error('❌ ERRO: Arquivo do backend não encontrado!');
    console.error('❌ Procurado em:', backendPath);
    console.error('❌ __dirname:', __dirname);
    console.error('❌ process.resourcesPath:', process.resourcesPath);
    return;
  }
  console.log('✅ Arquivo do backend encontrado');

  // Iniciar o servidor backend
  // Usar o Node.js embutido no Electron (sempre disponível!)
  const nodePath = process.execPath;
  console.log('✅ Usando Node.js do Electron:', nodePath);
  
  // Usar Electron como Node.js com ELECTRON_RUN_AS_NODE
  // Obter pasta de dados do usuário
  const userDataPath = app.getPath('userData');
  console.log('📁 userData:', userDataPath);

  backendProcess = spawn(nodePath, [backendPath], {
    cwd: backendCwd,
    env: {
      ...process.env,
      PATH: '/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:' + (process.env.PATH || ''),
      PORT: backendPort,
      NODE_ENV: isDev ? 'development' : 'production',
      ELECTRON_RUN_AS_NODE: '1', // Força o Electron a rodar como Node.js
      ELECTRON_USER_DATA: userDataPath // ← CRÍTICO para persistência de dados!
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
      dialog.showErrorBox(
        'Erro no Backend',
        `O servidor backend encerrou inesperadamente.\nCódigo: ${code}\n\nVerifique o terminal para mais detalhes.`
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

// Verificar se uma porta está respondendo
function checkPort(port) {
  return new Promise((resolve) => {
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 500
    };
    
    const req = http.request(options, (res) => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Verificar se o backend está pronto
function checkBackendReady(retries = 0, maxRetries = 40) {
  // maxRetries padrão = 40 (20 segundos)
  
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
      timeout: 2000 // Aumentado para 2 segundos
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
            checkBackendReady(retries + 1, maxRetries).then(resolve);
          }, 500);
        } else {
          console.log('⚠️ Backend não respondeu após várias tentativas');
          console.log('⚠️ Verifique se a porta 35001 está livre: lsof -i :35001');
          console.log('');
          resolve(false);
        }
      }
    });
    
    req.on('error', (err) => {
      if (retries < maxRetries) {
        if (retries % 4 === 0) {
          console.log(`⏳ Aguardando backend... (${retries + 1}/${maxRetries}) - ${err.code || err.message}`);
        }
        setTimeout(() => {
          checkBackendReady(retries + 1, maxRetries).then(resolve);
        }, 500);
      } else {
        console.log('⚠️ Backend não respondeu após várias tentativas');
        console.log('⚠️ Último erro:', err.message);
        console.log('⚠️ Verifique se a porta 35001 está livre: lsof -i :35001');
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

// Configurar auto-updater
autoUpdater.autoDownload = true; // Baixar automaticamente
autoUpdater.autoInstallOnAppQuit = true; // Instalar ao fechar o app
autoUpdater.logger = console;

// IPC Handlers para auto-update
ipcMain.on('check-for-updates', () => {
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
});

ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall(false, true);
});

// Eventos do auto-updater
autoUpdater.on('checking-for-update', () => {
  console.log('Verificando atualizações...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Atualização disponível:', info.version);
  
  // Enviar para o renderer process
  if (mainWindow) {
    mainWindow.webContents.send('update-available', info);
  }
});

autoUpdater.on('update-not-available', (info) => {
  console.log('App está atualizado');
  
  if (mainWindow) {
    mainWindow.webContents.send('update-not-available', info);
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  let message = `Baixando: ${Math.round(progressObj.percent)}%`;
  console.log(message);
  
  if (mainWindow) {
    mainWindow.setProgressBar(progressObj.percent / 100);
    mainWindow.webContents.send('download-progress', {
      percent: Math.round(progressObj.percent)
    });
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Atualização baixada');
  
  if (mainWindow) {
    mainWindow.setProgressBar(-1); // Remove barra de progresso
    mainWindow.webContents.send('update-downloaded', info);
  }
});

autoUpdater.on('error', (error) => {
  console.error('Erro na atualização:', error);
  
  if (mainWindow) {
    mainWindow.webContents.send('update-error', error.message);
  }
});

// Este método será chamado quando o Electron terminar a inicialização
app.whenReady().then(async () => {
  // Mostrar tela de loading
  createLoadingWindow();

  // Aguardar um pouco antes de iniciar o backend
  console.log('⏳ Preparando ambiente...');
  await new Promise(resolve => setTimeout(resolve, 1000));

  // SEMPRE iniciar o backend (exceto se já estiver rodando)
  console.log('🔍 Verificando se backend já está rodando...');
  let backendReady = await checkBackendReady(0, 2); // max 2 tentativas
  
  // Se não estiver rodando, iniciar SEMPRE
  if (!backendReady) {
    console.log('🔧 Iniciando backend...');
    startBackend();
    
    // Aguardar o backend estar pronto
    console.log('⏳ Aguardando backend iniciar...');
    backendReady = await checkBackendReady(0, 20); // 20 tentativas = 10 segundos
  } else {
    console.log('✅ Backend já está rodando!');
  }
  
  // Se ainda não estiver pronto, mostrar erro mas continuar
  if (!backendReady) {
    console.error('⚠️ Backend não respondeu, mas continuando...');
    console.error('⚠️ O app pode não funcionar corretamente');
  }

  
  // Criar janela principal
  await createWindow();
  
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
