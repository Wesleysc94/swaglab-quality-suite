# BUG-002 — Campo Last Name não aceita digitação no checkout para o problem_user

## Identificação

- **Bug ID:** BUG-002
- **Título:** Campo "Last Name" no formulário de checkout não retém o valor digitado
- **Data:** 2026-04-15
- **Reportado por:** Wesley Carvalho
- **Severidade:** Crítica
- **Prioridade:** Alta

## Contexto

- **Produto:** SauceDemo (https://www.saucedemo.com/)
- **Navegador:** Chromium (via Playwright)
- **Usuário afetado:** `problem_user`
- **Página afetada:** `/checkout-step-one.html` (formulário de entrega)

## Pré-condições

- Estar logado com `problem_user` (username: `problem_user`, password: `secret_sauce`)
- Ter ao menos um produto adicionado ao carrinho
- Estar na página `/checkout-step-one.html`

## Passos para Reproduzir

1. Acessar https://www.saucedemo.com/ e fazer login com `problem_user`
2. Adicionar qualquer produto ao carrinho (ex: "Sauce Labs Backpack")
3. Clicar no ícone do carrinho
4. Clicar em **Checkout**
5. Tentar preencher o campo **Last Name** com qualquer valor (ex: "Carvalho")
6. Observar o campo após a digitação

## Resultado Atual

O campo "Last Name" permanece vazio após tentar digitar. Qualquer texto inserido some imediatamente — o campo não aceita e não retém nenhum valor. O comportamento ocorre consistentemente com qualquer valor testado.

Consequentemente, ao clicar em "Continue":
- O sistema exibe a mensagem de erro **"Last Name is required"**
- O usuário fica preso na etapa 1 do checkout sem conseguir avançar
- **O checkout é completamente bloqueado** para o `problem_user`

## Resultado Esperado

O campo "Last Name" deve aceitar digitação normalmente, como o campo "First Name" e o campo "Postal Code" aceitam. Após digitar "Carvalho", o campo deve exibir "Carvalho" e manter o valor até o clique em "Continue".

## Evidência

- **Screenshot:** `manual/evidence/screenshots/BUG-002.png`
- **Teste automatizado:** `e2e/tests/problem-users/problem-user.spec.ts` — teste "[BUG-002]"
- **Log do teste:**
  ```
  [BUG-002] Confirmado: campo Last Name está vazio após tentar preencher. Valor: ""
  ```

## Análise Técnica

O campo possui alguma restrição JavaScript (possivelmente um event listener que limpa o valor ou um atributo `readonly`/`disabled` aplicado via JavaScript) que impede a entrada de dados. Os outros campos (`firstName` e `postalCode`) funcionam normalmente, indicando que o problema é específico ao campo `lastName` para o `problem_user`.

## Impacto

**No usuário final:** O `problem_user` **não consegue finalizar nenhuma compra**. O checkout fica completamente bloqueado — este é o impacto mais grave possível em um e-commerce.

**No negócio:** Perda total de conversão para usuários afetados. Em produção, isso representaria receita zero e possível fuga para concorrentes.

**Critério de Go/No Go:** Este bug é **bloqueador de release**. Severidade Crítica porque impede o fluxo principal de negócio (a compra). Deve ser corrigido antes de qualquer deploy em produção.
