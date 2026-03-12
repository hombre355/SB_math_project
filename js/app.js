// app.js - Entry point, screen routing, initialization

const App = {
  state: null,

  init() {
    // Initialize sound and speech systems
    Sounds.init();
    Speech.init();

    // Load saved progress
    this.state = Storage.load();
    Sounds.setEnabled(this.state.settings.sound);

    // Set up number pad
    this._setupNumberPad();

    // Set up other buttons
    this._setupButtons();

    // Make mascot draggable
    this._setupMascotDrag();

    // Triple-click on header title to open parent mode
    let titleClickCount = 0, titleClickTimer;
    document.getElementById('app-title').addEventListener('click', () => {
      titleClickCount++;
      clearTimeout(titleClickTimer);
      titleClickTimer = setTimeout(() => { titleClickCount = 0; }, 600);
      if (titleClickCount >= 3) {
        titleClickCount = 0;
        App.showParentMode();
      }
    });

    // Show appropriate start screen
    if (Storage.hasExistingProgress()) {
      this._showWelcomeBack();
    } else {
      this._showFirstTime();
    }
  },

  _showFirstTime() {
    UI.showScreen('welcome-screen');
    const content = UI.$('#welcome-content');
    if (content) {
      content.innerHTML = `
        <div class="welcome animate-in">
          <div class="welcome-unicorn">
            <div class="unicorn big">
              <div class="unicorn-horn"></div>
              <div class="unicorn-head">
                <div class="unicorn-eye left"></div>
                <div class="unicorn-eye right"></div>
                <div class="unicorn-mouth"></div>
              </div>
              <div class="unicorn-mane"></div>
              <div class="unicorn-body"></div>
            </div>
          </div>
          <h1 class="rainbow-text">Sarah-Beth's Math Adventure!</h1>
          <div class="app-version">v1.0</div>
          <div class="speech-bubble">
            <p>Hi ${this.state.settings.name}! I'm <strong>Twinkle the Unicorn</strong>!</p>
            <p>I'm going to help you become a math superstar!</p>
          </div>
          <button class="btn btn-primary btn-large sparkle-btn" onclick="App.startPlaying()">
            Let's Go! \uD83C\uDF1F
          </button>
        </div>
      `;
    }
  },

  _showWelcomeBack() {
    UI.showScreen('welcome-screen');
    const content = UI.$('#welcome-content');
    const level = this.state.currentLevel;
    const config = getLevelConfig(level);
    if (content) {
      content.innerHTML = `
        <div class="welcome animate-in">
          <div class="welcome-unicorn">
            <div class="unicorn big">
              <div class="unicorn-horn"></div>
              <div class="unicorn-head">
                <div class="unicorn-eye left happy"></div>
                <div class="unicorn-eye right happy"></div>
                <div class="unicorn-mouth happy"></div>
              </div>
              <div class="unicorn-mane"></div>
              <div class="unicorn-body"></div>
            </div>
          </div>
          <h1 class="rainbow-text">Welcome Back!</h1>
          <div class="speech-bubble">
            <p>Hi ${this.state.settings.name}! Twinkle missed you!</p>
            <p>You're on <strong>Level ${level}: ${config.name}</strong></p>
            <p>You have <strong>${this.state.streak}</strong> correct in a row!</p>
          </div>
          <button class="btn btn-primary btn-large sparkle-btn" onclick="App.continuePlaying()">
            Keep Going! \uD83C\uDF1F
          </button>
          <button class="btn btn-secondary" onclick="App.showMap()">
            View Progress \uD83D\uDDFA\uFE0F
          </button>
        </div>
      `;
    }
  },

  startPlaying() {
    Sounds.resume();
    Game.init(this.state);
    Game.startLevel(1);
  },

  continuePlaying() {
    Sounds.resume();
    Game.init(this.state);
    Game.startLevel(this.state.currentLevel);
  },

  goToLevel(levelId) {
    if (levelId > this.state.highestLevel) return;
    Sounds.resume();
    Game.init(this.state);
    Game.startLevel(levelId);
  },

  showMap() {
    UI.showScreen('map-screen');
    UI.renderProgressMap(this.state.currentLevel, this.state.highestLevel, this.state.levelStats);

    const stats = UI.$('#map-stats');
    if (stats) {
      const pct = this.state.totalAttempted > 0
        ? Math.round((this.state.totalCorrect / this.state.totalAttempted) * 100)
        : 0;
      stats.innerHTML = `
        <div class="overall-stats">
          <span>Total Correct: <strong>${this.state.totalCorrect}</strong></span>
          <span>Accuracy: <strong>${pct}%</strong></span>
          <span>Highest Level: <strong>${this.state.highestLevel}</strong></span>
        </div>
      `;
    }
  },

  showSettings() {
    UI.showScreen('settings-screen');
    const soundToggle = UI.$('#sound-toggle');
    if (soundToggle) soundToggle.checked = this.state.settings.sound;
    const versionEl = UI.$('#settings-version');
    if (versionEl) versionEl.textContent = APP_VERSION;
  },

  toggleSound() {
    this.state.settings.sound = !this.state.settings.sound;
    Sounds.setEnabled(this.state.settings.sound);
    Storage.save(this.state);
  },

  resetProgress() {
    // Require confirmation
    const container = UI.$('#reset-confirm');
    if (container) {
      container.classList.toggle('hidden');
    }
  },

  confirmReset() {
    this.state = Storage.reset();
    this._showFirstTime();
  },

  showParentMode() {
    const grid = document.getElementById('parent-lesson-grid');
    grid.innerHTML = '';
    LEVELS.forEach(level => {
      const card = document.createElement('div');
      card.className = 'parent-lesson-card' + (level.operation === '+' ? ' plc-addition' : ' plc-subtraction');
      card.innerHTML = `
        <div class="plc-id">Level ${level.id}</div>
        <div class="plc-name">${level.name}</div>
        <div class="plc-desc">${level.description}</div>
        <div class="plc-meta">${level.operation === '+' ? 'Addition' : 'Subtraction'} · ${level.display}</div>
      `;
      card.addEventListener('click', () => {
        Sounds.resume();
        Game.init(App.state);
        Game.startLevel(level.id);
      });
      grid.appendChild(card);
    });
    UI.showScreen('parent-screen');
  },

  goHome() {
    if (Storage.hasExistingProgress()) {
      this.state = Storage.load();
      this._showWelcomeBack();
    } else {
      this._showFirstTime();
    }
  },

  _setupNumberPad() {
    const pad = UI.$('#number-pad');
    if (!pad) return;

    let html = '<div class="numpad-grid">';
    for (let i = 1; i <= 9; i++) {
      html += `<button class="numpad-btn" data-digit="${i}">${i}</button>`;
    }
    html += `<button class="numpad-btn numpad-back" data-action="back">\u232B</button>`;
    html += `<button class="numpad-btn" data-digit="0">0</button>`;
    html += `<button class="numpad-btn numpad-submit" data-action="submit">\u2714\uFE0F</button>`;
    html += '</div>';
    pad.innerHTML = html;

    pad.addEventListener('click', (e) => {
      const btn = e.target.closest('.numpad-btn');
      if (!btn) return;
      if (btn.dataset.digit !== undefined) {
        Game.inputDigit(parseInt(btn.dataset.digit, 10));
      } else if (btn.dataset.action === 'back') {
        Game.backspace();
      } else if (btn.dataset.action === 'submit') {
        Game.submit();
      }
    });
  },

  _setupButtons() {
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') {
        Game.inputDigit(parseInt(e.key, 10));
      } else if (e.key === 'Backspace') {
        Game.backspace();
      } else if (e.key === 'Enter') {
        Game.submit();
      }
    });
  },

  _setupMascotDrag() {
    const area = document.getElementById('mascot-area');
    const mascot = document.getElementById('mascot');
    if (!area || !mascot) return;

    // Restore saved position
    try {
      const saved = JSON.parse(localStorage.getItem('mascot-pos'));
      if (saved) {
        area.style.left = saved.left + 'px';
        area.style.top = saved.top + 'px';
        area.style.bottom = 'auto';
      }
    } catch (e) {}

    let dragging = false, startX, startY, origLeft, origTop;

    const dragStart = (x, y) => {
      dragging = true;
      startX = x;
      startY = y;
      const rect = area.getBoundingClientRect();
      origLeft = rect.left;
      origTop = rect.top;
      area.style.left = origLeft + 'px';
      area.style.top = origTop + 'px';
      area.style.bottom = 'auto';
      mascot.classList.add('dragging');
    };

    const dragMove = (x, y) => {
      if (!dragging) return;
      area.style.left = (origLeft + x - startX) + 'px';
      area.style.top = (origTop + y - startY) + 'px';
    };

    const dragEnd = () => {
      if (!dragging) return;
      dragging = false;
      mascot.classList.remove('dragging');
      localStorage.setItem('mascot-pos', JSON.stringify({
        left: parseFloat(area.style.left),
        top: parseFloat(area.style.top)
      }));
    };

    mascot.addEventListener('mousedown', e => { e.preventDefault(); dragStart(e.clientX, e.clientY); });
    document.addEventListener('mousemove', e => dragMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', dragEnd);

    mascot.addEventListener('touchstart', e => { e.preventDefault(); dragStart(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
    document.addEventListener('touchmove', e => { if (dragging) { e.preventDefault(); dragMove(e.touches[0].clientX, e.touches[0].clientY); } }, { passive: false });
    document.addEventListener('touchend', dragEnd);
  }
};

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
