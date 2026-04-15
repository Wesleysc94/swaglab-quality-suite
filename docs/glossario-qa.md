# Glossário de QA — swaglab-quality-suite

Referência didática dos termos de Quality Assurance utilizados neste projeto.
Cada termo é explicado com contexto prático baseado nos testes desta suite.

---

## Assertion (Asserção)

Uma verificação que confirma se o sistema se comportou como esperado.

**Em português:** "Afirmação" ou "verificação".

**Exemplos neste projeto:**
```typescript
// Playwright — verifica se chegou na URL correta após o login
await expect(page).toHaveURL(/inventory\.html/);

// pytest — verifica se a API retornou 200
assert response.status_code == 200, "Deve retornar 200 OK"
```

**Regra de ouro:** Uma assertion sem mensagem descritiva é uma oportunidade perdida. A mensagem deve explicar o que o sistema **deveria** ter feito, não o que ele fez.

---

## Bug Report (Relatório de Defeito)

Documento formal que descreve um defeito encontrado, com informações suficientes para que qualquer pessoa possa reproduzi-lo.

**Campos obrigatórios:**
- **Passos para reproduzir:** sequência exata de ações
- **Resultado atual:** o que acontece (o bug)
- **Resultado esperado:** o que deveria acontecer
- **Severidade:** o quanto impacta o sistema
- **Evidência:** screenshot, log, vídeo

**Exemplos neste projeto:** `manual/bug-reports/BUG-001` a `BUG-006`

---

## Caso de Teste

Especificação de uma condição a ser verificada, com: pré-condições, passos, dados de entrada e resultado esperado.

**Diferença entre caso de teste e teste automatizado:**
- **Caso de teste:** a especificação (pode ser manual ou automatizado)
- **Teste automatizado:** a implementação executável do caso de teste

**Exemplo:** O teste `'deve exibir 6 produtos no inventário'` é tanto um caso de teste quanto um teste automatizado.

---

## CI/CD (Integração Contínua / Entrega Contínua)

- **CI (Continuous Integration):** prática de integrar código frequentemente, com testes automáticos a cada push
- **CD (Continuous Delivery/Deployment):** extensão da CI que automatiza o deploy após os testes passarem

**Neste projeto:** Os workflows em `.github/workflows/` implementam CI — ao fazer push, os testes são executados automaticamente.

---

## Cenário Negativo

Teste que verifica como o sistema se comporta com entradas inválidas, inesperadas ou nos limites do que é aceito.

**Por que é importante:** Sistemas frequentemente têm boa cobertura do "caminho feliz" mas falham nos casos negativos. Explorar cenários negativos revela bugs de validação e tratamento de erros.

**Exemplos neste projeto:**
- Login com credenciais inválidas → deve exibir mensagem de erro
- Checkout sem preencher campos → deve bloquear a navegação

---

## Data-test attribute

Atributo HTML adicionado especificamente para facilitar a seleção de elementos em testes automatizados. Convencionalmente nomeado `data-test`, `data-testid` ou `data-cy`.

**Vantagem sobre seletores CSS:** Não muda com redesigns de UI. Uma classe CSS pode mudar de `btn-primary` para `button-blue`, mas `data-test="login-button"` permanece estável enquanto o elemento existir.

**Exemplo neste projeto:**
```typescript
// Seletor estável — não quebra com mudanças de estilo
this.loginButton = page.locator('[data-test="login-button"]');
```

---

## E2E (End-to-End)

Teste que verifica um fluxo completo do sistema, da interface do usuário ao banco de dados e de volta, simulando o comportamento real de um usuário.

**Característica:** São os testes mais lentos e frágeis (dependem de browser, rede, etc.), mas têm o maior valor de confiança — testam o sistema como o usuário vê.

**Exemplos neste projeto:** Toda a suite em `e2e/tests/` — login, adicionar ao carrinho, fazer checkout completo.

---

## Fixture (pytest)

Função que prepara o ambiente antes de um teste e opcionalmente executa limpeza depois. O pytest injeta fixtures automaticamente nos testes que as declaram como parâmetros.

**Exemplo neste projeto:**
```python
@pytest.fixture
def client():
    with httpx.Client(base_url=BASE_URL) as c:
        yield c  # ← fornece o cliente para o teste
    # conexão fechada automaticamente aqui
```

**Analogia TypeScript:** Similar ao `beforeEach()` do Playwright/Jest, mas mais flexível e reutilizável entre múltiplos arquivos de teste via `conftest.py`.

---

## Flaky Test (Teste Instável)

Teste que passa às vezes e falha outras vezes sem alteração no código — resultado não determinístico.

**Causas comuns:**
- Dependência de tempo (delays, `sleep()`)
- Dados de teste compartilhados entre testes
- Dependência de serviços externos lentos ou instáveis
- Condições de corrida em testes paralelos

**Impacto:** Testes flaky destroem a confiança no CI — quando um teste falha, o time não sabe se é um bug real ou instabilidade. Devem ser corrigidos ou removidos.

**Neste projeto:** Configuramos `retries: 0` no playwright.config.ts propositalmente — preferimos ver falhas reais sem mascarar flakiness com retries.

---

## Go / No Go

Decisão binária ao final de um ciclo de testes: o sistema está pronto para ir para produção (Go) ou não (No Go)?

**Critérios típicos de Go:**
- Todos os testes críticos passando
- Bugs de severidade crítica/alta resolvidos
- Cobertura de testes acima do mínimo definido
- Aprovação dos stakeholders

**Critérios de No Go neste projeto:**
- BUG-002 (Last Name bloqueado) → No Go (impede checkout)
- BUG-003 + BUG-004 (error_user) → No Go (impede compra)
- BUG-001 (imagens erradas) → No Go (impacta UX severamente)

---

## Page Object Model (POM)

Padrão de design para testes E2E que encapsula os seletores e ações de uma página em uma classe. Os testes interagem com a página através dos métodos do Page Object, não diretamente com seletores.

**Benefício principal:** Resistência a mudanças de DOM — se o seletor de um botão mudar, o ajuste é feito apenas no Page Object, não em todos os testes que usam aquele botão.

**Estrutura neste projeto:**
```
pages/
├── LoginPage.ts     → seletores e ações de /
├── InventoryPage.ts → seletores e ações de /inventory.html
├── CartPage.ts      → seletores e ações de /cart.html
├── CheckoutPage.ts  → seletores e ações de /checkout-step-*.html
└── CompletePage.ts  → seletores e ações de /checkout-complete.html
```

---

## Pipeline

Sequência automatizada de etapas que ocorre após um evento (push, PR, etc.) no repositório, tipicamente: checkout → install → build → test → deploy.

**Neste projeto:** Os arquivos `.github/workflows/` definem dois pipelines:
1. **e2e-tests.yml:** checkout → install Node → install Playwright → run tests
2. **api-tests.yml:** checkout → install Python → pip install → pytest

---

## Selector (Seletor)

String que identifica um elemento HTML na página para interação em testes automatizados.

**Tipos e qualidade (do melhor para o pior):**
1. `data-test="login-button"` ← melhor (criado para testes)
2. `role="button" name="Login"` ← bom (semântico)
3. `#login-btn` ← ok (ID, estável se não mudar)
4. `.btn.btn-primary` ← ruim (classes mudam com redesign)
5. `//div[3]/button[1]` ← péssimo (XPath frágil, quebra com qualquer mudança de DOM)

---

## Severidade vs. Prioridade

Dois conceitos frequentemente confundidos:

| Conceito      | Definição                                           | Quem define          |
|---------------|-----------------------------------------------------|----------------------|
| **Severidade** | O quanto o bug impacta o sistema funcionalmente    | QA / Time técnico    |
| **Prioridade** | A urgência de correção do bug                      | Produto / Negócio    |

**Exemplo prático:**
- BUG de ortografia no rodapé: Severidade **Baixa** (não impacta função), Prioridade **Alta** (CEO viu e quer corrigir amanhã)
- BUG de crash em feature raramente usada: Severidade **Crítica** (crash), Prioridade **Baixa** (feature não tem usuários)

---

## Teste Exploratório

Teste não roteirizado onde o testador explora o sistema livremente, usando conhecimento, experiência e criatividade para encontrar bugs que scripts automatizados não encontrariam.

**Quando usar:** Especialmente valioso em áreas novas do sistema, quando há suspeita de bugs edge-case ou após grandes mudanças.

**Neste projeto:** Os bugs BUG-001 a BUG-006 foram descobertos via exploração manual dos diferentes tipos de usuário do SauceDemo — antes de ser automatizados como testes.

---

## Teste de Regressão

Verificação de que uma mudança no código não quebrou funcionalidades que estavam funcionando antes.

**Importância:** A cada deploy, qualquer linha de código pode introduzir uma regressão em partes aparentemente não relacionadas do sistema.

**Neste projeto:** Toda a suite de testes serve como suite de regressão — ao fazer um push, os workflows executam automaticamente e detectam regressões.

---

## Teste Smoke

Conjunto mínimo de testes que verificam as funcionalidades mais críticas do sistema em uma execução rápida. O nome vem do teste de hardware: "ligar e ver se sai fumaça".

**Critério:** Se o smoke falhar, não há justificativa para continuar com os demais testes.

**Exemplos neste projeto** (`tests/smoke/`):
- Login funciona?
- Lista de produtos carrega?
- Adicionar ao carrinho funciona?
- Checkout completo funciona?

Se qualquer um desses falhar → o sistema está quebrado de forma fundamental.
