// Wait in background and listen to tab changes, wait until user navigates to Youtube

// called 1 time on download, displays a nice welcoming page :)
chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
      chrome.tabs.create({
        url: "onboarding.html"
      });
    }
  });


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      try {
        const response = chrome.tabs.sendMessage(tabId, {
          type: "YT",
          tab: tab,
        });
      } catch (error) {
        console.log("Caught error on Youtube: ", error);
      }
    }
    else if (tab.url && tab.url.includes("play.max.com/video")) {
        try {
          const response = chrome.tabs.sendMessage(tabId, {
              type: "HBO",
              tab: tab,
            });
        } catch (error) {
          console.log("Caught error on HBO: ", error);
        }
      }
    else if (tab.url && tab.url.includes("netflix.com/watch")) {
      try {
        const response = chrome.tabs.sendMessage(tabId, {
          type: "NFLX",
          tab: tab,
        });
      } catch (error) {
        console.log("Caught error accessing Netflix: ", error);
      }
    }
    }
});
