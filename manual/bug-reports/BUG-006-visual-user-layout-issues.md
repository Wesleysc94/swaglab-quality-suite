# BUG-006 — Layout do inventário com inconsistências visuais

- **ID:** BUG-006
- **Data:** 2026-04-15
- **Reportado por:** Wesley Carvalho
- **Severidade:** Média
- **Prioridade:** Baixa

---

## Produto e contexto

- **Aplicação:** SauceDemo — https://www.saucedemo.com/
- **Página:** `/inventory.html` — lista de produtos
- **Usuário:** `visual_user`
- **Navegador:** Chromium

---

## Pré-condições

- Logado com `visual_user` / `secret_sauce`

---

## Passos para reproduzir

1. Faça login com `visual_user` / `secret_sauce`
2. Observe a lista de produtos e compare com o layout do `standard_user`

---

## Resultado atual

O layout apresenta inconsistências em relação ao layout esperado:

- Botões "Add to cart" aparecem deslocados fora do card do produto
- Algumas imagens têm proporções diferentes entre os produtos
- Elementos do cabeçalho com posicionamento irregular

---

## Resultado esperado

O layout deve ser idêntico ao do `standard_user`: cards com altura uniforme, botões na posição padrão, imagens proporcionais.

---

## Evidência

- Screenshot: `manual/evidence/screenshots/BUG-006-visual-user-layout.png` (gerado pelo teste)
- Teste automatizado: `e2e/tests/problem-users/visual-user.spec.ts` → teste `[BUG-006]`

---

## Impacto

A aplicação funciona — o usuário consegue adicionar produtos e finalizar a compra. Mas o layout quebrado compromete a credibilidade do produto.

**Recomendação:** Go com observação. Não bloqueia o fluxo principal, mas deve ser corrigido. Para detectar regressões visuais automaticamente, considerar testes de snapshot (ex: `expect(page).toHaveScreenshot()` nativo do Playwright).
