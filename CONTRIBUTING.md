# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o Calc 3D Print! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Código de Conduta

### Nossos Valores
- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

### Comportamentos Inaceitáveis
- Linguagem ofensiva ou discriminatória
- Assédio público ou privado
- Publicar informações privadas de outros
- Conduta não profissional

## 🚀 Como Contribuir

### Reportando Bugs

Antes de reportar um bug:
1. Verifique se já não existe uma issue sobre o problema
2. Teste na versão mais recente
3. Colete informações sobre o ambiente

Ao reportar, inclua:
- **Descrição clara** do problema
- **Passos para reproduzir**
- **Comportamento esperado** vs **comportamento atual**
- **Screenshots** (se aplicável)
- **Ambiente**: SO, versão do Node.js, etc.

### Sugerindo Melhorias

Para sugerir uma nova funcionalidade:
1. Verifique se já não foi sugerida
2. Explique o problema que resolve
3. Descreva a solução proposta
4. Considere alternativas

### Pull Requests

#### Antes de Começar
1. Fork o repositório
2. Clone seu fork localmente
3. Crie uma branch para sua feature

```bash
git checkout -b feature/minha-feature
```

#### Durante o Desenvolvimento
1. Mantenha commits pequenos e focados
2. Escreva mensagens de commit claras
3. Teste suas alterações
4. Siga o estilo de código do projeto

#### Padrão de Commits
```
tipo(escopo): descrição curta

Descrição mais detalhada (opcional)

Closes #123
```

Tipos:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

Exemplos:
```
feat(projects): adiciona upload de G-code

Implementa leitura de arquivos G-code para extrair
peso e tempo de impressão automaticamente.

Closes #45
```

```
fix(sales): corrige desconto de estoque

O estoque de embalagens não estava sendo descontado
corretamente ao registrar vendas.

Fixes #67
```

#### Enviando o Pull Request
1. Push para seu fork
```bash
git push origin feature/minha-feature
```

2. Abra um Pull Request no GitHub
3. Preencha o template do PR
4. Aguarde review

### Checklist do Pull Request
- [ ] Código testado localmente
- [ ] Sem erros no console
- [ ] Documentação atualizada (se necessário)
- [ ] Commits seguem o padrão
- [ ] Branch atualizada com main

## 💻 Configuração do Ambiente

### Requisitos
- Node.js 18+
- npm ou yarn
- Git

### Setup
```bash
# Clone seu fork
git clone https://github.com/seu-usuario/calc3d-print.git
cd calc3d-print

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original/calc3d-print.git

# Instale dependências
cd backend && npm install
cd ../frontend && npm install
cd .. && npm install
```

### Rodando Localmente
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start

# Terminal 3 - Electron
npm start
```

## 📝 Padrões de Código

### JavaScript/React
- Use ES6+ features
- Componentes funcionais com hooks
- Nomes descritivos para variáveis e funções
- Comentários para lógica complexa

### Estrutura de Componentes
```jsx
import React, { useState, useEffect } from 'react';
import './Component.css';

function Component({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  const handleAction = () => {
    // Handler logic
  };

  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
}

export default Component;
```

### CSS
- Use classes descritivas
- Evite !important
- Mobile-first quando possível

### Nomenclatura
- Componentes: PascalCase (`MyComponent`)
- Funções: camelCase (`handleClick`)
- Constantes: UPPER_SNAKE_CASE (`API_URL`)
- Arquivos: kebab-case (`my-component.jsx`)

## 🧪 Testes

### Antes de Enviar
1. Teste todas as funcionalidades afetadas
2. Teste em diferentes resoluções
3. Verifique o console por erros
4. Teste o build de produção

### Casos de Teste Comuns
- Criar, editar e deletar registros
- Upload de arquivos
- Cálculos de custos
- Navegação entre telas
- Backup e restauração

## 📚 Áreas para Contribuir

### Fácil (Good First Issue)
- Correções de texto/tradução
- Melhorias na documentação
- Ajustes de CSS/UI
- Adicionar validações

### Médio
- Novas funcionalidades pequenas
- Refatoração de código
- Otimizações de performance
- Testes automatizados

### Avançado
- Migração para SQLite
- Sistema de sincronização
- Integração com APIs externas
- Arquitetura e escalabilidade

## 🎨 Design

### Princípios
- Interface limpa e intuitiva
- Feedback visual claro
- Consistência em toda aplicação
- Acessibilidade

### Cores
- Primária: #6366f1 (Indigo)
- Sucesso: #10b981 (Green)
- Erro: #ef4444 (Red)
- Aviso: #fbbf24 (Yellow)

## 📖 Documentação

Ao adicionar funcionalidades:
1. Atualize o README.md
2. Adicione comentários no código
3. Documente APIs/funções complexas
4. Atualize o CHANGELOG.md

## 🔄 Processo de Review

### O que Esperamos
- Código limpo e legível
- Funcionalidade testada
- Sem breaking changes (ou bem documentados)
- Respeito aos padrões do projeto

### Timeline
- Reviews geralmente em 2-3 dias úteis
- Seja paciente e receptivo ao feedback
- Discussões são bem-vindas

## 🏆 Reconhecimento

Contribuidores serão:
- Listados no README.md
- Mencionados no CHANGELOG.md
- Creditados nos releases

## 📞 Dúvidas?

- Abra uma issue com a tag `question`
- Entre no Discord da comunidade
- Envie email para dev@calc3dprint.com

## ☕ Apoie o Projeto

Fiz este projeto para ajudar a comunidade. Se você quiser me ajudar também, pode me apoiar no Ko-fi:

**[☕ Apoiar no Ko-fi](https://ko-fi.com/koalitos)**

Qualquer ajuda é muito bem-vinda! 💙

## 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença MIT do projeto.

---

**Obrigado por contribuir! 🎉**
