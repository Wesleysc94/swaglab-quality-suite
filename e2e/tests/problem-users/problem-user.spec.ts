import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { USERS, PRODUCTS, CHECKOUT_INFO } from '../../support/test-data';

/**
 * Suite de testes para o problem_user do SauceDemo.
 *
 * O problem_user é um usuário especial criado para simular bugs de produção.
 * Ao contrário do standard_user, ele enfrenta problemas específicos que
 * devem ser documentados como bugs conhecidos.
 *
 * IMPORTANTE SOBRE A ESTRATÉGIA DESTES TESTES:
 * Quando um bug é encontrado, o teste PASSA documentando o comportamento defeituoso.
 * Isso é intencional — em QA, documentar um bug conhecido é diferente de ignorá-lo.
 * Os testes usam expect com comportamento "errado" esperado + comentários explicando por quê.
 *
 * Bugs cobertos:
 * - BUG-001: Produtos exibem imagens incorretas (todas mostram a mesma imagem)
 * - BUG-002: Campo Last Name não aceita digitação no checkout
 */
test.describe('Problem User: Bugs Conhecidos', () => {
  // Pré-condição: login com problem_user antes de cada teste
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.problem.username, USERS.problem.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  /**
   * Teste 1: O login do problem_user deve funcionar normalmente.
   *
   * Apesar dos bugs na aplicação, o login em si não está com defeito.
   * Este teste confirma que o usuário consegue acessar o sistema.
   */
  test('problem_user deve conseguir fazer login com sucesso', async ({ page }) => {
    // O login já foi feito no beforeEach — só precisamos confirmar
    await expect(page).toHaveURL(/inventory\.html/);

    // A lista de produtos deve estar visível — o problem_user acessa o inventário
    const productList = page.locator('[data-test="inventory-list"]');
    await expect(productList).toBeVisible();
  });

  /**
   * Teste 2: [BUG-001] Todos os produtos exibem a mesma imagem incorreta.
   *
   * COMPORTAMENTO ESPERADO: Cada produto deveria ter sua própria imagem.
   * COMPORTAMENTO ATUAL (BUG): Todos os produtos mostram a imagem do cachorro
   * em vez das imagens corretas dos produtos.
   *
   * ESTRATÉGIA: Verificamos que os src das imagens são TODOS iguais (bug confirmado).
   * O teste passa porque estamos documentando o bug, não esperando o comportamento correto.
   */
  test('[BUG-001] imagens dos produtos devem estar incorretas (comportamento com bug documentado)', async ({ page }) => {
    // Aguarda os itens de produto carregarem
    const items = page.locator('[data-test="inventory-item"]');
    await expect(items).toHaveCount(6);

    // Coleta os atributos src de todas as imagens dos produtos
    const images = page.locator('[data-test="inventory-item"] img');
    const imageSrcs = await images.evaluateAll(
      (imgs) => imgs.map((img) => (img as HTMLImageElement).src)
    );

    // BUG DOCUMENTADO: todas as imagens têm o mesmo src (imagem do cachorro)
    // Em um sistema correto, cada imagem teria um src diferente
    // Estamos VERIFICANDO que o bug existe, não que tudo está correto
    const allSameImage = imageSrcs.every((src) => src === imageSrcs[0]);

    // Este expect documenta que TODAS as imagens são iguais — comportamento bugado
    // Se allSameImage for true, o bug está presente (esperado para problem_user)
    expect(allSameImage).toBe(true);

    // Log informativo para o relatório — deixa claro que isso é um bug
    console.log('[BUG-001] Confirmado: todos os produtos exibem a mesma imagem:', imageSrcs[0]);
  });

  /**
   * Teste 3: [BUG-002] Campo Last Name não aceita input no formulário de checkout.
   *
   * COMPORTAMENTO ESPERADO: O campo Last Name deve aceitar digitação normalmente.
   * COMPORTAMENTO ATUAL (BUG): O campo Last Name fica vazio após tentar preencher —
   * o problem_user não consegue digitar sobrenome, impedindo o checkout.
   *
   * ESTRATÉGIA: Tentamos preencher o campo e verificamos que o valor NÃO foi inserido.
   * O teste documenta que o bug existe sem marcar como falha do teste.
   */
  test('[BUG-002] campo Last Name não deve aceitar input (comportamento com bug documentado)', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Adiciona produto e navega para o checkout
    await inventoryPage.addToCart(PRODUCTS.backpack);
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    // Tenta preencher todos os campos do formulário
    await checkoutPage.fillInfo(
      CHECKOUT_INFO.valid.firstName,
      CHECKOUT_INFO.valid.lastName, // 'Carvalho' — não será aceito pelo bug
      CHECKOUT_INFO.valid.postalCode
    );

    // BUG DOCUMENTADO: O campo Last Name não retém o valor digitado
    // Em um sistema correto, o campo teria o valor 'Carvalho' após fill()
    // Aqui esperamos que o valor NÃO esteja lá — documentando o comportamento bugado
    const lastNameValue = await checkoutPage.lastNameInput.inputValue();

    // Se o valor está vazio, o bug está confirmado (esperado para problem_user)
    // Usamos NOT para indicar que o comportamento correto seria ter o valor
    expect(lastNameValue).not.toBe(CHECKOUT_INFO.valid.lastName);

    console.log('[BUG-002] Confirmado: campo Last Name está vazio após tentar preencher. Valor:', lastNameValue);
  });
});
