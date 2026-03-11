// problems.js - Problem generation engine

const Problems = {
  generate(levelConfig) {
    const maxAttempts = 100;
    for (let i = 0; i < maxAttempts; i++) {
      const problem = this._createProblem(levelConfig);
      if (problem && this._validateConstraints(problem, levelConfig)) {
        return problem;
      }
    }
    // Fallback: return a simple valid problem
    return this._createFallback(levelConfig);
  },

  _createProblem(config) {
    let num1, num2;

    if (config.operation === '+') {
      num1 = this._randRange(config.num1.min, config.num1.max);
      num2 = this._randRange(config.num2.min, config.num2.max);
      return {
        num1,
        num2,
        operation: '+',
        answer: num1 + num2,
        display: config.display
      };
    }

    if (config.operation === '-') {
      num1 = this._randRange(config.num1.min, config.num1.max);
      // For subtraction, num2 must be less than num1
      const maxNum2 = Math.min(config.num2.max > 0 ? config.num2.max : num1 - 1, num1 - 1);
      const minNum2 = Math.min(config.num2.min, maxNum2);
      num2 = this._randRange(minNum2, maxNum2);

      if (num2 < 0 || num2 >= num1) return null;

      return {
        num1,
        num2,
        operation: '-',
        answer: num1 - num2,
        display: config.display
      };
    }

    return null;
  },

  _validateConstraints(problem, config) {
    if (problem.answer < 0) return false;

    if (config.operation === '+') {
      const hasCarry = this._hasCarry(problem.num1, problem.num2);
      if (config.carry === true && !hasCarry) return false;
      if (config.carry === false && hasCarry) return false;
      // carry === null means mixed, accept anything
    }

    if (config.operation === '-') {
      const hasBorrow = this._hasBorrow(problem.num1, problem.num2);
      if (config.borrow === true && !hasBorrow) return false;
      if (config.borrow === false && hasBorrow) return false;
    }

    // For level 18 (tricky zeros), ensure num1 has a zero in a middle digit
    if (config.id === 18) {
      const s = String(problem.num1);
      const hasMiddleZero = s.slice(1, -1).includes('0');
      if (!hasMiddleZero) {
        // Force a zero: replace a middle digit
        const digits = s.split('');
        const midIdx = Math.floor(digits.length / 2);
        digits[midIdx] = '0';
        problem.num1 = parseInt(digits.join(''), 10);
        problem.answer = problem.num1 - problem.num2;
        if (problem.answer <= 0) return false;
      }
    }

    return true;
  },

  _hasCarry(a, b) {
    const sa = String(a).split('').reverse();
    const sb = String(b).split('').reverse();
    let carry = 0;
    const maxLen = Math.max(sa.length, sb.length);
    for (let i = 0; i < maxLen; i++) {
      const da = parseInt(sa[i] || '0', 10);
      const db = parseInt(sb[i] || '0', 10);
      const sum = da + db + carry;
      if (sum >= 10) {
        return true;
      }
      carry = Math.floor(sum / 10);
    }
    return false;
  },

  _hasBorrow(a, b) {
    const sa = String(a).split('').reverse();
    const sb = String(b).split('').reverse();
    let borrow = 0;
    for (let i = 0; i < sb.length; i++) {
      const da = parseInt(sa[i] || '0', 10) - borrow;
      const db = parseInt(sb[i] || '0', 10);
      if (da < db) {
        return true;
      }
      borrow = da < db ? 1 : 0;
    }
    return false;
  },

  _randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  _createFallback(config) {
    if (config.operation === '+') {
      return {
        num1: config.num1.min,
        num2: config.num2.min,
        operation: '+',
        answer: config.num1.min + config.num2.min,
        display: config.display
      };
    }
    const n1 = config.num1.min;
    const n2 = Math.min(config.num2.min, n1 - 1);
    return {
      num1: n1,
      num2: Math.max(1, n2),
      operation: '-',
      answer: n1 - Math.max(1, n2),
      display: config.display
    };
  },

  // Compute per-column answer digits and carry/borrow out for column-mode input
  // Returns array indexed 0=ones, 1=tens, etc.
  computeColumnData(num1, num2, operation) {
    const answer = operation === '+' ? num1 + num2 : num1 - num2;
    const totalCols = String(answer).length;
    const sa = String(num1).split('').reverse();
    const sb = String(num2).split('').reverse();
    const columns = [];

    if (operation === '+') {
      let carry = 0;
      for (let i = 0; i < totalCols; i++) {
        const da = parseInt(sa[i] || '0', 10);
        const db = parseInt(sb[i] || '0', 10);
        const sum = da + db + carry;
        const digit = sum % 10;
        carry = Math.floor(sum / 10);
        columns.push({ digit, carryOut: carry });
      }
    } else {
      let borrow = 0;
      for (let i = 0; i < totalCols; i++) {
        const da = parseInt(sa[i] || '0', 10);
        const db = parseInt(sb[i] || '0', 10);
        const top = da - borrow;
        let digit, borrowOut;
        if (top < db) {
          digit = top + 10 - db;
          borrowOut = 1;
        } else {
          digit = top - db;
          borrowOut = 0;
        }
        columns.push({ digit, carryOut: borrowOut });
        borrow = borrowOut;
      }
    }

    return columns;
  },

  // Format number with place value labels for teaching
  getPlaceValues(num) {
    const names = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten-Thousands'];
    const digits = String(num).split('').reverse();
    return digits.map((d, i) => ({
      digit: parseInt(d, 10),
      place: names[i] || '',
      position: i
    }));
  }
};
