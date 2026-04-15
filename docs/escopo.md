# Escopo do projeto

O objetivo era cubrir duas frentes de automação num mesmo repositório: testes E2E num e-commerce e testes de API num serviço REST público.

---

## O que entrou no escopo

### SauceDemo — Automação E2E

| Categoria | O que foi testado |
|-----------|-------------------|
| Smoke | Login, logout, listagem de produtos, carrinho, checkout completo |
| Negativos | Credenciais inválidas, usuário bloqueado, acesso sem autenticação, formulário vazio |
| Problem users | 4 tipos de usuários com bugs intencionais documentados |

### JSONPlaceholder — Automação de API

| Categoria | O que foi testado |
|-----------|-------------------|
| CRUD | Listar, buscar, filtrar, atualizar e deletar posts |
| Creation | Criar posts, criar comentários e listar comentários por post |
| Negativos | Recurso inexistente, Content-Type, filtros sem resultado e operações em IDs inexistentes |

---

## O que ficou de fora

| Item | Motivo |
|------|--------|
| Firefox e Safari | O foco foi em Chromium para manter o CI simples. Playwright suporta os outros browsers — seria só adicionar projetos no `playwright.config.ts`. |
| Mobile / responsividade | Fora do escopo desta rodada. |
| Testes de carga | Requer infraestrutura diferente (k6, Locust). |
| Acessibilidade | Merece projeto específico com ferramentas próprias. |
| Persistência real de dados | O JSONPlaceholder simula as operações — não persiste nada. Os testes validam status codes e estrutura da resposta, não estado no banco. |

---

## Decisões de escopo

**Por que dois produtos?**
O primeiro portfolio testou um único produto nas três camadas. Aqui a escolha foi propositalmente diferente: dois produtos com características distintas para exercitar adaptação de abordagem.

**Por que os testes de problem_user passam?**
Bug conhecidos que quebram o CI geram ruído. A decisão foi: o teste executa, confirma que o bug existe, registra no console e passa. O bug fica documentado no relatório e no `manual/bug-reports/` — rastreável sem atrapalhar o pipeline.

**Por que centralizar os dados de teste?**
Tudo fica em `e2e/support/test-data.ts`. Sem strings soltas nos testes. Se um usuário ou produto mudar no SauceDemo, atualiza em um lugar.
