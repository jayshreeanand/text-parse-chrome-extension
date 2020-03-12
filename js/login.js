$(function(){
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

  $('#sign-in-button').click(function() {
    console.debug("dispatching");
    chrome.runtime.sendMessage({ dispatch: 'checkAuthOrLogin' });
  });
});
