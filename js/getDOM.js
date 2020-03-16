var selection = document.getSelection();

// extract the information you need
// if needed, return it to the main script with messaging
function getDOM() {
  return document.getSelection();
}


$(document ).ready(function() {
  chrome.storage.sync.get(['content', 'startup_name', 'founder_email'], function(data){
    $("#internalNotes").val(data.content);
    $("#startupName").val(data.startup_name);
    $("#startupUrl").val(data.startup_url);
    $("#founderEmail").val(data.founder_email);
  });
});
