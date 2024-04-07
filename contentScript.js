
const ADVIDEOSPEED = 16 // Ad speed
const ADSKIPINTERVAL = 500 // units: ms
const intervalLoops = 10; // number of tries to locate
  
chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, tab } = obj;

    if (type === "NEW") {
        
        let counter = 0;

        // setup an interval to check if an ad is present n times
        const interval = setInterval(() => {
            if (counter < intervalLoops) {
                let removedAd = adRemovalProccess();
                if (removedAd) {
                    clearInterval(interval);
                }
                counter++;
            } else {
                clearInterval(interval);
            }
        }, ADSKIPINTERVAL)
    }
});

function adRemovalProccess() {
    /* once a video has been found on the screen, this function is called and starts the ad "removal" process */
    // check if an ad is present
    adPresent = checkIfAd();
    let skippedAd = false;
    if (adPresent) {
        // change speed of ad:
        let speedChanged = changeVideoSpeed(ADVIDEOSPEED);
        if (!speedChanged) {
            return false;
        }

        // set up an interval to keep trying to skip the ad every `ADSKIPINTERVAL`
        const interval = setInterval(() => {
            skippedAd = tryAdSkip();
            if (skippedAd) {
                clearInterval(interval);
                return true;
            }
        }, ADSKIPINTERVAL)
        return true;
    }
    return false;
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

function tryAdSkip() {
    /* Tries to skip the ad every ADSKIPINTERVAL milliseconds */

    try {
        let adButton = document.querySelector('.ytp-ad-skip-button-modern.ytp-button'); // get the ad skip button from the DOM
        if (adButton) {
            adButton.click();
        } else {
            // no ad button present (either ad has been skipped now or ad can't be skipped)
            return true;
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
        return true;
    } else {
        return false;
    }
}