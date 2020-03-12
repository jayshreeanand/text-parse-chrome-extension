var menuItem = {
    "id": "taghash",
    "title": "taghashDeal",
    "contexts": ["selection"]
};

chrome.contextMenus.create(menuItem);

function isValid(value) {
    // check for validity of selected text
  return true
}

chrome.contextMenus.onClicked.addListener(function(clickData){
  if (clickData.menuItemId == "taghash" && clickData.selectionText){
    if (isValid(clickData.selectionText)){
      chrome.storage.sync.get(['deal','content'], function(values){
        // save selection in chrome storage

        chrome.storage.sync.set({'content': selectionText }, function(){

        });
      });
    }
  }
});


chrome.storage.onChanged.addListener(function(changes, storageName){
  chrome.browserAction.setBadgeText({"text": "new"});
});
