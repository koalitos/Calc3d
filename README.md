# 💎 Calc 3D Print

Sistema completo para calcular custos e preços de venda de impressões 3D.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-blue)
![GitHub stars](https://img.shields.io/github/stars/koalitos/calc3D?style=social)

**🌐 [Visite o Site Oficial](https://koalitos.github.io/calc3D/)**

## 🎯 Funcionalidades

### 🧵 Gestão de Filamentos
- Cadastro de filamentos (PLA, ABS, PETG, TPU, Nylon)
- Controle de peso e custo
- Cálculo automático de custo por grama

### 🖨️ Gestão de Máquinas
- Cadastro de impressoras 3D
- Controle de potência e consumo
- Cálculo de custo de energia
- Depreciação por hora de uso

### 📦 Gestão de Projetos
- Upload e análise de arquivos STL
- Cálculo automático de volume e peso
- Estimativa de tempo de impressão
- Cálculo de custos completo
- Definição de margem de lucro
- **Preço de venda sugerido**

### 🔐 Sistema de Autenticação
- Login seguro com JWT
- Senhas criptografadas (bcrypt)
- Dados isolados por usuário

### 📊 Análise de STL
- Upload de arquivos .stl
- Cálculo de volume (mm³ e cm³)
- Estimativa de peso baseada em densidade
- Estimativa de tempo de impressão

## 🚀 Instalação

### Para Usuários

Baixe o instalador para seu sistema operacional:
- **Windows:** `Calc3DPrint-Setup-1.0.0.exe`
- **macOS:** `Calc3DPrint-1.0.0-x64.dmg` (Intel) ou `Calc3DPrint-1.0.0-arm64.dmg` (Apple Silicon)

**[📥 Download na página de Releases](https://github.com/koalitos/calc3D/releases)**

Veja o [Guia de Instalação](docs/INSTALACAO.md) completo.

### Para Desenvolvedores

```bash
# Clone o repositório
git clone https://github.com/koalitos/calc3D.git
cd calc3D

# Instale dependências do frontend
npm install

# Instale dependências do backend
cd backend
npm install
cd ..

# Execute em modo desenvolvimento
npm run electron-dev
```

Veja o [Guia de Desenvolvimento](docs/DESENVOLVIMENTO.md) completo.

## 📁 Estrutura do Projeto

```
calc3D/
├── backend/          # Backend Node.js + Express + SQLite
├── frontend/         # Frontend React + Electron
├── docs/            # Documentação
├── scripts/         # Scripts utilitários
└── public/          # Arquivos públicos
```

## 🛠️ Tecnologias

**Frontend:**
- React 18
- Tailwind CSS
- shadcn/ui
- Electron 27

**Backend:**
- Node.js
- Express
- SQLite
- JWT + Bcrypt

## 📖 Documentação

- [Guia de Instalação](docs/INSTALACAO.md) - Para usuários finais
- [Guia de Desenvolvimento](docs/DESENVOLVIMENTO.md) - Para desenvolvedores
- [Documentação da API](docs/API.md) - Endpoints e exemplos
- [Instruções de Build](build-instructions.md) - Como compilar

## 🎨 Screenshots

### Tela de Login
Sistema de autenticação seguro com JWT

### Dashboard
Interface moderna com tema escuro

### Análise de STL
Upload e análise automática de arquivos 3D

### Cálculo de Custos
Cálculo detalhado com preço de venda sugerido

## 💻 Comandos

```bash
# Desenvolvimento
npm run electron-dev    # Inicia tudo (backend + frontend + electron)

# Build
npm run dist           # Gera instalador Windows

# Backend
cd backend
npm start             # Inicia apenas o backend
npm run reset         # Reseta o banco de dados
```

## 📊 Cálculo de Custos

O sistema calcula automaticamente:

1. **Custo do Filamento:** Baseado no peso usado e custo por grama
2. **Custo de Energia:** Potência da máquina × tempo × custo kWh
3. **Depreciação:** Custo de desgaste da máquina por hora
4. **Custo Total:** Soma de todos os custos
5. **Preço de Venda:** Custo total + margem de lucro

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT com expiração
- Dados locais (SQLite)
- Sem conexão com internet necessária

## 📦 Distribuição

### Plataformas Suportadas
- ✅ **Windows** 10/11 (64-bit)
- ✅ **macOS** 10.13+ (Intel e Apple Silicon)
- 🔄 **Linux** (em desenvolvimento)

### O instalador inclui:
- ✅ Aplicativo completo
- ✅ Backend integrado
- ✅ Banco de dados SQLite
- ✅ Todas as dependências
- ✅ ~150-200 MB instalado

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [DESENVOLVIMENTO.md](docs/DESENVOLVIMENTO.md)

## 📝 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE)

## 👨‍💻 Autor

**Koalitos**
- GitHub: [@koalitos](https://github.com/koalitos)
- Projeto: [Calc 3D Print](https://github.com/koalitos/calc3D)

Desenvolvido com ❤️ para a comunidade de impressão 3D

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

Veja [DESENVOLVIMENTO.md](docs/DESENVOLVIMENTO.md) para mais detalhes.

## 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/koalitos/calc3D/issues) descrevendo:
- O que aconteceu
- O que deveria acontecer
- Passos para reproduzir
- Versão do sistema e do aplicativo

## 📞 Suporte

- **Issues:** [github.com/koalitos/calc3D/issues](https://github.com/koalitos/calc3D/issues)
- **Discussões:** [github.com/koalitos/calc3D/discussions](https://github.com/koalitos/calc3D/discussions)
- **Site:** [koalitos.github.io/calc3D](https://koalitos.github.io/calc3D/)

---

© 2025 Koalitos - Licença MIT

⭐ Se este projeto te ajudou, considere dar uma estrela!
