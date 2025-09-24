// scales.js v0.1.0
// Shared music theory functions (non-module for file:// compatibility)

(function(window) {
  'use strict';

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

  // Map scale degree to note given a tonic (used by landmarks)
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
    toFlat,
    normalize,
    prefersSharps,
    displayName,
    degreeToNote
  };

})(window);
