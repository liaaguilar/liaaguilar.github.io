import { PitchDetector } from "https://esm.sh/pitchy@4";

// ------------------ MODE STATE ------------------
let currentMode = null;
let currentScaleMode = null;
let keyChangedWhileInactive = false;

const noteColors = {
  C: "#ff6b6b", // soft red
  "C#": "#e05757", // darker red
  Db: "#e05757",

  D: "#ffb347", // warm orange
  "D#": "#e39e34", // darker golden-orange
  Eb: "#e39e34",

  E: "#f9e15b", // bright yellow (still readable)
  F: "#91d6f2", // sky blue
  "F#": "#75c4e6", // darker sky blue
  Gb: "#75c4e6",

  G: "#59caa2", // minty green
  "G#": "#4ab28f", // deeper mint green
  Ab: "#4ab28f",

  A: "#ffac81", // pastel coral
  "A#": "#e5946d", // warmer coral
  Bb: "#e5946d",

  B: "#b197fc", // soft lavender
};

// Reference to all dropdowns for exclusive opening
const allDropdowns = [
  document.getElementById("fretboard-dropdown"),
  document.getElementById("scale-mode-dropdown"),
  document.getElementById("settings-dropdown"),
  document.getElementById("key-selector"),
];

function setMode(mode) {
  // Always clear all notes when switching modes
  clearFretboard();

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
  } else {
    contextBtn.classList.add("hidden-soft");
    contextBtn.classList.remove("visible-soft");
  }

  const scaleToggle = document.getElementById("scale-type-toggle");
  if (mode === "scale") {
    scaleToggle.style.opacity = "0";
    scaleToggle.style.pointerEvents = "none";
  } else {
    scaleToggle.style.opacity = "1";
    scaleToggle.style.pointerEvents = "auto";
  }

  document
    .querySelectorAll("#fretboard-dropdown input[type='checkbox']")
    .forEach((cb) => {
      cb.checked = cb.id === mode;
    });

  if (mode === "note" && keyChangedWhileInactive) {
    updateFretboard();
  }

  updateKeyUI();

  if (mode === "note") {
    updateFretboard();
  } else if (mode === "scale") {
    updateScaleFretboard();
  }
}

document.getElementById("reset-btn").addEventListener("click", () => {
  setMode(null);
  currentScaleMode = null;
  selectedNote = null;
  scaleType = null;
  updateScaleModeLabel();
  updateKeyUI();
  updateFretboard();

  // Reset major/minor button styles
  majorBtn.classList.remove("selected");
  minorBtn.classList.remove("selected");

  // Clear all note guides + labels
  document.querySelectorAll(".note-guide").forEach((group) => {
    group.style.opacity = "0";
    group.style.pointerEvents = "none";
    const text = group.querySelector("text");
    if (text) text.style.opacity = "0";
  });
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

contextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const rect = contextBtn.getBoundingClientRect();
  if (currentMode === "scale") {
    scaleModeDropdown.style.left = `${rect.left}px`;
    fadeDropdown(
      scaleModeDropdown,
      scaleModeDropdown.style.display !== "block"
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
  updateScaleFretboard(); // ✅ ADDED
});

function updateScaleModeLabel() {
  if (currentMode !== "scale") return;
  const label = currentScaleMode ? currentScaleMode.toUpperCase() : "SCALE";
  contextBtn.innerHTML = `<span class="key-line1">${label}</span><span class="key-line2">MODE</span>`;
}

// ------------------ SETTINGS DROPDOWN ------------------
const settingsBtn = document.getElementById("settings-btn");
const settingsDropdown = document.getElementById("settings-dropdown");

const settingsState = {
  "color-coded": false,
  "note-names": false,
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
let scaleType = null;
let selectedNote = null;

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

    // ✅ Add this
    if (currentMode === "scale") {
      updateScaleFretboard();
    }
  }
});

function updateKeyUI() {
  renderNotes();
  const keyBtn = document.getElementById("key-btn");
  const line1 = keyBtn.querySelector(".key-line1");
  const line2 = keyBtn.querySelector(".key-line2");

  line1.textContent = selectedNote || "CHOOSE";

  if (currentMode === "scale") {
    line2.textContent = "KEY";
  } else {
    line2.textContent = scaleType || "KEY";
  }
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

let isListening = false;
let audioContext, analyser, sourceNode, scriptNode, pitchDetector;
let buffer = new Float32Array(2048);
const noteFrequency = {};
let allDetectedNotes = [];

// Converts pitch to note name
function pitchToNoteName(pitch) {
  const A4 = 440;
  const semitone = 12 * Math.log2(pitch / A4);
  const midi = Math.round(semitone + 69);
  const notes = [
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
  return notes[midi % 12];
}

// Guess the key based on most common notes
function guessKeyFromNotes(noteCounts) {
  const majorFormulas = {
    C: ["C", "D", "E", "F", "G", "A", "B"],
    "C#": ["C#", "D#", "F", "F#", "G#", "A#", "C"],
    D: ["D", "E", "F#", "G", "A", "B", "C#"],
    "D#": ["D#", "F", "G", "G#", "A#", "C", "D"],
    E: ["E", "F#", "G#", "A", "B", "C#", "D#"],
    F: ["F", "G", "A", "A#", "C", "D", "E"],
    "F#": ["F#", "G#", "A#", "B", "C#", "D#", "F"],
    G: ["G", "A", "B", "C", "D", "E", "F#"],
    "G#": ["G#", "A#", "C", "C#", "D#", "F", "G"],
    A: ["A", "B", "C#", "D", "E", "F#", "G#"],
    "A#": ["A#", "C", "D", "D#", "F", "G", "A"],
    B: ["B", "C#", "D#", "E", "F#", "G#", "A#"],
  };

  const minorFormulas = {
    A: ["A", "B", "C", "D", "E", "F", "G"],
    "A#": ["A#", "C", "C#", "D#", "F", "F#", "G#"],
    B: ["B", "C#", "D", "E", "F#", "G", "A"],
    C: ["C", "D", "D#", "F", "G", "G#", "A#"],
    "C#": ["C#", "D#", "E", "F#", "G#", "A", "B"],
    D: ["D", "E", "F", "G", "A", "A#", "C"],
    "D#": ["D#", "F", "F#", "G#", "A#", "B", "C#"],
    E: ["E", "F#", "G", "A", "B", "C", "D"],
    F: ["F", "G", "G#", "A#", "C", "C#", "D#"],
    "F#": ["F#", "G#", "A", "B", "C#", "D", "E"],
    G: ["G", "A", "A#", "C", "D", "D#", "F"],
    "G#": ["G#", "A#", "B", "C#", "D#", "E", "F#"],
  };

  function scoreKey(scaleNotes) {
    return scaleNotes.reduce((sum, note) => sum + (noteCounts[note] || 0), 0);
  }

  let bestKey = null;
  let bestType = null;
  let highestScore = -1;

  Object.entries(majorFormulas).forEach(([key, notes]) => {
    const score = scoreKey(notes);
    if (score > highestScore) {
      bestKey = key;
      bestType = "Major";
      highestScore = score;
    }
  });

  Object.entries(minorFormulas).forEach(([key, notes]) => {
    const score = scoreKey(notes);
    if (score > highestScore) {
      bestKey = key;
      bestType = "Minor";
      highestScore = score;
    }
  });

  return { key: bestKey, type: bestType };
}

recordBtn.addEventListener("click", async () => {
  if (!isListening) {
    try {
      // Clear previous session data
      allDetectedNotes = [];
      for (const key in noteFrequency) delete noteFrequency[key];

      setMode("note"); // Force into note mode
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      sourceNode = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      pitchDetector = PitchDetector.forFloat32Array(2048);
      buffer = new Float32Array(2048);

      scriptNode = audioContext.createScriptProcessor(2048, 1, 1);
      scriptNode.onaudioprocess = () => {
        analyser.getFloatTimeDomainData(buffer);
        const [pitch, clarity] = pitchDetector.findPitch(
          buffer,
          audioContext.sampleRate
        );
        if (clarity > 0.9) {
          const note = pitchToNoteName(pitch);
          allDetectedNotes.push(note);
          noteFrequency[note] = (noteFrequency[note] || 0) + 1;
        }
      };

      sourceNode.connect(analyser);
      analyser.connect(scriptNode);
      scriptNode.connect(audioContext.destination);

      isListening = true;
      recordBtn.textContent = "STOP";
    } catch (err) {
      console.error("Mic access failed:", err);
    }
  } else {
    // Stop audio stream and cleanup
    scriptNode.disconnect();
    sourceNode.disconnect();
    audioContext.close();
    isListening = false;
    recordBtn.textContent = "REC";

    // Guess key
    const guess = guessKeyFromNotes(noteFrequency);
    if (guess.key && guess.type) {
      selectedNote = guess.key;
      scaleType = guess.type;

      // Update UI & fretboard
      updateKeyUI();
      updateFretboard();
    }
  }
});

// ------------------ CLOSE ALL DROPDOWNS ON OUTSIDE CLICK ------------------
document.addEventListener("click", () => {
  allDropdowns.forEach((d) => fadeDropdown(d, false));
});

allDropdowns.forEach((el) =>
  el.addEventListener("click", (e) => e.stopPropagation())
);

// ------------------ SCALE GENERATION & NOTE HIGHLIGHT ------------------

// Chromatic scales
const chromaticSharps = [
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
const chromaticFlats = [
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

const enharmonicMap = {
  Db: "C#",
  Eb: "D#",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
};

// Scale formulas (intervals in semitones)
const scaleFormulas = {
  Major: [0, 2, 4, 5, 7, 9, 11],
  Minor: [0, 2, 3, 5, 7, 8, 10],
};

// scale formulas for scale view
const scaleModeFormulas = {
  ionian: [0, 2, 4, 5, 7, 9, 11], // same as major
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10], // same as minor
  locrian: [0, 1, 3, 5, 6, 8, 10],
};

// Returns array of notes in the current scale
function getCurrentScaleNotes() {
  if (!selectedNote || !scaleType) return [];

  const intervals =
    scaleType === "Major" ? [2, 2, 1, 2, 2, 2, 1] : [2, 1, 2, 2, 1, 2, 2];

  const chromatic = sharpNotes;
  const root = enharmonicMap[selectedNote] || selectedNote;
  const rootIndex = chromatic.indexOf(root);

  if (rootIndex === -1) return [];

  const scaleNotes = [chromatic[rootIndex]];
  let i = rootIndex;

  intervals.forEach((step) => {
    i = (i + step) % 12;
    scaleNotes.push(chromatic[i]);
  });

  return scaleNotes;
}

// Highlight matching notes on fretboard
function highlightFretboardNotes() {
  const notesInKey = getCurrentScaleNotes();
  const valid = notesInKey.length > 0;

  document.querySelectorAll(".note-guide").forEach((group) => {
    const note = group.dataset.note;
    const inKey = notesInKey.includes(note);
    const show = valid && inKey;

    const text = group.querySelector("text");
    const circle = group.querySelector("circle");

    group.style.opacity = show ? "1" : "0";
    group.style.pointerEvents = show ? "auto" : "none";

    // ✅ COLOR-CODING SECTION
    if (circle) {
      if (settingsState["color-coded"] && show) {
        circle.setAttribute("fill", noteColors[note] || "#fff");
      } else {
        circle.setAttribute("fill", "#fff");
      }
    }

    // ✅ TEXT LABELS
    if (text) {
      if (settingsState["note-names"] && group.style.opacity === "1") {
        text.style.opacity = "1";
      } else {
        text.style.opacity = "0";
      }
    }
  });
}

function updateFretboard() {
  if (currentMode !== "note") {
    keyChangedWhileInactive = true;
    return;
  }
  if (!selectedNote || !scaleType) {
    highlightFretboardNotes(); // clears fretboard when not ready
    return;
  }
  keyChangedWhileInactive = false;
  highlightFretboardNotes();
}

// Trigger update on key/mode changes
keyGrid.addEventListener("click", updateFretboard);
accToggle.addEventListener("click", updateFretboard);
majorBtn.addEventListener("click", updateFretboard);
minorBtn.addEventListener("click", updateFretboard);

// Also trigger on settings change
document.querySelectorAll("#settings-dropdown input").forEach((cb) => {
  cb.addEventListener("change", () => {
    if (currentMode === "scale") {
      updateScaleFretboard();
    } else {
      updateFretboard();
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".note-guide").forEach((g) => {
    g.style.opacity = "0";
    g.style.pointerEvents = "none";
    const text = g.querySelector("text");
    if (text) {
      text.style.display = "block"; // always render
      text.style.opacity = "0"; // start hidden
    }
  });
});

// --------- SCALE VIEW ----------
function getScaleModeNotes() {
  if (!selectedNote || !currentScaleMode) return [];

  const intervals = scaleModeFormulas[currentScaleMode];
  if (!intervals) return [];

  const chromatic = sharpNotes;
  const root = enharmonicMap[selectedNote] || selectedNote;
  const rootIndex = chromatic.indexOf(root);
  if (rootIndex === -1) return [];

  return intervals.map((interval) => chromatic[(rootIndex + interval) % 12]);
}

function highlightScaleModeNotes() {
  const notesInScale = getScaleModeNotes();
  const valid = notesInScale.length > 0;

  document.querySelectorAll(".note-guide").forEach((group) => {
    const note = group.dataset.note;
    const inScale = notesInScale.includes(note);

    const text = group.querySelector("text");
    const circle = group.querySelector("circle");
    const show = valid && inScale;

    group.style.opacity = show ? "1" : "0";
    group.style.pointerEvents = show ? "auto" : "none";

    // ✅ Color-coded circles
    if (circle) {
      if (settingsState["color-coded"] && show) {
        circle.setAttribute("fill", noteColors[note] || "#fff");
      } else {
        circle.setAttribute("fill", "#fff");
      }
    }

    // ✅ Color-coded text labels
    if (text) {
      if (settingsState["note-names"] && group.style.opacity === "1") {
        text.style.opacity = "1";
        text.style.fill =
          settingsState["color-coded"] && noteColors[note]
            ? noteColors[note]
            : "#fff";
      } else {
        text.style.opacity = "0";
      }
    }
  });
}

function updateScaleFretboard() {
  if (currentMode !== "scale") return;
  if (!selectedNote || !currentScaleMode) {
    clearFretboard();
    return;
  }
  highlightScaleModeNotes();
}

function clearFretboard() {
  document.querySelectorAll(".note-guide").forEach((group) => {
    group.style.opacity = "0";
    group.style.pointerEvents = "none";
    const text = group.querySelector("text");
    if (text) text.style.opacity = "0";
  });
}
