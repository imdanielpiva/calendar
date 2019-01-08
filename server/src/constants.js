const REQUESTS_LENGTH = 500;
const SERVER_PORT = 3000;
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CREDENTIALS = {
  installed: {
    client_id: "844077204931-bk251o6uvpa80n45d6su5pcqjutvn0ka.apps.googleusercontent.com",
    project_id: "gcalendar-integration-227107",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://www.googleapis.com/oauth2/v3/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "bb7kqurB1y0qc5mmLTjxDd9w",
    redirect_uris: ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
  }
};

module.exports = {
  SCOPES,
  CREDENTIALS,
  SERVER_PORT,
  REQUESTS_LENGTH
};
