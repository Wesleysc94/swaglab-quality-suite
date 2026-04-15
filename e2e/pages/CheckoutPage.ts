import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object das páginas de checkout do SauceDemo.
 *
 * O checkout do SauceDemo é dividido em etapas:
 * - Etapa 1 (/checkout-step-one.html): formulário com nome, sobrenome e CEP
 * - Etapa 2 (/checkout-step-two.html): resumo do pedido com botão "Finish"
 *
 * Este Page Object cobre ambas as etapas, pois são parte do mesmo fluxo.
 */
export class CheckoutPage {
  readonly page: Page;

  // Campo de primeiro nome (etapa 1)
  readonly firstNameInput: Locator;

  // Campo de sobrenome (etapa 1)
  readonly lastNameInput: Locator;

  // Campo de CEP/código postal (etapa 1)
  readonly postalCodeInput: Locator;

  // Botão "Continue" que avança da etapa 1 para a etapa 2
  readonly continueButton: Locator;

  // Botão "Finish" que finaliza a compra (etapa 2)
  readonly finishButton: Locator;

  // Mensagem de erro exibida quando campos obrigatórios não são preenchidos
  readonly errorMessage: Locator;

  // Container do resumo do pedido (etapa 2) — exibe itens, preços e totais
  readonly summaryContainer: Locator;

  constructor(page: Page) {
    this.page = page;

    // Campos do formulário de informações de entrega (etapa 1)
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');

    // Botão para avançar da etapa 1 para o resumo (etapa 2)
    this.continueButton = page.locator('[data-test="continue"]');

    // Botão para confirmar e finalizar a compra (etapa 2)
    this.finishButton = page.locator('[data-test="finish"]');

    // Mensagem de erro que aparece quando campos obrigatórios estão vazios
    this.errorMessage = page.locator('[data-test="error"]');

    // Container com os itens do pedido na etapa de revisão
    this.summaryContainer = page.locator('[data-test="checkout-summary-container"]');
  }

  /**
   * Preenche o formulário de informações de entrega (etapa 1).
   *
   * Todos os três campos são obrigatórios. Se algum estiver vazio,
   * o sistema exibe uma mensagem de erro ao clicar em Continue.
   */
  async fillInfo(first: string, last: string, zip: string) {
    // Preenche o primeiro nome
    await this.firstNameInput.fill(first);

    // Preenche o sobrenome
    await this.lastNameInput.fill(last);

    // Preenche o CEP — o SauceDemo aceita qualquer formato, não valida o padrão
    await this.postalCodeInput.fill(zip);
  }

  /**
   * Clica no botão Continue para avançar para a etapa de revisão.
   *
   * Se os campos não estiverem preenchidos, a navegação não ocorre
   * e uma mensagem de erro é exibida no lugar.
   */
  async continue() {
    await this.continueButton.click();
  }

  /**
   * Clica no botão Finish para confirmar e finalizar a compra.
   *
   * Este botão só aparece na etapa 2 (revisão do pedido).
   * Após clicar, o sistema redireciona para a página de confirmação.
   */
  async finish() {
    await this.finishButton.click();
  }

  /**
   * Verifica se uma mensagem de erro está visível com o texto esperado.
   *
   * Usado nos testes de checkout com campos vazios ou inválidos.
   */
  async expectError(message: string) {
    // Confirma que o elemento de erro está visível antes de verificar o texto
    await expect(this.errorMessage).toBeVisible();

    // Verifica se o texto de erro contém a mensagem esperada
    await expect(this.errorMessage).toContainText(message);
  }

  /**
   * Verifica se a etapa 1 do checkout está carregada.
   */
  async expectStepOneLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
    await expect(this.firstNameInput).toBeVisible();
  }

  /**
   * Verifica se a etapa 2 (revisão) está carregada.
   */
  async expectStepTwoLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.summaryContainer).toBeVisible();
  }
}
