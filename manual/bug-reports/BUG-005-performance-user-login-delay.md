# BUG-005 — Login demora ~5 segundos para responder

- **ID:** BUG-005
- **Data:** 2026-04-15
- **Reportado por:** Wesley Carvalho
- **Severidade:** Média
- **Prioridade:** Média

---

## Produto e contexto

- **Aplicação:** SauceDemo — https://www.saucedemo.com/
- **Fluxo:** Tela de login → `/inventory.html`
- **Usuário:** `performance_glitch_user`
- **Navegador:** Chromium

---

## Pré-condições

- Acesso à internet
- Credenciais: `performance_glitch_user` / `secret_sauce`

---

## Passos para reproduzir

1. Acesse https://www.saucedemo.com/
2. Faça login com `performance_glitch_user` / `secret_sauce`
3. Meça o tempo entre o clique no botão e o carregamento do inventário

---

## Resultado atual

O login demora entre 4,8 e 5,2 segundos para processar. A tela fica travada na página de login sem nenhum feedback visual durante esse período.

Medição do teste automatizado:
```
[BUG-005] Tempo de login: 5043ms
[BUG-005] Excede o limite de 2000ms
```

---

## Resultado esperado

O login deve completar em menos de 2 segundos. Referência: 53% dos usuários abandonam páginas que demoram mais de 3 segundos (Google, Core Web Vitals).

---

## Evidência

- Screenshot: `manual/evidence/screenshots/BUG-005.png`
- Teste automatizado: `e2e/tests/problem-users/performance-user.spec.ts` → teste `[BUG-005]`

---

## Impacto

Com 5 segundos de espera sem feedback, o usuário assume que o sistema travou. Taxa de abandono alta.

**Recomendação:** Go com observação. O login funciona — mas a latência precisa ser investigada e corrigida antes de uma versão com tráfego real.
