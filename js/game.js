// game.js - Core game loop

const Game = {
  state: null,
  currentProblem: null,
  currentAnswer: '',
  isShowingFeedback: false,

  init(state) {
    this.state = state;
    this.currentAnswer = '';
    this.isShowingFeedback = false;
  },

  startLevel(levelId) {
    this.state.currentLevel = levelId;
    this.state.streak = 0;
    Storage.save(this.state);

    const config = getLevelConfig(levelId);

    // Check if teaching module needed
    if (config.teaching && !this.state.teachingSeen.includes(config.teaching)) {
      this.state.teachingSeen.push(config.teaching);
      Storage.save(this.state);
      Teaching.show(config.teaching, () => {
        this._showGameScreen(levelId);
      });
      return;
    }

    this._showGameScreen(levelId);
  },

  _showGameScreen(levelId) {
    UI.showScreen('game-screen');
    const config = getLevelConfig(levelId);
    const levelLabel = UI.$('#game-level-label');
    if (levelLabel) levelLabel.textContent = `Level ${levelId}: ${config.name}`;
    UI.updateStreak(this.state.streak);
    this.nextProblem();
  },

  nextProblem() {
    const config = getLevelConfig(this.state.currentLevel);
    this.currentProblem = Problems.generate(config);
    this.currentAnswer = '';
    this.isShowingFeedback = false;

    const maxDigits = Math.max(
      String(this.currentProblem.num1).length,
      String(this.currentProblem.num2).length
    );

    // Hide both displays, show the right one
    UI.hide('#problem-horizontal');
    UI.hide('#problem-column');
    UI.hide('#feedback-area');
    UI.show('#number-pad');

    if (this.currentProblem.display === 'column') {
      UI.show('#problem-column');
      UI.hide('#problem-horizontal');
      UI.renderColumnProblem(
        this.currentProblem.num1,
        this.currentProblem.num2,
        this.currentProblem.operation,
        maxDigits + 1 // extra space for carry
      );
    } else {
      UI.show('#problem-horizontal');
      UI.hide('#problem-column');
      UI.renderHorizontalProblem(
        this.currentProblem.num1,
        this.currentProblem.num2,
        this.currentProblem.operation
      );
    }

    UI.updateAnswerDisplay('', this.currentProblem.display);
  },

  inputDigit(digit) {
    if (this.isShowingFeedback) return;
    Sounds.tap();

    const maxLen = String(this.currentProblem.answer).length + 1;
    if (this.currentAnswer.length >= maxLen) return;

    this.currentAnswer += String(digit);
    UI.updateAnswerDisplay(this.currentAnswer, this.currentProblem.display);
  },

  backspace() {
    if (this.isShowingFeedback) return;
    this.currentAnswer = this.currentAnswer.slice(0, -1);
    UI.updateAnswerDisplay(this.currentAnswer, this.currentProblem.display);
  },

  submit() {
    if (this.isShowingFeedback || this.currentAnswer === '') return;

    const userAnswer = parseInt(this.currentAnswer, 10);
    const correct = userAnswer === this.currentProblem.answer;

    this.isShowingFeedback = true;

    // Update stats
    if (!this.state.levelStats[this.state.currentLevel]) {
      this.state.levelStats[this.state.currentLevel] = { correct: 0, attempted: 0, completed: false };
    }
    this.state.levelStats[this.state.currentLevel].attempted++;
    this.state.totalAttempted++;

    if (correct) {
      this.state.streak++;
      this.state.totalCorrect++;
      this.state.levelStats[this.state.currentLevel].correct++;
      Storage.save(this.state);

      Sounds.correct();
      UI.confetti();
      UI.updateStreak(this.state.streak);

      const name = this.state.settings.name;

      // Check for streak milestones
      const streakMsg = UI.getStreakMessage(this.state.streak, name);
      if (streakMsg) {
        Sounds.streak();
        UI.mascotSay(streakMsg, 'happy');
      } else {
        UI.mascotSay(UI.getCorrectMessage(name), 'happy');
      }

      // Check for level completion
      if (this.state.streak >= 10) {
        this._completeLevel();
        return;
      }

      this._showFeedback(true, null);

    } else {
      this.state.streak = 0;
      Storage.save(this.state);

      Sounds.wrong();
      UI.wiggle('#game-area');
      UI.updateStreak(0);
      UI.mascotSay(UI.getWrongMessage(this.state.settings.name), 'sad');
      this._showFeedback(false, this.currentProblem.answer);
    }
  },

  _showFeedback(correct, correctAnswer) {
    const feedback = UI.$('#feedback-area');
    if (!feedback) return;

    if (correct) {
      feedback.innerHTML = `<div class="feedback correct animate-pop">\u2714\uFE0F Correct!</div>`;
    } else {
      feedback.innerHTML = `
        <div class="feedback wrong animate-pop">
          <div>\u274C The answer was <strong>${correctAnswer}</strong></div>
          <div class="feedback-work">${this._showWork()}</div>
        </div>`;
    }
    UI.show(feedback);

    const delay = correct ? 1200 : 2500;
    setTimeout(() => {
      this.nextProblem();
    }, delay);
  },

  _showWork() {
    const p = this.currentProblem;
    if (p.operation === '+') {
      return `${p.num1} + ${p.num2} = ${p.answer}`;
    }
    return `${p.num1} - ${p.num2} = ${p.answer}`;
  },

  _completeLevel() {
    const currentLevel = this.state.currentLevel;
    this.state.levelStats[currentLevel].completed = true;

    Sounds.levelUp();
    UI.confetti();

    if (currentLevel >= 20) {
      // Game complete!
      this._showVictory();
      Storage.save(this.state);
      return;
    }

    const nextLevel = currentLevel + 1;
    if (nextLevel > this.state.highestLevel) {
      this.state.highestLevel = nextLevel;
    }
    Storage.save(this.state);

    UI.showScreen('level-complete-screen');
    const config = getLevelConfig(currentLevel);
    const nextConfig = getLevelConfig(nextLevel);
    const container = UI.$('#level-complete-content');
    if (container) {
      container.innerHTML = `
        <div class="level-complete animate-in">
          <div class="mascot mascot-celebrate">
            <div class="unicorn">
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
          <h2>Level ${currentLevel} Complete!</h2>
          <div class="star-burst">\u2B50\u2B50\u2B50</div>
          <p class="level-complete-msg">Amazing job, ${this.state.settings.name}!</p>
          <p>You mastered: <strong>${config.name}</strong></p>
          <p>Next up: <strong>${nextConfig.name}</strong></p>
          <div class="level-stats">
            <span>Problems solved: ${this.state.levelStats[currentLevel].attempted}</span>
            <span>Accuracy: ${Math.round((this.state.levelStats[currentLevel].correct / this.state.levelStats[currentLevel].attempted) * 100)}%</span>
          </div>
          <button class="btn btn-primary btn-large" onclick="Game.startLevel(${nextLevel})">
            Next Level \u27A1\uFE0F
          </button>
          <button class="btn btn-secondary" onclick="App.showMap()">
            View Progress Map
          </button>
        </div>
      `;
    }

    setTimeout(() => Sounds.fanfare(), 300);
  },

  _showVictory() {
    UI.showScreen('victory-screen');
    const container = UI.$('#victory-content');
    if (container) {
      container.innerHTML = `
        <div class="victory animate-in">
          <div class="trophy-big animate-pop">\uD83C\uDFC6</div>
          <h1>YOU DID IT, ${this.state.settings.name.toUpperCase()}!</h1>
          <div class="unicorn-big">
            <div class="unicorn">
              <div class="unicorn-horn big"></div>
              <div class="unicorn-head big">
                <div class="unicorn-eye left happy"></div>
                <div class="unicorn-eye right happy"></div>
                <div class="unicorn-mouth happy big"></div>
              </div>
              <div class="unicorn-mane big"></div>
              <div class="unicorn-body big"></div>
            </div>
          </div>
          <p class="victory-msg">You completed ALL 20 levels!</p>
          <p>You're a true Math Champion!</p>
          <div class="victory-stats">
            <div class="stat">Total correct: <strong>${this.state.totalCorrect}</strong></div>
            <div class="stat">Total attempted: <strong>${this.state.totalAttempted}</strong></div>
            <div class="stat">Accuracy: <strong>${Math.round((this.state.totalCorrect / this.state.totalAttempted) * 100)}%</strong></div>
          </div>
          <button class="btn btn-primary btn-large" onclick="App.showMap()">
            View All Levels
          </button>
        </div>
      `;
    }
    setTimeout(() => Sounds.fanfare(), 300);
  }
};
