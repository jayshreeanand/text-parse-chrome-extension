$(function(){
  $('#sign-in-button').click(function(){
    chrome.storage.sync.set({'accessToken': '' }, function(){
      logger.debug("access token reset");

      login(null, function(token) {
        logger.debug(token)

        chrome.storage.sync.set({'accessToken': token }, function(){
          logger.debug("access token set");
        });
      });
    });
    // login(null, function(token) {
    //   logger.debug(token)
    //   var notifOptions = {
    //     type: "basic",
    //     iconUrl: "images/icon48.png",
    //     title: "Login success",
    //     message: "You have successfully logged into Taghash"
    //   };
    //
    //   chrome.notifications.create('loginNotif', notifOptions);
    // });
  });
});
