import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração global do Playwright para o projeto swaglab-quality-suite.
 *
 * Esta configuração centraliza todos os parâmetros de execução dos testes E2E,
 * evitando repetição e facilitando manutenção. Alterando aqui, todos os testes
 * são afetados automaticamente.
 *
 * Documentação: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Diretório raiz onde o Playwright vai procurar os arquivos de teste
  testDir: './tests',

  // Executa todos os testes em um arquivo em paralelo
  // Desativado para evitar conflitos de estado no SauceDemo
  fullyParallel: false,

  // Falha o build caso algum test.only seja deixado no código por acidente
  // Boa prática para evitar que testes incompletos passem em CI
  forbidOnly: !!process.env.CI,

  // Sem retries por padrão — queremos ver falhas reais, não mascarar flakiness
  retries: 0,

  // Número de workers paralelos (1 = sequencial, ideal para testes com estado compartilhado)
  workers: process.env.CI ? 1 : 1,

  // Reporter HTML gera um relatório visual navegável em playwright-report/
  // Muito útil para analisar falhas com screenshots e traces
  reporter: 'html',

  // Configurações aplicadas a todos os projetos (browsers)
  use: {
    // URL base do SauceDemo — os testes usam '/' em vez da URL completa
    baseURL: 'https://www.saucedemo.com/',

    // Timeout de 30s por ação (clique, preenchimento, etc.)
    actionTimeout: 30000,

    // Captura screenshot apenas em caso de falha — evita armazenar imagens desnecessárias
    screenshot: 'only-on-failure',

    // Mantém o vídeo apenas em caso de falha — facilita debug sem gastar espaço
    video: 'retain-on-failure',

    // Trace captura tudo (cliques, ações, DOM) — útil para debug profundo
    trace: 'retain-on-failure',
  },

  // Timeout global por teste
  timeout: 30000,

  // Define os projetos (browsers) onde os testes serão executados
  // Por ora, apenas Chromium para manter foco e velocidade
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
