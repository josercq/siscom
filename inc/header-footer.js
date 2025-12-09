// Header/Footer injector for SISCOM
(function(){
    // Gera HTML do header dinamicamente dependendo da página
    function buildHeaderHTML(path) {
        const featuresHref = (path === '' || path === 'index.html' || path === 'index.htm') ? '#features' : 'index.html#features';
        const devHref = (path === '' || path === 'index.html' || path === 'index.htm') ? '#desenvolvimento' : 'index.html#desenvolvimento';
        const faqHref = (path === '' || path === 'index.html' || path === 'index.htm') ? '#faq' : 'index.html#faq';

        // Páginas APM que não devem exibir o link "Funcionalidades" nem os botões de ação
        const apmPages = ['nova-oportunidade.html', 'gerenciar-oportunidade.html'];

        const isApmPage = apmPages.includes(path);

        return `
    <header class="main-header">
        <div class="container">
            <a href="index.html" class="logo">SISCOM<span>.</span></a>
            <nav class="main-nav" id="main-nav">
                <ul>
                    ${isApmPage ? '' : `<li><a href="${featuresHref}">Funcionalidades</a></li>`}
                    <li><a href="oportunidades.html">Painel de Oportunidades</a></li>
                    <li><a href="${devHref}">Desenvolvimento</a></li>
                    <li><a href="${faqHref}">FAQ</a></li>
                </ul>
            </nav>
            <div class="header-buttons">
                ${isApmPage ? '' : `<a href="#contact" class="btn btn-primary">Seja um Fornecedor</a>
                <a href="login.html" class="btn btn-secondary">Entrar no Sistema</a>`}
            </div>
            <button class="hamburger-menu" id="hamburger-menu" aria-label="Abrir menu">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </header>`;
    }

    // HTML para o footer (inclui #dynamic-year esperado pelo jsmain.js)
    const footerHTML = `
    <footer class="main-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-about">
                    <div class="footer-logo">SISCOM<span>.</span></div>
                    <div class="footer-logo-etec">
                        <img src="img/logo-etec.png" alt="Logo ETEC" style="height: 40px; width: auto; display: block;">
                        <p>Versão Prévia: 08/12/2025.</p>
                    </div>
                </div>
                
                <div class="footer-links">
                    <h4>Navegação</h4>
                    <ul>
                        <li><a href="index.html">Início</a></li>
                        <li><a href="oportunidades.html">Painel de Oportunidades</a></li>
                        <li><a href="index.html#desenvolvimento">Desenvolvimento</a></li>
                        <li><a href="index.html#faq">FAQ</a></li>
                    </ul>
                </div>

                <div class="footer-links">
                    <h4>Links Úteis</h4>
                    <ul>
                        <li><a href="https://www.cubatao.sp.gov.br" target="_blank">Prefeitura de Cubatão</a></li>
                        <li><a href="https://www.cubatao.sp.gov.br/educacao" target="_blank">Secretaria de Educação</a></li>
                        <li><a href="login.html">Login no Sistema</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                &copy; <span id="dynamic-year"></span> Esta plataforma é um projeto dos alunos do curso Técnico em Informática da ETEC de Cubatão.
            </div>
        </div>
    </footer>`;

    // Função utilitária: garante que o Font Awesome esteja presente
    function ensureFontAwesome() {
        const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(l => l.href && l.href.includes('font-awesome') || l.href.includes('fontawesome') || l.href.includes('font-awesome'));
        if (!exists) {
            const fa = document.createElement('link');
            fa.rel = 'stylesheet';
            fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
            document.head.appendChild(fa);
        }
    }

    // Injeta onde houver placeholders
    try {
        ensureFontAwesome();

        const sh = document.getElementById('site-header');
        const path = window.location.pathname.split('/').pop();
        if (sh) sh.innerHTML = buildHeaderHTML(path);

        const sf = document.getElementById('site-footer');
        if (sf) sf.innerHTML = footerHTML;

        // Gatilho simples para o menu hambúrguer quando presente
        const hamb = document.getElementById('hamburger-menu');
        const nav = document.getElementById('main-nav');
        if (hamb && nav) {
            hamb.addEventListener('click', () => nav.classList.toggle('active'));
        }

        // Marca a aba ativa de acordo com a URL atual
        try {
            const path = window.location.pathname.split('/').pop();
            const links = document.querySelectorAll('#main-nav a');
            links.forEach(a => a.classList.remove('active'));
            if (path === '' || path === 'index.html' || path === 'index.htm') {
                const l = document.querySelector('#main-nav a[href="index.html"]'); if (l) l.classList.add('active');
            } else {
                const sel = `#main-nav a[href$="${path}"]`;
                const l = document.querySelector(sel);
                if (l) l.classList.add('active');
            }
        } catch (err) {
            // não bloqueia execução
        }

        // Insere botões de header específicos por página quando apropriado
        (function injectPageHeaderButtons(){
            const path = window.location.pathname.split('/').pop();
            const headerButtons = document.querySelector('.header-buttons');
            if (!headerButtons) return;

            // Se a página definiu um elemento com id 'header-actions', usa-o (permite personalização)
            const pageActions = document.getElementById('header-actions');
            if (pageActions) {
                headerButtons.innerHTML = pageActions.innerHTML + headerButtons.innerHTML;
                return;
            }

            // Caso contrário, adiciona ações padrão por página
            if (path === 'enviar-orcamento.html') {
                headerButtons.innerHTML = `<a href="oportunidades.html" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 8px;"><i class="fas fa-arrow-left"></i> Cancelar / Voltar</a>` + headerButtons.innerHTML;
            } else if (path === 'nova-oportunidade.html') {
                headerButtons.innerHTML = `<a href="oportunidades.html" class="btn btn-secondary"><i class="fas fa-times"></i> Cancelar</a>` + headerButtons.innerHTML;
            } else if (path === 'gerenciar-oportunidade.html') {
                headerButtons.innerHTML = `<a href="oportunidades.html" class="btn btn-secondary" style="display:inline-flex; align-items:center; gap:8px;"><i class="fas fa-arrow-left"></i> Voltar ao Painel</a>` + headerButtons.innerHTML;
            }
        })();

    } catch (e) {
        console.error('Erro ao injetar header/footer:', e);
    }
})();
