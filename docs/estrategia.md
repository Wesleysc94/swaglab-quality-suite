# Estratégia de testes

Cada ferramenta e padrão usado neste projeto foi escolhido por um motivo. Esta página resume essas decisões.

---

## Playwright em vez de Selenium

O Playwright instala tudo com um comando, tem auto-wait nativo e oferece recursos de debug úteis para automação web moderna, como screenshots, traces e execução headed.

---

## Page Object Model (POM)

Sem POM, o seletor do botão de login apareceria repetido em vários testes. Com POM, cada página concentra seletores e ações em um arquivo próprio.

```
pages/
├── LoginPage.ts
├── InventoryPage.ts
├── CartPage.ts
├── CheckoutPage.ts
└── CompletePage.ts
```

Isso deixa a suíte mais legível e facilita manutenção quando a UI muda.

---

## pytest + httpx

O `pytest` reduz repetição com fixtures e oferece uma forma simples de organizar suites por categoria. O `httpx` funciona bem para testes de API e mantém a escrita das requisições direta.

---

## Dados centralizados

Os dados de apoio ficam em `e2e/support/test-data.ts`, evitando strings espalhadas pelos testes e reduzindo risco de inconsistência.

---

## Monorepo com `e2e/` e `api/`

Como as duas frentes fazem parte do mesmo estudo de caso, manter tudo no mesmo repositório simplifica documentação, navegação e CI.

---

## Bugs documentados sem poluir o CI

Quando o comportamento defeituoso já é conhecido, o teste registra o bug em vez de produzir falha recorrente no pipeline. Isso preserva rastreabilidade e reduz ruído operacional.
