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
      return callback(token); // call the original callback now that we've intercepted what we needed
    } else {
      logger.debug("launchWebAuthFlow login failed. Is your redirect URL (" + chrome.identity.getRedirectURL("oauth2") + ") configured with your OAuth2 provider?");
      return (null);
    }
  });
}

function logout(cf, callback) {
  cf = cf || config;
  let logoutUrl = cf.baseUrl + cf.logoutUrl;

  chrome.identity.launchWebAuthFlow({'url': logoutUrl, 'interactive': false}, function (redirectUrl) {
    logger.debug('launchWebAuthFlow logout complete');
    return callback(redirectUrl)
  });
}

function parse(str) {
  if (typeof str !== 'string') {
    return {};
  }
  str = str.trim().replace(/^(\?|#|&)/, '');
  if (!str) {
    return {};
  }
  return str.split('&').reduce(function (ret, param) {
    let parts = param.replace(/\+/g, ' ').split('=');
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
    let key = parts.shift();
    let val = parts.length > 0 ? parts.join('=') : undefined;
    key = decodeURIComponent(key);
    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);
    if (!ret.hasOwnProperty(key)) {
      ret[key] = val;
    }
    else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    }
    else {
      ret[key] = [ret[key], val];
    }
    return ret;
  }, {});
}

function deviceRegister() {

}
