// helpers/petHelpers.js

const { spec } = require('pactum');
const { retryAsync } = require('../helpers/retryHelper');

/**
 * Cria um novo pet na Petstore API.
 * @param {object} overrides - Objeto com propriedades para sobrescrever o template PetRequest.
 * @returns {Promise<number>} O ID do pet criado.
 */
async function createPet(overrides = {}) {
  const defaultPetName = `AutoTestPet-${Date.now()}`;

  // Define os valores padrão para um pet
  const defaultData = {
    name: defaultPetName,
    photoUrls: [`https://example.com/photos/${defaultPetName}.jpg`],
    category: { "name": "Helper Created Category" },
    tags: [{ "id": 1, "name": "helper-tag" }],
  };

  // Mescla os dados padrão com os que foram passados, dando prioridade aos overrides
  const finalPetData = { ...defaultData, ...overrides };

  try {
    const response = await spec()
      .post('/pet')
      .withJson({
        "@DATA:TEMPLATE@": "PetRequest",
        "@OVERRIDES@": finalPetData
      })
      .expectStatus(200)
      .expectJsonSchema({
        type: 'object',
        properties: {
          id: { type: 'integer' },
          category: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string', minLength: 1 }
            },
            required: ['id', 'name']
          },
          name: { type: 'string', minLength: 1 },
          photoUrls: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'string',
              minLength: 1
            }
          },
          tags: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string', minLength: 1 }
              },
              required: ['id', 'name']
            }
          },
          status: {
            type: 'string',
            enum: ['available', 'pending', 'sold']
          }
        },
        required: ['id', 'category', 'name', 'photoUrls', 'tags', 'status']
      })
      .expectJsonLike(finalPetData)
      .stores('latestCreatedPetId', 'id');

    const createdId = response.json.id;
    // Agora o log usa o nome final que foi enviado para a API
    console.log(`[Helper] Pet criado: ID ${createdId}, Nome: ${finalPetData.name}`);
    return createdId;
  } catch (error) {
    console.log(`[Helper] Erro ao criar pet: ${error.message}`);
    throw error;
  }
}

/**
 * Deleta um pet da Petstore API.
 * @param {number} petId - O ID do pet a ser deletado.
 */
async function deletePet(petId) {
  try {
    await spec()
      .delete('/pet/{petId}')
      .withPathParams('petId', petId)
      .expectStatus(200);
    console.log(`[Helper] Pet deletado: ID ${petId}`);
  } catch (error) {
    console.log(`[Helper] Erro ao deletar pet ${petId}: ${error.message}`);
    throw error;
  }
}

/**
 * Aguarda um tempo específico em milissegundos.
 * @param {number} ms - Tempo em milissegundos.
 * @returns {Promise} Promise que resolve após o tempo especificado.
 */
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  createPet,
  deletePet,
  sleep
};