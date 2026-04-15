"""
Testes de criação e manipulação de comentários para a API JSONPlaceholder.

Este módulo testa os endpoints de criação de posts e comentários da API.
Criar e listar comentários é uma funcionalidade essencial — um bug aqui
pode impedir usuários de comentar em posts ou listar discussões.

Endpoints cobertos:
- POST /posts      → criar novo post (com título e corpo)
- POST /comments   → criar novo comentário (com email e corpo)
- GET /posts/{id}/comments → listar comentários de um post específico

JSONPlaceholder é uma API fake para prototipagem. Não valida credenciais
reais, mas simula o comportamento de uma API REST real com status codes corretos.
"""

import pytest


# Marcador para identificar estes testes como de criação
# Permite rodar apenas este grupo com: pytest -m creation
pytestmark = pytest.mark.creation


def test_create_post_with_valid_data_returns_201(client):
    """
    Criar um novo post com dados válidos deve retornar status 201.

    A criação de posts é fundamental — sem ela, usuários não poderiam
    publicar conteúdo. O status 201 Created indica sucesso na criação de recurso.
    """
    # Payload com os dados do novo post a ser criado
    novo_post = {
        "title": "Automação de Testes no Swaglab",
        "body": "Este post documenta a abordagem de automação com Playwright",
        "userId": 1,
    }

    # Envia POST para criar o novo post
    response = client.post("/posts", json=novo_post)

    # Status 201 Created indica que o recurso foi criado com sucesso
    assert response.status_code == 201, \
        f"Criação de post deve retornar 201, mas retornou {response.status_code}"

    body = response.json()

    # A API deve devolver os campos enviados na criação
    assert "title" in body, "Resposta de criação deve conter o campo 'title'"
    assert "body" in body, "Resposta de criação deve conter o campo 'body'"
    assert "userId" in body, "Resposta de criação deve conter o campo 'userId'"

    # Os valores retornados devem ser iguais aos enviados
    assert body["title"] == novo_post["title"], \
        f"Título retornado deve ser '{novo_post['title']}'"
    assert body["body"] == novo_post["body"], \
        f"Corpo retornado deve ser '{novo_post['body']}'"

    # A API também deve retornar um ID gerado para o novo post
    assert "id" in body, "Resposta de criação deve incluir o 'id' gerado"


def test_create_post_without_body_still_returns_201(client):
    """
    Criar um post sem corpo (body vazio) ainda deve retornar 201.

    Esta é uma validação de entrada — mesmo que o body seja vazio,
    a API não deve rejeitar a criação, mas aceitar e retornar 201.
    JSONPlaceholder não faz validações rígidas, apenas simula uma API real.
    """
    # Payload com body vazio propositalmente
    novo_post = {
        "title": "Post sem corpo",
        "body": "",
        "userId": 1,
    }

    # Envia POST para criar o post mesmo com body vazio
    response = client.post("/posts", json=novo_post)

    # JSONPlaceholder aceita e retorna 201 mesmo com body vazio
    assert response.status_code == 201, \
        f"Criação de post sem body deve retornar 201, mas retornou {response.status_code}"

    body = response.json()

    # Confirma que o ID foi gerado mesmo com body vazio
    assert "id" in body, "Post sem body deve receber um ID gerado"
    assert body["body"] == "", "Body vazio deve ser mantido vazio na resposta"


def test_create_comment_on_post_returns_201(client):
    """
    Criar um comentário em um post deve retornar status 201.

    Comentários são a base de discussão em redes sociais e blogs.
    Este teste verifica que novos comentários podem ser criados corretamente.
    """
    # Dados do novo comentário a ser criado
    novo_comentario = {
        "postId": 1,
        "name": "Wesley Silva",
        "email": "wesley@example.com",
        "body": "Excelente post sobre automação de testes!",
    }

    # Envia POST para criar o comentário
    response = client.post("/comments", json=novo_comentario)

    # Status 201 Created indica sucesso na criação
    assert response.status_code == 201, \
        f"Criação de comentário deve retornar 201, mas retornou {response.status_code}"

    body = response.json()

    # Verifica que todos os campos foram retornados corretamente
    assert body["postId"] == novo_comentario["postId"], "postId deve ser retornado"
    assert body["email"] == novo_comentario["email"], "email deve ser retornado"
    assert body["body"] == novo_comentario["body"], "body do comentário deve ser retornado"

    # A API deve ter gerado um ID para o comentário
    assert "id" in body, "Comentário criado deve ter um ID gerado"


def test_list_comments_for_specific_post_returns_array(client):
    """
    Listar comentários de um post específico deve retornar um array de comentários.

    Ao acessar /posts/{id}/comments, a API deve retornar todos os comentários
    daquele post. Este endpoint é fundamental para exibir discussões.
    """
    # Busca todos os comentários do post com ID 1
    response = client.get("/posts/1/comments")

    # Deve retornar 200 OK — o post existe e pode ter comentários
    assert response.status_code == 200, \
        f"Listagem de comentários deve retornar 200, mas retornou {response.status_code}"

    # A resposta deve ser uma lista de comentários
    comentarios = response.json()
    assert isinstance(comentarios, list), "Resposta deve ser uma array de comentários"

    # O post 1 sempre tem comentários no JSONPlaceholder
    assert len(comentarios) > 0, "Post 1 deve ter pelo menos um comentário"

    # Cada comentário deve ter os campos obrigatórios
    for comentario in comentarios:
        assert "id" in comentario, "Cada comentário deve ter um ID"
        assert "postId" in comentario, "Cada comentário deve indicar seu post"
        assert "body" in comentario, "Cada comentário deve ter um corpo"
        assert "email" in comentario, "Cada comentário deve ter um email do autor"
