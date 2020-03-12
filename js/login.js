$(function(){
  $('#sign-in-button').click(function(){
    login(null, function(token) {
      
      logger.debug(token)
      // var notifOptions = {
      //   type: "basic",
      //   iconUrl: "images/icon48.png",
      //   title: "Login success",
      //   message: "You have successfully logged into Taghash"
      // }
      //
      // chrome.notifications.create('loginNotif', notifOptions)
    })

    // chrome.storage.sync.set({'total': 0}, function(){
    //   var notifOptions = {
    //       type: "basic",
    //       iconUrl: "icon48.png",
    //       title: "Login Success",
    //       message: "You have logged into"
    //   };

    //   chrome.notifications.create('resetNotif', notifOptions);

    //   });
  });
});
