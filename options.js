document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('options-form');
  
    // Load saved options
    chrome.storage.sync.get(['gitlabToken', 'queryUrl'], function(items) {
      console.log('Loaded items:', items); // Debugging line
      if (items.gitlabToken) {
        form.gitlabToken.value = items.gitlabToken;
      }
      if (items.queryUrl) {
        form.queryUrl.value = items.queryUrl;
      }
    });
  
    // Save options
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const gitlabToken = form.gitlabToken.value;
      const queryUrl = form.queryUrl.value;
      chrome.storage.sync.set({ gitlabToken, queryUrl }, function() {
        console.log('Saved items:', { gitlabToken, queryUrl }); // Debugging line
        alert('Options saved.');
      });
    });
  });
  