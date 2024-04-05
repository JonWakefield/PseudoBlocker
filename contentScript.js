

  
chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, videoId, window } = obj;

    if (type === "NEW") {
        currentVideo = videoId;
        console.log("New video loaded!")
        
        // TODO: need to find better way to wait for video to load: (for now just add small delays)
        setTimeout(() => {
            console.log('Delayed action');
            checkIfAd();
            // const video = document.querySelector('video');
            // // document.querySelector('video').playbackRate = 0.5;
            // console.log("player: ", video);
            // console.log("playback: ", video.playbackRate);
            // console.log("controls: ", video.controls);
            // if (video) {
            //     video.playbackRate = 2;
            //     console.log("Found video")
            //     console.log("playback: ", video.playbackRate);
            // } else {
            //     console.log("video not found");
            // }
        }, 2000); // 2000 milliseconds (2 seconds) delay
        // Execute the function when the DOM is fully loaded
    }
});

function checkIfAd() {
    /* Function checks if an ad is currently displayed on the DOM
        Possible Cases:
            1. No ad is present
            2. 1 ad is present
            2. 2 ads are present
    */
   const adSpanElement = document.querySelector('.ytp-ad-duration-remaining');

   // If the span element is found, get the div element inside it
    if (adSpanElement) {
        const divElement = adSpanElement.querySelector('.ytp-ad-text');
    
        // If the div element is found, extract its text content
        if (divElement) {
            const textContent = divElement.textContent.trim();
            console.log("Ad duration remaining: ", textContent); // Output: 0:14
        }
    } else {
        console.log("Could not find span element");
    }
    

}


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