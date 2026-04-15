# BUG-003 — Falhas ao adicionar e remover itens do carrinho para o error_user

## Identificação

- **Bug ID:** BUG-003
- **Título:** Botões "Add to cart" e "Remove" não respondem consistentemente para o error_user
- **Data:** 2026-04-15
- **Reportado por:** Wesley Carvalho
- **Severidade:** Alta
- **Prioridade:** Alta

## Contexto

- **Produto:** SauceDemo (https://www.saucedemo.com/)
- **Navegador:** Chromium (via Playwright)
- **Usuário afetado:** `error_user`
- **Página afetada:** `/inventory.html` (lista de produtos)

## Pré-condições

- Estar logado com `error_user` (username: `error_user`, password: `secret_sauce`)
- Estar na página `/inventory.html`

## Passos para Reproduzir

1. Acessar https://www.saucedemo.com/ e fazer login com `error_user`
2. Tentar clicar em **"Add to cart"** em qualquer produto (ex: "Sauce Labs Backpack")
3. Observar o badge do carrinho no canto superior direito
4. Tentar clicar em **"Add to cart"** em um segundo produto

## Resultado Atual

O comportamento é inconsistente e imprevisível:

- **Cenário A (mais comum):** O badge do carrinho não aparece após clicar em "Add to cart" — o produto não foi adicionado
- **Cenário B:** O botão troca para "Remove" visualmente, mas o badge não incrementa corretamente
- **Cenário C:** Alguns produtos são adicionados corretamente, outros não respondem ao clique
- A inconsistência varia entre execuções — o que funciona em uma tentativa pode falhar na próxima

## Resultado Esperado

- Clicar em "Add to cart" deve sempre adicionar o produto ao carrinho
- O badge deve incrementar imediatamente (de vazio para "1", de "1" para "2", etc.)
- O botão deve alternar para "Remove" após a adição
- O comportamento deve ser 100% consistente e reproduzível

## Evidência

- **Screenshot:** `manual/evidence/screenshots/BUG-003.png`
- **Teste automatizado:** `e2e/tests/problem-users/error-user.spec.ts` — teste "[BUG-003]"
- **Log do teste:**
  ```
  [BUG-003] Confirmado: badge não apareceu após adicionar produto ao carrinho
  ```

## Análise Técnica

O `error_user` parece ter um perfil de configuração que injeta falhas aleatórias nos handlers de clique dos botões do carrinho. O erro não é de UI (os elementos existem), mas de processamento da ação — possivelmente um script JavaScript que deliberadamente ignora ou cancela o evento de clique para alguns produtos.

## Impacto

**No usuário final:** Experiência frustrante — o usuário clica várias vezes tentando adicionar produtos sem resultado. Sensação de sistema quebrado. Alta probabilidade de abandono da sessão.

**No negócio:** Redução direta na taxa de conversão. Produtos que não podem ser adicionados ao carrinho não podem ser comprados — perda de receita direta.

**Critério de Go/No Go:** Bug **bloqueador** para qualquer perfil de usuário afetado. Severidade Alta porque impede ações essenciais do e-commerce.
