# 📦 Instruções de Compilação - Calc 3D Print

## 🎯 Gerar Instalador para Windows

### Passo 1: Preparar o ambiente
```bash
# Certifique-se de que todas as dependências estão instaladas
npm install

# Instale as dependências do backend
cd backend
npm install
cd ..
```

### Passo 2: Compilar o instalador
```bash
npm run electron-build-win
```

### Passo 3: Localizar o instalador
O instalador será gerado em:
```
dist/Calc3DPrint-Setup-1.0.0.exe
```

## 📋 O que o instalador inclui:

✅ **Aplicativo completo:**
- Frontend React otimizado
- Backend Node.js + Express
- Banco de dados SQLite
- Sistema de autenticação JWT
- Analisador de arquivos STL
- Todas as dependências necessárias

✅ **Recursos do instalador:**
- Escolha do diretório de instalação
- Atalho na área de trabalho
- Atalho no menu iniciar
- Desinstalador automático
- ~150-200 MB de tamanho

## 🍎 Gerar Instalador para Mac

```bash
npm run electron-build-mac
```

O arquivo `.dmg` será gerado em:
```
dist/Calc3DPrint-1.0.0-x64.dmg
dist/Calc3DPrint-1.0.0-arm64.dmg  (Apple Silicon)
```

## 🔧 Personalizar o Instalador

### Alterar ícone:
1. Coloque seu ícone em `build/icon.ico` (Windows)
2. Coloque seu ícone em `build/icon.icns` (Mac)

### Alterar versão:
Edite o `package.json`:
```json
{
  "version": "1.0.0"
}
```

### Alterar nome do produto:
Edite o `package.json`:
```json
{
  "build": {
    "productName": "Seu Nome Aqui"
  }
}
```

## 📤 Distribuir o Instalador

### Windows:
1. Envie o arquivo `Calc3DPrint-Setup-1.0.0.exe`
2. O usuário executa e segue o assistente de instalação
3. Não precisa de Node.js ou outras dependências

### Mac:
1. Envie o arquivo `.dmg`
2. O usuário abre e arrasta para Applications
3. Funciona em Intel e Apple Silicon

## 🐛 Solução de Problemas

### Erro: "electron-builder not found"
```bash
npm install electron-builder --save-dev
```

### Erro: "Cannot find module"
```bash
# Limpe e reinstale
rm -rf node_modules
npm install
```

### Build muito lento
- Normal na primeira vez (pode levar 5-10 minutos)
- Builds subsequentes são mais rápidos

### Testar antes de compilar
```bash
npm run electron-dev
```

## 📊 Tamanhos Aproximados

- **Instalador Windows:** ~80-100 MB
- **Aplicativo instalado:** ~150-200 MB
- **DMG Mac:** ~100-120 MB

## 🚀 Comandos Rápidos

```bash
# Desenvolvimento
npm run electron-dev

# Build Windows
npm run electron-build-win

# Build Mac
npm run electron-build-mac

# Build ambos
npm run electron-build

# Limpar dist
rm -rf dist
```

## ✅ Checklist antes de distribuir

- [ ] Testou o app em modo desenvolvimento
- [ ] Atualizou a versão no package.json
- [ ] Verificou se todos os recursos funcionam
- [ ] Testou o instalador em uma máquina limpa
- [ ] Criou documentação para o usuário final
