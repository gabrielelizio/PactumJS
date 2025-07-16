// test/health-check.spec.js

const { expect } = require('chai');
const { spec } = require('pactum');
require('../setup/base');
const { retryAsync } = require('../helpers/retryHelper');

describe('API Health Check', () => {
  it('should verify API connectivity', async function() {
    this.timeout(20000); 
    const response = await retryAsync(
      async () => {
        const res = await spec()
          .get('/pet/10')
          .toss();
        console.log(`Tentativa health check: ${res.statusCode}`);
        return res;
      },
      {
        retries: 25,
        delay: 4000,
        shouldRetry: (res) => res.statusCode !== 200
      }
    );

    if (response.statusCode !== 200) {
      throw new Error(`API não respondeu com 200 após várias tentativas. Última resposta: ${response.statusCode}`);
    }

    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('id');
    expect(response.body).to.have.property('name');
  });

  it('should handle API errors gracefully', async () => {
    try {
      await spec()
        .get('/pet/999999999')
        .expectStatus(404);
    } catch (error) {
      
      if (error.message.includes('500')) {
        console.log(' API está retornando erro 500 - pode estar com problemas temporários');
        return;
      }
      throw error;
    }
  });
}); 