# 🎨 Guia para Adicionar Favicon

## O que é um Favicon?

Favicon é o pequeno ícone que aparece na aba do navegador ao lado do título da página.

## Como Adicionar

### 1. Criar o Favicon

Você pode criar um favicon de várias formas:

- **Online:** Use sites como [Favicon.io](https://favicon.io/) ou [RealFaviconGenerator](https://realfavicongenerator.net/)
- **Design:** Crie uma imagem 512x512px e converta para .ico
- **Emoji:** Use um emoji como favicon (💎)

### 2. Gerar Arquivos

Um favicon completo inclui vários tamanhos:

```
docs/
├── favicon.ico (16x16, 32x32)
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png (180x180)
└── android-chrome-192x192.png
```

### 3. Adicionar no HTML

Adicione no `<head>` do `index.html`:

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
```

### 4. Criar site.webmanifest

Crie `docs/site.webmanifest`:

```json
{
    "name": "Calc 3D Print",
    "short_name": "Calc3D",
    "icons": [
        {
            "src": "android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "#6366f1",
    "background_color": "#0f172a",
    "display": "standalone"
}
```

## Opção Rápida: Emoji Favicon

Se quiser usar apenas um emoji (💎), adicione no `<head>`:

```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💎</text></svg>">
```

## Ferramentas Recomendadas

1. **Favicon.io** - Gera favicons de texto, emoji ou imagem
2. **RealFaviconGenerator** - Gera todos os tamanhos necessários
3. **Canva** - Para criar designs personalizados

## Testar

Após adicionar, teste em:
- Chrome
- Firefox
- Safari
- Edge

Limpe o cache se não aparecer imediatamente (Ctrl+F5).
