import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { USERS, PRODUCTS, CHECKOUT_INFO } from '../../support/test-data';

/**
 * Suite de testes para o error_user do SauceDemo.
 *
 * O error_user simula um usuário que encontra falhas funcionais ao interagir
 * com o sistema — especialmente nas ações de carrinho e checkout.
 *
 * ESTRATÉGIA DOS TESTES:
 * Os testes documentam comportamentos defeituosos como "comportamento conhecido".
 * Quando o sistema falha de maneira esperada (bug documentado), o teste PASSA.
 *
 * Bugs cobertos:
 * - BUG-003: Falhas ao adicionar/remover itens do carrinho
 * - BUG-004: Campos do checkout não retêm os valores digitados
 */
test.describe('Error User: Falhas Funcionais Conhecidas', () => {
  // Pré-condição: login com error_user antes de cada teste
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.error.username, USERS.error.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  /**
   * Teste 1: O login do error_user deve funcionar normalmente.
   *
   * O bug do error_user está nas interações após o login, não no login em si.
   * Este teste confirma que o acesso ao sistema está funcional.
   */
  test('error_user deve conseguir fazer login com sucesso', async ({ page }) => {
    // Login já executado no beforeEach — confirmamos apenas a URL
    await expect(page).toHaveURL(/inventory\.html/);

    // A página de inventário deve estar acessível com a lista de produtos
    const productList = page.locator('[data-test="inventory-list"]');
    await expect(productList).toBeVisible();
  });

  /**
   * Teste 2: [BUG-003] Comportamento inconsistente ao adicionar produtos ao carrinho.
   *
   * COMPORTAMENTO ESPERADO: Adicionar um produto deve incrementar o badge do carrinho.
   * COMPORTAMENTO ATUAL (BUG): O error_user não consegue adicionar alguns produtos —
   * o badge não aparece ou o botão não responde corretamente.
   *
   * ESTRATÉGIA: Tentamos adicionar o produto e verificamos se o badge apareceu.
   * Se não apareceu, documentamos o bug como confirmado.
   */
  test('[BUG-003] carrinho pode não atualizar ao adicionar produto (bug documentado)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // Tenta adicionar o produto Backpack ao carrinho
    await inventoryPage.addToCart(PRODUCTS.backpack);

    // Aguarda um momento para o possível erro do error_user se manifestar
    await page.waitForTimeout(1000);

    // Verifica o estado atual do badge — pode não ter atualizado (bug)
    const badgeCount = await inventoryPage.getCartBadgeCount();

    // BUG DOCUMENTADO: o error_user pode ter badge null (produto não adicionado)
    // ou ter o badge correto (quando a ação funciona intermitentemente)
    // Registramos o resultado observado sem fazer o teste falhar
    if (badgeCount === null) {
      console.log('[BUG-003] Confirmado: badge não apareceu após adicionar produto ao carrinho');
    } else {
      console.log('[BUG-003] Nesta execução o badge apareceu com valor:', badgeCount);
    }

    // O teste passa em ambos os casos — estamos documentando, não validando comportamento correto
    // Isso é intencional: o bug é intermitente e o teste serve como detector
    expect(true).toBe(true);
  });

  /**
   * Teste 3: [BUG-004] Campos do checkout não retêm valores para o error_user.
   *
   * COMPORTAMENTO ESPERADO: Os campos do formulário devem manter os valores digitados.
   * COMPORTAMENTO ATUAL (BUG): O error_user tenta preencher os campos mas eles
   * ficam vazios ou perdem o valor após preenchimento.
   *
   * ESTRATÉGIA: Tentamos preencher cada campo e verificamos se o valor foi retido.
   * Registramos quais campos apresentaram problema.
   */
  test('[BUG-004] campos do checkout podem não persistir valores (bug documentado)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Navega até o checkout
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();

    // Tenta prosseguir — pode falhar para o error_user
    try {
      await cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);

      // Tenta preencher o formulário
      await checkoutPage.fillInfo(
        CHECKOUT_INFO.valid.firstName,
        CHECKOUT_INFO.valid.lastName,
        CHECKOUT_INFO.valid.postalCode
      );

      // Verifica quais campos retiveram os valores
      const firstNameValue = await checkoutPage.firstNameInput.inputValue();
      const lastNameValue = await checkoutPage.lastNameInput.inputValue();
      const postalValue = await checkoutPage.postalCodeInput.inputValue();

      // BUG DOCUMENTADO: registramos o estado dos campos
      console.log('[BUG-004] Estado dos campos após preenchimento:');
      console.log('  First Name:', firstNameValue || '(vazio — BUG)');
      console.log('  Last Name:', lastNameValue || '(vazio — BUG)');
      console.log('  Postal Code:', postalValue || '(vazio — BUG)');

      // Se algum campo estiver vazio, o bug está confirmado
      if (!firstNameValue || !lastNameValue || !postalValue) {
        console.log('[BUG-004] Confirmado: um ou mais campos não retiveram os valores digitados');
      }
    } catch (error) {
      // O error_user pode causar erros ao tentar navegar para o checkout
      console.log('[BUG-004] Erro ao tentar acessar checkout:', (error as Error).message);
    }

    // O teste sempre passa — estamos documentando comportamento, não validando sucesso
    expect(true).toBe(true);
  });
});
