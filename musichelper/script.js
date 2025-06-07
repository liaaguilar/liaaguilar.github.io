// ------------------ DROPDOWN ELEMENTS ------------------
const modeBtn = document.getElementById("mode-btn");
const dropdown = document.getElementById("mode-dropdown");

const keyBtn = document.getElementById("key-btn");
const keySelector = document.getElementById("key-selector");
const keyGrid = document.getElementById("key-grid");
const majorBtn = document.getElementById("major-btn");
const minorBtn = document.getElementById("minor-btn");
const accToggle = document.getElementById("accidental-toggle");

const settingsBtn = document.getElementById("settings-btn");
const settingsDropdown = document.getElementById("settings-dropdown");

// ------------------ STATE ------------------
let openPanel = null;

let useSharps = true;
let scaleType = "Major";
let selectedNote = "C";
let fretboardMode = "Note";

const settings = {
  colorCoded: false,
  noteNames: false,
  scaleDegrees: false,
};

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

// ------------------ FADE LOGIC ------------------
function fadeDropdown(el, show = true) {
  if (show) {
    if (openPanel && openPanel !== el) {
      fadeDropdown(openPanel, false);
    }

    el.style.display = "block";
    el.style.pointerEvents = "auto";
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.offsetHeight;

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
    el.style.pointerEvents = "none";

    setTimeout(() => {
      el.style.display = "none";
      el.style.transition = "";
      if (openPanel === el) openPanel = null;
    }, 250);
  }
}

// ------------------ FRETBOARD MODE DROPDOWN ------------------
modeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const rect = modeBtn.getBoundingClientRect();
  dropdown.style.left = `${rect.left}px`;
  const isOpen = dropdown.style.display === "block";
  fadeDropdown(dropdown, !isOpen);
});

document.querySelectorAll('input[name="mode"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    fretboardMode = e.target.value;
    modeBtn.textContent = fretboardMode;
    fadeDropdown(dropdown, false);

    console.log("Fretboard mode changed to:", fretboardMode);
    // TODO: switchToMode(fretboardMode.toLowerCase());
  });
});

// ------------------ KEY SELECTOR LOGIC ------------------
keyBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const rect = keyBtn.getBoundingClientRect();
  const boxWidth = 128;
  const left = Math.min(rect.left, window.innerWidth - boxWidth - 8);
  keySelector.style.left = `${left}px`;

  const isOpen = keySelector.style.display === "block";
  fadeDropdown(keySelector, !isOpen);
});

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

// ------------------ SETTINGS CHECKBOXES ------------------
settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const rect = settingsBtn.getBoundingClientRect();
  settingsDropdown.style.left = `${rect.left}px`;
  const isOpen = settingsDropdown.style.display === "block";
  fadeDropdown(settingsDropdown, !isOpen);
});

document.getElementById("color-coded").addEventListener("change", (e) => {
  settings.colorCoded = e.target.checked;
  console.log("Color Coded:", settings.colorCoded);
});

document.getElementById("note-names").addEventListener("change", (e) => {
  settings.noteNames = e.target.checked;
  console.log("Note Names:", settings.noteNames);
});

document.getElementById("scale-degrees").addEventListener("change", (e) => {
  settings.scaleDegrees = e.target.checked;
  console.log("Scale Degrees:", settings.scaleDegrees);
});

// ------------------ GLOBAL CLOSE HANDLER ------------------
document.addEventListener("click", (e) => {
  if (
    openPanel &&
    !openPanel.contains(e.target) &&
    !modeBtn.contains(e.target) &&
    !keyBtn.contains(e.target) &&
    !settingsBtn.contains(e.target)
  ) {
    fadeDropdown(openPanel, false);
  }
});

// ------------------ AUDIO RECORDING ------------------
const recordBtn = document.getElementById("record-btn");
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

recordBtn.addEventListener("click", async () => {
  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);
        audio.play();
      };

      mediaRecorder.start();
      isRecording = true;
      recordBtn.textContent = "STOP";
    } catch (err) {
      console.error("Microphone access denied or error:", err);
    }
  } else {
    mediaRecorder.stop();
    isRecording = false;
    recordBtn.textContent = "REC";
  }
});
