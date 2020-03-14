$("#create-deal-button").click(function() {
  var startupName = $("#startupName").val();
  var founderEmail = $("#founderEmail").val();
  var internalNotes = $("#internalNotes").val();

  var data = {
    startup: { name: startupName },
    founder: { user: { email_primary: founderEmail } }
  };

  let url = config.baseUrl + TaghashURL.DEAL_CREATE.uri;
  const method = TaghashURL.DEAL_CREATE.method;

  chrome.storage.local.get(["access_token"], function(result) {
    fetch(url, {
      method: method,
      headers: {
        ...TaghashURL.HEADERS_COMMON,
        Authorization: `Bearer ${result.access_token}`
      },
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then(result => {
        if (result && result.success && result.data) {
          // post internal notes
          alert("success" + result.data);
        } else {
          // unforeseen error handling
          var error = new Error(
            result && !result.success ? result.message : "Something went wrong"
          );
          alert("failure" + JSON.stringify(result));
        }
      });
  });
});
