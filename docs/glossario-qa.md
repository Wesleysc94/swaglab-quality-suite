# Glossário de QA

Termos usados neste projeto, explicados de forma direta. Útil para quem está estudando.

---

## Assertion (Asserção)

Uma verificação que confirma se o resultado foi o esperado.

```typescript
// O sistema deve estar na URL do inventário após o login
await expect(page).toHaveURL(/inventory\.html/);
```

```python
# A API deve retornar 200 quando a listagem funciona
assert response.status_code == 200, "Listagem deve retornar 200"
```

A mensagem no assert existe por um motivo: quando o teste falha, você lê a mensagem e já sabe o que era esperado.

---

## Bug Report

Documento que descreve um defeito com informações suficientes para qualquer pessoa reproduzir.

Campos essenciais: passos de reprodução, resultado atual, resultado esperado, evidência, severidade.

Sem esses campos, o desenvolvedor não consegue reproduzir e o bug fica em aberto por semanas.

---

## Caso de Teste

Especificação de uma condição a verificar: pré-condições, passos, dados de entrada e resultado esperado.

Um caso de teste pode ser executado manualmente ou automatizado. Os testes em `e2e/tests/` são casos de teste automatizados.

---

## CI/CD

**CI (Integração Contínua):** a cada push, testes são executados automaticamente.

**CD (Entrega Contínua):** extensão da CI que automatiza o deploy após os testes.

Neste projeto, os workflows em `.github/workflows/` implementam CI — empurrou código, os testes rodam.

---

## Cenário Negativo

Teste que verifica o comportamento com entradas inválidas ou fora do esperado.

Exemplo: login com senha errada, checkout sem preencher campos, buscar usuário que não existe.

Sistemas geralmente têm boa cobertura do fluxo feliz. Os cenários negativos revelam como o sistema falha — e se ele falha bem ou mal.

---

## Data-test attribute

Atributo HTML criado especificamente para testes: `data-test="login-button"`.

A vantagem sobre seletores CSS é estabilidade: uma classe CSS muda com redesign, mas `data-test` só muda se alguém intencionalmente remover. O SauceDemo usa isso em toda a interface.

```typescript
// Estável — não quebra com mudanças de estilo
this.loginButton = page.locator('[data-test="login-button"]');
```

---

## E2E (End-to-End)

Teste que simula o caminho completo de um usuário real — da interface até o banco de dados e de volta.

São os testes mais lentos e mais frágeis, mas também os que dão mais confiança: se o fluxo passa, o usuário consegue fazer o que precisa.

---

## Fixture (pytest)

Função que prepara o ambiente antes de um teste e faz limpeza depois.

```python
@pytest.fixture
def client():
    with httpx.Client(base_url=BASE_URL) as c:
        yield c  # o cliente é entregue ao teste aqui
    # a conexão é fechada automaticamente aqui
```

O pytest injeta a fixture nos testes que declaram o parâmetro com o mesmo nome. Sem fixture, você copiaria esse código em cada teste.

---

## Flaky Test

Teste que passa às vezes e falha outras, sem mudança no código.

Causas comuns: dependência de tempo, dados compartilhados entre testes, serviços externos instáveis, condição de corrida em paralelo.

Testes flaky destroem a confiança no CI — quando falha, ninguém sabe se é bug real ou instabilidade. Devem ser corrigidos ou removidos.

---

## Go / No Go

Decisão ao fim de uma rodada de testes: o produto está pronto para ir a produção (Go) ou não (No Go)?

Não é binário simples — é uma comunicação de risco. Um BUG-002 que bloqueia o checkout é No Go. Um BUG-006 de layout é Go com observação.

---

## Page Object Model (POM)

Padrão onde os seletores e ações de uma página ficam numa classe separada.

Sem POM, o seletor `[data-test="login-button"]` aparece em dez testes. Com POM, fica em `LoginPage.ts` e os testes chamam `loginPage.login()`.

Quando o HTML mudar, você atualiza só o Page Object.

---

## Pipeline

Sequência automatizada de etapas após um evento. No GitHub Actions:

```
push → checkout do código → instalar dependências → executar testes → salvar relatório
```

---

## Selector (Seletor)

String que identifica um elemento HTML para interação.

Do mais estável ao mais frágil:
1. `[data-test="login-button"]` — criado pra testes, não muda com redesign
2. `role="button" name="Login"` — semântico, relativamente estável
3. `#login-btn` — ID, ok se não mudar
4. `.btn-primary` — classe CSS, quebra com redesign
5. `//div[3]/button[1]` — XPath por posição, quebra com qualquer mudança de DOM

---

## Severidade vs. Prioridade

Frequentemente confundidos.

**Severidade:** o quanto o bug afeta o funcionamento. Definida pelo QA.

**Prioridade:** a urgência de correção. Definida pelo produto/negócio.

Exemplo prático:
- Erro de ortografia no rodapé: severidade baixa, prioridade alta (CEO viu e quer corrigir hoje)
- Crash em funcionalidade raramente usada: severidade crítica, prioridade baixa (zero usuários afetados)

---

## Teste Exploratório

Sessão de teste sem roteiro fixo — o testador explora o produto com base em experiência e intuição.

Os seis bugs deste projeto foram descobertos em exploração: logar com os diferentes tipos de usuário do SauceDemo e observar o que quebra.

---

## Teste de Regressão

Verificação de que uma mudança no código não quebrou algo que funcionava.

Toda a suite de testes deste projeto serve como regressão: a cada deploy, os workflows executam e detectam problemas novos.

---

## Teste Smoke

Conjunto mínimo de testes para confirmar que o produto está de pé.

Se o smoke falha, não há motivo para continuar — o sistema está quebrado de forma fundamental. No SauceDemo: o login funciona? Os produtos carregam? O checkout completa?
