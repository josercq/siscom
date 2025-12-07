// =========================================================
// SISCOM - js/main.js (MVP)
// Centraliza interações do frontend com a API backend
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    // Pequenas utilidades
    const toISODate = (d) => {
        try { return new Date(d).toISOString().split('T')[0]; } catch(e){return null}
    };

    // ------------------ MENU MOBILE ------------------
    const hamburger = document.getElementById("hamburger-menu");
    const mainNav = document.getElementById("main-nav");
    if (hamburger && mainNav) {
        hamburger.addEventListener("click", () => mainNav.classList.toggle("active"));
    }

    // ------------------ FAQ (acordeão) ------------------
    document.querySelectorAll('.faq-item-header').forEach(h => {
        h.addEventListener('click', () => {
            const item = h.parentElement;
            const body = item.querySelector('.faq-item-body');
            const open = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i=>{ i.classList.remove('active'); i.querySelector('.faq-item-body').style.maxHeight = null; });
            if (!open) { item.classList.add('active'); body.style.maxHeight = body.scrollHeight + 'px'; }
        });
    });

    // ------------------ ANO DINÂMICO ------------------
    const dynamicYear = document.getElementById('dynamic-year');
    if (dynamicYear) dynamicYear.textContent = new Date().getFullYear();

    // ------------------ CONTACT FORM -> /api/fornecedores ------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const payload = {
                name: form.name.value,
                email: form.email.value,
                subject: form.subject.value,
                message: form.message.value
            };

            try {
                const res = await fetch('/api/fornecedores', {
                    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
                });
                const msg = document.getElementById('form-message');
                if (res.ok) {
                    msg.textContent = 'Cadastro enviado com sucesso. Verifique seu e-mail.';
                    form.reset();
                } else {
                    const err = await res.json();
                    msg.textContent = err.message || 'Erro ao enviar cadastro.';
                }
            } catch (error) {
                console.error(error);
                const msg = document.getElementById('form-message');
                if (msg) msg.textContent = 'Erro de rede ao enviar formulário.';
            }
        });
    }

    // ------------------ LOGIN FORM ------------------
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const payload = { username: form.username.value, password: form.password.value };
            try {
                const res = await fetch('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('siscom_token', data.token);
                    // redireciona de acordo com o papel
                    if (data.user && data.user.role === 'apm') window.location.href = '/apm.html';
                    else window.location.href = '/fornecedor.html';
                } else {
                    const err = await res.json();
                    alert(err.message || 'Credenciais inválidas');
                }
            } catch (error) {
                console.error('Login error', error);
                alert('Erro de rede');
            }
        });
    }

    // ------------------ RENDER OPORTUNIDADES (INDEX) ------------------
    async function loadIndexOpportunities() {
        const table = document.getElementById('opportunities-table-index');
        if (!table) return;
        try {
            const res = await fetch('/api/oportunidades?status=aberto');
            if (!res.ok) return;
            const data = await res.json();
            const tbody = table.querySelector('tbody');
            tbody.innerHTML = '';
            data.forEach(op => {
                const tr = document.createElement('tr');
                const encerramento = new Date(op.deadline).toLocaleDateString('pt-BR');
                tr.innerHTML = `<td>${op.school}</td><td>${op.title}</td><td>${encerramento}</td><td><span class="status status-aberto">${op.status}</span></td>`;
                tbody.appendChild(tr);
            });
        } catch (error) { console.error('Erro ao carregar oportunidades', error); }
    }
    loadIndexOpportunities();

    // ------------------ DASHBOARDS (APM / FORNECEDOR) ------------------
    async function getMe() {
        const token = localStorage.getItem('siscom_token');
        if (!token) return null;
        try {
            const res = await fetch('/api/me', { headers: { 'Authorization': 'Bearer ' + token } });
            if (!res.ok) return null;
            return await res.json();
        } catch (e) { return null; }
    }

    // APM: página `apm.html` deve ter form `create-opportunity-form` e lista `apm-opportunities`
    const createOppForm = document.getElementById('create-opportunity-form');
    if (createOppForm) {
        createOppForm.addEventListener('submit', async (e)=>{
            e.preventDefault();
            const token = localStorage.getItem('siscom_token');
            if (!token) return alert('Você precisa estar logado como APM');
            const payload = {
                title: e.target.title.value,
                description: e.target.description.value,
                deadline: e.target.deadline.value,
                school: e.target.school.value
            };
            try {
                const res = await fetch('/api/oportunidades', { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+token }, body: JSON.stringify(payload) });
                if (res.ok) { alert('Oportunidade criada'); e.target.reset(); loadAPMOpportunities(); }
                else { const err = await res.json(); alert(err.message || 'Erro'); }
            } catch (err) { console.error(err); alert('Erro de rede'); }
        });
    }

    async function loadAPMOpportunities() {
        const list = document.getElementById('apm-opportunities');
        if (!list) return;
        const token = localStorage.getItem('siscom_token');
        try {
            const res = await fetch('/api/oportunidades', { headers: token ? { 'Authorization':'Bearer '+token } : {} });
            const data = await res.json();
            list.innerHTML = '';
            data.forEach(op => {
                const li = document.createElement('div');
                li.className = 'dev-card';
                li.innerHTML = `<h4>${op.title}</h4><p>${op.description}</p><p><strong>Escola:</strong> ${op.school} • <strong>Encerramento:</strong> ${new Date(op.deadline).toLocaleDateString('pt-BR')}</p><p>Status: ${op.status}</p><div><a href="/oportunidades.html?id=${op.id}">Ver detalhes</a></div>`;
                list.appendChild(li);
            });
        } catch (e) { console.error(e); }
    }
    loadAPMOpportunities();

    // Fornecedor dashboard: lista de oportunidades com botão enviar proposta
    async function loadSupplierOpportunities() {
        const list = document.getElementById('fornecedor-opportunities');
        if (!list) return;
        try {
            const res = await fetch('/api/oportunidades?status=aberto');
            const data = await res.json();
            list.innerHTML = '';
            data.forEach(op => {
                const card = document.createElement('div');
                card.className = 'dev-card';
                card.innerHTML = `<h4>${op.title}</h4><p>${op.description}</p><p><strong>Escola:</strong> ${op.school} • <strong>Encerramento:</strong> ${new Date(op.deadline).toLocaleDateString('pt-BR')}</p>
                    <div style="margin-top:0.75rem;"><button class="btn btn-primary btn-send-proposal" data-id="${op.id}">Enviar Proposta</button></div>`;
                list.appendChild(card);
            });
            // delegação para abrir modal de proposta (simples prompt MVP)
            document.querySelectorAll('.btn-send-proposal').forEach(btn=>{
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    const valor = prompt('Valor da proposta (R$)');
                    if (!valor) return;
                    const prazo = prompt('Prazo em dias');
                    const observ = prompt('Observações (opcional)');
                    const token = localStorage.getItem('siscom_token');
                    try {
                        const res = await fetch(`/api/oportunidades/${id}/propostas`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+token }, body: JSON.stringify({ value: valor, prazo, observations: observ }) });
                        if (res.ok) alert('Proposta enviada com sucesso'); else { const err = await res.json(); alert(err.message||'Erro'); }
                    } catch(e){ console.error(e); alert('Erro de rede'); }
                });
            });
        } catch (e) { console.error(e); }
    }
    loadSupplierOpportunities();

    // ------------------ OPORTUNIDADE / DETALHE ------------------
    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    async function loadOpportunityDetail() {
        const container = document.getElementById('opportunity-detail');
        if (!container) return;
        const id = getQueryParam('id');
        if (!id) { container.innerHTML = '<p>Oportunidade não informada.</p>'; return; }

        try {
            const res = await fetch('/api/oportunidades');
            if (!res.ok) { container.innerHTML = '<p>Erro ao carregar oportunidade.</p>'; return; }
            const ops = await res.json();
            const op = ops.find(x => x.id === id);
            if (!op) { container.innerHTML = '<p>Oportunidade não encontrada.</p>'; return; }

            container.innerHTML = `<h2 class="section-title">${op.title}</h2><div class="dev-card"><p>${op.description}</p><p><strong>Escola:</strong> ${op.school}</p><p><strong>Encerramento:</strong> ${new Date(op.deadline).toLocaleString('pt-BR')}</p><p><strong>Status:</strong> ${op.status}</p></div>`;

            // carregar propostas
            await loadProposalsForOpportunity(op.id);

            // controlar visibilidade do form de proposta baseado no papel e status
            const me = await getMe();
            const formSection = document.getElementById('proposal-form-section');
            if (formSection) {
                if (!me || me.role !== 'fornecedor' || op.status !== 'aberto') formSection.style.display = 'none';
                else formSection.style.display = '';
            }

            // inicializar submit do form de proposta
            const proposalForm = document.getElementById('proposal-form');
            if (proposalForm) {
                proposalForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const token = localStorage.getItem('siscom_token');
                    if (!token) return alert('Você precisa estar logado como fornecedor');
                    const payload = { value: e.target.value.value, prazo: e.target.prazo.value, observations: e.target.observations.value };
                    try {
                        const r = await fetch(`/api/oportunidades/${op.id}/propostas`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+token }, body: JSON.stringify(payload) });
                        if (r.ok) { alert('Proposta enviada'); await loadProposalsForOpportunity(op.id); proposalForm.reset(); }
                        else { const err = await r.json(); alert(err.message || 'Erro'); }
                    } catch (err) { console.error(err); alert('Erro de rede'); }
                });
            }

        } catch (e) { console.error(e); container.innerHTML = '<p>Erro inesperado.</p>'; }
    }

    async function loadProposalsForOpportunity(opportunityId) {
        const list = document.getElementById('proposals-list');
        if (!list) return;
        list.innerHTML = '';
        try {
            const token = localStorage.getItem('siscom_token');
            const res = await fetch(`/api/oportunidades/${opportunityId}/propostas`, { headers: token ? { 'Authorization':'Bearer '+token } : {} });
            if (!res.ok) { list.innerHTML = '<p>Erro ao carregar propostas.</p>'; return; }
            const props = await res.json();
            if (props.length === 0) { list.innerHTML = '<p>Nenhuma proposta ainda.</p>'; return; }

            const me = await getMe();
            props.forEach(p => {
                const div = document.createElement('div');
                div.className = 'dev-card';
                let content = `<p><strong>Valor:</strong> R$ ${p.value}</p><p><strong>Prazo:</strong> ${p.prazo} dias</p><p>${p.observations || ''}</p><p><small>Enviada por: ${p.supplierId}</small></p>`;
                // se for APM mostrar botão escolher
                if (me && me.role === 'apm') {
                    content += `<div style="margin-top:0.5rem;"><button class="btn btn-primary btn-choose" data-id="${p.id}" data-op="${opportunityId}">Marcar como escolhida</button></div>`;
                }
                div.innerHTML = content;
                list.appendChild(div);
            });

            // bind choose buttons
            document.querySelectorAll('.btn-choose').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const proposalId = btn.dataset.id;
                    const opId = btn.dataset.op;
                    const token = localStorage.getItem('siscom_token');
                    if (!token) return alert('Você precisa estar logado como APM');
                    if (!confirm('Confirma escolher esta proposta?')) return;
                    try {
                        const r = await fetch(`/api/oportunidades/${opId}/choose-proposal`, { method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+token }, body: JSON.stringify({ proposalId }) });
                        if (r.ok) { alert('Proposta escolhida'); await loadOpportunityDetail(); }
                        else { const err = await r.json(); alert(err.message || 'Erro'); }
                    } catch (err) { console.error(err); alert('Erro de rede'); }
                });
            });

        } catch (e) { console.error(e); list.innerHTML = '<p>Erro ao carregar propostas.</p>'; }
    }

    // invoca detail loader caso esteja na página
    loadOpportunityDetail();
});
