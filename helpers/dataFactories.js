const { stash, handler } = require('pactum');

stash.addDataTemplate({
  'PetRequest': {
    "id": "$F{randomNumber}", 
    "name": "Rex",
    "category": {
      "id": 1,
      "name": "Dogs"
    },
    "photoUrls": [
      "https://example.com/rex.jpg"
    ],
    "tags": [
      {
        "id": 10,
        "name": "friendly"
      }
    ],
    "status": "available"
  }
});

handler.addDataFuncHandler('randomNumber', () => {
  return Math.floor(Math.random() * 1000000); 
});