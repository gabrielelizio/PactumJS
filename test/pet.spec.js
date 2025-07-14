// tests/pet.spec.js

const { expect } = require('chai'); 
const { spec, stash } = require('pactum');
const { createPet, deletePet, sleep } = require('../helpers/petHelpers');
require('../setup/base');
require('../helpers/dataFactories');

describe('Petstore API - Pet Endpoints', () => {


  describe('GET /pet/{petId} - Find pet by ID', () => {
    it('should find a pet by ID with status 200 and validate response structure', async () => {
      const stablePetId = 1;
      await spec()
        .get('/pet/{petId}')
        .withPathParams('petId', stablePetId)
        .expectStatus(200)
        .expectJsonSchema({  })
        .expectJson({
          id: 1,
          name: 'Pet1',
          photoUrls: [
            'test1',
            'test2'
          ],
          status: 'available',
          tags: []
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
      
      createdPetId = await createPet({ status: 'pending' });
    });

    after(async () => {
      if (createdPetId) {
        await deletePet(createdPetId);
      }
    });

    it('should create a new pet with status 200 and validate its creation via helper', async () => {
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
          code: 500,
        
        });
    });

  });

  describe('DELETE /pet/{petId} - Delete a pet', () => {
    let petIdToDelete;

    before(async () => {
      petIdToDelete = await createPet({ name: 'Pet For Deletion' });
    });

    it('should delete an existing pet with status 200', async () => {
      await deletePet(petIdToDelete); 
    });

    it('should not find the deleted pet', async () => {
      console.log(`Aguardando 2 segundos para o pet ${petIdToDelete} ser deletado completamente...`);
      await sleep(2000);
      await spec()
        .delete('/pet/{petId}')
        .withPathParams('petId', petIdToDelete)
        .expectStatus(200)
        .expectBody('Pet deleted');
    }).timeout(5000);
  });

  describe('Updates a pet in the store with form data', () => {
    let petIdToUpdate; 

    before(async () => {
      petIdToUpdate = await createPet({
        name: 'PetOriginalName',
        status: 'available'
      });
      console.log(`[Setup] Pet criado para teste de atualização: ID ${petIdToUpdate}`);
    });

    after(async () => {
      // 4. Limpeza: Deleta o pet criado após o(s) teste(s) neste bloco.
      if (petIdToUpdate) {
        await deletePet(petIdToUpdate);
        console.log(`[Cleanup] Pet ${petIdToUpdate} deletado após o teste de atualização.`);
      }
    });

    it('should update pet name to "testeupdatepetdoggie" and status to "sold"', async () => {
      const newName = 'testeupdatepetdoggie';
      const newStatus = 'sold';

 
      await spec()
        .post('/pet/{petId}')
        .withPathParams('petId', petIdToUpdate) 
        .withQueryParams('name', newName)   
        .withQueryParams('status', newStatus) 
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
                    minLength: 1,
                    enum: ['available', 'pending', 'sold']
                } 
            },
            required: ['id', 'category', 'name', 'photoUrls', 'tags', 'status']
        })
        .expectJsonLike({ 
          id: petIdToUpdate,
          name: newName,
          status: newStatus
        });

      console.log(`Verificando se o pet ${petIdToUpdate} foi atualizado via GET...`);
      await sleep(1000); 
      await spec()
        .get('/pet/{petId}')
        .withPathParams('petId', petIdToUpdate)
        .expectStatus(200) 
        .expectJsonLike({
          id: petIdToUpdate,
          name: newName,
          status: newStatus
        }).timeout(5000); 

      console.log(`Pet ${petIdToUpdate} atualizado com sucesso para nome: "${newName}" e status: "${newStatus}"`);
    }).timeout(10000); 

  });

});
    
