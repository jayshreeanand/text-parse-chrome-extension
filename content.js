// // content.js
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if( request.message === "clicked_browser_action" ) {
//       var firstHref = $("a[href^='http']").eq(0).attr("href");

//       console.log(firstHref);
//     }
//   }
// );



// Save it using the Chrome extension storage API.
chrome.storage.sync.set({'foo': 'hello', 'bar': 'hi'}, function() {
  console.log('Settings saved');
});

// Read it using the storage API
chrome.storage.sync.get(['foo', 'bar'], function(items) {
  console.log('Settings retrieved', items);
});


chrome.storage.sync.get(null, function(items) {
  chrome.contextMenus.removeAll();
  var parent = chrome.contextMenus.create({"id": "tr_parent", "title": "Add as deal to Taghash", "contexts":["selection"]});
  // var id = chrome.contextMenus.create({"id": "tr_options", "title": "Edit as deal to taghash", "parentId": parent, "contexts":["selection"]});
  
});