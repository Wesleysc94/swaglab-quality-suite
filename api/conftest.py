"""
Fixtures compartilhadas para os testes de API do projeto swaglab-quality-suite.

Fixtures são funções que preparam o ambiente antes de cada teste.
O pytest injeta automaticamente essas fixtures nos testes que as pedem —
basta declarar o nome da fixture como parâmetro da função de teste.

Exemplo de uso:
    def test_algo(client):  # pytest injeta 'client' automaticamente
        response = client.get("/posts")

Este arquivo é carregado automaticamente pelo pytest antes de qualquer teste.
"""

import httpx
import pytest

# URL base da API JSONPlaceholder — API pública e gratuita sem autenticação
# JSONPlaceholder é um fake JSON API ideal para prototipagem e testes
# Se a URL mudar, atualizamos apenas nesta constante
BASE_URL = "https://jsonplaceholder.typicode.com"


@pytest.fixture
def client():
    """
    Cria e fornece um cliente HTTP configurado para a API JSONPlaceholder.

    Usar um cliente em vez de chamadas avulsas com requests/httpx.get() é melhor porque:
    1. Reutiliza conexões TCP — mais rápido para múltiplas requisições
    2. Centraliza configurações — base_url, timeout e headers em um lugar
    3. Gerenciamento automático de recursos — o 'with' fecha a conexão ao final

    O 'yield' transforma esta função em um gerador:
    - Código ANTES do yield → setup (executado antes do teste)
    - yield c → fornece o cliente para o teste
    - Código APÓS o yield → teardown (executado após o teste, mesmo se falhar)
    """
    with httpx.Client(base_url=BASE_URL, timeout=30.0) as c:
        # Fornece o cliente configurado para o teste
        yield c
    # O contexto 'with' fecha a conexão automaticamente aqui
