// setup/base.js
const { request } = require('pactum');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

// Define a URL base para todas as requisições do PactumJS
// Ele lê a variável de ambiente BASE_URL do seu arquivo .env
request.setBaseUrl(process.env.BASE_URL);

// Opcional: Você pode adicionar hooks globais aqui se precisar de
// lógica de setup/teardown que se aplica a todos os seus testes.
// Por exemplo, para obter um token de autenticação que será usado em todas as requisições.
//
// Exemplo de um hook 'before' global:
// before(() => {
//   // Lógica para obter token de autenticação e setar um header globalmente
//   // request.setDefaultHeaders('Authorization', `Bearer ${seuToken}`);
// });