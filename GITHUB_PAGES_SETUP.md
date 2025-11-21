# 🌐 Guia de Configuração do GitHub Pages

Este guia mostra como publicar o site do Calc 3D Print no GitHub Pages.

## 📋 Pré-requisitos

- Repositório no GitHub
- Arquivos do site na pasta `docs/`

## 🚀 Passo a Passo

### 1. Preparar o Repositório

Certifique-se de que os arquivos estão commitados:

```bash
git add docs/
git commit -m "Add GitHub Pages site"
git push origin main
```

### 2. Ativar GitHub Pages

1. Acesse seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source** (Fonte):
   - Branch: Selecione `main` (ou `master`)
   - Folder: Selecione `/docs`
5. Clique em **Save** (Salvar)

### 3. Aguardar Deploy

- O GitHub levará alguns minutos para fazer o deploy
- Você verá uma mensagem: "Your site is ready to be published at..."
- Quando estiver pronto: "Your site is published at..."

### 4. Acessar o Site

Seu site estará disponível em:
```
https://koalitos.github.io/calc3D/
```

## ⚙️ Personalização

### Atualizar Informações do Projeto

Edite `docs/index.html` e substitua:

1. **Links do GitHub:**
   - Já configurados para `koalitos/calc3D`

2. **Links de Download:**
   - Atualize os links para suas releases quando disponíveis
   - Exemplo: `https://github.com/koalitos/calc3D/releases`

3. **Informações de Contato:**
   - Atualize email e redes sociais no footer

### Atualizar Configuração

Edite `docs/_config.yml`:

```yaml
title: Calc 3D Print
author: Seu Nome
email: seu-email@exemplo.com
github_username: koalitos
url: "https://koalitos.github.io"
baseurl: "/calc3D"
```

## 🎨 Adicionar Screenshots

1. Crie a pasta `docs/images/`:
```bash
mkdir docs/images
```

2. Adicione suas capturas de tela

3. Atualize o HTML para incluir as imagens:
```html
<img src="images/screenshot-dashboard.png" alt="Dashboard">
```

## 🔧 Customizar Aparência

### Cores

Edite `docs/styles.css`:

```css
:root {
    --primary: #6366f1;        /* Cor primária */
    --secondary: #8b5cf6;      /* Cor secundária */
    --background: #0f172a;     /* Fundo */
    /* ... */
}
```

### Fontes

Altere no `<head>` do `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=SuaFonte:wght@400;700&display=swap" rel="stylesheet">
```

E no CSS:
```css
body {
    font-family: 'SuaFonte', sans-serif;
}
```

## 📊 Analytics (Opcional)

### Google Analytics

1. Crie uma conta no Google Analytics
2. Obtenha seu ID de rastreamento
3. Adicione no `_config.yml`:
```yaml
google_analytics: UA-XXXXXXXXX-X
```

4. Adicione o script no `<head>` do `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXXX-X"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-XXXXXXXXX-X');
</script>
```

## 🔄 Atualizar o Site

Sempre que fizer alterações:

```bash
git add docs/
git commit -m "Update website"
git push origin main
```

O GitHub Pages atualizará automaticamente em alguns minutos.

## 🌐 Domínio Customizado (Opcional)

### Usar Domínio Próprio

1. Compre um domínio
2. No GitHub Pages Settings, adicione o domínio em **Custom domain**
3. Configure os DNS do seu domínio:

```
Type: CNAME
Name: www
Value: seu-usuario.github.io
```

4. Crie o arquivo `docs/CNAME`:
```
www.seudominio.com
```

## ✅ Checklist Final

Antes de publicar, verifique:

- [ ] Todos os links do GitHub estão corretos
- [ ] Links de download apontam para releases reais
- [ ] Informações de contato atualizadas
- [ ] Screenshots adicionadas (se disponíveis)
- [ ] Testado em diferentes dispositivos
- [ ] Cores e fontes personalizadas (se desejado)
- [ ] Analytics configurado (se desejado)

## 🐛 Problemas Comuns

### Site não aparece

- Aguarde 5-10 minutos após ativar
- Verifique se a pasta `/docs` está selecionada
- Confirme que os arquivos foram commitados

### Estilos não carregam

- Verifique os caminhos dos arquivos CSS/JS
- Certifique-se de que `baseurl` está correto no `_config.yml`

### Links quebrados

- Use caminhos relativos: `./styles.css` em vez de `/styles.css`
- Ou use o baseurl: `{{ site.baseurl }}/styles.css`

## 📚 Recursos

- [Documentação GitHub Pages](https://docs.github.com/pages)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Markdown Guide](https://www.markdownguide.org/)

## 💡 Dicas

1. **Teste localmente:** Use um servidor local para testar antes de publicar
   ```bash
   # Python 3
   python -m http.server 8000 --directory docs
   
   # Acesse: http://localhost:8000
   ```

2. **Otimize imagens:** Comprima screenshots antes de adicionar

3. **SEO:** Adicione meta tags relevantes no `<head>`

4. **Performance:** Minimize CSS/JS para produção

5. **Acessibilidade:** Use alt text em imagens e ARIA labels

## 🎉 Pronto!

Seu site está no ar! Compartilhe o link:
```
https://seu-usuario.github.io/calc3D/
```

---

**Dúvidas?** Abra uma issue no repositório!
