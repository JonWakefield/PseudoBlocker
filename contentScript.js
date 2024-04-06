
const ADVIDEOSPEED = 16 // Ad speed
  
chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, videoId, window } = obj;

    if (type === "NEW") {
        currentVideo = videoId;
        console.log("New video loaded!")
        
        // TODO: need to find better way to wait for video to load: (for now just add small delays)
        setTimeout(() => {
            console.log('Delayed action');
            // check if an ad is present
            adPresent = checkIfAd();
            if (adPresent) {
                // const divElement = adSpanElement.querySelector('.ytp-ad-text');
                const timeTellSkipDiv = document.querySelector('.ytp-ad-text.ytp-ad-preview-text-modern') // note: this won't be present on a video with no ad

                // change speed of ad:
                changeVideoSpeed(ADVIDEOSPEED);

                // set up an interval to keep trying to skip the ad every 500 milliseconds
                const interval = setInterval(() => {
                    tryAdSkip(interval);
                }, 500)


            }
        }, 2000); // 2000 milliseconds (2 seconds) delay
    }
});


function tryAdSkip(intervalId) {
    try {
        let adButton = document.querySelector('.ytp-ad-skip-button-modern.ytp-button');
        if (adButton) {
            adButton.click();
        } else {
            // no ad button present (can't skip ad)
            clearInterval(intervalId);
        }
    } catch (error) {
        // haven't gotten error yet.. keep an eye out (could be fine if we get an error here...)
        console.log("tryAdSkip error: ", error);
    }
}

function checkIfAd() {
    /* Function checks if an ad is currently displayed on the DOM
        Possible Cases:
            1. No ad is present
            2. 1 ad is present
            2. 2 ads are present
    */

   // span element, tells us if an ad is present or not:
   const adSpanElement = document.querySelector('.ytp-ad-duration-remaining');
    if (adSpanElement) {
        return true;   
        // If the div element is found, extract its text content
    } 
    else {
        console.log("Could not find span element (no ad");
        return false;
    }
}

function changeVideoSpeed(speed) {
    /* Changes speed of the video element */
    const video = document.querySelector('video'); // NOTE: Maybe look for more precise element?
    // document.querySelector('video').playbackRate = 0.5;
    console.log("player: ", video);
    console.log("playback: ", video.playbackRate);
    console.log("controls: ", video.controls);
    if (video) {
        video.playbackRate = speed;
        console.log("Found video")
        console.log("playback: ", video.playbackRate);
    } else {
        console.log("video not found");
    }
}


// old way of checking if ad is skippable:
// // check if ad is skippable
// if (!isNaN(timeLeft)) {
//     console.log("skippable ad...")

// } else {
//     console.log("not a skippable ad...")
// }