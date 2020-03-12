$('#create-deal-button').click(function(){
  var data = {
    "startup": { "name": "api company test" },
    "founder": {"user": {"email_primary": "founder@test.com" }}
  }

  let url = config.baseUrl + TaghashURL.DEAL_CREATE.uri;
  const method = TaghashURL.DEAL_CREATE.method;

  authGetAccessToken((accessTokenErr, accessToken) => {
    if (accessTokenErr) {
      // handle access token not set
    }

    fetch(url,{
      method: method,
      headers: {
        ...TaghashURL.HEADERS_COMMON,
        Authorization: `Bearer ${accessToken}`,
      },
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data)
    }).then(r => r.json()).then(result => {
      // if (result && result.success && result.data) {
      //   // Return `user` with callback
      //   return callback(null, result.data);
      // } else {
      //   // unforeseen error handling
      //   return callback(new Error(result && !result.success ?
      //     result.message : 'Something went wrong'));
      // }
    })
  });
});
