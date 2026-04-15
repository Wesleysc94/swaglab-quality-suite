# BUG-006 — Inconsistências visuais no layout do inventário para o visual_user

## Identificação

- **Bug ID:** BUG-006
- **Título:** Elementos do inventário apresentam desalinhamento e inconsistências visuais
- **Data:** 2026-04-15
- **Reportado por:** Wesley Carvalho
- **Severidade:** Média
- **Prioridade:** Baixa

## Contexto

- **Produto:** SauceDemo (https://www.saucedemo.com/)
- **Navegador:** Chromium (via Playwright)
- **Usuário afetado:** `visual_user`
- **Página afetada:** `/inventory.html` (lista de produtos)

## Pré-condições

- Estar logado com `visual_user` (username: `visual_user`, password: `secret_sauce`)
- Estar na página `/inventory.html`

## Passos para Reproduzir

1. Acessar https://www.saucedemo.com/ e fazer login com `visual_user`
2. Observar a lista de produtos na página `/inventory.html`
3. Comparar o layout com o `standard_user` (referência)

## Resultado Atual

O layout apresenta diversas inconsistências visuais que comprometem a experiência do usuário:

1. **Botões "Add to cart":** Aparecem em posições incorretas — alguns abaixo do preço (correto), outros deslocados para fora do card do produto
2. **Imagens dos produtos:** Algumas imagens têm proporções incorretas (esticadas ou comprimidas) ou estão desalinhadas dentro do card
3. **Elementos do cabeçalho:** O logo e os ícones de navegação podem estar com estilos inconsistentes (tamanho, posicionamento)
4. **Grid de produtos:** O alinhamento das colunas pode estar quebrado, com cards de alturas diferentes sem padding consistente

## Resultado Esperado

O layout deve ser idêntico ao do `standard_user`:
- Cards de produto com altura uniforme
- Botões "Add to cart" na posição padrão (abaixo do preço, dentro do card)
- Imagens proporcionais e centralizadas
- Cabeçalho com logo e ícones alinhados corretamente

## Evidência

- **Screenshot:** `manual/evidence/screenshots/BUG-006-visual-user-layout.png`
- **Teste automatizado:** `e2e/tests/problem-users/visual-user.spec.ts` — teste "[BUG-006]"
- **Captura de tela:** Salva automaticamente pelo teste em `manual/evidence/screenshots/`

## Análise Técnica

O `visual_user` parece ter estilos CSS sobrepostos ou classes CSS incorretas aplicadas a elementos específicos. Esses bugs visuais são difíceis de detectar com testes funcionais automatizados — são idealmente detectados com testes de regressão visual (ex: Percy, Applitools) ou testes snapshot que comparam screenshots entre execuções.

## Impacto

**No usuário final:** Experiência de compra degradada visualmente. O usuário pode ter dificuldade em localizar botões deslocados, o que aumenta o tempo de decisão e pode causar frustração.

**No negócio:** Impacto na credibilidade da plataforma — um layout quebrado transmite falta de qualidade e profissionalismo. Pode afetar a confiança do usuário na hora de inserir dados de pagamento.

**Critério de Go/No Go:** Bug de **Média** severidade — o sistema funciona, mas com aparência degradada. Não é bloqueador de release se os fluxos funcionais estiverem corretos, mas deve ser corrigido em sprint próxima. Recomenda-se implementar testes de regressão visual para prevenir regressões futuras.

## Recomendação

Implementar testes de snapshot visual com ferramentas como:
- **Playwright** com `expect(page).toHaveScreenshot()` (nativo)
- **Percy** (integrado ao GitHub Actions)
- **Applitools Eyes** (AI-powered visual testing)

Isso permitiria detectar automaticamente qualquer desvio visual entre deployments.
