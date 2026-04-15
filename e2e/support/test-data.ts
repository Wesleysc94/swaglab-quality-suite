/**
 * Dados de teste centralizados para o projeto swaglab-quality-suite.
 *
 * Manter dados separados do código de teste é uma boa prática porque:
 * 1. Facilita manutenção — muda em um lugar, atualiza todos os testes
 * 2. Deixa os testes mais legíveis — o teste foca no comportamento, não nos dados
 * 3. Permite reutilização entre suites diferentes (smoke, negative, problem users)
 *
 * O "as const" garante que TypeScript trate os valores como literais imutáveis,
 * o que habilita autocompletar preciso nos testes que importam esses dados.
 */

// Credenciais dos diferentes tipos de usuário do SauceDemo
// Cada usuário tem um comportamento diferente projetado para testar cenários específicos:
// - standard_user    → comportamento normal, todos os fluxos funcionam
// - locked_out_user  → não consegue logar (demonstra erro de bloqueio)
// - problem_user     → imagens erradas, campos de formulário com bug
// - performance_glitch_user → login com latência de ~5 segundos
// - error_user       → falhas aleatórias ao interagir com o carrinho
// - visual_user      → elementos com posicionamento incorreto no layout
export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
  performance: { username: 'performance_glitch_user', password: 'secret_sauce' },
  error: { username: 'error_user', password: 'secret_sauce' },
  visual: { username: 'visual_user', password: 'secret_sauce' },
  // Usuário inexistente — usado nos testes de credenciais inválidas
  invalid: { username: 'invalid_user', password: 'wrong_password' },
} as const;

// Dados para preenchimento do formulário de checkout (etapa 1: informações de entrega)
// Separar dados válidos e inválidos aqui deixa o teste mais expressivo:
// CHECKOUT_INFO.valid → fluxo feliz / CHECKOUT_INFO.empty → teste de validação
export const CHECKOUT_INFO = {
  valid: {
    firstName: 'Wesley',
    lastName: 'Carvalho',
    postalCode: '01001-000',
  },
  empty: {
    firstName: '',
    lastName: '',
    postalCode: '',
  },
} as const;

// Mensagens de erro esperadas no login
// Centralizar aqui evita strings mágicas espalhadas pelos testes
export const ERROR_MESSAGES = {
  // Mensagem quando usuário/senha não existem
  invalidCredentials: 'Username and password do not match',
  // Mensagem quando o usuário está bloqueado pelo administrador
  lockedOut: 'Sorry, this user has been locked out',
  // Mensagem quando campos de login estão vazios
  usernameRequired: 'Username is required',
  // Mensagem do checkout quando First Name não é preenchido
  firstNameRequired: 'First Name is required',
  // Mensagem do checkout quando Last Name não é preenchido
  lastNameRequired: 'Last Name is required',
  // Mensagem do checkout quando Postal Code não é preenchido
  postalCodeRequired: 'Postal Code is required',
} as const;

// Nome dos produtos usados nos testes — evita typos e facilita manutenção
// Se o produto mudar de nome no SauceDemo, basta atualizar aqui
export const PRODUCTS = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  redShirt: 'Test.allTheThings() T-Shirt (Red)',
} as const;
