# 🎨 Guia de Customização do Site

## Adicionar Nova Seção

### 1. Seção de FAQ

Adicione antes do footer no `index.html`:

```html
<!-- FAQ Section -->
<section id="faq" class="faq">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">Perguntas Frequentes</h2>
            <p class="section-description">Tire suas dúvidas sobre o Calc 3D Print</p>
        </div>
        
        <div class="faq-list">
            <div class="faq-item">
                <h3 class="faq-question">É realmente gratuito?</h3>
                <p class="faq-answer">Sim! 100% gratuito e open source sob licença MIT.</p>
            </div>
            
            <div class="faq-item">
                <h3 class="faq-question">Funciona offline?</h3>
                <p class="faq-answer">Sim! Todos os dados são armazenados localmente no seu computador.</p>
            </div>
            
            <div class="faq-item">
                <h3 class="faq-question">Quais formatos de arquivo são suportados?</h3>
                <p class="faq-answer">O sistema aceita arquivos STL para análise de volume e peso.</p>
            </div>
        </div>
    </div>
</section>
```

Adicione o CSS em `styles.css`:

```css
.faq {
    background: var(--surface);
}

.faq-list {
    max-width: 800px;
    margin: 0 auto;
}

.faq-item {
    background: var(--background);
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid var(--border);
    margin-bottom: 1rem;
    transition: all 0.3s;
}

.faq-item:hover {
    border-color: var(--primary);
}

.faq-question {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: var(--text);
}

.faq-answer {
    color: var(--text-secondary);
    line-height: 1.6;
}
```

### 2. Seção de Galeria/Screenshots

```html
<!-- Gallery Section -->
<section id="gallery" class="gallery">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">Veja em Ação</h2>
            <p class="section-description">Capturas de tela do aplicativo</p>
        </div>
        
        <div class="gallery-grid">
            <div class="gallery-item">
                <img src="images/screenshot-1.png" alt="Dashboard">
                <p>Dashboard Principal</p>
            </div>
            <div class="gallery-item">
                <img src="images/screenshot-2.png" alt="Análise STL">
                <p>Análise de STL</p>
            </div>
            <div class="gallery-item">
                <img src="images/screenshot-3.png" alt="Cálculo de Custos">
                <p>Cálculo de Custos</p>
            </div>
        </div>
    </div>
</section>
```

CSS:

```css
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.gallery-item {
    background: var(--surface);
    border-radius: 1rem;
    overflow: hidden;
    border: 1px solid var(--border);
    transition: all 0.3s;
}

.gallery-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
}

.gallery-item img {
    width: 100%;
    height: auto;
    display: block;
}

.gallery-item p {
    padding: 1rem;
    text-align: center;
    color: var(--text-secondary);
}
```

### 3. Seção de Roadmap

```html
<!-- Roadmap Section -->
<section id="roadmap" class="roadmap">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">Roadmap</h2>
            <p class="section-description">Próximas funcionalidades</p>
        </div>
        
        <div class="roadmap-timeline">
            <div class="roadmap-item completed">
                <div class="roadmap-marker"></div>
                <div class="roadmap-content">
                    <h3>✅ Versão 1.0</h3>
                    <p>Sistema completo de cálculo de custos</p>
                </div>
            </div>
            
            <div class="roadmap-item in-progress">
                <div class="roadmap-marker"></div>
                <div class="roadmap-content">
                    <h3>🚧 Versão 1.1</h3>
                    <p>Relatórios em PDF e exportação de dados</p>
                </div>
            </div>
            
            <div class="roadmap-item planned">
                <div class="roadmap-marker"></div>
                <div class="roadmap-content">
                    <h3>📋 Versão 2.0</h3>
                    <p>Suporte para múltiplos idiomas</p>
                </div>
            </div>
        </div>
    </div>
</section>
```

CSS:

```css
.roadmap {
    background: var(--surface);
}

.roadmap-timeline {
    max-width: 600px;
    margin: 0 auto;
    position: relative;
}

.roadmap-timeline::before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--border);
}

.roadmap-item {
    position: relative;
    padding-left: 60px;
    margin-bottom: 3rem;
}

.roadmap-marker {
    position: absolute;
    left: 12px;
    top: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--surface-light);
    border: 3px solid var(--border);
}

.roadmap-item.completed .roadmap-marker {
    background: var(--success);
    border-color: var(--success);
}

.roadmap-item.in-progress .roadmap-marker {
    background: var(--primary);
    border-color: var(--primary);
    animation: pulse 2s infinite;
}

.roadmap-content h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.roadmap-content p {
    color: var(--text-secondary);
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

### 4. Seção de Estatísticas

```html
<!-- Stats Section -->
<section class="stats-section">
    <div class="container">
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-number" data-target="100">0</div>
                <div class="stat-label">Stars no GitHub</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">📥</div>
                <div class="stat-number" data-target="500">0</div>
                <div class="stat-label">Downloads</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-number" data-target="50">0</div>
                <div class="stat-label">Contribuidores</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">🔧</div>
                <div class="stat-number" data-target="10">0</div>
                <div class="stat-label">Versões</div>
            </div>
        </div>
    </div>
</section>
```

CSS:

```css
.stats-section {
    background: var(--gradient);
    padding: 4rem 0;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
}

.stat-card {
    text-align: center;
    color: white;
}

.stat-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.stat-number {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 1rem;
    opacity: 0.9;
}
```

JavaScript para animar números:

```javascript
// Adicione no script.js
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
};

// Chamar quando a seção aparecer
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}
```

## 🎨 Temas de Cores Alternativos

### Tema Verde

```css
:root {
    --primary: #10b981;
    --primary-dark: #059669;
    --secondary: #34d399;
    --gradient: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}
```

### Tema Laranja

```css
:root {
    --primary: #f59e0b;
    --primary-dark: #d97706;
    --secondary: #fbbf24;
    --gradient: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}
```

### Tema Rosa

```css
:root {
    --primary: #ec4899;
    --primary-dark: #db2777;
    --secondary: #f472b6;
    --gradient: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
}
```

## 📱 Adicionar Badge de Status

No hero ou header:

```html
<div class="status-badge">
    <span class="status-dot"></span>
    <span>Em desenvolvimento ativo</span>
</div>
```

CSS:

```css
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 2rem;
    font-size: 0.875rem;
    color: var(--success);
}

.status-dot {
    width: 8px;
    height: 8px;
    background: var(--success);
    border-radius: 50%;
    animation: pulse 2s infinite;
}
```

## 🔗 Adicionar Badges do GitHub

No README ou no site:

```markdown
![GitHub stars](https://img.shields.io/github/stars/koalitos/calc3D?style=social)
![GitHub forks](https://img.shields.io/github/forks/koalitos/calc3D?style=social)
![GitHub issues](https://img.shields.io/github/issues/koalitos/calc3D)
![GitHub license](https://img.shields.io/github/license/koalitos/calc3D)
```

## 💡 Dicas Finais

1. **Mantenha consistência** nas cores e espaçamentos
2. **Teste responsividade** em diferentes dispositivos
3. **Otimize imagens** antes de adicionar
4. **Use animações sutis** para não distrair
5. **Mantenha acessibilidade** com contraste adequado

---

Divirta-se customizando seu site! 🎨✨
