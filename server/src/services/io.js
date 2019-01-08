const Socket = require('socket.io');
const Utils = require('../utils');
const { google } = require('googleapis');
const {
  SCOPES,
  CREDENTIALS,
  REQUESTS_LENGTH
} = require('../constants');


let instance = { io: null, started: false, start };


module.exports = { ...instance };


function start(server) {
  const io = Socket(server);

  instance.started = true;
  instance.io = io;

  Utils.print.header('STARTED REAL TIME SERVICE');

  io.on('connection', (socket) => {
    socket.on('authflow::start', (userEmail) => {
      authorize(CREDENTIALS, socket, userEmail, getUserEvents);
    });
  });

  return io;
}

function authorize(credentials, socket, userEmail, callback) {
  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  getAccessToken(oAuth2Client, socket, userEmail, callback);
}

function getAccessToken(oAuth2Client, socket, userEmail, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'online',
    scope: SCOPES,
  });

  socket.emit('authflow::insertcodefrom', authUrl);

  socket.once('authflow::codeinserted', (code) => {
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        return socket.emit('ERROR');
      }

      oAuth2Client.setCredentials(token);

      callback(oAuth2Client, socket, userEmail);
    });
  });
}

function getUserEvents(auth, socket, userEmail) {
  const calendar = google.calendar({ version: 'v3', auth });

  Utils.print.header('STARTING');

  const stats = {
    size: 0,
    total: 0,
    failed: 0,
    successeful: 0
  };

  let didEmitEvent = false;

  for (let i = 0; i < REQUESTS_LENGTH; i += 1) {
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date(2010)).toISOString(),
      maxResults: 2500,
      singleEvents: true,
      orderBy: 'startTime',
    }, (error, response) => {
      const items = response ? response.data.items : [];

      if (error) {
        stats.failed += 1;
        stats.size += Utils.memorySizeOf({});

        Utils.print('ERROR', error);
      } else {
        if (!didEmitEvent) {
          socket.emit('authflow::end', items);

          didEmitEvent = true;
        }

        stats.successeful += 1;
      }

      stats.size += Utils.memorySizeOf(items);
      stats.total += 1;

      Utils.print('Request N°:', i, ' | ', 'Payload length:', items.length, stats.total);

      printResumeIfNeed(stats);
    });
  }
}

function printResumeIfNeed(stats) {
  if (stats.total === REQUESTS_LENGTH) {
    Utils.print.header('RESUME');

    Utils.print('Total requests:', stats.total);
    Utils.print('Failed requests:', stats.failed);
    Utils.print('Successeful requests:', stats.successeful);
    Utils.print('Low size transferred estimative:', Utils.formatByteSize(stats.size));
  }
}
