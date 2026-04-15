# BUG-001 — Todos os produtos exibem a mesma imagem incorreta

- **ID:** BUG-001
- **Data:** 2026-04-15
- **Reportado por:** Wesley Carvalho
- **Severidade:** Alta
- **Prioridade:** Alta

---

## Produto e contexto

- **Aplicação:** SauceDemo — https://www.saucedemo.com/
- **Página:** `/inventory.html` — lista de produtos
- **Usuário:** `problem_user`
- **Navegador:** Chromium

---

## Pré-condições

- Acesso à internet
- Credenciais: `problem_user` / `secret_sauce`

---

## Passos para reproduzir

1. Acesse https://www.saucedemo.com/
2. Faça login com `problem_user` / `secret_sauce`
3. Observe a lista de produtos na página de inventário

---

## Resultado atual

Todos os 6 produtos exibem a mesma imagem — a foto de um cachorro — independentemente do produto listado:

- Sauce Labs Backpack → imagem do cachorro
- Sauce Labs Bike Light → imagem do cachorro
- Sauce Labs Bolt T-Shirt → imagem do cachorro
- Sauce Labs Fleece Jacket → imagem do cachorro
- Sauce Labs Onesie → imagem do cachorro
- Test.allTheThings() T-Shirt (Red) → imagem do cachorro

O src de todas as imagens aponta para o mesmo arquivo: `sl-404.168b1cce.jpg`.

---

## Resultado esperado

Cada produto deve exibir sua própria imagem correspondente.

---

## Evidência

- Screenshot: `manual/evidence/screenshots/BUG-001.png`
- Teste automatizado: `e2e/tests/problem-users/problem-user.spec.ts` → teste `[BUG-001]`

---

## Impacto

O usuário não consegue identificar visualmente o que está comprando. Em produção, isso causaria compras erradas e aumento de devoluções.

**Recomendação:** No Go para qualquer release que afete esse perfil de usuário.
