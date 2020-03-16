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

  chrome.storage.local.get(["access_token"], function(results) {
    fetch(url, {
      method: method,
      headers: {
        ...TaghashURL.HEADERS_COMMON,
        Authorization: `Bearer ${results.access_token}`
      },
      referrerPolicy: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(result => {
      $('#add-deal').addClass('d-none');
      $('#view-deal').removeClass('d-none');
    });
  });
});


function updateInternalNotesForDeal(accessToken, dealId, callback) {
  let url = config.baseUrl + TaghashURL.INTERNAL_NOTES_UPDATE.uri + '/' + dealId + '/notes';
  const method = TaghashURL.INTERNAL_NOTES_UPDATE.method;

  var notes = $("internalNotes").val();

  var data = {
    body_plain: notes
  };

  fetch(url, {
    method: method,
    headers: {
      ...TaghashURL.HEADERS_COMMON,
      Authorization: `Bearer ${accessToken}`
    },
    referrerPolicy: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(result => {
    if (result && result.success && result.data) {
      return callback(null, result.data);
    } else {
      // unforeseen error handling
      return callback(
        new Error(
          result && !result.success ? result.message : "Something went wrong"
        )
      );
    }
  })
  .catch(callback);
}
