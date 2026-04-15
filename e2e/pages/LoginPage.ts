import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object da página de login do SauceDemo.
 *
 * Encapsula todos os seletores e ações relacionados ao login.
 * Os testes chamam métodos como login() em vez de interagir
 * diretamente com os elementos da página.
 *
 * Benefício do POM: se o SauceDemo mudar o seletor do botão de login,
 * basta atualizar aqui — todos os testes continuam funcionando sem mudança.
 */
export class LoginPage {
  // Referência à instância da página do Playwright
  readonly page: Page;

  // Seletores declarados como propriedades readonly para imutabilidade
  // Usamos data-test porque são atributos criados especificamente para testes,
  // mais estáveis que classes CSS que podem mudar com redesigns
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Cada seletor usa o atributo data-test do SauceDemo
    // Isso é uma boa prática porque data-test não muda com refatoração de CSS
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');

    // A mensagem de erro aparece quando login falha (usuário inválido, bloqueado, etc.)
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Navega para a página de login do SauceDemo.
   * Usamos '/' porque o baseURL já está configurado em playwright.config.ts,
   * então o Playwright monta a URL completa automaticamente.
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Realiza o login com as credenciais fornecidas.
   *
   * Este método é reutilizado em praticamente todos os testes como pré-condição.
   * Centralizar aqui garante que uma mudança no fluxo de login seja feita em um lugar.
   */
  async login(username: string, password: string) {
    // Preenche o campo de usuário com o valor recebido como parâmetro
    await this.usernameInput.fill(username);

    // Preenche a senha — fill() limpa o campo antes de digitar, evitando concatenação
    await this.passwordInput.fill(password);

    // Clica no botão de login para submeter o formulário
    await this.loginButton.click();
  }

  /**
   * Verifica se a mensagem de erro está visível e contém o texto esperado.
   *
   * Usado nos testes negativos para confirmar que o sistema rejeita
   * credenciais inválidas ou usuários bloqueados com a mensagem correta.
   */
  async expectError(message: string) {
    // Confirma que o elemento de erro está visível na tela
    await expect(this.errorMessage).toBeVisible();

    // Verifica se a mensagem contém o texto esperado (não precisa ser exato)
    // toContainText é mais resiliente que toHaveText porque ignora espaços extras
    await expect(this.errorMessage).toContainText(message);
  }
}
