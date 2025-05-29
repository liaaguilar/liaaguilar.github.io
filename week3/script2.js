// === footer section navigation ===

const footerItems = document.querySelectorAll(".footer-icons");
const mainScreen = document.getElementById("main-screen");
const allSections = document.querySelectorAll(".content-page");
const myName = document.querySelector(".my-name");
const starElems = document.querySelectorAll(".star");
const bgBoxes = document.querySelectorAll(".background-box");

let hoveredFooterItem = null;
let scrollLocked = false;
let lastDirection = null;
let lastScrollTime = 0;

// animate rectangle from footer to top
function animateRectangleToTop(
  item,
  color,
  labelText,
  onComplete,
  growSpeed = 40
) {
  const label = item.querySelector(".labels");
  const labelBox = label.getBoundingClientRect();

  const rect = document.createElement("div");
  rect.classList.add("footer-animation");
  rect.style.backgroundColor = color;
  rect.style.left = `${labelBox.left}px`;
  rect.style.top = `${labelBox.top}px`;
  rect.style.width = `${labelBox.width}px`;
  rect.style.height = `${labelBox.height}px`;

  document.body.appendChild(rect);

  footerItems.forEach((i) => i.classList.remove("active-color", "fading-out"));
  item.classList.add("active-color");

  let currentTop = labelBox.top;
  let currentHeight = labelBox.height;

  onComplete();

  function grow() {
    if (currentTop <= 0) {
      rect.style.top = `0px`;
      rect.style.height = `${labelBox.top + labelBox.height}px`;
      rect.style.zIndex = 9999;
      rect.style.pointerEvents = "none";

      setTimeout(() => {
        rect.style.transition = "opacity 0.6s ease";
        rect.style.opacity = "0";
        item.classList.add("fading-out");
      }, 100);

      setTimeout(() => {
        rect.remove();
        item.classList.remove("active-color", "fading-out");
        scrollLocked = false;
      }, 700);

      return;
    }

    currentTop -= growSpeed;
    currentHeight += growSpeed;

    if (currentTop < 0) {
      currentHeight += currentTop;
      currentTop = 0;
    }

    rect.style.top = `${currentTop}px`;
    rect.style.height = `${currentHeight}px`;

    requestAnimationFrame(grow);
  }

  requestAnimationFrame(grow);
}

// go to section logic
function goToSection(sectionId, labelText, color, item, growSpeed = 40) {
  animateRectangleToTop(
    item,
    color,
    labelText,
    () => {
      mainScreen.style.display = "none";
      allSections.forEach((s) => (s.style.display = "none"));
      const section = document.getElementById(sectionId);
      section.style.display = "block";
      section.classList.add("fade-in");
      setTimeout(() => section.classList.remove("fade-in"), 500);
    },
    growSpeed
  );
}

// footer hover + click events
footerItems.forEach((item, index) => {
  const labelText = item.querySelector("span").textContent;
  const sectionId = item.getAttribute("data-section");
  const bgColors = ["#8e726f", "#735d78", "#7a7c5c", "#4a4e69", "#6d6875"];
  const bgColor = bgColors[index % bgColors.length];

  item.addEventListener("click", () => {
    if (scrollLocked) return;
    scrollLocked = true;
    goToSection(sectionId, labelText, bgColor, item, 40);
  });

  item.addEventListener("mouseenter", () => {
    hoveredFooterItem = { sectionId, labelText, bgColor, item };
  });

  item.addEventListener("mouseleave", () => {
    hoveredFooterItem = null;
  });
});

// scroll wheel shortcut for footer icons
window.addEventListener(
  "wheel",
  (e) => {
    if (!hoveredFooterItem || scrollLocked) return;

    const now = Date.now();
    if (now - lastScrollTime < 800) return;

    e.preventDefault();
    scrollLocked = true;
    lastScrollTime = now;

    const { sectionId, labelText, bgColor, item } = hoveredFooterItem;
    hoveredFooterItem = null;

    goToSection(sectionId, labelText, bgColor, item, 40);
  },
  { passive: false }
);

// back button functionality
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("back-button")) {
    const visiblePage = Array.from(allSections).find(
      (s) => s.style.display === "block"
    );

    if (visiblePage) {
      visiblePage.classList.add("fade-out");

      setTimeout(() => {
        visiblePage.style.display = "none";
        visiblePage.classList.remove("fade-out");

        mainScreen.classList.add("fade-in");
        mainScreen.style.display = "flex";

        setTimeout(() => {
          mainScreen.classList.remove("fade-in");
        }, 500);
      }, 400);
    }
  }
});

// zoom on scroll for name + stars + bg hover
function applyScrollZoom(zoomIn) {
  if (zoomIn) {
    myName.classList.add("scroll-scale", "inactive");
    starElems.forEach((s) => {
      s.classList.add("scroll-scale");
      s.style.opacity = "0";
      s.style.pointerEvents = "none";
    });

    bgBoxes.forEach((box) => box.classList.add("active-hover"));
  } else {
    myName.classList.remove("scroll-scale", "inactive");
    starElems.forEach((s) => {
      s.classList.remove("scroll-scale");
      s.style.opacity = "1";
      s.style.pointerEvents = "auto";
    });

    bgBoxes.forEach((box) => box.classList.remove("active-hover"));
  }
}

function isOnMainScreen() {
  return mainScreen.style.display === "flex" || mainScreen.style.display === "";
}

window.addEventListener("wheel", (e) => {
  if (!isOnMainScreen()) return;

  const scrollDown = e.deltaY > 0;
  const newDirection = scrollDown ? "down" : "up";

  if (newDirection !== lastDirection) {
    applyScrollZoom(scrollDown);
    lastDirection = newDirection;
    updateHoverState(); // ← ✅ Add this here
  }
});

function updateHoverState() {
  const nameOpacity = parseFloat(getComputedStyle(myName).opacity);
  if (nameOpacity === 0) {
    bgBoxes.forEach((box) => box.classList.add("active-hover"));
  } else {
    bgBoxes.forEach((box) => box.classList.remove("active-hover"));
  }
}

// star animation
function animatePulse(el, speed = 3000, scale = 1.2, phaseOffset = 0) {
  function tick() {
    const now = Date.now();
    const progress = ((now + phaseOffset) % speed) / speed;

    let s;
    if (progress < 0.5) {
      s = 1 + (scale - 1) * (progress * 2);
    } else {
      s = scale - (scale - 1) * ((progress - 0.5) * 2);
    }

    el.style.transform = `translate(-50%, -50%) scale(${s})`;
    requestAnimationFrame(tick);
  }

  tick();
}

const stars = document.querySelectorAll(".star img");
stars.forEach((star) => {
  const speed = 2000 + Math.random() * 2000;
  const scale = 1.1 + Math.random() * 0.3;
  const offset = Math.random() * 5000;
  animatePulse(star, speed, scale, offset);
});

// contact form
const contactForm = document.querySelector(".contact-form");
const submitButton = contactForm.querySelector("button");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputs = contactForm.querySelectorAll("input, textarea");
  let allValid = true;

  inputs.forEach((field) => {
    if (!field.value.trim()) allValid = false;
  });

  const emailInput = contactForm.querySelector('input[type="email"]');
  if (!emailInput.value.includes("@")) allValid = false;

  if (!allValid) {
    submitButton.classList.add("shake");
    submitButton.textContent = "PLEASE COMPLETE FIELDS!";
    setTimeout(() => {
      submitButton.classList.remove("shake");
      submitButton.textContent = "SUBMIT";
    }, 2000);
    return;
  }

  submitButton.textContent = "SUCCESS!";
  inputs.forEach((field) => (field.value = ""));
  setTimeout(() => (submitButton.textContent = "SUBMIT"), 3000);
});

// project carousel
const track = document.querySelector(".carousel-track");
const slides = Array.from(document.querySelectorAll(".carousel-slide"));
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;

function updateCarousel() {
  currentIndex = Math.max(0, Math.min(currentIndex, slides.length - 1));

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentIndex);
  });

  leftArrow.style.display = currentIndex === 0 ? "none" : "flex";
  rightArrow.style.display =
    currentIndex === slides.length - 1 ? "none" : "flex";

  requestAnimationFrame(() => {
    const container = document.querySelector(".carousel-container");
    const activeSlide = slides[currentIndex];

    const trackBox = track.getBoundingClientRect();
    const slideBox = activeSlide.getBoundingClientRect();

    const slideCenter = slideBox.left + slideBox.width / 2;
    const arrowPadding = 20;
    const trackCenter =
      trackBox.left + (container.offsetWidth - arrowPadding * 2) / 2;

    const offset = slideCenter - trackCenter;

    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(calc(-1 * ${offset}px))`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  });
}

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

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    currentIndex = i;
    updateCarousel();
  });
});

window.addEventListener("load", () => {
  updateCarousel();
  updateHoverState();

  // smart check: if name is already mostly off screen, simulate scroll down
  const nameBox = myName.getBoundingClientRect();
  const screenHeight = window.innerHeight;

  if (nameBox.bottom < screenHeight * 0.8) {
    applyScrollZoom(true); // triggers hiding stars and activates hover
  }
});

// make carousel slides clickable
const allSlides = document.querySelectorAll(".carousel-slide");
allSlides.forEach((slide) => {
  slide.addEventListener("click", () => {
    const targetId = slide.getAttribute("data-target");
    if (!targetId) return;

    document.getElementById("projects").classList.add("fade-out");
    setTimeout(() => {
      document.getElementById("projects").style.display = "none";
      document.getElementById("projects").classList.remove("fade-out");

      const targetPage = document.getElementById(targetId);
      if (targetPage) {
        targetPage.style.display = "block";
        targetPage.classList.add("fade-in");
        setTimeout(() => targetPage.classList.remove("fade-in"), 500);
      }
    }, 400);
  });
});

// click rectangles on main screen
bgBoxes.forEach((box) => {
  box.addEventListener("click", () => {
    const targetId = box.getAttribute("data-project");
    if (targetId) {
      scrollLocked = true; // ← REMOVE or reset later
      mainScreen.style.display = "none";
      allSections.forEach((s) => (s.style.display = "none"));

      const targetPage = document.getElementById(targetId);
      if (targetPage) {
        targetPage.style.display = "block";
        targetPage.classList.add("fade-in");
        setTimeout(() => {
          targetPage.classList.remove("fade-in");
          scrollLocked = false; // ← ✅ ADD THIS
        }, 500);
      }
    }
  });
});
