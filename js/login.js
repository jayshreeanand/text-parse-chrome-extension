$(function() {
  chrome.runtime.sendMessage({ dispatch: 'checkAuthOrLogin' }, (response) => {
    if (response && response.success) {
      $('#loader').addClass('d-none');
      $('#add-deal').removeClass('d-none');
    }
  });
});
