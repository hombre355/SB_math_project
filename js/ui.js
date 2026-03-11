// ui.js - DOM helpers, confetti, animations, mascot

const UI = {
  $(sel) { return document.querySelector(sel); },
  $$(sel) { return document.querySelectorAll(sel); },

  show(sel) {
    const el = typeof sel === 'string' ? this.$(sel) : sel;
    if (el) el.classList.remove('hidden');
  },

  hide(sel) {
    const el = typeof sel === 'string' ? this.$(sel) : sel;
    if (el) el.classList.add('hidden');
  },

  showScreen(screenId) {
    this.$$('.screen').forEach(s => s.classList.add('hidden'));
    const screen = this.$('#' + screenId);
    if (screen) {
      screen.classList.remove('hidden');
      screen.classList.add('screen-enter');
      setTimeout(() => screen.classList.remove('screen-enter'), 400);
    }
  },

  // Streak stars display
  updateStreak(count) {
    const container = this.$('#streak-stars');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 10; i++) {
      const star = document.createElement('span');
      star.className = 'streak-star' + (i < count ? ' filled' : '');
      star.textContent = i < count ? '\u2B50' : '\u2606';
      if (i === count - 1 && count > 0) {
        star.classList.add('pop');
      }
      container.appendChild(star);
    }
  },

  // Confetti burst
  confetti() {
    const container = this.$('#confetti-container');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#A78BFA', '#F472B6', '#FCD34D', '#6EE7B7', '#F9A8D4', '#93C5FD', '#FCA5A5'];
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.5 + 's';
      piece.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
      const size = 6 + Math.random() * 8;
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
    }
    setTimeout(() => { container.innerHTML = ''; }, 3000);
  },

  // Mascot speech bubble
  mascotSay(text, mood) {
    const bubble = this.$('#mascot-speech');
    const mascot = this.$('#mascot');
    if (bubble) {
      bubble.textContent = text;
      bubble.classList.remove('hidden');
      setTimeout(() => bubble.classList.add('hidden'), 3000);
    }
    if (mascot) {
      mascot.className = 'mascot';
      if (mood) mascot.classList.add('mascot-' + mood);
    }
  },

  // Wiggle animation for wrong answers
  wiggle(sel) {
    const el = typeof sel === 'string' ? this.$(sel) : sel;
    if (!el) return;
    el.classList.add('wiggle');
    setTimeout(() => el.classList.remove('wiggle'), 500);
  },

  // Render column (vertical) problem display
  renderColumnProblem(num1, num2, operation, maxDigits) {
    const container = this.$('#problem-column');
    if (!container) return;

    const s1 = String(num1).padStart(maxDigits, '\u00A0');
    const s2 = String(num2).padStart(maxDigits, '\u00A0');
    const placeNames = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];

    let html = '<div class="column-problem">';
    // Carry/borrow input row (above the numbers)
    html += '<div class="column-row carry-row" id="carry-boxes">';
    for (let i = 0; i < totalBoxes; i++) {
      html += `<span class="carry-input-box" data-pos="${totalBoxes - 1 - i}"></span>`;
    }
    html += '</div>';
    // Place value labels
    html += '<div class="place-labels">';
    for (let i = maxDigits - 1; i >= 0; i--) {
      html += `<span class="place-label place-${placeNames[i] || ''}">${(placeNames[i] || '').charAt(0).toUpperCase()}</span>`;
    }
    html += '</div>';

    // First number
    html += '<div class="column-row num-row">';
    for (let i = 0; i < maxDigits; i++) {
      const d = s1[i];
      const placeIdx = maxDigits - 1 - i;
      html += `<span class="digit-box place-color-${placeIdx}">${d}</span>`;
    }
    html += '</div>';

    // Operation + second number
    html += '<div class="column-row num-row">';
    html += `<span class="operation-sign">${operation}</span>`;
    for (let i = 0; i < maxDigits; i++) {
      const d = s2[i];
      const placeIdx = maxDigits - 1 - i;
      // Skip first position since operation sign is there, shift digits
      if (i === 0 && s2[0] === '\u00A0') {
        continue;
      }
      html += `<span class="digit-box place-color-${placeIdx}">${d}</span>`;
    }
    html += '</div>';

    // Line
    html += '<div class="column-line"></div>';

    // Answer boxes
    html += '<div class="column-row answer-row" id="answer-boxes">';
    const answerLen = String(operation === '+' ? num1 + num2 : num1 - num2).length;
    const totalBoxes = Math.max(maxDigits, answerLen);
    for (let i = 0; i < totalBoxes; i++) {
      html += `<span class="digit-box answer-box" data-pos="${totalBoxes - 1 - i}"></span>`;
    }
    html += '</div>';

    html += '</div>';
    container.innerHTML = html;
  },

  // Render horizontal problem display
  renderHorizontalProblem(num1, num2, operation) {
    const container = this.$('#problem-horizontal');
    if (!container) return;
    container.innerHTML = `
      <span class="h-num">${num1}</span>
      <span class="h-op">${operation}</span>
      <span class="h-num">${num2}</span>
      <span class="h-eq">=</span>
      <span class="h-answer" id="h-answer-display">?</span>
    `;
  },

  // Update answer display
  updateAnswerDisplay(value, display) {
    if (display === 'horizontal') {
      const el = this.$('#h-answer-display');
      if (el) el.textContent = value || '?';
    } else {
      const boxes = this.$$('#answer-boxes .answer-box');
      const digits = String(value).split('').reverse();
      boxes.forEach((box, i) => {
        const revI = boxes.length - 1 - i;
        const digit = digits[revI];
        box.textContent = digit || '';
        box.classList.toggle('filled', !!digit);
      });
    }
  },

  // Column-mode input helpers
  // colIdx: 0=ones, 1=tens, … DOM is right-to-left so domIdx = boxes.length - 1 - colIdx

  highlightAnswerBox(colIdx) {
    const boxes = this.$$('#answer-boxes .answer-box');
    boxes.forEach(b => b.classList.remove('active'));
    const domIdx = boxes.length - 1 - colIdx;
    if (boxes[domIdx]) boxes[domIdx].classList.add('active');
  },

  lockAnswerDigit(colIdx, digit) {
    const boxes = this.$$('#answer-boxes .answer-box');
    const domIdx = boxes.length - 1 - colIdx;
    if (boxes[domIdx]) {
      boxes[domIdx].textContent = String(digit);
      boxes[domIdx].classList.remove('active');
      boxes[domIdx].classList.add('locked');
    }
  },

  shakeAnswerBox(colIdx) {
    const boxes = this.$$('#answer-boxes .answer-box');
    const domIdx = boxes.length - 1 - colIdx;
    if (boxes[domIdx]) this.wiggle(boxes[domIdx]);
  },

  highlightCarryBox(colIdx) {
    const boxes = this.$$('#carry-boxes .carry-input-box');
    boxes.forEach(b => b.classList.remove('active'));
    const domIdx = boxes.length - 1 - colIdx;
    if (boxes[domIdx]) boxes[domIdx].classList.add('active');
  },

  lockCarryDigit(colIdx) {
    const boxes = this.$$('#carry-boxes .carry-input-box');
    const domIdx = boxes.length - 1 - colIdx;
    if (boxes[domIdx]) {
      boxes[domIdx].textContent = '1';
      boxes[domIdx].classList.remove('active');
      boxes[domIdx].classList.add('locked');
    }
  },

  shakeCarryBox(colIdx) {
    const boxes = this.$$('#carry-boxes .carry-input-box');
    const domIdx = boxes.length - 1 - colIdx;
    if (boxes[domIdx]) this.wiggle(boxes[domIdx]);
  },

  // Progress map
  renderProgressMap(currentLevel, highestLevel, levelStats) {
    const container = this.$('#progress-map');
    if (!container) return;
    let html = '<div class="progress-path">';
    for (let i = 1; i <= 20; i++) {
      const config = getLevelConfig(i);
      const isCompleted = levelStats[i] && levelStats[i].completed;
      const isCurrent = i === currentLevel;
      const isLocked = i > highestLevel;
      let cls = 'level-node';
      if (isCompleted) cls += ' completed';
      if (isCurrent) cls += ' current';
      if (isLocked) cls += ' locked';
      if (i === 13) html += '<div class="path-divider">Subtraction!</div>';
      html += `<div class="${cls}" data-level="${i}">
        <span class="level-num">${i}</span>
        <span class="level-icon">${isCompleted ? '\u2B50' : (isLocked ? '\uD83D\uDD12' : '\u2606')}</span>
        <span class="level-name">${config.name}</span>
      </div>`;
    }
    html += '</div>';
    container.innerHTML = html;

    // Add click handlers for unlocked levels
    container.querySelectorAll('.level-node:not(.locked)').forEach(node => {
      node.addEventListener('click', () => {
        const level = parseInt(node.dataset.level, 10);
        if (typeof App !== 'undefined' && App.goToLevel) {
          App.goToLevel(level);
        }
      });
    });
  },

  // Encouraging messages
  getCorrectMessage(name) {
    const messages = [
      `Amazing, ${name}!`,
      `You're a math star, ${name}!`,
      `Super job, ${name}!`,
      `Wow, ${name}! You got it!`,
      `Brilliant, ${name}!`,
      `You're so smart, ${name}!`,
      `Fantastic work, ${name}!`,
      `Way to go, ${name}!`,
      `${name}, you're on fire!`,
      `Unicorn-level smart, ${name}!`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },

  getWrongMessage(name) {
    const messages = [
      `Almost, ${name}! Try again!`,
      `So close! You can do it, ${name}!`,
      `Don't worry, ${name}! Let's try once more!`,
      `Oops! Give it another shot, ${name}!`,
      `Keep trying, ${name}! You've got this!`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  },

  getStreakMessage(count, name) {
    if (count === 5) return `Halfway there, ${name}! 5 in a row!`;
    if (count === 7) return `Almost there, ${name}! Just 3 more!`;
    if (count === 9) return `ONE MORE, ${name}! You can do it!`;
    return '';
  }
};
