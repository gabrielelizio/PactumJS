// helpers/petHelpers.js

const { spec } = require('pactum');

/**
 * Cria um novo pet na Petstore API.
 * @param {object} overrides - Objeto com propriedades para sobrescrever o template PetRequest.
 * @returns {Promise<number>} O ID do pet criado.
 */
async function createPet(overrides = {}) {
  const uniquePetName = `AutoTestPet-${Date.now()}`;
  const uniquePhotoUrl = `https://example.com/photos/${uniquePetName}.jpg`;

  const response = await spec()
    .post('/pet')
    .withJson({
      "@DATA:TEMPLATE@": "PetRequest",
      "@OVERRIDES@": {
        "name": uniquePetName,
        "photoUrls": [uniquePhotoUrl],
        "category": { "name": "Helper Created Category" },
        "tags": [{ "id": 1, "name": "helper-tag" }],
        ...overrides
      }
    })
    .expectStatus(200) // 1. pm.test("Response status code is 200")
    .expectJsonSchema({ // Validações de estrutura e conteúdo detalhadas
      type: 'object',
      properties: {
        id: { type: 'integer' },
        category: {
          type: 'object', // 2. "Category object should exist" e ser um objeto
          properties: {
            id: { type: 'integer' },
            name: { type: 'string', minLength: 1 } // Nome da categoria não vazio
          },
          required: ['id', 'name']
        },
        name: { type: 'string', minLength: 1 }, // Nome do pet não vazio
        photoUrls: {
          type: 'array', // 3. "PhotoUrls is an array"
          minItems: 1,   // "contains at least one valid URL"
          items: {
            type: 'string', // "each URL is a non-empty string"
            minLength: 1
          }
        },
        tags: {
          type: 'array', // 4. "Tags array is present"
          minItems: 1,   // "contains the expected number of elements (at least one)"
          items: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string', minLength: 1 } // Nome da tag não vazio
            },
            required: ['id', 'name']
          }
        },
        status: {
          type: 'string', // 5. "Status must be a non-empty string"
          minLength: 1,   // "Value should not be empty"
          enum: ['available', 'pending', 'sold'] // Adiciona validação de ENUM para status
        }
      },
      // Garante que todos esses campos são obrigatórios na resposta
      required: ['id', 'category', 'name', 'photoUrls', 'tags', 'status']
    })
    .expectJsonLike({ // Valida que os campos sobrescritos estão na resposta (complementar ao schema)
      name: uniquePetName,
      photoUrls: [uniquePhotoUrl],
      category: { name: 'Helper Created Category' },
      tags: [{ name: 'helper-tag' }],
      ...overrides
    })
    .stores('latestCreatedPetId', 'id');

  const createdId = response.json.id;
  console.log(`[Helper] Pet criado: ID ${createdId}, Nome: ${uniquePetName}`);
  return createdId;
}

/**
 * Deleta um pet da Petstore API.
 * @param {number} petId - O ID do pet a ser deletado.
 */
async function deletePet(petId) {
  await spec()
    .delete('/pet/{petId}')
    .withPathParams('petId', petId)
    .expectStatus(200);
  console.log(`[Helper] Pet deletado: ID ${petId}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  createPet,
  deletePet,
  sleep
};