# Escopo do projeto

O objetivo deste estudo de caso foi reunir duas frentes de automação em um mesmo repositório: testes E2E em um e-commerce com bugs intencionais e testes de API em um serviço REST público.

---

## O que entrou no escopo

### SauceDemo — Automação E2E

| Categoria | O que foi testado |
|-----------|-------------------|
| Smoke | Login, logout, listagem de produtos, carrinho e checkout completo |
| Negativos | Credenciais inválidas, usuário bloqueado, acesso sem autenticação e formulário vazio |
| Problem users | Usuários especiais com bugs intencionais documentados |

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
| Firefox e Safari | O foco foi em Chromium para manter a execução simples no CI. |
| Mobile / responsividade | Fora do escopo desta rodada. |
| Testes de carga | Requerem ferramentas e cenário próprios. |
| Acessibilidade | Merece uma frente dedicada com critérios específicos. |
| Persistência real de dados | O JSONPlaceholder simula operações; os testes validam status code e estrutura, não persistência real. |

---

## Decisões de escopo

**Por que dois produtos?**
Porque a proposta deste estudo de caso é exercitar automação em contextos diferentes: uma aplicação web com bugs conhecidos e uma API pública voltada para prototipagem.

**Por que os testes de `problem_user` passam?**
Porque o objetivo desses cenários é documentar comportamento defeituoso conhecido sem quebrar o pipeline a cada execução.

**Por que centralizar os dados de teste?**
Porque isso reduz repetição, evita strings soltas nos testes e facilita manutenção.
