// the javascript was actually my favorite part! i do creative coding as my studio
// and i feel so great that i can actually do fancy javascript stuff because of it!
// although it is a bit different because im working with stuff existing is html and css already
// whereas the studio we make everything on js. still was really fun though! although i
// do get so confused with javascript...

// ============= FOOTER NAVIGATION ===========================
// basically just all the footer things and the variables needed for everything to work

// attaches variable names to the different elements for use later!!
const footerItems = document.querySelectorAll(".footer-icons");
const mainScreen = document.getElementById("main-screen");
const allSections = document.querySelectorAll(".content-page");
const myName = document.querySelector(".my-name");
const starElems = document.querySelectorAll(".star");
const bgBoxes = document.querySelectorAll(".background-box");

let hoveredFooterItem = null; // tracks which footer icon is hovered
let scrollLocked = false; // preventts multiple animations to happen at once
let lastDirection = null; //tracks scroll direction for the zoome ffct
let lastScrollTime = 0; // timestamp

// ==================== ICON FOOTER ANIMATION ===========================
// the animation that happens when you click on the footer icon (the rectangle that grows upwards!)

function animateRectangleToTop(
  item,
  color,
  labelText,
  onComplete,
  growSpeed = 40
) {
  const label = item.querySelector(".labels");
  const labelBox = label.getBoundingClientRect(); // finds the exact position of that ico
  const rect = document.createElement("div"); // creates a rectagnle class for the animation

  rect.classList.add("footer-animation"); // adds the styling
  rect.style.backgroundColor = color; // sets background color

  // positions the rectangle exactly over the label's position
  rect.style.left = `${labelBox.left}px`;
  rect.style.top = `${labelBox.top}px`;
  rect.style.width = `${labelBox.width}px`;
  rect.style.height = `${labelBox.height}px`;
  document.body.appendChild(rect);

  footerItems.forEach((i) => i.classList.remove("active-color", "fading-out")); // removes color and fading out from footer
  item.classList.add("active-color"); // highlight the clicked item

  // tracks the rectangle as it animates
  let currentTop = labelBox.top;
  let currentHeight = labelBox.height;
  onComplete();

  //grow function
  function grow() {
    // if the top of the rectangle has reached the top of the screen:
    if (currentTop <= 0) {
      rect.style.top = `0px`; // lock it to the top
      rect.style.height = `${labelBox.top + labelBox.height}px`; // makes the height stretch to the top
      rect.style.zIndex = 9999; // keep it above all other elements
      rect.style.pointerEvents = "none"; // disable any interaction with the rectangl

      // after a pause, fade it out smoothly
      setTimeout(() => {
        rect.style.transition = "opacity 0.6s ease";
        rect.style.opacity = "0";

        // adds a fading class to the icon
        item.classList.add("fading-out");
      }, 100);

      // remove it
      setTimeout(() => {
        rect.remove();
        item.classList.remove("active-color", "fading-out");
        scrollLocked = false; // allows more interaction
      }, 700);

      // exit loop
      return;
    }

    currentTop -= growSpeed; // if not, keep growing upward
    currentHeight += growSpeed; // increas height

    // if goes too high, reduce height
    if (currentTop < 0) {
      currentHeight += currentTop;
      currentTop = 0;
    }

    // apploes the new dimensions
    rect.style.top = `${currentTop}px`;
    rect.style.height = `${currentHeight}px`;
    requestAnimationFrame(grow);
  }
  requestAnimationFrame(grow);
}

// ================== NAVIGATE TO SECTION ===========================
// hides all pages besides the one that was clicked

function goToSection(sectionId, labelText, color, item, growSpeed = 40) {
  // calls it trigger the animation
  animateRectangleToTop(
    item, // footer icon
    color, // background color
    labelText, // label
    () => {
      mainScreen.style.display = "none"; // hides the main screen
      allSections.forEach((s) => (s.style.display = "none")); // hides all pages
      const section = document.getElementById(sectionId);
      section.style.display = "block"; //shows the section
      section.classList.add("fade-in"); // adds a fade in animation
      setTimeout(() => section.classList.remove("fade-in"), 500); // removes animation class after 500ms
    },
    growSpeed // speed of animation
  );
}

// ====================== FOOTER HOVER AND CLICK ========================

footerItems.forEach((item, index) => {
  const labelText = item.querySelector("span").textContent;
  const sectionId = item.getAttribute("data-section");
  const bgColors = ["#8e726f", "#735d78", "#7a7c5c", "#4a4e69", "#6d6875"]; // the background colors in order
  const bgColor = bgColors[index % bgColors.length]; // wouldnt work without it for some reason

  // when theres a click
  item.addEventListener("click", () => {
    if (scrollLocked) return; // doesnt register any clicks if theres an animation already running
    scrollLocked = true; // locks it

    goToSection(sectionId, labelText, bgColor, item, 40); // triggrs the function
  });

  // when hovered over
  item.addEventListener("mouseenter", () => {
    hoveredFooterItem = { sectionId, labelText, bgColor, item };
  });

  // when hover leaves
  item.addEventListener("mouseleave", () => {
    hoveredFooterItem = null; //resets
  });
});

// ======================= SCROLL TO TRIGGER SECTION SWITCH ===========================
// this was the only original way to trigger going to section, but after the presentation
// i got feedback that people may not know to scroll, so i also added the clicking function.
// howeer i still really like the scrolling, and even the animation was supposed to go
// with scrolling

window.addEventListener(
  "wheel", // listens for mouse scroll
  (e) => {
    //id not hovering the footer, dont do anything
    if (!hoveredFooterItem || scrollLocked) return;
    const now = Date.now(); // getse the current time

    if (now - lastScrollTime < 800) return; // ignores if its been less than 800ms
    // this avoids the animation repeating because scrolling goes for longer than a click

    e.preventDefault(); // prevents normal page scroll
    scrollLocked = true; // locks before complete
    lastScrollTime = now; // updates time

    const { sectionId, labelText, bgColor, item } = hoveredFooterItem;
    hoveredFooterItem = null;

    goToSection(sectionId, labelText, bgColor, item, 40); // goes to section
  },
  { passive: false }
);

// =============== BACK BUTTON ===========================

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("back-button")) {
    /// if the clicked element has the class 'back-button'...
    const visiblePage = Array.from(allSections).find(
      // find out which  section is currently visible
      (s) => s.style.display === "block"
    );

    if (visiblePage) {
      visiblePage.classList.add("fade-out"); // fade out

      setTimeout(() => {
        visiblePage.style.display = "none"; // hide the content section whe animationn complete
        visiblePage.classList.remove("fade-out");

        // shows the main screen with a fade in
        mainScreen.classList.add("fade-in");
        mainScreen.style.display = "flex";

        setTimeout(() => {
          mainScreen.classList.remove("fade-in");
        }, 500);
      }, 400);
    }
  }
});

// ========================== SCROLL ANIMATION  ON MAIN SCREEN ==========================
// the animation that happens when yous croll on the main screen (the name and stars zoom/disappear)
// as well as turning on the hover effects when the opacity of them reach 0

function applyScrollZoom(zoomIn) {
  if (zoomIn) {
    myName.classList.add("scroll-scale", "inactive"); // zooms and fade out the name

    // zooms and fade out all stars
    starElems.forEach((s) => {
      s.classList.add("scroll-scale");
      s.style.opacity = "0";
      s.style.pointerEvents = "none";
    });

    bgBoxes.forEach((box) => box.classList.add("active-hover")); // activates the hover effect on background rectangles
  } else {
    // rest  name
    myName.classList.remove("scroll-scale", "inactive");

    // reset stars
    starElems.forEach((s) => {
      s.classList.remove("scroll-scale");
      s.style.opacity = "1";
      s.style.pointerEvents = "auto";
    });

    // rremove hover effects
    bgBoxes.forEach((box) => box.classList.remove("active-hover"));
  }
}

function isOnMainScreen() {
  return mainScreen.style.display === "flex" || mainScreen.style.display === "";
}

// ==================== ZOOM TRIGGER BASED ON SCROLL DIRECTION ===========================
// only triggers when on main screen, and makes it so when you scroll down it does the zoom,
// and when you scroll up it comes back

window.addEventListener("wheel", (e) => {
  // doesnt do anything if not on the main screen
  if (!isOnMainScreen()) return;

  // checks the direction of scroll
  const scrollDown = e.deltaY > 0;
  const newDirection = scrollDown ? "down" : "up";

  // only reacts when the scroll direction changes
  if (newDirection !== lastDirection) {
    applyScrollZoom(scrollDown); // applys effect
    lastDirection = newDirection;
  }
});

// ==================== STAR PULSE ANIMATION ===========================
// the stars pulsing which i did add because everything felt too static
// also made it pulsate at different times so it looks less unified! this code was actually
// for my creative coding assignment where one of the functions was bubbles that were chaotic
// so they were growing at different speeds and different time!

function animatePulse(el, speed = 3000, scale = 1.2, phaseOffset = 0) {
  function tick() {
    const now = Date.now();
    const progress = ((now + phaseOffset) % speed) / speed;

    let s;

    // if in the first half of the time, scales up
    if (progress < 0.5) {
      s = 1 + (scale - 1) * (progress * 2);
    } else {
      // scales back down if in the second hald
      s = scale - (scale - 1) * ((progress - 0.5) * 2);
    }

    el.style.transform = `translate(-50%, -50%) scale(${s})`; // apply transform to the star
    requestAnimationFrame(tick);
  }

  tick(); // start animation loop
}

const stars = document.querySelectorAll(".star img"); // Select all star <img> tags

stars.forEach((star) => {
  const speed = 2000 + Math.random() * 2000; // chooses random speed between 2-4 seconds
  const scale = 1.1 + Math.random() * 0.3; // makes a max scale
  const offset = Math.random() * 5000; // random animation start
  animatePulse(star, speed, scale, offset); // starts
});

// ========================== CONTACT FORM ===========================
// the contact form in the contact section! made it so everything needs to be valid,
// and if not, theres a shake

const contactForm = document.querySelector(".contact-form");
const submitButton = contactForm.querySelector("button");

// when the form is submitted
contactForm.addEventListener("submit", (e) => {
  e.preventDefault(); //stays on the page (i had an issue where it kept going back to the main screen)

  const inputs = contactForm.querySelectorAll("input, textarea");
  let allValid = true; // tracks if all field is filled
  inputs.forEach((field) => {
    if (!field.value.trim()) allValid = false; // mark invalid if empty field
  });

  // extra validation for email, also uses the browsers functionality
  const emailInput = contactForm.querySelector('input[type="email"]');
  if (!emailInput.value.includes("@")) allValid = false; // needs to have an @

  // if validation fails, trigger shake
  if (!allValid) {
    submitButton.classList.add("shake");
    submitButton.textContent = "PLEASE COMPLETE FIELDS!";

    // resets text and animation effect
    setTimeout(() => {
      submitButton.classList.remove("shake");
      submitButton.textContent = "SUBMIT";
    }, 2000);
    return;
  }

  submitButton.textContent = "SUCCESS!"; // success message if valid
  inputs.forEach((field) => (field.value = "")); // clears all fields
  setTimeout(() => (submitButton.textContent = "SUBMIT"), 3000); //reset buton
});

// ==================== PROJECT CAROUSEL ===========================
// this one was the hardest part to code. it was never working omg.
// its the carousel in the projects section

const track = document.querySelector(".carousel-track"); //
const slides = Array.from(document.querySelectorAll(".carousel-slide"));
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0; // tracks which slide is currently highlighted

function updateCarousel() {
  currentIndex = Math.max(0, Math.min(currentIndex, slides.length - 1));

  // highlights the active slide
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentIndex);
  });

  // arrows
  leftArrow.style.display = currentIndex === 0 ? "none" : "flex";
  rightArrow.style.display =
    currentIndex === slides.length - 1 ? "none" : "flex";

  requestAnimationFrame(() => {
    const container = document.querySelector(".carousel-container"); // grabs the visible area
    const activeSlide = slides[currentIndex]; // makes the slide currently centered

    const trackBox = track.getBoundingClientRect();
    const slideBox = activeSlide.getBoundingClientRect();

    // this part lets me make sure all the slides are centred and you can still see the projects
    // at the side if there are projects to its side
    const slideCenter = slideBox.left + slideBox.width / 2; // middle point of the slide
    const arrowPadding = 20; // space taken by arrows on either side
    const trackCenter =
      trackBox.left + (container.offsetWidth - arrowPadding * 2) / 2; // center point

    const offset = slideCenter - trackCenter; // how far off we are from center

    // moves it to center
    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(calc(-1 * ${offset}px))`;

    // updates the navigation dot
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  });
}

// just the function for both arrows and listens for lcick
leftArrow.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});

rightArrow.addEventListener("click", () => {
  if (currentIndex < slides.length - 1) {
    currentIndex++;
    updateCarousel();
  }
});

// makes it so yuo can jump to the certain project with the dots
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    currentIndex = i;
    updateCarousel();
  });
});

window.addEventListener("load", () => {
  updateCarousel();
});

const allSlides = document.querySelectorAll(".carousel-slide");

// makes all the slides clickable
allSlides.forEach((slide) => {
  slide.addEventListener("click", () => {
    const target = slide.getAttribute("data-target");

    if (!target) return;
    document.getElementById("projects").classList.add("fade-out");

    setTimeout(() => {
      // hides the projects sectio
      document.getElementById("projects").style.display = "none";
      document.getElementById("projects").classList.remove("fade-out");

      const targetPage = document.getElementById(target); // gets the new section to show

      if (targetPage) {
        targetPage.style.display = "block"; // show section
        targetPage.classList.add("fade-in"); // fade in

        setTimeout(() => targetPage.classList.remove("fade-in"), 500);
      }
    }, 400);
  });
});

// ================== MAIN SCREEN FEATURED PROJECTS ===========================
// makes the featured projects clickable and takes into the project page

bgBoxes.forEach((box) => {
  box.addEventListener("click", () => {
    const target = box.getAttribute("data-project");

    if (target) {
      scrollLocked = true;

      // hides the main screen and all other sections
      mainScreen.style.display = "none";
      allSections.forEach((s) => (s.style.display = "none"));

      // goes to the projects page
      const targetPage = document.getElementById(target);
      if (targetPage) {
        targetPage.style.display = "block";
        targetPage.classList.add("fade-in");

        setTimeout(() => {
          targetPage.classList.remove("fade-in");
          scrollLocked = false;
        }, 500);
      }
    }
  });
});
