SISCOM - MVP
===============

Run local development server (Node.js required):

1. Instale dependências:

```bash
cd /workspaces/siscom
npm install
```

2. Inicie o servidor:

```bash
npm start
```

3. Abra no navegador:

http://localhost:3000/

Funcionalidades implementadas (MVP):
- Autenticação básica via JWT (`/api/auth/login`).
- Cadastro de fornecedores via formulário (POST `/api/fornecedores`).
- CRUD mínimo de oportunidades (APM cria via POST `/api/oportunidades`).
- Fornecedores listam oportunidades e enviam propostas (`/api/oportunidades/:id/propostas`).
- Histórico simples armazenado em `db.json`.

Observações:
- Senhas iniciais dos usuários de exemplo estão definidas como `password` (hash pré-gerado). Troque em `db.json` e crie fluxo de reset em produção.
- Para teste rápido, use o usuário `apm@example.com` (papel `apm`) e `fornecedor@example.com` (papel `fornecedor`).
