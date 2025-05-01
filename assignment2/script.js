// ============ VIDEO ============

// gets the custom video player element and remove the default controls so i can add my own
const video = document.querySelector("#custom-video-player");
video.removeAttribute("controls");

// ============ PLAY/PAUSE ============

// gets the play/pause button itself, and the actual image inside it
const playPauseBtn = document.querySelector("#play-pause-btn");
const playPauseImg = document.querySelector("#play-pause-img");

// when the user clicks, it switches between the function of togglePlayPause
playPauseBtn.addEventListener("click", togglePlayPause);

// code will occur if the play/pause buttin is clicked
function togglePlayPause() {
  // if the video is pause or ended, it will play the video and chance the icon to pause
  if (video.paused || video.ended) {
    video.play();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
    // if NOT paused or ended, it will pause the video, and chance the icon to play
  } else {
    video.pause();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
}

// ============ SCRUBBER ============

// gets the progress bar container, as well as the fill element
const progressBarContainer = document.querySelector("#progress-bar");
const progressBar = document.querySelector("#progress-bar-fill");

// as the video plays, it will do the updatePrgoressBar function
video.addEventListener("timeupdate", updateProgressBar);

// code runs when the video is playing
function updateProgressBar() {
  const value = (video.currentTime / video.duration) * 100; // calculates the percentage of the video played
  progressBar.style.width = value + "%"; // adjusts the width of the bar fill to match the percentage
}

// listens when the user clicks on the bar
progressBarContainer.addEventListener("click", (e) => {
  // gets the location of the bar relative to the screen, important because the user screen size varies
  const rect = progressBarContainer.getBoundingClientRect();
  // where the mouse was clicked in the x axis, subtracted from the left side  of where the progress bar starts on screen
  const x = e.clientX - rect.left;
  const width = rect.width; // variable for the width of the progress bar
  const percent = x / width; // find the percentage of the where the click was in progress bar

  // checks if the video has a valid duration
  if (!isNaN(video.duration)) {
    // if yes, then it jumps to the time based on the percentage
    video.currentTime = percent * video.duration;
  }
});

// ============ CHAPTER SKIPS ============

// gets all the chapter skip buttons from list
const chapterButtons = document.querySelectorAll(".chapter-buttons button");

// listens for click for each button
chapterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const time = parseInt(btn.getAttribute("data-time")); // gets the value of data-time (from the html)
    skipTo(time); // skips to the time if clicked
  });
});

// sets the video's current time to the skipped one
// useful so the buttons and their data-time is accurate
function skipTo(seconds) {
  video.currentTime = seconds;
}

// ============ VOLUME ============

// gets the colume control buttons
const volDownBtn = document.querySelector("#volume-down");
const volUpBtn = document.querySelector("#volume-up");

// listens for click for the volume down button
volDownBtn.addEventListener("click", () => {
  video.volume = Math.max(0, video.volume - 0.1); // when clicked, decrease volume by 10%
});

// listens for click for the volume up button
volUpBtn.addEventListener("click", () => {
  video.volume = Math.min(1, video.volume + 0.1); // when clicked, increase volume by 10%
});

// ============ FULLSCREEN ============

// gets the full screen button
const fullscreenBtn = document.querySelector("#fullscreen");

// listens for click
fullscreenBtn.addEventListener("click", () => {
  video.requestFullscreen(); // requests full screen
});

// ============ LIKE BUTTON ============

// gets the like button and the icon
const likeBtn = document.querySelector("#like-btn");
const likeIcon = document.querySelector("#like-icon");

let liked = false; // tracks the state (liked or not)

// listens for click
likeBtn.addEventListener("click", () => {
  liked = !liked; // flips the status of liked for every click
  likeBtn.classList.toggle("liked"); // adds or removes the css class
  likeIcon.textContent = liked ? "♥" : "♡"; //updates the heart symbol (i couldn't find a heart image i liked)
});

// ============ COMMENT SECTION ============

// gets the comment container and the add comment button
const commentsContainer = document.querySelector("#comments");
const addCommentBtn = document.querySelector("#add-comment-btn");

//listens for the click, if there is, it runs addComment
addCommentBtn.addEventListener("click", addComment);

// runs when add comment button is clicked
function addComment() {
  const input = document.getElementById("comment-input"); // gets the input box where user typed
  const commentText = input.value; // gets the text the user typed

  const comment = document.createElement("p"); // creates paragraph element to display the comment
  comment.textContent = commentText; // sets the content to what the user commented
  commentsContainer.appendChild(comment); // adds it to the comment container

  const noComment = document.getElementById("no-comments-placeholder"); // gets the placeholder text
  // checks if the message is there
  if (noComment) {
    noComment.style.display = "none"; // hide message when someone adds comment
  }

  input.value = ""; // still clears the input box
}
