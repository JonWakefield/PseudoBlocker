// general
const defaultVideoSpeed = 1

// Youtube
// const ytAppRoot = 'ytd-app';
const ytAppRoot = 'style-scope ytd-app';
const ytAdSkipButtonClassName = ".ytp-skip-ad-button";
const adSkipButtonOldYoutubeUi = ".ytp-ad-skip-button-icon-modern";
const ytAdBanner = '.ytp-ad-duration-remaining';
const ADVIDEOSPEED = 16 // Ad speed
const ADSKIPINTERVAL = 500 // units: ms

// HBO
const hboAppRoot = '#app-root';
const hboAdBanner = ".AdBadgeContainer-Beam-Web-Ent__sc-1jahjvv-1";
let hboAdPlaying = false;
let hboFastForward = false;
const HBOADSPEED = 5 // Ad speed


// Netflix
const nflxAdTimer = ".default-ltr-cache-mmvz9h";
const nflxAdSpeed = 16;
const nflxStopTime = 6;
const NFXLADTIMERCHECK = 80; // unit: ms


function findVideoElement() {
    return document.querySelector('video');
}

function adTimeRemaning(element) {
    let timeLeftSpan = document.querySelector(element);
    if (timeLeftSpan) {
        let timeLeft = timeLeftSpan.textContent;
        return parseInt(timeLeft, 10);
    }
    // this most likely means the polling took place after the ad ended, so return 0
    return 0;
}

function nflxWatchAd() {
    let speedChanged = changeVideoSpeed(nflxAdSpeed);
    if (!speedChanged) {
        return false;
    }
    const interval = setInterval(() => {
        let timeLeft = adTimeRemaning(nflxAdTimer);
        if (timeLeft <= nflxStopTime) {
            // set video speed back to 1x
            let speedChanged = changeVideoSpeed(defaultVideoSpeed);
            if (!speedChanged) {
                return false;
            }
            clearInterval(interval)
        }
    }, NFXLADTIMERCHECK)
}


function hboDomListener() {
    const adBanner = checkIfAd(hboAdBanner);
    if (adBanner) {
        // fast forward ad 
        const videoElement = findVideoElement();
        if (videoElement) {
            let speedChanged = changeVideoSpeed(HBOADSPEED);
            if (!speedChanged) {
                return false;
            }
            hboAdPlaying = true;
            return;
        }
    } else if (!adBanner && hboAdPlaying) {
        // return video speed back to 1x
        const videoElement = findVideoElement();
        if (videoElement) {
            let speedChanged = changeVideoSpeed(defaultVideoSpeed);
            if (!speedChanged) {
                return false;
            }
            hboAdPlaying = false;
            return;
        }
    }
}


chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const {type} = obj;
    if (type === "YT") {
        const videoElement = findVideoElement();
        if (videoElement) {
            const observer = new MutationObserver(ytDomListener);
            observer.observe(videoElement, { attributes: true, childList: true, subtree: true });
        } else {
        console.log("No <video> element found on the page.");
        }
    } else if (type === "HBO") {
        const appRoot = document.querySelector(hboAppRoot)
        if (appRoot) {
            const hboObserver = new MutationObserver(hboDomListener);
            hboObserver.observe(appRoot, {childList: true, subtree: true});
        } 
    } else if (type === "NFLX") {
        nflxWatchAd();
    }
});


function ytDomListener() {
    // check if an ad is present
    adPresent = checkIfAd(ytAdBanner);
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
