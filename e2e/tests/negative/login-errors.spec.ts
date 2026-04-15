import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { USERS, ERROR_MESSAGES } from '../../support/test-data';

/**
 * Suite de testes negativos para o fluxo de login.
 *
 * Testes negativos verificam como o sistema se comporta com entradas inválidas.
 * São tão importantes quanto os testes positivos — um sistema robusto deve
 * rejeitar tentativas inválidas com mensagens claras e sem expor informações.
 *
 * Cobertura:
 * 1. Credenciais inválidas → mensagem de erro genérica (não deve indicar qual campo falhou)
 * 2. Usuário bloqueado → mensagem específica de bloqueio
 * 3. Acesso direto a URL protegida sem login → redirecionamento para login
 */
test.describe('Negativo: Erros de Login', () => {
  /**
   * Teste 1: Login com credenciais inválidas deve exibir mensagem de erro.
   *
   * O sistema não deve revelar se o usuário existe ou não — isso seria
   * uma vulnerabilidade de enumeração. A mensagem deve ser genérica.
   */
  test('credenciais inválidas devem exibir mensagem de erro', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Tenta login com usuário e senha que não existem no sistema
    await loginPage.login(USERS.invalid.username, USERS.invalid.password);

    // Verifica que a mensagem de erro é exibida com o texto correto
    // A mensagem não deve ser vaga demais ("erro") nem específica demais ("usuário não existe")
    await loginPage.expectError(ERROR_MESSAGES.invalidCredentials);
  });

  /**
   * Teste 2: Usuário bloqueado deve ver mensagem específica de bloqueio.
   *
   * O locked_out_user existe no sistema mas foi bloqueado pelo administrador.
   * O sistema deve diferenciar "credenciais erradas" de "usuário bloqueado"
   * para que o suporte saiba o motivo do problema.
   */
  test('usuário bloqueado deve receber mensagem de conta bloqueada', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Usa credenciais do usuário bloqueado — senha correta mas acesso negado
    await loginPage.login(USERS.locked.username, USERS.locked.password);

    // A mensagem deve informar especificamente que o usuário está bloqueado
    await loginPage.expectError(ERROR_MESSAGES.lockedOut);
  });

  /**
   * Teste 3: Acessar /inventory.html sem estar logado deve redirecionar para login.
   *
   * Este é um teste de segurança básico — páginas protegidas não devem ser
   * acessíveis sem autenticação. O sistema deve redirecionar para o login
   * em vez de mostrar um erro de servidor.
   */
  test('acesso direto ao inventário sem login deve redirecionar para a página de login', async ({ page }) => {
    // Tenta navegar diretamente para a página protegida sem fazer login
    await page.goto('https://www.saucedemo.com/inventory.html');

    // O sistema deve redirecionar para a página de login
    // A URL raiz '/' é a página de login do SauceDemo
    await expect(page).toHaveURL('/');

    // Confirma que o formulário de login está visível (não apenas a URL mudou)
    const loginButton = page.locator('[data-test="login-button"]');
    await expect(loginButton).toBeVisible();
  });
});
