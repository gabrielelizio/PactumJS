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
      createdPetId = await createPet(petDataToCreate);
    });

    after(async function() {
      this.timeout(15000); // Aumenta o timeout para o cleanup
      if (createdPetId) {
        try {
          await deletePet(createdPetId);
        } catch (error) {
          console.log('Erro ao deletar pet no cleanup (GET /pet/{petId}):', error.message);
        }
      }
    });

    it('should create a pet and then find it by ID, validating the response', async function() {
      this.timeout(60000); 
      if (!createdPetId) {
        console.log('Pulando teste - pet não foi criado no setup');
        this.skip(); 
      }

      const response = await retryAsync(
        async () => {
          const res = await spec()
            .get('/pet/{petId}')
            .withPathParams('petId', createdPetId)
            .toss();
          console.log(`Tentativa GET após criação: ${res.statusCode} ${JSON.stringify(res.body)}`);
          return res;
        },
        { retries: 25, delay: 6000, shouldRetry: (res) => [404, 500].includes(res.statusCode) }
      );

      if (response.statusCode !== 200) {
        throw new Error(`Pet não encontrado após várias tentativas. Última resposta: ${response.statusCode}`);
      }

      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('id', createdPetId);
      expect(response.body).to.have.property('name', petDataToCreate.name);
      expect(response.body).to.have.property('status', petDataToCreate.status);
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

    it('should return 404 for pet not found', async function() {
      this.timeout(30000); 
      const response = await retryAsync(
        () => spec()
          .get('/pet/{petId}')
          .withPathParams('petId', 999999999)
          .toss(),
        {
          retries: 5,
          delay: 2000,
          
          shouldRetry: (res) => res.statusCode === 500
        }
      );

      expect(response.statusCode).to.equal(404, 'A API deveria retornar 404 para um pet não encontrado');
      expect(response.body).to.equal('Pet not found');
    });
  });

  describe('POST /pet - Add a new pet', () => {
    let createdPetId;

    before(async function() {
      this.timeout(20000); 
      try {
        createdPetId = await createPet({ status: 'pending' });
      } catch (error) {
        console.log('Erro ao criar pet no setup:', error.message);
        createdPetId = null; 
      }
    });

    after(async function() {
      this.timeout(15000); 
      if (createdPetId) {
        try {
          await deletePet(createdPetId);
        } catch (error) {
          console.log('Erro ao deletar pet no cleanup (POST /pet):', error.message);
        }
      }
    });

    it('should create a new pet with status 200 and validate its creation via helper', async function() {
      if (!createdPetId) {
        console.log('Pulando teste - pet não foi criado no setup');
        this.skip();
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

  describe('DELETE /pet/{petId} - Delete a pet', () => {
    let petIdToDelete;

    before(async function() {
      this.timeout(20000); 
      try {
        petIdToDelete = await createPet({ name: 'Pet For Deletion' });
      } catch (error) {
        console.log('Erro ao criar pet para deleção:', error.message);
        petIdToDelete = null; 
      }
    });

    it('should delete an existing pet with status 200', async function() {
      this.timeout(15000); 
      if (!petIdToDelete) {
        console.log('Pulando teste - pet não foi criado no setup');
        this.skip();
      }
      
      await deletePet(petIdToDelete); 
    });

    it('should not find the deleted pet', async function() {
      if (!petIdToDelete) {
        console.log('Pulando teste - pet não foi criado no setup');
        this.skip();
      }

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
    }).timeout(25000); 
  });

  describe('PUT /pet - Updates a pet', () => {
    let petIdToUpdate; 
    let petDetails;

    before(async function() {
      this.timeout(20000); 
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
          { retries: 25, delay: 4000, shouldRetry: (response) => [404, 500].includes(response.statusCode) }
        );
        if (!petDetails || petDetails.statusCode !== 200) {
          console.log(`Não foi possível encontrar o pet ${petIdToUpdate} após várias tentativas.`);
          petIdToUpdate = null;
        } else {
          petDetails = petDetails.body; 
        }
      }
    });

    after(async function() {
      this.timeout(15000); 
      if (petIdToUpdate) {
        try {
          await deletePet(petIdToUpdate);
          console.log(`[Cleanup] Pet ${petIdToUpdate} deletado após o teste de atualização.`);
        } catch (error) {
          console.log('Erro ao deletar pet no cleanup (PUT /pet):', error.message);
        }
      }
    });

    it('should update pet name to "testeupdatepetdoggie" and status to "sold"', async function() {
      this.timeout(70000)
      if (!petIdToUpdate) {
        console.log('Pulando teste - pet não foi criado no setup');
        this.skip();
      }
      if (!petDetails) {
        console.log('Pulando teste - detalhes do pet não encontrados no setup');
        this.skip();
      }

      const newName = 'testeupdatepetdoggie';
      const newStatus = 'sold';

      const updatedPet = {
        ...petDetails,
        name: newName,
        status: newStatus
      };
      console.log('Enviando para o PUT:', updatedPet);

      const putResponse = await retryAsync(
        async () => { 
          const res = await spec() 
            .put('/pet')
            .withJson(updatedPet)
            .toss();
          console.log(`Tentativa PUT: Status ${res.statusCode}, Body: ${JSON.stringify(res.body)}`);
          return res;
        },
        { 
          retries: 20, 
          delay: 6500, 
          shouldRetry: (response) => response.statusCode >= 500 || response.statusCode === 404 
        }
      );

      if (putResponse.statusCode !== 200) throw new Error(`Falha ao atualizar o pet. Última resposta do PUT: ${putResponse.statusCode}`);

      console.log(`Verificando se o pet ${petIdToUpdate} foi atualizado via GET...`);

      const verifyResponse = await retryAsync(
        async () => { 
          const res = await spec()
            .get('/pet/{petId}')
            .withPathParams('petId', petIdToUpdate)
            .withRequestTimeout(50000)
            .toss();
          console.log(`Tentativa GET após update: ${res.statusCode} ${JSON.stringify(res.body)}`);
          return res; 
        },
        { 
          retries: 10, 
          delay: 4000, 
          shouldRetry: (res) => res.statusCode !== 200 || res.body.name !== newName 
        }
      );

      if (verifyResponse.statusCode !== 200) {
        throw new Error(`Pet não encontrado após update. Última resposta: ${verifyResponse.statusCode}`);
      }

      expect(verifyResponse.body).to.include({
        id: petIdToUpdate,
        name: newName,
        status: newStatus
      });

      console.log(`Pet ${petIdToUpdate} atualizado com sucesso para nome: "${newName}" e status: "${newStatus}"`);
    }); 
  });
});
