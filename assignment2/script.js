// ============ VIDEO SETUP ============

const video = document.querySelector("#custom-video-player");
const playPauseBtn = document.querySelector("#play-pause-btn");
const playPauseImg = document.querySelector("#play-pause-img");
const progressBar = document.querySelector("#progress-bar-fill");

video.removeAttribute("controls");

video.addEventListener("timeupdate", updateProgressBar);

// ============ SCRUBBER ============

const progressBarContainer = document.querySelector("#progress-bar");

progressBarContainer.addEventListener("click", (e) => {
  const rect = progressBarContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const width = rect.width;
  const percent = x / width;

  if (!isNaN(video.duration)) {
    video.currentTime = percent * video.duration;
  }
});

playPauseBtn.addEventListener("click", togglePlayPause);

function togglePlayPause() {
  if (video.paused || video.ended) {
    video.play();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";
  } else {
    video.pause();
    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
}

function updateProgressBar() {
  const value = (video.currentTime / video.duration) * 100;
  progressBar.style.width = value + "%";
}

function skipTo(seconds) {
  video.currentTime = seconds;
}

const chapterButtons = document.querySelectorAll(".chapter-buttons button");
chapterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const time = parseInt(btn.getAttribute("data-time"));
    skipTo(time);
  });
});

const volDownBtn = document.querySelector("#vol-down");
const volUpBtn = document.querySelector("#vol-up");
const fullscreenBtn = document.querySelector("#fullscreen-btn");

volDownBtn.addEventListener("click", () => {
  video.volume = Math.max(0, video.volume - 0.1);
});

volUpBtn.addEventListener("click", () => {
  video.volume = Math.min(1, video.volume + 0.1);
});

fullscreenBtn.addEventListener("click", () => {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  }
});

// ============ LIKE BUTTON ============

const likeBtn = document.querySelector("#like-btn");
const likeIcon = document.querySelector("#like-icon");

let liked = false;

likeBtn.addEventListener("click", () => {
  liked = !liked;
  likeBtn.classList.toggle("liked");
  likeIcon.textContent = liked ? "♥" : "♡";
});

// ============ COMMENT SECTION ============

const commentsContainer = document.querySelector("#comments");
const addCommentBtn = document.querySelector(".comment-box button");

addCommentBtn.addEventListener("click", addComment);

function addComment() {
  const input = document.getElementById("comment-input");
  const commentText = input.value.trim();

  if (commentText !== "") {
    const comment = document.createElement("p");
    comment.textContent = commentText;

    commentsContainer.appendChild(comment);

    const placeholder = document.getElementById("no-comments-placeholder");
    if (placeholder) {
      placeholder.style.display = "none";
    }

    input.value = "";
  }
}
