// scales.js v0.1.0
// ---------------------------------------
// Purpose: encapsulate scale/degree logic
// so renderer can remain UI-only.
// Your existing enharmonic functions should
// be imported here leaving the original logic inplace and intact.
//
// Responsibilities:
//  - Track/set Home ("1")
//  - Map KeyId -> scale degree (relative to Home)
//  - Respect existing enharmonic spelling
//
// Import into page scripts with:
//   import * as Scales from './assets/js/scales.js';

let homeKeyId = null; // "C4", "Gb3", etc.

// Set or get the Home (1)
export function setHome(keyId) {
  homeKeyId = keyId;
}

export function getHome() {
  return homeKeyId;
}

// Wrapper for your enharmonic logic
// Replace stub below with calls to your actual code
export function degreeOf(keyId, mode="major") {
  if (!homeKeyId) return null;
  // TODO: hook into your enharmonic mapping
  // Example stub (replace!):
  if (keyId === homeKeyId) return "1";
  return "?";
}


  // TODO: reuse your existing mapping


/* =============================================================================
    Enharmonics / naming helpers
    ============================================================================= */
const SHARP_TO_FLAT = {
  // Sharps to flats
  "C#":"Db","D#":"Eb","F#":"Gb","G#":"Ab","A#":"Bb",
  // Sharp naturals to naturals
  "E#":"F","B#":"C",
  // Flat naturals to naturals (fixes Cb = B issue)
  "Cb":"B","Fb":"E"
};
export const toFlat = n => SHARP_TO_FLAT[n] || n;
export const normalize = toFlat;
export const prefersSharps = key => ["G","D","A","E","B","F#","C#"].includes(key);
export function displayName(norm, preferSharpsFlag){
  if (!preferSharpsFlag)
    return norm.replace('#', '♯').replace('b', '♭');
  const FLAT_TO_SHARP = {"Db":"C#","Eb":"D#","Gb":"F#","Ab":"G#","Bb":"A#"};
  let result = FLAT_TO_SHARP[norm] || norm;
    // Replace # and b with musical symbols
  result = result.replace('#', '♯').replace('b', '♭');
  return result;
}

// Map scale degree to note given a tonic (used by landmarks)
export function degreeToNote(degree, tonic) {
  const INTERVALS = {
    '1': 0, 'b2': 1, '2': 2, 'b3': 3, '3': 4, '4': 5,
    '#4': 6, 'b5': 6, '5': 7, '#5': 8, 'b6': 8, '6': 9,
    'b7': 10, '7': 11
  };

  const normalizedTonic = normalize(tonic);
  const NOTES = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const tonicIndex = NOTES.indexOf(normalizedTonic);
  const interval = INTERVALS[degree];

  if (tonicIndex === -1 || interval === undefined) return null;

  return NOTES[(tonicIndex + interval) % 12];
}
