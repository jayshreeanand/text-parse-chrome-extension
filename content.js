// // Save it using the Chrome extension storage API.
// chrome.storage.sync.set({'foo': 'hello', 'bar': 'hi'}, function() {
//   console.log('Settings saved');
// });
//
// // Read it using the storage API
// chrome.storage.sync.get(['foo', 'bar'], function(items) {
//   console.log('Settings retrieved', items);
// });
//

// chrome.storage.sync.get(null, function(items) {
//   chrome.contextMenus.removeAll();
//   var parent = chrome.contextMenus.create({"id": "tr_parent", "title": "Add as deal to Taghash", "contexts":["selection"]});
//   // var id = chrome.contextMenus.create({"id": "tr_options", "title": "Edit as deal to taghash", "parentId": parent, "contexts":["selection"]});
//
// });
//
// var clickHandler = function(e) {
//   console.log('testing testing');
// }
//
// chrome.contextMenus.create({
//   "id": "taghash_context",
//   "title": "Taghash",
//   "contexts": ["page", "selection", "image", "link"]
// });

// Must be synchronously called on event page load,
//   for instance in the top level code
// chrome.contextMenus.onClicked.addListener(clickHandler);


// chrome.contextMenus.onClicked.addListener(function(info, tab) {
//   if (info.menuItemId == "tr_parent") {
//     click(info, tab);
//   } else {
//     // click(info, tab);
//   }
// });

// function click(info, tab) {

//   chrome.windows.create({
//     type: 'panel', url: 'https://translate.google.com/#auto/en'+'/'+ encodeURIComponent(info.selectionText), width: 1000, height: 382}, function(tab) {
//       translator_window = tab.windowId;
//       translator_tab = tab.id;
//       chrome.windows.onRemoved.addListener(function (windowId) {
//         if (windowId == translator_window) {
//           translator_window = false;
//           translator_tab = false;
//         }
//       });
//     }
//   );

  // var data = {
  //   "startup": { "name": "api company test" },
  //   "founder": {"user": {"email_primary": "founder@test.com" }}
  // }
  // // http://dev.taghash.com:3000/api/v3/deals

  // fetch('http://dev.taghash.com:3000/api/v3/deals',{
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   referrerPolicy: 'no-referrer', // no-referrer, *client
  //   body: JSON.stringify(data)
  // }).then(r => r.json()).then(result => {
  //   console.log(result)
  //   // Result now contains the response text, do what you want...
  // })



// }
