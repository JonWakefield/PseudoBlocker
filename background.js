// Wait in background and listen to tab changes, wait until user navigates to Youtube

// called 1 time on download, displays a nice welcoming page :)
chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
      chrome.tabs.create({
        url: "onboarding.html"
      });
    }
  });


// async function getCurrentTab() {
//     console.log("In current tab!")
//     let queryOptions = { active: true, lastFocusedWindow: true };
//     // `tab` will either be a `tabs.Tab` instance or `undefined`.
//     let [tab] = await chrome.tabs.query(queryOptions);
//     return tab;
// }

// listen to tabs:
// chrome.tabs.onUpdated.addListener((tabId, tab) => {
//     console.log("Tab changed!");
//     const message = "Hello! :)"
//     const response = chrome.tabs.sendMessage(tab.id, message);
// })
// chrome.tabs.onUpdated.addListener((tabId, tab) => {
//     console.log("TAB CHANNGED!")
//     // look for youtube tabs
//     if (tab.url && tab.url.includes("youtube.com/watch")) {
        
//         const queryParameters = tab.url.split("?")[1];
//         const urlParameters = new URLSearchParams(queryParameters);
//         console.log("URL params: ", urlParameters);
        
//         // send a message to the contentScript, letting script know a video has been loaded
//         chrome.tabs.sendMessage(tabId, {
//             type: "NEW",
//             videoId: urlParameters.get("v"),
//         })

//     }
// })