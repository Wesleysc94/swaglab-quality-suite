# Escopo do Projeto — swaglab-quality-suite

## O que é este projeto

O `swaglab-quality-suite` é um projeto de portfolio de Quality Assurance que demonstra
habilidades práticas de QA usando duas aplicações públicas como alvo de testes:

- **SauceDemo** (https://www.saucedemo.com/): e-commerce com bugs intencionais
- **Reqres.in** (https://reqres.in/): API REST para operações de CRUD e autenticação

---

## O que está dentro do escopo

### Testes E2E — SauceDemo (Playwright)

| Categoria      | Fluxo coberto                                      | Arquivo                            |
|----------------|----------------------------------------------------|------------------------------------|
| Smoke          | Login com standard_user                            | `tests/smoke/login.spec.ts`        |
| Smoke          | Logout                                             | `tests/smoke/login.spec.ts`        |
| Smoke          | Listagem de 6 produtos                             | `tests/smoke/inventory.spec.ts`    |
| Smoke          | Ordenação por preço                                | `tests/smoke/inventory.spec.ts`    |
| Smoke          | Detalhe de produto                                 | `tests/smoke/inventory.spec.ts`    |
| Smoke          | Adicionar ao carrinho                              | `tests/smoke/cart.spec.ts`         |
| Smoke          | Remover do carrinho                                | `tests/smoke/cart.spec.ts`         |
| Smoke          | Checkout completo (happy path)                     | `tests/smoke/checkout.spec.ts`     |
| Smoke          | Revisão do pedido                                  | `tests/smoke/checkout.spec.ts`     |
| Smoke          | Retorno ao inventário pós-checkout                 | `tests/smoke/checkout.spec.ts`     |
| Negativo       | Login com credenciais inválidas                    | `tests/negative/login-errors.spec.ts` |
| Negativo       | Login com usuário bloqueado                        | `tests/negative/login-errors.spec.ts` |
| Negativo       | Acesso direto sem autenticação                     | `tests/negative/login-errors.spec.ts` |
| Negativo       | Checkout sem preencher campos                      | `tests/negative/checkout-errors.spec.ts` |
| Negativo       | Checkout com campo parcialmente preenchido         | `tests/negative/checkout-errors.spec.ts` |
| Problem User   | Login do problem_user (BUG-001, BUG-002)           | `tests/problem-users/problem-user.spec.ts` |
| Problem User   | Login do error_user (BUG-003, BUG-004)             | `tests/problem-users/error-user.spec.ts` |
| Problem User   | Login do performance_glitch_user (BUG-005)         | `tests/problem-users/performance-user.spec.ts` |
| Problem User   | Login do visual_user (BUG-006)                     | `tests/problem-users/visual-user.spec.ts` |

### Testes de API — Reqres.in (pytest + httpx)

| Categoria | Endpoint           | Cenário                                       |
|-----------|--------------------|-----------------------------------------------|
| CRUD      | GET /api/users     | Listar usuários — status 200, campo data      |
| CRUD      | GET /api/users?page=2 | Paginação — página 2, campo total_pages    |
| CRUD      | GET /api/users/{id}   | Busca por ID — campos id, email, first_name |
| CRUD      | POST /api/users    | Criação — status 201, campos name e job      |
| CRUD      | PUT /api/users/{id}   | Atualização — status 200, campo updatedAt  |
| CRUD      | DELETE /api/users/{id} | Remoção — status 204, body vazio          |
| Auth      | POST /api/register | Registro com sucesso — token presente         |
| Auth      | POST /api/register | Registro sem senha — status 400, campo error  |
| Auth      | POST /api/login    | Login com sucesso — token presente            |
| Auth      | POST /api/login    | Login sem senha — status 400, campo error     |
| Negativo  | GET /api/users/23  | Usuário inexistente — status 404, body vazio  |
| Negativo  | GET /api/unknown/23 | Recurso inexistente — status 404            |
| Negativo  | GET /api/users     | Content-Type — deve ser application/json     |
| Negativo  | GET /api/users?delay=3 | Requisição com delay — responde no timeout|

### Documentação e Bug Reports

- 6 bug reports detalhados com passos de reprodução, evidências e análise de impacto
- Glossário de termos de QA para estudo
- Estratégia de teste documentada com justificativas técnicas
- Guia de revisão para avaliadores de portfolio

---

## O que está fora do escopo

| Item excluído                          | Motivo da exclusão                                              |
|----------------------------------------|-----------------------------------------------------------------|
| Testes de pagamento real               | SauceDemo não tem integração com gateway de pagamento           |
| Testes de Firefox e Safari             | Foco no Chromium para simplificar o CI; expansão é fácil       |
| Testes de responsividade mobile        | Além do escopo deste portfolio; seria uma fase futura           |
| Testes de acessibilidade (a11y)        | Escopo específico que merece projeto dedicado                   |
| Testes de carga/performance (k6, Locust) | Requer infraestrutura dedicada; fora do escopo inicial        |
| Testes de segurança (OWASP, pentest)   | Requer conhecimento e ferramentas específicas de segurança      |
| Persistência de dados na API           | Reqres.in é uma API simulada — não persiste dados entre chamadas |
| Integração com sistemas de bug tracking (Jira) | Fora do escopo de demonstração técnica do projeto       |

---

## Decisões de escopo relevantes

### Por que apenas Chromium?

Começar com um único browser reduz o tempo de CI em ~66% e facilita a análise de falhas. O Playwright suporta Firefox e WebKit nativamente — adicionar novos projetos em `playwright.config.ts` é trivial quando o projeto evoluir.

### Por que testes de problem users passam quando encontram bugs?

A estratégia de documentar bugs como "comportamentos conhecidos" em vez de falhar os testes é intencional. Em um time real, testes que falham por bugs conhecidos adicionam ruído ao CI e dificultam a detecção de novas regressões. A abordagem correta é: documentar o bug, rastreá-lo no sistema de tickets e, após a correção, atualizar o teste para verificar o comportamento correto.

### Por que não testar autenticação via JWT/Bearer token?

O Reqres.in não implementa autenticação real com JWT persistido — ele retorna um token simulado. Testar fluxos que dependem desse token seria simular uma API real com dados falsos, o que não agrega valor ao portfolio. O foco é na estrutura e na assertividade dos testes.
