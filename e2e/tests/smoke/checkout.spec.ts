import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { CompletePage } from '../../pages/CompletePage';
import { USERS, PRODUCTS, CHECKOUT_INFO } from '../../support/test-data';

/**
 * Suite de testes smoke para o fluxo completo de checkout.
 *
 * O checkout é o fluxo mais crítico de um e-commerce — é onde acontece
 * a conversão. Estes testes cobrem o caminho feliz completo e a revisão
 * do pedido antes da confirmação.
 *
 * Cobertura:
 * 1. Checkout completo do início ao fim → mensagem de sucesso
 * 2. Verificação do resumo do pedido antes de finalizar
 * 3. Retorno ao inventário após concluir a compra
 */
test.describe('Smoke: Checkout Completo', () => {
  // Pré-condição: login com usuário padrão antes de cada teste
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  /**
   * Teste 1: Fluxo completo de checkout deve exibir confirmação de pedido.
   *
   * Este é o teste mais importante do e-commerce: confirma que o usuário
   * consegue comprar um produto do início ao fim sem erros.
   *
   * Fluxo: Inventário → Adicionar → Carrinho → Checkout Info → Revisão → Confirmar
   */
  test('checkout completo deve exibir mensagem de sucesso', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const completePage = new CompletePage(page);

    // ETAPA 1: Adiciona produto ao carrinho no inventário
    await inventoryPage.addToCart(PRODUCTS.backpack);

    // ETAPA 2: Navega para o carrinho
    await inventoryPage.openCart();
    await cartPage.expectLoaded();

    // ETAPA 3: Inicia o checkout a partir do carrinho
    await cartPage.proceedToCheckout();
    await checkoutPage.expectStepOneLoaded();

    // ETAPA 4: Preenche os dados de entrega com informações válidas
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode
    );

    // Avança para a etapa de revisão do pedido
    await checkoutPage.continue();
    await checkoutPage.expectStepTwoLoaded();

    // ETAPA 5: Finaliza a compra
    await checkoutPage.finish();

    // Verifica a mensagem de confirmação — o pedido foi realizado com sucesso
    await completePage.expectSuccess();
  });

  /**
   * Teste 2: A revisão do pedido deve exibir o produto correto com o preço correto.
   *
   * Antes de finalizar, o usuário deve poder revisar o que está comprando.
   * Este teste confirma que o nome do produto e o preço são exibidos corretamente
   * na etapa de revisão (checkout step 2).
   */
  test('revisão do pedido deve exibir nome e preço do produto corretos', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Adiciona o produto e navega até a etapa de revisão
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    // Preenche dados e avança para a revisão
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode
    );
    await checkoutPage.continue();

    // Verifica que o nome do produto está correto na revisão
    const itemName = page.locator('[data-test="inventory-item-name"]');
    await expect(itemName).toContainText(PRODUCTS.backpack);

    // Verifica que o preço está correto — mochila custa $29.99
    const itemPrice = page.locator('[data-test="inventory-item-price"]');
    await expect(itemPrice).toContainText('$29.99');
  });

  /**
   * Teste 3: Clicar em "Back Home" após checkout deve retornar ao inventário.
   *
   * Após concluir uma compra, o usuário deve poder continuar navegando
   * pelo catálogo. Este teste confirma que o botão "Back Home" funciona.
   */
  test('voltar ao início após checkout deve exibir o inventário', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    const completePage = new CompletePage(page);

    // Fluxo completo de compra
    await inventoryPage.addToCart(PRODUCTS.bikeLight);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName,
      CHECKOUT_INFO.valid.postalCode
    );
    await checkoutPage.continue();
    await checkoutPage.finish();

    // Confirma que chegou na página de conclusão
    await completePage.expectSuccess();

    // Clica em "Back Home" para retornar ao inventário
    await completePage.backHome();

    // Verifica que voltou ao inventário — o usuário pode continuar comprando
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
