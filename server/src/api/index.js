const Express = require('express');
const BodyParser = require('body-parser');
const Cors = require('cors');
const WebHook = require('./services/web-hook');

const API = Express();

API.use(Cors());
API.use(BodyParser.urlencoded({ extended: false }));
API.use(BodyParser.json());

API.use(WebHook.path, WebHook.service);

module.exports = API;
