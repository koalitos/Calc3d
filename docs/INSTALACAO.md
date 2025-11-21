# 📥 Guia de Instalação - Calc 3D Print

Guia completo para instalar e começar a usar o Calc 3D Print.

## 💻 Requisitos do Sistema

### Mínimos
- **Sistema Operacional:** Windows 10 ou superior (64-bit)
- **Processador:** Intel Core i3 ou equivalente
- **Memória RAM:** 4 GB
- **Espaço em Disco:** 500 MB livres
- **Resolução:** 1366x768 ou superior

### Recomendados
- **Sistema Operacional:** Windows 11
- **Processador:** Intel Core i5 ou superior
- **Memória RAM:** 8 GB ou mais
- **Espaço em Disco:** 1 GB livres
- **Resolução:** 1920x1080 ou superior

## 📦 Download

### Opção 1: Instalador (Recomendado)

1. Acesse a página de releases:
   ```
   https://github.com/koalitos/calc3D/releases
   ```

2. Baixe a versão mais recente:
   - `Calc3DPrint-Setup-1.0.0.exe` (~150-200 MB)

3. Aguarde o download completar

### Opção 2: Código Fonte

Para desenvolvedores que querem compilar:
```bash
git clone https://github.com/koalitos/calc3D.git
cd calc3D
```

Ver [DESENVOLVIMENTO.md](DESENVOLVIMENTO.md) para instruções de compilação.

## 🚀 Instalação

### Passo 1: Executar o Instalador

1. Localize o arquivo baixado: `Calc3DPrint-Setup-1.0.0.exe`
2. Clique duas vezes para executar
3. Se aparecer aviso do Windows Defender:
   - Clique em "Mais informações"
   - Clique em "Executar assim mesmo"

### Passo 2: Assistente de Instalação

1. **Tela de Boas-vindas**
   - Clique em "Avançar"

2. **Contrato de Licença**
   - Leia a licença MIT
   - Marque "Aceito os termos"
   - Clique em "Avançar"

3. **Pasta de Destino**
   - Padrão: `C:\Program Files\Calc3DPrint`
   - Ou escolha outra pasta
   - Clique em "Avançar"

4. **Atalhos**
   - ✅ Criar atalho na Área de Trabalho
   - ✅ Criar atalho no Menu Iniciar
   - Clique em "Avançar"

5. **Instalação**
   - Clique em "Instalar"
   - Aguarde a instalação (1-2 minutos)

6. **Conclusão**
   - ✅ Marque "Executar Calc 3D Print"
   - Clique em "Concluir"

### Passo 3: Primeira Execução

O aplicativo será iniciado automaticamente após a instalação.

## 🎯 Primeiro Uso

### 1. Tela de Boas-vindas

Na primeira execução, você verá a tela de login/cadastro.

### 2. Criar Conta

1. Clique em **"Criar Conta"**
2. Preencha os dados:
   - **Nome:** Seu nome ou empresa
   - **Email:** Seu email (usado apenas para login)
   - **Senha:** Mínimo 6 caracteres
   - **Confirmar Senha:** Digite novamente
3. Clique em **"Cadastrar"**

### 3. Fazer Login

1. Digite seu **email**
2. Digite sua **senha**
3. Clique em **"Entrar"**

### 4. Dashboard

Após o login, você verá o dashboard principal com:
- Menu lateral (Filamentos, Máquinas, Projetos)
- Área de trabalho central
- Botão de logout no canto superior

## 📚 Configuração Inicial

### Cadastrar Primeiro Filamento

1. Clique em **"Filamentos"** no menu lateral
2. Clique no botão **"+ Novo Filamento"**
3. Preencha os dados:
   - **Nome:** Ex: "PLA Branco"
   - **Tipo:** Selecione (PLA, ABS, PETG, TPU, Nylon)
   - **Peso (g):** Ex: 1000 (1kg)
   - **Custo (R$):** Ex: 80.00
4. Clique em **"Salvar"**

O sistema calculará automaticamente o custo por grama.

### Cadastrar Primeira Máquina

1. Clique em **"Máquinas"** no menu lateral
2. Clique no botão **"+ Nova Máquina"**
3. Preencha os dados:
   - **Nome:** Ex: "Ender 3 V2"
   - **Potência (W):** Ex: 350
   - **Custo kWh (R$):** Ex: 0.80
   - **Custo da Máquina (R$):** Ex: 1500.00
   - **Vida Útil (horas):** Ex: 5000
4. Clique em **"Salvar"**

O sistema calculará automaticamente:
- Custo de energia por hora
- Depreciação por hora

### Criar Primeiro Projeto

1. Clique em **"Projetos"** no menu lateral
2. Clique no botão **"+ Novo Projeto"**
3. Preencha os dados básicos:
   - **Nome:** Ex: "Vaso Decorativo"
   - **Cliente:** Ex: "João Silva" (opcional)
4. **Upload do STL:**
   - Clique em "Escolher Arquivo"
   - Selecione seu arquivo .stl
   - Aguarde a análise automática
5. **Configurações:**
   - **Filamento:** Selecione da lista
   - **Máquina:** Selecione da lista
   - **Tempo de Impressão (h):** Ex: 5.5
   - **Margem de Lucro (%):** Ex: 50
6. Clique em **"Calcular"**

O sistema mostrará:
- ✅ Custo do filamento
- ✅ Custo de energia
- ✅ Depreciação da máquina
- ✅ Custo total
- ✅ **Preço de venda sugerido**

## 🔧 Configurações

### Alterar Idioma (Futuro)
Atualmente apenas em Português (BR).

### Tema
O aplicativo usa tema escuro por padrão.

### Backup de Dados

Os dados são salvos automaticamente em:
```
C:\Users\[SeuUsuário]\AppData\Roaming\calc3dprint\database.sqlite
```

**Recomendação:** Faça backup regular deste arquivo!

### Exportar Dados (Futuro)
Funcionalidade de exportação em desenvolvimento.

## 🆘 Solução de Problemas

### Aplicativo não inicia

**Problema:** Clico no ícone mas nada acontece

**Soluções:**
1. Verifique se já não está aberto (veja na barra de tarefas)
2. Reinicie o computador
3. Reinstale o aplicativo
4. Verifique antivírus (pode estar bloqueando)

### Erro ao fazer login

**Problema:** "Email ou senha incorretos"

**Soluções:**
1. Verifique se digitou corretamente
2. Senhas são case-sensitive (maiúsculas/minúsculas)
3. Se esqueceu a senha, será necessário reinstalar (dados locais)

### Erro ao carregar STL

**Problema:** "Erro ao processar arquivo STL"

**Soluções:**
1. Verifique se o arquivo é .stl válido
2. Tente exportar novamente do seu software 3D
3. Arquivo pode estar corrompido
4. Tamanho máximo: 50 MB

### Cálculos incorretos

**Problema:** Valores não fazem sentido

**Soluções:**
1. Verifique os dados do filamento (peso e custo)
2. Verifique os dados da máquina (potência e custo kWh)
3. Verifique o tempo de impressão informado
4. Recalcule o projeto

### Aplicativo lento

**Problema:** Interface travando ou lenta

**Soluções:**
1. Feche outros programas
2. Verifique se tem RAM suficiente
3. Reinicie o aplicativo
4. Reinicie o computador

### Erro "Porta em uso"

**Problema:** "Erro: porta 3001 já está em uso"

**Soluções:**
1. Feche outras instâncias do aplicativo
2. Reinicie o computador
3. Verifique se outro programa usa a porta 3001

## 🔄 Atualização

### Verificar Atualizações

1. Acesse: https://github.com/koalitos/calc3D/releases
2. Veja se há versão mais recente
3. Baixe o novo instalador
4. Execute sobre a instalação antiga

**Nota:** Seus dados serão preservados!

### Changelog

Veja as novidades de cada versão em:
```
https://github.com/koalitos/calc3D/releases
```

## 🗑️ Desinstalação

### Windows 10/11

**Método 1: Configurações**
1. Abra **Configurações** (Win + I)
2. Vá em **Aplicativos**
3. Procure por "Calc 3D Print"
4. Clique e selecione **Desinstalar**

**Método 2: Painel de Controle**
1. Abra o **Painel de Controle**
2. Vá em **Programas e Recursos**
3. Procure "Calc 3D Print"
4. Clique com botão direito > **Desinstalar**

### Remover Dados

Se quiser remover completamente (incluindo dados):

1. Desinstale o aplicativo (acima)
2. Delete a pasta de dados:
   ```
   C:\Users\[SeuUsuário]\AppData\Roaming\calc3dprint
   ```

**⚠️ Atenção:** Isso apagará todos os seus projetos, filamentos e máquinas!

## 📞 Suporte

### Documentação
- [Guia de Desenvolvimento](DESENVOLVIMENTO.md)
- [Documentação da API](API.md)
- [Site Oficial](https://koalitos.github.io/calc3D/)

### Comunidade
- **Issues:** https://github.com/koalitos/calc3D/issues
- **Discussões:** https://github.com/koalitos/calc3D/discussions

### Reportar Bugs

Encontrou um problema? Abra uma issue:
1. Acesse: https://github.com/koalitos/calc3D/issues
2. Clique em "New Issue"
3. Descreva o problema:
   - O que aconteceu
   - O que deveria acontecer
   - Passos para reproduzir
   - Versão do Windows
   - Versão do aplicativo

## 💡 Dicas de Uso

1. **Organize seus filamentos** por tipo e cor
2. **Cadastre todas as máquinas** que você usa
3. **Use nomes descritivos** para projetos
4. **Revise os cálculos** antes de passar orçamento
5. **Faça backup** dos dados regularmente
6. **Atualize** para versões mais recentes

## 🎓 Tutoriais

### Vídeos (Futuro)
Tutoriais em vídeo em desenvolvimento.

### Exemplos
Veja exemplos de uso no repositório:
```
https://github.com/koalitos/calc3D/tree/main/examples
```

## 📊 Requisitos Técnicos Detalhados

### Dependências Incluídas
- ✅ Node.js (runtime)
- ✅ Electron (framework)
- ✅ SQLite (banco de dados)
- ✅ Todas as bibliotecas necessárias

**Não é necessário instalar nada adicional!**

### Portas Utilizadas
- **Backend:** 3001 (localhost)
- **Frontend:** Integrado no Electron

### Arquivos Criados
```
C:\Program Files\Calc3DPrint\          # Aplicativo
C:\Users\[Usuário]\AppData\Roaming\
  └── calc3dprint\
      └── database.sqlite              # Dados
```

## ✅ Checklist Pós-Instalação

- [ ] Aplicativo instalado com sucesso
- [ ] Conta criada e login funcionando
- [ ] Pelo menos 1 filamento cadastrado
- [ ] Pelo menos 1 máquina cadastrada
- [ ] Primeiro projeto criado
- [ ] Cálculo de custo testado
- [ ] Atalho na área de trabalho criado

## 🎉 Pronto!

Você está pronto para usar o Calc 3D Print!

Comece cadastrando seus filamentos e máquinas, depois crie seus projetos e calcule os custos automaticamente.

---

**Desenvolvido com ❤️ para a comunidade de impressão 3D**

**Site:** https://koalitos.github.io/calc3D/  
**GitHub:** https://github.com/koalitos/calc3D  
**Issues:** https://github.com/koalitos/calc3D/issues
