$(function(){
  $('#sign-in-button').click(function(){
    login(null, function(token) {

      logger.debug(token)
      var notifOptions = {
        type: "basic",
        iconUrl: "images/icon48.png",
        title: "Login success",
        message: "You have successfully logged into Taghash"
      };

      chrome.notifications.create('loginNotif', notifOptions);
    });
  });
});
