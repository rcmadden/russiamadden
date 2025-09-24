BUILD_STEPS.md — Shared Renderer + Scale Engine (Units & Reference)
Current state (your words): folders + stubs created, some code copied.
Guiding goals: DRY renderer, no rewrite of working UI, keep helper.css authoritative, copy first → validate → only then retire inline code.
0) Repo snapshot (what we assume exists)
helper.css            #  existing shared CSS
/assets/js/scales.js              # stub created
/assets/js/keyboard-renderer.js   # stub created
units.html
reference-chart.html
1) Wire modules safely (no behavior change)
Why: Load the new files without touching any existing logic yet.
In both pages, add a module import after your existing <script> tags:
<script type="module">
  import { createKeyboardAPI } from './assets/js/keyboard-renderer.js';
  // Optional smoke test:
  console.log('[kbd] module loaded');
</script>
Acceptance: Page works exactly as before; console shows [kbd] module loaded.
2) Copy your enharmonic logic into scales.js (keep originals in place)
Why: Centralize theory math; don’t break pages.
Open assets/js/scales.js. Above/below the stubs, paste your existing enharmonic helpers (naming & comments intact).
Implement the tiny wrapper API:
// scales.js

let homeKeyId = null; // e.g., "Gb4"

// Copy your enharmonic helpers here (do not rename unless needed).

export function setHome(keyId) {
  homeKeyId = keyId;
}
export function getHome() {
  return homeKeyId;
}

// Use YOUR helpers here (replace the placeholder logic)
export function degreeOf(keyId, mode = "major") {
  if (!homeKeyId) return null;
  // Return "1","b2","2","b3",... based on your existing mapping relative to homeKeyId
  // e.g., return myDegreeFromHome(keyId, homeKeyId, mode);
  return "?"; // TEMP: replace
}

Acceptance: The console result matches what your inline code would produce for the same test inputs.
Do not delete or comment out your inline enharmonic code yet.
3) Make helper.css the single source of offsets (JS reads CSS vars)
Why: One place to change dot/label/landmark Y anchors.
In helper.css, add variables if not already present (names can match your scheme):
:root {
  --dot-white-y: -8px;
  --dot-black-y: -10px;
  --label-y: -22px;
  --landmark-y: -18px;
}
In keyboard-renderer.js, read these once:
function readOffsetsFromCSS() {
  const cs = getComputedStyle(document.documentElement);
  const px = v => parseInt(v, 10);
  return {
    whiteDotY: px(cs.getPropertyValue('--dot-white-y')),
    blackDotY: px(cs.getPropertyValue('--dot-black-y')),
    labelY:    px(cs.getPropertyValue('--label-y')),
    landmarkY: px(cs.getPropertyValue('--landmark-y')),
  };
}
Initialize renderer state from CSS:
const state = {
  marks: [],
  labels: { position: "above" },
  offsets: readOffsetsFromCSS(),
  ...options
};
Acceptance: Offsets log to console and match your expectations; no visual change yet.
4) Move dot drawing into the renderer (minimal first)
Why: One function controls dot positions for both pages.
In keyboard-renderer.js, implement just enough to draw your current dots (no labels/landmarks yet):
import * as Scales from './scales.js';

export function createKeyboardAPI(containerEl, options = {}) {
  const state = {
    marks: [], // {key:"C4", type:"dot", color:"pink", visible:true}
    labels: { position: "above" },
    offsets: readOffsetsFromCSS(),
    ...options
  };

  function renderKeys() {
    // TODO: generate your existing key DOM/SVG here (white+black keys)
    // Keep structure compatible with your CSS classes.
  }

  function renderMarks() {
    // Position dots using state.offsets.whiteDotY / blackDotY
    // For each mark where mark.type === 'dot' && mark.visible, append to the correct key element.
  }

  function redraw() {
    containerEl.innerHTML = '';
    renderKeys();
    renderMarks();
  }

  return {
    setScale(cfg) { if (cfg?.tonic) Scales.setHome(cfg.tonic); redraw(); },
    setOffsets(newOffsets) { state.offsets = { ...state.offsets, ...newOffsets }; redraw(); },
    setMarks(marksArray) { state.marks = marksArray; redraw(); },
    showMarks(show = true) { state.marks.forEach(m => m.visible = show); redraw(); },
    setLabels(cfg) { state.labels = cfg; redraw(); },
    redraw,
    onKeyClick: null,
  };
}
In the page glue (units.html), build the same dots array you already use and hand it to the renderer:
<script type="module">
  import { createKeyboardAPI } from './assets/js/keyboard-renderer.js';

  const kb = createKeyboardAPI(document.getElementById('keyboard'), { /* options */ });

  // Build from your existing page data (reuse current structures):
  const initialDots = [
    // { key: 'C4', type: 'dot', color: 'pink', visible: true },
    // populate from your current logic instead of hardcoding
  ];

  kb.setMarks(initialDots);
  kb.redraw();
</script>
Acceptance: Visual dots match pixel-for-pixel with your current rendering. If not: adjust CSS vars in helper.css (not JS numbers) until they do.
Still leave the old inline dot code present but inactive (comment the invocation, not the functions), so you can flip back if needed.
5) “First tap sets 1” (Home) + degree numbering wrapper
Why: Scale-aware UI without touching enharmonic internals.
Expose a click hook in the renderer (already in stub): onKeyClick(keyId).
In page glue:
<script type="module">
  import { createKeyboardAPI } from './assets/js/keyboard-renderer.js';
  import * as Scales from './assets/js/scales.js';

  const kb = createKeyboardAPI(document.getElementById('keyboard'));

  kb.onKeyClick = (keyId) => {
    if (!Scales.getHome()) {
      Scales.setHome(keyId);          // first tap fixes Home
      kb.redraw();                    // re-number labels later in Step 7
    }
    // else: toggle a dot or a landmark according to current control state
  };
</script>
Acceptance: With no tonic selected, first tap sets Home; subsequent taps keep it until user changes via control.
6) Landmarks layer (same anchor as dots)
Why: Add the second mark type now while API is simple.
Treat landmarks exactly like dots but with type: 'landmark' and either a symbol or className.
Add two controls (duplicated in both pages for now):
“Show Landmarks” (checkbox) → kb.showMarks(..) for marks with type:'landmark' only.
“Landmark Types” (multi-select chips or checkboxes). If multiple selected, a key tap cycles the next symbol.
Acceptance: Landmarks show/hide cleanly; positions align with dots identically across both pages.
7) Labels positioning (None / Above / Below)
Why: Finalize consistent vertical placement.
Ensure your existing Labels dropdown calls:
kb.setLabels({ position: 'none' | 'above' | 'below' });
In renderer, use state.labels.position and the single CSS var --label-y.
For “below,” invert sign or add --label-y-below if you prefer explicit values.
Acceptance: Switching label position looks identical on Units and Reference in all tested keys/octaves.
8) Switch Reference page to shared renderer
Why: Finish the DRY pass; both pages driven by the same code.
Repeat Step 4–7 wiring inside reference-chart.html.
Keep old inline functions present but do not call them; use the renderer API instead.
Acceptance: Visual parity check (screen capture/overlay) shows no pixel drift versus the old behavior.
9) Regression QA matrix
Test the following combinations on both pages:
Keys: C, Gb, B
Octaves: 1 and 2
Start on Unit: 1 and 2
Labels: None / Above / Below
Landmarks: Off / On; 2 symbols selected; cycle on tap
First tap sets 1: clear tonic → tap → degrees update → change tonic via dropdown → re-number
Acceptance: No layout shifts, consistent anchors, correct degree numbering.
10) Comment-out inline duplicates → remove ✂️
Why: Finalize DRY once validated.
Comment out the old inline calls for dots/labels (leave function definitions a day while you test).
If all good, remove the duplicate functions from both pages and keep a short comment with the renderer version:
<!-- Using shared renderer v0.1.x (assets/js/keyboard-renderer.js). 
     Enharmonic logic delegated to assets/js/scales.js. -->
11) Versioning & commit trail
Bump page headers to 0.0.7 (feature complete).
Add file banners:
scales.js: // v0.1.0 – wraps existing enharmonic logic + Home/degree
keyboard-renderer.js: // v0.1.0 – single source for keys/dots/landmarks/labels
Suggested commits:
feat(renderer): add shared keyboard renderer + css-var offsets (no behavior change)
feat(scales): copy enharmonic logic + add setHome/degreeOf wrapper
feat(units): switch dots to shared renderer (pixel parity)
feat(reference): switch dots to shared renderer (pixel parity)
feat: landmarks layer + show/hide + multi-select
feat: labels position wired (none/above/below)
chore: remove legacy inline rendering, keep comments
12) Rollback plan (quick)
Keep units.backup.html & reference-chart.backup.html.
If something goes wrong, temporarily rename assets/js/scales.js and keyboard-renderer.js to *.off and restore the backups.
Appendix A — Minimal selectors the renderer expects
Container: #keyboard (existing)
Key elements carry classes you already use: .key-white, .key-black
Dot element class: .dot (style from helper.css)
Landmark element class: .landmark (copy .dot base styles, adjust size/line-height as needed)
Appendix B — Sample “marks” structure USE THE pasted document for the details
(You can keep using your current in-page data; just transform to this shape in page glue.)