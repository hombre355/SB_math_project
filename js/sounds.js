// sounds.js - Web Audio API sound effects (no external files needed)

const Sounds = {
  ctx: null,
  enabled: true,

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  setEnabled(on) {
    this.enabled = on;
  },

  _play(frequencies, durations, type, volume) {
    if (!this.enabled || !this.ctx) return;
    this.resume();

    let time = this.ctx.currentTime;
    frequencies.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(volume || 0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + durations[i]);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + durations[i]);
      time += durations[i] * 0.7;
    });
  },

  correct() {
    this._play([523, 659, 784], [0.12, 0.12, 0.25], 'sine', 0.25);
  },

  wrong() {
    this._play([300, 250], [0.2, 0.3], 'sine', 0.15);
  },

  levelUp() {
    this._play([523, 659, 784, 1047], [0.15, 0.15, 0.15, 0.4], 'sine', 0.3);
  },

  streak() {
    this._play([784, 988], [0.1, 0.2], 'triangle', 0.2);
  },

  tap() {
    this._play([600], [0.05], 'sine', 0.1);
  },

  fanfare() {
    this._play([523, 523, 523, 659, 784, 784, 1047], [0.15, 0.1, 0.15, 0.15, 0.1, 0.15, 0.5], 'triangle', 0.3);
  }
};
