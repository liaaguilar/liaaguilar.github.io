const modeBtn = document.getElementById("mode-btn");
const dropdown = document.getElementById("mode-dropdown");
const keyBtn = document.getElementById("key-btn");
const keySelector = document.getElementById("key-selector");

let openPanel = null;

function fadeDropdown(el, show = true) {
  if (show && openPanel && openPanel !== el) {
    fadeDropdown(openPanel, false);
  }

  if (show) {
    el.style.display = "block";
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.offsetHeight; // force reflow

    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });

    openPanel = el;
  } else {
    el.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";

    setTimeout(() => {
      el.style.display = "none";
      el.style.transition = "";
    }, 250);

    openPanel = null;
  }
}

// Mode button toggle
modeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const rect = modeBtn.getBoundingClientRect();
  dropdown.style.left = `${rect.left}px`;

  const isOpen = dropdown.style.display === "block";
  fadeDropdown(dropdown, !isOpen);
});

// Key button toggle
keyBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const rect = keyBtn.getBoundingClientRect();
  const boxWidth = 128;
  const left = Math.min(rect.left, window.innerWidth - boxWidth - 8);
  keySelector.style.left = `${left}px`;

  const isOpen = keySelector.style.display === "block";
  fadeDropdown(keySelector, !isOpen);
});

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (
    openPanel &&
    !openPanel.contains(e.target) &&
    !modeBtn.contains(e.target) &&
    !keyBtn.contains(e.target)
  ) {
    fadeDropdown(openPanel, false);
  }
});

// Dropdown item selection
document.querySelectorAll(".dropdown-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.stopPropagation();
    modeBtn.textContent = item.textContent;
    document
      .querySelectorAll(".dropdown-item")
      .forEach((i) => i.classList.remove("selected"));
    item.classList.add("selected");
  });
});

// Key selector logic
const keyGrid = document.getElementById("key-grid");
const majorBtn = document.getElementById("major-btn");
const minorBtn = document.getElementById("minor-btn");
const accToggle = document.getElementById("accidental-toggle");

let useSharps = true;
let scaleType = "Major";
let selectedNote = "C";

const sharpNotes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
const flatNotes = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

function renderNoteGrid() {
  const notes = useSharps ? sharpNotes : flatNotes;
  keyGrid.innerHTML = "";
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.classList.add("key-note");
    if (note === selectedNote) div.classList.add("selected");
    div.textContent = note;
    div.addEventListener("click", (e) => {
      e.stopPropagation();
      selectedNote = note;
      document.querySelector("#key-btn .key-line1").textContent = selectedNote;
      document.querySelector("#key-btn .key-line2").textContent = scaleType;
      renderNoteGrid();
    });
    keyGrid.appendChild(div);
  });
}

accToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  useSharps = !useSharps;
  renderNoteGrid();
});

majorBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  scaleType = "Major";
  document.querySelector("#key-btn .key-line1").textContent = selectedNote;
  document.querySelector("#key-btn .key-line2").textContent = scaleType;
  majorBtn.classList.add("selected");
  minorBtn.classList.remove("selected");
});

minorBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  scaleType = "Minor";
  document.querySelector("#key-btn .key-line1").textContent = selectedNote;
  document.querySelector("#key-btn .key-line2").textContent = scaleType;
  minorBtn.classList.add("selected");
  majorBtn.classList.remove("selected");
});

renderNoteGrid();
