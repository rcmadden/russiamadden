// landmarks-config.js v0.1.0
// Configuration for landmark characters and their placement rules

(function(window) {
  'use strict';

  window.LANDMARKS_CONFIG = {
  // Characters placed on specific scale degrees
  characters: {
    magician: {
      symbol: '🎩',
      degree: '#4',
      name: 'Magician',
      mutuallyExclusive: ['scientist']
    },
    scientist: {
      symbol: '👩‍🔬',
      degree: '#4',
      name: 'Scientist',
      mutuallyExclusive: ['magician']
    },
    queen: {
      symbol: '👸',
      degree: '#5',
      name: 'Queen',
      mutuallyExclusive: ['king']
    },
    king: {
      symbol: '🫅',
      degree: 'b6',
      name: 'King',
      mutuallyExclusive: ['queen']
    },
    architect: {
      symbol: '📐',
      degree: 'b2',
      name: 'Architect',
      mutuallyExclusive: []
    },
    author: {
      symbol: '✍️',
      degree: 'b3',
      name: 'Author',
      mutuallyExclusive: []
    },
    traveler: {
      symbol: '🧳',
      degree: 'b7',
      name: 'Traveler',
      mutuallyExclusive: []
    }
  },

  // Basic landmarks placed on specific scale degrees
  landmarks: {
    camp: {
      symbol: '⛺',
      degree: '1',
      name: 'Camp',
      mutuallyExclusive: []
    },
    fire: {
      symbol: '🔥',
      degree: '3',
      name: 'Fire',
      mutuallyExclusive: []
    },
    mk: {
      symbol: 'MK',
      degree: '#4',
      name: 'Middle Key',
      class: 'mk',
      alwaysOn: true,
      mutuallyExclusive: []
    },
    borders: {
      symbol: '🚩',
      degrees: ['#4', '7'],
      name: 'Borders',
      mutuallyExclusive: []
    },
    stars: {
      symbol: '⭐',
      degrees: ['#4', '7'],
      name: 'Sus & LT',
      mutuallyExclusive: []
    },
    middleKeys: {
      symbol: '*',
      fixed: true,
      keys: ['D', 'Ab'],
      name: 'Middle Keys (fixed)',
      class: 'middle-key',
      mutuallyExclusive: []
    }
  },

  // Sets and pairs with special rendering rules
  sets: {
    headsTails: {
      name: 'Heads or Tails',
      heads: { symbol: '(H)', degree: '1', class: 'head-tail' },
      tails: { symbol: '(T)', degree: '6', class: 'head-tail' },
      connector: { symbol: '<---->', class: 'head-tail-connector' },
      mutuallyExclusive: []
    },
    trade: {
      symbol: '4',
      degree: '#4',
      name: 'The Trade',
      dependsOn: 'headsTails',
      mutuallyExclusive: []
    },
    siesta: {
      symbol: '5',
      degree: '5',
      name: 'Siesta',
      appearsBoth: true,
      mutuallyExclusive: []
    }
  }
};

})(window);