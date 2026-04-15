import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { USERS, PRODUCTS, ERROR_MESSAGES } from '../../support/test-data';

/**
 * Suite de testes negativos para o fluxo de checkout.
 *
 * Verifica que o formulário de checkout valida corretamente os campos obrigatórios.
 * Um formulário sem validação permitiria pedidos incompletos, causando problemas
 * operacionais (ex: não saber para onde enviar o produto).
 *
 * Cobertura:
 * 1. Checkout com todos os campos vazios → mensagem de erro no primeiro campo
 * 2. Checkout com apenas o primeiro nome preenchido → erro no campo faltante
 */
test.describe('Negativo: Erros de Checkout', () => {
  // Pré-condição: para cada teste, fazer login e navegar até o formulário de checkout
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    // Faz login com o usuário padrão
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);

    // Adiciona um produto ao carrinho e navega até o formulário de checkout
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    // Confirma que chegou na etapa 1 do checkout
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  /**
   * Teste 1: Checkout sem preencher nenhum campo deve exibir erro de validação.
   *
   * Todos os três campos são obrigatórios. Clicar em Continue sem preencher
   * nada deve mostrar um erro pedindo o primeiro campo obrigatório.
   * O SauceDemo valida um campo por vez (não todos de uma vez).
   */
  test('checkout sem preencher campos deve exibir mensagem de erro', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Tenta avançar sem preencher nenhum campo obrigatório
    await checkoutPage.continue();

    // O sistema deve mostrar erro pedindo o primeiro campo: First Name
    // O SauceDemo valida na ordem: First Name → Last Name → Postal Code
    await checkoutPage.expectError(ERROR_MESSAGES.firstNameRequired);

    // Confirma que a URL não mudou — o formulário não foi submetido
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  /**
   * Teste 2: Preencher apenas um campo deve indicar qual campo está faltando.
   *
   * Preencher o First Name mas deixar os demais vazios deve mostrar
   * o erro do próximo campo obrigatório (Last Name).
   * Isso testa a validação sequencial dos campos do formulário.
   */
  test('checkout com apenas um campo preenchido deve indicar campos faltantes', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Preenche apenas o primeiro nome, deixando os outros dois campos vazios
    await checkoutPage.fillInfo('Wesley', '', '');

    // Tenta avançar para a próxima etapa
    await checkoutPage.continue();

    // O sistema deve reclamar do próximo campo obrigatório: Last Name
    await checkoutPage.expectError(ERROR_MESSAGES.lastNameRequired);

    // Confirma que ainda está na etapa 1 — a navegação foi bloqueada
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});
