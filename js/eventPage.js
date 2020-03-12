var menuItem = {
    "id": "taghash",
    "title": "Taghash Deal",
    "contexts": ["selection"]
};

chrome.contextMenus.create(menuItem);

chrome.contextMenus.onClicked.addListener(function(clickData, tab){
  if (clickData.menuItemId == "taghash" && clickData.selectionText){
    // logger.debug(data);

    // chrome.tabs.executeScript(tab.id, {file: "jquery-3.2.0.min.js"}, function () {
    //     chrome.tabs.executeScript(tab.id, {file: "jquery-1.10.4-ui.min.js"}, function () {
    //         chrome.tabs.executeScript(tab.id, {
    //             file: "getDOM.js",
    //         });
    //     });
    // });
    //
    chrome.tabs.executeScript(tab.id, { code: "document.getSelection()" }, function(DOMdata) {
      alert(JSON.stringify(DOMdata))
      chrome.storage.sync.set({'content': JSON.stringify(DOMdata) }, function(data){
      });
    })
  }
});

chrome.storage.onChanged.addListener(function(changes, storageName){
  chrome.browserAction.setBadgeText({"text": "1"});
});
