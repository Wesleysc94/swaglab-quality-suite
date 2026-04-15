"""
Testes de autenticação para a API Reqres.in.

Este módulo testa os endpoints de registro e login da API.
Autenticação é uma funcionalidade crítica — um bug aqui pode expor
dados de usuários ou bloquear o acesso legítimo ao sistema.

Endpoints cobertos:
- POST /api/register → cadastro de novo usuário (com e sem senha)
- POST /api/login    → autenticação de usuário (com e sem senha)

Os emails utilizados são os que o Reqres.in reconhece como válidos
para operações de registro e login simulados.
"""

import pytest


# Marcador para identificar estes testes como de autenticação
# Permite rodar apenas este grupo com: pytest -m auth
pytestmark = pytest.mark.auth


def test_register_with_valid_credentials_returns_token(client):
    """
    Registro com email e senha válidos deve retornar status 200 e um token.

    O token gerado no registro é usado para autenticar requisições futuras.
    Sem o token, o usuário não conseguiria acessar recursos protegidos.
    """
    # Payload com credenciais válidas para o Reqres.in
    # Este email é reconhecido pela API simulada como um usuário registrável
    payload = {
        "email": "eve.holt@reqres.in",
        "password": "pistol",
    }

    # Envia POST para o endpoint de registro com as credenciais
    response = client.post("/api/register", json=payload)

    # Status 200 indica que o registro foi aceito com sucesso
    assert response.status_code == 200, \
        f"Registro válido deve retornar 200, mas retornou {response.status_code}"

    body = response.json()

    # O token deve estar presente na resposta — é o resultado do registro
    assert "token" in body, \
        "Registro bem-sucedido deve retornar um 'token' de autenticação"

    # O token não deve ser uma string vazia
    assert body["token"], \
        "Token retornado pelo registro não deve ser vazio"


def test_register_without_password_returns_400_with_error(client):
    """
    Registro sem senha deve retornar status 400 e mensagem de erro.

    Este é um teste de validação de entrada — a API deve rejeitar registros
    incompletos com um código de erro e mensagem descritiva.

    Um registro sem senha seria um problema de segurança grave, então
    a API deve rejeitá-lo explicitamente.
    """
    # Enviamos apenas o email, sem o campo 'password' obrigatório
    # Isso simula um cliente que enviou um payload incompleto
    payload = {
        "email": "eve.holt@reqres.in",
        # campo 'password' propositalmente ausente para testar a validação
    }

    # Envia POST para /api/register sem o campo "password"
    # Esperamos status 400 porque a API exige senha para registro
    response = client.post("/api/register", json=payload)

    assert response.status_code == 400, \
        f"Registro sem senha deve retornar 400, mas retornou {response.status_code}"

    body = response.json()

    # A API deve retornar um campo 'error' explicando o problema
    assert "error" in body, \
        "Resposta de erro deve conter o campo 'error' com a descrição do problema"

    # A mensagem de erro deve ser informativa (não vazia)
    assert body["error"], \
        "Mensagem de erro não deve ser vazia"


def test_login_with_valid_credentials_returns_token(client):
    """
    Login com credenciais válidas deve retornar status 200 e um token.

    O login é o fluxo mais crítico — é por onde os usuários acessam o sistema.
    O token retornado será usado em todas as requisições autenticadas seguintes.
    """
    # Credenciais de um usuário que o Reqres.in reconhece para login
    payload = {
        "email": "eve.holt@reqres.in",
        "password": "cityslicka",
    }

    # Envia POST para o endpoint de login com as credenciais
    response = client.post("/api/login", json=payload)

    # Status 200 indica autenticação bem-sucedida
    assert response.status_code == 200, \
        f"Login válido deve retornar 200, mas retornou {response.status_code}"

    body = response.json()

    # O token de autenticação deve estar presente na resposta
    assert "token" in body, \
        "Login bem-sucedido deve retornar um 'token' de autenticação"

    # O token não deve ser vazio — ele será usado nas requisições seguintes
    assert body["token"], \
        "Token retornado pelo login não deve ser vazio"


def test_login_without_password_returns_400_with_error(client):
    """
    Login sem senha deve retornar status 400 e mensagem de erro.

    Um login sem senha não deve ser aceito — isso seria uma brecha de segurança.
    A API deve validar a presença dos campos obrigatórios e rejeitar a requisição.
    """
    # Enviamos apenas o email, omitindo a senha propositalmente
    payload = {
        "email": "peter@klaven.com",
        # campo 'password' omitido para testar rejeição da API
    }

    # Envia POST para /api/login sem o campo "password"
    # Esperamos status 400 porque a API não deve autenticar sem senha
    response = client.post("/api/login", json=payload)

    assert response.status_code == 400, \
        f"Login sem senha deve retornar 400, mas retornou {response.status_code}"

    body = response.json()

    # A resposta deve incluir um campo 'error' descrevendo o problema
    assert "error" in body, \
        "Resposta de erro no login deve conter o campo 'error'"

    # A mensagem de erro não deve ser vazia
    assert body["error"], \
        "Mensagem de erro no login sem senha não deve ser vazia"
