// @see https://github.com/michaeloryl/oauth2-angularjs-chrome-extension-demo/blob/master/app/scripts/background.js

let token = null;

let logger = console;

function init(cfg, log) {
  config = cfg;
  logger = log;
}

function getLastToken() {
  return token;
}

function login(cf, callback) {
  cf = cf || config;
  let authUrl = cf.baseUrl
      + cf.authorizeUrl
      + '?response_type=' + cf.responseType
      + '&client_id=' + cf.clientId
      + '&redirect_uri=' + cf.redirectUrl
      + '&scope=' + cf.scopes
      + '&access_type=' + cf.accessType
      + '&prompt=' + cf.prompt;

  logger.debug('launchWebAuthFlow:', authUrl);

  chrome.identity.launchWebAuthFlow({'url': authUrl, 'interactive': true}, function (redirectUrl) {
    if (redirectUrl) {
      logger.debug('launchWebAuthFlow login successful: ', redirectUrl);
      let parsed = parse(redirectUrl.substr(cf.redirectUrl.length + 1));
      token = parsed.access_token;
      logger.debug('Background login complete');
      return callback(redirectUrl); // call the original callback now that we've intercepted what we needed
    } else {
      logger.debug("launchWebAuthFlow login failed. Is your redirect URL (" + chrome.identity.getRedirectURL("oauth2") + ") configured with your OAuth2 provider?");
      return (null);
    }
  });
}