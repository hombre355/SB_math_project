// levels.js - Level definitions for 20 progressive levels

const LEVELS = [
  // === ADDITION (Levels 1-12) ===
  {
    id: 1,
    name: 'Tiny Additions',
    description: 'Add small numbers together!',
    operation: '+',
    display: 'horizontal',
    num1: { min: 1, max: 5 },
    num2: { min: 1, max: 4 },
    carry: false,
    teaching: 'placeValueIntro'
  },
  {
    id: 2,
    name: 'Bigger Single Digits',
    description: 'Numbers that add up past 10!',
    operation: '+',
    display: 'horizontal',
    num1: { min: 5, max: 9 },
    num2: { min: 5, max: 9 },
    carry: true,
    teaching: 'carryingIntro'
  },
  {
    id: 3,
    name: 'Two Digits + One Digit',
    description: 'Adding a small number to a bigger one!',
    operation: '+',
    display: 'horizontal',
    num1: { min: 10, max: 49 },
    num2: { min: 1, max: 9 },
    carry: false,
    teaching: 'tensColumn'
  },
  {
    id: 4,
    name: 'Two Digits + Two Digits',
    description: 'Stack them up in columns!',
    operation: '+',
    display: 'column',
    num1: { min: 11, max: 49 },
    num2: { min: 10, max: 40 },
    carry: false,
    teaching: 'columnAlignment'
  },
  {
    id: 5,
    name: 'Carrying with Two Digits',
    description: 'Time to carry numbers over!',
    operation: '+',
    display: 'column',
    num1: { min: 15, max: 89 },
    num2: { min: 15, max: 89 },
    carry: true,
    teaching: 'carryingTwoDigit'
  },
  {
    id: 6,
    name: 'Three Digits + Two Digits',
    description: 'Welcome to the hundreds!',
    operation: '+',
    display: 'column',
    num1: { min: 100, max: 499 },
    num2: { min: 10, max: 99 },
    carry: false,
    teaching: 'hundredsColumn'
  },
  {
    id: 7,
    name: 'Three Digits + Three Digits',
    description: 'Carrying across lots of columns!',
    operation: '+',
    display: 'column',
    num1: { min: 100, max: 899 },
    num2: { min: 100, max: 899 },
    carry: true,
    teaching: null
  },
  {
    id: 8,
    name: 'Four Digits + Three Digits',
    description: 'Welcome to the thousands!',
    operation: '+',
    display: 'column',
    num1: { min: 1000, max: 4999 },
    num2: { min: 100, max: 999 },
    carry: false,
    teaching: 'thousandsColumn'
  },
  {
    id: 9,
    name: 'Four Digits + Four Digits',
    description: 'Big number carrying!',
    operation: '+',
    display: 'column',
    num1: { min: 1000, max: 8999 },
    num2: { min: 1000, max: 8999 },
    carry: true,
    teaching: null
  },
  {
    id: 10,
    name: 'Five Digits + Four Digits',
    description: 'Ten-thousands are here!',
    operation: '+',
    display: 'column',
    num1: { min: 10000, max: 50000 },
    num2: { min: 1000, max: 9999 },
    carry: false,
    teaching: 'tenThousandsColumn'
  },
  {
    id: 11,
    name: 'Five Digits + Five Digits',
    description: 'The ultimate addition challenge!',
    operation: '+',
    display: 'column',
    num1: { min: 10000, max: 89999 },
    num2: { min: 10000, max: 89999 },
    carry: true,
    teaching: null
  },
  {
    id: 12,
    name: 'Addition Master Challenge',
    description: 'A mix of everything you learned!',
    operation: '+',
    display: 'column',
    num1: { min: 100, max: 89999 },
    num2: { min: 100, max: 89999 },
    carry: null, // mixed
    teaching: 'additionMastery'
  },

  // === SUBTRACTION (Levels 13-20) ===
  {
    id: 13,
    name: 'Simple Subtraction',
    description: 'Taking away small numbers!',
    operation: '-',
    display: 'horizontal',
    num1: { min: 3, max: 9 },
    num2: { min: 1, max: 0 }, // num2 max set dynamically to be < num1
    borrow: false,
    teaching: 'subtractionIntro'
  },
  {
    id: 14,
    name: 'Two Digits - One Digit',
    description: 'Subtract from bigger numbers!',
    operation: '-',
    display: 'horizontal',
    num1: { min: 11, max: 49 },
    num2: { min: 1, max: 9 },
    borrow: false,
    teaching: null
  },
  {
    id: 15,
    name: 'Two Digits - Two Digits',
    description: 'Column subtraction!',
    operation: '-',
    display: 'column',
    num1: { min: 21, max: 99 },
    num2: { min: 10, max: 0 }, // dynamic
    borrow: false,
    teaching: 'columnSubtraction'
  },
  {
    id: 16,
    name: 'Borrowing Basics',
    description: 'Learn to borrow from the next column!',
    operation: '-',
    display: 'column',
    num1: { min: 21, max: 90 },
    num2: { min: 10, max: 0 }, // dynamic
    borrow: true,
    teaching: 'borrowingIntro'
  },
  {
    id: 17,
    name: 'Three Digits - Two Digits',
    description: 'Borrowing with hundreds!',
    operation: '-',
    display: 'column',
    num1: { min: 200, max: 999 },
    num2: { min: 20, max: 99 },
    borrow: true,
    teaching: null
  },
  {
    id: 18,
    name: 'Tricky Zeros',
    description: 'Borrowing across zeros!',
    operation: '-',
    display: 'column',
    num1: { min: 200, max: 900 },
    num2: { min: 100, max: 0 }, // dynamic
    borrow: true,
    teaching: 'borrowingAcrossZeros'
  },
  {
    id: 19,
    name: 'Four Digit Subtraction',
    description: 'Thousands-level subtraction!',
    operation: '-',
    display: 'column',
    num1: { min: 2000, max: 9999 },
    num2: { min: 500, max: 0 }, // dynamic
    borrow: true,
    teaching: null
  },
  {
    id: 20,
    name: 'Subtraction Master',
    description: 'The ultimate subtraction challenge!',
    operation: '-',
    display: 'column',
    num1: { min: 20000, max: 99999 },
    num2: { min: 10000, max: 0 }, // dynamic
    borrow: true,
    teaching: 'subtractionMastery'
  }
];

// Which levels trigger teaching modules
const TEACHING_TRIGGERS = {
  placeValueIntro: 1,
  carryingIntro: 2,
  tensColumn: 3,
  columnAlignment: 4,
  carryingTwoDigit: 5,
  hundredsColumn: 6,
  thousandsColumn: 8,
  tenThousandsColumn: 10,
  additionMastery: 12,
  subtractionIntro: 13,
  columnSubtraction: 15,
  borrowingIntro: 16,
  borrowingAcrossZeros: 18,
  subtractionMastery: 20
};

function getLevelConfig(levelId) {
  return LEVELS.find(l => l.id === levelId) || LEVELS[0];
}
