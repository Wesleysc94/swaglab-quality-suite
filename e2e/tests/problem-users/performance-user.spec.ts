import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { USERS } from '../../support/test-data';

/**
 * Suite de testes para o performance_glitch_user do SauceDemo.
 *
 * O performance_glitch_user simula uma situação de degradação de performance —
 * o login demora aproximadamente 5 segundos para ser processado, o que seria
 * inaceitável em produção.
 *
 * ESTRATÉGIA:
 * Medimos o tempo de login e documentamos a latência. O teste passa porque
 * o login em si funciona — apenas com delay excessivo (BUG-005).
 *
 * Bugs cobertos:
 * - BUG-005: Login leva ~5 segundos (degradação de performance significativa)
 */
test.describe('Performance User: Latência de Login', () => {
  /**
   * Teste 1: [BUG-005] Login do performance_glitch_user ocorre com latência excessiva.
   *
   * COMPORTAMENTO ESPERADO: Login deve completar em menos de 2 segundos.
   * COMPORTAMENTO ATUAL (BUG): Login leva aproximadamente 5 segundos.
   *
   * ESTRATÉGIA: Medimos o tempo do login. Se demorar mais de 2s, documentamos
   * como latência excessiva. O teste ainda passa (login funciona), mas registra
   * a degradação de performance no console do relatório.
   *
   * Em produção, uma latência de 5 segundos causaria abandono de sessão e
   * impacto negativo na experiência do usuário.
   */
  test('[BUG-005] login deve funcionar mas com latência excessiva documentada', async ({ page }) => {
    // Aumentamos o timeout para este teste específico
    // O performance_glitch_user pode demorar até 5s no login
    test.setTimeout(60000);

    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Marca o tempo antes de iniciar o login para calcular a duração
    const startTime = Date.now();

    // Realiza o login com o usuário de performance degradada
    await loginPage.login(USERS.performance.username, USERS.performance.password);

    // Aguarda o redirecionamento para o inventário
    await expect(page).toHaveURL(/inventory\.html/);

    // Calcula o tempo total do login
    const loginDuration = Date.now() - startTime;

    // BUG DOCUMENTADO: registramos a latência medida
    console.log(`[BUG-005] Tempo de login do performance_glitch_user: ${loginDuration}ms`);

    // Um login aceitável deve completar em menos de 2000ms (2 segundos)
    // Para o performance_glitch_user, esperamos que SUPERE esse limite
    if (loginDuration > 2000) {
      console.log(`[BUG-005] Confirmado: login levou ${loginDuration}ms — excede o limite de 2000ms`);
      console.log('[BUG-005] Impacto: degradação de UX, possível timeout em conexões lentas');
    } else {
      console.log('[BUG-005] Nesta execução o login foi mais rápido que o esperado:', loginDuration, 'ms');
    }

    // O teste PASSA porque o login funciona — a latência é documentada, não um bloqueio
    // Usamos toHaveURL como assertion final para confirmar que o login completou
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
