var menuItem = {
    "id": "taghash",
    "title": "Taghash Deal",
    "contexts": ["selection"]
};

// @see https://stackoverflow.com/a/37000388
chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create(menuItem);
});

chrome.contextMenus.onClicked.addListener(function(clickData, tab){
  if (clickData.menuItemId == "taghash" && clickData.selectionText){
    chrome.storage.sync.set({'content': clickData.selectionText }, function(data){
      //logger.debug(data)
    });
  }
});

chrome.storage.onChanged.addListener(function(changes, storageName){
  chrome.browserAction.setBadgeText({"text": "1"});
});
