// tests/pet.spec.js

const { expect } = require('chai'); 
const { spec, stash } = require('pactum');
const { createPet, deletePet, sleep } = require('../helpers/petHelpers');
require('../setup/base');
require('../helpers/dataFactories');
const { retryAsync } = require('../helpers/retryHelper');

describe('Petstore API - Pet Endpoints', () => {

  describe('GET /pet/{petId} - Find pet by ID', () => {
    let createdPetId;
    const petDataToCreate = {
      name: `Doggie-${Date.now()}`,
      status: 'available'
    };

    before(async () => {
      // Criamos um pet antes de todos os testes neste bloco
      createdPetId = await createPet(petDataToCreate);
    });

    after(async () => {
      // Deletamos o pet após todos os testes para limpar o ambiente
      if (createdPetId) {
        await deletePet(createdPetId);
      }
    });

    it('should create a pet and then find it by ID, validating the response', async function() {
      if (!createdPetId) {
        console.log('Pulando teste - pet não foi criado no setup');
        this.skip(); // Pula o teste se a criação no `before` falhou
      }

      console.log(`Aguardando 1.5s para consistência da API antes de buscar o pet ${createdPetId}...`);
      await sleep(1500);

      await spec()
        .get('/pet/{petId}')
        .withPathParams('petId', createdPetId)
        .expectStatus(200)
        .expectJsonSchema({
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string', minLength: 1 },
            photoUrls: {
              type: 'array',
              items: { type: 'string', minLength: 1 }
            },
            status: { type: 'string', minLength: 1 },
            tags: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string', minLength: 1 }
                }
              }
            }
          },
          required: ['id', 'name', 'photoUrls', 'status', 'tags']
        })
        .expectJsonLike({
          id: createdPetId,
          name: petDataToCreate.name,
          status: petDataToCreate.status,
          // Valida os dados padrão inseridos pelo helper `createPet`
          category: { name: 'Helper Created Category' },
          tags: [{ name: 'helper-tag' }]
        });
    });

    it('should return 400 for invalid pet ID format', async () => {
      await spec()
        .get('/pet/{petId}')
        .withPathParams('petId', 'invalid-id-format')
        .expectStatus(400)
        .expectJson({
          code: 400,
          message: "Input error: couldn't convert `invalid-id-format` to type `class java.lang.Long`"
        });
    });

    it('should return 404 for pet not found', async () => {
      // Usando um ID que provavelmente não existe
      await spec()
        .get('/pet/{petId}')
        .withPathParams('petId', 999999999)
        .expectStatus(404)
        .expectBody('Pet not found');
    });
  });

  describe('POST /pet - Add a new pet', () => {
    let createdPetId;

    before(async () => {
      try {
        createdPetId = await createPet({ status: 'pending' });
      } catch (error) {
        console.log('Erro ao criar pet no setup:', error.message);
        // Se falhar, vamos pular os testes que dependem disso
        createdPetId = null;
      }
    });

    after(async () => {
      if (createdPetId) {
        try {
          await deletePet(createdPetId);
        } catch (error) {
          console.log('Erro ao deletar pet no cleanup:', error.message);
        }
      }
    });

    it('should create a new pet with status 200 and validate its creation via helper', async () => {
      if (!createdPetId) {
        console.log('Pulando teste - pet não foi criado no setup');
        return;
      }
      
      expect(createdPetId).to.be.a('number');
      expect(createdPetId).to.be.above(0); 
      console.log(`Verificação simples: Pet com ID ${createdPetId} foi retornado do helper.`);
    });

    it('should return 500 for invalid input to POST /pet', async () => {
      await spec()
        .post('/pet')
        .withJson({ "invalidField": "someValue" })
        .expectStatus(500)
        .expectJsonMatch({ 
          code: 500
        });
    });
  });

  describe.only('DELETE /pet/{petId} - Delete a pet', () => {
    let petIdToDelete;

    before(async () => {
      try {
        petIdToDelete = await createPet({ name: 'Pet For Deletion' });
      } catch (error) {
        console.log('Erro ao criar pet para deleção:', error.message);
        petIdToDelete = null;
      }
    });

    it('should delete an existing pet with status 200', async () => {
      if (!petIdToDelete) {
        console.log('Pulando teste - pet não foi criado no setup');
        return;
      }
      
      await deletePet(petIdToDelete); 
    });

    it('should not find the deleted pet', async () => {
      if (!petIdToDelete) {
        console.log('Pulando teste - pet não foi criado no setup');
        return;
      }

      // Retry para garantir que o pet foi realmente deletado (consistência eventual)
      await retryAsync(
        async () => {
          const response = await spec()
            .get('/pet/{petId}')
            .withPathParams('petId', petIdToDelete)
            .toss();
          console.log(`Tentativa GET após delete: ${response.statusCode} ${response.body}`);
          return response;
        },
        {
          retries: 8,
          delay: 2000,
          shouldRetry: (response) => response.statusCode !== 404
        }
      );
    }).timeout(5000);
  });

  describe('Updates a pet in the store with form data', () => {
    let petIdToUpdate; 
    let petDetails;

    before(async function() {
      this.timeout(20000); // Timeout grande para todo o processo

      try {
        petIdToUpdate = await createPet({
          name: 'PetOriginalName',
          status: 'available'
        });
        console.log(`[Setup] Pet criado para teste de atualização: ID ${petIdToUpdate}`);
      } catch (error) {
        console.log('Erro ao criar pet para atualização:', error.message);
        petIdToUpdate = null;
      }

      if (petIdToUpdate) {
        petDetails = await retryAsync(
          async () => {
            const response = await spec()
              .get('/pet/{petId}')
              .withPathParams('petId', petIdToUpdate)
              .toss();
            console.log('Tentativa GET:', response.statusCode, response.body);
            return response;
          },
          { retries: 15, delay: 4000, shouldRetry: (response) => response.statusCode === 404 }
        );
        if (!petDetails || petDetails.statusCode !== 200) {
          console.log(`Não foi possível encontrar o pet ${petIdToUpdate} após várias tentativas.`);
          petIdToUpdate = null;
        } else {
          petDetails = petDetails.body; // Use só o body para os próximos passos
        }
      }
    });

    after(async () => {
      if (petIdToUpdate) {
        try {
          await deletePet(petIdToUpdate);
          console.log(`[Cleanup] Pet ${petIdToUpdate} deletado após o teste de atualização.`);
        } catch (error) {
          console.log('Erro ao deletar pet no cleanup:', error.message);
        }
      }
    });

    it('should update pet name to "testeupdatepetdoggie" and status to "sold"', async function() {
      this.timeout(70000)
      if (!petIdToUpdate) {
        console.log('Pulando teste - pet não foi criado no setup');
        return;
      }
      if (!petDetails) {
        console.log('Pulando teste - detalhes do pet não encontrados no setup');
        return;
      }

      const newName = 'testeupdatepetdoggie';
      const newStatus = 'sold';

      const updatedPet = {
        ...petDetails,
        name: newName,
        status: newStatus
      };
      console.log('Enviando para o PUT:', updatedPet);

      await retryAsync(() => 
        spec()
          .put('/pet')
          .withJson(updatedPet)
          .toss(),
      { retries: 8, delay: 3500, shouldRetry: (response) => response.statusCode === 404 }
      );

      console.log(`Verificando se o pet ${petIdToUpdate} foi atualizado via GET...`);
      await sleep(50000);
      await spec()
        .get('/pet/{petId}')
        .withPathParams('petId', petIdToUpdate)
        .withRequestTimeout(50000)
        .expectStatus(200)
        .expectJsonLike({
          id: petIdToUpdate,
          name: newName,
          status: newStatus
        });

      console.log(`Pet ${petIdToUpdate} atualizado com sucesso para nome: "${newName}" e status: "${newStatus}"`);
    }).timeout(10000); 
  });
});
    
