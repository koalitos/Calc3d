# 🌐 Site do Calc 3D Print

## 🚀 Publicar no GitHub Pages

### Passo 1: Configurar no GitHub

1. Vá em **Settings** do seu repositório
2. Clique em **Pages** no menu lateral
3. Em **Source**:
   - Branch: `main`
   - Folder: `/docs`
4. Clique em **Save**

### Passo 2: Aguardar

Aguarde 2-5 minutos. Seu site estará em:
```
https://koalitos.github.io/calc3D/
```

### Passo 3: Personalizar

Edite `docs/index.html` se necessário:
- Links de download
- Informações de contato

## 📁 Arquivos

- `index.html` - Página principal
- `styles.css` - Estilos
- `script.js` - JavaScript
- `_config.yml` - Configuração Jekyll
- `.nojekyll` - Desabilita processamento Jekyll

## ✨ Recursos do Site

- ✅ Design moderno e responsivo
- ✅ Tema escuro
- ✅ Animações suaves
- ✅ SEO otimizado
- ✅ Open Graph para redes sociais
- ✅ Menu mobile
- ✅ Smooth scroll
- ✅ 100% gratuito e open source

## 🎨 Personalizar Cores

Edite `styles.css` na seção `:root`:

```css
:root {
    --primary: #6366f1;      /* Azul principal */
    --secondary: #8b5cf6;    /* Roxo secundário */
    --background: #0f172a;   /* Fundo escuro */
}
```

## 📸 Adicionar Screenshots

1. Crie a pasta `docs/images/`
2. Adicione suas capturas de tela
3. Edite o HTML para incluir:

```html
<img src="images/screenshot.png" alt="Screenshot">
```

## 🔗 Links Importantes

- [Guia Completo de Setup](../GITHUB_PAGES_SETUP.md)
- [Guia de Favicon](favicon-guide.md)
- [Documentação GitHub Pages](https://docs.github.com/pages)

## 💡 Dicas

1. **Teste localmente:**
   ```bash
   python -m http.server 8000 --directory docs
   ```
   Acesse: http://localhost:8000

2. **Atualize o site:**
   ```bash
   git add docs/
   git commit -m "Update website"
   git push
   ```

3. **Verifique erros:**
   - Abra o Console do navegador (F12)
   - Verifique links quebrados

## 🎉 Pronto!

Seu site está pronto para ser publicado! Compartilhe com a comunidade de impressão 3D! 🖨️💎
