"""
Testes de operações CRUD para o recurso 'users' da API Reqres.in.

Reqres.in é uma API de teste pública que simula operações reais de um sistema
de usuários. Ela não persiste dados realmente — cada chamada retorna respostas
simuladas, mas com status codes e estruturas corretos.

Cobertura deste módulo:
- GET /api/users         → listar usuários com paginação
- GET /api/users?page=2  → segunda página de resultados
- GET /api/users/{id}    → buscar usuário específico por ID
- POST /api/users        → criar novo usuário
- PUT /api/users/{id}    → atualizar usuário completo
- DELETE /api/users/{id} → remover usuário
"""

import pytest


# Marcador para identificar estes testes como CRUD
# Permite rodar apenas este grupo com: pytest -m crud
pytestmark = pytest.mark.crud


def test_list_users_returns_200_with_data(client):
    """
    Listar usuários deve retornar status 200 e uma lista de dados.

    Este é o teste mais básico da API — verifica que o endpoint principal
    de listagem está acessível e retorna a estrutura correta.
    """
    # Envia GET para /api/users para listar os usuários da primeira página
    response = client.get("/api/users")

    # A API deve responder com 200 OK — qualquer outro status indica problema
    assert response.status_code == 200, \
        f"Listagem de usuários deve retornar 200, mas retornou {response.status_code}"

    # Converte a resposta JSON para dicionário Python
    body = response.json()

    # O campo 'data' deve existir no corpo da resposta
    assert "data" in body, "Resposta deve conter o campo 'data'"

    # O campo 'data' deve ser uma lista (não um objeto nem null)
    assert isinstance(body["data"], list), "Campo 'data' deve ser uma lista de usuários"

    # A lista não deve estar vazia — a API sempre retorna pelo menos 1 usuário
    assert len(body["data"]) > 0, "Lista de usuários não deve estar vazia"


def test_list_users_page_2_returns_correct_pagination(client):
    """
    Listar a página 2 deve retornar dados com informações corretas de paginação.

    A paginação é essencial para APIs com muitos registros. Este teste verifica
    que o parâmetro 'page' funciona e que os metadados de paginação estão corretos.
    """
    # Envia GET para a segunda página de usuários
    response = client.get("/api/users", params={"page": 2})

    assert response.status_code == 200, \
        f"Página 2 deve retornar 200, mas retornou {response.status_code}"

    body = response.json()

    # Verifica que a resposta indica que estamos na página 2
    assert body.get("page") == 2, \
        f"Resposta deve indicar page=2, mas retornou page={body.get('page')}"

    # Verifica que o total de páginas está presente e é maior que 1
    assert "total_pages" in body, "Resposta deve conter 'total_pages'"
    assert body["total_pages"] >= 1, "Total de páginas deve ser pelo menos 1"

    # Confirma que há dados na segunda página
    assert "data" in body and len(body["data"]) > 0, \
        "Página 2 deve conter usuários na lista 'data'"


def test_get_user_by_id_returns_correct_fields(client):
    """
    Buscar usuário por ID deve retornar os campos obrigatórios do usuário.

    Este teste verifica que o endpoint de detalhes de um usuário retorna
    a estrutura correta com todos os campos necessários.
    """
    # Buscamos o usuário de ID 2 (George Bluth, usuário existente na API)
    response = client.get("/api/users/2")

    assert response.status_code == 200, \
        f"Busca por usuário ID 2 deve retornar 200, mas retornou {response.status_code}"

    body = response.json()

    # O usuário deve estar dentro do campo 'data'
    assert "data" in body, "Resposta deve conter o campo 'data' com os dados do usuário"

    user = body["data"]

    # Verifica a presença dos campos obrigatórios de um usuário
    assert "id" in user, "Usuário deve ter campo 'id'"
    assert "email" in user, "Usuário deve ter campo 'email'"
    assert "first_name" in user, "Usuário deve ter campo 'first_name'"
    assert "last_name" in user, "Usuário deve ter campo 'last_name'"

    # Confirma que o ID retornado corresponde ao ID solicitado
    assert user["id"] == 2, f"ID retornado deve ser 2, mas foi {user['id']}"

    # O email deve ser uma string não vazia
    assert isinstance(user["email"], str) and "@" in user["email"], \
        f"Email deve ser válido, mas foi: {user['email']}"


def test_create_user_returns_201_with_name_and_job(client):
    """
    Criar um novo usuário deve retornar status 201 com os dados enviados.

    O Reqres.in simula a criação — não persiste o usuário, mas retorna o
    status e corpo corretos como uma API real faria.
    """
    # Payload com os dados do novo usuário a ser criado
    novo_usuario = {
        "name": "Wesley Carvalho",
        "job": "Analista de QA",
    }

    # Envia POST com os dados do usuário no corpo da requisição
    response = client.post("/api/users", json=novo_usuario)

    # Status 201 Created indica que o recurso foi criado com sucesso
    assert response.status_code == 201, \
        f"Criação de usuário deve retornar 201, mas retornou {response.status_code}"

    body = response.json()

    # A API deve devolver os campos enviados na criação
    assert "name" in body, "Resposta de criação deve conter o campo 'name'"
    assert "job" in body, "Resposta de criação deve conter o campo 'job'"

    # Os valores retornados devem ser iguais aos enviados
    assert body["name"] == novo_usuario["name"], \
        f"Nome retornado deve ser '{novo_usuario['name']}', mas foi '{body['name']}'"
    assert body["job"] == novo_usuario["job"], \
        f"Job retornado deve ser '{novo_usuario['job']}', mas foi '{body['job']}'"

    # A API também deve retornar um ID gerado para o novo usuário
    assert "id" in body, "Resposta de criação deve incluir o 'id' gerado"


def test_update_user_with_put_returns_200_with_updated_at(client):
    """
    Atualizar um usuário com PUT deve retornar 200 e o campo updatedAt.

    PUT substitui o recurso completo. A presença de 'updatedAt' confirma
    que a operação de atualização foi processada pelo servidor.
    """
    # Dados de atualização para o usuário de ID 2
    dados_atualizados = {
        "name": "Wesley Atualizado",
        "job": "Analista de QA Pleno",
    }

    # Envia PUT para atualizar o usuário de ID 2 com os novos dados
    response = client.put("/api/users/2", json=dados_atualizados)

    assert response.status_code == 200, \
        f"Atualização deve retornar 200, mas retornou {response.status_code}"

    body = response.json()

    # O campo 'updatedAt' confirma que a atualização foi registrada com timestamp
    assert "updatedAt" in body, \
        "Resposta de atualização deve conter o campo 'updatedAt' com o timestamp"

    # O updatedAt não deve ser uma string vazia
    assert body["updatedAt"], "Campo 'updatedAt' não deve ser vazio"


def test_delete_user_returns_204(client):
    """
    Deletar um usuário deve retornar status 204 No Content.

    O status 204 indica que a operação foi bem-sucedida mas não há conteúdo
    a retornar — comportamento padrão para operações DELETE em REST APIs.
    """
    # Envia DELETE para remover o usuário de ID 2
    response = client.delete("/api/users/2")

    # Status 204 No Content é o código correto para DELETE bem-sucedido
    assert response.status_code == 204, \
        f"Deleção deve retornar 204, mas retornou {response.status_code}"

    # O corpo da resposta deve estar vazio para um 204
    assert response.text == "", \
        f"Resposta 204 deve ter corpo vazio, mas continha: {response.text}"
