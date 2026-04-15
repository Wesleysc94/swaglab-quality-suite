"""
Testes negativos e de fronteira para a API JSONPlaceholder.

Testes negativos verificam como a API se comporta em situações incomuns:
- Recursos inexistentes
- Respostas com tipo de conteúdo correto
- Comportamento com parâmetros válidos mas sem resultados
- Validação de estrutura de dados

Um sistema robusto deve lidar bem com todos esses cenários,
retornando erros claros sem expor informações internas ou travar.

Cobertura:
- GET de post inexistente → 404
- GET de comentário inexistente → 404
- Validação de Content-Type → deve ser application/json
- GET com filtros que não retornam resultados → 200 com array vazio
"""

import pytest


# Marcador para identificar estes testes como negativos
# Permite rodar apenas este grupo com: pytest -m negative
pytestmark = pytest.mark.negative


def test_get_nonexistent_post_returns_404(client):
    """
    Buscar um post com ID inexistente deve retornar 404 Not Found.

    O status 404 Not Found é o código correto quando o recurso não existe.
    JSONPlaceholder retorna 404 para IDs que estão fora do intervalo válido.
    """
    # Buscamos o ID 99999 — este ID não existe em JSONPlaceholder
    response = client.get("/posts/99999")

    # 404 Not Found é o código semântico correto para recurso inexistente
    assert response.status_code == 404, \
        f"Post inexistente deve retornar 404, mas retornou {response.status_code}"


def test_get_nonexistent_comment_returns_404(client):
    """
    Buscar um comentário com ID inexistente deve retornar 404.

    Comentários também são recursos — quando não encontrados, a API
    deve retornar 404 consistentemente.
    """
    # Buscamos o comentário ID 99999 — não existe em JSONPlaceholder
    response = client.get("/comments/99999")

    # 404 Not Found é esperado para comentário inexistente
    assert response.status_code == 404, \
        f"Comentário inexistente deve retornar 404, mas retornou {response.status_code}"


def test_api_response_has_json_content_type(client):
    """
    Respostas da API devem ter Content-Type application/json.

    O Content-Type correto é fundamental — clientes que parseiam a resposta
    precisam saber que é JSON. Se a API retornar text/html por engano,
    o parse JSON vai falhar e causar erros em cascata.
    """
    # Fazemos uma requisição simples para verificar o header de resposta
    response = client.get("/posts")

    assert response.status_code == 200, \
        f"Requisição de verificação deve retornar 200, mas retornou {response.status_code}"

    # Verifica que o Content-Type indica JSON
    # O header pode ter o charset junto: "application/json; charset=utf-8"
    content_type = response.headers.get("content-type", "")
    assert "application/json" in content_type, \
        f"Content-Type deve ser application/json, mas foi: {content_type}"


def test_list_posts_by_nonexistent_user_returns_empty_array(client):
    """
    Buscar posts de um usuário que não existe deve retornar um array vazio.

    Este teste verifica que quando nenhum resultado é encontrado,
    a API retorna 200 OK com um array vazio em vez de 404.
    Essa é uma convenção comum em APIs de listagem com filtros.
    """
    # Buscamos posts de um usuário que não existe (userId muito alto)
    response = client.get("/posts", params={"userId": 99999})

    # 200 OK é esperado mesmo sem resultados
    assert response.status_code == 200, \
        f"Busca sem resultados deve retornar 200, mas retornou {response.status_code}"

    posts = response.json()

    # Deve retornar um array vazio (não null nem 404)
    assert isinstance(posts, list), "Resposta deve ser um array mesmo sem resultados"
    assert len(posts) == 0, "Array deve estar vazio para userId inexistente"


def test_create_post_with_empty_title_returns_201(client):
    """
    Criar um post com título vazio ainda retorna 201 (sem validação rigorosa).

    JSONPlaceholder não valida o conteúdo rigorosamente — apenas simula uma API.
    Este teste documenta que a API aceita dados inválidos sem rejeitar.
    """
    # Payload com título vazio propositalmente
    post_invalido = {
        "title": "",
        "body": "Post com título vazio",
        "userId": 1,
    }

    # Envia POST mesmo com title vazio
    response = client.post("/posts", json=post_invalido)

    # JSONPlaceholder retorna 201 mesmo com dados inválidos (é uma API fake)
    assert response.status_code == 201, \
        f"Criação com title vazio deve retornar 201, mas retornou {response.status_code}"

    post_criado = response.json()

    # Confirma que o title vazio foi mantido na resposta
    assert post_criado["title"] == "", "Title vazio deve ser mantido na resposta"
    assert "id" in post_criado, "Post deve ter ID gerado mesmo com title vazio"


def test_update_nonexistent_post_returns_error_status(client):
    """
    Atualizar um post inexistente com PUT retorna um status de erro.

    JSONPlaceholder retorna 500 Internal Server Error quando tenta
    atualizar um post que não existe. Este teste documenta esse comportamento.
    Isso é uma característica da API fake — não deve ser replicado em produção.
    """
    # Tentamos atualizar um post que não existe (ID 99999)
    dados = {
        "title": "Atualizando post inexistente",
        "body": "Este post não existe",
        "userId": 1,
    }

    response = client.put("/posts/99999", json=dados)

    # JSONPlaceholder retorna 500 para PUT em recursos inexistentes
    # (Este é um comportamento de API fake, não replicável em produção)
    assert response.status_code in [200, 500], \
        f"PUT em ID inexistente deve retornar 200 ou 500, mas retornou {response.status_code}"


def test_delete_nonexistent_post_returns_200(client):
    """
    Deletar um post inexistente retorna 200 (comportamento do JSONPlaceholder).

    JSONPlaceholder não falha em operações DELETE para recursos inexistentes.
    Este é um comportamento documentado da API fake — não é replicado em APIs reais.
    """
    # Tentamos deletar um post que não existe
    response = client.delete("/posts/99999")

    # JSONPlaceholder retorna 200 mesmo para DELETE de recursos inexistentes
    assert response.status_code == 200, \
        f"DELETE de ID inexistente deve retornar 200 (sem validação), mas retornou {response.status_code}"
