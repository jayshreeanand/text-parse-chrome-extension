var menuItem = {
    "id": "taghash",
    "title": "taghashDeal",
    "contexts": ["selection"]
};

function isValid(value) {
    // check for validity of selected text
  // return !isNaN(value) && 
  //        parseInt(Number(value)) == value && 
  //        !isNaN(parseInt(value, 10));
  return true
}

chrome.contextMenus.create(menuItem);

chrome.contextMenus.onClicked.addListener(function(clickData){   
    if (clickData.menuItemId == "taghash" && clickData.selectionText){    
        if (isInt(clickData.selectionText)){          
            chrome.storage.sync.get(['deal','content'], function(content){
                // save selection in chrome storage
            });
        }
    }
});
