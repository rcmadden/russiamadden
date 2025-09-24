// landmarks.js v0.1.0
// ---------------------------------------
// Purpose: Render and manage landmarks/characters on keyboard
// Depends on: scales.js for degreeToNote mapping
//
// Architecture:
// - Read from landmarks-config.js for landmark definitions
// - Use scales.js for all music theory calculations
// - Render as HTML overlays positioned absolutely over SVG
//
// Usage:
//   <script src="./assets/js/scales.js"></script>
//   <script src="./assets/js/landmarks-config.js"></script>
//   <script src="./assets/js/landmarks.js"></script>

// State
let activeLandmark = null;
let mirrorMode = true;

// Get SVG bounding box and convert SVG coords to page coords
function svgToPageCoords(svgX, svgY) {
  const svg = document.getElementById('keyboard');
  const pt = svg.createSVGPoint();
  pt.x = svgX;
  pt.y = svgY;
  const transformed = pt.matrixTransform(svg.getScreenCTM());
  return { x: transformed.x, y: transformed.y };
}

// Get key position in SVG coordinates (reuse existing xFor logic)
function getKeyPosition(note, oct) {
  const localCxU1 = { C:40, D:120, E:200, Db:80, Eb:160 };
  const localCxU2 = { F:40, G:120, A:200, B:280, Gb:80, Ab:160, Bb:240 };
  const inU1 = n => ["C","D","E","Db","Eb"].includes(n);

  const parseTx = tr => { const m=/translate\(([-\d.]+),/.exec(tr||""); return m?parseFloat(m[1]):0; };
  const groupBase = oct => parseTx(document.getElementById(oct===1?"oct1":"oct2").getAttribute("transform"));
  const unitTx = (oct,unit) => parseTx(document.getElementById(`oct${oct}-u${unit}`).getAttribute("transform"));

  const unit = inU1(note) ? 1 : 2;
  const x = groupBase(oct) + unitTx(oct, unit) + (unit===1 ? localCxU1[note] : localCxU2[note]);

  // Y position: check if black or white key
  const isBlack = note.includes('b') || note.includes('#');
  const y = 60 + (isBlack ? 150 : 270); // groupY + (blackDotY or whiteDotY position)

  return { x, y, isBlack };
}

// Render landmarks as HTML overlays
function renderLandmarks() {
  // Remove existing landmarks
  document.querySelectorAll('.landmark').forEach(el => el.remove());

  if (!activeLandmark) return;

  const scale = document.getElementById('scale-select').value;
  if (!scale) return; // Only show landmarks when a scale is selected

  const showingTwo = document.getElementById('toggle-octaves').textContent.includes('One');
  const octList = showingTwo ? [1,2] : [1];

  const config = window.LANDMARKS_CONFIG;
  if (!config) return;

  // Get landmark configuration
  let landmarkDef = config.landmarks[activeLandmark] || config.characters[activeLandmark];
  if (!landmarkDef) return;

  const degree = landmarkDef.degree;
  const symbol = landmarkDef.symbol;
  const cssClass = landmarkDef.class || '';

  const note = window.ScalesModule?.degreeToNote(degree, scale);
  if (!note) return;

  octList.forEach(oct => {
    const pos = getKeyPosition(note, oct);
    const pageCoords = svgToPageCoords(pos.x, pos.y);

    // Calculate offset above the dot
    const landmarkY = pos.isBlack ? -90 : -50;

    const landmark = document.createElement('div');
    landmark.className = `landmark ${cssClass}`.trim();
    landmark.textContent = symbol;
    landmark.style.left = `${pageCoords.x}px`;
    landmark.style.top = `${pageCoords.y + landmarkY}px`;
    landmark.setAttribute('data-landmark', activeLandmark);
    landmark.setAttribute('data-note', note);
    landmark.setAttribute('data-octave', oct);

    document.body.appendChild(landmark);
  });
}

// Public API
function setActiveLandmark(landmarkId) {
  activeLandmark = landmarkId || null;
  renderLandmarks();
}

function setMirrorMode(enabled) {
  mirrorMode = enabled;
  renderLandmarks();
}

// Export for use in page scripts
window.LandmarksModule = {
  render: renderLandmarks,
  setActive: setActiveLandmark,
  setMirrorMode: setMirrorMode
};