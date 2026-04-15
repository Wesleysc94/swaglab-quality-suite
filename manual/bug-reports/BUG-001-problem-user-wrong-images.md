# BUG-001 — Produtos exibem imagens incorretas para o problem_user

## Identificação

- **Bug ID:** BUG-001
- **Título:** Todos os produtos exibem a mesma imagem errada (cachorro) no inventário
- **Data:** 2026-04-15
- **Reportado por:** Wesley Carvalho
- **Severidade:** Alta
- **Prioridade:** Alta

## Contexto

- **Produto:** SauceDemo (https://www.saucedemo.com/)
- **Navegador:** Chromium (via Playwright)
- **Usuário afetado:** `problem_user`
- **Página afetada:** `/inventory.html` (lista de produtos)

## Pré-condições

- Acesso à internet disponível
- Navegador Chromium instalado
- Credenciais do `problem_user`:
  - Username: `problem_user`
  - Password: `secret_sauce`

## Passos para Reproduzir

1. Acessar https://www.saucedemo.com/
2. Inserir o username `problem_user` e a senha `secret_sauce`
3. Clicar no botão **Login**
4. Observar a lista de produtos na página `/inventory.html`

## Resultado Atual

Todos os 6 produtos exibem exatamente a mesma imagem — a foto de um cachorro (Labrador) — independentemente do produto. A imagem exibida não tem relação com o produto listado:

- Sauce Labs Backpack → exibe imagem de cachorro
- Sauce Labs Bike Light → exibe imagem de cachorro
- Sauce Labs Bolt T-Shirt → exibe imagem de cachorro
- Sauce Labs Fleece Jacket → exibe imagem de cachorro
- Sauce Labs Onesie → exibe imagem de cachorro
- Test.allTheThings() T-Shirt (Red) → exibe imagem de cachorro

## Resultado Esperado

Cada produto deve exibir sua própria imagem correspondente:

- Sauce Labs Backpack → imagem da mochila
- Sauce Labs Bike Light → imagem da lanterna de bicicleta
- Sauce Labs Bolt T-Shirt → imagem da camiseta Bolt
- Sauce Labs Fleece Jacket → imagem do casaco fleece
- Sauce Labs Onesie → imagem do macacão
- Test.allTheThings() T-Shirt (Red) → imagem da camiseta vermelha

## Evidência

- **Screenshot:** `manual/evidence/screenshots/BUG-001.png`
- **Teste automatizado:** `e2e/tests/problem-users/problem-user.spec.ts` — teste "[BUG-001]"
- **Log do teste:** Todos os `src` das imagens são idênticos: `https://www.saucedemo.com/static/media/sl-404.168b1cce.jpg`

## Análise Técnica

O `problem_user` parece ter uma configuração especial no backend do SauceDemo que sobrescreve os `src` de todas as imagens de produto com a URL de uma imagem de erro/fallback. Isso sugere que o mapeamento de imagens por produto está incorreto para este usuário.

## Impacto

**No usuário final:** O cliente não consegue identificar visualmente os produtos que está comprando. Em um e-commerce real, isso causaria compras erradas, aumento de devoluções e perda de confiança na plataforma.

**No negócio:** Taxa de abandono elevada, aumento no volume de suporte por devoluções e reclamações, dano à imagem da marca.

**Critério de Go/No Go:** Este bug **bloqueia** o lançamento para qualquer usuário afetado por esse perfil de configuração. Severidade Alta porque impacta diretamente a experiência de compra.
