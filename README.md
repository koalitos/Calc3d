# 💎 Calc 3D Print

Sistema completo de cálculo de custos para impressão 3D com interface desktop usando Electron.

## 🎯 Funcionalidades

### ✅ Gestão Completa
- **Filamentos**: Cadastro com custo por grama e controle de estoque
- **Máquinas**: Registro de impressoras com custo de energia e depreciação
- **Projetos**: Cálculo automático de custos com upload de G-code
- **Vendas**: Registro de vendas com desconto automático de estoque
- **Embalagens**: Controle de embalagens e custos
- **Plataformas**: Gestão de taxas de marketplaces (Shopee, Mercado Livre, etc)
- **Despesas**: Controle de despesas operacionais
- **Financeiro**: Relatórios e análises financeiras
- **Backup**: Sistema de backup e restauração de dados

### 🎯 Upload de G-code (Precisão Máxima!)
- Extrai peso EXATO do filamento do arquivo G-code
- Extrai tempo EXATO de impressão
- Compatível com Cura, PrusaSlicer, Simplify3D e outros
- Suporta formatos .gcode e .gco

### 💰 Cálculo Automático de Custos
- Custo de filamento (peso × custo/g)
- Custo de energia (tempo × kWh)
- Depreciação da máquina
- Custo de embalagem
- Taxa de plataforma de venda
- Margem de lucro configurável
- **Preço de venda final calculado automaticamente**

## 🚀 Tecnologias

- **Frontend**: React 18
- **Desktop**: Electron
- **Backend**: Node.js + Express
- **Autenticação**: JWT
- **Armazenamento**: LocalStorage (migração para SQLite planejada)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/calc3d-print.git
cd calc3d-print
```

2. Instale as dependências do backend:
```bash
cd backend
npm install
```

3. Instale as dependências do frontend:
```bash
cd ../frontend
npm install
```

4. Instale as dependências do Electron:
```bash
cd ..
npm install
```

## 🎮 Como Usar

### Modo Desenvolvimento

1. Inicie o backend (Terminal 1):
```bash
cd backend
npm start
```

2. Inicie o frontend (Terminal 2):
```bash
cd frontend
npm start
```

3. Inicie o Electron (Terminal 3):
```bash
npm start
```

### Modo Produção

```bash
npm run build
```

O executável será gerado na pasta `dist/`.

## 📖 Guia de Uso

### 1. Primeiro Acesso
- Login padrão: `admin` / `admin123`
- Altere a senha após o primeiro acesso

### 2. Configuração Inicial
1. Cadastre seus **Filamentos** (nome, custo/g, estoque)
2. Cadastre suas **Máquinas** (nome, consumo, depreciação)
3. Cadastre **Embalagens** (opcional)
4. Cadastre **Plataformas** de venda (opcional)

### 3. Criando um Projeto
1. Vá em **Projetos** → **+ Novo Projeto**
2. Faça upload do arquivo **G-code** (recomendado para precisão)
3. Ou preencha manualmente peso e tempo
4. Selecione filamento, máquina, embalagem e plataforma
5. Defina a margem de lucro
6. O sistema calcula automaticamente o preço de venda!

### 4. Registrando uma Venda
1. Vá em **Vendas** → **+ Nova Venda**
2. Selecione o projeto
3. Informe cliente e forma de pagamento
4. O estoque de embalagem é descontado automaticamente

### 5. Relatórios
- Acesse **Financeiro** para ver relatórios completos
- Filtre por período
- Veja lucro, custos e vendas

## 📄 Licença

Este projeto está licenciado sob a **MIT License com restrições comerciais**.

### ✅ Você PODE:
- ✅ Usar gratuitamente para seu negócio
- ✅ Modificar o código
- ✅ Contribuir com melhorias
- ✅ Distribuir cópias modificadas

### ❌ Você NÃO PODE:
- ❌ Vender este software
- ❌ Cobrar pelo acesso ao sistema
- ❌ Remover os créditos originais

Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes
- Mantenha o código limpo e documentado
- Teste suas alterações antes de enviar
- Siga o padrão de código existente
- Atualize a documentação se necessário

## 🐛 Reportando Bugs

Encontrou um bug? Abra uma [issue](https://github.com/seu-usuario/calc3d-print/issues) com:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Versão do sistema operacional

## 🗺️ Roadmap

### Em Desenvolvimento
- [ ] Migração para SQLite
- [ ] Gráficos de vendas e lucros
- [ ] Exportação de relatórios em PDF
- [ ] Multi-usuário
- [ ] Sincronização em nuvem (opcional)

### Futuro
- [ ] App mobile (React Native)
- [ ] Integração com marketplaces
- [ ] Sistema de orçamentos
- [ ] Controle de clientes
- [ ] Notificações de estoque baixo

## 💡 Dicas

### Para Máxima Precisão
1. **Use G-code ao invés de STL**: O G-code contém dados exatos do slicer
2. **Configure custos reais**: Meça o consumo real da sua impressora
3. **Atualize preços**: Mantenha os custos de filamento atualizados
4. **Registre todas as despesas**: Para relatórios precisos

### Otimizando Lucros
1. Ajuste a margem de lucro por tipo de projeto
2. Considere o tempo de pós-processamento
3. Inclua custos de embalagem
4. Calcule as taxas das plataformas

## 📞 Suporte

- 📧 Email: suporte@calc3dprint.com
- 💬 Discord: [Link do servidor]
- 📖 Wiki: [Link da wiki]

## 🙏 Agradecimentos

Obrigado a todos que contribuíram para este projeto!

## ⭐ Star o Projeto

Se este projeto te ajudou, considere dar uma ⭐ no GitHub!

## ☕ Apoie o Projeto

Fiz este projeto para ajudar a comunidade de impressão 3D. Se ele te ajudou e você quiser me ajudar também, pode me apoiar no Ko-fi:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Me-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/koalitos)

**[☕ Apoiar no Ko-fi](https://ko-fi.com/koalitos)**

Qualquer ajuda é muito bem-vinda e me motiva a continuar desenvolvendo e melhorando o projeto! 💙

---

**Desenvolvido com ❤️ para a comunidade de impressão 3D**
