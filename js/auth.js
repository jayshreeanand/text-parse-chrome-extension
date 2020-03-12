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

/**
 * Generates a string of random alphanumeric characters
 * @see https://stackoverflow.com/a/23854032/1068511
 * @return {String} Random token
 */
function authGetRandomToken() {
  // E.g. 8 * 32 = 256 bits token
  let randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  let hex = '';
  for (let i = 0; i < randomPool.length; ++i) {
      hex += randomPool[i].toString(16);
  }
  // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
  return hex;
};

/**
 * Checks the authorization status with the locally present access token
 * NOTE: Call this when user opens extension. If it throws error, call `authLogin`
 * @param  {Function} callback Callback fn: `callback(err, access_token)`
 */
function authCheckAuthorization(callback) {
  // Step 1: Fetch access_token from local storage
  authGetAccessToken((accessTokenErr, access_token) => {
    if (accessTokenErr) {
      return callback(accessTokenErr);
    }
    // Step 2: Fetch user's profile (so we can get user's email address)
    authGetUserProfile(access_token, (userProfileErr, user) => {
      if (userProfileErr || !user) {
        return callback(userProfileErr || new Error('Unauthorized'));
      }
      // If we are here, then access token is still valid
      return callback(null, access_token);
    });
  });
};

/**
 * Fetches access token from local storage, or returns null (if absent)
 * @param  {Function} callback Callback fn: `callback(err, access_token)`
 */
function authGetAccessToken(callback) {
  chrome.storage.local.get(['access_token'], (result) => {
    // https://developer.chrome.com/extensions/runtime#property-lastError
    if (chrome.runtime.lastError) {
      return callback(chrome.runtime.lastError);
    }
    callback(null, result.access_token);
  });
};

/**
 * Fetches user's email address and device token from local storage, or returns null (if absent)
 * @param  {Function} callback Callback fn: `callback(err, access_token)`
 */
function authGetUserEmailDeviceToken(callback) {
  chrome.storage.local.get(['email_primary', 'device_token'], (result) => {
    // https://developer.chrome.com/extensions/runtime#property-lastError
    if (chrome.runtime.lastError) {
      return callback(chrome.runtime.lastError);
    }
    callback(null, result);
  });
};

/**
 * High level abstraction over other login methods that calls either oauth flow,
 * with consent screen, or does background login with device token
 * @param  {Function} callback Callback fn: `callback(err, access_token)`
 */
function authLogin(callback) {
  // Fetch email address and device token from local storage
  authGetUserEmailDeviceToken((deviceTokenErr, result) => {
    if (deviceTokenErr) {
      return callback(deviceTokenErr);
    };
    if (result.email_primary && result.device_token) {
      // email_primary and device_token are present. Try silent login
      return authChromeLogin(callback);
    } else {
      // Either device_token is invalid or uninitialized. Need to take the user
      // through standard oauth flow (which shows a consent dialog)
      return authOauth2Login(callback);
    }
  });
};

/**
 * Login via oauth, and register a new device token. Shows a consent dialog to
 * the user
 * @param  {Function} callback Callback fn: `callback(err, access_token)`
 */
function authOauth2Login(callback) {
  let authUrl = config.baseUrl
      + config.authorizeUrl
      + '?response_type=' + config.responseType
      + '&client_id=' + config.clientId
      + '&redirect_uri=' + config.redirectUrl
      + '&scope=' + config.scopes
      + '&access_type=' + config.accessType
      + '&prompt=' + config.prompt;

  logger.debug('launchWebAuthFlow:', authUrl);

  // Step 1: Launch web auth flow
  chrome.identity.launchWebAuthFlow({'url': authUrl, 'interactive': true}, function (redirectUrl) {
    if (redirectUrl) {
      logger.debug('launchWebAuthFlow login successful: ', redirectUrl);
      let parsed = parse(redirectUrl.substr(config.redirectUrl.length + 1));
      token = parsed.access_token;
      const access_token = parsed.access_token;
      // Step 2: Fetch user's profile (so we can get user's email address)
      authGetUserProfile(access_token, (userProfileErr, user) => {
        if (userProfileErr) {
          return callback(userProfileErr);
        }
        // Step 2.1: Update user's email address in local storage
        chrome.storage.local.set({
          email_primary: user.email_primary
        }, function() {
          // https://developer.chrome.com/extensions/runtime#property-lastError
          if (chrome.runtime.lastError) {
            return callback(chrome.runtime.lastError);
          }
          // Step 3: Register the chrome device with backend
          authChromeDeviceRegister(access_token, (devRegErr, device_token) => {
            if (devRegErr) {
              return callback(devRegErr)
            };
            // Step 4: Login with the newly generated device token
            return authChromeLogin(callback);
          });
        });
      });
    } else {
      logger.debug("launchWebAuthFlow login failed. Is your redirect URL (" + chrome.identity.getRedirectURL("oauth2") + ") configured with your OAuth2 provider?");
      return callback(new Error(
        "launchWebAuthFlow login failed. Is your redirect URL (" +
        config.redirectUrl + ") configured with your OAuth2 provider?"));
    }
  });
};

/**
 * Fetches user's profile data
 * @param  {String}   access_token Access Token to use with the API request to
 *                                 fetch user profile
 * @param  {Function} callback     Callback fn: `callback(err, user)`
 */
function authGetUserProfile(access_token, callback) {
  if (!access_token) {
    return callback(new Error('Access token missing'));
  };
  const url = config.baseUrl + TaghashURL.USER_PROFILE.uri;
  const method = TaghashURL.USER_PROFILE.method;
  fetch(url, {
    method: method,
    headers: {
      ...TaghashURL.HEADERS_COMMON,
      Authorization: `Bearer ${access_token}`,
    },
    referrerPolicy: 'no-referrer', // no-referrer, *client
  }).then(r => r.json()).then(result => {
    if (result && result.success && result.data && result.data.user) {
      // Return `user` with callback
      return callback(null, result.data.user);
    } else {
      // unforeseen error handling
      return callback(new Error(result && !result.success ?
        result.message : 'Something went wrong'));
    }
  }).catch(callback);
};

/**
 * Register the user's device with backend services. Generates a new
 * `device_token` and registers it with backend.
 *
 * NOTE: Calling this aggressively when not necessary will lead to errors as
 * backend limits the number of registered, active device tokens per user.
 *
 * @param  {Function} callback Callback fn: `callback(err, device_token)`
 */
function authChromeDeviceRegister(access_token, callback) {
  // Fetch email address from local storage
  chrome.storage.local.get(['email_primary'], function(result) {
    // https://developer.chrome.com/extensions/runtime#property-lastError
    if (chrome.runtime.lastError) {
      return callback(chrome.runtime.lastError);
    }
    // If email_primary is absent, extension needs to be re-initialized
    if (!result.email_primary) {
      callback(new Error('Chrome extension not initialized'));
    }
    const url = config.baseUrl + TaghashURL.DEVICE_REGISTER.uri;
    const method = TaghashURL.DEVICE_REGISTER.method;
    // Generate a random device token for us to register with backend
    const device_token = authGetRandomToken();
    const data = {
      "device_token": device_token,
      "email_primary": result.email_primary,
      "client_id": config.clientId,
    };
    fetch(url, {
      method: method,
      headers: {
        ...TaghashURL.HEADERS_COMMON,
        Authorization: `Bearer ${access_token}`,
      },
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data),
    }).then(r => r.json()).then(result => {
      if (result && result.success) {
        // Update `device_token` in local storage
        chrome.storage.local.set({
          device_token: device_token
        }, function() {
          // https://developer.chrome.com/extensions/runtime#property-lastError
          if (chrome.runtime.lastError) {
            return callback(chrome.runtime.lastError);
          }
          // Return `device_token` with callback
          return callback(null, device_token);
        });
      } else {
        // unforeseen error handling
        return callback(new Error(result && !result.success ?
          result.message : 'Something went wrong'));
      }
    }).catch(callback);
  });
};

/**
 * Oauth Login with user's email address and device token, which is already
 * present in local storage. Once login is successful, access_token from the
 * response is stored back into local storage and token is resolved in callback
 * @param  {Function} callback Callback fn: `callback(err, access_token)`
 */
function authChromeLogin(callback) {
  // Fetch email address and device token from local storage
  authGetUserEmailDeviceToken((deviceTokenErr, result) => {
    if (deviceTokenErr) {
      return callback(deviceTokenErr);
    }
    // If either is absent, extension needs to be re-initialized
    if (!result.email_primary || !result.device_token) {
      callback(new Error('Chrome extension not initialized'));
    }
    const url = config.baseUrl + TaghashURL.DEVICE_LOGIN.uri;
    const method = TaghashURL.DEVICE_LOGIN.method;
    const data = {
      "device_token": result.device_token,
      "email_primary": result.email_primary,
      "client_id": config.clientId,
    };
    fetch(url, {
      method: method,
      headers: TaghashURL.HEADERS_COMMON,
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data),
    }).then(r => r.json()).then(result => {
      // If the result is successful, payload will have access token
      // Refer to server documentation for response structure
      if (result && result.success && result.data.access_token) {
        // Update `access_token` in local storage
        chrome.storage.local.set({
          access_token: result.data.access_token
        }, function() {
          // https://developer.chrome.com/extensions/runtime#property-lastError
          if (chrome.runtime.lastError) {
            return callback(chrome.runtime.lastError);
          }
          // Return `access_token` with callback
          return callback(null, result.data.access_token);
        });
      } else if (result && !result.success &&
        (result.code === 101 || result.message.indexOf('Unauthorized') > -1)) {
        // This API throws 401 unauthorized if
        // 1. device_token is invalid
        // 2. device_token is expired
        // In either case, we need to make the user go through loginWebAuthFlow
        // again. So we delete current `access_token` and `device_token` in
        // local storage, since they are stale now
        chrome.storage.local.remove(['access_token', 'device_token'], () => {
          return callback(new Error(result.message));
        });
      } else {
        // unforeseen error handling
        return callback(new Error(result && !result.success ?
          result.message : 'Something went wrong'));
      }
    }).catch(callback);
  });
};

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

function authCheckAuthOrLogin() {
  var notifOptions = {
    type: "basic",
    iconUrl: "images/icon48.png",
    title: "Login success",
    message: "You have successfully logged into Taghash"
  };
  authCheckAuthorization(function(authError, accessToken) {
    if (authError) { // check for error codes
      authLogin(function(loginError, accessToken) {
        if (loginError) {
          // login failure
          alert(loginError)
        } else {
          chrome.notifications.create('loginNotif', notifOptions);
        }
      });
    } else {
      chrome.notifications.create('loginNotif', notifOptions);
    }
  });
}
