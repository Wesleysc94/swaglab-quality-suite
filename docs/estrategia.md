# Estratégia de testes

Cada ferramenta e padrão usado neste projeto foi escolhido por um motivo. Esta página explica as decisões.

---

## Playwright em vez de Selenium

O Selenium ainda funciona, mas exige driver externo (ChromeDriver), configuração de esperas explícitas e mais código para fazer o básico. O Playwright instala tudo com um comando, tem auto-wait nativo e gera screenshots e vídeos automaticamente em falhas.

Para um projeto de portfolio em 2025/2026, Playwright é o padrão do mercado.

---

## Page Object Model (POM)

Sem POM, o seletor do botão de login aparece repetido em dez testes diferentes. Se o HTML do SauceDemo mudar, são dez arquivos pra atualizar.

Com POM, o seletor fica em `LoginPage.ts`. Muda em um lugar, todos os testes continuam funcionando.

```
pages/
├── LoginPage.ts       ← seletores e ações da tela de login
├── InventoryPage.ts   ← seletores e ações do inventário
├── CartPage.ts        ← seletores e ações do carrinho
├── CheckoutPage.ts    ← seletores e ações do checkout
└── CompletePage.ts    ← seletores e ações da conclusão
```

Cada Page Object expõe métodos como `login()`, `addToCart()`, `proceedToCheckout()`. O teste lê como uma instrução, não como uma sequência de seletores.

---

## pytest + httpx em vez de requests + unittest

O `pytest` tem um sistema de fixtures que elimina o setup repetitivo. Em vez de criar o cliente HTTP em cada teste, declaro uma fixture no `conftest.py` e o pytest injeta automaticamente.

O `httpx` tem suporte nativo a HTTP/2 e async — e a API é praticamente idêntica ao `requests`. Para testes de API modernos, é a escolha natural.

---

## Dados centralizados

Tudo fica em `e2e/support/test-data.ts`:

```typescript
export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked:   { username: 'locked_out_user', password: 'secret_sauce' },
  // ...
}
```

Sem strings soltas nos testes. O TypeScript avisa no editor se você digitar o nome errado.

---

## Monorepo (e2e/ e api/ no mesmo repositório)

Com dois módulos de teste, um repositório único é mais simples: documentação centralizada, CI configurado em um lugar e tudo versionado junto.

O CI usa filtro por paths — uma mudança em `api/` não dispara os testes E2E (que são mais lentos).

---

## Bugs documentados em vez de falhas de CI

Testes que falham por bugs conhecidos adicionam ruído. Quando um novo bug aparece, o time não sabe se é coisa nova ou o bug antigo de sempre.

A estratégia aqui foi: o teste do problem_user passa, confirma que o bug existe, e registra no console. O bug fica documentado em `manual/bug-reports/`. Quando for corrigido, o teste é atualizado para validar o comportamento correto.
