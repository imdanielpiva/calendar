const IO = require('./services/io');
const API = require('./api');
const Http = require('http');

const { SERVER_PORT } = require('./constants');

const Server = Http.createServer(API);

IO.start(Server);

Server.listen(SERVER_PORT, () => `http://localhost:${SERVER_PORT}`);
