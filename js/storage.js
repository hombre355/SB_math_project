// storage.js - localStorage wrapper for Sarah-Beth's progress

const Storage = {
  KEY: 'sarahBethMathAdventure',

  defaultState: {
    currentLevel: 1,
    streak: 0,
    totalCorrect: 0,
    totalAttempted: 0,
    highestLevel: 1,
    levelStats: {},
    teachingSeen: [],
    settings: {
      sound: true,
      name: 'Sarah-Beth'
    }
  },

  load() {
    try {
      const data = localStorage.getItem(this.KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Merge with defaults to handle new fields added in updates
        return { ...this.defaultState, ...parsed, settings: { ...this.defaultState.settings, ...parsed.settings } };
      }
    } catch (e) {
      console.warn('Could not load progress:', e);
    }
    return { ...this.defaultState, levelStats: {} };
  },

  save(state) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save progress:', e);
    }
  },

  reset() {
    localStorage.removeItem(this.KEY);
    return { ...this.defaultState, levelStats: {} };
  },

  hasExistingProgress() {
    return localStorage.getItem(this.KEY) !== null;
  }
};
