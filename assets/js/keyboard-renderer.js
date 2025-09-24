// keyboard-renderer.js v0.1.0
// ---------------------------------------
// Purpose: single source of truth for drawing
// keyboards, dots, labels, and landmarks.
//
// Reads offsets from CSS (helper.css) or constants.
// Consumes scale logic from scales.js.
// Avoids any page-specific UI code.

import * as Scales from './scales.js';

export function createKeyboardAPI(containerEl, options={}) {
  // Defaults
  const state = {
    marks: [],
    labels: { position: "above" },
    offsets: {
      whiteDotY: -8,
      blackDotY: -10,
      labelY: -22,
      landmarkY: -18
    },
    ...options
  };

  // Main draw
  function redraw() {
    // TODO: render keys + marks into containerEl
    // - Use Scales.degreeOf() for scale numbering
    // - Position dots/landmarks using state.offsets
    containerEl.innerHTML = "<div>Keyboard render placeholder</div>";
  }

  // Public API
  return {
    setScale(cfg) {
      if (cfg.tonic) Scales.setHome(cfg.tonic);
      redraw();
    },
    setOffsets(newOffsets) {
      state.offsets = { ...state.offsets, ...newOffsets };
      redraw();
    },
    setMarks(marksArray) {
      state.marks = marksArray;
      redraw();
    },
    showMarks(show=true) {
      state.marks.forEach(m => m.visible = show);
      redraw();
    },
    setLabels(cfg) {
      state.labels = cfg;
      redraw();
    },
    redraw,
    onKeyClick: null // page glue can assign a handler
  };
}
