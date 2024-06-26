// Wait in background and listen to tab changes, wait until user navigates to Youtube

// called 1 time on download, displays a nice welcoming page :)
chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
      chrome.tabs.create({
        url: "onboarding.html"
      });
    }
  });

let initiators = {
  NFLX: "https://www.netflix.com",
  HBO: "https://play.max.com",
}


// For now, dealing with Neflix seperatly via network requests (HBO & Youtube using mutation observers still)
chrome.webRequest.onBeforeRequest.addListener((details) => {
  let url = details.url
  if (url.includes("darnuid")) {
      let tabId = details.tabId
      try {
        const response = chrome.tabs.sendMessage(tabId, {
          type: "NFLX",
        });
      } catch (error) {
        console.error("Caught error sending message to netflix: ", error)
      }
  } 
}, 
  {urls: [
    "https://*.netflix.com/*",
  ]}
)


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
    }
});