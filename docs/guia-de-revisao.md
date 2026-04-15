# Guia de Revisão — swaglab-quality-suite

Trilha de leitura para avaliadores de portfolio. Tempo total estimado: **~30 minutos**.

---

## Rota sugerida

### 1. Visão geral (3 min)

Comece pelo [RESUMO-DO-PROJETO.txt](../RESUMO-DO-PROJETO.txt) para entender o objetivo,
os resultados e os diferenciais do projeto em 2 minutos.

Depois leia a seção **"O que este projeto demonstra"** no [README.md](../README.md).

---

### 2. Estratégia técnica (5 min)

Leia [docs/estrategia.md](./estrategia.md) para entender **por quê** cada ferramenta foi escolhida e como as decisões arquiteturais foram tomadas. Este é o documento que demonstra pensamento analítico de QA — não apenas "escrevi testes", mas "tomei decisões fundamentadas".

Pontos de destaque:
- Justificativa para o Page Object Model
- Por que Playwright em vez de Selenium
- Estratégia para bugs conhecidos (problem users)

---

### 3. Cobertura de testes (5 min)

Veja a tabela de cobertura no [README.md](../README.md) para ter visão rápida de todos os cenários. Depois confirme o escopo em [docs/escopo.md](./escopo.md) — inclusive o que **ficou fora** do escopo e por quê.

---

### 4. Código E2E — Page Objects (7 min)

Leia na sequência:
1. [e2e/pages/LoginPage.ts](../e2e/pages/LoginPage.ts) — mais simples, serve como introdução ao padrão POM
2. [e2e/pages/InventoryPage.ts](../e2e/pages/InventoryPage.ts) — mais completo, demonstra variedade de ações
3. [e2e/tests/smoke/checkout.spec.ts](../e2e/tests/smoke/checkout.spec.ts) — teste mais complexo, exercita todos os Page Objects no fluxo completo de checkout

O que observar: comentários em português, nomeclatura em inglês, uso de `beforeEach`, organização por suite com `test.describe`.

---

### 5. Código E2E — Testes de problem users (3 min)

Leia [e2e/tests/problem-users/problem-user.spec.ts](../e2e/tests/problem-users/problem-user.spec.ts).

Este arquivo demonstra uma habilidade avançada: documentar bugs como comportamentos conhecidos sem que os testes falhem. Observe o uso de `expect().not.toBe()` para registrar o estado bugado e os comentários explicando a estratégia.

---

### 6. Código de API (5 min)

Leia na sequência:
1. [api/conftest.py](../api/conftest.py) — introduz o conceito de fixtures pytest
2. [api/tests/test_users.py](../api/tests/test_users.py) — CRUD completo com docstrings em português
3. [api/tests/test_negative.py](../api/tests/test_negative.py) — cenários de fronteira e edge cases

O que observar: docstrings explicativas, mensagens descritivas nas assertions, uso de marcadores (`pytestmark`).

---

### 7. Bug Reports (3 min)

Leia pelo menos dois bug reports completos:
- [BUG-002](../manual/bug-reports/BUG-002-problem-user-lastname-locked.md) — Severidade Crítica (bloqueia checkout)
- [BUG-005](../manual/bug-reports/BUG-005-performance-user-login-delay.md) — Severidade Média (performance)

Compare os níveis de severidade e como isso se reflete na análise de impacto e na recomendação Go/No Go de cada bug.

---

### 8. CI/CD (2 min)

Veja os workflows:
- [.github/workflows/e2e-tests.yml](../.github/workflows/e2e-tests.yml)
- [.github/workflows/api-tests.yml](../.github/workflows/api-tests.yml)

Observe: filtro por `paths`, cache de dependências, upload de artefatos, `if: always()` no upload.

---

### 9. Glossário (opcional — 5 min)

Se quiser verificar o domínio dos termos de QA, leia [docs/glossario-qa.md](./glossario-qa.md). Todos os termos são explicados com exemplos práticos deste projeto.

---

## O que este projeto NÃO fez propositalmente

Para avaliadores que gostariam de ver mais:

| Item não incluído                | Motivo / Próxima fase                                        |
|----------------------------------|--------------------------------------------------------------|
| Testes de regressão visual       | Exigiria Percy/Applitools; sugerido no BUG-006              |
| Múltiplos browsers               | Playwright facilita — basta adicionar projetos ao config     |
| Testes de performance (k6)       | Fase futura; requer infraestrutura dedicada                  |
| Testes de acessibilidade         | Merece projeto específico com axe-core                      |
| Mock de APIs nas tests E2E       | Decisão consciente — testes hit real endpoints para maior valor |

---

## Perguntas frequentes de avaliadores

**"Por que os testes de problem_user passam mesmo tendo bugs?"**
→ Leia a seção "Estratégia para bugs conhecidos" em [docs/estrategia.md](./estrategia.md).

**"Como rodar os testes localmente?"**
→ Veja a seção "Como executar" no [README.md](../README.md).

**"Por que monorepo em vez de dois repositórios?"**
→ Explicado em [docs/estrategia.md](./estrategia.md#por-que-monorepo).

**"Os testes realmente passam?"**
→ Sim — foram projetados para ser executáveis contra os endpoints reais do SauceDemo e Reqres.in.
