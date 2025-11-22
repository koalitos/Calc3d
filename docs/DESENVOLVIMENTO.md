# 🛠️ Guia de Desenvolvimento - Calc 3D Print

Guia completo para desenvolvedores que querem contribuir ou compilar o projeto.

## 📋 Índice

- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Desenvolvimento](#desenvolvimento)
- [Build](#build)
- [Testes](#testes)
- [Contribuindo](#contribuindo)

## 💻 Requisitos

### Obrigatórios

- **Node.js:** 18.x ou superior
- **npm:** 9.x ou superior
- **Git:** Para clonar o repositório
- **Windows:** Para build do instalador (ou WSL)

### Recomendados

- **VS Code:** Editor recomendado
- **Postman:** Para testar API
- **DB Browser for SQLite:** Para visualizar banco de dados

### Verificar Instalação

```bash
node --version    # v18.0.0 ou superior
npm --version     # 9.0.0 ou superior
git --version     # Qualquer versão recente
```

## 📥 Instalação

### 1. Clonar Repositório

```bash
git clone https://github.com/koalitos/calc3D.git
cd calc3D
```

### 2. Instalar Dependências do Frontend

```bash
npm install
```

### 3. Instalar Dependências do Backend

```bash
cd backend
npm install
cd ..
```

### 4. Verificar Instalação

```bash
npm run check
```

## 📁 Estrutura do Projeto

```
calc3D/
├── backend/                    # Backend Node.js + Express
│   ├── src/
│   │   ├── config/            # Configurações
│   │   │   └── database.js    # Configuração SQLite
│   │   ├── controllers/       # Controladores
│   │   │   ├── authController.js
│   │   │   ├── filamentController.js
│   │   │   ├── machineController.js
│   │   │   └── projectController.js
│   │   ├── middleware/        # Middlewares
│   │   │   └── auth.js        # Autenticação JWT
│   │   ├── models/            # Modelos de dados
│   │   │   └── database.sql   # Schema do banco
│   │   ├── routes/            # Rotas da API
│   │   │   ├── auth.js
│   │   │   ├── filaments.js
│   │   │   ├── machines.js
│   │   │   └── projects.js
│   │   ├── utils/             # Utilitários
│   │   │   ├── stlParser.js   # Parser de STL
│   │   │   └── calculator.js  # Cálculos
│   │   └── server.js          # Servidor principal
│   ├── database.sqlite        # Banco de dados (gerado)
│   ├── package.json
│   └── .env                   # Variáveis de ambiente
│
├── frontend/                   # Frontend React
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── Filaments/
│   │   │   │   ├── FilamentList.jsx
│   │   │   │   └── FilamentForm.jsx
│   │   │   ├── Machines/
│   │   │   │   ├── MachineList.jsx
│   │   │   │   └── MachineForm.jsx
│   │   │   └── Projects/
│   │   │       ├── ProjectList.jsx
│   │   │       ├── ProjectForm.jsx
│   │   │       └── STLViewer.jsx
│   │   ├── services/          # Serviços API
│   │   │   └── api.js
│   │   ├── utils/             # Utilitários
│   │   ├── App.jsx            # Componente principal
│   │   ├── index.jsx          # Entry point
│   │   └── index.css          # Estilos globais
│   └── package.json
│
├── docs/                       # Documentação e site
│   ├── index.html             # GitHub Pages
│   ├── INSTALACAO.md
│   ├── DESENVOLVIMENTO.md
│   └── API.md
│
├── scripts/                    # Scripts utilitários
│   ├── build.js               # Script de build
│   └── reset-db.js            # Reset do banco
│
├── electron.js                 # Electron main process
├── package.json               # Dependências principais
├── .gitignore
├── LICENSE.txt
└── README.md
```

## 🚀 Desenvolvimento

### Modo Desenvolvimento

#### Opção 1: Tudo de uma vez (Recomendado)

```bash
npm run electron-dev
```

Isso inicia:
- ✅ Backend (porta 3001)
- ✅ Frontend (React Dev Server)
- ✅ Electron (janela do aplicativo)

#### Opção 2: Separadamente

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm start
```

**Terminal 3 - Electron:**
```bash
npm run electron
```

### Hot Reload

- **Frontend:** Atualiza automaticamente ao salvar
- **Backend:** Reinicia automaticamente (nodemon)
- **Electron:** Precisa reiniciar manualmente

### Variáveis de Ambiente

Crie `.env` na pasta `backend/`:

```env
# Servidor
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui_123456

# Database
DB_PATH=./database.sqlite

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🏗️ Build

### Build de Desenvolvimento

```bash
npm run build
```

Gera build do React em `frontend/build/`

### Build de Produção (Instalador)

```bash
npm run dist
```

Gera instalador em `dist/`:
- `Calc3DPrint-Setup-1.0.0.exe` (Windows)

### Configuração do Build

Edite `package.json` na raiz:

```json
{
  "build": {
    "appId": "com.calc3dprint.app",
    "productName": "Calc 3D Print",
    "directories": {
      "output": "dist"
    },
    "files": [
      "frontend/build/**/*",
      "backend/**/*",
      "electron.js",
      "package.json"
    ],
    "win": {
      "target": "nsis",
      "icon": "public/icon.ico"
    }
  }
}
```

## 🧪 Testes

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
npm test
```

### Testes E2E (Futuro)

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:coverage
```

## 🗄️ Banco de Dados

### Schema

Ver `backend/src/models/database.sql`

### Resetar Banco

```bash
cd backend
npm run reset
```

**⚠️ Atenção:** Isso apaga todos os dados!

### Visualizar Dados

Use **DB Browser for SQLite**:
1. Abra `backend/database.sqlite`
2. Navegue pelas tabelas

### Migrations (Futuro)

Sistema de migrations em desenvolvimento.

## 🔧 Ferramentas de Desenvolvimento

### VS Code Extensions Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "christian-kohler.path-intellisense"
  ]
}
```

### ESLint

```bash
npm run lint
```

### Prettier

```bash
npm run format
```

### Configuração do VS Code

Crie `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🐛 Debug

### Backend (VS Code)

Crie `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "program": "${workspaceFolder}/backend/src/server.js",
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

### Frontend (Chrome DevTools)

1. Abra o aplicativo
2. Menu > View > Toggle Developer Tools
3. Ou pressione `Ctrl+Shift+I`

### Electron

```bash
npm run electron-dev
```

Abre com DevTools automaticamente.

## 📦 Dependências Principais

### Frontend

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "tailwindcss": "^3.x",
  "@shadcn/ui": "latest"
}
```

### Backend

```json
{
  "express": "^4.18.0",
  "sqlite3": "^5.1.0",
  "bcrypt": "^5.1.0",
  "jsonwebtoken": "^9.0.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0"
}
```

### Electron

```json
{
  "electron": "^27.0.0",
  "electron-builder": "^24.0.0"
}
```

## 🤝 Contribuindo

### Workflow

1. **Fork** o repositório
2. **Clone** seu fork
3. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
4. **Desenvolva** e teste
5. **Commit**: `git commit -m 'Add: nova funcionalidade'`
6. **Push**: `git push origin feature/nova-funcionalidade`
7. **Abra** um Pull Request

### Padrões de Commit

Use commits semânticos:

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração
test: adiciona testes
chore: tarefas de manutenção
```

### Code Style

- **JavaScript:** ESLint + Prettier
- **React:** Functional Components + Hooks
- **CSS:** Tailwind CSS
- **Indentação:** 2 espaços

### Pull Request

Seu PR deve:
- ✅ Ter descrição clara
- ✅ Referenciar issue (se houver)
- ✅ Passar nos testes
- ✅ Seguir o code style
- ✅ Incluir documentação (se necessário)

## 🔐 Segurança

### Boas Práticas

1. **Nunca** commite `.env`
2. **Use** JWT para autenticação
3. **Hash** senhas com bcrypt
4. **Valide** inputs no backend
5. **Sanitize** dados do usuário

### Reportar Vulnerabilidades

Encontrou uma vulnerabilidade?
- **NÃO** abra issue pública
- Envie email para: [seu-email]
- Ou use GitHub Security Advisories

## 📊 Performance

### Otimizações

- **Frontend:** Code splitting, lazy loading
- **Backend:** Índices no banco, cache
- **Electron:** Preload scripts

### Profiling

```bash
# Frontend
npm run build -- --profile

# Backend
node --prof backend/src/server.js
```

## 🌍 Internacionalização (Futuro)

Sistema de i18n em desenvolvimento para suportar:
- Português (BR) ✅
- Inglês (planejado)
- Espanhol (planejado)

## 📱 Plataformas Futuras

- ✅ Windows (atual)
- 🔄 Linux (planejado)
- 🔄 macOS (planejado)
- 🔄 Web (planejado)

## 🚀 Roadmap

### v1.1
- [ ] Exportação de relatórios PDF
- [ ] Backup automático
- [ ] Temas customizáveis

### v1.2
- [ ] Suporte a múltiplos idiomas
- [ ] Gráficos e estatísticas
- [ ] Histórico de projetos

### v2.0
- [ ] Versão web
- [ ] Sincronização na nuvem
- [ ] App mobile

## 📚 Recursos

### Documentação
- [React](https://react.dev/)
- [Electron](https://www.electronjs.org/)
- [Express](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Tutoriais
- [Electron + React](https://www.electronjs.org/docs/latest/tutorial/tutorial-prerequisites)
- [JWT Authentication](https://jwt.io/introduction)
- [SQLite with Node.js](https://github.com/mapbox/node-sqlite3)

## 💡 Dicas

1. **Use branches** para features
2. **Teste localmente** antes de commitar
3. **Documente** código complexo
4. **Siga** os padrões do projeto
5. **Peça ajuda** se precisar

## 🐛 Problemas Comuns

### Erro ao instalar dependências

```bash
# Limpar cache
npm cache clean --force

# Deletar node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### Porta 3001 em uso

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID [PID] /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Electron não abre

```bash
# Rebuild electron
npm run rebuild-electron
```

## 📞 Suporte

### Comunidade
- **Issues:** https://github.com/koalitos/calc3D/issues
- **Discussions:** https://github.com/koalitos/calc3D/discussions
- **Pull Requests:** https://github.com/koalitos/calc3D/pulls

### Documentação
- [Instalação](INSTALACAO.md)
- [API](API.md)
- [Site](https://koalitos.github.io/calc3D/)

## ✅ Checklist do Desenvolvedor

- [ ] Node.js instalado
- [ ] Repositório clonado
- [ ] Dependências instaladas
- [ ] Ambiente de desenvolvimento funcionando
- [ ] Consegue fazer build
- [ ] Testes passando
- [ ] Code style configurado
- [ ] Leu a documentação

## 🎉 Pronto para Contribuir!

Agora você está pronto para desenvolver e contribuir com o Calc 3D Print!

Qualquer dúvida, abra uma issue ou discussão no GitHub.

## ☕ Apoie o Projeto

Fiz este projeto para ajudar a comunidade de impressão 3D. Se ele te ajudou e você quiser me ajudar também, pode me apoiar no Ko-fi:

**[☕ Apoiar no Ko-fi](https://ko-fi.com/koalitos)**

Qualquer ajuda é muito bem-vinda e me motiva a continuar desenvolvendo! 💙

---

**Desenvolvido com ❤️ para a comunidade de impressão 3D**

**Site:** https://koalitos.github.io/calc3D/  
**GitHub:** https://github.com/koalitos/calc3D  
**Issues:** https://github.com/koalitos/calc3D/issues
