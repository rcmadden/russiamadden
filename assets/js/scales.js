// scales.js v0.1.0
// ---------------------------------------
// Purpose: encapsulate scale/degree logic so renderer can remain UI-only
// Responsibilities:
//  - Track/set Home ("1")
//  - Map KeyId -> scale degree (relative to Home)
//  - Respect existing enharmonic spelling
//  - Shared music theory functions for all charts

(function(window) {
  'use strict';

  // State: Track Home key for degree calculations
  let homeKeyId = null; // e.g., "C", "Gb"

  /* =============================================================================
      Enharmonics / naming helpers
      ============================================================================= */
  const SHARP_TO_FLAT = {
    "C#":"Db","D#":"Eb","F#":"Gb","G#":"Ab","A#":"Bb",
    "E#":"F","B#":"C",
    "Cb":"B","Fb":"E"
  };

  const toFlat = n => SHARP_TO_FLAT[n] || n;
  const normalize = toFlat;
  const prefersSharps = key => ["G","D","A","E","B","F#","C#"].includes(key);

  function displayName(norm, preferSharpsFlag){
    if (!preferSharpsFlag)
      return norm.replace('#', '♯').replace('b', '♭');
    const FLAT_TO_SHARP = {"Db":"C#","Eb":"D#","Gb":"F#","Ab":"G#","Bb":"A#"};
    let result = FLAT_TO_SHARP[norm] || norm;
    result = result.replace('#', '♯').replace('b', '♭');
    return result;
  }

  /* =============================================================================
      Home tracking (for future "first tap sets 1" feature)
      ============================================================================= */
  function setHome(keyId) {
    homeKeyId = keyId;
  }

  function getHome() {
    return homeKeyId;
  }

  function degreeOf(keyId, mode = "major") {
    if (!homeKeyId) return null;
    // TODO: Calculate degree of keyId relative to homeKeyId
    // This will be used when "first tap sets 1" is implemented
    if (normalize(keyId) === normalize(homeKeyId)) return "1";
    return "?";
  }

  /* =============================================================================
      Scale degree to note mapping (for landmarks)
      ============================================================================= */
  function degreeToNote(degree, tonic) {
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

  // Expose to window for shared use
  window.Scales = {
    // Enharmonic helpers
    toFlat,
    normalize,
    prefersSharps,
    displayName,
    // Home tracking
    setHome,
    getHome,
    degreeOf,
    // Degree mapping
    degreeToNote
  };

})(window);
