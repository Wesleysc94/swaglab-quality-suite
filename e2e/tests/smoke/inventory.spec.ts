import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS, PRODUCTS } from '../../support/test-data';

/**
 * Suite de testes smoke para a página de inventário.
 *
 * Verifica que os produtos são exibidos corretamente, que a ordenação funciona
 * e que é possível acessar os detalhes de um produto.
 *
 * Cobertura:
 * 1. Verificação de quantidade de produtos (deve ter 6)
 * 2. Ordenação por preço crescente
 * 3. Navegação para o detalhe de um produto
 */
test.describe('Smoke: Inventário de Produtos', () => {
  // Hook que executa antes de cada teste desta suite
  // Faz o login para que os testes comecem já na página de inventário
  test.beforeEach(async ({ page }) => {
    // Pré-condição comum: todos os testes de inventário requerem usuário logado
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    // Aguarda a confirmação de que o login foi bem-sucedido
    await expect(page).toHaveURL(/inventory\.html/);
  });

  /**
   * Teste 1: A página de inventário deve exibir exatamente 6 produtos.
   *
   * O SauceDemo tem um catálogo fixo de 6 produtos. Este teste garante
   * que todos são carregados corretamente sem falhas de renderização.
   */
  test('deve exibir 6 produtos no inventário', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // Obtém o Locator que aponta para todos os itens de produto
    const products = await inventoryPage.getProducts();

    // Verifica que exatamente 6 produtos estão presentes na página
    // O SauceDemo sempre exibe os 6 produtos do catálogo completo
    await expect(products).toHaveCount(6);
  });

  /**
   * Teste 2: Ordenar por preço crescente deve colocar o produto mais barato primeiro.
   *
   * O produto mais barato do catálogo é o Sauce Labs Onesie ($7.99).
   * Após ordenar por 'lohi' (low to high), ele deve ser o primeiro da lista.
   */
  test('ordenar por preço crescente deve mostrar o produto mais barato primeiro', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    // Aplica a ordenação por preço do menor para o maior
    // O valor 'lohi' é o value interno do option no select do SauceDemo
    await inventoryPage.sortBy('lohi');

    // Captura o nome do primeiro produto após a ordenação
    const firstProductName = await page
      .locator('[data-test="inventory-item-name"]')
      .first()
      .textContent();

    // O Sauce Labs Onesie tem o menor preço ($7.99) e deve aparecer primeiro
    expect(firstProductName).toContain('Sauce Labs Onesie');
  });

  /**
   * Teste 3: Clicar em um produto deve navegar para a página de detalhes.
   *
   * Verifica que o usuário consegue acessar informações detalhadas de cada produto.
   * Confirma que o nome e o preço são exibidos corretamente na página de detalhe.
   */
  test('clicar em produto deve abrir a página de detalhes com nome e preço', async ({ page }) => {
    // Clica no nome do produto Backpack para abrir seus detalhes
    await page.locator('[data-test="item-4-title-link"]').click();

    // Confirma que a URL mudou para a página de detalhe do produto
    // O SauceDemo usa IDs numéricos para os produtos (ex: ?id=4)
    await expect(page).toHaveURL(/inventory-item\.html/);

    // Verifica que o nome correto do produto está visível na página de detalhe
    const productName = page.locator('[data-test="inventory-item-name"]');
    await expect(productName).toContainText(PRODUCTS.backpack);

    // Verifica que o preço está visível — o preço da mochila é $29.99
    const productPrice = page.locator('[data-test="inventory-item-price"]');
    await expect(productPrice).toContainText('$29.99');
  });
});
