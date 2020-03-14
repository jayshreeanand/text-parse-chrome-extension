$(function() {
  // $('#sign-in-button2').click(function(){
  //   chrome.storage.sync.set({'accessToken': '' }, function(){
  //     logger.debug("access token reset");
  //
  //     login(null, function(token) {
  //       logger.debug(token)
  //
  //       chrome.storage.sync.set({'accessToken': token }, function(){
  //         logger.debug("access token set");
  //       });
  //     });
  //   });

  chrome.runtime.sendMessage({ dispatch: "checkAuthOrLogin" }, response => {
    if (response && response.success) {
      $("#loader").addClass("d-none");
      $("#add-deal").removeClass("d-none");
    }
  });
});
