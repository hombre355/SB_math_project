// speech.js - Text-to-Speech with natural, child-friendly voice
//
// Voice quality strategy:
//  1. Prioritise Google/Neural voices (Chrome/Chromium) - far more natural
//  2. Fall back to known high-quality OS voices (Samantha on macOS, etc.)
//  3. Use moderate pitch & rate so it doesn't sound like a chipmunk or a robot
//  4. Break text into shorter sentence chunks so the engine applies proper
//     intonation to each sentence rather than monotoning through a wall of text

const Speech = {
  synth: window.speechSynthesis || null,
  speaking: false,
  voice: null,
  enabled: true,

  // Voice preference list – highest quality first
  // Google Neural voices (Chrome/Chromium on Pi) are noticeably more natural
  VOICE_PRIORITY: [
    'Google US English',
    'Google UK English Female',
    'Google UK English Male',
    'Microsoft Aria',
    'Microsoft Jenny',
    'Microsoft Zira',
    'Samantha',          // macOS
    'Karen',             // macOS Australian
    'Moira',             // macOS Irish
    'Tessa',             // macOS South African
    'Victoria',          // macOS
    'Fiona',             // macOS Scottish
  ],

  init() {
    if (!this.synth) return;
    this._pickVoice();
    // Voices list can arrive late in Chrome
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this._pickVoice();
    }
  },

  _pickVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices.length) return;

    // Try each preferred voice in order
    for (const name of this.VOICE_PRIORITY) {
      const match = voices.find(
        v => v.name === name || (v.name.includes(name) && v.lang.startsWith('en'))
      );
      if (match) { this.voice = match; return; }
    }

    // Fallback 1 – any online (usually higher quality) English voice
    const online = voices.find(v => v.lang.startsWith('en') && !v.localService);
    if (online) { this.voice = online; return; }

    // Fallback 2 – any English voice at all
    const english = voices.find(v => v.lang.startsWith('en'));
    if (english) { this.voice = english; }
  },

  // Speak a single utterance with natural-sounding settings
  read(text) {
    if (!this.synth || !this.enabled || !text) return;
    this.stop();

    // Split on sentence boundaries so each gets proper intonation
    const sentences = this._splitSentences(text);
    this._speakQueue(sentences);
  },

  // Speak an array of sentences sequentially
  _speakQueue(sentences) {
    if (!sentences.length) return;

    this.speaking = true;
    this._updateButton(true);

    const speakNext = (index) => {
      if (index >= sentences.length || !this.speaking) {
        this.speaking = false;
        this._updateButton(false);
        return;
      }

      const u = new SpeechSynthesisUtterance(sentences[index]);
      if (this.voice) u.voice = this.voice;

      // Natural settings: slight warmth without chipmunk effect
      u.pitch  = 1.1;   // Slightly bright but not cartoon-y
      u.rate   = 0.92;  // A touch slower for clarity
      u.volume = 1.0;

      u.onend   = () => speakNext(index + 1);
      u.onerror = () => { this.speaking = false; this._updateButton(false); };

      this.synth.speak(u);
    };

    speakNext(0);
  },

  // Split text into natural sentence chunks for better prosody
  _splitSentences(text) {
    return text
      .replace(/\s+/g, ' ')
      .trim()
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(Boolean);
  },

  stop() {
    if (!this.synth) return;
    this.speaking = false;
    this.synth.cancel();
    this._updateButton(false);
  },

  toggle() {
    if (this.speaking) {
      this.stop();
    } else {
      this.readScreen();
    }
  },

  _updateButton(isSpeaking) {
    const btn = document.getElementById('read-aloud-btn');
    if (!btn) return;
    btn.classList.toggle('speaking', isSpeaking);
    btn.title = isSpeaking ? 'Stop reading' : 'Read aloud';
  },

  readScreen() {
    const text = this._getScreenText();
    if (text) this.read(text);
  },

  // ── Screen-specific text builders ────────────────────────────────────────

  _getScreenText() {
    const screen = document.querySelector('.screen:not(.hidden)');
    if (!screen) return '';
    switch (screen.id) {
      case 'welcome-screen':       return this._getWelcomeText();
      case 'teaching-screen':      return this._getTeachingText();
      case 'game-screen':          return this._getGameText();
      case 'level-complete-screen':return this._getLevelCompleteText();
      case 'victory-screen':       return this._getVictoryText();
      case 'map-screen':           return this._getMapText();
      case 'settings-screen':
        return 'Settings. Here you can turn sound effects on or off, or reset all progress.';
      default: return '';
    }
  },

  _getWelcomeText() {
    const bubble = document.querySelector('#welcome-screen .speech-bubble');
    return bubble ? bubble.textContent.trim() : "Welcome to Sarah-Beth's Math Adventure!";
  },

  _getTeachingText() {
    const parts = [];

    const bubble = document.querySelector('.teaching-bubble p');
    if (bubble) parts.push(bubble.textContent.trim());

    document.querySelectorAll('.pv-explain').forEach(el => parts.push(el.textContent.trim()));
    document.querySelectorAll('.ct-step').forEach(el => parts.push(el.textContent.trim()));
    document.querySelectorAll('.demo-step').forEach(el => parts.push(el.textContent.trim()));

    const demoText = document.querySelector('.demo-text');
    if (demoText) parts.push(demoText.textContent.trim());

    const mastery = document.querySelector('.mastery-demo h2, .mastery-demo p');
    if (mastery) parts.push(mastery.textContent.trim());

    return parts.filter(Boolean).join(' ') || "Let's learn something new!";
  },

  _getGameText() {
    // Feedback takes priority – read the result aloud
    const feedback = document.getElementById('feedback-area');
    if (feedback && !feedback.classList.contains('hidden')) {
      return feedback.textContent.trim();
    }

    const level = document.getElementById('game-level-label');
    const levelText = level ? level.textContent.trim() : '';

    const horiz = document.getElementById('problem-horizontal');
    const col   = document.getElementById('problem-column');
    let problemText = '';

    if (horiz && !horiz.classList.contains('hidden')) {
      const nums = horiz.querySelectorAll('.h-num');
      const op   = horiz.querySelector('.h-op');
      if (nums.length === 2 && op) {
        const opWord = op.textContent.trim() === '+' ? 'plus' : 'minus';
        problemText = `What is ${nums[0].textContent.trim()} ${opWord} ${nums[1].textContent.trim()}?`;
      }
    } else if (col && !col.classList.contains('hidden')) {
      const rows = col.querySelectorAll('.num-row');
      if (rows.length >= 2) {
        const getNum = row => {
          let s = '';
          row.querySelectorAll('.digit-box').forEach(d => {
            const t = d.textContent.trim();
            if (t && t !== '+' && t !== '-' && t !== '\u2212') s += t;
          });
          return s.replace(/\s/g, '');
        };
        const num1  = getNum(rows[0]);
        const opEl  = col.querySelector('.operation-sign');
        const opWord = opEl && opEl.textContent.trim() === '-' ? 'minus' : 'plus';
        const num2  = getNum(rows[1]);
        problemText = `What is ${num1} ${opWord} ${num2}?`;
      }
    }

    const parts = [];
    if (levelText) parts.push(levelText + '.');
    if (problemText) parts.push(problemText);
    return parts.join(' ') || 'Solve the math problem!';
  },

  _getLevelCompleteText() {
    const content = document.getElementById('level-complete-content');
    if (!content) return 'Level complete!';
    const h2  = content.querySelector('h2');
    const msg = content.querySelector('.level-complete-msg');
    const parts = [];
    if (h2)  parts.push(h2.textContent.trim());
    if (msg) parts.push(msg.textContent.trim());
    return parts.join('. ') || 'Level complete!';
  },

  _getVictoryText() {
    const content = document.getElementById('victory-content');
    if (!content) return 'You did it, Sarah-Beth! You completed all 20 levels!';
    const h1  = content.querySelector('h1');
    const msg = content.querySelector('.victory-msg');
    const parts = [];
    if (h1)  parts.push(h1.textContent.trim());
    if (msg) parts.push(msg.textContent.trim());
    return parts.join('. ') || 'You did it! You completed all levels!';
  },

  _getMapText() {
    const state = typeof App !== 'undefined' ? App.state : null;
    if (state) {
      return `Your adventure map. You are on level ${state.currentLevel}. ` +
             `Your highest level is ${state.highestLevel}. ` +
             `You have answered ${state.totalCorrect} problems correctly. Great job!`;
    }
    return 'Your adventure map showing all 20 levels.';
  },
};
