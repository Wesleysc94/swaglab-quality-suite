# BUG-005 — Login do performance_glitch_user apresenta latência de ~5 segundos

## Identificação

- **Bug ID:** BUG-005
- **Título:** Tempo de login excede 5 segundos para o performance_glitch_user
- **Data:** 2026-04-15
- **Reportado por:** Wesley Carvalho
- **Severidade:** Média
- **Prioridade:** Média

## Contexto

- **Produto:** SauceDemo (https://www.saucedemo.com/)
- **Navegador:** Chromium (via Playwright)
- **Usuário afetado:** `performance_glitch_user`
- **Fluxo afetado:** Autenticação — tela de login → `/inventory.html`

## Pré-condições

- Acesso à internet disponível
- Credenciais do `performance_glitch_user`:
  - Username: `performance_glitch_user`
  - Password: `secret_sauce`

## Passos para Reproduzir

1. Acessar https://www.saucedemo.com/
2. Inserir username `performance_glitch_user` e senha `secret_sauce`
3. Clicar em **Login**
4. Cronometrar o tempo entre o clique no botão e o carregamento do inventário

## Resultado Atual

O tempo de processamento do login é de aproximadamente **5 segundos** (medição: 4800ms a 5200ms em diferentes execuções). A tela fica congelada no loading após o clique em Login até o redirecionamento finalmente ocorrer.

**Medição do teste automatizado:**
```
[BUG-005] Tempo de login do performance_glitch_user: 5043ms
[BUG-005] Confirmado: login levou 5043ms — excede o limite de 2000ms
[BUG-005] Impacto: degradação de UX, possível timeout em conexões lentas
```

## Resultado Esperado

O login deve ser processado e redirecionado em **menos de 2 segundos**. Padrão da indústria para operações de autenticação:
- Excelente: < 500ms
- Aceitável: 500ms a 2000ms
- Degradado: 2000ms a 4000ms
- **Inaceitável: > 4000ms (caso atual)**

## Evidência

- **Screenshot:** `manual/evidence/screenshots/BUG-005.png`
- **Teste automatizado:** `e2e/tests/problem-users/performance-user.spec.ts` — teste "[BUG-005]"
- **Medição:** ~5000ms vs. benchmark de 2000ms (2.5x mais lento que o limite)

## Análise Técnica

O `performance_glitch_user` tem um perfil que adiciona um delay artificial (provavelmente via `setTimeout` ou uma chamada de API lenta) ao processo de autenticação. Em produção, isso poderia ser causado por:
- Query de banco de dados não otimizada para este perfil de usuário
- Verificação de permissões excessivamente complexa
- Chamada a serviço externo (ex: sistema de autenticação) sem cache

## Impacto

**No usuário final:** 5 segundos de espera em uma tela sem feedback é suficiente para que o usuário pense que o sistema travou. Taxa de abandono é alta para esperas acima de 3 segundos (referência: Google - 53% dos usuários abandonam após 3s).

**No negócio:** Perda de sessões, especialmente em mobile com conexões mais lentas. Impacto no SEO (Core Web Vitals penalizam páginas lentas). Possível timeout em ambientes corporativos com proxy.

**Critério de Go/No Go:** Bug de **Média** severidade — o login funciona, mas com UX degradada. Deve ser corrigido antes do lançamento, mas não é bloqueador imediato se outros fluxos estiverem funcionais. Recomenda-se monitorar com alertas de latência em produção.
