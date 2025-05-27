// Wait in background and listen to tab changes, wait until user navigates to Youtube

const TARGET_SITES = [
  "https://www.netflix.com",
  "https://play.max.com",
]


// called 1 time on download, displays a nice welcoming page :)
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: "onboarding.html"
    });
  }
});


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
  {
    urls: [
      "https://*.netflix.com/*",
    ]
  }
)


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("On updated called...")
  if (changeInfo.status === 'complete' && tab.url) {
    checkAndNotify(tabId, tab.url)
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log("On active called...")
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
      checkAndNotify(activeInfo.tabId, tab.url)
    }
  } catch (err) {
    console.error("Error getting tab info: ", err)
  }
})

function checkAndNotify(tabId, url) {
  const site = getMatchedSite(url)
  if (site) {
    console.log(`On site ${site}`)
    try {
      const response = chrome.tabs.sendMessage(tabId, {
        type: 'SITE_VISIT',
        site: site,
        url: url,
      });
    } catch (error) {
      console.log(`Caught error injecting content script on site ${site}: ${error}`);
    }
  }
}


function getMatchedSite(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes('youtube.com/watch')) {
      return 'youtube'
    } else if (hostname.includes("play.max.com")) {
      return 'hbo_max'
    }

    return null;
  } catch (err) {
    console.error(`Invalid Site: ${err}`);
    return null
  }
}


chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.type === 'CONTENT_SCRIPT_READY') {
    console.log("Content script ready on tab: ", sender.tab.id);

    if (sender.tab.url) {
      checkAndNotify(sender.tab.id, sender.tab.url);
    }

    response({ success: true })
  }


  return true;
})