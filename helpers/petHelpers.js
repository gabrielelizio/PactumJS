// helpers/petHelpers.js

const { spec } = require('pactum');
const { retryAsync } = require('./retryHelper');

/**
 * Cria um novo pet na Petstore API.
 * Esta função é resiliente e tentará novamente em caso de erros de servidor (5xx).
 * @param {object} overrides - Objeto com propriedades para sobrescrever o template PetRequest.
 * @returns {Promise<number>} O ID do pet criado.
 */
async function createPet(overrides = {}) {
  const defaultPetName = `AutoTestPet-${Date.now()}`; // Garante nome único

  const defaultData = {
    name: defaultPetName,
    photoUrls: [`https://example.com/photos/${defaultPetName}.jpg`],
    category: { "name": "Helper Created Category" },
    tags: [{ "id": 1, "name": "helper-tag" }]
  };

  const finalPetData = { ...defaultData, ...overrides };

  try {
    const response = await retryAsync(
      () => spec()
        .post('/pet')
        .withJson({
          "@DATA:TEMPLATE@": "PetRequest",
          "@OVERRIDES@": finalPetData
        })
        .toss(),
      {
        retries: 5,
        delay: 2500,
        shouldRetry: (res) => {
          console.log(`[Helper] Tentativa de criar pet. Status: ${res.statusCode}`);
          return res.statusCode >= 500; // Tenta novamente em erros de servidor
        }
      }
    );

    if (response.statusCode !== 200) {
      throw new Error(`Falha ao criar o pet após várias tentativas. Último status: ${response.statusCode}, Body: ${JSON.stringify(response.body)}`);
    }

    const createdId = response.json.id;
    console.log(`[Helper] Pet criado com sucesso: ID ${createdId}, Nome: ${finalPetData.name}`);
    return createdId;
  } catch (error) {
    console.error(`[Helper] Erro final no processo de criação do pet: ${error.message}`);
    throw error; // Re-lança o erro para que o 'before' hook falhe e o Mocha saiba.
  }
}

/**
 * Deleta um pet da Petstore API.
 * Esta função é resiliente e tentará novamente em caso de erros de servidor (5xx).
 * Não lançará um erro se a deleção falhar, para evitar que falhas de cleanup quebrem a suíte de testes.
 * @param {number} petId - O ID do pet a ser deletado.
 */
async function deletePet(petId) {
  try {
    const response = await retryAsync(
      () => spec()
        .delete('/pet/{petId}')
        .withPathParams('petId', petId)
        .toss(),
      {
        retries: 5,
        delay: 2000,
        shouldRetry: (res) => res.statusCode >= 500,
      }
    );

    if (![200, 404].includes(response.statusCode)) {
      console.warn(`[Helper] AVISO: Falha ao deletar o pet ${petId} no cleanup. Último status: ${response.statusCode}`);
    } else {
      console.log(`[Helper] Pet ${petId} deletado com sucesso ou já não existia (Status: ${response.statusCode}).`);
    }
  } catch (error) {
    console.error(`[Helper] Erro durante o processo de deleção do pet ${petId}: ${error.message}`);
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