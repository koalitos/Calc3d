# 🏗️ Guia de Build - Calc 3D Print

Instruções completas para compilar o aplicativo para diferentes plataformas.

## 📋 Pré-requisitos

### Todos os Sistemas

- **Node.js:** 18.x ou superior
- **npm:** 9.x ou superior
- **Git:** Para clonar o repositório

```bash
node --version    # v18.0.0+
npm --version     # 9.0.0+
```

### Windows

- **Windows 10/11** (64-bit)
- **Visual Studio Build Tools** (opcional, para módulos nativos)

### macOS

- **macOS 10.13+**
- **Xcode Command Line Tools:**
  ```bash
  xcode-select --install
  ```

### Linux

- **Ubuntu 20.04+** ou equivalente
- Dependências:
  ```bash
  sudo apt-get install -y build-essential libssl-dev
  ```

## 📥 Instalação

### 1. Clonar Repositório

```bash
git clone https://github.com/koalitos/calc3D.git
cd calc3D
```

### 2. Instalar Dependências

```bash
# Dependências principais
npm install

# Dependências do frontend
cd frontend
npm install
cd ..

# Dependências do backend
cd backend
npm install
cd ..
```

## 🚀 Build

### Build Completo (Todas as Plataformas)

```bash
npm run dist:all
```

Gera instaladores para Windows, macOS e Linux.

### Build por Plataforma

#### Windows

```bash
npm run dist:win
```

**Saída:**
- `dist/Calc3DPrint-Setup-1.0.0.exe` (~150-200 MB)

**Formato:** NSIS Installer

#### macOS

```bash
npm run dist:mac
```

**Saída:**
- `dist/Calc3DPrint-1.0.0-x64.dmg` (Intel)
- `dist/Calc3DPrint-1.0.0-arm64.dmg` (Apple Silicon)

**Formato:** DMG

**Nota:** Para assinar o app no macOS, você precisa de:
- Apple Developer Account
- Certificado de desenvolvedor
- Configurar variáveis de ambiente:
  ```bash
  export CSC_LINK=/path/to/certificate.p12
  export CSC_KEY_PASSWORD=your_password
  ```

#### Linux

```bash
npm run dist:linux
```

**Saída:**
- `dist/Calc3DPrint-1.0.0-x64.AppImage`
- `dist/calc3dprint_1.0.0_amd64.deb`

**Formatos:** AppImage e DEB

### Build Apenas do Frontend

```bash
npm run build
```

Gera build otimizado em `frontend/build/`

## 🧪 Testar Build Localmente

### Modo Desenvolvimento

```bash
npm run electron-dev
```

Inicia:
- Backend (porta 3001)
- Frontend (porta 3000)
- Electron

### Testar Build de Produção

```bash
# 1. Fazer build
npm run build

# 2. Testar localmente
npm run electron
```

## 📦 Estrutura de Build

```
dist/
├── Calc3DPrint-Setup-1.0.0.exe          # Windows
├── Calc3DPrint-1.0.0-x64.dmg            # macOS Intel
├── Calc3DPrint-1.0.0-arm64.dmg          # macOS Apple Silicon
├── Calc3DPrint-1.0.0-x64.AppImage       # Linux AppImage
├── calc3dprint_1.0.0_amd64.deb          # Linux DEB
└── latest.yml / latest-mac.yml          # Auto-update info
```

## ⚙️ Configuração do Build

### package.json

A configuração do electron-builder está em `package.json`:

```json
{
  "build": {
    "appId": "com.koalitos.calc3dprint",
    "productName": "Calc 3D Print",
    "copyright": "Copyright © 2025 Koalitos",
    "directories": {
      "output": "dist"
    },
    "files": [
      "electron.js",
      "frontend/build/**/*",
      "backend/**/*"
    ]
  }
}
```

### Customizar Build

Edite `package.json` para:
- Mudar ícone: `build.win.icon`, `build.mac.icon`
- Mudar nome: `build.productName`
- Adicionar arquivos: `build.files`
- Configurar instalador: `build.nsis`, `build.dmg`

## 🎨 Ícones

### Criar Ícones

Você precisa de ícones em diferentes formatos:

**Windows:**
- `build/icon.ico` (256x256)

**macOS:**
- `build/icon.icns` (512x512)

**Linux:**
- `build/icons/` (vários tamanhos: 16, 32, 48, 64, 128, 256, 512)

### Ferramentas para Criar Ícones

- **Online:** [iConvert Icons](https://iconverticons.com/)
- **macOS:** `iconutil` (nativo)
- **Windows:** [IcoFX](https://icofx.ro/)
- **Multiplataforma:** [Electron Icon Maker](https://www.npmjs.com/package/electron-icon-maker)

```bash
# Instalar electron-icon-maker
npm install -g electron-icon-maker

# Gerar ícones (a partir de PNG 1024x1024)
electron-icon-maker --input=icon.png --output=build
```

## 🔐 Code Signing

### Windows

1. Obter certificado de code signing
2. Configurar variáveis:
   ```bash
   set CSC_LINK=path\to\certificate.pfx
   set CSC_KEY_PASSWORD=your_password
   ```

### macOS

1. Obter Apple Developer Account
2. Criar certificado no Keychain
3. Configurar:
   ```bash
   export CSC_LINK=/path/to/certificate.p12
   export CSC_KEY_PASSWORD=your_password
   export APPLE_ID=your@email.com
   export APPLE_ID_PASSWORD=app-specific-password
   ```

### Notarização (macOS)

Para distribuir fora da App Store:

```bash
npm run dist:mac
# electron-builder fará notarização automaticamente se configurado
```

## 📤 Publicação

### GitHub Releases

1. **Criar Tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Build:**
   ```bash
   npm run dist:all
   ```

3. **Upload Manual:**
   - Vá em: https://github.com/koalitos/calc3D/releases
   - Clique em "Draft a new release"
   - Escolha a tag
   - Faça upload dos arquivos de `dist/`

### Publicação Automática

Configure no `package.json`:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "koalitos",
      "repo": "calc3D"
    }
  }
}
```

Então:

```bash
# Configurar token do GitHub
export GH_TOKEN=your_github_token

# Build e publicar
npm run dist:all
```

## 🔄 Auto-Update

O electron-builder gera arquivos `latest.yml` para auto-update.

Para habilitar:

1. Publique releases no GitHub
2. O app verificará atualizações automaticamente
3. Usuários serão notificados de novas versões

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
# Limpar e reinstalar
npm run clean
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### Erro: "ENOSPC: System limit"

Linux:
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Erro: "Electron failed to install"

```bash
# Limpar cache
npm cache clean --force

# Reinstalar electron
npm install electron --save-dev
```

### Build muito lento

```bash
# Usar cache
npm run dist -- --cache

# Build apenas para sua plataforma
npm run dist:win  # ou dist:mac, dist:linux
```

### Erro de permissão (macOS)

```bash
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

## 📊 Otimização

### Reduzir Tamanho

1. **Remover DevDependencies:**
   ```bash
   npm prune --production
   ```

2. **Comprimir com UPX:**
   ```json
   {
     "build": {
       "compression": "maximum"
     }
   }
   ```

3. **Excluir arquivos desnecessários:**
   ```json
   {
     "build": {
       "files": [
         "!**/*.map",
         "!**/*.md"
       ]
     }
   }
   ```

### Build Mais Rápido

```bash
# Desabilitar compressão
npm run dist -- --compression=store

# Build apenas para arquitetura atual
npm run dist:win -- --x64
```

## 📝 Checklist de Build

Antes de fazer release:

- [ ] Versão atualizada em `package.json`
- [ ] Changelog atualizado
- [ ] Testes passando
- [ ] Build local funcionando
- [ ] Ícones criados
- [ ] Certificados configurados (se aplicável)
- [ ] README atualizado
- [ ] Documentação atualizada

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
npm run electron-dev        # Dev com hot reload
npm start                   # Apenas backend + frontend

# Build
npm run build              # Build do frontend
npm run dist               # Build completo
npm run dist:win           # Build Windows
npm run dist:mac           # Build macOS
npm run dist:linux         # Build Linux
npm run dist:all           # Build todas plataformas

# Utilitários
npm run clean              # Limpar builds
npm run lint               # Verificar código
npm run format             # Formatar código
npm test                   # Executar testes
```

## 📚 Recursos

- [Electron Builder Docs](https://www.electron.build/)
- [Electron Docs](https://www.electronjs.org/docs)
- [Code Signing Guide](https://www.electron.build/code-signing)
- [Multi Platform Build](https://www.electron.build/multi-platform-build)

## 💡 Dicas

1. **Teste em VM** antes de distribuir
2. **Use CI/CD** para builds automáticos (GitHub Actions)
3. **Versione corretamente** (semver)
4. **Documente mudanças** no CHANGELOG
5. **Teste instaladores** em máquinas limpas

## 🚀 CI/CD (GitHub Actions)

Exemplo de workflow em `.github/workflows/build.yml`:

```yaml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm install
      - run: npm run dist
      
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: dist/*
```

---

**Desenvolvido com ❤️ para a comunidade de impressão 3D**

**Site:** https://koalitos.github.io/calc3D/  
**GitHub:** https://github.com/koalitos/calc3D
