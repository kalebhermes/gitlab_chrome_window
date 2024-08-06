chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openGitLab') {
      chrome.tabs.create({
        url: 'https://gitlab.com/sofiinc/mobile/sofi-mobile/-/merge_requests?scope=all&state=opened&author_username=khermes1'
      });
    }
  });
  