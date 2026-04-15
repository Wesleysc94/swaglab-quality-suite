# BUG-004 — Campos do checkout perdem os valores digitados

- **ID:** BUG-004
- **Data:** 2026-04-15
- **Reportado por:** Wesley Carvalho
- **Severidade:** Alta
- **Prioridade:** Alta

---

## Produto e contexto

- **Aplicação:** SauceDemo — https://www.saucedemo.com/
- **Página:** `/checkout-step-one.html` — formulário de entrega
- **Usuário:** `error_user`
- **Navegador:** Chromium

---

## Pré-condições

- Logado com `error_user` / `secret_sauce`
- Pelo menos um produto no carrinho

---

## Passos para reproduzir

1. Faça login com `error_user` / `secret_sauce`
2. Adicione um produto e navegue até o checkout
3. Preencha os campos First Name, Last Name e Postal Code
4. Observe os valores dos campos após o preenchimento

---

## Resultado atual

Um ou mais campos ficam vazios após o preenchimento. Ao clicar em "Continue", o sistema exibe erros de campo obrigatório para campos que foram preenchidos.

---

## Resultado esperado

Os campos retêm os valores até o clique em "Continue".

---

## Evidência

- Screenshot: `manual/evidence/screenshots/BUG-004.png`
- Teste automatizado: `e2e/tests/problem-users/error-user.spec.ts` → teste `[BUG-004]`
- Log do teste:
  ```
  [BUG-004] Estado dos campos após preenchimento:
    First Name: (vazio — BUG)
    Last Name: (vazio — BUG)
    Postal Code: (vazio — BUG)
  ```

---

## Impacto

O `error_user` fica preso num loop: preenche os campos, eles somem, preenche de novo. Nenhuma compra pode ser concluída.

**Recomendação:** No Go. Combinado com o BUG-003, este perfil de usuário está completamente bloqueado.
