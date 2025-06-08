// ------------------ MODE STATE ------------------
let currentMode = null;
let currentScaleMode = null;
let currentChordType = null;

// Reference to all dropdowns for exclusive opening
const allDropdowns = [
  document.getElementById("fretboard-dropdown"),
  document.getElementById("scale-mode-dropdown"),
  document.getElementById("chord-type-dropdown"),
  document.getElementById("settings-dropdown"),
  document.getElementById("key-selector"),
];

function setMode(mode) {
  currentMode = mode;

  const fbLine1 = document.querySelector("#fretboard-btn .key-line1");
  const fbLine2 = document.querySelector("#fretboard-btn .key-line2");
  if (!mode) {
    fbLine1.textContent = "FRETBOARD";
    fbLine2.textContent = "MODE";
  } else {
    fbLine1.textContent = mode.toUpperCase();
    fbLine2.textContent = "VIEW";
  }

  const contextBtn = document.getElementById("context-btn");
  if (mode === "scale") {
    contextBtn.classList.add("visible-soft");
    contextBtn.classList.remove("hidden-soft");
    const label = currentScaleMode ? currentScaleMode.toUpperCase() : "SCALE";
    contextBtn.innerHTML = `<span class="key-line1">${label}</span><span class="key-line2">MODE</span>`;
  } else if (mode === "chord") {
    contextBtn.classList.add("visible-soft");
    contextBtn.classList.remove("hidden-soft");
    const label = currentChordType ? currentChordType.toUpperCase() : "CHORD";
    contextBtn.innerHTML = `<span class="key-line1">${label}</span><span class="key-line2">TYPE</span>`;
  } else {
    contextBtn.classList.add("hidden-soft");
    contextBtn.classList.remove("visible-soft");
  }

  const chordBoxes = document.getElementById("chord-boxes");
  chordBoxes.classList.toggle("visible-soft", mode === "chord");
  chordBoxes.classList.toggle("hidden-soft", mode !== "chord");

  document
    .querySelectorAll("#fretboard-dropdown input[type='checkbox']")
    .forEach((cb) => {
      cb.checked = cb.id === mode;
    });
}

document.getElementById("reset-btn").addEventListener("click", () => {
  setMode(null);
  currentScaleMode = null;
  currentChordType = null;
  updateScaleModeLabel();
  updateChordTypeLabel();
});

// ------------------ DROPDOWN LOGIC ------------------
function fadeDropdown(dropdown, show) {
  // Close all dropdowns before opening a new one
  allDropdowns.forEach((d) => {
    if (d !== dropdown) {
      d.style.opacity = "0";
      d.style.transform = "translateY(10px)";
      setTimeout(() => {
        d.style.display = "none";
      }, 200);
    }
  });

  // Then open/close the target dropdown
  if (show) {
    dropdown.style.display = "block";
    setTimeout(() => {
      dropdown.style.opacity = "1";
      dropdown.style.transform = "translateY(0)";
    }, 10);
  } else {
    dropdown.style.opacity = "0";
    dropdown.style.transform = "translateY(10px)";
    setTimeout(() => {
      dropdown.style.display = "none";
    }, 200);
  }
}

// Fretboard Mode Dropdown
const fretboardBtn = document.getElementById("fretboard-btn");
const fretboardDropdown = document.getElementById("fretboard-dropdown");

fretboardBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const rect = fretboardBtn.getBoundingClientRect();
  fretboardDropdown.style.left = `${rect.left}px`;
  const isOpen = fretboardDropdown.style.display === "block";
  fadeDropdown(fretboardDropdown, !isOpen);
});

document
  .querySelectorAll("#fretboard-dropdown input[type='checkbox']")
  .forEach((cb) => {
    cb.addEventListener("change", () => {
      document
        .querySelectorAll("#fretboard-dropdown input[type='checkbox']")
        .forEach((other) => {
          if (other !== cb) other.checked = false;
        });
      setMode(cb.checked ? cb.id : null);
    });
  });

// ------------------ CONTEXT BUTTON ------------------
const contextBtn = document.getElementById("context-btn");
const scaleModeDropdown = document.getElementById("scale-mode-dropdown");
const chordTypeDropdown = document.getElementById("chord-type-dropdown");

contextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const rect = contextBtn.getBoundingClientRect();
  if (currentMode === "scale") {
    scaleModeDropdown.style.left = `${rect.left}px`;
    fadeDropdown(
      scaleModeDropdown,
      scaleModeDropdown.style.display !== "block"
    );
  } else if (currentMode === "chord") {
    chordTypeDropdown.style.left = `${rect.left}px`;
    fadeDropdown(
      chordTypeDropdown,
      chordTypeDropdown.style.display !== "block"
    );
  }
});

// ------------------ SCALE MODE DROPDOWN ------------------
scaleModeDropdown.addEventListener("click", (e) => {
  if (e.target.tagName !== "INPUT") return;
  const mode = e.target.value;
  currentScaleMode = mode;

  document.querySelectorAll("#scale-mode-dropdown input").forEach((cb) => {
    cb.checked = cb.value === mode;
  });

  updateScaleModeLabel();
});

function updateScaleModeLabel() {
  if (currentMode !== "scale") return;
  const label = currentScaleMode ? currentScaleMode.toUpperCase() : "SCALE";
  contextBtn.innerHTML = `<span class="key-line1">${label}</span><span class="key-line2">MODE</span>`;
}

// ------------------ CHORD TYPE DROPDOWN ------------------
chordTypeDropdown.addEventListener("click", (e) => {
  if (e.target.tagName !== "INPUT") return;
  const type = e.target.value;
  currentChordType = type;

  document.querySelectorAll("#chord-type-dropdown input").forEach((cb) => {
    cb.checked = cb.value === type;
  });

  updateChordTypeLabel();

  // Future functionality placeholder:
  // if (type === "quartal") { do something }
});

function updateChordTypeLabel() {
  if (currentMode !== "chord") return;
  const label = currentChordType ? currentChordType.toUpperCase() : "CHORD";
  contextBtn.innerHTML = `<span class="key-line1">${label}</span><span class="key-line2">TYPE</span>`;
}

// ------------------ SETTINGS DROPDOWN ------------------
const settingsBtn = document.getElementById("settings-btn");
const settingsDropdown = document.getElementById("settings-dropdown");

const settingsState = {
  "color-coded": false,
  "note-names": false,
  "scale-degrees": false,
};

settingsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const rect = settingsBtn.getBoundingClientRect();
  settingsDropdown.style.left = `${rect.left}px`;
  const isOpen = settingsDropdown.style.display === "block";
  fadeDropdown(settingsDropdown, !isOpen);
});

document.querySelectorAll("#settings-dropdown input").forEach((cb) => {
  cb.addEventListener("change", () => {
    settingsState[cb.id] = cb.checked;
    updateSettingsLabel();
  });
});

function updateSettingsLabel() {
  const activeCount = Object.values(settingsState).filter(Boolean).length;
  settingsBtn.textContent =
    activeCount > 0 ? `SETTINGS (${activeCount})` : "SETTINGS";
}

// ------------------ KEY SELECTOR ------------------
const keyBtn = document.getElementById("key-btn");
const keySelector = document.getElementById("key-selector");
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

function renderNotes() {
  const notes = useSharps ? sharpNotes : flatNotes;
  keyGrid.innerHTML = "";
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.classList.add("key-note");
    if (note === selectedNote) div.classList.add("selected");
    div.textContent = note;
    keyGrid.appendChild(div);
  });
}
renderNotes();

keyBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const rect = keyBtn.getBoundingClientRect();
  keySelector.style.left = `${rect.left}px`;
  const isOpen = keySelector.style.display === "block";
  fadeDropdown(keySelector, !isOpen);
});

keyGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("key-note")) {
    selectedNote = e.target.textContent;
    updateKeyUI();
  }
});

function updateKeyUI() {
  renderNotes();
  const keyBtn = document.getElementById("key-btn");
  keyBtn.querySelector(".key-line1").textContent = selectedNote;
  keyBtn.querySelector(".key-line2").textContent = scaleType;
}

accToggle.addEventListener("click", () => {
  useSharps = !useSharps;
  renderNotes();
});

majorBtn.addEventListener("click", () => {
  scaleType = "Major";
  majorBtn.classList.add("selected");
  minorBtn.classList.remove("selected");
  updateKeyUI();
});

minorBtn.addEventListener("click", () => {
  scaleType = "Minor";
  minorBtn.classList.add("selected");
  majorBtn.classList.remove("selected");
  updateKeyUI();
});

// ------------------ AUDIO LISTENER ------------------
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

// ------------------ CLOSE ALL DROPDOWNS ON OUTSIDE CLICK ------------------
document.addEventListener("click", () => {
  allDropdowns.forEach((d) => fadeDropdown(d, false));
});

allDropdowns.forEach((el) =>
  el.addEventListener("click", (e) => e.stopPropagation())
);
