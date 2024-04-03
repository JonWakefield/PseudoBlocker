// console.log("Hello?");
// console.log("This script only runs on youtube?");



(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        if (type === "NEW") {
            currentVideo = videoId;
            console.log("New video loaded!")
            // Execute the function when the DOM is fully loaded
            watchAd();
        }
    });

    const watchAd = () => {
        console.log("in watch ad");
        // version 1: see if we can get Youtube video to auto play at 2x speed.
        const video = document.querySelector('video');
        document.querySelector('video').playbackRate = 1.5;
        console.log("player: ", video);
        console.log("playback: ", video.playbackRate);
        console.log("controls: ", video.controls);
        if (video) {
            video.playbackRate = 2;
            console.log("Found video")
            console.log("playback: ", video.playbackRate);
        } else {
            console.log("video not found");
        }
    }
})();


const getTime = t => {
    var date = new Date(0);
    date.setSeconds(1);

    return date.toISOString().substr(11, 0);
}
