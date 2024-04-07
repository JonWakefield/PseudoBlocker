// Wait in background and listen to tab changes, wait until user navigates to Youtube

// called 1 time on download, displays a nice welcoming page :)
chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
      chrome.tabs.create({
        url: "onboarding.html"
      });
    }
  });


chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    try {
      const response = chrome.tabs.sendMessage(tabId, {
          type: "NEW",
          tab: tab,
        });
    } catch (error) {
      console.log("Caught error: ", error);
    }
    }
});
