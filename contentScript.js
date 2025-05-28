// general
const defaultVideoSpeed = 1
let observers = {
    youtube: null,
    hbo_max: null,
}

// Youtube
// const ytAppRoot = 'ytd-app';
const ytAppRoot = 'style-scope ytd-app';
const ytAdSkipButtonClassName = ".ytp-skip-ad-button";
const adSkipButtonOldYoutubeUi = ".ytp-ad-skip-button-icon-modern";
const ytAdBanner = '.ytp-ad-duration-remaining';
const ADVIDEOSPEED = 16 // Ad speed
const ADSKIPINTERVAL = 500 // units: ms

// HBO
const HBO_DOM = {
    appRoot: '#app-root',
    // adBanner: ".AdBadgeContainer-Beam-Web-Ent__sc-1jahjvv-1",
    adBanner: ".AdLabel-Fuse-Web-Play__sc-1jahjvv-2",
    adPlaying: false,
    fastForward: false,
    adSpeed: 5,
}

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


function hboDomListener() {
    const adBanner = checkIfAd(HBO_DOM.adBanner);
    if (adBanner) {
        console.log("Ad planning!")
        // fast forward ad 
        const videoElement = findVideoElement();
        if (videoElement) {
            let speedChanged = changeVideoSpeed(HBO_DOM.adSpeed);
            if (!speedChanged) {
                return false;
            }
            HBO_DOM.adPlaying = true;
            return;
        }
    } else if (!adBanner && HBO_DOM.adPlaying) {
        // return video speed back to 1x
        const videoElement = findVideoElement();
        if (videoElement) {
            let speedChanged = changeVideoSpeed(defaultVideoSpeed);
            if (!speedChanged) {
                return false;
            }
            HBO_DOM.adPlaying = false;
            return;
        }
    }
}


async function setupMaxObserver() {
    if (observers.hbo_max)
        return

    const appRoot = document.querySelector(HBO_DOM.appRoot)
    if (appRoot && !observers.hbo_max) {
        console.log("Creating an observer for HBO Max...")
        const hboObserver = new MutationObserver(hboDomListener);
        hboObserver.observe(appRoot, { childList: true, subtree: true });
        observers.hbo_max = true;
    } else {
        console.log("App root not found, retrying ...")
        setTimeout(() => setupMaxObserver(), 1000);
    }
}

async function handleSiteVisit(msg) {
    const site = msg.site;
    switch (site) {
        case "youtube":
            console.log("On youtube...")
            const videoElement = findVideoElement();
            if (videoElement) {
                const observer = new MutationObserver(ytDomListener);
                observer.observe(videoElement, { attributes: true, childList: true, subtree: true });
            } else {
                console.log("No <video> element found on the page.");
            }
            break
        case "hbo_max":
            console.log("On Max...")
            await setupMaxObserver();
            break
        default:
            console.log("Unrecognized site: ", site);
    }
}


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    // This is where background.js sends a message to contentScript.js to create a mutation observer

    if (msg.type === "SITE_VISIT") {
        handleSiteVisit(msg).then(() => {
            sendResponse({ success: true });
        }).catch((err) => {
            console.error("Error handling site visit: ", err)
            sendResponse({ success: false, error: err.message });
        });

        return true; // keep the message channel open
    }
});

chrome.runtime.sendMessage({
    type: "CONTENT_SCRIPT_READY",
    url: window.location.href,
}).catch(err => {
    console.log('Could not notify background script: ', err.message);
})


function cleanupObserver(site) {
    if (observers[site]) {
        console.log(`Cleaning up observer for ${site}`)
        observers[site].disconnect();
        observers[site] = null;
    }
}

function cleanupAllObservers() {
    Object.keys(observers).forEach(site => {
        cleanupObserver(site);
    })
}

window.addEventListener("beforeunload", () => {
    cleanupAllObservers();
})

// Debug function to check observer status
window.debugObservers = function () {
    console.log('Observer status:', {
        youtube: observers.youtube ? 'active' : 'inactive',
        hbo_max: observers.hbo_max ? 'active' : 'inactive'
    });
};