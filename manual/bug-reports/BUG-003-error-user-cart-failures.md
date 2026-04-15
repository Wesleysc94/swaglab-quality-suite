# BUG-003 — Botão "Add to cart" não responde consistentemente

- **ID:** BUG-003
- **Data:** 2026-04-15
- **Reportado por:** Wesley Carvalho
- **Severidade:** Alta
- **Prioridade:** Alta

---

## Produto e contexto

- **Aplicação:** SauceDemo — https://www.saucedemo.com/
- **Página:** `/inventory.html` — lista de produtos
- **Usuário:** `error_user`
- **Navegador:** Chromium

---

## Pré-condições

- Logado com `error_user` / `secret_sauce`

---

## Passos para reproduzir

1. Faça login com `error_user` / `secret_sauce`
2. Clique em **Add to cart** em qualquer produto
3. Observe o badge do carrinho no canto superior direito

---

## Resultado atual

O comportamento é imprevisível:

- Em alguns produtos, o botão não responde e o badge não aparece
- Em outros, o botão troca para "Remove" visualmente, mas o badge não incrementa
- O que funciona numa tentativa pode falhar na próxima

---

## Resultado esperado

Clicar em "Add to cart" sempre adiciona o produto. O badge incrementa imediatamente.

---

## Evidência

- Screenshot: `manual/evidence/screenshots/BUG-003.png`
- Teste automatizado: `e2e/tests/problem-users/error-user.spec.ts` → teste `[BUG-003]`

---

## Impacto

O usuário não consegue adicionar produtos de forma confiável. A taxa de abandono é alta — produto que não entra no carrinho não é comprado.

**Recomendação:** No Go para perfis com este comportamento.
