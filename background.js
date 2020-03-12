//  chrome.runtime.onInstalled.addListener(function() {
//     chrome.storage.sync.set({color: '#3aa757'}, function() {
//       console.log("The color is green.");
//     });
//   });


// // Called when the user clicks on the browser action.
// chrome.browserAction.onClicked.addListener(function(tab) {
//   // Send a message to the active tab
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     var activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
//   });
// });

//

// @see https://stackoverflow.com/a/18803575
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Why are we handling this in background?
  // @see https://stackoverflow.com/a/35728511
  if(request.dispatch === "checkAuthOrLogin" ) {
    authCheckAuthOrLogin((err, success) => {
      sendResponse({err: err, success: success});
    });
  }
  // To know why we return true here
  // @see https://support.google.com/chrome/thread/2047906?hl=en&msgid=32216677
  // If you are sending a message to background.js and using onMessage to receive
  // that message and perform an asynchronous action (like an ajax request),
  // you must return true; in onMessage to keep the message port open
  // while waiting for the callback to return.  Otherwise the message port
  // closes immediately before the ajax request can complete and invoke your callback.
  return true;
});
