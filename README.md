# swaglab-quality-suite

[![E2E Tests](https://img.shields.io/github/actions/workflow/status/wesleyjcarvalho/swaglab-quality-suite/e2e-tests.yml?branch=main&label=E2E%20Tests&logo=playwright&logoColor=white)](https://github.com/wesleyjcarvalho/swaglab-quality-suite/actions/workflows/e2e-tests.yml)
[![API Tests](https://img.shields.io/github/actions/workflow/status/wesleyjcarvalho/swaglab-quality-suite/api-tests.yml?branch=main&label=API%20Tests&logo=pytest&logoColor=white)](https://github.com/wesleyjcarvalho/swaglab-quality-suite/actions/workflows/api-tests.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Playwright](https://img.shields.io/badge/Playwright-latest-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev/)
[![pytest](https://img.shields.io/badge/pytest-8.x-0A9EDC?logo=pytest&logoColor=white)](https://pytest.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Portfolio de Quality Assurance com automação E2E (Playwright), testes de API (pytest), CI/CD com GitHub Actions e documentação de bugs. Projeto construído para demonstrar habilidades práticas de Analista de QA.

---

## Sobre o Projeto

O **swaglab-quality-suite** é um projeto de portfolio que aplica boas práticas de QA em dois produtos públicos:

| Produto | Tipo | Ferramenta | Cenários |
|---------|------|------------|----------|
| [SauceDemo](https://www.saucedemo.com/) | E-commerce web com bugs intencionais | Playwright + TypeScript | 19 testes |
| [Reqres.in](https://reqres.in/) | API REST (CRUD + Autenticação) | pytest + httpx | 14 testes |

**Total:** 33 testes automatizados · 6 bug reports · CI/CD com GitHub Actions

---

## Tecnologias

<div align="left">

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![pytest](https://img.shields.io/badge/pytest-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

</div>

---

## Cobertura de Testes

### E2E — SauceDemo (Playwright + TypeScript)

#### Smoke Tests — caminho feliz (`tests/smoke/`)

| Cenário | Resultado |
|---------|-----------|
| Login com standard_user → redireciona para /inventory.html | ✅ Passa |
| Logout → retorna à página de login | ✅ Passa |
| Inventário exibe 6 produtos | ✅ Passa |
| Ordenação por preço crescente (Onesie primeiro) | ✅ Passa |
| Detalhe de produto exibe nome e preço | ✅ Passa |
| Adicionar produto → badge mostra "1" | ✅ Passa |
| Remover produto → badge desaparece | ✅ Passa |
| Checkout completo → mensagem de sucesso | ✅ Passa |
| Revisão do pedido exibe produto e preço corretos | ✅ Passa |
| "Back Home" após checkout retorna ao inventário | ✅ Passa |

#### Testes Negativos — validação de erros (`tests/negative/`)

| Cenário | Resultado |
|---------|-----------|
| Login com credenciais inválidas → mensagem de erro | ✅ Passa |
| Login com locked_out_user → mensagem de bloqueio | ✅ Passa |
| Acesso direto a /inventory.html sem login → redireciona | ✅ Passa |
| Checkout sem campos preenchidos → erro de validação | ✅ Passa |
| Checkout com apenas First Name → erro no campo seguinte | ✅ Passa |

#### Problem Users — bugs documentados (`tests/problem-users/`)

| Usuário | Comportamento testado | Bug | Resultado |
|---------|----------------------|-----|-----------|
| problem_user | Login funciona | — | ✅ Passa |
| problem_user | Imagens incorretas nos produtos | [BUG-001](#-bug-reports) | ✅ Documentado |
| problem_user | Last Name não aceita digitação | [BUG-002](#-bug-reports) | ✅ Documentado |
| error_user | Login funciona | — | ✅ Passa |
| error_user | Carrinho com comportamento inconsistente | [BUG-003](#-bug-reports) | ✅ Documentado |
| error_user | Campos de checkout não persistem | [BUG-004](#-bug-reports) | ✅ Documentado |
| performance_glitch_user | Login com latência de ~5 segundos | [BUG-005](#-bug-reports) | ✅ Documentado |
| visual_user | Inconsistências visuais no layout | [BUG-006](#-bug-reports) | ✅ Documentado |

---

### API — Reqres.in (pytest + httpx)

#### CRUD de Usuários (`tests/test_users.py`) · `@pytest.mark.crud`

| Endpoint | Cenário | Resultado |
|----------|---------|-----------|
| `GET /api/users` | Status 200 · campo `data` é lista | ✅ Passa |
| `GET /api/users?page=2` | Paginação correta · campo `total_pages` | ✅ Passa |
| `GET /api/users/2` | Campos `id`, `email`, `first_name` presentes | ✅ Passa |
| `POST /api/users` | Status 201 · campos `name` e `job` retornados | ✅ Passa |
| `PUT /api/users/2` | Status 200 · campo `updatedAt` presente | ✅ Passa |
| `DELETE /api/users/2` | Status 204 · body vazio | ✅ Passa |

#### Autenticação (`tests/test_auth.py`) · `@pytest.mark.auth`

| Endpoint | Cenário | Resultado |
|----------|---------|-----------|
| `POST /api/register` | Com senha → status 200 · token presente | ✅ Passa |
| `POST /api/register` | Sem senha → status 400 · campo `error` | ✅ Passa |
| `POST /api/login` | Com senha → status 200 · token presente | ✅ Passa |
| `POST /api/login` | Sem senha → status 400 · campo `error` | ✅ Passa |

#### Cenários Negativos (`tests/test_negative.py`) · `@pytest.mark.negative`

| Endpoint | Cenário | Resultado |
|----------|---------|-----------|
| `GET /api/users/23` | Usuário inexistente → status 404 · body `{}` | ✅ Passa |
| `GET /api/unknown/23` | Recurso inexistente → status 404 | ✅ Passa |
| `GET /api/users` | Content-Type → `application/json` | ✅ Passa |
| `GET /api/users?delay=3` | Responde dentro do timeout (30s) | ✅ Passa |

---

## 🐛 Bug Reports

Bugs descobertos e documentados no SauceDemo. Cada relatório inclui passos de reprodução, análise de impacto e critério **Go/No Go**.

| ID | Título | Severidade | Usuário | Status |
|----|--------|:----------:|---------|:------:|
| [BUG-001](manual/bug-reports/BUG-001-problem-user-wrong-images.md) | Todos os produtos exibem a mesma imagem incorreta | 🟠 Alta | `problem_user` | Aberto |
| [BUG-002](manual/bug-reports/BUG-002-problem-user-lastname-locked.md) | Campo Last Name não aceita digitação no checkout | 🔴 Crítica | `problem_user` | Aberto |
| [BUG-003](manual/bug-reports/BUG-003-error-user-cart-failures.md) | Falhas ao adicionar/remover itens do carrinho | 🟠 Alta | `error_user` | Aberto |
| [BUG-004](manual/bug-reports/BUG-004-error-user-checkout-fields.md) | Campos do checkout não persistem os valores | 🟠 Alta | `error_user` | Aberto |
| [BUG-005](manual/bug-reports/BUG-005-performance-user-login-delay.md) | Login apresenta latência de ~5 segundos | 🟡 Média | `performance_glitch_user` | Aberto |
| [BUG-006](manual/bug-reports/BUG-006-visual-user-layout-issues.md) | Inconsistências visuais no layout do inventário | 🟡 Média | `visual_user` | Aberto |

---

## Como Executar

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [Python 3.12+](https://www.python.org/)
- [Git](https://git-scm.com/)

### Testes E2E (Playwright)

```bash
# Instalar dependências
cd e2e
npm install
npx playwright install chromium

# Executar todas as suites
npm test

# Executar por categoria
npm run test:smoke           # Testes do caminho feliz
npm run test:negative        # Testes de erro e validação
npm run test:problem-users   # Testes de usuários com bugs

# Abrir relatório HTML
npm run report
```

### Testes de API (pytest)

```bash
# Instalar dependências
cd api
pip install -r requirements.txt

# Executar todos os testes
pytest -v

# Executar por categoria (marcadores)
pytest -m crud       # Operações CRUD
pytest -m auth       # Autenticação
pytest -m negative   # Cenários negativos

# Gerar relatório HTML
pytest -v --html=report.html --self-contained-html
```

---

## Estrutura do Projeto

```
swaglab-quality-suite/
├── .github/
│   └── workflows/
│       ├── e2e-tests.yml      # CI: Playwright no Ubuntu
│       └── api-tests.yml      # CI: pytest no Ubuntu
├── e2e/                       # Testes E2E — Playwright + TypeScript
│   ├── pages/                 # Page Objects (Login, Inventory, Cart, Checkout, Complete)
│   ├── support/               # Dados de teste centralizados (test-data.ts)
│   ├── tests/
│   │   ├── smoke/             # 10 testes — caminho feliz
│   │   ├── negative/          # 5 testes — erros e validações
│   │   └── problem-users/     # 8 testes — bugs conhecidos documentados
│   └── playwright.config.ts
├── api/                       # Testes de API — pytest + httpx
│   ├── tests/
│   │   ├── test_users.py      # CRUD completo (6 testes)
│   │   ├── test_auth.py       # Registro e login (4 testes)
│   │   └── test_negative.py   # Cenários negativos (4 testes)
│   └── conftest.py            # Fixtures compartilhadas
├── manual/
│   └── bug-reports/           # 6 relatórios de bugs com análise de impacto
└── docs/
    ├── escopo.md              # O que está dentro/fora do escopo
    ├── estrategia.md          # Decisões técnicas fundamentadas
    ├── glossario-qa.md        # 17 termos de QA explicados
    └── guia-de-revisao.md     # Trilha de leitura para avaliadores (~30 min)
```

---

## O que este Projeto Demonstra

| Habilidade | Como aparece no projeto |
|-----------|------------------------|
| **Automação E2E** | 19 testes Playwright cobrindo smoke, negativos e casos de bug |
| **Testes de API REST** | 14 testes pytest com CRUD completo, autenticação e erros |
| **Page Object Model** | 5 Page Objects TypeScript com seletores encapsulados |
| **CI/CD** | 2 workflows GitHub Actions com cache e filtro por paths |
| **Documentação de Bugs** | 6 bug reports com severidade, evidência e análise Go/No Go |
| **Estratégia de QA** | Decisões fundamentadas em `docs/estrategia.md` |
| **TypeScript strict** | `tsconfig.json` com `strict: true`, tipagem forte |
| **pytest marcadores** | `@pytest.mark.crud/auth/negative` para execução seletiva |
| **Dados centralizados** | `test-data.ts` como fonte única de verdade (zero magic strings) |
| **Documentação didática** | 100% comentado em português com explicações do "por quê" |

---

## Documentação Adicional

- [Escopo do projeto](docs/escopo.md) — o que está dentro e fora do escopo, com justificativas
- [Estratégia de testes](docs/estrategia.md) — por que Playwright, por que POM, por que monorepo
- [Glossário de QA](docs/glossario-qa.md) — 17 termos explicados com exemplos práticos
- [Guia de revisão](docs/guia-de-revisao.md) — trilha de leitura para avaliadores (~30 min)

---

## Contato

**Wesley Carvalho**
Analista de QA em formação | Automação de Testes · Playwright · pytest

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/wesleyjcarvalho)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/wesleyjcarvalho)

---

<p align="center">
  Feito com foco em qualidade · Portfolio QA 2026
</p>
