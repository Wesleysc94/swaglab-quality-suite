# BUG-004 — Campos do formulário de checkout não persistem valores para o error_user

## Identificação

- **Bug ID:** BUG-004
- **Título:** Campos do checkout (First Name, Last Name, Postal Code) perdem os valores digitados
- **Data:** 2026-04-15
- **Reportado por:** Wesley Carvalho
- **Severidade:** Alta
- **Prioridade:** Alta

## Contexto

- **Produto:** SauceDemo (https://www.saucedemo.com/)
- **Navegador:** Chromium (via Playwright)
- **Usuário afetado:** `error_user`
- **Página afetada:** `/checkout-step-one.html` (etapa 1 do checkout)

## Pré-condições

- Estar logado com `error_user` (username: `error_user`, password: `secret_sauce`)
- Ter ao menos um produto no carrinho
- Estar na página `/checkout-step-one.html`

## Passos para Reproduzir

1. Acessar https://www.saucedemo.com/ e fazer login com `error_user`
2. Adicionar um produto ao carrinho (pode precisar de várias tentativas — ver BUG-003)
3. Navegar para o carrinho e clicar em **Checkout**
4. No formulário de checkout, preencher o campo **First Name** com "Wesley"
5. Preencher o campo **Last Name** com "Carvalho"
6. Preencher o campo **Postal Code** com "01001-000"
7. Observar os valores dos campos após o preenchimento

## Resultado Atual

Um ou mais campos perdem os valores imediatamente após o preenchimento:

- Os campos aparecem vazios após o `fill()` ser executado
- Ao clicar em "Continue", o sistema reporta campos obrigatórios faltando
- O usuário não consegue avançar para a etapa de revisão
- O comportamento pode variar — às vezes apenas um campo falha, às vezes todos

Mensagens de erro observadas após clicar em Continue com campos aparentemente preenchidos:
- "First Name is required"
- "Last Name is required"

## Resultado Esperado

Todos os campos devem reter os valores digitados até o clique em "Continue". O fluxo de checkout deve ser idêntico ao do `standard_user` — formulário funcionando, avançando para a revisão do pedido.

## Evidência

- **Screenshot:** `manual/evidence/screenshots/BUG-004.png`
- **Teste automatizado:** `e2e/tests/problem-users/error-user.spec.ts` — teste "[BUG-004]"
- **Log do teste:**
  ```
  [BUG-004] Estado dos campos após preenchimento:
    First Name: (vazio — BUG)
    Last Name: (vazio — BUG)
    Postal Code: (vazio — BUG)
  [BUG-004] Confirmado: um ou mais campos não retiveram os valores digitados
  ```

## Análise Técnica

Similar ao BUG-002, o `error_user` parece ter scripts JavaScript que interceptam eventos de input e limpam os campos imediatamente após o preenchimento. A diferença para o BUG-002 é que aqui múltiplos campos são afetados, sugerindo uma lógica de "erro genérico" aplicada a todo o formulário para este perfil de usuário.

## Impacto

**No usuário final:** Impossibilidade de completar o checkout. O usuário fica em um loop frustrante — tenta preencher, campos ficam vazios, tenta de novo. A experiência é de sistema completamente disfuncional.

**No negócio:** Bloqueio total da conversão para usuários com este perfil. Zero receita gerada por essa sessão, além do risco de review negativo e perda permanente do cliente.

**Critério de Go/No Go:** Bug **bloqueador de release**. Combinado com o BUG-003 (carrinho), o `error_user` não consegue realizar nenhuma compra. Ambos os bugs precisam ser corrigidos antes do deploy.
