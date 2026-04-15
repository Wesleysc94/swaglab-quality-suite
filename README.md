# 🧪 swaglab-quality-suite

> Segundo projeto do portfolio de QA — automação E2E, testes de API e documentação de bugs em dois produtos públicos diferentes.

[![E2E Tests](https://img.shields.io/badge/E2E%20Tests-19%20testes-brightgreen)](e2e/tests/)
[![API Tests](https://img.shields.io/badge/API%20Tests-14%20testes-brightgreen)](api/tests/)
[![Bugs documentados](https://img.shields.io/badge/Bugs-6%20relatórios-red)](manual/bug-reports/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](.github/workflows/)

📦 **Parte do portfolio:** [toolshop-quality-portfolio](https://github.com/Wesleysc94/toolshop-quality-portfolio)

---

## Por que este projeto existe

No [primeiro portfolio](https://github.com/Wesleysc94/toolshop-quality-portfolio) testei um único produto em três camadas — manual, API e E2E. Aqui mudei a abordagem: **dois produtos diferentes, cada um com seu conjunto de desafios.**

O [SauceDemo](https://www.saucedemo.com/) é um e-commerce construído com bugs intencionais — o site foi feito pra quebrar. O [Reqres.in](https://reqres.in/) é uma API REST pública para praticar operações de CRUD e autenticação.

A combinação foi escolhida porque permite praticar uma habilidade que o primeiro portfolio não cobria: **como testar e documentar bugs que você sabe que existem, sem deixar o CI quebrado.**

---

## O que foi feito

```
┌─────────────────────────────────────────────────────────┐
│                   PRODUTOS SOB TESTE                    │
├──────────────────────────┬──────────────────────────────┤
│      SAUCEDEMO           │         REQRES.IN            │
│   (automação web E2E)    │      (automação de API)      │
│                          │                              │
│  • Login / Logout        │  • CRUD de usuários          │
│  • Inventário            │  • Autenticação              │
│  • Carrinho              │  • Cenários negativos        │
│  • Checkout completo     │                              │
│  • Erros de formulário   │                              │
│  • 4 tipos de usuários   │                              │
│    com bugs              │                              │
│                          │                              │
│  19 testes ✅            │  14 testes ✅               │
│  6 bug reports 🐛        │  100% pass ✅               │
└──────────────────────────┴──────────────────────────────┘
```

---

## 🐛 Bug Reports

Bugs encontrados no SauceDemo ao testar com usuários especiais. Cada relatório tem passos de reprodução, análise de impacto e recomendação Go/No Go.

| ID | Bug | Severidade | Usuário |
|----|-----|:----------:|---------|
| [BUG-001](manual/bug-reports/BUG-001-problem-user-wrong-images.md) | Todos os produtos mostram a mesma imagem errada | 🟠 Alta | `problem_user` |
| [BUG-002](manual/bug-reports/BUG-002-problem-user-lastname-locked.md) | Campo sobrenome não aceita digitação no checkout | 🔴 Crítica | `problem_user` |
| [BUG-003](manual/bug-reports/BUG-003-error-user-cart-failures.md) | Botão "Adicionar ao carrinho" não responde | 🟠 Alta | `error_user` |
| [BUG-004](manual/bug-reports/BUG-004-error-user-checkout-fields.md) | Formulário de checkout perde os valores digitados | 🟠 Alta | `error_user` |
| [BUG-005](manual/bug-reports/BUG-005-performance-user-login-delay.md) | Login demora ~5 segundos para responder | 🟡 Média | `performance_glitch_user` |
| [BUG-006](manual/bug-reports/BUG-006-visual-user-layout-issues.md) | Layout do inventário com elementos fora do lugar | 🟡 Média | `visual_user` |

> **Nota sobre os testes de bugs:** Os testes dos usuários com problema foram escritos para **passar**, documentando o comportamento defeituoso em vez de falhar o CI. Isso é intencional — bug conhecido no CI só gera ruído.

---

## Estrutura do projeto

```
swaglab-quality-suite/
├── e2e/                        ← Automação web — Playwright + TypeScript
│   ├── pages/                  ← Page Objects (LoginPage, CartPage, etc.)
│   ├── support/                ← Dados de teste centralizados
│   └── tests/
│       ├── smoke/              ← Fluxo feliz (login, carrinho, checkout)
│       ├── negative/           ← Erros e validações
│       └── problem-users/      ← Testes documentando bugs conhecidos
│
├── api/                        ← Automação de API — pytest + httpx
│   └── tests/
│       ├── test_users.py       ← CRUD de usuários
│       ├── test_auth.py        ← Registro e login
│       └── test_negative.py    ← Erros esperados
│
├── manual/
│   └── bug-reports/            ← 6 relatórios de bugs do SauceDemo
│
├── docs/
│   ├── escopo.md               ← O que entra e o que fica de fora
│   ├── estrategia.md           ← Por que cada ferramenta foi escolhida
│   ├── glossario-qa.md         ← 17 termos de QA com exemplos práticos
│   └── guia-de-revisao.md      ← Trilha de leitura (~30 min)
│
└── .github/workflows/          ← CI/CD automatizado
```

---

## Como executar

### Pré-requisitos

- Node.js 18+
- Python 3.12+

### Automação web (Playwright)

```bash
cd e2e
npm install
npx playwright install chromium
npm test                        # todos os testes
npm run test:smoke              # só o fluxo feliz
npm run test:negative           # erros e validações
npm run test:problem-users      # testes de bugs conhecidos
npm run report                  # abre o relatório HTML
```

### Automação de API (pytest)

```bash
cd api
pip install -r requirements.txt
pytest -v                       # todos os testes
pytest -m crud                  # só operações CRUD
pytest -m auth                  # só autenticação
pytest -m negative              # só cenários de erro
```

---

## Por que isso importa

Este projeto cobre três coisas que o portfolio anterior não tinha:

1. **Testes em múltiplos produtos** — mostra capacidade de adaptar a abordagem para produtos com características diferentes.

2. **Documentação de bugs conhecidos sem quebrar o CI** — o teste passa, registra o problema no console e no relatório. O bug fica rastreável sem gerar alarme falso.

3. **Page Object Model** — todos os seletores ficam centralizados em classes separadas. Se o SauceDemo mudar o HTML, ajusta em um lugar e todos os testes continuam funcionando.

---

## Como revisar

| Passo | O que ver | Tempo |
|-------|-----------|-------|
| 1 | [RESUMO-DO-PROJETO.txt](RESUMO-DO-PROJETO.txt) | 2 min |
| 2 | [docs/guia-de-revisao.md](docs/guia-de-revisao.md) | 3 min |
| 3 | [Bug reports](manual/bug-reports/) — BUG-001 e BUG-002 | 5 min |
| 4 | [e2e/pages/](e2e/pages/) — como o POM foi implementado | 5 min |
| 5 | [api/tests/](api/tests/) — estrutura dos testes de API | 5 min |

> ⏱️ **Revisão completa em ~20 minutos.**

---

## Produtos testados

| Produto | Tipo | URL |
|---------|------|-----|
| SauceDemo | E-commerce web com bugs intencionais | https://www.saucedemo.com/ |
| Reqres.in | API REST pública (CRUD + Auth) | https://reqres.in/ |

---

## Contato

**Wesley Carvalho** — Analista de QA

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Wesley%20Carvalho-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/wesley-carvalho94/)
[![Portfolio](https://img.shields.io/badge/WX%20Digital%20Studio-111?style=flat&logo=google-chrome&logoColor=white)](https://www.wxdigitalstudio.com.br)
