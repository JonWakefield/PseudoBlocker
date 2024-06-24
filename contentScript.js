const defaultVideoSpeed = 1

// Youtube
const ytAdSkipButtonClassName = ".ytp-skip-ad-button";0
const adSkipButtonOldYoutubeUi = ".ytp-ad-skip-button-icon-modern";
const ytAdBanner = '.ytp-ad-duration-remaining';
const ADVIDEOSPEED = 16 // Ad speed
const ADSKIPINTERVAL = 500 // units: ms

// HBO
const hboAdBanner = ".AdBadgeContainer-Beam-Web-Ent__sc-1jahjvv-1";
const hboAppRoot = '#app-root';
let hboAdPlaying = false;
let hboFastForward = false;
const HBOADSPEED = 5 // Ad speed

// Netflix
const nflxAppRoot = '#appMountPoint';
// const nflxAdBanner = ".forward-anim default-ltr-cache-bwhi8r";
const nflxAdBanner = ".forward-anim";
let nflxAdPlaying = false;
const nflxAdSpeed = 16;

function domChangeListener(mutationsList, observer) {
    mutationsList.forEach(mutation => {
        // console.log("mutation observered, Checking for ad...")
        adRemovalProccess();
    });
  }


function findVideoElement() {
    return document.querySelector('video');
}

function nflxDomListener(mutationsList, observer) {
    // console.log("Checking for ad...")
    const adBanner = checkIfAd(nflxAdBanner);
    if (adBanner) {
        const videoElement = findVideoElement();
        if (videoElement) {
            // console.log("Changing speed...")
            let speedChanged = changeVideoSpeed(nflxAdSpeed);
            if (!speedChanged) {
                return false;
            }
            nflxAdPlaying = true;
            return;
        }
        
    } else if (!adBanner && nflxAdPlaying){
        // set speed back to 1x...
        // console.log("Ad ended!")
        const videoElement = findVideoElement();
        if (videoElement) {
            // console.log("Found video element")
            let speedChanged = changeVideoSpeed(defaultVideoSpeed);
            if (!speedChanged) {
                // console.log("Failed to change video speed!")
                return false;
            }
            nflxAdPlaying = false;
            return;
        }
    } else {
        // console.log("could not find an ad...")
    }
}

function hboDomListener(mutationsList, observer) {
    const adBanner = checkIfAd(hboAdBanner);
    if (adBanner) {
        // console.log("FOUND AD!!")
        // fast forward ad 
        const videoElement = findVideoElement();
        if (videoElement) {
            // console.log("Found video element")
            let speedChanged = changeVideoSpeed(HBOADSPEED);
            if (!speedChanged) {
                // console.log("Failed to change video speed!")
                return false;
            }
            hboAdPlaying = true;
            return;
        }
    } else if (!adBanner && hboAdPlaying) {
        // console.log("NO AD PLAYING...")
        // return video speed back to 1x
        const videoElement = findVideoElement();
        if (videoElement) {
            // console.log("Found video element")
            let speedChanged = changeVideoSpeed(defaultVideoSpeed);
            if (!speedChanged) {
                // console.log("Failed to change video speed!")
                return false;
            }
            hboAdPlaying = false;
            return;
        }
    }
}

chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, tab } = obj;
    if (type === "YT") {
        console.log("On Youtube...")
        const videoElement = document.querySelector('video');
        if (videoElement) {
            const observer = new MutationObserver(domChangeListener);
            observer.observe(videoElement, { attributes: true, childList: true, subtree: true });
        } else {
        console.log("No <video> element found on the page.");
        }
    } else if (type === "HBO") {
        const appRoot = document.querySelector(hboAppRoot)
        if (appRoot) {
            // console.log("creating a new hbo observer...")
            // set up MutationObserver to detect changes on the DOM, ultimitaly waiting for the video element to load
            const hboObserver = new MutationObserver(hboDomListener);
            hboObserver.observe(appRoot, {childList: true, subtree: true});
        } 
    } else if (type === "NFLX") {
        // console.log("In content")
        const appRoot = document.querySelector(nflxAppRoot);
        if (appRoot) {
            console.log("Found app root")
            const nflxObserver = new MutationObserver(nflxDomListener);
            nflxObserver.observe(appRoot, {childList: true, subtree: true});
        } else {
            console.log("Could not find root...")
        }

    }
});


function adRemovalProccess() {
    /* once a video has been found on the screen, this function is called and starts the ad "removal" process */
    // check if an ad is present
    adPresent = checkIfAd(ytAdBanner);
    let skippedAd = false;
    if (adPresent) {
        // console.log("FOUND AD!!")
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
    } else {
        // console.log("NO AD FOUND!!")
    }
    return false;
}

function checkIfAd(adBanner) {
    /* Function checks if an ad is present on the DOM */
    const adElement = document.querySelector(adBanner);
    if (adElement) {
        return true;   
    } 
    return false;
}

function tryAdSkip() {
    /* Tries to skip the ad every ADSKIPINTERVAL milliseconds */

    try {
        let adSkipButton = document.querySelector(ytAdSkipButtonClassName);
        let adSkipButtonOldUi = document.querySelector(adSkipButtonOldYoutubeUi);
        if (adSkipButton) {
            adSkipButton.click();
        }
        else if (adSkipButtonOldUi) {
            adSkipButtonOldUi.click();
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
    }
    return false;
}
