const TaghashURL = {
  HEADERS_COMMON: {
    'Content-Type': 'application/json',
  },
  OAUTH2_AUTHORIZE: {
    method: 'POST',
    uri: '/oauth/authorize',
  },
  USER_PROFILE: {
    method: 'GET',
    uri: '/api/v1/auth',
  },
  DEVICE_REGISTER: {
    method: 'POST',
    uri: '/api/v2/auth/langur/chrome/register',
  },
  DEVICE_LOGIN: {
    method: 'POST',
    uri: '/api/v2/auth/langur/chrome/login',
  },
  DEAL_CREATE: {
    method: 'POST',
    uri: '/api/v3/deals',
  },
  INTERNAL_NOTES_UPDATE: {
    method: 'POST',
    uri: 'api/v1/pipelines'
  },
  TEXT_PARSE: {
    method: 'POST',
    uri: '/api/v3/langur/text-selection-parse'
  }
};
