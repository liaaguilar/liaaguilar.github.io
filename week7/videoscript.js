const myVideo = document.querySelector("#my-video");
console.log(myVideo);

// ------------------------------------------------------------------
// LOGIC FOR PLAYING VIDEO //
// first i need to fetch the right button for play

const playButton = document.querySelector("#play-button");
console.log(playButton);

// then i listen to the click events on that button
playButton.addEventListener("click", playVideo);

// whenever click happens, audio will play
function playVideo() {
  myVideo.play();
}

// ------------------------------------------------------------------

// ------------------------------------------------------------------
// LOGIC FOR PAUSING VIDEO //
// first i need to fetch the right button for pause

const pauseButton = document.querySelector("#pause-button");
console.log(pauseButton);

// then i listen to the click events on that button
pauseButton.addEventListener("click", pauseVideo);

// whenever click happens, audio will pause
function pauseVideo() {
  myVideo.pause();
}

// ------------------------------------------------------------------

// ------------------------------------------------------------------
// LOGIC FOR PLAY/PAUSE VIDEO //
// first i need to fetch the right button for the play and pause button

const playPauseButton = document.querySelector("#play-pause-button");
console.log(playPauseButton);

const playPauseImage = document.querySelector("#play-pause-img");
console.log(playPauseImage);

// then i listen to the click events on that button
playPauseButton.addEventListener("click", toggleVideo);

// whenever click happens, video will toggle between play and pause states with changing icon
function toggleVideo() {
  if (myVideo.paused || myVideo.ended) {
    myVideo.play();
    playPauseImage.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
  } else {
    myVideo.pause();
    playPauseImage.src = "https://img.icons8.com/ios-glyphs/30/play--v2.png";
  }
}

// ------------------------------------------------------------------
