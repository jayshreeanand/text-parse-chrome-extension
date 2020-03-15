var selection = document.getSelection();

// extract the information you need
// if needed, return it to the main script with messaging
function getDOM() {
  return document.getSelection();
}


$(document ).ready(function() {
  chrome.storage.sync.get(['content'], function(data){
    $("#internalNotes").val(data.content);
  });
});
