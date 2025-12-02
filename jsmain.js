document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================================
    // 1. MENU MOBILE (HAMBURGER)
    // =========================================================
    const hamburger = document.getElementById("hamburger-menu");
    const mainNav = document.getElementById("main-nav");

    if (hamburger && mainNav) {
        hamburger.addEventListener("click", () => {
            mainNav.classList.toggle("active");
            
            const icon = hamburger.querySelector("i");
            if (icon) {
                if (mainNav.classList.contains("active")) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-times");
                } else {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }
            }
        });
    }

    // =========================================================
    // 2. FAQ (ACORDEÃO)
    // =========================================================
    const faqHeaders = document.querySelectorAll(".faq-item-header");

    faqHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const currentItem = header.parentElement;
            const currentBody = currentItem.querySelector(".faq-item-body");

            const isOpen = currentItem.classList.contains("active");

            // Fecha todos os outros
            document.querySelectorAll(".faq-item").forEach(item => {
                item.classList.remove("active");
                const body = item.querySelector(".faq-item-body");
                if(body) body.style.maxHeight = null; 
            });

            // Abre o atual se não estava aberto
            if (!isOpen) {
                currentItem.classList.add("active");
                currentBody.style.maxHeight = currentBody.scrollHeight + "px";
            }
        });
    });

    // =========================================================
    // 3. FORMULÁRIO DE CONTATO COM POPUP (CORRIGIDO)
    // =========================================================
    const contactForm = document.getElementById("contact-form");
    const modal = document.getElementById("success-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const formMessage = document.getElementById("form-message");

    // Verificamos se o formulário E o modal existem na página antes de rodar
    if (contactForm && modal) {
        
        contactForm.addEventListener("submit", function(e) {
            // ESTA LINHA É A MAIS IMPORTANTE: Impede a página de recarregar
            e.preventDefault(); 
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : "Enviar";
            
            // Feedback visual no botão
            if(submitBtn) {
                submitBtn.textContent = "Enviando...";
                submitBtn.disabled = true;
            }

            // Simula um tempo de envio de 1 segundo
            setTimeout(() => {
                // Abre o Modal
                modal.classList.add("active"); // Adiciona a classe que muda o display para flex
                
                // Limpa o formulário
                contactForm.reset();
                
                // Restaura o botão
                if(submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
                if(formMessage) formMessage.textContent = "";

            }, 1000);
        });

        // Lógica para fechar o modal
        if (closeModalBtn) {
            closeModalBtn.addEventListener("click", () => {
                modal.classList.remove("active");
            });
        }

        // Fechar clicando fora da caixa
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
    }

    // =========================================================
    // 4. ANO DINÂMICO
    // =========================================================
    const dynamicYear = document.getElementById("dynamic-year");
    if (dynamicYear) {
        dynamicYear.textContent = new Date().getFullYear();
    }

    // =========================================================
    // 5. FILTROS (PAINEL DE OPORTUNIDADES)
    // =========================================================
    const searchInput = document.getElementById("search-input");
    const statusFilter = document.getElementById("status-filter");
    const schoolFilter = document.getElementById("school-filter");
    const tableFull = document.getElementById("opportunities-table-full");

    if (searchInput && statusFilter && schoolFilter && tableFull) {
        
        const rows = tableFull.querySelectorAll("tbody tr");

        function applyFilters() {
            const textValue = searchInput.value.toLowerCase();
            const statusValue = statusFilter.value.toLowerCase();
            const schoolValue = schoolFilter.value.toLowerCase();

            rows.forEach(row => {
                const allText = row.textContent.toLowerCase();
                const schoolCellText = row.cells[0].textContent.toLowerCase();
                
                const statusCell = row.querySelector(".status"); 
                const statusCellText = statusCell ? statusCell.textContent.toLowerCase() : "";

                const matchesText = allText.includes(textValue);
                const matchesStatus = (statusValue === "todos" || statusValue === "") ? true : statusCellText.includes(statusValue);
                const matchesSchool = (schoolValue === "todas" || schoolValue === "") ? true : schoolCellText.includes(schoolValue);

                if (matchesText && matchesStatus && matchesSchool) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        }

        searchInput.addEventListener("input", applyFilters);
        statusFilter.addEventListener("change", applyFilters);
        schoolFilter.addEventListener("change", applyFilters);
    }
    
    // Filtro Simples da Home (se existir)
    const searchIndex = document.getElementById("table-search-index");
    const tableIndex = document.getElementById("opportunities-table-index");

    if (searchIndex && tableIndex) {
        const rowsIndex = tableIndex.querySelectorAll("tbody tr");
        searchIndex.addEventListener("input", () => {
            const term = searchIndex.value.toLowerCase();
            rowsIndex.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? "" : "none";
            });
        });
    }
});