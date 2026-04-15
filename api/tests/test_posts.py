"""
Testes de operações CRUD para os endpoints de posts da API JSONPlaceholder.

JSONPlaceholder é uma API de teste pública que simula operações reais de um sistema
de blogs. Ela não persiste dados realmente — cada chamada retorna respostas simuladas,
mas com status codes e estruturas corretos.

Cobertura deste módulo:
- GET /posts          → listar posts com paginação
- GET /posts?userId=1 → buscar posts por usuário
- GET /posts/{id}     → buscar post específico por ID
- PUT /posts/{id}     → atualizar post completo
- PATCH /posts/{id}   → atualizar post parcial
- DELETE /posts/{id}  → remover post
"""

import pytest


# Marcador para identificar estes testes como CRUD
# Permite rodar apenas este grupo com: pytest -m crud
pytestmark = pytest.mark.crud


def test_list_posts_returns_200_with_data(client):
    """
    Listar posts deve retornar status 200 e uma lista de dados.

    Este é o teste mais básico da API — verifica que o endpoint principal
    de listagem está acessível e retorna a estrutura correta.
    """
    # Envia GET para /posts para listar todos os posts
    response = client.get("/posts")

    # A API deve responder com 200 OK — qualquer outro status indica problema
    assert response.status_code == 200, \
        f"Listagem de posts deve retornar 200, mas retornou {response.status_code}"

    # Converte a resposta JSON para lista Python
    posts = response.json()

    # A resposta deve ser uma lista (não um objeto nem null)
    assert isinstance(posts, list), "Resposta deve ser uma lista de posts"

    # A lista não deve estar vazia — JSONPlaceholder sempre retorna posts
    assert len(posts) > 0, "Lista de posts não deve estar vazia"

    # Verifica a estrutura de um post típico
    primeiro_post = posts[0]
    assert "id" in primeiro_post, "Post deve ter 'id'"
    assert "title" in primeiro_post, "Post deve ter 'title'"
    assert "body" in primeiro_post, "Post deve ter 'body'"
    assert "userId" in primeiro_post, "Post deve ter 'userId'"


def test_list_posts_by_user_id_filters_correctly(client):
    """
    Listar posts de um usuário específico deve retornar apenas seus posts.

    O parâmetro 'userId' permite filtrar posts por autor.
    Este teste verifica que o filtro funciona e retorna apenas posts do usuário especificado.
    """
    # Envia GET para buscar apenas posts do usuário com ID 1
    response = client.get("/posts", params={"userId": 1})

    assert response.status_code == 200, \
        f"Listagem com filtro deve retornar 200, mas retornou {response.status_code}"

    posts = response.json()

    # Deve retornar uma lista com posts
    assert isinstance(posts, list) and len(posts) > 0, \
        "Busca de posts por userId deve retornar uma lista não vazia"

    # Todos os posts retornados devem ser do usuário 1
    for post in posts:
        assert post["userId"] == 1, \
            f"Todos os posts retornados devem ter userId=1, mas encontrou userId={post['userId']}"


def test_get_post_by_id_returns_correct_fields(client):
    """
    Buscar um post por ID deve retornar todos os campos obrigatórios.

    Este teste verifica que o endpoint de detalhe de um post retorna
    a estrutura correta com todos os campos necessários.
    """
    # Buscamos o post com ID 1 (sempre existe em JSONPlaceholder)
    response = client.get("/posts/1")

    assert response.status_code == 200, \
        f"Busca por post ID 1 deve retornar 200, mas retornou {response.status_code}"

    post = response.json()

    # Verifica a presença dos campos obrigatórios de um post
    assert "id" in post, "Post deve ter campo 'id'"
    assert "title" in post, "Post deve ter campo 'title'"
    assert "body" in post, "Post deve ter campo 'body'"
    assert "userId" in post, "Post deve ter campo 'userId'"

    # Confirma que o ID retornado corresponde ao ID solicitado
    assert post["id"] == 1, f"ID retornado deve ser 1, mas foi {post['id']}"

    # O título não deve ser uma string vazia
    assert isinstance(post["title"], str) and len(post["title"]) > 0, \
        f"Título deve ser válido, mas foi: {post['title']}"


def test_update_post_with_put_returns_200(client):
    """
    Atualizar um post com PUT deve retornar 200 com todos os dados.

    PUT substitui o recurso completo. A resposta deve incluir todos os campos
    enviados, confirmando que a atualização foi processada.
    """
    # Dados de atualização para o post com ID 1
    dados_atualizados = {
        "title": "Post Atualizado sobre Automação",
        "body": "Este post foi atualizado com testes de API",
        "userId": 1,
    }

    # Envia PUT para atualizar o post com ID 1
    response = client.put("/posts/1", json=dados_atualizados)

    assert response.status_code == 200, \
        f"Atualização deve retornar 200, mas retornou {response.status_code}"

    post_atualizado = response.json()

    # Verifica que os dados foram atualizados corretamente
    assert post_atualizado["title"] == dados_atualizados["title"], \
        "Título do post deve ser atualizado"
    assert post_atualizado["body"] == dados_atualizados["body"], \
        "Corpo do post deve ser atualizado"


def test_partial_update_post_with_patch_returns_200(client):
    """
    Atualizar parcialmente um post com PATCH deve retornar 200.

    PATCH permite atualizar apenas alguns campos, mantendo o resto inalterado.
    Este teste verifica que apenas o title é atualizado, sem afetar outros campos.
    """
    # Dados parciais — apenas o título será atualizado
    atualizacao_parcial = {
        "title": "Novo Título (PATCH)",
    }

    # Envia PATCH para atualizar apenas o título do post 1
    response = client.patch("/posts/1", json=atualizacao_parcial)

    assert response.status_code == 200, \
        f"Atualização parcial deve retornar 200, mas retornou {response.status_code}"

    post_modificado = response.json()

    # O título deve ter sido atualizado
    assert post_modificado["title"] == atualizacao_parcial["title"], \
        "Título deve ser atualizado com PATCH"

    # O ID deve ser mantido (não afetado pela atualização)
    assert post_modificado["id"] == 1, \
        "ID deve ser mantido após PATCH"


def test_delete_post_returns_200(client):
    """
    Deletar um post deve retornar status 200 com corpo vazio.

    O status 200 com resposta vazia é a convenção do JSONPlaceholder para DELETE.
    Essa é uma variação válida em vez de 204 No Content.
    """
    # Envia DELETE para remover o post com ID 1
    response = client.delete("/posts/1")

    # JSONPlaceholder retorna 200 OK para DELETE (não 204)
    assert response.status_code == 200, \
        f"Deleção deve retornar 200, mas retornou {response.status_code}"

    # A resposta pode estar vazia ou retornar os dados do post deletado
    # Ambos são comportamentos válidos em diferentes APIs
    body = response.json() if response.text else {}
    assert isinstance(body, dict), "Resposta de DELETE deve ser um objeto JSON válido"
