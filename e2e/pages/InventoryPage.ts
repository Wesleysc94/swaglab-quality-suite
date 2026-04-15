import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object da página de inventário (lista de produtos) do SauceDemo.
 *
 * Esta é a página principal após o login — exibe todos os produtos disponíveis.
 * Encapsula ações como adicionar ao carrinho, ordenar produtos e navegar para o carrinho.
 *
 * Centralizar os seletores aqui facilita manutenção: mudou o DOM? Atualiza só aqui.
 */
export class InventoryPage {
  readonly page: Page;

  // Container que lista todos os produtos da página
  readonly productList: Locator;

  // Cada item individual de produto (contém nome, preço, botão)
  readonly productItems: Locator;

  // Menu de ordenação — permite ordenar por nome ou preço
  readonly sortDropdown: Locator;

  // Ícone do carrinho com o badge de quantidade
  readonly cartIcon: Locator;

  // Badge numérico sobre o ícone do carrinho
  readonly cartBadge: Locator;

  // Menu hambúrguer (canto superior esquerdo) que abre o menu de navegação
  readonly burgerMenu: Locator;

  // Link de logout dentro do menu hambúrguer
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Container principal com todos os produtos listados
    this.productList = page.locator('[data-test="inventory-list"]');

    // Cada item de produto na lista
    this.productItems = page.locator('[data-test="inventory-item"]');

    // Dropdown de ordenação — permite escolher a-z, z-a, menor preço, maior preço
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    // Link do carrinho no cabeçalho
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');

    // Badge que mostra o número de itens no carrinho
    // Aparece somente quando há pelo menos 1 item adicionado
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');

    // Botão hambúrguer que abre o menu lateral
    this.burgerMenu = page.locator('#react-burger-menu-btn');

    // Link de logout que aparece dentro do menu lateral
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  /**
   * Retorna a lista de elementos de produto para inspeção nos testes.
   *
   * Usado para verificar quantos produtos estão visíveis ou inspecionar nomes.
   */
  async getProducts() {
    // Retorna o Locator que aponta para todos os itens de produto
    return this.productItems;
  }

  /**
   * Adiciona um produto ao carrinho pelo nome exato do produto.
   *
   * Usamos getByText para encontrar o item pelo nome, depois sobe no DOM
   * até o container do produto e clica no botão "Add to cart".
   */
  async addToCart(productName: string) {
    // Localiza o item de produto que contém o nome especificado
    const item = this.page.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });

    // Clica no botão de adicionar ao carrinho dentro desse item
    // O botão usa data-test que começa com "add-to-cart" seguido do slug do produto
    await item.locator('[data-test^="add-to-cart"]').click();
  }

  /**
   * Remove um produto do carrinho diretamente pela página de inventário.
   *
   * Após adicionar um produto, o botão "Add to cart" vira "Remove".
   * Este método clica no botão "Remove" do produto especificado.
   */
  async removeFromCart(productName: string) {
    // Localiza o item pelo nome do produto
    const item = this.page.locator('[data-test="inventory-item"]').filter({
      hasText: productName,
    });

    // Clica no botão de remover — data-test começa com "remove-"
    await item.locator('[data-test^="remove"]').click();
  }

  /**
   * Seleciona uma opção de ordenação no dropdown.
   *
   * Opções disponíveis no SauceDemo:
   * - 'az'  → Nome A a Z
   * - 'za'  → Nome Z a A
   * - 'lohi' → Preço: menor para maior
   * - 'hilo' → Preço: maior para menor
   */
  async sortBy(option: string) {
    // Seleciona o valor no dropdown pelo valor interno (não pelo texto visível)
    await this.sortDropdown.selectOption(option);
  }

  /**
   * Retorna o número atual de itens no badge do carrinho como string.
   *
   * Retorna null se o badge não estiver visível (carrinho vazio).
   * Os testes verificam se o valor é "1", "2", etc.
   */
  async getCartBadgeCount(): Promise<string | null> {
    // Verifica se o badge está visível antes de tentar ler o texto
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return null;

    // Retorna o texto do badge (ex: "1", "2", "3")
    return await this.cartBadge.textContent();
  }

  /**
   * Clica no ícone do carrinho para navegar até a página de carrinho.
   */
  async openCart() {
    await this.cartIcon.click();
  }

  /**
   * Faz logout do usuário atual.
   *
   * O fluxo é: abrir o menu hambúrguer, aguardar o link aparecer e clicar em logout.
   * O menu tem animação, então precisamos esperar o link ficar visível.
   */
  async logout() {
    // Abre o menu lateral clicando no botão hambúrguer
    await this.burgerMenu.click();

    // Aguarda o link de logout ficar visível (menu tem animação CSS)
    await this.logoutLink.waitFor({ state: 'visible' });

    // Clica no link de logout para encerrar a sessão
    await this.logoutLink.click();
  }

  /**
   * Verifica se a página de inventário está carregada corretamente.
   * Confirma que a URL contém /inventory.html e a lista de produtos está visível.
   */
  async expectLoaded() {
    // Verifica que a URL indica que estamos na página de inventário
    await expect(this.page).toHaveURL(/inventory\.html/);

    // Verifica que a lista de produtos está visível
    await expect(this.productList).toBeVisible();
  }
}
