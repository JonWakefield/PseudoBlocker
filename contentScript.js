
const ADVIDEOSPEED = 16 // Ad speed
const ADSKIPINTERVAL = 500 // units: ms
  
chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, tab } = obj;

    if (type === "NEW") {
        
        // TODO: find better method to wait for video / ads to fully load 
        // in the meantime, 1.5 s seems to work well...
        setTimeout(() => {
            adRemovalProccess();
        }, 2000)
    }
});

function adRemovalProccess() {
    /* once a video has been found on the screen, this function is called and starts the ad "removal" process */
    // check if an ad is present
    adPresent = checkIfAd();
    if (adPresent) {
        // change speed of ad:
        let speedChanged = changeVideoSpeed(ADVIDEOSPEED);
        if (!speedChanged) {
            return false;
        }

        // set up an interval to keep trying to skip the ad every `ADSKIPINTERVAL`
        const interval = setInterval(() => {
            tryAdSkip(interval);
        }, ADSKIPINTERVAL)
    }
}

function checkIfAd() {
    /* Function checks if an ad is present on the DOM */

    // span element only present if ad is present
    const adSpanElement = document.querySelector('.ytp-ad-duration-remaining');
    if (adSpanElement) {
        return true;   
    } 
    return false;
}

function tryAdSkip(intervalId) {
    /* Tries to skip the ad every ADSKIPINTERVAL milliseconds */

    try {
        let adButton = document.querySelector('.ytp-ad-skip-button-modern.ytp-button'); // get the ad skip button from the DOM
        if (adButton) {
            adButton.click();
        } else {
            // no ad button present (either ad has been skipped now or ad can't be skipped)
            clearInterval(intervalId);
        }
    } catch (error) {
        // haven't gotten error yet.. keep an eye out (could be fine if we get an error here...)
        // console.log("tryAdSkip error: ", error);
    }
}



function changeVideoSpeed(speed) {
    /* Changes speed of the video element */
    const video = document.querySelector('video'); 
    if (video) {
        video.playbackRate = speed;
        console.log("Found video... changing speeds")
        return true;
    } else {
        console.log("video not found");
        return false;
    }
}