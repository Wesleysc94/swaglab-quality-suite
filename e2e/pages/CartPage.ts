import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object da página de carrinho do SauceDemo (/cart.html).
 *
 * O carrinho exibe os produtos adicionados, permite removê-los,
 * voltar às compras ou avançar para o checkout.
 *
 * Encapsular essa página em um Page Object isola os testes das mudanças de DOM.
 */
export class CartPage {
  readonly page: Page;

  // Container que lista todos os itens presentes no carrinho
  readonly cartItems: Locator;

  // Botão para voltar ao inventário sem fazer checkout
  readonly continueShoppingButton: Locator;

  // Botão para avançar para o formulário de checkout
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Cada item no carrinho tem este atributo data-test
    this.cartItems = page.locator('[data-test="cart-item"]');

    // Botão "Continue Shopping" — volta para /inventory.html
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');

    // Botão "Checkout" — avança para o formulário de dados pessoais
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  /**
   * Retorna o Locator com todos os itens do carrinho.
   *
   * Os testes usam isso para contar itens ou verificar nomes/preços.
   */
  async getItems() {
    return this.cartItems;
  }

  /**
   * Remove um item do carrinho pelo nome do produto.
   *
   * Localiza o item pelo texto do nome e clica no botão "Remove" dentro dele.
   * Útil para testar que a remoção funciona corretamente no carrinho.
   */
  async removeItem(name: string) {
    // Filtra o item cujo texto contém o nome do produto
    const item = this.cartItems.filter({ hasText: name });

    // Clica no botão de remover dentro desse item específico
    await item.locator('[data-test^="remove"]').click();
  }

  /**
   * Clica em "Continue Shopping" para voltar ao inventário.
   *
   * Usado quando o usuário quer adicionar mais itens sem finalizar a compra.
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  /**
   * Avança para a etapa de checkout clicando no botão "Checkout".
   *
   * Direciona para /checkout-step-one.html onde o usuário preenche
   * nome, sobrenome e CEP.
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Verifica se a página do carrinho está carregada.
   * Confirma URL e presença do botão de checkout.
   */
  async expectLoaded() {
    // Confirma que estamos na página correta
    await expect(this.page).toHaveURL(/cart\.html/);

    // O botão de checkout deve estar visível para o usuário prosseguir
    await expect(this.checkoutButton).toBeVisible();
  }
}
