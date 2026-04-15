# Guia de revisão

Se você está avaliando este projeto, esta é a ordem que recomendo.

---

## Trilha rápida (~20 minutos)

| Passo | O que ver | Tempo |
|-------|-----------|-------|
| 1 | [RESUMO-DO-PROJETO.txt](../RESUMO-DO-PROJETO.txt) | 2 min |
| 2 | Esta página até o fim | 3 min |
| 3 | [manual/bug-reports/BUG-002](../manual/bug-reports/BUG-002-problem-user-lastname-locked.md) e [BUG-001](../manual/bug-reports/BUG-001-problem-user-wrong-images.md) | 5 min |
| 4 | [e2e/pages/LoginPage.ts](../e2e/pages/LoginPage.ts) e [InventoryPage.ts](../e2e/pages/InventoryPage.ts) | 5 min |
| 5 | [e2e/tests/smoke/checkout.spec.ts](../e2e/tests/smoke/checkout.spec.ts) | 5 min |

---

## O que observar em cada parte

### Bug reports (`manual/bug-reports/`)
Leia como o bug foi descrito, os passos de reprodução e a análise de impacto. Cada relatório termina com uma recomendação Go/No Go — o papel do QA é comunicar risco, não só encontrar o problema.

### Page Objects (`e2e/pages/`)
Cada arquivo encapsula os seletores e ações de uma página. O teste nunca interage com `[data-test="login-button"]` diretamente — ele chama `loginPage.login()`. Veja como os comentários explicam o "por quê" de cada decisão, não apenas o "o quê".

### Testes E2E (`e2e/tests/`)
Três categorias:
- `smoke/` — o fluxo feliz, do login ao checkout
- `negative/` — como o sistema se comporta com entradas inválidas
- `problem-users/` — testes que documentam bugs conhecidos sem quebrar o CI

### Testes de API (`api/tests/`)
Cada função tem docstring em português explicando o cenário. Cada assert tem mensagem descritiva. Os marcadores (`@pytest.mark.crud`, `@pytest.mark.creation`, `@pytest.mark.negative`) permitem rodar categorias separadas.

### CI/CD (`.github/workflows/`)
Dois workflows independentes. Cada um filtra por path — mudança em `api/` não roda os testes E2E. Artefatos (relatórios HTML) são salvos mesmo quando os testes falham.

---

## Perguntas frequentes

**Por que os testes de problem_user passam mesmo com bugs?**
Testes que falham por bugs conhecidos poluem o CI. A decisão foi documentar o comportamento e deixar o teste passar. Os bugs ficam rastreáveis em `manual/bug-reports/` e no console do relatório.

**Como rodar localmente?**
Veja a seção "Como executar" no [README.md](../README.md).

**Por que dois produtos diferentes?**
Veja [docs/escopo.md](./escopo.md).

**Por que Playwright e não Selenium?**
Veja [docs/estrategia.md](./estrategia.md).
