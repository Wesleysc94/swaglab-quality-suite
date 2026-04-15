# BUG-002 — Campo "Last Name" não aceita digitação no checkout

- **ID:** BUG-002
- **Data:** 2026-04-15
- **Reportado por:** Wesley Carvalho
- **Severidade:** Crítica
- **Prioridade:** Alta

---

## Produto e contexto

- **Aplicação:** SauceDemo — https://www.saucedemo.com/
- **Página:** `/checkout-step-one.html` — formulário de entrega
- **Usuário:** `problem_user`
- **Navegador:** Chromium

---

## Pré-condições

- Logado com `problem_user` / `secret_sauce`
- Pelo menos um produto no carrinho

---

## Passos para reproduzir

1. Faça login com `problem_user` / `secret_sauce`
2. Adicione qualquer produto ao carrinho
3. Clique no ícone do carrinho
4. Clique em **Checkout**
5. Tente preencher o campo **Last Name** com qualquer valor

---

## Resultado atual

O campo "Last Name" permanece vazio após qualquer tentativa de digitação. O texto some imediatamente ao ser inserido.

Consequência: ao clicar em "Continue", o sistema exibe `"Last Name is required"`. O checkout fica completamente bloqueado para este usuário.

---

## Resultado esperado

O campo aceita digitação normalmente, como "First Name" e "Postal Code" fazem.

---

## Evidência

- Screenshot: `manual/evidence/screenshots/BUG-002.png`
- Teste automatizado: `e2e/tests/problem-users/problem-user.spec.ts` → teste `[BUG-002]`
- Log do teste:
  ```
  [BUG-002] Confirmado: campo Last Name está vazio após tentar preencher. Valor: ""
  ```

---

## Impacto

O `problem_user` **não consegue finalizar nenhuma compra**. O checkout está completamente bloqueado.

**Recomendação:** No Go. Este bug bloqueia o fluxo principal de conversão.
