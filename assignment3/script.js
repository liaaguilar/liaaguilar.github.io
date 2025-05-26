// select all footer icons
const footerItems = document.querySelectorAll(".footer-icons");

// get the main screen section
const mainScreen = document.getElementById("main-screen");

// get all content sections (about, projects, etc)
const allSections = document.querySelectorAll(".content-page");

// track hovered footer icon
let hoveredFooterItem = null;

// lock scroll trigger so it doesn't repeat
let scrollLocked = false;

// animate a colored rectangle growing from the footer icon to the top of the screen
function animateRectangleToTop(
  item,
  color,
  labelText,
  onComplete,
  growSpeed = 40
) {
  // get label element inside the hovered footer icon
  const label = item.querySelector(".labels");
  const labelBox = label.getBoundingClientRect(); // get size/position of label

  // create the animated rectangle
  const rect = document.createElement("div");
  rect.classList.add("footer-animation");
  rect.style.backgroundColor = color;
  rect.style.left = `${labelBox.left}px`;
  rect.style.top = `${labelBox.top}px`;
  rect.style.width = `${labelBox.width}px`;
  rect.style.height = `${labelBox.height}px`;

  // add it to the page
  document.body.appendChild(rect);

  // remove highlight classes from all, then add active color to current icon
  footerItems.forEach((i) => i.classList.remove("active-color", "fading-out"));
  item.classList.add("active-color");

  let currentTop = labelBox.top;
  let currentHeight = labelBox.height;

  // immediately switch section content
  onComplete();

  // frame-by-frame animation to grow upward
  function grow() {
    if (currentTop <= 0) {
      rect.style.top = `0px`; // stick to top
      rect.style.height = `${labelBox.top + labelBox.height}px`; // final height
      rect.style.zIndex = 9999;
      rect.style.pointerEvents = "none";

      // fade the rectangle and the footer color after short delay
      setTimeout(() => {
        rect.style.transition = "opacity 0.6s ease";
        rect.style.opacity = "0";
        item.classList.add("fading-out");
      }, 100);

      // remove everything after fade
      setTimeout(() => {
        rect.remove();
        item.classList.remove("active-color", "fading-out");
        scrollLocked = false; // allow next scroll
      }, 700);

      return;
    }

    // shrink upward by growSpeed
    currentTop -= growSpeed;
    currentHeight += growSpeed;

    // if going off screen, clip height
    if (currentTop < 0) {
      currentHeight += currentTop;
      currentTop = 0;
    }

    // apply new position/size
    rect.style.top = `${currentTop}px`;
    rect.style.height = `${currentHeight}px`;

    requestAnimationFrame(grow); // continue animation
  }

  requestAnimationFrame(grow);
}

// switch to selected section and trigger animation
function goToSection(sectionId, labelText, color, item, growSpeed = 40) {
  animateRectangleToTop(
    item,
    color,
    labelText,
    () => {
      mainScreen.style.display = "none"; // hide main
      allSections.forEach((s) => (s.style.display = "none")); // hide all sections
      document.getElementById(sectionId).style.display = "block"; // show target
    },
    growSpeed // control animation speed
  );
}

// setup click and hover events on footer icons
footerItems.forEach((item, index) => {
  const labelText = item.querySelector("span").textContent; // get label text
  const sectionId = item.getAttribute("data-section"); // get target section id

  // predefined colors for each icon
  const bgColors = ["#e53935", "#fb8c00", "#fdd835", "#1e88e5", "#8e24aa"];
  const bgColor = bgColors[index % bgColors.length];

  // when clicked
  item.addEventListener("click", () => {
    if (scrollLocked) return; // prevent double triggers
    scrollLocked = true;
    goToSection(sectionId, labelText, bgColor, item, 40); // 40px/frame animation
  });

  // when hovered
  item.addEventListener("mouseenter", () => {
    hoveredFooterItem = { sectionId, labelText, bgColor, item };
  });

  item.addEventListener("mouseleave", () => {
    hoveredFooterItem = null; // clear hover state
  });
});

// allow scroll to trigger section switch while hovering
window.addEventListener(
  "wheel",
  (e) => {
    if (hoveredFooterItem && !scrollLocked) {
      e.preventDefault(); // prevent page scroll
      scrollLocked = true;
      const { sectionId, labelText, bgColor, item } = hoveredFooterItem;
      goToSection(sectionId, labelText, bgColor, item, 40);
    }
  },
  { passive: false }
);

// handle the back button animation to main screen
// add fade out to section, then fade in main
// gives smooth transition back

// when any back button is clicked
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("back-button")) {
    const visiblePage = Array.from(allSections).find(
      (s) => s.style.display === "block"
    );

    if (visiblePage) {
      visiblePage.classList.add("fade-out");

      // wait for fade to finish, then show main
      setTimeout(() => {
        visiblePage.style.display = "none";
        visiblePage.classList.remove("fade-out");

        mainScreen.classList.add("fade-in");
        mainScreen.style.display = "flex";

        setTimeout(() => {
          mainScreen.classList.remove("fade-in");
        }, 500); // remove class after animation
      }, 400);
    }
  }
});

// star pulse animation logic
// uses requestAnimationFrame to animate each star independently
function animatePulse(el, speed = 3000, scale = 1.2, phaseOffset = 0) {
  function tick() {
    const now = Date.now();
    const progress = ((now + phaseOffset) % speed) / speed; // 0-1 loop

    let s;
    if (progress < 0.5) {
      s = 1 + (scale - 1) * (progress * 2); // grow phase
    } else {
      s = scale - (scale - 1) * ((progress - 0.5) * 2); // shrink phase
    }

    el.style.transform = `translate(-50%, -50%) scale(${s})`; // apply scale
    requestAnimationFrame(tick); // next frame
  }

  tick(); // start animation
}

// apply pulse animation to each star
const stars = document.querySelectorAll(".star img");
stars.forEach((star) => {
  const speed = 2000 + Math.random() * 2000; // vary speed per star
  const scale = 1.1 + Math.random() * 0.3; // vary size change per star
  const offset = Math.random() * 5000; // desync animations
  animatePulse(star, speed, scale, offset);
});
