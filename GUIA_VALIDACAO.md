# 🔧 Guia de Uso - Validação de Formulários

## Validação de Formulário Melhorada

O formulário de contato em `index.html` agora possui validação robusta com feedback visual em tempo real.

### Funcionalidades

#### ✅ Validação em Tempo Real
- Os campos são validados automaticamente ao perder o foco (blur event)
- Também são validados ao mudar o valor (change event)
- Mensagens de erro aparecem instantaneamente

#### 🎨 Feedback Visual
```css
/* Campo com erro */
input.is-invalid,
textarea.is-invalid,
select.is-invalid {
    border-color: #e53e3e;  /* Vermelho */
    box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.2);
}

/* Campo válido */
input:valid {
    border-color: #10B981;  /* Verde (opcional) */
}
```

#### 📋 Campos Validados

| Campo | Validação | Mensagem |
|-------|-----------|----------|
| Nome | Obrigatório, não vazio | "Este campo é obrigatório." |
| Email | Obrigatório, formato válido | "Por favor, insira um e-mail válido." |
| Assunto | Obrigatório, seleção | "Este campo é obrigatório." |
| Mensagem | Obrigatório, não vazio | "Este campo é obrigatório." |

### Exemplo de Uso

```javascript
// A validação é automática, mas você pode chamar manualmente:
const field = document.getElementById("email");
validateField(field);  // Retorna true ou false
```

### Como Funciona

1. **Usuário digita no campo**
2. **Campo perde foco (blur)**
3. **Validação é executada**
4. Se inválido:
   - Adiciona classe `.is-invalid` ao campo
   - Exibe mensagem de erro em `.form-error`
   - Campo fica com borda vermelha
5. Se válido:
   - Remove classe `.is-invalid`
   - Limpa mensagem de erro

### Estilo de Erro

```html
<div class="form-group">
    <label for="email">E-mail *</label>
    <input type="email" id="email" name="email" required>
    <span class="form-error" role="alert"></span>  <!-- Aqui aparecem erros -->
</div>
```

```css
.form-error {
    display: block;
    color: #e53e3e;  /* Vermelho */
    font-size: 0.875rem;
    margin-top: 0.25rem;
    min-height: 1.2em;  /* Evita layout shift */
}
```

### Acessibilidade

- ✅ `aria-required="true"` indica campo obrigatório
- ✅ `role="alert"` nas mensagens de erro (para leitores de tela)
- ✅ `aria-live="polite"` na mensagem geral de status
- ✅ Indicador visual `*` para campos obrigatórios

### Testar Validação

1. Abra `index.html` no navegador
2. Vá para seção "Fale Conosco ou Cadastre-se"
3. Tente deixar um campo em branco e clicar fora
4. Tente digitar um email inválido
5. Veja as mensagens de erro aparecerem

---

## Tratamento de Erros

Todos os scripts agora possuem tratamento robusto:

```javascript
try {
    // Código principal
} catch (error) {
    console.error("Erro ao processar:", error);
    // Graceful degradation
}
```

**Benefícios:**
- Site não trava se houver erro
- Erros são registrados no console
- Usuário recebe feedback apropriado

---

## Diferenças Antes vs Depois

### Antes
```html
<!-- Validação apenas ao submeter -->
<input type="email" id="email" required>
```

### Depois
```html
<!-- Validação em tempo real com feedback -->
<input 
    type="email" 
    id="email" 
    required
    aria-required="true"
    placeholder="seu.email@exemplo.com"
>
<span class="form-error" role="alert"></span>
```

---

## Debugging

### Verificar Erros no Console
```javascript
// Abra DevTools (F12) → Console
// Erros aparecerão com mensagem:
// "Erro ao validar campo: ..."
```

### Verificar Classes CSS
```javascript
// No console, digite:
document.getElementById("email").classList
// Verá se tem a classe 'is-invalid'
```

---

## Conclusão

A validação de formulário agora oferece:
- ✅ Feedback visual imediato
- ✅ Mensagens de erro claras
- ✅ Acessibilidade melhorada
- ✅ Código robusto com tratamento de erros
- ✅ Melhor experiência do usuário
