$(function(){
  $('#sign-in-button').click(function(){
    login()

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
