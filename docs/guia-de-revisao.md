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

Leia como o defeito foi descrito, como ele pode ser reproduzido e qual impacto ele tem no produto. Cada relatório termina com uma recomendação de decisão.

### Page Objects (`e2e/pages/`)

Cada arquivo encapsula seletores e ações de uma página. O teste chama métodos como `login()` e `addToCart()` em vez de repetir seletores em vários arquivos.

### Testes E2E (`e2e/tests/`)

Três categorias:

- `smoke/` — fluxo feliz
- `negative/` — entradas inválidas e mensagens de erro
- `problem-users/` — comportamento com bugs conhecidos

### Testes de API (`api/tests/`)

Cada função tem docstring em português, asserts descritivos e marcadores para execução por categoria: `crud`, `creation` e `negative`.

### CI/CD (`.github/workflows/`)

Dois workflows independentes. Mudança em `api/` não dispara a suíte E2E, e mudança em `e2e/` não executa a suíte de API.

---

## Perguntas frequentes

**Por que os testes de usuários com bug passam?**
Porque o objetivo é documentar um comportamento conhecido sem transformar o pipeline em ruído recorrente. O bug continua rastreável em `manual/bug-reports/`.

**Como rodar localmente?**
Veja a seção "Como executar" no [README.md](../README.md).

**Por que usar dois produtos?**
Para mostrar automação em contextos diferentes: web com bugs intencionais e API pública de uso simples.

**Por que Playwright e não Selenium?**
Veja [docs/estrategia.md](./estrategia.md).

---

## Navegação do portfolio

- portfolio principal: [Wesleysc94](https://github.com/Wesleysc94/Wesleysc94)
- outro estudo de caso: [toolshop-quality-portfolio](https://github.com/Wesleysc94/toolshop-quality-portfolio)
