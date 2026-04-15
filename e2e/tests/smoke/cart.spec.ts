import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS, PRODUCTS } from '../../support/test-data';

/**
 * Suite de testes smoke para o carrinho de compras.
 *
 * Testa as operações mais básicas: adicionar e remover produto do carrinho.
 * O badge do carrinho é o indicador visual principal dessas ações.
 *
 * Cobertura:
 * 1. Adicionar produto → badge deve mostrar "1"
 * 2. Remover produto → badge deve desaparecer
 */
test.describe('Smoke: Carrinho de Compras', () => {
  // Pré-condição: login realizado antes de cada teste desta suite
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  /**
   * Teste 1: Adicionar um produto deve atualizar o badge do carrinho para "1".
   *
   * O badge é o feedback visual imediato que confirma ao usuário que
   * o produto foi adicionado com sucesso. Sem ele, o usuário não sabe
   * se a ação funcionou.
   */
  test('adicionar produto ao carrinho deve exibir badge com "1"', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // Adiciona a mochila ao carrinho pelo nome do produto
    await inventoryPage.addToCart(PRODUCTS.backpack);

    // Verifica que o badge apareceu e mostra a quantidade correta
    // O texto "1" indica que exatamente 1 produto está no carrinho
    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('1');
  });

  /**
   * Teste 2: Remover o produto deve fazer o badge desaparecer.
   *
   * O SauceDemo remove o badge completamente do DOM quando o carrinho fica vazio,
   * em vez de mostrar "0". Este teste verifica esse comportamento esperado.
   */
  test('remover produto do carrinho deve fazer o badge desaparecer', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // Pré-condição: adiciona o produto para depois removê-lo
    await inventoryPage.addToCart(PRODUCTS.backpack);

    // Confirma que o badge apareceu antes de tentar remover
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');

    // Remove o produto clicando no botão "Remove" que substituiu o "Add to cart"
    await inventoryPage.removeFromCart(PRODUCTS.backpack);

    // Após remover, o badge não deve mais existir no DOM
    // O método retorna null quando o badge está invisível
    const badgeAfterRemoval = await inventoryPage.getCartBadgeCount();
    expect(badgeAfterRemoval).toBeNull();
  });
});
