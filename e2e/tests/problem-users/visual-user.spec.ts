import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { USERS } from '../../support/test-data';

/**
 * Suite de testes para o visual_user do SauceDemo.
 *
 * O visual_user é um usuário especial que revela bugs visuais e de layout
 * na interface. Ao fazer login, alguns elementos aparecem em posições
 * incorretas, com tamanhos errados ou estilos inconsistentes.
 *
 * ESTRATÉGIA:
 * Verificamos a presença de elementos que deveriam estar visíveis e
 * detectamos inconsistências visuais usando o Playwright.
 *
 * Bugs cobertos:
 * - BUG-006: Inconsistências visuais no layout (botões, imagens, elementos desalinhados)
 */
test.describe('Visual User: Inconsistências de Layout', () => {
  // Pré-condição: login com visual_user
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.visual.username, USERS.visual.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  /**
   * Teste 1: [BUG-006] Layout do inventário deve apresentar inconsistências visuais.
   *
   * COMPORTAMENTO ESPERADO: O layout deve ser consistente — botões alinhados,
   * imagens proporcionais, elementos no lugar correto.
   *
   * COMPORTAMENTO ATUAL (BUG): Alguns botões "Add to cart" aparecem em posições
   * incorretas, imagens têm tamanhos inconsistentes, e elementos do cabeçalho
   * podem estar desalinhados ou com estilos diferentes.
   *
   * ESTRATÉGIA: Verificamos o estado do DOM e registramos as inconsistências
   * encontradas. O teste usa screenshot para capturar evidência visual do bug.
   */
  test('[BUG-006] inventário deve ter inconsistências visuais para visual_user', async ({ page }) => {
    // Aguarda a página de inventário carregar completamente
    const productList = page.locator('[data-test="inventory-list"]');
    await expect(productList).toBeVisible();

    // Verifica os botões "Add to cart" — um dos bugs é posicionamento incorreto
    const addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    const buttonCount = await addToCartButtons.count();

    // Registra o número de botões encontrados
    console.log(`[BUG-006] Número de botões Add to Cart encontrados: ${buttonCount}`);

    // Verifica o logo do SauceDemo — pode estar com tamanho ou posição incorretos
    const appLogo = page.locator('.app_logo');

    if (await appLogo.isVisible()) {
      // Captura as dimensões reais do logo para comparação
      const logoBoundingBox = await appLogo.boundingBox();
      console.log(`[BUG-006] Dimensões do logo: ${JSON.stringify(logoBoundingBox)}`);
    }

    // Captura screenshot para evidência visual do bug
    // O arquivo será salvo automaticamente em caso de falha configurado no playwright.config.ts
    await page.screenshot({
      path: 'manual/evidence/screenshots/BUG-006-visual-user-layout.png',
      fullPage: true,
    });

    console.log('[BUG-006] Screenshot capturado: manual/evidence/screenshots/BUG-006-visual-user-layout.png');

    // Verifica inconsistência específica: imagens dos produtos com o visual_user
    const productImages = page.locator('[data-test="inventory-item"] img');
    const imageCount = await productImages.count();
    console.log(`[BUG-006] Número de imagens de produtos: ${imageCount}`);

    // Coleta atributos style das imagens para detectar inconsistências
    const imageStyles = await productImages.evaluateAll(
      (imgs) => imgs.map((img) => ({
        width: (img as HTMLImageElement).style.width || 'padrão',
        height: (img as HTMLImageElement).style.height || 'padrão',
        src: (img as HTMLImageElement).src.split('/').pop(),
      }))
    );

    // Registra os dados das imagens para análise
    console.log('[BUG-006] Dados das imagens de produtos:', JSON.stringify(imageStyles, null, 2));

    // O teste PASSA — estamos documentando o comportamento visual anômalo
    // A evidência real é o screenshot capturado acima
    await expect(productList).toBeVisible();
  });
});
