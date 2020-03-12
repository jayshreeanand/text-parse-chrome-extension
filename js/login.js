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

  var notifOptions = {
    type: "basic",
    iconUrl: "images/icon48.png",
    title: "Login success",
    message: "You have successfully logged into Taghash"
  };

  $('#sign-in-button').click(function(){
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
  });
});
