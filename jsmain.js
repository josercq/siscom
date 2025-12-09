// =========================================================
// SISCOM - jsmain.js (Versão Final: FAQ Contextual + Header/Footer Inteligente)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    try {
        // =========================================================
        // 0. DATA SEEDER (DADOS INICIAIS) - agora com `id` para oportunidades
        // =========================================================
        function generateId(prefix = 'opp') {
            return prefix + '-' + Math.random().toString(36).slice(2,9);
        }

        const DataSeeder = {
            key: "siscom_data_v7",

            initialOpportunities: [
                // --- HELENA DUARTE (ABERTOS) ---
                { id: 'opp-helena-ac', school: "UME Profª Helena Duarte", title: "Manutenção de Ar Condicionado", icon: "fas fa-fan", type: "manutencao", location: "Vila Nova, Cubatão", description: "Contratação de mão de obra especializada para limpeza química, higienização e recarga de gás em 12 aparelhos Split.", expiry: "30/12", status: "aberto", dateId: 20251201 },
                { id: 'opp-helena-telhado', school: "UME Profª Helena Duarte", title: "Reparo no Telhado do Pátio", icon: "fas fa-hammer", type: "manutencao", location: "Vila Nova, Cubatão", description: "Serviço de urgência para troca de telhas quebradas e impermeabilização de calhas na área do refeitório.", expiry: "15/01", status: "aberto", dateId: 20251205 },
                { id: 'opp-helena-wifi', school: "UME Profª Helena Duarte", title: "Instalação de Rede Wi-Fi", icon: "fas fa-wifi", type: "tecnologia", location: "Vila Nova, Cubatão", description: "Cabeamento estruturado e instalação de 5 Access Points.", expiry: "20/01", status: "aberto", dateId: 20251210 },

                // --- OUTRAS ESCOLAS ---
                { id: 'opp-saulo-dedetizacao', school: "CRECHE Saulo Gomes de Vargas", title: "Dedetização Geral", icon: "fas fa-bug", type: "limpeza", location: "Centro, Cubatão", description: "Serviço de controle de pragas urbanas.", expiry: "03/12", status: "aberto", dateId: 20251128 },
                { id: 'opp-padre-jardinagem', school: "UME Padre Antônio Ribeiro Filho", title: "Serviços de Jardinagem", icon: "fas fa-leaf", type: "jardinagem", location: "Jardim Casqueiro", description: "Poda técnica de árvores de grande porte e corte de grama.", expiry: "28/12", status: "aberto", dateId: 20251130 },
                
                // --- ENCERRADOS ---
                { id: 'opp-helena-pintura', school: "UME Profª Helena Duarte", title: "Pintura de Sala de Aula", icon: "fas fa-paint-roller", type: "manutencao", location: "Vila Nova, Cubatão", description: "Pintura completa de 3 salas de aula.", expiry: "Encerrado", status: "encerrado", dateId: 20251015 }
            ],

            init: function() {
                // Se não existir, grava os initialOpportunities (com ids definidos acima)
                if (!localStorage.getItem(this.key)) {
                    localStorage.setItem(this.key, JSON.stringify(this.initialOpportunities));
                    return;
                }

                // Se já existir, faz uma migração leve: garante que cada item tenha `id`.
                try {
                    const existing = JSON.parse(localStorage.getItem(this.key)) || [];
                    let changed = false;
                    existing.forEach(item => {
                        if (!item.id) {
                            item.id = generateId('opp');
                            changed = true;
                        }
                    });
                    if (changed) {
                        localStorage.setItem(this.key, JSON.stringify(existing));
                    }
                } catch (err) {
                    console.warn('Erro ao migrar opportunities:', err);
                }
            },

            getAll: function() {
                return JSON.parse(localStorage.getItem(this.key)) || [];
            },

            add: function(opp) {
                const list = this.getAll();
                if (!opp.id) opp.id = generateId('opp');
                list.push(opp);
                localStorage.setItem(this.key, JSON.stringify(list));
            }
        };

        DataSeeder.init();

        // Seed de proposals recebidas e proposals enviadas para teste (não sobrescreve se já existir)
        try {
            if (!localStorage.getItem('siscom_received_proposals')) {
                // Recebidas agora indexadas por `opportunityId`
                const received = {
                    "opp-helena-ac": [
                        { opportunityId: 'opp-helena-ac', providerName: "Clima Tech Refrigeração", providerUser: "climatech", price: "R$ 2.400,00", date: "07/12/2025" },
                        { opportunityId: 'opp-helena-ac', providerName: "RefrigServ Ltda", providerUser: "refrigserv", price: "R$ 2.200,00", date: "08/12/2025" },
                        { opportunityId: 'opp-helena-ac', providerName: "ArCond Solutions", providerUser: "arcond", price: "R$ 2.350,00", date: "06/12/2025" }
                    ],
                    "opp-helena-telhado": [
                        { opportunityId: 'opp-helena-telhado', providerName: "Construtora & Manutenção Cubatão", providerUser: "fornecedor", price: "R$ 5.800,00", date: "05/12/2025" },
                        { opportunityId: 'opp-helena-telhado', providerName: "RefrigServ Ltda", providerUser: "refrigserv", price: "R$ 5.600,00", date: "06/12/2025" }
                    ],
                    "opp-helena-wifi": [
                        { opportunityId: 'opp-helena-wifi', providerName: "ArCond Solutions", providerUser: "arcond", price: "R$ 3.200,00", date: "04/12/2025" },
                        { opportunityId: 'opp-helena-wifi', providerName: "Clima Tech Refrigeração", providerUser: "climatech", price: "R$ 3.000,00", date: "06/12/2025" }
                    ]
                };
                localStorage.setItem('siscom_received_proposals', JSON.stringify(received));
            }

            if (!localStorage.getItem('siscom_my_proposals')) {
                const myp = [
                    { opportunityId: 'opp-helena-ac', title: "Manutenção de Ar Condicionado", school: "UME Profª Helena Duarte", price: "R$ 2.400,00", date: "07/12/2025", providerUser: "climatech", providerName: "Clima Tech Refrigeração" },
                    { opportunityId: 'opp-helena-ac', title: "Manutenção de Ar Condicionado", school: "UME Profª Helena Duarte", price: "R$ 2.200,00", date: "08/12/2025", providerUser: "refrigserv", providerName: "RefrigServ Ltda" },
                    { opportunityId: 'opp-helena-ac', title: "Manutenção de Ar Condicionado", school: "UME Profª Helena Duarte", price: "R$ 2.350,00", date: "06/12/2025", providerUser: "arcond", providerName: "ArCond Solutions" },
                    { opportunityId: 'opp-helena-telhado', title: "Reparo no Telhado do Pátio", school: "UME Profª Helena Duarte", price: "R$ 5.800,00", date: "05/12/2025", providerUser: "fornecedor", providerName: "Construtora & Manutenção Cubatão" },
                    { opportunityId: 'opp-helena-telhado', title: "Reparo no Telhado do Pátio", school: "UME Profª Helena Duarte", price: "R$ 5.600,00", date: "06/12/2025", providerUser: "refrigserv", providerName: "RefrigServ Ltda" },
                    { opportunityId: 'opp-helena-wifi', title: "Instalação de Rede Wi-Fi", school: "UME Profª Helena Duarte", price: "R$ 3.200,00", date: "04/12/2025", providerUser: "arcond", providerName: "ArCond Solutions" },
                    { opportunityId: 'opp-helena-wifi', title: "Instalação de Rede Wi-Fi", school: "UME Profª Helena Duarte", price: "R$ 3.000,00", date: "06/12/2025", providerUser: "climatech", providerName: "Clima Tech Refrigeração" }
                ];
                localStorage.setItem('siscom_my_proposals', JSON.stringify(myp));
            }
        } catch (err) {
            console.warn('Erro ao seedar propostas de teste:', err);
        }

        // =========================================================
        // 1. RENDERIZADOR (PÁGINA OPORTUNIDADES - GERAL)
        // =========================================================
        function renderOpportunities() {
            const grid = document.getElementById("opportunities-grid");
            const noResultsMsg = document.getElementById("no-results");
            
            if (!grid || grid.id === 'index-opportunities-grid') return;

            if (noResultsMsg) {
                Array.from(grid.children).forEach(child => {
                    if (child.id !== 'no-results') grid.removeChild(child);
                });
            } else {
                grid.innerHTML = "";
            }

            let opps = [...DataSeeder.getAll(), ...(JSON.parse(localStorage.getItem("siscom_custom_opps")) || [])];
            const loggedUser = JSON.parse(sessionStorage.getItem("siscom_user"));

            opps.sort((a, b) => b.dateId - a.dateId);
            opps.sort((a, b) => {
                if (a.status === 'aberto' && b.status === 'encerrado') return -1;
                if (a.status === 'encerrado' && b.status === 'aberto') return 1;
                return 0;
            });

            opps.forEach(opp => {
                const isClosed = opp.status === 'encerrado';
                const badgeClass = isClosed ? 'badge-expiry closed' : 'badge-expiry';
                
                let btnLink = "#";
                let btnText = "Ver mais";
                let btnClass = "btn-card-action";

                if (isClosed) {
                    btnText = "Ver Resultado";
                    btnClass += " disabled";
                } else if (!loggedUser) {
                    btnLink = "login.html"; 
                }

                const cardHTML = `
                    <div class="opportunity-card" 
                         data-id="${opp.id || ''}"
                         data-school="${opp.school}" 
                         data-status="${opp.status}"
                         data-type="${opp.type || 'outros'}" 
                         data-date="${opp.dateId}">
                        <div class="card-header">
                            <h3 class="card-title">${opp.title}</h3>
                            <div class="card-icon"><i class="${opp.icon}"></i></div>
                        </div>
                        <div class="card-school">${opp.school}</div>
                        <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${opp.location}</div>
                        <p class="card-description">${opp.description}</p>
                        <div class="card-footer">
                            <span class="${badgeClass}">${isClosed ? 'Encerrado' : 'Expira: ' + opp.expiry}</span>
                            <a href="${btnLink}" class="${btnClass}">${btnText}</a>
                        </div>
                    </div>
                `;
                grid.insertAdjacentHTML('beforeend', cardHTML);
            });
        }
        
        renderOpportunities();

        // =========================================================
        // 2. CONTEXTO DA HOME (INDEX.HTML)
        // =========================================================
        function renderIndexContext() {
            const loggedUser = JSON.parse(sessionStorage.getItem("siscom_user"));
            const bannerTitle = document.getElementById("banner-title");
            
            if (!bannerTitle) return;

            // --- LÓGICA COMUM PARA LOGADOS ---
            if (loggedUser) {
                // Esconde seções genéricas
                const statsSection = document.getElementById("stats-section");
                const featuresSection = document.getElementById("features");
                if (statsSection) statsSection.style.display = "none";
                if (featuresSection) featuresSection.style.display = "none";
                
                // Prepara container de cards
                const tableContainer = document.getElementById("public-table-container");
                const gridContainer = document.getElementById("index-opportunities-grid");
                const btnViewAll = document.getElementById("btn-view-all");

                if (tableContainer && gridContainer) {
                    tableContainer.style.display = "none"; 
                    gridContainer.style.display = "grid";  
                    gridContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(300px, 1fr))";
                    gridContainer.style.gap = "24px";
                    gridContainer.innerHTML = "";
                    if(btnViewAll) btnViewAll.style.display = "none";
                }
            }

            // --- CENÁRIO: APM LOGADA ---
            if (loggedUser && loggedUser.role === 'apm') {
                bannerTitle.textContent = `Painel de Gestão - ${loggedUser.name}`;
                document.getElementById("banner-text").textContent = "Gerencie suas oportunidades ativas.";
                
                const sectionTitle = document.getElementById("opp-section-title");
                if(sectionTitle) sectionTitle.textContent = "Suas Oportunidades (Em Aberto)";

                const allOpps = [...DataSeeder.getAll(), ...(JSON.parse(localStorage.getItem("siscom_custom_opps")) || [])];
                const myOpenList = allOpps.filter(o => o.school === loggedUser.name && o.status === 'aberto');
                const gridContainer = document.getElementById("index-opportunities-grid");

                if (gridContainer) {
                    if (myOpenList.length > 0) {
                        myOpenList.forEach(opp => {
                            const cardHTML = `
                                <div class="opportunity-card" data-id="${opp.id || ''}">
                                    <div class="card-header">
                                        <h3 class="card-title">${opp.title}</h3>
                                        <div class="card-icon"><i class="${opp.icon}"></i></div>
                                    </div>
                                    <div class="card-school">${opp.school}</div>
                                    <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${opp.location}</div>
                                    <p class="card-description">${opp.description}</p>
                                    <div class="card-footer">
                                        <span class="badge-expiry">Expira: ${opp.expiry}</span>
                                        <a href="gerenciar-oportunidade.html?id=${encodeURIComponent(opp.id || '')}" class="btn-card-action" style="background:#fff; color:#000; border:1px solid #000;">Gerenciar</a>
                                    </div>
                                </div>
                            `;
                            gridContainer.insertAdjacentHTML('beforeend', cardHTML);
                        });
                    } else {
                        gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; background: #fff; border-radius: 8px;">
                            <i class="fas fa-folder-open" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                            <h3>Nenhuma oportunidade em aberto.</h3>
                            <button class="btn-black" onclick="window.location.href='nova-oportunidade.html'" style="margin-top:10px;">Criar Nova Oportunidade</button>
                        </div>`;
                    }
                }

                // Form APM
                const subjectSelect = document.getElementById("subject");
                if (subjectSelect) {
                    subjectSelect.innerHTML = `
                        <option value="">Selecione...</option>
                        <option value="suporte_tecnico">Suporte Técnico</option>
                        <option value="duvida_sistema">Dúvida sobre o Sistema</option>
                        <option value="reportar_erro">Reportar Erro</option>
                    `;
                }
            } 
            
            
                // --- CENÁRIO: FORNECEDOR LOGADO ---
                else if (loggedUser && loggedUser.role === 'fornecedor') {
                    bannerTitle.textContent = `Olá, ${loggedUser.name}`;
                    document.getElementById("banner-text").textContent = "Acompanhe o status das suas propostas enviadas.";

                    const sectionTitle = document.getElementById("opp-section-title");
                    if(sectionTitle) sectionTitle.textContent = "Propostas Enviadas";

                    const allOpps = [...DataSeeder.getAll(), ...(JSON.parse(localStorage.getItem("siscom_custom_opps")) || [])];
                    const gridContainer = document.getElementById("index-opportunities-grid");

                    // Pega propostas enviadas por este fornecedor
                    const allMy = JSON.parse(localStorage.getItem('siscom_my_proposals')) || [];
                    const myProposals = allMy.filter(p => p.providerUser === loggedUser.user || p.providerName === loggedUser.name);

                    if (gridContainer) {
                        gridContainer.innerHTML = '';
                        if (myProposals.length > 0) {
                            myProposals.forEach(p => {
                                // tenta encontrar a oportunidade correspondente (prioriza opportunityId quando disponível)
                                let opp = null;
                                if (p.opportunityId) {
                                    opp = allOpps.find(o => o.id === p.opportunityId);
                                }
                                if(!opp) opp = allOpps.find(o => (o.title || '').trim().toLowerCase() === (p.title || '').trim().toLowerCase());
                                const title = p.title || (opp ? opp.title : 'Oportunidade');
                                const icon = opp ? opp.icon : 'fas fa-briefcase';
                                const school = p.school || (opp ? opp.school : 'Escola');
                                const desc = opp ? opp.description : '';

                                const cardHTML = `
                                    <div class="opportunity-card">
                                        <div class="card-header">
                                            <h3 class="card-title">${title}</h3>
                                            <div class="card-icon"><i class="${icon}"></i></div>
                                        </div>
                                        <div class="card-school">${school}</div>
                                        <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${opp ? opp.location : ''}</div>
                                        <p class="card-description">${desc}</p>
                                        <div class="card-footer">
                                            <span class="badge-expiry" style="background:#000;">Proposta Enviada</span>
                                            <a href="#" class="btn-card-action" 
                                               style="background:#fff; color:#000; border:1px solid #000;"
                                               onclick="alert('Status: Em análise pela equipe gestora da escola.')">Ver Andamento</a>
                                        </div>
                                    </div>
                                `;
                                gridContainer.insertAdjacentHTML('beforeend', cardHTML);
                            });
                        } else {
                            // fallback: mostra algumas oportunidades disponíveis para enviar
                            const simulated = allOpps.filter(o => o.status === 'aberto').slice(0,3);
                            if (simulated.length > 0) {
                                simulated.forEach(opp => {
                                    const cardHTML = `
                                        <div class="opportunity-card">
                                            <div class="card-header">
                                                <h3 class="card-title">${opp.title}</h3>
                                                <div class="card-icon"><i class="${opp.icon}"></i></div>
                                            </div>
                                            <div class="card-school">${opp.school}</div>
                                            <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${opp.location}</div>
                                            <p class="card-description">${opp.description}</p>
                                            <div class="card-footer">
                                                <a href="#" class="btn-card-action" 
                                                   style="background:#fff; color:#000; border:1px solid #000;"
                                                   onclick="alert('Status: Em análise pela equipe gestora da escola.')">Ver Andamento</a>
                                            </div>
                                        </div>
                                    `;
                                    gridContainer.insertAdjacentHTML('beforeend', cardHTML);
                                });
                            } else {
                                gridContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                                    <h3>Você ainda não enviou propostas.</h3>
                                    <a href="oportunidades.html" class="btn-primary" style="padding:10px 20px; text-decoration:none; border-radius:5px;">Buscar Oportunidades</a>
                                </div>`;
                            }
                        }
                    }

                    // Form Fornecedor
                    const subjectSelect = document.getElementById("subject");
                    if (subjectSelect) {
                        subjectSelect.innerHTML = `
                            <option value="">Selecione...</option>
                            <option value="duvida_pagamento">Dúvida sobre Pagamento</option>
                            <option value="problema_envio">Problema no envio de proposta</option>
                            <option value="atualizacao_cadastral">Atualizar Cadastro</option>
                            <option value="suporte_tecnico">Suporte Técnico</option>
                        `;
                    }
                }
        }

        // =========================================================
        // 3. AUTH SYSTEM E CONTEXTO GLOBAL (HEADER/FOOTER/FAQ)
        // =========================================================
        const AuthSystem = {
            users: [
                { user: "fornecedor", pass: "1234", role: "fornecedor", name: "Construtora & Manutenção Cubatão" },
                { user: "admin",        pass: "1234", role: "apm", name: "UME Profª Helena Duarte" },
                { user: "apm.helena",   pass: "1234", role: "apm", name: "UME Profª Helena Duarte" },
                { user: "apm.saulo",    pass: "1234", role: "apm", name: "CRECHE Saulo Gomes de Vargas" },
                // Fornecedores adicionais para testes/recebimento de propostas
                { user: "climatech",    pass: "ct2025", role: "fornecedor", name: "Clima Tech Refrigeração" },
                { user: "refrigserv",   pass: "rs2025", role: "fornecedor", name: "RefrigServ Ltda" },
                { user: "arcond",       pass: "ac2025", role: "fornecedor", name: "ArCond Solutions" }
            ],

            init: function() {
                this.checkLoginStatus();
                this.handleLoginForm();
            },

            checkLoginStatus: function() {
                const loggedUser = JSON.parse(sessionStorage.getItem("siscom_user"));
                const headerButtons = document.querySelector(".header-buttons");

                if (loggedUser) {
                    // HEADER: Substitui botões de login
                    if (headerButtons) {
                        const iconClass = loggedUser.role === 'apm' ? 'fa-school' : 'fa-truck';
                        const roleLabel = loggedUser.role === 'apm' ? 'Gestão APM' : 'Prestador de Serviço';
                        
                        headerButtons.innerHTML = `
                            <div class="user-logged-area">
                                <div class="user-info">
                                    <span class="user-role">${roleLabel}</span>
                                    <span class="user-name">${loggedUser.name}</span>
                                </div>
                                <div class="user-avatar">
                                    <i class="fas ${iconClass}"></i>
                                </div>
                                <button id="btn-logout" class="btn-logout" title="Sair">
                                    <i class="fas fa-sign-out-alt"></i>
                                </button>
                            </div>
                        `;
                        document.getElementById("btn-logout").addEventListener("click", this.logout);
                    }

                    // HEADER: Esconde link "Funcionalidades" (Apenas para deslogados)
                    const navLinks = document.querySelectorAll(".main-nav a");
                    navLinks.forEach(link => {
                        if (link.getAttribute("href").includes("#features")) {
                            link.parentElement.style.display = "none";
                        }
                    });

                    // RODAPÉ: Esconde links de cadastro do footer para quem já é usuário
                    const footerLinks = document.querySelectorAll(".footer-links a");
                    footerLinks.forEach(link => {
                        if (link.getAttribute("href") === "login.html" || link.textContent.includes("Seja um Fornecedor")) {
                            link.parentElement.style.display = "none";
                        }
                    });

                    // Renderiza conteúdo contextual
                    renderIndexContext();
                    this.updateOpportunitiesContext(loggedUser);
                    this.renderContextualFAQ(loggedUser.role);

                } else {
                    // SE DESLOGADO: Garante que "Funcionalidades" apareça
                    const navLinks = document.querySelectorAll(".main-nav a");
                    navLinks.forEach(link => {
                        if (link.getAttribute("href").includes("#features")) {
                            link.parentElement.style.display = "block";
                        }
                    });
                    
                    // Renderiza FAQ Padrão
                    this.renderContextualFAQ("public");
                }
            },

            // FUNÇÃO NOVA: FAQ CONTEXTUAL
            renderContextualFAQ: function(role) {
                const faqContainer = document.querySelector(".faq-accordion");
                if (!faqContainer) return;

                let faqHTML = "";

                if (role === 'apm') {
                    faqHTML = `
                        <div class="faq-item">
                            <div class="faq-item-header">Como crio uma nova oportunidade? <i class="fas fa-chevron-down"></i></div>
                            <div class="faq-item-body"><div class="faq-item-body-content"><p>Acesse o "Painel de Oportunidades" e clique no botão preto "Nova Oportunidade" no topo da página.</p></div></div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-item-header">Como aprovo um orçamento? <i class="fas fa-chevron-down"></i></div>
                            <div class="faq-item-body"><div class="faq-item-body-content"><p>Clique em "Gerenciar Processo" no card da oportunidade, analise as propostas e clique em "Aprovar" na desejada.</p></div></div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-item-header">Qual o prazo para as propostas? <i class="fas fa-chevron-down"></i></div>
                            <div class="faq-item-body"><div class="faq-item-body-content"><p>Você define a data de encerramento ao criar a oportunidade. Após essa data, o status muda automaticamente para encerrado.</p></div></div>
                        </div>
                    `;
                } else if (role === 'fornecedor') {
                    faqHTML = `
                        <div class="faq-item">
                            <div class="faq-item-header">Como envio uma proposta? <i class="fas fa-chevron-down"></i></div>
                            <div class="faq-item-body"><div class="faq-item-body-content"><p>No Painel de Oportunidades, encontre uma demanda aberta e clique no botão "Enviar Proposta". Preencha o formulário e anexe seu PDF.</p></div></div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-item-header">Como sei se fui escolhido? <i class="fas fa-chevron-down"></i></div>
                            <div class="faq-item-body"><div class="faq-item-body-content"><p>A escola entrará em contato pelos dados cadastrados se sua proposta for aprovada. Você também pode acompanhar o status aqui no painel.</p></div></div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-item-header">Posso editar uma proposta enviada? <i class="fas fa-chevron-down"></i></div>
                            <div class="faq-item-body"><div class="faq-item-body-content"><p>Atualmente não. Caso precise corrigir, entre em contato via "Suporte Técnico" no rodapé.</p></div></div>
                        </div>
                    `;
                } else {
                    // PUBLICO
                    faqHTML = `
                        <div class="faq-item">
                            <div class="faq-item-header">O que é o SISCOM? <i class="fas fa-chevron-down"></i></div>
                            <div class="faq-item-body"><div class="faq-item-body-content"><p>O SISCOM é o Sistema de Gestão de Compras Escolares da Prefeitura de Cubatão.</p></div></div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-item-header">Sou fornecedor. Como me cadastro? <i class="fas fa-chevron-down"></i></div>
                            <div class="faq-item-body"><div class="faq-item-body-content"><p>Basta clicar no botão "Seja um Fornecedor" ou preencher o formulário de contato abaixo.</p></div></div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-item-header">Preciso pagar alguma taxa? <i class="fas fa-chevron-down"></i></div>
                            <div class="faq-item-body"><div class="faq-item-body-content"><p>Não. O uso da plataforma é 100% gratuito.</p></div></div>
                        </div>
                    `;
                }

                faqContainer.innerHTML = faqHTML;
                
                // Reatribui os eventos de clique no FAQ recém-criado
                document.querySelectorAll(".faq-item-header").forEach(h => {
                    h.addEventListener("click", () => {
                        const p = h.parentElement;
                        const b = p.querySelector(".faq-item-body");
                        p.classList.toggle("active");
                        b.style.maxHeight = p.classList.contains("active") ? b.scrollHeight + "px" : 0;
                    });
                });
            },

            updateOpportunitiesContext: function(user) {
                const cards = document.querySelectorAll(".opportunity-card");
                const apmControls = document.getElementById("apm-controls");
                const schoolFilterContainer = document.getElementById("school-filter")?.parentElement;
                const statusFilterContainer = document.getElementById("status-filter")?.parentElement;

                if (user.role === 'apm') {
                    if(schoolFilterContainer) schoolFilterContainer.style.display = "none";
                    if(statusFilterContainer) statusFilterContainer.style.display = "none";

                    if (apmControls) {
                        apmControls.style.display = "block";
                        const btnNew = apmControls.querySelector("button");
                        if(btnNew) {
                            btnNew.className = "btn-black"; 
                            btnNew.onclick = () => window.location.href = "nova-oportunidade.html";
                        }
                    }

                    cards.forEach(card => {
                        const cardSchool = card.getAttribute("data-school");
                        const oppId = card.getAttribute('data-id');
                        if (cardSchool !== user.name) {
                            card.style.display = "none"; 
                            card.setAttribute("data-hidden-auth", "true");
                        } else {
                            const btn = card.querySelector(".btn-card-action");
                            if (btn && !btn.classList.contains('disabled')) {
                                btn.textContent = "Gerenciar Processo";
                                btn.style.background = "#fff";
                                btn.style.color = "#000";
                                btn.style.border = "1px solid #000";
                                btn.onclick = (e) => {
                                    e.preventDefault();
                                    const url = `gerenciar-oportunidade.html?id=${encodeURIComponent(oppId || '')}`;
                                    window.location.href = url;
                                };
                            }
                        }
                    });
                } else {
                    if(schoolFilterContainer) schoolFilterContainer.style.display = "block";
                    if(statusFilterContainer) statusFilterContainer.style.display = "block";

                    if (user.role === 'fornecedor') {
                        const allProposals = JSON.parse(localStorage.getItem("siscom_my_proposals")) || [];
                        const myProposals = allProposals.filter(p => p.providerUser === user.user || p.providerName === user.name);
                        cards.forEach(card => {
                            const btn = card.querySelector(".btn-card-action");
                            const status = card.getAttribute("data-status");
                            const schoolName = card.getAttribute("data-school");
                            const titleEl = card.querySelector('.card-title');
                            const oppTitle = titleEl ? titleEl.textContent.trim() : '';
                            const oppId = card.getAttribute('data-id');

                            // Se já enviou proposta para esta oportunidade, marca e desabilita o botão
                            const sent = myProposals.some(p => p.opportunityId && oppId ? p.opportunityId === oppId : ((p.title || '').trim().toLowerCase() === (oppTitle || '').trim().toLowerCase()));
                            const footer = card.querySelector('.card-footer');

                            if (sent) {
                                // adiciona badge de proposta enviada se não existir
                                if (!card.querySelector('.badge-status-sent')) {
                                    const sentDiv = document.createElement('div');
                                    sentDiv.className = 'badge-status-sent';
                                    sentDiv.innerHTML = '<i class="fas fa-check-circle"></i> Proposta Enviada';
                                    if (footer) footer.insertAdjacentElement('afterend', sentDiv);
                                    else card.appendChild(sentDiv);
                                }
                                if (btn) {
                                    btn.textContent = 'Ver Detalhes';
                                    btn.classList.add('disabled');
                                    btn.style.cursor = 'default';
                                    btn.onclick = (e) => e.preventDefault();
                                }
                            } else if (btn && status === 'aberto') {
                                // Botão padrão para fornecedor: enviar proposta (inclui título)
                                btn.textContent = "Enviar Proposta";
                                btn.setAttribute("href", "#");
                                btn.classList.add("btn-fornecedor");
                                btn.onclick = (e) => {
                                    e.preventDefault();
                                    const url = `enviar-orcamento.html?school=${encodeURIComponent(schoolName)}&title=${encodeURIComponent(oppTitle)}&id=${encodeURIComponent(oppId || '')}`;
                                    window.location.href = url;
                                };
                            }
                        });
                    }
                }
            },

            handleLoginForm: function() {
                const loginForm = document.querySelector(".login-box form");
                if (loginForm) {
                    loginForm.addEventListener("submit", (e) => {
                        e.preventDefault();
                        const userInput = document.getElementById("username").value;
                        const passInput = document.getElementById("password").value;
                        const validUser = this.users.find(u => u.user === userInput && u.pass === passInput);

                        if (validUser) {
                            sessionStorage.setItem("siscom_user", JSON.stringify(validUser));
                            window.location.href = "index.html";
                        } else {
                            alert("Usuário não encontrado!");
                        }
                    });
                }
            },

            logout: function() {
                if(confirm("Deseja sair do sistema?")) {
                    sessionStorage.removeItem("siscom_user");
                    window.location.href = "index.html";
                }
            }
        };

        AuthSystem.init(); // Roda na index se estiver logado (para carregar FAQ/Rodapé/Menu corretos)

        // 4. FILTROS & OUTROS
        const schoolFilter = document.getElementById("school-filter");
        const categoryFilter = document.getElementById("category-filter");
        const statusFilter = document.getElementById("status-filter");
        const gridContainer = document.getElementById("opportunities-grid");
        const noResultsMsg = document.getElementById("no-results");

        if (schoolFilter && categoryFilter && statusFilter && gridContainer) {
            function normalizeText(text) { return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }

            function applyFilters() {
                const sVal = normalizeText(schoolFilter.value);
                const cVal = normalizeText(categoryFilter.value);
                const stVal = normalizeText(statusFilter.value);

                const cards = Array.from(gridContainer.querySelectorAll(".opportunity-card"));
                let visibleCount = 0;

                cards.forEach(card => {
                    if (card.getAttribute("data-hidden-auth") === "true") {
                        card.style.display = "none";
                        return;
                    }
                    const cardSchool = normalizeText(card.getAttribute('data-school') || "");
                    const cardType = normalizeText(card.getAttribute('data-type') || "");
                    const cardStatus = normalizeText(card.getAttribute('data-status') || "");

                    const matchSchool = (sVal === "todas" || cardSchool.includes(sVal));
                    const matchCategory = (cVal === "todos" || cardType === cVal);
                    const matchStatus = (stVal === "todos" || cardStatus === stVal);

                    if (matchSchool && matchCategory && matchStatus) {
                        card.style.display = "flex";
                        visibleCount++;
                    } else {
                        card.style.display = "none";
                    }
                });

                if (noResultsMsg) {
                    noResultsMsg.style.display = (visibleCount === 0) ? "block" : "none";
                }
            }

            schoolFilter.addEventListener("change", applyFilters);
            categoryFilter.addEventListener("change", applyFilters);
            statusFilter.addEventListener("change", applyFilters);
        }

        const newOppForm = document.getElementById("new-opp-form");
        if (newOppForm) {
            const loggedUser = JSON.parse(sessionStorage.getItem("siscom_user"));
            if (loggedUser && loggedUser.role === 'apm') {
                document.getElementById("school-name").value = loggedUser.name;
            }
            newOppForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const newOpp = {
                    school: loggedUser.name,
                    title: document.getElementById("title").value,
                    icon: document.getElementById("category").value,
                    type: "manutencao",
                    expiry: document.getElementById("expiry").value,
                    description: document.getElementById("description").value,
                    location: "Cubatão, SP",
                    status: "aberto",
                    dateId: 20251231 
                };
                DataSeeder.add(newOpp);
                alert("✅ Publicado!");
                window.location.href = "oportunidades.html";
            });
        }

        const contactForm = document.getElementById("contact-form");
        const customModal = document.getElementById("custom-modal-overlay");
        if (contactForm && customModal) {
            contactForm.addEventListener("submit", function(e) {
                e.preventDefault();
                const subject = document.getElementById("subject").value;
                const modalBox = document.querySelector(".custom-modal-box");
                const modalTitle = document.getElementById("popup-title");
                const modalText = document.getElementById("popup-text");
                const modalIcon = document.querySelector(".custom-modal-icon i");

                // Reset Visual
                if(modalBox) modalBox.style.borderTopColor = "#000";
                if(modalIcon) modalIcon.style.color = "#F2D96B";

                if (subject === "cadastro_fornecedor") {
                    modalTitle.textContent = "Solicitação Recebida!";
                    modalText.textContent = "Agradecemos pelo contato. Aguarde alguns dias enquanto avaliamos sua solicitação de cadastro.";
                    if(modalBox) modalBox.style.borderTopColor = "#FFC107";
                    if(modalIcon) modalIcon.style.color = "#FFC107";
                } else {
                    modalTitle.textContent = "Mensagem Enviada!";
                    modalText.textContent = "Agradecemos pela sua mensagem. Aguarde alguns dias e nossa equipe entrará em contato por e-mail.";
                }

                customModal.classList.add("is-visible");
                setTimeout(() => { contactForm.reset(); }, 500);
            });
            const customCloseBtn = document.getElementById("custom-modal-close");
            if(customCloseBtn) customCloseBtn.addEventListener("click", () => customModal.classList.remove("is-visible"));
        }

        const hamburger = document.getElementById("hamburger-menu");
        const mainNav = document.getElementById("main-nav");
        if (hamburger) hamburger.addEventListener("click", () => mainNav.classList.toggle("active"));
        const dynYear = document.getElementById("dynamic-year");
        if (dynYear) dynYear.textContent = new Date().getFullYear();

        // FAQ (Initial bind for static content, dynamic content handled in renderContextualFAQ)
        document.querySelectorAll(".faq-item-header").forEach(h => {
            h.addEventListener("click", () => {
                const p = h.parentElement;
                const b = p.querySelector(".faq-item-body");
                p.classList.toggle("active");
                b.style.maxHeight = p.classList.contains("active") ? b.scrollHeight + "px" : 0;
            });
        });

    } catch (error) {
        console.error("Erro no sistema:", error);
    }
});