
// function initializeDoc(document) {
//     console.log("Website is now loaded!")

//     // Need to check if video is ad or not:

//     // console.log(document);
//     const video = document.querySelector('video');
//     // document.querySelector('video').playbackRate = 0.5;
//     console.log("player: ", video);
//     console.log("playback: ", video.playbackRate);
//     console.log("controls: ", video.controls);
//     if (video) {
//         video.playbackRate = 2;
//         console.log("Found video")
//         console.log("playback: ", video.playbackRate);
//     } else {
//         console.log("video not found");
//     }
// }

// document.onload = () => {
//     console.log("document loaded")
// }

// // check if we can click 'skip ad'
                // // TODO: fix this
                // try {
                //     let timeLeft = timeTellSkipDiv.textContent.trim();
                //     console.log("timeLeft: ", timeLeft);

                //     // NOTE: may want to first check if timeLeft is a number or just a string (if its a string, the ad can't be skipped)
                //     if (!isNaN(timeLeft)) {

                //         adPresent = checkIfAd();
                //         console.log("skipped ad...")
                //     } else {
                //         console.log("Cant skip ad...")
                //     }
                // } catch {
                //     // cant skip ad if here ??
                //     console.log("caught...")
                // }
                // setTimeout(() => {
                //     timeLeft = timeTellSkipDiv.textContent.trim();
                //     console.log("timeLeft: ", timeLeft);
                // }, 2000);


// const watchAd = () => {
    
//     console.log("in watch ad, waiting for load...");
//     window.onload = () => {
//         // initializeDoc(window.document);
//         console.log("In the load woah.")
//     }
//     console.log("Passed load...")

//     // // version 1: see if we can get Youtube video to auto play at 2x speed.
//     const video = document.querySelector('video');
//     document.querySelector('video').playbackRate = 0.5;
//     console.log("player: ", video);
//     console.log("playback: ", video.playbackRate);
//     console.log("controls: ", video.controls);
//     if (video) {
//         video.playbackRate = 2;
//         console.log("Found video")
//         console.log("playback: ", video.playbackRate);
//     } else {
//         console.log("video not found");
//     }
// }



// const getTime = t => {
//     var date = new Date(0);
//     date.setSeconds(1);

//     return date.toISOString().substr(11, 0);
// }





// Old approach, going to remove the need for `background.js`

// (() => {
//     let youtubeLeftControls, youtubePlayer;
//     let currentVideo = "";
//     let currentVideoBookmarks = [];

//     window.onload = () => {
//         // initializeDoc(window.document);
//         console.log("In the load in func woah.")
//     }

//     // chrome.runtime.onMessage.addListener((obj, sender, response) => {
//     //     const { type, value, videoId } = obj;

//     //     if (type === "NEW") {
//     //         currentVideo = videoId;
//     //         console.log("New video loaded!")
//     //         // Execute the function when the DOM is fully loaded
//     //         watchAd();
//     //     }
//     // });

//     // const watchAd = () => {
        
//     //     console.log("in watch ad, waiting for load...");
//     //     window.onload = () => {
//     //         // initializeDoc(window.document);
//     //         console.log("In the load woah.")
//     //     }
//     //     console.log("Passed load...")

//     //     // // version 1: see if we can get Youtube video to auto play at 2x speed.
//     //     // const video = document.querySelector('video');
//     //     // document.querySelector('video').playbackRate = 0.5;
//     //     // console.log("player: ", video);
//     //     // console.log("playback: ", video.playbackRate);
//     //     // console.log("controls: ", video.controls);
//     //     // if (video) {
//     //     //     video.playbackRate = 2;
//     //     //     console.log("Found video")
//     //     //     console.log("playback: ", video.playbackRate);
//     //     // } else {
//     //     //     console.log("video not found");
//     //     // }
//     // }

//     // function initializeDoc(document) {
//     //     console.log("Website is now loaded!")
//     //     console.log(document);
//     // }
// })();