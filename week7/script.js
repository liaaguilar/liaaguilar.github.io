const airportAudio = document.querySelector("#airport-audio");
console.log(airportAudio);

// ------------------------------------------------------------------
// LOGIC FOR PLAYING SOUND //
// first i need to fetch the right button for play

const playButton = document.querySelector("#play-button");
console.log(playButton);

// then i listen to the click events on that button
playButton.addEventListener("click", playAudio);

// whenever click happens, audio will play
function playAudio() {
  airportAudio.play();
}

// ------------------------------------------------------------------

// ------------------------------------------------------------------
// LOGIC FOR PAUSING SOUND //
// first i need to fetch the right button for pause

const pauseButton = document.querySelector("#pause-button");
console.log(pauseButton);

// then i listen to the click events on that button
pauseButton.addEventListener("click", pauseAudio);

// whenever click happens, audio will pause
function pauseAudio() {
  airportAudio.pause();
}

// ------------------------------------------------------------------

// ------------------------------------------------------------------
// LOGIC FOR POP SOUND //
// first i need to fetch the right button for pop
// i also need to add the sound i want to use on click

const popSound = document.querySelector("#pop-sound");
console.log(popSound);

const popButton = document.querySelector("#pop-button");
console.log(popButton);

// then i listen to the click events on that button
popButton.addEventListener("click", popAudio);

// whenever click happens, audio will pop
function popAudio() {
  popSound.play();
}

// ------------------------------------------------------------------
