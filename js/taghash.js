$('#create-deal-button').click(function(){
  var data = {
    "startup": { "name": "AJ Test" },
    "founder": {"user": {"email_primary": "founder@test.com" }}
  }

  let url = config.baseUrl + TaghashURL.DEAL_CREATE.uri;
  const method = TaghashURL.DEAL_CREATE.method;

  chrome.storage.local.get(['access_token'], function(result) {
    fetch(url,{
      method: method,
      headers: {
        ...TaghashURL.HEADERS_COMMON,
        Authorization: `Bearer ${result.access_token}`,
      },
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data)
    }).then(r => r.json()).then(result => {
      if (result && result.success && result.data) {
        // Return `user` with callback
         alert("success" + result.data)
      } else {
        // unforeseen error handling
         var error = new Error(result && !result.success ?
          result.message : 'Something went wrong');
          alert("failure" + JSON.stringify(result))
      }
    });
  });
});
