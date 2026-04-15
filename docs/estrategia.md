# Estratégia de Testes — swaglab-quality-suite

## Filosofia geral

Este projeto adota a abordagem **"Testes como Documentação Viva"**: cada teste deve ser
legível o suficiente para que um stakeholder não técnico entenda o que está sendo
verificado e por quê. Comentários em português reforçam isso.

A pirâmide de testes guia as prioridades:
```
         /  UI Tests  \     ← poucos, caros, lentos (testes visuais)
        /  E2E Tests   \    ← médio volume, custo moderado (esta suite)
       /  API Tests     \   ← rápidos, confiáveis, alta cobertura (esta suite)
      /   Unit Tests     \  ← muitos, baratos, rápidos (não cobertos aqui)
```

---

## Por que Playwright para testes E2E?

| Critério          | Playwright                        | Selenium (alternativa)            |
|-------------------|-----------------------------------|-----------------------------------|
| Instalação        | `npm install` + 1 comando         | Requer driver externo (ChromeDriver) |
| Velocidade        | Auto-wait nativo, sem sleeps      | Requer waits explícitos frequentes |
| Seletores         | Prioriza data-test e semânticos   | Qualquer seletor, fácil usar ruins |
| Screenshots       | Automático em falha               | Requer configuração extra          |
| Trace/Debug       | Trace viewer embutido             | Depende de ferramentas externas    |
| TypeScript        | Suporte nativo                    | Suporte via wrapper                |
| CI                | GitHub Actions out-of-the-box     | Requer mais configuração           |

**Decisão:** Playwright é a escolha mais moderna, produtiva e com menor overhead de configuração para projetos novos em 2025/2026.

---

## Por que Page Object Model (POM)?

O POM é um padrão de design que separa a lógica dos seletores e ações da lógica dos testes.

**Sem POM:**
```typescript
// Seletor repetido em 10 testes — se mudar, precisa atualizar em 10 lugares
await page.locator('[data-test="login-button"]').click();
```

**Com POM:**
```typescript
// Centralizado no LoginPage — muda em 1 lugar, todos os testes atualizam
await loginPage.login(user, pass);
```

**Benefícios no projeto:**
1. **Manutenibilidade:** O SauceDemo é um produto real que pode mudar. Com POM, mudanças de DOM impactam apenas o Page Object, não os testes
2. **Legibilidade:** `await inventoryPage.addToCart('Backpack')` é mais expressivo que 3 linhas de seletor/clique
3. **Reutilização:** O `beforeEach` de login usa `loginPage.login()` em todas as 4 suites

---

## Por que pytest + httpx para testes de API?

| Critério          | pytest + httpx                    | requests + unittest (alternativa) |
|-------------------|-----------------------------------|-----------------------------------|
| Fixtures          | Sistema nativo poderoso           | Setup/teardown verboso             |
| Marcadores        | `@pytest.mark.crud` para filtrar  | Requer estrutura de classes        |
| HTTP/2            | httpx suporta nativo              | requests não suporta               |
| Async             | httpx tem versão async embutida   | requests não tem async             |
| Relatório HTML    | pytest-html pronto                | Requer biblioteca extra            |
| Tipagem           | Funciona bem com mypy             | Tipagem fraca                      |

**Decisão:** pytest é o padrão da indústria para Python. httpx é a evolução moderna do requests com suporte a HTTP/2 e async.

---

## Por que monorepo (e2e/ e api/ no mesmo repositório)?

**Alternativa:** Dois repositórios separados.

**Motivo do monorepo:**
1. **CI simplificado:** Um único repositório, triggers por pasta (`paths: ['e2e/**']`)
2. **Contexto unificado:** Um avaliador de portfolio vê tudo em um lugar
3. **Documentação centralizada:** README, glossário e bug reports cobrem ambas as suites
4. **Escala do projeto:** Com apenas 2 módulos de teste, o overhead de monorepo é baixo

---

## Estratégia de priorização dos testes

### Ordem de execução recomendada

1. **Smoke tests primeiro** — se login falhar, não faz sentido executar checkout
2. **Testes negativos após smoke** — dependem de smoke passando (login funcional)
3. **Problem users por último** — são os mais complexos e menos críticos para CI

### Critérios de severidade aplicados

| Severidade | Critério                                               | Ação no CI          |
|------------|--------------------------------------------------------|---------------------|
| Crítica    | Bloqueia o fluxo principal de negócio                  | Bloqueia o merge    |
| Alta       | Impacta significativamente a experiência do usuário    | Bloqueia o merge    |
| Média      | Degradação de performance ou UX, sem bloquear          | Alerta, não bloqueia |
| Baixa      | Cosmético, não impacta funcionalidade                  | Backlog             |

---

## Estratégia de dados de teste

Todos os dados de teste estão centralizados em `e2e/support/test-data.ts`:

```typescript
export const USERS = { standard, locked, problem, performance, error, visual, invalid }
export const CHECKOUT_INFO = { valid, empty }
export const ERROR_MESSAGES = { invalidCredentials, lockedOut, ... }
export const PRODUCTS = { backpack, bikeLight, ... }
```

**Por quê?**
- Mudança em um único arquivo propaga para todos os testes
- Evita "magic strings" (`'standard_user'`) espalhadas nos testes
- TypeScript garante autocompletar e detecta typos em tempo de compilação

---

## Estratégia para bugs conhecidos (problem users)

Bugs documentados nos testes de problem users **não devem fazer os testes falhar**.

**Motivo:** Em projetos reais, testes que falham por bugs conhecidos:
1. Adicionam ruído ao CI — difícil distinguir nova regressão de bug antigo
2. Geram alertas falsos para o time
3. Mascaram novas falhas introduzidas junto com bugs conhecidos

**Nossa abordagem:**
- Testes de problem users **passam sempre** — documentam o comportamento atual
- Comentários marcam explicitamente os bugs: `// BUG DOCUMENTADO`
- Bug reports detalhados em `manual/bug-reports/` para rastreamento
- Quando o bug for corrigido: atualizar o teste para validar comportamento correto

---

## Estratégia de CI/CD

Dois workflows independentes, ativados por paths:

```
push to main:
  e2e/** → dispara e2e-tests.yml
  api/** → dispara api-tests.yml
```

**Por quê paths separados?**
- Uma mudança em teste de API não reexecuta testes E2E (muito mais lentos)
- Reduz custo de minutos no GitHub Actions
- Isolamento: falha de E2E não bloqueia deploy de fix de API
