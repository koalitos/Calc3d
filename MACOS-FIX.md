# Correções para macOS

Este documento descreve as correções implementadas para garantir que o Calc 3D Print funcione corretamente no macOS.

## Problema

O macOS bloqueia aplicativos não assinados com certificado Apple Developer através do sistema de "quarentena". Isso impede que o app execute normalmente após o download.

## Solução Implementada

### 1. Script de Correção Automática de Quarentena

**Arquivo:** `scripts/fix-quarantine.js`

Este script:
- Detecta automaticamente se o app está em quarentena
- Solicita permissão ao usuário de forma amigável
- Remove os atributos de quarentena usando `xattr -cr`
- Executa apenas na primeira vez que o app é aberto
- Fornece instruções manuais caso a remoção automática falhe

### 2. Entitlements para Processos Filhos

**Arquivo:** `build/entitlements.mac.inherit.plist`

Garante que o processo do backend (Node.js) herde as mesmas permissões do app principal:
- JIT compilation (necessário para V8/Electron)
- Memória executável não assinada (necessário para Node.js addons)
- Validação de biblioteca desabilitada
- Acesso à rede (cliente e servidor)

### 3. Configuração Aprimorada do package.json

Adicionado ao build do macOS:
- Target `zip` além de `dmg` (necessário para auto-update)
- `hardenedRuntime: true` (segurança aprimorada)
- Referências aos arquivos de entitlements
- `identity: null` (sem assinatura de código)
- `notarize: false` (sem notarização Apple)

### 4. Integração no electron.js

O script de quarentena é chamado automaticamente:
- Apenas no macOS
- Apenas em modo produção (não em desenvolvimento)
- Apenas na primeira execução
- Após 2 segundos da abertura do app (para não atrasar o carregamento)

## Como Funciona

1. **Primeira execução:** O usuário baixa e abre o app
2. **Detecção:** O script detecta que está em quarentena
3. **Diálogo:** Mostra um diálogo explicando o problema
4. **Permissão:** Pede senha de administrador via AppleScript
5. **Correção:** Remove os atributos de quarentena
6. **Marcação:** Cria arquivo `.quarantine-fixed` para não repetir
7. **Sucesso:** App funciona normalmente daqui em diante

## Alternativa Manual

Se o usuário preferir, pode executar manualmente no Terminal:

```bash
xattr -cr "/Applications/Calc 3D Print.app"
```

## Arquivos Modificados

- ✅ `package.json` - Configuração de build para macOS
- ✅ `electron.js` - Integração do script de quarentena
- ✅ `build/entitlements.mac.plist` - Permissões do app principal
- ✅ `build/entitlements.mac.inherit.plist` - Permissões herdadas (NOVO)
- ✅ `scripts/fix-quarantine.js` - Script de correção (NOVO)

## Testando

Para testar no macOS:

1. Fazer build: `npm run dist:mac`
2. Instalar o DMG gerado
3. Abrir o app pela primeira vez
4. Verificar se o diálogo de permissão aparece
5. Conceder permissão
6. Verificar se o app abre normalmente
7. Fechar e abrir novamente - não deve pedir permissão de novo

## Notas

- O certificado Apple Developer custa $99/ano
- Como este é um projeto open source gratuito, optamos por não assinar
- A solução implementada é segura e transparente para o usuário
- O código-fonte está disponível para auditoria
