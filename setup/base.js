// setup/base.js
const { request } = require('pactum');
require('dotenv').config(); 
const baseUrl = process.env.BASE_URL || 'https://petstore3.swagger.io/api/v3';
request.setBaseUrl(baseUrl);
