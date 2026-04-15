# 🧪 swaglab-quality-suite

> Estudo de caso de QA com automação E2E no SauceDemo, testes de API no JSONPlaceholder e documentação de bugs conhecidos.

**English summary:** QA case study combining E2E automation on SauceDemo, API automation on JSONPlaceholder, and bug documentation designed to keep CI clean while preserving traceability.

[![E2E Tests](https://img.shields.io/badge/E2E%20Tests-23%20testes-brightgreen)](e2e/tests/)
[![API Tests](https://img.shields.io/badge/API%20Tests-17%20testes-brightgreen)](api/tests/)
[![Bugs documentados](https://img.shields.io/badge/Bugs-6%20relatórios-red)](manual/bug-reports/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](.github/workflows/)

🔎 **Portfolio principal:** [Wesleysc94](https://github.com/Wesleysc94/Wesleysc94)
📦 **Outro estudo de caso:** [toolshop-quality-portfolio](https://github.com/Wesleysc94/toolshop-quality-portfolio)

---

## Objetivo

Reunir em um único repositório duas frentes complementares de QA:

- automação web E2E em um produto com bugs intencionais
- automação de API em um serviço público usado para praticar CRUD, criação e cenários negativos

O foco deste estudo de caso é cobertura técnica, documentação rastreável e uma estratégia para ambientes em que alguns bugs já são conhecidos e não devem poluir o CI.

---

## Produtos testados

| Produto | Tipo | URL |
|---------|------|-----|
| SauceDemo | E-commerce web com bugs intencionais | https://www.saucedemo.com/ |
| JSONPlaceholder | API fake pública (CRUD + comments) | https://jsonplaceholder.typicode.com/ |

---

## O que foi feito

```
┌─────────────────────────────────────────────────────────┐
│                   PRODUTOS SOB TESTE                    │
├──────────────────────────┬──────────────────────────────┤
│      SAUCEDEMO           │      JSONPLACEHOLDER         │
│   (automação web E2E)    │      (automação de API)      │
│                          │                              │
│  • Login / Logout        │  • CRUD de posts             │
│  • Inventário            │  • Criação de comentários    │
│  • Carrinho              │  • Cenários negativos        │
│  • Checkout completo     │  • Validação de estrutura    │
│  • Erros de formulário   │  • Filtros e paginação       │
│  • Usuários com bugs     │                              │
│                          │                              │
│  23 testes ✅            │  17 testes ✅               │
│  6 bug reports 🐛        │  100% pass ✅               │
└──────────────────────────┴──────────────────────────────┘
```

---

## Bug reports

Bugs encontrados no SauceDemo ao testar usuários especiais. Cada relatório traz passos de reprodução, impacto e recomendação de decisão.

| ID | Bug | Severidade | Usuário |
|----|-----|:----------:|---------|
| [BUG-001](manual/bug-reports/BUG-001-problem-user-wrong-images.md) | Todos os produtos mostram a mesma imagem errada | 🟠 Alta | `problem_user` |
| [BUG-002](manual/bug-reports/BUG-002-problem-user-lastname-locked.md) | Campo sobrenome não aceita digitação no checkout | 🔴 Crítica | `problem_user` |
| [BUG-003](manual/bug-reports/BUG-003-error-user-cart-failures.md) | Botão "Adicionar ao carrinho" não responde | 🟠 Alta | `error_user` |
| [BUG-004](manual/bug-reports/BUG-004-error-user-checkout-fields.md) | Formulário de checkout perde os valores digitados | 🟠 Alta | `error_user` |
| [BUG-005](manual/bug-reports/BUG-005-performance-user-login-delay.md) | Login demora ~5 segundos para responder | 🟡 Média | `performance_glitch_user` |
| [BUG-006](manual/bug-reports/BUG-006-visual-user-layout-issues.md) | Layout do inventário com elementos fora do lugar | 🟡 Média | `visual_user` |

> Os testes dos usuários com bug foram escritos para **passar documentando o comportamento defeituoso**. Isso mantém o bug rastreável sem transformar o CI em ruído constante.
> As evidências automatizadas em `manual/evidence/` são geradas localmente e não entram no versionamento.

---

## Estrutura do projeto

```
swaglab-quality-suite/
├── e2e/                        ← Automação web — Playwright + TypeScript
│   ├── pages/                  ← Page Objects
│   ├── support/                ← Dados de teste centralizados
│   └── tests/
│       ├── smoke/              ← Fluxo feliz
│       ├── negative/           ← Erros e validações
│       └── problem-users/      ← Bugs conhecidos documentados
│
├── api/                        ← Automação de API — pytest + httpx
│   └── tests/
│       ├── test_posts.py       ← CRUD de posts
│       ├── test_creation.py    ← Criação de posts e comentários
│       └── test_negative.py    ← Erros esperados
│
├── manual/
│   └── bug-reports/            ← 6 relatórios de bugs do SauceDemo
│
├── docs/
│   ├── escopo.md               ← O que entra e o que fica de fora
│   ├── estrategia.md           ← Escolhas de ferramentas e abordagem
│   ├── glossario-qa.md         ← Termos de QA com exemplos práticos
│   └── guia-de-revisao.md      ← Trilha de leitura
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
npm ci
npx playwright install chromium
npm test
npm run test:smoke
npm run test:negative
npm run test:problem-users
npm run report
```

### Automação de API (pytest)

```bash
cd api
pip install -r requirements.txt
pytest -v
pytest -m crud
pytest -m creation
pytest -m negative
```

---

## Como revisar

| Passo | O que ver | Tempo |
|-------|-----------|-------|
| 1 | [RESUMO-DO-PROJETO.txt](RESUMO-DO-PROJETO.txt) | 2 min |
| 2 | [docs/guia-de-revisao.md](docs/guia-de-revisao.md) | 3 min |
| 3 | [manual/bug-reports/](manual/bug-reports/) — BUG-001 e BUG-002 | 5 min |
| 4 | [e2e/pages/](e2e/pages/) — Page Objects | 5 min |
| 5 | [api/tests/](api/tests/) — estrutura dos testes de API | 5 min |

> ⏱️ Revisão completa em ~20 minutos.

---

## O que este estudo de caso entrega

- **Automação em produtos diferentes** — web com comportamento bugado e API fake pública
- **Bug documentation sem ruído no CI** — rastreabilidade sem alerta falso permanente
- **POM e organização de suíte** — seletores centralizados e categorias de testes claras
- **CI/CD prático** — dois workflows independentes para web e API
- **Navegação orientada** — docs, resumos e ordem de revisão para avaliadores

---

## Contato

**Wesley Carvalho** — Analista de QA

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Wesley%20Carvalho-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/wesley-carvalho94/)
[![Portfolio](https://img.shields.io/badge/WX%20Digital%20Studio-111?style=flat&logo=google-chrome&logoColor=white)](https://www.wxdigitalstudio.com.br)
