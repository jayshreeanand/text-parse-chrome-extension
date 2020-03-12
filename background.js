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
  console.debug("request", request);
  if(request.dispatch === "checkAuthOrLogin" ) {
    return authCheckAuthOrLogin();
  }
});
