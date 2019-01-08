const service = require('express').Router();
const axios = require('axios');

service.get('/', (request, response) => {
  response.status(200).json({ msg: 'Hooks' });
});

service.post('/', (request, response) => {
  axios.post();
});

module.exports = { path: '/web-hook', service };
