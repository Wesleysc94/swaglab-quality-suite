import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { USERS } from '../../support/test-data';

/**
 * Suite de testes smoke para o fluxo de autenticação.
 *
 * Testes smoke são os mais básicos e rápidos — verificam que o sistema
 * respira. Se esses falharem, não faz sentido executar os demais.
 *
 * Cobertura desta suite:
 * 1. Login bem-sucedido com standard_user
 * 2. Logout e retorno à tela de login
 */
test.describe('Smoke: Login e Autenticação', () => {
  /**
   * Teste 1: Login com credenciais válidas deve redirecionar para /inventory.html
   *
   * Este é o caminho mais básico do sistema. Se o login não funcionar,
   * nenhum outro teste tem utilidade. Por isso é o primeiro teste smoke.
   */
  test('login com standard_user deve redirecionar para o inventário', async ({ page }) => {
    // Instancia o Page Object da página de login
    const loginPage = new LoginPage(page);

    // Navega para a página inicial (URL raiz configurada em playwright.config.ts)
    await loginPage.goto();

    // Realiza o login com o usuário padrão que tem comportamento normal
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    // Verifica que o login foi bem-sucedido confirmando a URL da página de inventário
    // O SauceDemo redireciona para /inventory.html após autenticação válida
    await expect(page).toHaveURL(/inventory\.html/);
  });

  /**
   * Teste 2: Logout deve retornar o usuário para a página de login
   *
   * Verificar o logout é fundamental para garantir que sessões podem ser encerradas.
   * Após o logout, o usuário não deve ter acesso às páginas protegidas.
   */
  test('logout deve redirecionar para a página de login', async ({ page }) => {
    // Instancia os Page Objects necessários para este fluxo
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Pré-condição: usuário precisa estar logado para poder fazer logout
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);

    // Confirma que o login foi realizado antes de tentar o logout
    await expect(page).toHaveURL(/inventory\.html/);

    // Executa o logout pelo menu hambúrguer
    // O método encapsula: abrir menu → esperar o link → clicar em logout
    await inventoryPage.logout();

    // Após logout, o sistema deve retornar para a página de login (URL raiz)
    // Isso garante que a sessão foi encerrada corretamente
    await expect(page).toHaveURL('/');
  });
});
