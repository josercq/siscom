// =========================================================
// SISCOM - jsmain.js (2025-12-07)
// Sistema de Gestão de Compras Escolares
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    try {
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

        if (faqHeaders.length > 0) {
            faqHeaders.forEach(header => {
                header.addEventListener("click", () => {
                    try {
                        const currentItem = header.parentElement;
                        const currentBody = currentItem ? currentItem.querySelector(".faq-item-body") : null;

                        const isOpen = currentItem && currentItem.classList.contains("active");

                        // Fecha todos os outros
                        document.querySelectorAll(".faq-item").forEach(item => {
                            item.classList.remove("active");
                            const body = item.querySelector(".faq-item-body");
                            if (body) body.style.maxHeight = null; 
                        });

                        // Abre o atual se não estava aberto
                        if (!isOpen && currentItem && currentBody) {
                            currentItem.classList.add("active");
                            currentBody.style.maxHeight = currentBody.scrollHeight + "px";
                        }
                    } catch (error) {
                        console.error("Erro ao processar clique no FAQ:", error);
                    }
                });
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
        try {
            const rows = tableFull.querySelectorAll("tbody tr");

            function applyFilters() {
                try {
                    const textValue = searchInput.value.toLowerCase();
                    const statusValue = statusFilter.value.toLowerCase();
                    const schoolValue = schoolFilter.value.toLowerCase();

                    rows.forEach(row => {
                        const allText = row.textContent.toLowerCase();
                        const schoolCellText = row.cells[0].textContent.toLowerCase();
                        
                        const statusCell = row.querySelector(".status"); 
                        const statusCellText = statusCell ? statusCell.textContent.toLowerCase() : "";

                        const matchesText = allText.includes(textValue);
                        const matchesStatus = (statusValue === "todos" || statusValue === "") 
                            ? true 
                            : statusCellText.includes(statusValue);

                        const matchesSchool = (schoolValue === "todas" || schoolValue === "") 
                            ? true 
                            : schoolCellText.includes(schoolValue);

                        row.style.display = (matchesText && matchesStatus && matchesSchool) ? "" : "none";
                    });
                } catch (error) {
                    console.error("Erro ao aplicar filtros:", error);
                }
            }

            searchInput.addEventListener("input", applyFilters);
            statusFilter.addEventListener("change", applyFilters);
            schoolFilter.addEventListener("change", applyFilters);
        } catch (error) {
            console.error("Erro ao inicializar filtros de oportunidades:", error);
        }
    }
    
    // Filtro Simples da Home (se existir)
    const searchIndex = document.getElementById("table-search-index");
    const tableIndex = document.getElementById("opportunities-table-index");

    if (searchIndex && tableIndex) {
        try {
            const rowsIndex = tableIndex.querySelectorAll("tbody tr");
            searchIndex.addEventListener("input", () => {
                try {
                    const term = searchIndex.value.toLowerCase();
                    rowsIndex.forEach(row => {
                        const text = row.textContent.toLowerCase();
                        row.style.display = text.includes(term) ? "" : "none";
                    });
                } catch (error) {
                    console.error("Erro ao filtrar tabela de índice:", error);
                }
            });
        } catch (error) {
            console.error("Erro ao inicializar filtro de índice:", error);
        }
    }

        // =========================================================
        // 6. ANO DINÂMICO (FOOTER)
        // =========================================================
        const dynamicYear = document.getElementById("dynamic-year");
        if (dynamicYear) {
            dynamicYear.textContent = new Date().getFullYear();
        }

        // =========================================================
        // 7. FORMULÁRIO DE CONTATO COM MODAL (INDEX)
        // =========================================================
        const contactForm = document.getElementById("contact-form");
        const customModal = document.getElementById("custom-modal-overlay");
        const customCloseBtn = document.getElementById("custom-modal-close");
        const popupTitle = document.getElementById("popup-title");
        const popupText = document.getElementById("popup-text");
        const subjectSelect = document.getElementById("subject");

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Função para validar um campo
        function validateField(field) {
            const errorSpan = field.closest(".form-group")?.querySelector(".form-error");
            let isValid = true;
            let errorMsg = "";

            if (!field.value.trim()) {
                isValid = false;
                errorMsg = "Este campo é obrigatório.";
            } else if (field.type === "email" && !emailRegex.test(field.value)) {
                isValid = false;
                errorMsg = "Por favor, insira um e-mail válido.";
            }

            if (isValid) {
                field.classList.remove("is-invalid");
                if (errorSpan) errorSpan.textContent = "";
            } else {
                field.classList.add("is-invalid");
                if (errorSpan) errorSpan.textContent = errorMsg;
            }

            return isValid;
        }

        // Validação em tempo real
        if (contactForm) {
            const formFields = contactForm.querySelectorAll("input[required], textarea[required], select[required]");
            formFields.forEach(field => {
                field.addEventListener("blur", () => validateField(field));
                field.addEventListener("change", () => validateField(field));
            });
        }

        if (contactForm && customModal && customCloseBtn) {
            contactForm.addEventListener("submit", function(e) {
                e.preventDefault();
                
                try {
                    const nameField = contactForm.querySelector("#name");
                    const emailField = contactForm.querySelector("#email");
                    const subjectField = contactForm.querySelector("#subject");
                    const messageField = contactForm.querySelector("#message");
                    
                    // Validar todos os campos
                    const isNameValid = validateField(nameField);
                    const isEmailValid = validateField(emailField);
                    const isSubjectValid = validateField(subjectField);
                    const isMessageValid = validateField(messageField);
                    
                    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
                        return;
                    }
                    
                    const submitBtn = contactForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn?.textContent || "Enviar";
                    
                    if (submitBtn) {
                        submitBtn.textContent = "Enviando...";
                        submitBtn.disabled = true;
                    }

                    setTimeout(() => {
                        try {
                            // Mensagens customizadas por tipo
                            if (subjectField && subjectField.value === "cadastro_fornecedor") {
                                popupTitle.textContent = "Cadastro Solicitado!";
                                popupText.textContent = "Verifique sua caixa de e-mail para continuar seu cadastro como fornecedor.";
                            } else {
                                popupTitle.textContent = "Mensagem Enviada!";
                                popupText.textContent = "A equipe do SISCOM retornará por e-mail em breve.";
                            }

                            customModal.classList.add("is-visible");
                            customModal.classList.add("active");
                            
                            contactForm.reset();
                            
                            // Remover classes de erro
                            contactForm.querySelectorAll(".is-invalid").forEach(field => {
                                field.classList.remove("is-invalid");
                                const errorSpan = field.closest(".form-group")?.querySelector(".form-error");
                                if (errorSpan) errorSpan.textContent = "";
                            });
                            
                            if (submitBtn) {
                                submitBtn.textContent = originalText;
                                submitBtn.disabled = false;
                            }
                        } catch (error) {
                            console.error("Erro ao processar formulário:", error);
                            if (submitBtn) {
                                submitBtn.textContent = originalText;
                                submitBtn.disabled = false;
                            }
                        }
                    }, 1000);
                } catch (error) {
                    console.error("Erro na submissão do formulário:", error);
                }
            });

            customCloseBtn.addEventListener("click", () => {
                customModal.classList.remove("is-visible");
                customModal.classList.remove("active");
            });

            customModal.addEventListener("click", (e) => {
                if (e.target === customModal) {
                    customModal.classList.remove("is-visible");
                    customModal.classList.remove("active");
                }
            });
        }
    } catch (error) {
        console.error("Erro crítico ao inicializar JavaScript:", error);
    }
});
