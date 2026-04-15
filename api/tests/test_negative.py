"""
Testes negativos e de fronteira para a API Reqres.in.

Testes negativos verificam como a API se comporta em situações incomuns:
- Recursos inexistentes
- Respostas com tipo de conteúdo correto
- Comportamento com parâmetros de delay

Um sistema robusto deve lidar bem com todos esses cenários,
retornando erros claros sem expor informações internas ou travar.

Cobertura:
- GET de usuário inexistente → 404 com body vazio
- GET de recurso inexistente → 404
- Validação de Content-Type → deve ser application/json
- Requisição com delay → deve responder dentro do timeout configurado
"""

import pytest


# Marcador para identificar estes testes como negativos
# Permite rodar apenas este grupo com: pytest -m negative
pytestmark = pytest.mark.negative


def test_get_nonexistent_user_returns_404_with_empty_body(client):
    """
    Buscar um usuário com ID inexistente deve retornar 404 com body vazio.

    O status 404 Not Found é o código correto quando o recurso não existe.
    O Reqres.in retorna um objeto vazio '{}' para esse caso — não retorna
    null nem uma mensagem de erro, o que é uma convenção válida de API REST.
    """
    # Buscamos o ID 23 — este ID não existe no Reqres.in (só existem IDs 1-12)
    response = client.get("/api/users/23")

    # 404 Not Found é o código semântico correto para recurso inexistente
    assert response.status_code == 404, \
        f"Usuário inexistente deve retornar 404, mas retornou {response.status_code}"

    body = response.json()

    # O Reqres.in retorna um objeto JSON vazio para recursos não encontrados
    assert body == {}, \
        f"Body de 404 deve ser objeto vazio, mas foi: {body}"


def test_get_nonexistent_resource_returns_404(client):
    """
    Buscar um recurso de lista inexistente deve retornar 404.

    O Reqres.in tem o endpoint /api/unknown para listar recursos.
    Paginar além dos dados disponíveis deve retornar 404 — a API
    não deve retornar dados inventados para páginas que não existem.
    """
    # Buscamos a página 3 do resource endpoint — o Reqres.in só tem 2 páginas
    # Isso simula um cliente tentando paginar além do limite dos dados
    response = client.get("/api/unknown/23")

    # A API deve retornar 404 para um recurso inexistente
    assert response.status_code == 404, \
        f"Recurso inexistente deve retornar 404, mas retornou {response.status_code}"


def test_api_response_has_json_content_type(client):
    """
    Respostas da API devem ter Content-Type application/json.

    O Content-Type correto é fundamental — clientes que parseiam a resposta
    precisam saber que é JSON. Se a API retornar text/html por engano,
    o parse JSON vai falhar e causar erros em cascata.
    """
    # Fazemos uma requisição simples para verificar o header de resposta
    response = client.get("/api/users")

    assert response.status_code == 200, \
        f"Requisição de verificação deve retornar 200, mas retornou {response.status_code}"

    # Verifica que o Content-Type indica JSON
    # O header pode ter o charset junto: "application/json; charset=utf-8"
    content_type = response.headers.get("content-type", "")
    assert "application/json" in content_type, \
        f"Content-Type deve ser application/json, mas foi: {content_type}"


def test_request_with_delay_responds_within_timeout(client):
    """
    Requisição com parâmetro delay deve responder dentro do timeout configurado.

    O Reqres.in suporta o parâmetro '?delay=N' para simular latência no servidor.
    Este teste verifica que nosso cliente aguarda a resposta sem timeout prematuro.

    O timeout do cliente está configurado em 30s no conftest.py — um delay de 3s
    deve ser tratado tranquilamente dentro desse limite.
    """
    # Envia requisição com delay de 3 segundos no servidor
    # O Reqres.in atrasa a resposta propositalmente por 3 segundos
    response = client.get("/api/users", params={"delay": 3})

    # A resposta deve chegar normalmente — nosso timeout é de 30s
    # Se o timeout fosse menor que 3s, receberiamos TimeoutException
    assert response.status_code == 200, \
        f"Requisição com delay de 3s deve retornar 200 dentro do timeout, " \
        f"mas retornou {response.status_code}"

    body = response.json()

    # Confirma que os dados ainda chegam corretamente mesmo com o delay
    assert "data" in body, \
        "Resposta com delay deve conter o campo 'data' normalmente"
