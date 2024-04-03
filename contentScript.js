console.log("Hello?");
console.log("This script only runs on youtube?");



// (() => {
//     let youtubeLeftControls, youtubePlayer;
//     let currentVideo = "";

//     console.log("RAN?")

//     // add a message listener, listening from messages from the background.js script
//     chrome.runtime.onMessage.addListener((obj, sender, response) => {
//         const {type, value, videoId} = obj;
        
//         // check if a new video was loaded
//         if (type == "NEW") {
//             currentVideo = videoId;
//             // call function to handle video actions
//             newVideoLoaded();
//         }
//     });
// });