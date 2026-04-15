import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object da página de conclusão do checkout do SauceDemo.
 *
 * Após clicar em "Finish" na etapa 2, o usuário é redirecionado para
 * /checkout-complete.html com uma mensagem de sucesso.
 *
 * Esta página confirma que o pedido foi realizado com sucesso.
 */
export class CompletePage {
  readonly page: Page;

  // Título de conclusão — exibe "Thank you for your order!"
  readonly completeHeader: Locator;

  // Texto adicional de confirmação abaixo do título
  readonly completeText: Locator;

  // Botão "Back Home" que retorna o usuário ao inventário
  readonly backHomeButton: Locator;

  // Imagem do cachorro Pony Express (mascote de confirmação do SauceDemo)
  readonly completePonyImage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Título "Thank you for your order!" na página de conclusão
    this.completeHeader = page.locator('[data-test="complete-header"]');

    // Texto de confirmação abaixo do título
    this.completeText = page.locator('[data-test="complete-text"]');

    // Botão para voltar à lista de produtos
    this.backHomeButton = page.locator('[data-test="back-to-products"]');

    // Imagem de confirmação (Pony Express) — confirma que o pedido foi aceito
    this.completePonyImage = page.locator('[data-test="pony-express"]');
  }

  /**
   * Verifica que a página de conclusão está exibida corretamente.
   *
   * Confirma três elementos essenciais:
   * 1. URL correta da página
   * 2. Título de agradecimento visível
   * 3. Texto de confirmação presente
   *
   * Esta verificação é o ponto final do fluxo happy-path de checkout.
   */
  async expectSuccess() {
    // Confirma que estamos na página de conclusão do checkout
    await expect(this.page).toHaveURL(/checkout-complete\.html/);

    // O título deve conter "Thank you" — confirmação de sucesso
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toContainText('Thank you for your order');

    // O texto de detalhes também deve estar visível
    await expect(this.completeText).toBeVisible();
  }

  /**
   * Clica no botão "Back Home" para retornar ao inventário.
   *
   * Usado para verificar que o usuário pode continuar comprando
   * após concluir um pedido.
   */
  async backHome() {
    await this.backHomeButton.click();
  }
}
