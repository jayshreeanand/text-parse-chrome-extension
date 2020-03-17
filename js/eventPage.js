chrome.contextMenus.removeAll();

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
    textParse(clickData.selectionText, function(result) {
      chrome.storage.sync.set({
        'content': clickData.selectionText,
        'startup_name': result.startup.name,
        'startup_url': result.startup.url,
      }, function(data){
        //logger.debug(data)
      });
    })
  }
});

chrome.storage.onChanged.addListener(function(changes, storageName){
  chrome.browserAction.setBadgeText({"text": "1"});
  chrome.storage.sync.get(['content', 'startup_name', 'founder_email'], function(data){
    $("#internalNotes").val(data.content);
    $("#startupName").val(data.startup_name);
    $("#startupUrl").val(data.startup_url);
    $("#founderEmail").val(data.founder_email);
  });
});
